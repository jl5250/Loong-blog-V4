/**
 * Format a date string or timestamp to YYYY.MM.DD
 */
export function formatDate(date: string | number | undefined): string {
  if (!date) return "";
  let d: Date;
  if (typeof date === "number" || (!isNaN(Number(date)) && String(date).length >= 10)) {
    d = new Date(Number(date));
  } else {
    d = new Date(date);
  }
  if (isNaN(d.getTime())) return String(date).slice(0, 10);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}
