import { put, get } from "@vercel/blob";

const CONFIG_PATH = "config/site.json";

const DEFAULT_CONFIG = {
  // Ids of built-in (bundled) photos/videos the admin has hidden from the
  // site - see src/data/mediaLibrary.js for what each id refers to.
  hiddenStaticIds: [],
  // { [staticId]: "Hair" | "Nails" | "Beauty" } - overrides a built-in
  // gallery photo/video's category without touching the source file.
  categoryOverrides: {},
};

export async function getSiteConfig() {
  const result = await get(CONFIG_PATH, { access: "public" });
  if (!result) return DEFAULT_CONFIG;
  const data = await new Response(result.stream).json();
  return { ...DEFAULT_CONFIG, ...data };
}

async function saveSiteConfig(config) {
  await put(CONFIG_PATH, JSON.stringify(config), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
  return config;
}

export async function setStaticMediaHidden(staticId, hidden) {
  const current = await getSiteConfig();
  const set = new Set(current.hiddenStaticIds);
  if (hidden) set.add(staticId);
  else set.delete(staticId);
  return saveSiteConfig({ ...current, hiddenStaticIds: [...set] });
}

export async function setStaticMediaCategory(staticId, category) {
  const current = await getSiteConfig();
  const categoryOverrides = { ...current.categoryOverrides };
  if (category) categoryOverrides[staticId] = category;
  else delete categoryOverrides[staticId];
  return saveSiteConfig({ ...current, categoryOverrides });
}
