import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { shop, tiktokStats, about } from "../data/shopData";
import showcasePhoto from "../assets/gallery/gallery-25.jpg";
import socialProofPhoto from "../assets/gallery/gallery-30.jpg";

// Shown once per browser session (tracked in sessionStorage), a few
// seconds after landing on the site. Rotates through 3 different
// messages across visits (tracked in localStorage) rather than always
// showing the same one - the 3rd is a bolder, ad-style pitch.
const SESSION_KEY = "ggp_popup_shown_session";
const ROTATION_KEY = "ggp_popup_rotation_index";
const DELAY_MS = 3000;
const VARIANT_COUNT = 3;

function Welcome({ close }) {
  return (
    <>
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
    </>
  );
}

function SocialProof({ close }) {
  return (
    <>
      <div className="relative">
        <img
          src={socialProofPhoto}
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
        <h2 className="text-xl font-bold">Loved by thousands</h2>
        <p className="mt-2 text-sm text-gray-600">
          Join <span className="font-semibold text-ink">{tiktokStats.followers}+</span>{" "}
          people following{" "}
          <span className="font-semibold text-ink">@geniusgroomingparlour</span>{" "}
          for daily style inspiration.
        </p>
        <div className="mt-5 flex flex-col gap-3">
          <a
            href={shop.social.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="rounded-full bg-ink px-6 py-3 text-center font-semibold text-white hover:bg-ink-soft"
          >
            Follow on TikTok
          </a>
          <Link
            to="/booking"
            onClick={close}
            className="rounded-full bg-red px-6 py-3 text-center font-semibold text-white hover:bg-red-dark"
          >
            Book Now
          </Link>
        </div>
      </div>
    </>
  );
}

function AdPitch({ close }) {
  return (
    <div className="bg-ink p-8 text-center text-white">
      <button
        onClick={close}
        aria-label="Close"
        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-lg leading-none text-white hover:bg-white/20"
      >
        &times;
      </button>
      <p className="text-xs font-semibold uppercase tracking-wide text-brand">
        {shop.name}
      </p>
      <h2 className="mt-2 text-2xl font-bold">{shop.tagline}</h2>
      <p className="mt-3 text-sm text-gray-300">
        {about.highlights.join(" · ")}
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <Link
          to="/booking"
          onClick={close}
          className="rounded-full bg-red px-6 py-3 text-center font-semibold text-white hover:bg-red-dark"
        >
          Book Now
        </Link>
        <a
          href={`tel:${shop.phone.replace(/\s/g, "")}`}
          onClick={close}
          className="rounded-full border border-white/30 px-6 py-3 text-center font-semibold text-white hover:bg-white/10"
        >
          Call Now
        </a>
      </div>
    </div>
  );
}

const VARIANTS = [Welcome, SocialProof, AdPitch];

export default function WelcomePopup() {
  const [visible, setVisible] = useState(false);
  const [variantIndex, setVariantIndex] = useState(0);

  useEffect(() => {
    let alreadyShownThisSession = false;
    let rotationIndex = 0;
    try {
      alreadyShownThisSession = sessionStorage.getItem(SESSION_KEY) === "1";
      rotationIndex = parseInt(localStorage.getItem(ROTATION_KEY), 10) || 0;
    } catch {
      // storage unavailable (private mode, blocked) - just skip the popup.
      alreadyShownThisSession = true;
    }
    if (alreadyShownThisSession) return;

    const timer = setTimeout(() => {
      setVariantIndex(rotationIndex % VARIANT_COUNT);
      setVisible(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
        localStorage.setItem(ROTATION_KEY, String((rotationIndex + 1) % VARIANT_COUNT));
      } catch {
        // Best effort - if it can't be saved, worst case it repeats next visit.
      }
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  function close() {
    setVisible(false);
  }

  if (!visible) return null;

  const Variant = VARIANTS[variantIndex];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <Variant close={close} />
      </div>
    </div>
  );
}
