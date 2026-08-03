import { useState } from "react";
import {
  barbers,
  services,
  timeSlots,
  shop,
  groupServicesByCategory,
} from "../data/shopData";

const serviceGroups = groupServicesByCategory(services);

const STEPS = ["Stylist", "Service", "Time", "Confirm"];

function serviceSummary(selectedServices, otherService) {
  const names = selectedServices.map((s) => s.name);
  if (otherService.trim()) names.push(otherService.trim());
  return names.join(", ");
}

function buildMessage({ customer, barber, selectedServices, otherService, time }) {
  return (
    `New booking request - ${shop.name}\n` +
    `Name: ${customer.name}\n` +
    `Phone: ${customer.phone}\n` +
    `Stylist: ${barber?.name}\n` +
    `Service: ${serviceSummary(selectedServices, otherService)}\n` +
    `Time: ${time}`
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
  const [time, setTime] = useState(null);
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [done, setDone] = useState(false);

  function toggleService(s) {
    setSelectedServices((prev) =>
      prev.some((x) => x.id === s.id)
        ? prev.filter((x) => x.id !== s.id)
        : [...prev, s],
    );
  }

  function resetForm() {
    setDone(false);
    setStep(0);
    setBarber(null);
    setSelectedServices([]);
    setOtherService("");
    setTime(null);
    setCustomer({ name: "", phone: "" });
  }

  const canNext =
    (step === 0 && barber) ||
    (step === 1 && (selectedServices.length > 0 || otherService.trim())) ||
    (step === 2 && time) ||
    step === 3;

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
  }

  if (done) {
    const message = buildMessage({ customer, barber, selectedServices, otherService, time });

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

          <div className="mt-6 flex flex-col gap-3">
            <a
              href={whatsappLink(message)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25D366] py-3 font-semibold text-white hover:opacity-90"
            >
              Send via WhatsApp
            </a>
            <a
              href={smsLink(message)}
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {timeSlots.map((t) => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={`rounded-xl border p-3 text-center font-medium transition ${
                  time === t
                    ? "border-brand bg-brand/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
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
                <span className="font-semibold">Time:</span> {time}
              </p>
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
                className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-brand focus:outline-none"
                placeholder="024 000 0000"
              />
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

      {step < 3 && (
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
