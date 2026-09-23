import { useState } from "react";
import { Link } from "react-router-dom";
import { services, groupServicesByCategory } from "../data/shopData";
import LazyVideo from "./LazyVideo";
import braidingGallery from "../assets/gallery/gallery-21.jpg";
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

const serviceGroups = groupServicesByCategory(services);

// Photos/videos for each service, by id (see shopData.js). Add more
// here as photos/videos come in for other services — anything left
// out just shows a "coming soon" placeholder when expanded.
const serviceMedia = {
  braiding: [
    { type: "video", mp4: braiding1Mp4, poster: braiding1Poster },
    { type: "video", mp4: braiding2Mp4, poster: braiding2Poster },
    { type: "video", mp4: braiding3Mp4, poster: braiding3Poster },
    { type: "video", mp4: braiding4Mp4, poster: braiding4Poster },
    { type: "video", mp4: braiding5Mp4, poster: braiding5Poster },
    { type: "video", mp4: braiding6Mp4, poster: braiding6Poster },
    { type: "photo", src: braidingGallery },
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
