"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useAppListo } from "@/components/fx/Preloader";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const listo = useAppListo();

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;
      // La portada espera al telón: si entra por debajo, el usuario se pierde
      // justamente la animación que da la primera impresión.
      if (!listo) return;

      SplitText.create(".hero-title", {
        type: "chars,words",
        autoSplit: true,
        mask: "chars",
        onSplit(self) {
          return gsap.from(self.chars, {
            yPercent: 115,
            autoAlpha: 0,
            stagger: { each: 0.025, from: "center" },
            duration: 1,
            ease: "power3.out",
            delay: 0.25,
          });
        },
      });

      gsap.from(".hero-fade", {
        autoAlpha: 0,
        y: 28,
        duration: 1,
        stagger: 0.14,
        delay: 1.05,
        ease: "power2.out",
      });

      // La firma se dibuja sola: la primera placa del archivo se abre bajo el
      // titular como quien despliega una fotografía sobre la mesa.
      gsap.from(".hero-plate", {
        clipPath: "inset(0% 0% 100% 0%)",
        y: 24,
        duration: 1.4,
        delay: 1.2,
        ease: "expo.out",
      });

      // Al salir, la tipografía se hunde más rápido que la placa: profundidad
      // sin mover nada que no sea transform u opacity.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
            // Este trigger se crea el último, porque la portada espera al telón.
            // La prioridad lo devuelve a su sitio en el orden de refresco, por
            // delante de las secciones fijadas que vienen después.
            refreshPriority: 1,
          },
        })
        .to(".hero-content", { yPercent: -38, autoAlpha: 0, ease: "none" }, 0)
        .to(".hero-plate", { yPercent: -14, ease: "none" }, 0);
    },
    { scope: root, dependencies: [listo] }
  );

  return (
    <section
      ref={root}
      id="hero"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-28"
    >
      <div
        className="hero-content relative z-10 flex flex-col items-center text-center"
        style={{ willChange: "transform, opacity" }}
      >
        {/* El sello a tamaño de marca: es lo primero que se ve y lo que fija la
            identidad antes de que entre el titular. */}
        {/* Decorativo: el nombre ya lo anuncia el header y el titular. */}
        <img
          src="/assets/logo-mark.webp"
          alt=""
          width={720}
          height={720}
          fetchPriority="high"
          className="hero-seal mb-6 h-[clamp(76px,7.5vw,116px)] w-[clamp(76px,7.5vw,116px)] object-contain"
        />
        <span className="hero-fade text-xs uppercase tracking-[0.35em] text-slate-mute">
          VIII · VI · MMXXVI
        </span>
        <h1 className="hero-title mt-6 font-display text-[clamp(52px,9vw,148px)] font-light leading-[0.98] text-sumi">
          Una vida, un libro
        </h1>
        <p className="hero-fade mt-7 max-w-lg font-display text-xl italic leading-relaxed text-sumi/75 md:text-2xl">
          Recuperamos la memoria de quienes ya vivieron lo que nosotros
          apenas empezamos a contar.
        </p>
      </div>

      {/* La placa de apertura: una sola imagen, ancha y baja, que ancla el
          pergamino sin competir con el titular. */}
      {/* La placa de apertura: el río. Es la imagen que abre el proyecto y la
          que se intercambió con el puente que ocupaba el centro de la galería. */}
      <figure
        className="hero-plate relative z-0 mt-10 w-full max-w-[min(92vw,1100px)]"
        style={{ willChange: "transform" }}
      >
        <img
          src="/assets/archive/paisaje-rio.webp"
          alt="El río entre la arboleda — fotografía del archivo familiar"
          width={2400}
          height={1642}
          fetchPriority="high"
          className="h-[clamp(180px,26vh,320px)] w-full object-cover object-[center_58%] shadow-[0_18px_60px_-30px_rgba(43,43,42,0.55)]"
        />
        <figcaption className="hero-fade mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-slate-mute">
          <span>Archivo familiar — sin fechar</span>
          <span aria-hidden="true" className="scroll-hint">
            Baja ↓
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
