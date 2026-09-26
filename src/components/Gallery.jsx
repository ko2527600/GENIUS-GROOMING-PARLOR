import { useState } from "react";
import LazyVideo from "./LazyVideo";
import Lightbox from "./Lightbox";
import gallery1 from "../assets/gallery/gallery-1.jpg";
import gallery2 from "../assets/gallery/gallery-2.jpg";
import gallery3 from "../assets/gallery/gallery-3.jpg";
import gallery4 from "../assets/gallery/gallery-4.jpg";
import gallery5 from "../assets/gallery/gallery-5.jpg";
import gallery6 from "../assets/gallery/gallery-6.jpg";
import gallery7 from "../assets/gallery/gallery-7.jpg";
import gallery8 from "../assets/gallery/gallery-8.jpg";
import gallery9 from "../assets/gallery/gallery-9.jpg";
import gallery10 from "../assets/gallery/gallery-10.jpg";
import gallery11 from "../assets/gallery/gallery-11.jpg";
import gallery12 from "../assets/gallery/gallery-12.jpg";
import gallery13 from "../assets/gallery/gallery-13.jpg";
import gallery14 from "../assets/gallery/gallery-14.jpg";
import gallery15 from "../assets/gallery/gallery-15.jpg";
import gallery17 from "../assets/gallery/gallery-17.jpg";
import gallery18 from "../assets/gallery/gallery-18.jpg";
import gallery19 from "../assets/gallery/gallery-19.jpg";
import gallery20 from "../assets/gallery/gallery-20.jpg";
import gallery21 from "../assets/gallery/gallery-21.jpg";
import gallery22 from "../assets/gallery/gallery-22.jpg";
import gallery23 from "../assets/gallery/gallery-23.jpg";
import gallery24 from "../assets/gallery/gallery-24.jpg";
import gallery25 from "../assets/gallery/gallery-25.jpg";
import gallery26 from "../assets/gallery/gallery-26.jpg";
import gallery27 from "../assets/gallery/gallery-27.jpg";
import gallery28 from "../assets/gallery/gallery-28.jpg";
import gallery29 from "../assets/gallery/gallery-29.jpg";
import gallery30 from "../assets/gallery/gallery-30.jpg";
import gallery31 from "../assets/gallery/gallery-31.jpg";
import gallery32 from "../assets/gallery/gallery-32.jpg";
import gallery33 from "../assets/gallery/gallery-33.jpg";
import gallery34 from "../assets/gallery/gallery-34.jpg";
import gallery35 from "../assets/gallery/gallery-35.jpg";
import gallery36 from "../assets/gallery/gallery-36.jpg";
import gallery37 from "../assets/gallery/gallery-37.jpg";
import gallery38 from "../assets/gallery/gallery-38.jpg";
import gallery39 from "../assets/gallery/gallery-39.jpg";
import gallery40 from "../assets/gallery/gallery-40.jpg";
import gallery41 from "../assets/gallery/gallery-41.jpg";
import gallery42 from "../assets/gallery/gallery-42.jpg";
import gallery43 from "../assets/gallery/gallery-43.jpg";
import gallery44 from "../assets/gallery/gallery-44.jpg";
import gallery45 from "../assets/gallery/gallery-45.jpg";
import gallery46 from "../assets/gallery/gallery-46.jpg";
import gallery47 from "../assets/gallery/gallery-47.jpg";
import process1Webm from "../assets/video/process-1.webm";
import process1Mp4 from "../assets/video/process-1.mp4";
import process1Poster from "../assets/video/process-1-poster.jpg";
import process2Webm from "../assets/video/process-2.webm";
import process2Mp4 from "../assets/video/process-2.mp4";
import process2Poster from "../assets/video/process-2-poster.jpg";
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

