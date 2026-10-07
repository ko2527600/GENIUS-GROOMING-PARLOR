import { useState } from "react";
import { upload } from "@vercel/blob/client";
import {
  barbers,
  services,
  timeSlots,
  shop,
  payment,
  groupServicesByCategory,
} from "../data/shopData";
import PostBookingQuizPopup from "./PostBookingQuizPopup";

const serviceGroups = groupServicesByCategory(services);

const STEPS = ["Stylist", "Service", "Date & Time", "Payment", "Confirm"];

function serviceSummary(selectedServices, otherService) {
  const names = selectedServices.map((s) => s.name);
  if (otherService.trim()) names.push(otherService.trim());
  return names.join(", ");
}

function buildMessage({
  customer,
  barber,
  selectedServices,
  otherService,
  time,
  paymentRef,
  visitedBefore,
  previousStylist,
}) {
  const visitLine =
    visitedBefore === true
      ? `Returning customer${previousStylist.trim() ? ` - previously with ${previousStylist.trim()}` : ""}\n`
      : visitedBefore === false
        ? "First-time customer\n"
        : "";
  return (
    `New booking request - ${shop.name}\n` +
    `Name: ${customer.name}\n` +
    `Phone: ${customer.phone}\n` +
    visitLine +
    `Stylist: ${barber?.name}\n` +
    `Service: ${serviceSummary(selectedServices, otherService)}\n` +
    `Time: ${time}\n` +
    `Booking fee: ${payment.currency}${payment.amount} sent to ${payment.momoNumber} (${payment.momoName})\n` +
    `MoMo reference/sender name: ${paymentRef}`
  );
}

function whatsappLink(message) {
  return `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(message)}`;
}

function smsLink(message) {
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const separator = isIOS ? "&" : "?";
  return `sms:${shop.phone.replace(/\s/g, "")}${separator}body=${encodeURIComponent(message)}`;
}

