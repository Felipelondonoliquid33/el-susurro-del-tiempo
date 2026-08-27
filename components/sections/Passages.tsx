"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DOCUMENTOS } from "@/lib/archive";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const passages = [
  { quote: "El tiempo es un río que me arrebata, pero yo soy el río.", author: "Jorge Luis Borges" },
  {
    quote: "¿Qué es el tiempo? Si nadie me lo pregunta, lo sé; si quiero explicarlo, no lo sé.",
    author: "San Agustín",
  },
  { quote: "El pasado nunca muere. Ni siquiera es pasado.", author: "William Faulkner" },
  { quote: "Todo fluye, nada permanece.", author: "Heráclito" },
];

export default function Passages() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.from(".passage-card", {
        y: 48,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="pasajes" className="relative mx-auto max-w-6xl px-6 py-24 md:py-28">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-mute">Pasajes</p>
      <h2 className="mt-4 font-display text-4xl font-light italic text-sumi md:text-5xl">
        Lo que el tiempo susurra
      </h2>
      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {passages.map((p, i) => (
          <figure
            key={p.author}
            className="passage-card group relative flex min-h-[240px] flex-col justify-center overflow-hidden border border-sumi/25 p-8 md:p-10"
            style={{ willChange: "transform, opacity" }}
          >
            {/* Cada cita se apoya en un documento real del archivo. El papel se
                intuye; no compite. Cuando iba al 70% con un velo del 70%, la
                letra manuscrita del documento era tan legible como la cita y
                las dos se leían encima la una de la otra. */}
            <img
              src={DOCUMENTOS[i % DOCUMENTOS.length].thumb}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="pointer-events-none absolute inset-0 h-full w-full scale-105 object-cover opacity-40 transition-[opacity,transform] duration-700 ease-out group-hover:scale-100 group-hover:opacity-55"
            />
            <div className="pointer-events-none absolute inset-0 bg-parchment/80" />
            <blockquote className="relative font-display text-xl font-light italic leading-relaxed text-sumi md:text-2xl">
              «{p.quote}»
            </blockquote>
            <figcaption className="relative mt-6 text-xs uppercase tracking-[0.25em] text-slate-mute">
              {p.author}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
