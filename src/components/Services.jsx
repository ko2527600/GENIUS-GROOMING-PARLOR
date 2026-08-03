import { Link } from "react-router-dom";
import { services, groupServicesByCategory } from "../data/shopData";

const serviceGroups = groupServicesByCategory(services);

export default function Services() {
  return (
    <section id="services" className="scroll-mt-16 bg-white px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold">Our Services</h2>
        <p className="mt-2 text-center text-gray-500">
          Day and night services available.
        </p>

        <div className="mt-10 space-y-8">
          {serviceGroups.map((group) => (
            <div key={group.category}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-dark">
                {group.category}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {group.items.map((s) => (
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
