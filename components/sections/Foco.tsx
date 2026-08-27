"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * El foco.
 *
 * Un círculo se abre desde el centro de la página hasta tragarse la pantalla.
 * Dentro está la lectura en voz alta: el momento en que el archivo deja de ser
 * papel y vuelve a ser voz. Después, el texto explica el oficio.
 */
export default function Foco() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;
      if (!stage.current) return;

      // El círculo y el titular comparten scrub. El titular es parchment sobre
      // parchment mientras el círculo es pequeño: si entra antes de que el
      // video lo cubra, la frase sencillamente no se ve. Por eso arranca más
      // abierto y el texto aparece cuando ya tiene fondo debajo.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=150%",
          pin: stage.current,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onToggle: (self) => {
            const v = video.current;
            if (!v) return;
            if (self.isActive) void v.play().catch(() => {});
            else v.pause();
          },
        },
      });

      tl.fromTo(
        ".foco-media",
        { clipPath: "circle(30% at 50% 50%)" },
        { clipPath: "circle(78% at 50% 50%)", ease: "none" },
        0
      ).fromTo(
        ".foco-titular",
        { autoAlpha: 0 },
        { autoAlpha: 1, ease: "none", duration: 0.35 },
        0.4
      );

      gsap.from(".foco-parrafo", {
        autoAlpha: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.18,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".foco-texto",
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="oficio" className="relative">
      <div
        ref={stage}
        className="foco-stage relative flex h-dvh items-center justify-center overflow-hidden"
      >
        <div
          className="foco-media absolute inset-0"
          style={{ clipPath: "circle(78% at 50% 50%)", willChange: "clip-path" }}
          data-foco-media
        >
          <video
            ref={video}
            className="h-full w-full object-cover"
            poster="/assets/video/escritorio-poster.webp"
            preload="none"
            loop
            muted
            playsInline
            aria-label="Plano general de la lectura del libro terminado"
          >
            <source src="/assets/video/escritorio.webm" type="video/webm" />
            <source src="/assets/video/escritorio.mp4" type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-sumi/30" />
        </div>

        {/* Sin mezcla de capas: sobre sepia, `mix-blend-difference` devolvía un
            verde sucio ilegible. Una sombra larga basta para despegarlo. */}
        <h2
          className="foco-titular relative z-10 max-w-3xl px-6 text-center font-display text-[clamp(30px,4.6vw,68px)] font-light italic leading-tight text-parchment"
          style={{ textShadow: "0 2px 40px rgba(28,22,18,0.75)" }}
        >
          Nuestro oficio es escuchar
        </h2>
      </div>

      <div className="foco-texto mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-24 md:grid-cols-2 md:gap-16 md:pb-20 md:pt-28">
        <p className="foco-parrafo font-display text-xl font-light leading-relaxed text-sumi md:text-2xl">
          Nos sentamos con ellos las veces que haga falta. Grabamos, transcribimos
          y devolvemos cada capítulo para que lo corrijan, porque la memoria de
          una persona sólo la edita esa persona.
        </p>
        <p className="foco-parrafo leading-relaxed text-sumi/70">
          Después viene el trabajo callado: ordenar las fotografías sueltas,
          fechar lo que se pueda fechar, restaurar los documentos que la humedad
          alcanzó, y encuadernarlo todo en un libro del que se imprimen tantas
          copias como nietos haya. No es un servicio editorial. Es un archivo
          familiar que por fin cabe en las manos.
        </p>
      </div>
    </section>
  );
}
