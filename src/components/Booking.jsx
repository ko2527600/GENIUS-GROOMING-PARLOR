import { useState } from "react";
import { barbers, services, timeSlots, shop } from "../data/shopData";

const STEPS = ["Barber", "Service", "Time", "Confirm"];

export default function Booking() {
  const [step, setStep] = useState(0);
  const [barber, setBarber] = useState(null);
  const [service, setService] = useState(null);
  const [time, setTime] = useState(null);
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [done, setDone] = useState(false);

  const canNext =
    (step === 0 && barber) ||
    (step === 1 && service) ||
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
    return (
      <section className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="rounded-2xl border border-brand/40 bg-gray-50 p-8">
          <h2 className="text-2xl font-bold">You're Booked!</h2>
          <p className="mt-3 text-gray-600">
            {customer.name}, your <strong>{service?.name}</strong> with{" "}
            <strong>{barber?.name}</strong> is set for{" "}
            <strong>{time}</strong>.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            We'll confirm by phone at {customer.phone}. See you at{" "}
            {shop.address}!
          </p>
          <button
            onClick={() => {
              setDone(false);
              setStep(0);
              setBarber(null);
              setService(null);
              setTime(null);
              setCustomer({ name: "", phone: "" });
            }}
            className="mt-6 rounded-full bg-ink px-6 py-3 font-semibold text-white"
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => setService(s)}
                className={`rounded-xl border p-4 text-left transition ${
                  service?.id === s.id
                    ? "border-brand bg-brand/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-gray-500">
                  {s.duration} &middot; GH₵{s.price}
                </p>
              </button>
            ))}
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
                <span className="font-semibold">Barber:</span> {barber?.name}
              </p>
              <p>
                <span className="font-semibold">Service:</span>{" "}
                {service?.name} (GH₵{service?.price})
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
