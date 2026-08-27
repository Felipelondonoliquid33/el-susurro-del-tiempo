"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToSection } from "@/lib/scroll";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * El manifiesto.
 *
 * Único bloque burdeos de la página: un círculo de color se abre y se traga el
 * pergamino. La textura de fondo es una carta real del archivo, no un adorno
 * generado — cualquier ornamento suelto aquí se leía como pegatina.
 */
export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.fromTo(
        ".manifesto-bg",
        { clipPath: "circle(0% at 50% 50%)" },
        {
          clipPath: "circle(130% at 50% 50%)",
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 80%",
            end: "top 10%",
            scrub: 0.8,
          },
        }
      );

      gsap.from(".manifesto-reveal", {
        y: 40,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 45%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="manifiesto"
      className="relative flex min-h-dvh items-center justify-center overflow-hidden"
    >
      <div
        className="manifesto-bg absolute inset-0 flex items-center justify-center bg-burgundy"
        style={{ willChange: "clip-path" }}
      >
        {/* La carta manuscrita como trama de fondo: se intuye, no se lee.
            Antes iba `doc-manuscrito`, que en móvil dejaba ver el membrete
            «REPÚBLICA DE COLOMBIA — PRIVADO» detrás de un texto sobre memoria
            familiar. Una libreta anónima dice lo mismo sin decir nada. */}
        <img
          src="/assets/archive/doc-libreta.webp"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.09] mix-blend-luminosity"
        />

        <div className="relative mx-auto max-w-4xl px-8 py-32 text-center">
          <span
            aria-hidden="true"
            className="manifesto-reveal mx-auto block h-px w-16 bg-sakura/60"
          />
          <p className="manifesto-reveal mt-8 text-xs uppercase tracking-[0.35em] text-sakura">
            Manifiesto
          </p>
          <h2 className="manifesto-reveal mt-8 font-display text-[clamp(32px,5vw,64px)] font-light leading-[1.18] text-parchment">
            Cada adulto mayor guarda un mundo de historias que corre el riesgo de
            perderse con el tiempo.
          </h2>
          <button
            onClick={() => scrollToSection("#contacto")}
            className="manifesto-reveal mt-12 border border-parchment/60 px-8 py-4 text-xs uppercase tracking-[0.3em] text-parchment transition-colors duration-300 hover:border-sakura hover:text-sakura"
          >
            Escríbenos
          </button>
        </div>
      </div>
    </section>
  );
}
