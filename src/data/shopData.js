// Placeholder business data — swap these values for the client's real details/photos.
// This is the single file to edit once she shares her actual content.

export const shop = {
  name: "Genius Grooming Parlor",
  type: "Unisex Salon",
  tagline: "Sharp Fades. Sharper Style.",
  phone: "+233 24 708 3940",
  phone2: "+233 53 092 5603",
  whatsapp: "233247083940",
  address: "Lapaz New Market Road, Accra, Ghana",
  mapsUrl: "https://maps.app.goo.gl/rDj6poPuDPXpRUAm8",
  hours: [{ day: "Every Day", time: "Day & Night Services Available" }],
  social: {
    tiktok: "https://www.tiktok.com/@geniusgroomingparlour",
    instagram: "#",
    facebook: "#",
  },
};

// Flat booking fee, paid manually via MTN MoMo before a booking is
// confirmed. There's no live payment API yet — the customer sends the
// money themselves and confirms they did, and the shop reconciles it
// against their MoMo statement (see the admin dashboard).
export const payment = {
  amount: 50,
  currency: "GH₵",
  momoNumber: "0598618320",
  momoName: "Palour Genius Grooming",
};

// How long after a customer's last visit the system auto-sends a
// "come back" SMS reminder (see api/cron/reminders.js). Runs once a
// day, so an exact match isn't required — it fires on the first daily
// check on or after this many days have passed.
export const reminderIntervalDays = 14;

// Live chat widget (Tawk.to) for on-site customer enquiries. Leave
// both blank to keep the widget off. Get these from
// tawk.to -> Administration -> Chat Widget -> "Direct Chat Link" /
// widget code (the two IDs in the embed script's URL).
export const liveChat = {
  tawkToPropertyId: "6ab2eba56934013440e78641",
  tawkToWidgetId: "1k35eh0bd",
};

// From her TikTok profile (@geniusgroomingparlour) as of Aug 2026 —
// update if she shares fresher numbers.
export const tiktokStats = {
  followers: "53.7K",
  likes: "867.2K",
  following: "111",
};

// Swap this paragraph for her real story once she shares it.
export const about = {
  story:
    "Genius Grooming Parlor is a unisex salon in Lapaz built around one idea: everyone deserves a sharp, clean look and a comfortable chair to get it in. From haircuts and color to braids and nails, our team takes the time to get it right — day or night.",
  highlights: [
    "Unisex salon",
    "Day & night service",
    "Skilled stylists",
    "Clean, welcoming space",
  ],
};

// Real service list from the client's in-store signage, grouped so the
// booking flow and homepage can show small category headings instead of
// one flat list. No confirmed prices/durations yet — booking asks the
// customer to confirm those over WhatsApp/SMS instead of showing invented
// numbers.
export const services = [
  { id: "haircut", name: "Haircut", category: "Hair" },
  { id: "coloring", name: "Hair Coloring", category: "Hair" },
  { id: "pixie-cut", name: "Pixie Cut (Tonging)", category: "Hair" },
  { id: "dreadlocks", name: "Dreadlocks", category: "Hair" },
  { id: "braiding", name: "Braiding", category: "Hair" },
  { id: "frontal-installation", name: "Frontal Installation", category: "Hair" },
  { id: "nails-artistry", name: "Nails Artistry", category: "Nails" },
  { id: "pedicure", name: "Pedicure", category: "Nails" },
  { id: "manicure", name: "Manicure", category: "Nails" },
  { id: "brows", name: "Brows", category: "Beauty" },
  { id: "lashes", name: "Lashes", category: "Beauty" },
  { id: "facials", name: "Facials", category: "Beauty" },
  { id: "makeup", name: "Make Up", category: "Beauty" },
  { id: "waxing", name: "Waxing", category: "Beauty" },
];

// Groups `services` into { category, items } buckets, preserving order
// of first appearance.
export function groupServicesByCategory(list) {
  const order = [];
  const map = new Map();
  for (const s of list) {
    if (!map.has(s.category)) {
      map.set(s.category, []);
      order.push(s.category);
    }
    map.get(s.category).push(s);
  }
  return order.map((category) => ({ category, items: map.get(category) }));
}

export const barbers = [
  { id: "any", name: "No Preference" },
  { id: "barber1", name: "Stylist One" },
  { id: "barber2", name: "Stylist Two" },
];

export const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];