const photos = [
  { src: gallery1, category: "Hair" },
  { src: gallery2, category: "Hair" },
  { src: gallery3, category: "Hair" },
  { src: gallery4, category: "Hair" },
  { src: gallery5, category: "Hair" },
  { src: gallery6, category: "Hair" },
  { src: gallery7, category: "Hair" },
  { src: gallery8, category: "Hair" },
  { src: gallery9, category: "Hair" },
  { src: gallery10, category: "Hair" },
  { src: gallery11, category: "Hair" },
  { src: gallery12, category: "Hair" },
  { src: gallery13, category: "Hair" },
  { src: gallery14, category: "Hair" },
  { src: gallery15, category: "Hair" },
  { src: gallery17, category: "Hair" },
  { src: gallery18, category: "Hair" },
  { src: gallery19, category: "Hair" },
  { src: gallery20, category: "Hair" },
  { src: gallery21, category: "Hair" },
  { src: gallery22, category: "Hair" },
  { src: gallery23, category: "Hair" },
  { src: gallery24, category: "Hair" },
  { src: gallery25, category: "Hair" },
  { src: gallery26, category: "Hair" },
  { src: gallery27, category: "Hair" },
  { src: gallery28, category: "Nails" },
  { src: gallery29, category: "Nails" },
  { src: gallery30, category: "Nails" },
  { src: gallery31, category: "Nails" },
  { src: gallery32, category: "Nails" },
  { src: gallery33, category: "Nails" },
  { src: gallery34, category: "Nails" },
  { src: gallery35, category: "Nails" },
  { src: gallery36, category: "Nails" },
  { src: gallery37, category: "Nails" },
  { src: gallery38, category: "Nails" },
  { src: gallery39, category: "Nails" },
  { src: gallery40, category: "Nails" },
  { src: gallery41, category: "Nails" },
  { src: gallery42, category: "Nails" },
  { src: gallery43, category: "Nails" },
  { src: gallery44, category: "Nails" },
  { src: gallery45, category: "Nails" },
  { src: gallery46, category: "Nails" },
  { src: gallery47, category: "Nails" },
];

const videos = [
  { webm: process1Webm, mp4: process1Mp4, poster: process1Poster, category: "Hair" },
  { webm: process2Webm, mp4: process2Mp4, poster: process2Poster, category: "Hair" },
  { mp4: braiding1Mp4, poster: braiding1Poster, category: "Hair" },
  { mp4: braiding2Mp4, poster: braiding2Poster, category: "Hair" },
  { mp4: braiding3Mp4, poster: braiding3Poster, category: "Hair" },
  { mp4: braiding4Mp4, poster: braiding4Poster, category: "Hair" },
  { mp4: braiding5Mp4, poster: braiding5Poster, category: "Hair" },
  { mp4: braiding6Mp4, poster: braiding6Poster, category: "Hair" },
  { mp4: braiding7Mp4, poster: braiding7Poster, category: "Hair" },
  { mp4: braiding8Mp4, poster: braiding8Poster, category: "Hair" },
  { mp4: braiding9Mp4, poster: braiding9Poster, category: "Hair" },
  { mp4: braiding10Mp4, poster: braiding10Poster, category: "Hair" },
  { mp4: braiding11Mp4, poster: braiding11Poster, category: "Hair" },
  { mp4: braiding12Mp4, poster: braiding12Poster, category: "Hair" },
  { mp4: haircut1Mp4, poster: haircut1Poster, category: "Hair" },
  { mp4: haircut2Mp4, poster: haircut2Poster, category: "Hair" },
  { mp4: nails1Mp4, poster: nails1Poster, category: "Nails" },
  { mp4: nails2Mp4, poster: nails2Poster, category: "Nails" },
  { mp4: nails3Mp4, poster: nails3Poster, category: "Nails" },
  { mp4: nails4Mp4, poster: nails4Poster, category: "Nails" },
  { mp4: nails5Mp4, poster: nails5Poster, category: "Nails" },
  { mp4: nails6Mp4, poster: nails6Poster, category: "Nails" },
  { mp4: nails7Mp4, poster: nails7Poster, category: "Nails" },
  { mp4: nails8Mp4, poster: nails8Poster, category: "Nails" },
  { mp4: nails9Mp4, poster: nails9Poster, category: "Nails" },
  { mp4: nails10Mp4, poster: nails10Poster, category: "Nails" },
];

const TABS = ["All", "Hair", "Nails", "Beauty"];
const PREVIEW_LIMIT = 8;

export default function Gallery() {
  const [activeTab, setActiveTab] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  function selectTab(tab) {
    setActiveTab(tab);
    setShowAll(false);
  }

  const filteredVideos =
    activeTab === "All" ? videos : videos.filter((v) => v.category === activeTab);
  const filteredPhotos =
    activeTab === "All" ? photos : photos.filter((p) => p.category === activeTab);
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
