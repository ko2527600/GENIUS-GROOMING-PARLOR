import { shop } from "../data/shopData";
import BackgroundSlideshow from "./BackgroundSlideshow";
import gallery2 from "../assets/gallery/gallery-2.jpg";
import gallery3 from "../assets/gallery/gallery-3.jpg";
import gallery4 from "../assets/gallery/gallery-4.jpg";
import gallery5 from "../assets/gallery/gallery-5.jpg";
import gallery7 from "../assets/gallery/gallery-7.jpg";

const bgImages = [gallery2, gallery3, gallery4, gallery5, gallery7];

export default function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-16 overflow-hidden px-4 py-16 text-white">
      <BackgroundSlideshow images={bgImages} />
      <div className="absolute inset-0 bg-ink/80" />

      <div className="relative mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold">Visit Us</h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">
              Location
            </p>
            <p className="mt-2 text-gray-200">{shop.address}</p>
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">
              Phone
            </p>
            <a href={`tel:${shop.phone}`} className="mt-2 block text-gray-200">
              {shop.phone}
            </a>
            <a href={`tel:${shop.phone2}`} className="block text-gray-200">
              {shop.phone2}
            </a>
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">
              Hours
            </p>
            <ul className="mt-2 space-y-1 text-gray-200">
              {shop.hours.map((h) => (
                <li key={h.day}>
                  <span className="font-medium">{h.day}:</span> {h.time}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:items-start">
          <a
            href={`tel:${shop.phone}`}
            className="w-full max-w-xs rounded-full bg-red px-8 py-3 text-center font-semibold text-white hover:bg-red-dark sm:w-auto"
          >
            Call Now
          </a>
          <div className="flex w-full max-w-xs flex-col items-center gap-1 sm:w-auto">
            <a
              href={`https://wa.me/${shop.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full border border-white/30 px-8 py-3 text-center font-semibold text-white hover:bg-white/10"
            >
              Message on WhatsApp
            </a>
            <a
              href={`tel:${shop.phone}`}
              className="text-sm text-gray-300 underline underline-offset-4 hover:text-white"
            >
              or tap to call {shop.phone}
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-300">
          Follow us on TikTok{" "}
          <a
            href={shop.social.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white underline underline-offset-4"
          >
            @geniusgroomingparlour
          </a>{" "}
          for more styles.
        </p>
      </div>
    </section>
  );
}
