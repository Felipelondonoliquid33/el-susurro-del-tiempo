"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RELIQUIAS } from "@/lib/archive";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * La vitrina.
 *
 * El scroll vertical se convierte en un recorrido lateral por los objetos que
 * sobrevivieron a sus dueños. Cada ficha lleva imagen, número y pie: nunca hay
 * una tarjeta a medio llenar, que era el defecto de la versión anterior.
 */
export default function Reliquias() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const el = track.current;
      const st = stage.current;
      if (!el || !st) return;

      const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);

      gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => "+=" + distance(),
          pin: st,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // La entrada se dispara al llegar la sección, no ficha por ficha: atada a
      // la animación horizontal, las tarjetas ya visibles al fijar el panel
      // arrancaban en opacidad cero y dejaban un fotograma en blanco.
      gsap.from(".reliquia", {
        autoAlpha: 0,
        y: 46,
        duration: 0.7,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="reliquias" className="relative">
      <div
        ref={stage}
        className="reliquias-stage relative flex h-dvh flex-col justify-center overflow-hidden"
      >
        <header className="shrink-0 px-6 md:px-16">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-mute">Reliquias</p>
          {/* «Sobre la mesa» no cubría a la araña de cristal, que cuelga, ni al
              baúl, que va al suelo. La casa sí los cubre a todos. */}
          <h2 className="mt-3 max-w-2xl font-display text-[clamp(30px,4vw,58px)] font-light italic leading-tight text-sumi">
            Lo que quedó en la casa
          </h2>
        </header>

        <div
          ref={track}
          className="reliquias-track mt-10 flex w-max items-start gap-8 px-6 md:gap-12 md:px-16"
        >
          {RELIQUIAS.map((r, i) => (
            <article
              key={r.src}
              className="reliquia w-[clamp(230px,25vw,360px)] shrink-0"
              style={{
                willChange: "transform, opacity",
                // Un desnivel alterno rompe la línea de horizonte: el recorrido
                // respira en vez de leerse como una tira de contactos.
                marginTop: i % 2 === 0 ? 0 : "clamp(20px, 4vh, 56px)",
              }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={r.thumb}
                  alt={r.alt}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <div className="mt-5 flex items-baseline gap-3">
                <span className="font-display text-xs tracking-[0.3em] text-slate-mute">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-2xl font-light italic text-sumi">
                  {r.title}
                </h3>
              </div>
              <p className="mt-2 max-w-[34ch] leading-relaxed text-sumi/75">{r.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
