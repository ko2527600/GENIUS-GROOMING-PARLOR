import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { shop } from "../data/shopData";
import logo from "../assets/logo.png";

const links = [
  { to: "/#services", label: "Services" },
  { to: "/#about", label: "About" },
  { to: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ink text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2" onClick={() => setOpen(false)}>
          <img src={logo} alt={shop.name} className="h-9 w-9 shrink-0 rounded-full object-cover sm:h-10 sm:w-10" />
          <span className="truncate text-base font-bold tracking-wide sm:text-lg">{shop.name}</span>
        </Link>

        <button
          className="flex shrink-0 flex-col gap-1.5 p-2 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className={`block h-0.5 w-6 bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white transition ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a key={l.to} href={l.to} className="text-sm font-medium text-gray-200 hover:text-brand">
              {l.label}
            </a>
          ))}
          <NavLink
            to="/booking"
            className="rounded-full bg-red px-4 py-2 text-sm font-semibold text-white hover:bg-red-dark"
          >
            Book Now
          </NavLink>
        </nav>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/10 px-4 pb-4 md:hidden">
          {links.map((l) => (
            <a
              key={l.to}
              href={l.to}
              onClick={() => setOpen(false)}
              className="rounded px-2 py-3 text-sm font-medium text-gray-200 hover:bg-white/5"
            >
              {l.label}
            </a>
          ))}
          <NavLink
            to="/booking"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-red px-4 py-3 text-center text-sm font-semibold text-white"
          >
            Book Now
          </NavLink>
        </nav>
      )}
    </header>
  );
}
