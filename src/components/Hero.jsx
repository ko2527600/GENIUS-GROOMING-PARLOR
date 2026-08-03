import { useState } from "react";
import { Link } from "react-router-dom";
import { shop } from "../data/shopData";
import logo from "../assets/logo.png";
import Typewriter from "./Typewriter";
import heroVideoWebm from "../assets/video/hero-bg.webm";
import heroVideoMp4 from "../assets/video/hero-bg.mp4";
import heroPoster from "../assets/video/hero-bg-poster.jpg";
import heroVideo2Webm from "../assets/video/hero-bg-2.webm";
import heroVideo2Mp4 from "../assets/video/hero-bg-2.mp4";
import heroPoster2 from "../assets/video/hero-bg-2-poster.jpg";

const heroVideos = [
  { webm: heroVideoWebm, mp4: heroVideoMp4, poster: heroPoster },
  { webm: heroVideo2Webm, mp4: heroVideo2Mp4, poster: heroPoster2 },
];

const titleSpeed = 90;
const titleStartDelay = 300;
const titleTypingDuration = titleStartDelay + shop.name.length * titleSpeed;

export default function Hero() {
  const [index, setIndex] = useState(0);
  const current = heroVideos[index];

  return (
    <section className="relative flex min-h-[85svh] flex-col items-center justify-center gap-6 overflow-hidden bg-ink px-4 text-center text-white">
      <video
        key={index}
        poster={current.poster}
        autoPlay
        muted
        playsInline
        onEnded={() => setIndex((i) => (i + 1) % heroVideos.length)}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={current.webm} type="video/webm" />
        <source src={current.mp4} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-ink/70" />

      <div className="relative flex flex-col items-center gap-6">
        <img src={logo} alt={shop.name} className="h-28 w-28 rounded-full object-cover" />

        <span className="rounded-full border border-brand px-4 py-1 text-xs uppercase tracking-widest text-brand">
          {shop.type} &middot; {shop.address}
        </span>

        <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
          <Typewriter text={shop.name} speed={titleSpeed} startDelay={titleStartDelay} />
        </h1>

        <p className="max-w-md text-lg text-gray-300">
          <Typewriter text={shop.tagline} startDelay={titleTypingDuration + 250} />
        </p>

        <div className="flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row">
          <Link
            to="/booking"
            className="rounded-full bg-red px-8 py-3 text-center font-semibold text-white hover:bg-red-dark"
          >
            Book Now
          </Link>
          <a
            href="#services"
            className="rounded-full border border-white/30 px-8 py-3 text-center font-semibold text-white hover:bg-white/10"
          >
            View Services
          </a>
        </div>
      </div>
    </section>
  );
}
