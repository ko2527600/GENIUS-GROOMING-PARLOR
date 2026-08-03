import LazyVideo from "./LazyVideo";
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
import process1Webm from "../assets/video/process-1.webm";
import process1Mp4 from "../assets/video/process-1.mp4";
import process1Poster from "../assets/video/process-1-poster.jpg";
import process2Webm from "../assets/video/process-2.webm";
import process2Mp4 from "../assets/video/process-2.mp4";
import process2Poster from "../assets/video/process-2-poster.jpg";

const photos = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
  gallery8,
  gallery9,
  gallery10,
  gallery11,
  gallery12,
  gallery13,
  gallery14,
  gallery15,
];

const videos = [
  { webm: process1Webm, mp4: process1Mp4, poster: process1Poster },
  { webm: process2Webm, mp4: process2Mp4, poster: process2Poster },
];

export default function Gallery() {
  return (
    <section className="bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold">Our Work</h2>
        <p className="mt-2 text-center text-gray-500">
          A look at some recent cuts and colors.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {videos.map((v, i) => (
            <LazyVideo
              key={`v${i}`}
              webm={v.webm}
              mp4={v.mp4}
              poster={v.poster}
              className="aspect-square w-full overflow-hidden rounded-xl shadow-sm"
            />
          ))}
          {photos.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="Genius Grooming Parlor haircut"
              loading="lazy"
              className="aspect-square w-full rounded-xl object-cover shadow-sm"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
