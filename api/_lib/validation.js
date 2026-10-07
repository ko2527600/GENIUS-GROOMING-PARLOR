// Ghana phone number validation
// Formats: 0XX XXX XXXX, +233 XX XXX XXXX, 233XXXXXXXXX
export function isValidGhanaPhone(phone) {
  if (!phone) return false;
  
  // Remove all spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, "");
  
  // Check various Ghana formats
  const patterns = [
    /^0[2-5]\d{8}$/,           // 0XX XXXXXXXX (10 digits starting with 02-05)
    /^\+2330[2-5]\d{8}$/,      // +233 0XX XXXXXXXX
    /^2330[2-5]\d{8}$/,        // 233 0XX XXXXXXXX
    /^\+233[2-5]\d{8}$/,       // +233 XX XXXXXXXX
    /^233[2-5]\d{8}$/,         // 233 XX XXXXXXXX
  ];
  
  return patterns.some(pattern => pattern.test(cleaned));
}

// Normalize Ghana phone to standard format (without country code)
export function normalizeGhanaPhone(phone) {
  if (!phone) return "";
  
  const cleaned = phone.replace(/[\s-]/g, "");
  
  // Remove +233 or 233 prefix if present
  if (cleaned.startsWith("+233")) {
    const rest = cleaned.slice(4);
    // If it starts with 0, keep it, otherwise add 0
    return rest.startsWith("0") ? rest : "0" + rest;
  }
  
  if (cleaned.startsWith("233")) {
    const rest = cleaned.slice(3);
    return rest.startsWith("0") ? rest : "0" + rest;
  }
  
  return cleaned;
}

// Sanitize string input to prevent XSS
export function sanitizeString(str) {
  if (!str) return "";
  return str
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove on* event handlers
    .trim();
}

// Validate booking data
export function validateBookingData(data) {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }
  
  if (!isValidGhanaPhone(data.phone)) {
    errors.push("Please provide a valid Ghana phone number");
  }
  
  if (!data.stylist) {
    errors.push("Please select a stylist");
  }
  
  if (!data.services || data.services.trim().length === 0) {
    errors.push("Please select at least one service");
  }
  
  if (!data.time) {
    errors.push("Please select a time slot");
  }
  
  if (!data.date) {
    errors.push("Please select a date");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      name: sanitizeString(data.name),
      phone: normalizeGhanaPhone(data.phone),
      stylist: sanitizeString(data.stylist),
      services: sanitizeString(data.services),
      time: data.time,
      date: data.date,
      payment: data.payment ? sanitizeString(data.payment) : null,
      inspirationPhoto: data.inspirationPhoto || null,
      visitedBefore: data.visitedBefore === true,
      previousStylist: data.previousStylist ? sanitizeString(data.previousStylist) : null,
    },
  };
}
