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

/* Defaults for every page. The website and the readiness check each set
   their own title and description on top of these.

   The verification line is what proves to Google that this domain belongs
   to Linchpin. It was in the original website and has to stay, or the
   Google Search Console listing stops working. */
export const metadata: Metadata = {
  metadataBase: new URL("https://linchpineducation.com"),
  title: "Linchpin Education",
  description:
    "Linchpin Education partners with schools that refuse to leave quality to chance, building the systems, structures, and routines that make effective leadership sustainable and consistent learning a reality.",
  verification: { google: "scAMhn4zWEipnwQci3JPtSwlGU9iH32q_ROJtaQE6no" },
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
