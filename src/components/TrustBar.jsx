import { shop, tiktokStats } from "../data/shopData";

export default function TrustBar() {
  return (
    <section className="bg-ink-soft px-4 py-6 text-white">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-10 gap-y-4 text-center">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
          </span>
          <span className="text-sm font-semibold">
            Open Now &middot; {shop.hours[0].time}
          </span>
        </div>

        <a
          href={shop.social.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-6 hover:opacity-80"
        >
          <div>
            <p className="text-xl font-bold text-brand">{tiktokStats.followers}</p>
            <p className="text-xs uppercase tracking-wide text-gray-400">
              TikTok Followers
            </p>
          </div>
          <div>
            <p className="text-xl font-bold text-brand">{tiktokStats.likes}</p>
            <p className="text-xs uppercase tracking-wide text-gray-400">Likes</p>
          </div>
        </a>
      </div>
    </section>
  );
}
