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
import gallery16 from "../assets/gallery/gallery-16.jpg";
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
  gallery16,
  gallery17,
  gallery18,
  gallery19,
  gallery20,
  gallery21,
  gallery22,
  gallery23,
  gallery24,
  gallery25,
  gallery26,
  gallery27,
];

const videos = [
  { webm: process1Webm, mp4: process1Mp4, poster: process1Poster },
  { webm: process2Webm, mp4: process2Mp4, poster: process2Poster },
  { mp4: braiding1Mp4, poster: braiding1Poster },
  { mp4: braiding2Mp4, poster: braiding2Poster },
  { mp4: braiding3Mp4, poster: braiding3Poster },
  { mp4: braiding4Mp4, poster: braiding4Poster },
  { mp4: braiding5Mp4, poster: braiding5Poster },
  { mp4: braiding6Mp4, poster: braiding6Poster },
  { mp4: braiding7Mp4, poster: braiding7Poster },
  { mp4: braiding8Mp4, poster: braiding8Poster },
  { mp4: braiding9Mp4, poster: braiding9Poster },
  { mp4: braiding10Mp4, poster: braiding10Poster },
  { mp4: braiding11Mp4, poster: braiding11Poster },
  { mp4: braiding12Mp4, poster: braiding12Poster },
  { mp4: haircut1Mp4, poster: haircut1Poster },
  { mp4: haircut2Mp4, poster: haircut2Poster },
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
