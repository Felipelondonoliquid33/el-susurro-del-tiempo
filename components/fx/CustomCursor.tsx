"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = dot.current;
    if (!el) return;

    gsap.set(el, { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.25, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.25, ease: "power3.out" });
    document.documentElement.classList.add("cursor-active");

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      el.classList.toggle("is-hover", !!target?.closest("a, button, [data-cursor]"));
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.classList.remove("cursor-active");
      gsap.killTweensOf(el);
    };
  }, []);

  return (
    <div ref={dot} aria-hidden="true" className="custom-cursor">
      <div className="custom-cursor-dot" />
    </div>
  );
}
