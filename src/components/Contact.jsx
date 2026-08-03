import { shop } from "../data/shopData";

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-16 bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold">Visit Us</h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
              Location
            </p>
            <p className="mt-2 text-gray-700">{shop.address}</p>
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
              Phone
            </p>
            <a href={`tel:${shop.phone}`} className="mt-2 block text-gray-700">
              {shop.phone}
            </a>
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
              Hours
            </p>
            <ul className="mt-2 space-y-1 text-gray-700">
              {shop.hours.map((h) => (
                <li key={h.day}>
                  <span className="font-medium">{h.day}:</span> {h.time}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={`tel:${shop.phone}`}
            className="rounded-full bg-red px-8 py-3 text-center font-semibold text-white hover:bg-red-dark"
          >
            Call Now
          </a>
          <a
            href={`https://wa.me/${shop.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-brand-dark px-8 py-3 text-center font-semibold text-brand-dark hover:bg-brand/10"
          >
            Message on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
