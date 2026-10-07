import { useState } from "react";
import LazyVideo from "./LazyVideo";
import Lightbox from "./Lightbox";
import useMedia from "../hooks/useMedia";
import useSiteConfig from "../hooks/useSiteConfig";
import { galleryPhotos, galleryVideos } from "../data/mediaLibrary";

const TABS = ["All", "Hair", "Nails", "Beauty"];
const PREVIEW_LIMIT = 8;

export default function Gallery() {
  const [activeTab, setActiveTab] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const media = useMedia();
  const { hiddenStaticIds, categoryOverrides } = useSiteConfig();

  function selectTab(tab) {
    setActiveTab(tab);
    setShowAll(false);
  }

  const visibleStaticPhotos = galleryPhotos
    .filter((p) => !hiddenStaticIds.includes(p.id))
    .map((p) => ({ ...p, category: categoryOverrides[p.id] || p.category }));
  const visibleStaticVideos = galleryVideos
    .filter((v) => !hiddenStaticIds.includes(v.id))
    .map((v) => ({ ...v, category: categoryOverrides[v.id] || v.category }));

  const uploadedPhotos = media
    .filter((m) => m.type === "photo")
    .map((m) => ({ src: m.url, category: m.category }));
  const uploadedVideos = media
    .filter((m) => m.type === "video")
    .map((m) => ({ mp4: m.url, category: m.category }));

  const allPhotos = [...visibleStaticPhotos, ...uploadedPhotos];
  const allVideos = [...visibleStaticVideos, ...uploadedVideos];

  const filteredVideos =
    activeTab === "All" ? allVideos : allVideos.filter((v) => v.category === activeTab);
  const filteredPhotos =
    activeTab === "All" ? allPhotos : allPhotos.filter((p) => p.category === activeTab);
  const isEmpty = filteredVideos.length === 0 && filteredPhotos.length === 0;
  const totalCount = filteredVideos.length + filteredPhotos.length;
  const lightboxImages = filteredPhotos.map((p) => p.src);

  const visibleVideos = showAll ? filteredVideos : filteredVideos.slice(0, PREVIEW_LIMIT);
  const remainingBudget = Math.max(0, PREVIEW_LIMIT - visibleVideos.length);
  const visiblePhotos = showAll ? filteredPhotos : filteredPhotos.slice(0, remainingBudget);

  function navigateLightbox(delta) {
    setLightboxIndex(
      (i) => (i + delta + lightboxImages.length) % lightboxImages.length,
    );
  }

  return (
    <section className="bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold">Our Work</h2>
        <p className="mt-2 text-center text-gray-500">
          A look at some recent cuts and colors.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => selectTab(tab)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-red text-white"
                  : "bg-white text-gray-600 shadow-sm hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {isEmpty ? (
          <p className="mt-10 text-center text-gray-500">
            Photos coming soon for this category.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {visibleVideos.map((v, i) => (
              <LazyVideo
                key={`${activeTab}-v${i}`}
                webm={v.webm}
                mp4={v.mp4}
                poster={v.poster}
                className="aspect-square w-full overflow-hidden rounded-xl shadow-sm"
              />
            ))}
            {visiblePhotos.map((p, i) => (
              <button
                key={`${activeTab}-p${i}`}
                onClick={() => setLightboxIndex(i)}
                aria-label="View photo"
                className="aspect-square w-full overflow-hidden rounded-xl shadow-sm"
              >
                <img
                  src={p.src}
                  alt="Genius Grooming Parlor haircut"
                  loading="lazy"
                  className="h-full w-full object-cover transition hover:scale-105"
                />
              </button>
            ))}
          </div>
        )}

        {!showAll && totalCount > PREVIEW_LIMIT && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="rounded-full border border-gray-300 bg-white px-8 py-3 font-semibold text-ink hover:border-ink"
            >
              See All ({totalCount})
            </button>
          </div>
        )}
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
