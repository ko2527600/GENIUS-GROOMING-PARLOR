import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { shop } from "../data/shopData";
import showcasePhoto from "../assets/gallery/gallery-25.jpg";

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
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="relative">
          <img
            src={showcasePhoto}
            alt={`${shop.name} finished work`}
            className="h-48 w-full object-cover"
          />
          <button
            onClick={close}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-lg leading-none text-white hover:bg-black/70"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-bold">See what we can offer you</h2>
          <p className="mt-2 text-sm text-gray-600">
            At <span className="font-semibold text-ink">{shop.name}</span>,
            we are the best in making you beautiful.
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
    </div>
  );
}
