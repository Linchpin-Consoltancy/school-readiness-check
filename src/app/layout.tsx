import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "School Readiness Check | Linchpin Education",
  description:
    "A seven minute check for school owners and heads. See which parts of your school are ready for what parents are now asking, and get a report you can act on.",
};

export const viewport: Viewport = {
  themeColor: "#1B3040",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
