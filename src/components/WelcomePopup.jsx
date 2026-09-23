import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { shop } from "../data/shopData";

const STORAGE_KEY = "ggp_welcome_seen";
const DELAY_MS = 3000;

// Shown once per visitor (tracked in localStorage), a few seconds
// after they land on the site - not on every visit, and not an
// exit-intent popup (those don't work well on the mobile traffic
// this site mostly gets).
export default function WelcomePopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // localStorage unavailable (private mode, blocked) - just skip the popup.
      alreadySeen = true;
    }
    if (alreadySeen) return;

    const timer = setTimeout(() => {
      setVisible(true);
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // Best effort - if it can't be saved, worst case it shows again next visit.
      }
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  function close() {
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-bold">{shop.tagline}</h2>
          <button
            onClick={close}
            aria-label="Close"
            className="shrink-0 text-xl leading-none text-gray-400 hover:text-ink"
          >
            &times;
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Welcome to {shop.name}! Book your appointment now, or join our
          WhatsApp channel for style updates and offers.
        </p>
        <div className="mt-5 flex flex-col gap-3">
          <Link
            to="/booking"
            onClick={close}
            className="rounded-full bg-red px-6 py-3 text-center font-semibold text-white hover:bg-red-dark"
          >
            Book Now
          </Link>
          <a
            href={shop.social.whatsappChannel}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="rounded-full bg-[#25D366] px-6 py-3 text-center font-semibold text-white hover:opacity-90"
          >
            Join Our WhatsApp Channel
          </a>
        </div>
      </div>
    </div>
  );
}
