import { Link } from "react-router-dom";
import { services } from "../data/shopData";

export default function Services() {
  return (
    <section id="services" className="scroll-mt-16 bg-white px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold">Our Services</h2>
        <p className="mt-2 text-center text-gray-500">
          Quality cuts, fair prices, no rush.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.id}
              className="flex flex-col justify-between rounded-xl border border-gray-200 p-5 shadow-sm"
            >
              <div>
                <h3 className="font-semibold">{s.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{s.duration}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-bold text-brand-dark">
                  GH₵{s.price}
                </span>
                <Link
                  to="/booking"
                  className="text-sm font-semibold text-ink underline underline-offset-4"
                >
                  Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
