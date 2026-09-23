import { useState } from "react";
import { Link } from "react-router-dom";
import { shop, services, groupServicesByCategory } from "../data/shopData";
import haircutPhoto from "../assets/video/haircut-1-poster.jpg";
import braidingPhoto from "../assets/gallery/gallery-21.jpg";
import nailsPhoto from "../assets/gallery/gallery-28.jpg";

const serviceGroups = groupServicesByCategory(services);

// Representative real photo per service, where we have one. Services
// left out just show the recommendation without a photo (same
// "coming soon" idea as the Services accordion).
const resultPhotos = {
  haircut: haircutPhoto,
  braiding: braidingPhoto,
  "nails-artistry": nailsPhoto,
};

export default function StyleQuiz() {
  const [category, setCategory] = useState(null);
  const [service, setService] = useState(null);

  function reset() {
    setCategory(null);
    setService(null);
  }

  function selectService(s) {
    setService(s);
    fetch("/api/quiz-answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category,
        serviceId: s.id,
        serviceName: s.name,
      }),
    }).catch(() => {
      // Best effort — a failed save shouldn't block the visitor's result.
    });
  }

  const step = service ? "result" : category ? "service" : "category";
  const servicesInCategory =
    serviceGroups.find((g) => g.category === category)?.items ?? [];

  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-xl">
        <h2 className="text-center text-3xl font-bold">Find Your Style</h2>
        <p className="mt-2 text-center text-gray-500">
          Not sure what to book? Answer two quick questions.
        </p>

        <div className="mt-8 rounded-2xl border border-gray-200 p-6 shadow-sm">
          {step === "category" && (
            <>
              <p className="mb-4 text-center font-semibold">
                What are you looking to get done?
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {serviceGroups.map((g) => (
                  <button
                    key={g.category}
                    onClick={() => setCategory(g.category)}
                    className="rounded-full bg-gray-100 px-6 py-3 font-semibold text-ink hover:bg-gray-200"
                  >
                    {g.category}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "service" && (
            <>
              <p className="mb-4 text-center font-semibold">
                Which {category.toLowerCase()} service?
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {servicesInCategory.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => selectService(s)}
                    className="rounded-full bg-gray-100 px-5 py-3 text-sm font-semibold text-ink hover:bg-gray-200"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              <button
                onClick={reset}
                className="mt-5 block w-full text-center text-sm text-gray-400 underline underline-offset-4"
              >
                Start over
              </button>
            </>
          )}

          {step === "result" && (
            <div className="text-center">
              {resultPhotos[service.id] && (
                <img
                  src={resultPhotos[service.id]}
                  alt={service.name}
                  className="mx-auto mb-4 h-48 w-48 rounded-xl object-cover shadow-sm"
                />
              )}
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-dark">
                Recommended for you
              </p>
              <h3 className="mt-1 text-2xl font-bold">{service.name}</h3>
              <p className="mt-2 text-gray-500">
                Great pick — our stylists at {shop.name} handle this every
                day. Book a slot and we'll confirm the details with you
                directly.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  to="/booking"
                  className="rounded-full bg-red px-8 py-3 text-center font-semibold text-white hover:bg-red-dark"
                >
                  Book Now
                </Link>
                <button
                  onClick={reset}
                  className="rounded-full border border-gray-300 px-8 py-3 font-semibold text-ink hover:bg-gray-50"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
