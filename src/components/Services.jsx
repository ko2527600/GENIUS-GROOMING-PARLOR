import { useState } from "react";
import { Link } from "react-router-dom";
import { services, groupServicesByCategory } from "../data/shopData";
import { serviceMedia } from "../data/mediaLibrary";
import LazyVideo from "./LazyVideo";
import Lightbox from "./Lightbox";
import useMedia from "../hooks/useMedia";
import useSiteConfig from "../hooks/useSiteConfig";

const serviceGroups = groupServicesByCategory(services);
const TABS = ["All", ...serviceGroups.map((g) => g.category)];

function ServiceMedia({ items, onPhotoClick }) {
  if (!items || items.length === 0) {
    return (
      <p className="p-4 text-sm text-gray-500">
        Photos coming soon for this service.
      </p>
    );
  }

  let photoIndex = -1;

  return (
    <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
      {items.map((item, i) => {
        if (item.type === "video") {
          return (
            <LazyVideo
              key={i}
              mp4={item.mp4}
              poster={item.poster}
              className="aspect-square w-full overflow-hidden rounded-lg shadow-sm"
            />
          );
        }
        photoIndex += 1;
        const thisPhotoIndex = photoIndex;
        return (
          <button
            key={i}
            onClick={() => onPhotoClick(thisPhotoIndex)}
            aria-label="View photo"
            className="aspect-square w-full overflow-hidden rounded-lg shadow-sm"
          >
            <img
              src={item.src}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition hover:scale-105"
            />
          </button>
        );
      })}
    </div>
  );
}

export default function Services() {
  const [openId, setOpenId] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const media = useMedia();
  const { hiddenStaticIds } = useSiteConfig();

  function mediaFor(serviceId) {
    if (!serviceId) return [];
    const builtIn = (serviceMedia[serviceId] ?? []).filter(
      (item) => !hiddenStaticIds.includes(item.id),
    );
    const uploaded = media
      .filter((m) => m.serviceId === serviceId)
      .map((m) =>
        m.type === "video"
          ? { type: "video", mp4: m.url }
          : { type: "photo", src: m.url },
      );
    return [...builtIn, ...uploaded];
  }

  const openPhotos = mediaFor(openId).filter((item) => item.type === "photo");
  const lightboxImages = openPhotos.map((p) => p.src);

  function navigateLightbox(delta) {
    setLightboxIndex(
      (i) => (i + delta + lightboxImages.length) % lightboxImages.length,
    );
  }

  const visibleGroups =
    activeTab === "All"
      ? serviceGroups
      : serviceGroups.filter((g) => g.category === activeTab);

  return (
    <section id="services" className="scroll-mt-16 bg-white px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold">Our Services</h2>
        <p className="mt-2 text-center text-gray-500">
          Day and night services available. Tap a service to see photos and videos.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-red text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-8">
          {visibleGroups.map((group) => (
            <div key={group.category}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-dark">
                {group.category}
              </p>
              <div className="space-y-3">
                {group.items.map((s) => {
                  const open = openId === s.id;
                  return (
                    <div
                      key={s.id}
                      className="overflow-hidden rounded-xl border border-gray-200 shadow-sm"
                    >
                      <button
                        onClick={() => {
                          setOpenId(open ? null : s.id);
                          setLightboxIndex(null);
                        }}
                        aria-expanded={open}
                        className="flex w-full items-center justify-between gap-3 p-5 text-left"
                      >
                        <h3 className="font-semibold">{s.name}</h3>
                        <div className="flex shrink-0 items-center gap-3">
                          <Link
                            to="/booking"
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm font-semibold text-ink underline underline-offset-4"
                          >
                            Book
                          </Link>
                          <span
                            aria-hidden="true"
                            className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
                          >
                            ▾
                          </span>
                        </div>
                      </button>
                      {open && (
                        <div className="border-t border-gray-100">
                          <ServiceMedia
                            items={mediaFor(s.id)}
                            onPhotoClick={setLightboxIndex}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
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

      <Lightbox
        images={lightboxImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={navigateLightbox}
      />
    </section>
  );
}
