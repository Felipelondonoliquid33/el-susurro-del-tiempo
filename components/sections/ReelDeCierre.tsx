"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { REEL } from "@/lib/archive";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Cuántas páginas caben a la vez en la ventana. */
const VISIBLES = 3;

/**
 * El reel del cierre — páginas al viento.
 *
 * Ocupa el hueco de la derecha del formulario, ni un píxel más: se ven tres
 * páginas y el resto del archivo va desfilando por detrás en bucle. Son tres
 * movimientos superpuestos:
 *
 *   1. el reparto — entran apiladas y giradas, en orden aleatorio;
 *   2. la corriente — la tira avanza sin costura y afloja al pasar el puntero;
 *   3. la ráfaga — cada página cabecea con su propio periodo y desfase.
 *
 * El bucle no tiene salto porque la lista va duplicada y la tira se detiene
 * exactamente en -50%: el último fotograma es idéntico al primero.
 */
export default function ReelDeCierre() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  const paginas = [...REEL, ...REEL];

  useGSAP(
    (_ctx, contextSafe) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;
      // El contenedor es `hidden md:flex`: en móvil el componente se monta igual
      // y, sin esta guarda, dejaba tres docenas de tweens infinitos escribiendo
      // transforms sobre nodos con `display:none` durante toda la sesión.
      if (!window.matchMedia("(min-width: 768px)").matches) return;
      if (!track.current || !contextSafe) return;

      const pages = gsap.utils.toArray<HTMLElement>(".reel-pagina", track.current);
      const hojas = gsap.utils.toArray<HTMLElement>(".reel-hoja", track.current);
      if (!pages.length) return;

      // 1. Reparto — sobre el contenedor de cada página.
      gsap.from(pages, {
        yPercent: 26,
        scale: 0.86,
        autoAlpha: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: { each: 0.05, from: "random" },
        scrollTrigger: {
          trigger: root.current,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      });

      // 2. Corriente. La duración crece con el número de páginas para que la
      //    velocidad lineal no dependa de cuántas haya en el catálogo.
      const drift = gsap.to(track.current, {
        xPercent: -50,
        ease: "none",
        duration: REEL.length * 3.4,
        repeat: -1,
      });

      // 3. Ráfaga — sobre la hoja interior, no sobre el contenedor. Cuando las
      //    dos animaciones compartían elemento se disputaban `rotation` y el
      //    reparto quedaba pisado fotograma a fotograma.
      const gusts = hojas.map((hoja) =>
        gsap.to(hoja, {
          rotation: gsap.utils.random(-4.5, 4.5),
          y: gsap.utils.random(-12, 12),
          duration: gsap.utils.random(2.6, 4.6),
          delay: gsap.utils.random(0, 1.8),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        })
      );

      // Nada se mueve mientras el pie está fuera de pantalla.
      const vigia = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: ({ isActive }) => {
          if (isActive) {
            drift.play();
            gusts.forEach((g) => g.play());
          } else {
            drift.pause();
            gusts.forEach((g) => g.pause());
          }
        },
      });
      if (!vigia.isActive) {
        drift.pause();
        gusts.forEach((g) => g.pause());
      }

      // `contextSafe` es lo que mete estos tweens en el contexto del hook: si
      // se crean sueltos dentro de un handler, `useGSAP` no los revierte.
      const el = root.current;
      const slow = contextSafe(() => gsap.to(drift, { timeScale: 0.15, duration: 0.6 }));
      const resume = contextSafe(() => gsap.to(drift, { timeScale: 1, duration: 0.9 }));
      el?.addEventListener("pointerenter", slow);
      el?.addEventListener("pointerleave", resume);

      return () => {
        el?.removeEventListener("pointerenter", slow);
        el?.removeEventListener("pointerleave", resume);
        vigia.kill();
        drift.kill();
        gusts.forEach((g) => g.kill());
      };
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative overflow-hidden py-6" aria-label="Archivo del proyecto">
      <div
        ref={track}
        className="flex"
        // El ancho se calcula, no se deja a `max-content`: así cada página mide
        // exactamente un tercio de la ventana y siempre se ven tres.
        style={{ width: `${(paginas.length / VISIBLES) * 100}%` }}
      >
        {paginas.map((p, i) => (
          <div
            key={`${p.src}-${i}`}
            className="reel-pagina shrink-0 px-2"
            style={{ width: `${100 / paginas.length}%` }}
          >
            {/* Una capa por animación: el reparto mueve el contenedor, la
                ráfaga mueve la hoja. Así ninguna pisa el `rotation` de la otra. */}
            <div className="reel-hoja">
              <img
                src={p.thumb}
                // La segunda mitad es un duplicado decorativo: anunciarla otra
                // vez sólo ensucia el lector de pantalla.
                alt={i < REEL.length ? p.alt : ""}
                aria-hidden={i >= REEL.length}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover shadow-[0_26px_55px_-26px_rgba(0,0,0,0.95)]"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Las páginas entran y salen de la corriente en vez de aparecer
          cortadas contra el borde del contenedor. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-sumi to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-sumi to-transparent" />
    </div>
  );
}