export default function Booking() {
  const [step, setStep] = useState(0);
  const [barber, setBarber] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [otherService, setOtherService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState(timeSlots);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [paid, setPaid] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [done, setDone] = useState(false);
  const [showQuizPopup, setShowQuizPopup] = useState(false);
  const [inspirationPhoto, setInspirationPhoto] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [dashboardSaveFailed, setDashboardSaveFailed] = useState(false);
  const [visitedBefore, setVisitedBefore] = useState(null); // null | true | false
  const [previousStylist, setPreviousStylist] = useState("");

  function toggleService(s) {
    setSelectedServices((prev) =>
      prev.some((x) => x.id === s.id)
        ? prev.filter((x) => x.id !== s.id)
        : [...prev, s],
    );
  }

  // Fetch available slots when date or barber changes
  async function fetchAvailableSlots(selectedDate, selectedBarber) {
    if (!selectedDate || !selectedBarber) return;
    
    setLoadingSlots(true);
    try {
      const res = await fetch(
        `/api/availability?date=${selectedDate}&stylist=${encodeURIComponent(selectedBarber)}`
      );
      const data = await res.json();
      if (res.ok && data.ok) {
        setAvailableSlots(data.slots);
      }
    } catch (err) {
      console.error("Failed to fetch available slots:", err);
      setAvailableSlots(timeSlots); // Fallback to all slots
    } finally {
      setLoadingSlots(false);
    }
  }

  // Handle date selection
  function handleDateChange(selectedDate) {
    setDate(selectedDate);
    setTime(null); // Reset time when date changes
    fetchAvailableSlots(selectedDate, barber?.name);
  }

  // Handle photo upload - goes straight from the browser to Blob storage
  // (bypassing the API's request body limit), since phone camera photos
  // routinely exceed it once base64-encoded.
  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      alert('Image must be less than 15MB');
      return;
    }

    setUploadingPhoto(true);
    try {
      const blob = await upload(`inspiration/${Date.now()}-${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/upload-inspiration',
      });
      setInspirationPhoto(blob.url);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  }

  function resetForm() {
    setDone(false);
    setShowQuizPopup(false);
    setStep(0);
    setBarber(null);
    setSelectedServices([]);
    setOtherService("");
    setDate("");
    setTime(null);
    setAvailableSlots(timeSlots);
    setPaid(false);
    setPaymentRef("");
    setCustomer({ name: "", phone: "" });
    setInspirationPhoto(null);
    setVisitedBefore(null);
    setPreviousStylist("");
  }

  const canNext =
    (step === 0 && barber) ||
    (step === 1 && (selectedServices.length > 0 || otherService.trim())) ||
    (step === 2 && date && time) ||
    (step === 3 && paid && paymentRef.trim()) ||
    step === 4;

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1);
  }
  function back() {
    if (step > 0) setStep(step - 1);
  }

  function submit(e) {
    e.preventDefault();
    if (!customer.name || !customer.phone) return;
    setDone(true);

    // Best-effort save to the admin dashboard - the WhatsApp/SMS flow
    // below doesn't depend on this succeeding, but a failure here should
    // still be visible (console + dashboard-save state) instead of silent.
    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: customer.name,
        phone: customer.phone,
        stylist: barber?.name,
        services: serviceSummary(selectedServices, otherService),
        time,
        date,
        payment: `${payment.currency}${payment.amount} sent to ${payment.momoNumber} (ref: ${paymentRef})`,
        inspirationPhoto,
        visitedBefore,
        previousStylist,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          console.error("Dashboard save failed:", res.status, body);
          setDashboardSaveFailed(true);
        }
      })
      .catch((err) => {
        console.error("Dashboard save failed:", err);
        setDashboardSaveFailed(true);
      });
  }

  if (done) {
    const message = buildMessage({
      customer,
      barber,
      selectedServices,
      otherService,
      time,
      paymentRef,
      visitedBefore,
      previousStylist,
    });

    return (
      <section className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="rounded-2xl border border-brand/40 bg-gray-50 p-8">
          <h2 className="text-2xl font-bold">Almost Done!</h2>
          <p className="mt-3 text-gray-600">
            {customer.name}, your{" "}
            <strong>{serviceSummary(selectedServices, otherService)}</strong> with{" "}
            <strong>{barber?.name}</strong> is set for{" "}
            <strong>{time}</strong>.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Tap below to send your booking details straight to{" "}
            {shop.name} — one tap and it's sent.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Make sure your {payment.currency}
            {payment.amount} booking fee was sent to {payment.momoNumber} — we'll
            confirm your slot once it's received.
          </p>

          {dashboardSaveFailed && (
            <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
              Please still tap Send below — it's the message that reaches us.
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <a
              href={whatsappLink(message)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowQuizPopup(true)}
              className="rounded-full bg-[#25D366] py-3 font-semibold text-white hover:opacity-90"
            >
              Send via WhatsApp
            </a>
            <a
              href={smsLink(message)}
              onClick={() => setShowQuizPopup(true)}
              className="rounded-full border border-gray-300 py-3 font-semibold text-ink hover:bg-gray-100"
            >
              Send via SMS
            </a>
          </div>

          <button
            onClick={resetForm}
            className="mt-6 text-sm font-semibold text-gray-500 underline underline-offset-4"
          >
            Book Another
          </button>
        </div>

        {showQuizPopup && (
          <PostBookingQuizPopup onClose={() => setShowQuizPopup(false)} />
        )}
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-center text-3xl font-bold">Book Your Appointment</h1>

      {/* Step indicator */}
      <ol className="mt-8 flex justify-between text-xs">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col items-center gap-1">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full font-semibold ${
                i <= step ? "bg-brand text-ink" : "bg-gray-200 text-gray-500"
              }`}
            >
              {i + 1}
            </span>
            <span className={i === step ? "font-semibold" : "text-gray-400"}>
              {label}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-8">
        {step === 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {barbers.map((b) => (
              <button
                key={b.id}
                onClick={() => setBarber(b)}
                className={`rounded-xl border p-4 text-left font-medium transition ${
                  barber?.id === b.id
                    ? "border-brand bg-brand/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="mb-3 text-sm text-gray-500">
              Select as many as you need — combine haircut, nails, and more in one booking.
            </p>
            <div className="space-y-5">
              {serviceGroups.map((group) => (
                <div key={group.category}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {group.category}
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {group.items.map((s) => {
                      const checked = selectedServices.some((x) => x.id === s.id);
                      return (
                        <button
                          key={s.id}
                          onClick={() => toggleService(s)}
                          aria-pressed={checked}
                          className={`flex items-center justify-between rounded-xl border p-4 text-left font-medium transition ${
                            checked
                              ? "border-brand bg-brand/10"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {s.name}
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                              checked ? "border-brand bg-brand text-ink" : "border-gray-300"
                            }`}
                          >
                            {checked && "✓"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">
                Don't see what you want? Type it here
              </label>
              <input
                value={otherService}
                onChange={(e) => setOtherService(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-brand focus:outline-none"
                placeholder="e.g. Wig install, kids braids..."
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium">Select Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-brand focus:outline-none"
              />
            </div>

            {date && (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Select Time
                  {loadingSlots && <span className="ml-2 text-xs text-gray-500">(checking availability...)</span>}
                </label>
                {availableSlots.length === 0 ? (
                  <p className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-center text-sm text-yellow-800">
                    All slots are booked for this date. Please choose another date.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {timeSlots.map((t) => {
                      const isAvailable = availableSlots.includes(t);
                      return (
                        <button
                          key={t}
                          onClick={() => isAvailable && setTime(t)}
                          disabled={!isAvailable}
                          className={`rounded-xl border p-3 text-center font-medium transition ${
                            time === t
                              ? "border-brand bg-brand/10"
                              : isAvailable
                                ? "border-gray-200 hover:border-gray-300"
                                : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed line-through"
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Inspiration Photo (Optional)
              </label>
              <p className="mb-2 text-xs text-gray-500">
                Upload a photo of the style you want - helps your stylist prepare!
              </p>
              {inspirationPhoto ? (
                <div className="relative inline-block">
                  <img
                    src={inspirationPhoto}
                    alt="Inspiration"
                    className="h-32 w-32 rounded-lg object-cover"
                  />
                  <button
                    onClick={() => setInspirationPhoto(null)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red text-xs text-white"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition hover:border-brand">
                  <span className="text-4xl">📷</span>
                  <span className="mt-2 text-sm font-medium text-gray-600">
                    {uploadingPhoto ? "Uploading..." : "Click to upload photo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-brand/40 bg-brand/5 p-5 text-center">
              <p className="text-sm text-gray-600">Booking fee (required to confirm)</p>
              <p className="mt-1 text-3xl font-bold">
                {payment.currency}
                {payment.amount}
              </p>
              <p className="mt-4 text-sm text-gray-600">
                Send via MTN Mobile Money to
              </p>
              <p className="mt-1 text-xl font-bold tracking-wide">
                {payment.momoNumber}
              </p>
              <p className="text-sm text-gray-500">
                Recipient name: {payment.momoName}
              </p>
              <a
                href={`tel:${payment.momoNumber}`}
                className="mt-3 inline-block text-sm font-semibold text-brand-dark underline underline-offset-4"
              >
                Tap to call/save this number
              </a>
            </div>

            <div>
              <label className="text-sm font-medium">
                MoMo reference code or the name you sent it under
              </label>
              <input
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-brand focus:outline-none"
                placeholder="e.g. MP240922.1234 or Kofi Mensah"
              />
              <p className="mt-1 text-xs text-gray-500">
                So we can match your payment to your booking.
              </p>
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-gray-200 p-4">
              <input
                type="checkbox"
                checked={paid}
                onChange={(e) => setPaid(e.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 accent-brand"
              />
              <span className="text-sm font-medium">
                I have sent the {payment.currency}
                {payment.amount} booking fee to {payment.momoNumber}
              </span>
            </label>

            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-600">
                Then call us to confirm you've sent it and that you're on your way:
              </p>
              <a
                href={`tel:${shop.phone.replace(/\s/g, "")}`}
                className="mt-2 inline-block text-lg font-bold text-brand-dark"
              >
                {shop.phone}
              </a>
            </div>
          </div>
        )}

        {step === 4 && (
          <form onSubmit={submit} className="space-y-4">
            <div className="rounded-xl bg-gray-50 p-4 text-sm">
              <p>
                <span className="font-semibold">Stylist:</span> {barber?.name}
              </p>
              <p>
                <span className="font-semibold">Service:</span>{" "}
                {serviceSummary(selectedServices, otherService)}
              </p>
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(date).toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p>
                <span className="font-semibold">Time:</span> {time}
              </p>
              <p>
                <span className="font-semibold">Booking fee:</span>{" "}
                {payment.currency}
                {payment.amount} sent to {payment.momoNumber}
              </p>
              <p>
                <span className="font-semibold">Reference:</span> {paymentRef}
              </p>
              {inspirationPhoto && (
                <div className="mt-3">
                  <span className="font-semibold">Inspiration Photo:</span>
                  <img
                    src={inspirationPhoto}
                    alt="Inspiration"
                    className="mt-2 h-24 w-24 rounded-lg object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Have you visited us before?</label>
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setVisitedBefore(true)}
                  className={`flex-1 rounded-full border py-2 text-sm font-semibold transition ${
                    visitedBefore === true
                      ? "border-brand bg-brand/10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVisitedBefore(false);
                    setPreviousStylist("");
                  }}
                  className={`flex-1 rounded-full border py-2 text-sm font-semibold transition ${
                    visitedBefore === false
                      ? "border-brand bg-brand/10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  No
                </button>
              </div>
              {visitedBefore === true && (
                <div className="mt-3">
                  <label className="text-sm font-medium">
                    Which stylist attended to you? (if you remember)
                  </label>
                  <input
                    value={previousStylist}
                    onChange={(e) => setPreviousStylist(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-brand focus:outline-none"
                    placeholder="e.g. Stylist One, or their name"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Your Name</label>
              <input
                required
                value={customer.name}
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-brand focus:outline-none"
                placeholder="Kofi Mensah"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <input
                required
                type="tel"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({ ...customer, phone: e.target.value })
                }
                pattern="^(0[2-5]\d{8}|\+?233[2-5]\d{8})$"
                title="Please enter a valid Ghana phone number (e.g., 024 123 4567)"
                className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-brand focus:outline-none"
                placeholder="024 000 0000"
              />
              <p className="mt-1 text-xs text-gray-500">
                Ghana format: 024/054/055/059 + 7 digits
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-red py-3 font-semibold text-white hover:bg-red-dark"
            >
              Confirm Booking
            </button>
          </form>
        )}
      </div>

      {step < 4 && (
        <div className="mt-8 flex justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            className="rounded-full px-6 py-3 font-semibold text-gray-500 disabled:opacity-0"
          >
            Back
          </button>
          <button
            onClick={next}
            disabled={!canNext}
            className="rounded-full bg-ink px-8 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
