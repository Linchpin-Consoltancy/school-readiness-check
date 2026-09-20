import type { Metadata } from "next";
import "./site.css";

/**
 * The website half of the project.
 *
 * site.css is loaded here rather than globally, which means the readiness
 * check at /check never sees the website styling, and the website never sees
 * the check's. The two live in one project without interfering with each
 * other.
 */

export const metadata: Metadata = {
  title: "Linchpin Education",
  description:
    "Linchpin Education partners with schools that refuse to leave quality to chance, building the systems, structures, and routines that make effective leadership sustainable and consistent learning a reality.",
  alternates: { canonical: "https://linchpineducation.com/" },
  openGraph: {
    title: "Linchpin Education",
    description:
      "School systems consultancy for principals and directors who want quality designed rather than hoped for.",
    url: "https://linchpineducation.com/",
    siteName: "Linchpin Education",
    type: "website",
  },
};

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
