"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Mark document as JS ready for smooth scroll animations
    document.documentElement.classList.add("js-reveal-ready");

    const SELECTORS = [
      ".reveal-on-scroll",
      ".stagger-container",
      "[data-reveal]",
      "[data-stagger]",
      ".reveal-section",
      ".dashboard-reveal",
    ].join(", ");

    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      if (typeof window === "undefined") return;

      if (!("IntersectionObserver" in window)) {
        // Fallback for environments without IntersectionObserver
        document.querySelectorAll(SELECTORS).forEach((el) => {
          el.classList.add("is-revealed");
        });
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              observer?.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: "0px 0px -40px 0px", // Trigger slightly before full entry
          threshold: 0.05,
        }
      );

      const elements = document.querySelectorAll(SELECTORS);
      const windowHeight = window.innerHeight;

      elements.forEach((el, index) => {
        if (el.classList.contains("is-revealed")) return;

        const rect = el.getBoundingClientRect();
        // Above the fold or already in initial view
        if (rect.top < windowHeight * 0.92 && rect.bottom > 0) {
          setTimeout(() => {
            el.classList.add("is-revealed");
          }, Math.min(index * 60, 240));
        } else {
          // Below the fold: hold until user scrolls
          observer?.observe(el);
        }
      });
    };

    // Frame delay to allow Next.js route transition to settle
    const timer = setTimeout(setupObserver, 50);

    // MutationObserver to capture dynamically rendered elements
    const mutationObserver = new MutationObserver((mutations) => {
      let shouldRescan = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          shouldRescan = true;
          break;
        }
      }

      if (shouldRescan && observer) {
        document.querySelectorAll(SELECTORS).forEach((el) => {
          if (!el.classList.contains("is-revealed")) {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
              el.classList.add("is-revealed");
            } else {
              observer?.observe(el);
            }
          }
        });
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
