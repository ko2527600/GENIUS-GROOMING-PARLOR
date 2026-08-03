import { Link } from "react-router-dom";
import { shop } from "../data/shopData";

export default function Hero() {
  return (
    <section className="flex min-h-[85svh] flex-col items-center justify-center gap-6 bg-ink px-4 text-center text-white">
      <span className="rounded-full border border-brand px-4 py-1 text-xs uppercase tracking-widest text-brand">
        {shop.address}
      </span>

      <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
        {shop.name}
      </h1>

      <p className="max-w-md text-lg text-gray-300">{shop.tagline}</p>

      <div className="flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row">
        <Link
          to="/booking"
          className="rounded-full bg-brand px-8 py-3 text-center font-semibold text-ink hover:bg-brand-dark"
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
    </section>
  );
}
