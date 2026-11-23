import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format integer rupiah to IDR display string, e.g. Rp 250.000
 */
export function formatRupiah(amount: number | bigint | string): string {
  const numeric = typeof amount === "bigint" ? Number(amount) : Number(amount) || 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numeric).replace(/\s+/g, " ");
}

/**
 * Format date in Asia/Jakarta timezone
 */
export function formatDate(date: Date | string | number | null | undefined): string {
  if (!date) return "-";
  const d = new Date(date);
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(d);
}

/**
 * Format clean date without time
 */
export function formatDateOnly(date: Date | string | number | null | undefined): string {
  if (!date) return "-";
  const d = new Date(date);
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeZone: "Asia/Jakarta",
  }).format(d);
}

/**
 * Normalize and build WhatsApp click-to-chat URL
 * e.g. 08123456789 -> 628123456789
 */
export function buildWhatsAppUrl(phone: string, text: string): string {
  let cleanPhone = phone.replace(/[^0-9]/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "62" + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith("62") && cleanPhone.length > 5) {
    cleanPhone = "62" + cleanPhone;
  }
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

