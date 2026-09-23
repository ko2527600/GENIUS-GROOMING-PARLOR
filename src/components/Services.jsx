import { useState } from "react";
import { Link } from "react-router-dom";
import { services, groupServicesByCategory } from "../data/shopData";
import LazyVideo from "./LazyVideo";
import Lightbox from "./Lightbox";
import braidingGallery from "../assets/gallery/gallery-21.jpg";
import braidingGallery2 from "../assets/gallery/gallery-22.jpg";
import braidingGallery3 from "../assets/gallery/gallery-23.jpg";
import braidingGallery4 from "../assets/gallery/gallery-24.jpg";
import braidingGallery5 from "../assets/gallery/gallery-25.jpg";
import braidingGallery6 from "../assets/gallery/gallery-26.jpg";
import braidingGallery7 from "../assets/gallery/gallery-27.jpg";
import braiding1Mp4 from "../assets/video/braiding-1.mp4";
import braiding1Poster from "../assets/video/braiding-1-poster.jpg";
import braiding2Mp4 from "../assets/video/braiding-2.mp4";
import braiding2Poster from "../assets/video/braiding-2-poster.jpg";
import braiding3Mp4 from "../assets/video/braiding-3.mp4";
import braiding3Poster from "../assets/video/braiding-3-poster.jpg";
import braiding4Mp4 from "../assets/video/braiding-4.mp4";
import braiding4Poster from "../assets/video/braiding-4-poster.jpg";
import braiding5Mp4 from "../assets/video/braiding-5.mp4";
import braiding5Poster from "../assets/video/braiding-5-poster.jpg";
import braiding6Mp4 from "../assets/video/braiding-6.mp4";
import braiding6Poster from "../assets/video/braiding-6-poster.jpg";
import haircut1Mp4 from "../assets/video/haircut-1.mp4";
import haircut1Poster from "../assets/video/haircut-1-poster.jpg";
import haircut2Mp4 from "../assets/video/haircut-2.mp4";
import haircut2Poster from "../assets/video/haircut-2-poster.jpg";
import braiding7Mp4 from "../assets/video/braiding-7.mp4";
import braiding7Poster from "../assets/video/braiding-7-poster.jpg";
import braiding8Mp4 from "../assets/video/braiding-8.mp4";
import braiding8Poster from "../assets/video/braiding-8-poster.jpg";
import braiding9Mp4 from "../assets/video/braiding-9.mp4";
import braiding9Poster from "../assets/video/braiding-9-poster.jpg";
import braiding10Mp4 from "../assets/video/braiding-10.mp4";
import braiding10Poster from "../assets/video/braiding-10-poster.jpg";
import braiding11Mp4 from "../assets/video/braiding-11.mp4";
import braiding11Poster from "../assets/video/braiding-11-poster.jpg";
import braiding12Mp4 from "../assets/video/braiding-12.mp4";
import braiding12Poster from "../assets/video/braiding-12-poster.jpg";
import nailsGallery1 from "../assets/gallery/gallery-28.jpg";
import nailsGallery2 from "../assets/gallery/gallery-29.jpg";
import nailsGallery3 from "../assets/gallery/gallery-30.jpg";
import nailsGallery4 from "../assets/gallery/gallery-31.jpg";
import nailsGallery5 from "../assets/gallery/gallery-32.jpg";
import nailsGallery6 from "../assets/gallery/gallery-33.jpg";
import nailsGallery7 from "../assets/gallery/gallery-34.jpg";
import nailsGallery8 from "../assets/gallery/gallery-35.jpg";
import nailsGallery9 from "../assets/gallery/gallery-36.jpg";
import nailsGallery10 from "../assets/gallery/gallery-37.jpg";
import nailsGallery11 from "../assets/gallery/gallery-38.jpg";
import nailsGallery12 from "../assets/gallery/gallery-39.jpg";
import nailsGallery13 from "../assets/gallery/gallery-40.jpg";
import nailsGallery14 from "../assets/gallery/gallery-41.jpg";
import nailsGallery15 from "../assets/gallery/gallery-42.jpg";
import nailsGallery16 from "../assets/gallery/gallery-43.jpg";
import nailsGallery17 from "../assets/gallery/gallery-44.jpg";
import nailsGallery18 from "../assets/gallery/gallery-45.jpg";
import nailsGallery19 from "../assets/gallery/gallery-46.jpg";
import nailsGallery20 from "../assets/gallery/gallery-47.jpg";
import nails1Mp4 from "../assets/video/nails-1.mp4";
import nails1Poster from "../assets/video/nails-1-poster.jpg";
import nails2Mp4 from "../assets/video/nails-2.mp4";
import nails2Poster from "../assets/video/nails-2-poster.jpg";
import nails3Mp4 from "../assets/video/nails-3.mp4";
import nails3Poster from "../assets/video/nails-3-poster.jpg";
import nails4Mp4 from "../assets/video/nails-4.mp4";
import nails4Poster from "../assets/video/nails-4-poster.jpg";
import nails5Mp4 from "../assets/video/nails-5.mp4";
import nails5Poster from "../assets/video/nails-5-poster.jpg";
import nails6Mp4 from "../assets/video/nails-6.mp4";
import nails6Poster from "../assets/video/nails-6-poster.jpg";
import nails7Mp4 from "../assets/video/nails-7.mp4";
import nails7Poster from "../assets/video/nails-7-poster.jpg";
import nails8Mp4 from "../assets/video/nails-8.mp4";
import nails8Poster from "../assets/video/nails-8-poster.jpg";
import nails9Mp4 from "../assets/video/nails-9.mp4";
import nails9Poster from "../assets/video/nails-9-poster.jpg";
import nails10Mp4 from "../assets/video/nails-10.mp4";
import nails10Poster from "../assets/video/nails-10-poster.jpg";

