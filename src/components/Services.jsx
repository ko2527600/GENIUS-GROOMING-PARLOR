import { Link } from "react-router-dom";
import { services } from "../data/shopData";

export default function Services() {
  return (
    <section id="services" className="scroll-mt-16 bg-white px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold">Our Services</h2>
        <p className="mt-2 text-center text-gray-500">
          Day and night services available.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 p-5 shadow-sm"
            >
              <h3 className="font-semibold">{s.name}</h3>
              <Link
                to="/booking"
                className="text-sm font-semibold text-ink underline underline-offset-4"
              >
                Book
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Not sure what you need?{" "}
          <Link to="/booking" className="font-semibold text-brand-dark underline underline-offset-4">
            Book now
          </Link>{" "}
          and we'll confirm pricing with you directly.
        </p>
      </div>
    </section>
  );
}
