import { put, list, get } from "@vercel/blob";
import crypto from "crypto";

const PREFIX = "bookings/";

function newId() {
  const ts = Date.now().toString(36);
  const rand = crypto.randomBytes(4).toString("hex");
  return `${ts}-${rand}`;
}

export async function createBooking(data) {
  const id = newId();
  
  // Parse the date and time
  const bookingDate = data.date || new Date().toISOString().split('T')[0];
  const bookingDateTime = new Date(`${bookingDate}T${convertTo24Hour(data.time)}`).toISOString();
  
  const booking = {
    id,
    name: data.name,
    phone: data.phone,
    stylist: data.stylist,
    services: data.services,
    time: data.time,
    date: bookingDate,
    dateTime: bookingDateTime,
    payment: data.payment,
    status: "new",
    createdAt: new Date().toISOString(),
    inspirationPhoto: data.inspirationPhoto || null,
  };

  await put(`${PREFIX}${id}.json`, JSON.stringify(booking), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: false,
    contentType: "application/json",
  });

  return booking;
}

// Convert 12-hour time format to 24-hour for ISO date
function convertTo24Hour(time12h) {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') hours = '00';
  if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
  return `${hours.padStart(2, '0')}:${minutes || '00'}:00`;
}

async function readBookingBlob(pathname) {
  const result = await get(pathname, { access: "private" });
  if (!result) return null;
  return new Response(result.stream).json();
}

export async function listBookings() {
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
  const bookings = await Promise.all(blobs.map((b) => readBookingBlob(b.pathname)));
  return bookings
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function updateBookingStatus(id, status) {
  const pathname = `${PREFIX}${id}.json`;
  const booking = await readBookingBlob(pathname);
  if (!booking) return null;

  booking.status = status;
  await put(pathname, JSON.stringify(booking), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });

  return booking;
}

// Marks that a "come back" reminder was already sent for this booking,
// so the reminders cron doesn't nag the same customer every day once
// they're overdue.
export async function markReminderSent(id) {
  const pathname = `${PREFIX}${id}.json`;
  const booking = await readBookingBlob(pathname);
  if (!booking) return null;

  booking.reminderSentAt = new Date().toISOString();
  await put(pathname, JSON.stringify(booking), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });

  return booking;
}

// Check if a time slot is available for a given stylist on a specific date
export async function checkAvailability(date, time, stylist) {
  const bookings = await listBookings();
  
  // Count bookings for this date/time/stylist that aren't cancelled
  const conflictingBookings = bookings.filter(b => 
    b.date === date && 
    b.time === time && 
    b.stylist === stylist &&
    b.status !== 'cancelled'
  );
  
  // Each stylist can handle 1 booking per slot
  // "No Preference" bookings need to check all stylists
  if (stylist === "No Preference") {
    // Count total bookings across all stylists for this slot
    const totalBookings = bookings.filter(b =>
      b.date === date &&
      b.time === time &&
      b.status !== 'cancelled'
    );
    
    // Get total number of stylists (excluding "No Preference")
    // This should come from shopData, but for now we'll use 2
    const maxCapacity = 2;
    return totalBookings.length < maxCapacity;
  }
  
  return conflictingBookings.length === 0;
}

// Get available slots for a specific date and stylist
export async function getAvailableSlots(date, stylist) {
  const bookings = await listBookings();
  
  // All possible time slots (should match shopData.timeSlots)
  const allSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
    "5:00 PM", "6:00 PM"
  ];
  
  const availableSlots = [];
  
  for (const slot of allSlots) {
    const isAvailable = await checkAvailability(date, slot, stylist);
    if (isAvailable) {
      availableSlots.push(slot);
    }
  }
  
  return availableSlots;
}

// Get booking statistics for analytics
export async function getBookingStats() {
  const bookings = await listBookings();
  
  // Service popularity
  const serviceCount = {};
  bookings.forEach(b => {
    const services = b.services.split(',').map(s => s.trim());
    services.forEach(service => {
      serviceCount[service] = (serviceCount[service] || 0) + 1;
    });
  });
  
  // Peak booking times
  const timeCount = {};
  bookings.forEach(b => {
    if (b.status !== 'cancelled') {
      timeCount[b.time] = (timeCount[b.time] || 0) + 1;
    }
  });
  
  // Customer retention (repeat customers)
  const phoneCount = {};
  bookings.forEach(b => {
    phoneCount[b.phone] = (phoneCount[b.phone] || 0) + 1;
  });
  const repeatCustomers = Object.values(phoneCount).filter(count => count > 1).length;
  const totalCustomers = Object.keys(phoneCount).length;
  
  // Stylist performance
  const stylistCount = {};
  bookings.forEach(b => {
    if (b.status === 'completed') {
      stylistCount[b.stylist] = (stylistCount[b.stylist] || 0) + 1;
    }
  });
  
  return {
    servicePopularity: serviceCount,
    peakTimes: timeCount,
    repeatCustomerRate: totalCustomers > 0 ? (repeatCustomers / totalCustomers * 100).toFixed(1) : 0,
    stylistPerformance: stylistCount,
    totalBookings: bookings.length,
    totalCustomers,
  };
}
