import { useState } from "react";
import { Link } from "react-router-dom";
import { services, groupServicesByCategory } from "../data/shopData";
import LazyVideo from "./LazyVideo";
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

const serviceGroups = groupServicesByCategory(services);

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
};

function ServiceMedia({ items }) {
  if (!items || items.length === 0) {
    return (
      <p className="p-4 text-sm text-gray-500">
        Photos coming soon for this service.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
      {items.map((item, i) =>
        item.type === "video" ? (
          <LazyVideo
            key={i}
            mp4={item.mp4}
            poster={item.poster}
            className="aspect-square w-full overflow-hidden rounded-lg shadow-sm"
          />
        ) : (
          <img
            key={i}
            src={item.src}
            alt=""
            loading="lazy"
            className="aspect-square w-full rounded-lg object-cover shadow-sm"
          />
        ),
      )}
    </div>
  );
}

export default function Services() {
  const [openId, setOpenId] = useState(null);

  return (
    <section id="services" className="scroll-mt-16 bg-white px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold">Our Services</h2>
        <p className="mt-2 text-center text-gray-500">
          Day and night services available. Tap a service to see photos and videos.
        </p>

        <div className="mt-10 space-y-8">
          {serviceGroups.map((group) => (
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
                        onClick={() => setOpenId(open ? null : s.id)}
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
                          <ServiceMedia items={serviceMedia[s.id]} />
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
    </section>
  );
}
