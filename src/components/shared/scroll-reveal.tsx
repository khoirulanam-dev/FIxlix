"use client";

import React, { useState, useEffect, useRef } from "react";

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  stagger?: boolean;
  deferRender?: boolean;
  direction?: "up" | "fade" | "scale" | "left" | "right";
  delay?: number;
  className?: string;
  minHeight?: string | number;
}

export function ScrollReveal({
  children,
  stagger = false,
  deferRender = false,
  direction = "up",
  delay = 0,
  className = "",
  minHeight,
  style,
  ...props
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRendered, setIsRendered] = useState(!deferRender);

  useEffect(() => {
    if (!deferRender) return;

    const el = containerRef.current;
    if (!el) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsRendered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRendered(true);
          observer.unobserve(el);
        }
      },
      {
        rootMargin: "200px 0px 50px 0px", // Defer until scrolling near
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [deferRender]);

  const directionClass =
    direction === "scale"
      ? "reveal-scale"
      : direction === "left"
      ? "reveal-slide-left"
      : direction === "right"
      ? "reveal-slide-right"
      : "reveal-on-scroll";

  const staggerClass = stagger ? "stagger-container" : "";

  return (
    <div
      ref={containerRef}
      className={`${directionClass} ${staggerClass} ${className}`.trim()}
      style={{
        ...(delay > 0 ? { transitionDelay: `${delay}ms` } : {}),
        ...(minHeight && !isRendered ? { minHeight } : {}),
        ...style,
      }}
      {...props}
    >
      {isRendered ? children : null}
    </div>
  );
}

export function ScrollStagger({
  children,
  className = "",
  deferRender = false,
  ...props
}: Omit<ScrollRevealProps, "stagger">) {
  return (
    <ScrollReveal stagger={true} deferRender={deferRender} className={className} {...props}>
      {children}
    </ScrollReveal>
  );
}

