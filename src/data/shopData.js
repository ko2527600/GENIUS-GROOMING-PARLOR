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

// Real service list from the client, grouped so the booking flow and
// homepage can show small category headings instead of one flat list.
// No confirmed prices/durations yet — booking asks the customer to
// confirm those over WhatsApp/SMS instead of showing invented numbers.
export const services = [
  { id: "haircut", name: "Hair Cut", category: "Hair" },
  { id: "coloring", name: "Hair Coloring", category: "Hair" },
  { id: "dreadlocks", name: "Dreadlocks", category: "Hair" },
  { id: "braids", name: "Braids", category: "Hair" },
  { id: "ponytails", name: "Ponytails", category: "Hair" },
  { id: "nails", name: "Nails (Manicure & Pedicure)", category: "Nails" },
  { id: "facials", name: "Facials", category: "Beauty" },
  { id: "makeup", name: "Makeup", category: "Beauty" },
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