const serviceGroups = groupServicesByCategory(services);
const TABS = ["All", ...serviceGroups.map((g) => g.category)];

// Photos/videos for each service, by id (see shopData.js). Add more
// here as photos/videos come in for other services — anything left
// out just shows a "coming soon" placeholder when expanded.
const serviceMedia = {
  haircut: [
    { type: "video", mp4: haircut1Mp4, poster: haircut1Poster },
    { type: "video", mp4: haircut2Mp4, poster: haircut2Poster },
  ],
  braiding: [
    { type: "video", mp4: braiding1Mp4, poster: braiding1Poster },
    { type: "video", mp4: braiding2Mp4, poster: braiding2Poster },
    { type: "video", mp4: braiding3Mp4, poster: braiding3Poster },
    { type: "video", mp4: braiding4Mp4, poster: braiding4Poster },
    { type: "video", mp4: braiding5Mp4, poster: braiding5Poster },
    { type: "video", mp4: braiding6Mp4, poster: braiding6Poster },
    { type: "video", mp4: braiding7Mp4, poster: braiding7Poster },
    { type: "video", mp4: braiding8Mp4, poster: braiding8Poster },
    { type: "video", mp4: braiding9Mp4, poster: braiding9Poster },
    { type: "video", mp4: braiding10Mp4, poster: braiding10Poster },
    { type: "video", mp4: braiding11Mp4, poster: braiding11Poster },
    { type: "video", mp4: braiding12Mp4, poster: braiding12Poster },
    { type: "photo", src: braidingGallery },
    { type: "photo", src: braidingGallery2 },
    { type: "photo", src: braidingGallery3 },
    { type: "photo", src: braidingGallery4 },
    { type: "photo", src: braidingGallery5 },
    { type: "photo", src: braidingGallery6 },
    { type: "photo", src: braidingGallery7 },
  ],
  "nails-artistry": [
    { type: "video", mp4: nails1Mp4, poster: nails1Poster },
    { type: "video", mp4: nails2Mp4, poster: nails2Poster },
    { type: "video", mp4: nails3Mp4, poster: nails3Poster },
    { type: "video", mp4: nails4Mp4, poster: nails4Poster },
    { type: "video", mp4: nails5Mp4, poster: nails5Poster },
    { type: "video", mp4: nails6Mp4, poster: nails6Poster },
    { type: "video", mp4: nails7Mp4, poster: nails7Poster },
    { type: "video", mp4: nails8Mp4, poster: nails8Poster },
    { type: "video", mp4: nails9Mp4, poster: nails9Poster },
    { type: "video", mp4: nails10Mp4, poster: nails10Poster },
    { type: "photo", src: nailsGallery1 },
    { type: "photo", src: nailsGallery2 },
    { type: "photo", src: nailsGallery3 },
    { type: "photo", src: nailsGallery4 },
    { type: "photo", src: nailsGallery5 },
    { type: "photo", src: nailsGallery6 },
    { type: "photo", src: nailsGallery7 },
    { type: "photo", src: nailsGallery8 },
    { type: "photo", src: nailsGallery9 },
    { type: "photo", src: nailsGallery10 },
    { type: "photo", src: nailsGallery11 },
    { type: "photo", src: nailsGallery12 },
    { type: "photo", src: nailsGallery13 },
    { type: "photo", src: nailsGallery14 },
    { type: "photo", src: nailsGallery15 },
    { type: "photo", src: nailsGallery16 },
    { type: "photo", src: nailsGallery17 },
    { type: "photo", src: nailsGallery18 },
    { type: "photo", src: nailsGallery19 },
    { type: "photo", src: nailsGallery20 },
  ],
};

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

  const openPhotos = (serviceMedia[openId] ?? []).filter((item) => item.type === "photo");
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
                            items={serviceMedia[s.id]}
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
