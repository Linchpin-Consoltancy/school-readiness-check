"use client";

import { useEffect } from "react";

/**
 * The two small pieces of movement the website has always had:
 *
 *   1. Sections fade up as you scroll down to them.
 *   2. The navigation bar gains a soft shadow once you leave the top.
 *
 * This is the same behaviour as the script at the bottom of the original
 * page, with one improvement: it tidies up after itself when the visitor
 * leaves for the readiness check, so nothing is left running in the
 * background.
 */
export function SiteMotion() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("visible"), 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    document
      .querySelectorAll(".reveal")
      .forEach((element) => observer.observe(element));

    const nav = document.getElementById("nav");
    const onScroll = () => {
      nav?.classList.toggle("scrolled", window.scrollY > 40);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
