import type { Metadata } from "next";
import { Experience } from "@/components/experience/Experience";

/**
 * The School Readiness Check. One address, one screen, no reloads.
 * Everything the director moves through happens inside the frame in
 * Experience.
 *
 * This used to sit at the front door of the project. It now sits at /check,
 * because the front door belongs to the website.
 */

export const metadata: Metadata = {
  title: "School Readiness Check | Linchpin Education",
  description:
    "A seven minute check for school owners and heads. See which parts of your school are ready for what parents are now asking, and get a report you can act on.",
  alternates: { canonical: "https://linchpineducation.com/check" },
};

export default function CheckPage() {
  return <Experience />;
}
