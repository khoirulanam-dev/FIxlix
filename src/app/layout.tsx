import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fixlix — Marketplace Servis Elektronik Rumah Tangga",
  description:
    "Hubungkan kebutuhan servis rice cooker, kipas angin, televisi, AC, dan kulkas Anda dengan teknisi terpercaya melalui konsultasi WhatsApp dan sistem pemesanan transparan.",
  keywords: [
    "servis elektronik",
    "reparasi AC",
    "servis kulkas",
    "servis TV LED",
    "servis rice cooker",
    "servis kipas angin",
    "teknisi elektronik terdekat",
    "Fixlix",
  ],
  authors: [{ name: "Fixlix Indonesia" }],
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-[#F8FAFC] text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}

