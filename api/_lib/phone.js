// Normalizes local Ghanaian numbers ("024 000 0000", "0240000000") and
// already-international ones ("+233240000000") to bare 233-prefixed digits.
export function toGhanaDigits(phone) {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.startsWith("233")) return digits;
  if (digits.startsWith("0")) return `233${digits.slice(1)}`;
  if (digits.length === 9) return `233${digits}`;
  return digits;
}
