"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RETRATOS } from "@/lib/archive";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const chapters = [
  {
    num: "01",
    name: "María Eugenia — 84 años",
    desc: "De la sierra a la ciudad: sesenta años de oficio, radio y memoria.",
    retrato: RETRATOS.senora,
  },
  {
    num: "02",
    name: "Rafael — 79 años",
    desc: "El relojero que reparó el tiempo de tres generaciones.",
    retrato: RETRATOS.joven,
  },
  {
    num: "03",
    name: "Margarita — 91 años",
    desc: "Pinceles, gatos y perros: una casa entera convertida en taller.",
    retrato: RETRATOS.dosMujeres,
  },
  {
    num: "04",
    name: "Antonio — 77 años",
    desc: "El tren, la fábrica y la primera radio del barrio.",
    // Antonio llevaba el retrato de una mujer junto a una silla.
    retrato: RETRATOS.dosHombres,
  },
];

export default function ChapterList() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const burgundy =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--color-burgundy")
          .trim() || "#7A3B43";

      if (!reduced) {
        gsap.from(".chapter-row", {
          y: 48,
          autoAlpha: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".chapters-list",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // Quien pide menos movimiento no debería recibir una tarjeta que gira y
      // persigue el cursor: el hover entero queda fuera en ese caso.
      if (reduced) return;

      // El hover trae el retrato de esa persona hasta el cursor. Antes la
      // tarjeta salía vacía; ahora la fila entrega exactamente lo que promete.
      const rows = gsap.utils.toArray<HTMLElement>(".chapter-row", root.current);
      const cleanups: Array<() => void> = [];

      rows.forEach((row) => {
        const name = row.querySelector(".chapter-name");
        const card = row.querySelector<HTMLElement>(".chapter-card");
        const inner = row.querySelector<HTMLElement>(".chapter-card-inner");

        const tl = gsap.timeline({ paused: true });
        tl.to(name, { color: burgundy, x: 16, duration: 0.35, ease: "power2.out" }, 0);
        // La entrada de la tarjeta se anima en la capa interior. Compartiendo
        // elemento con el seguimiento del cursor, ambos escribían `y` a la vez
        // y al salir de la fila el retrato temblaba.
        if (inner) {
          tl.fromTo(
            inner,
            { autoAlpha: 0, y: 26, scale: 0.94, rotate: -2 },
            { autoAlpha: 1, y: 0, scale: 1, rotate: 0, duration: 0.45, ease: "power2.out" },
            0
          );
        }

        // El retrato sigue al cursor con retardo: da peso físico al gesto.
        const quickY = card ? gsap.quickTo(card, "y", { duration: 0.5, ease: "power3.out" }) : null;
        const onMove = (e: MouseEvent) => {
          if (!quickY) return;
          const rect = row.getBoundingClientRect();
          quickY((e.clientY - rect.top - rect.height / 2) * 0.35);
        };

        const enter = () => tl.play();
        const leave = () => {
          tl.reverse();
          quickY?.(0);
        };

        row.addEventListener("mouseenter", enter);
        row.addEventListener("mouseleave", leave);
        row.addEventListener("mousemove", onMove);
        cleanups.push(() => {
          row.removeEventListener("mouseenter", enter);
          row.removeEventListener("mouseleave", leave);
          row.removeEventListener("mousemove", onMove);
          tl.kill();
        });
      });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: root }
  );

  return (
    <section ref={root} id="capitulos" className="relative mx-auto max-w-6xl px-6 py-24 md:py-28">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-mute">Relatos</p>
      <h2 className="mt-4 font-display text-4xl font-light italic text-sumi md:text-5xl">
        Capítulos del tiempo
      </h2>
      {/* Sin flecha ni cursor de enlace: estas filas no llevan a ninguna parte
          y prometerlo era una mentira de interfaz. Lo que sí dan al pasar por
          encima —el retrato de esa persona— lo cumplen. */}
      <ul className="chapters-list mt-16">
        {chapters.map((c) => (
          <li
            key={c.num}
            className="chapter-row relative grid grid-cols-[auto_1fr] items-center gap-6 border-t border-sumi/30 py-8 last:border-b md:grid-cols-[auto_1fr_1fr]"
            style={{ willChange: "transform, opacity" }}
          >
            <span className="font-display text-xs tracking-[0.3em] text-slate-mute">
              {c.num}
            </span>
            <span className="chapter-name font-display text-2xl font-light text-sumi md:text-4xl">
              {c.name}
            </span>
            {/* El reservado a la derecha es el hueco del retrato: sin él la
                tarjeta caía encima de esta misma frase. */}
            <p className="hidden leading-relaxed text-sumi/70 md:block lg:pr-56">{c.desc}</p>

            {/* Retrato de archivo, no una tarjeta de color vacía. Anclado
                dentro del contenedor: colgado de `left-full` se salía de la
                pantalla en cualquier portátil de 1440px. */}
            <figure
              className="chapter-card pointer-events-none absolute right-0 top-1/2 z-20 hidden w-48 -translate-y-1/2 lg:block"
              aria-hidden="true"
            >
              <div className="chapter-card-inner opacity-0">
                <img
                  src={c.retrato.thumb}
                  alt=""
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover shadow-[0_24px_60px_-24px_rgba(43,43,42,0.7)]"
                />
                <figcaption className="mt-2 bg-burgundy px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-parchment">
                  Capítulo {c.num}
                </figcaption>
              </div>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
