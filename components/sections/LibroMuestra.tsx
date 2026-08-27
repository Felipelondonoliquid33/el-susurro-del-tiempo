"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToSection } from "@/lib/scroll";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PAGINAS = [
  { src: "/assets/libro-muestra/pagina_01.webp", label: "Portada" },
  { src: "/assets/libro-muestra/pagina_02.webp", label: "Página 2" },
  { src: "/assets/libro-muestra/pagina_04.webp", label: "Página 4" },
  { src: "/assets/libro-muestra/pagina_06.webp", label: "Página 6" },
  { src: "/assets/libro-muestra/pagina_08.webp", label: "Página 8" },
];

/**
 * Libro 3D interactivo con CSS 3D Transforms + GSAP.
 *
 * El libro se abre con scroll (pasa páginas al hacer scroll)
 * y también responde al hover. Sin Three.js — más ligero y
 * consistente con el resto de la landing.
 */
export default function LibroMuestra() {
  const root = useRef<HTMLElement>(null);
  const libro = useRef<HTMLDivElement>(null);
  const [paginaActual, setPaginaActual] = useState(0);
  const [abierto, setAbierto] = useState(false);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      // Animación de entrada del libro
      gsap.from(".libro-cubierta", {
        y: 60,
        rotateX: 20,
        autoAlpha: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      // Las páginas interiores entran escalonadas
      gsap.from(".libro-pagina", {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: root }
  );

  const paginaSiguiente = () => {
    if (paginaActual < PAGINAS.length - 1) {
      const next = paginaActual + 1;
      setPaginaActual(next);
      // Animación de pasar página
      gsap.fromTo(
        ".libro-hoja-actual",
        { rotateY: -90, transformOrigin: "left center" },
        { rotateY: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  };

  const paginaAnterior = () => {
    if (paginaActual > 0) {
      const prev = paginaActual - 1;
      setPaginaActual(prev);
      gsap.fromTo(
        ".libro-hoja-actual",
        { rotateY: 90, transformOrigin: "right center" },
        { rotateY: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  };

  return (
    <section
      ref={root}
      id="libro-muestra"
      className="relative mx-auto max-w-6xl px-6 py-24 md:py-28"
    >
      <p className="text-xs uppercase tracking-[0.35em] text-slate-mute">
        El libro
      </p>
      <h2 className="mt-4 font-display text-4xl font-light italic text-sumi md:text-5xl">
            Así se ve un libro terminado
      </h2>

      {/* Contenedor 3D del libro */}
      <div
        ref={libro}
        className="libro-cubierta relative mx-auto mt-16"
        style={{ perspective: "1600px" }}
        onMouseEnter={() => setAbierto(true)}
        onMouseLeave={() => setAbierto(false)}
      >
        {/* Cuerpo del libro con 3D transform */}
        <div
          className="relative mx-auto"
          style={{
            width: "min(75vw, 400px)",
            height: "min(100vw, 560px)",
            transformStyle: "preserve-3d",
            transform: abierto ? "rotateY(-18deg) rotateX(4deg)" : "rotateY(-4deg) rotateX(8deg))",
            transition: "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          {/* Lomos del libro (lomo visible) */}
          <div
            className="absolute left-0 top-0 h-full"
            style={{
              width: "24px",
              background: "linear-gradient(90deg, #5C2E35, #7A3B43)",
              transformStyle: "preserve-3d",
              transform: "translateX(-12px) rotateY(90deg)",
              transformOrigin: "right center",
              borderRadius: "2px 0 0 2px",
            }}
          />

          {/* Portada / Página actual */}
          <div className="libro-hoja-actual relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
            <img
              src={PAGINAS[paginaActual].src}
              alt={PAGINAS[paginaActual].label}
              className="h-full w-full rounded-r-[2px] object-cover shadow-[4px_4px_30px_-8px_rgba(43,43,42,0.5)]"
              style={{ imageRendering: "auto" }}
            />

            {/* Badge de página */}
            <span className="absolute bottom-4 right-4 rounded-full bg-parchment/90 px-3 py-1 font-display text-xs tracking-wider text-sumi/70 backdrop-blur-sm">
              {paginaActual + 1} / {PAGINAS.length}
            </span>
          </div>
        </div>

        {/* Controles de navegación */}        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            onClick={() => {
              paginaAnterior();
              // Mini animación de rebote en el botón
              gsap.fromTo("#btn-ant", { scale: 1 }, { scale: 0.9, duration: 0.15, yoyo: true, repeat: 1 });
            }}
            id="btn-ant"
            disabled={paginaActual === 0}
            className="flex items-center gap-2 border border-sumi/30 px-5 py-3 text-xs uppercase tracking-[0.25em] text-sumi transition-all duration-300 hover:border-burgundy hover:text-burgundy disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>

          <span className="font-display text-sm italic text-sumi/50">
            {PAGINAS[paginaActual].label}
          </span>

          <button
            onClick={() => {
              paginaSiguiente();
              gsap.fromTo("#btn-sig", { scale: 1 }, { scale: 0.9, duration: 0.15, yoyo: true, repeat: 1 });
            }}
            id="btn-sig"
            disabled={paginaActual === PAGINAS.length - 1}
            className="flex items-center gap-2 border border-sumi/30 px-5 py-3 text-xs uppercase tracking-[0.25em] text-sumi transition-all duration-300 hover:border-burgundy hover:text-burgundy disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Siguiente →
          </button>
        </div>
      </div>

      {/* CTA debajo del libro */}
      <div className="mx-auto mt-12 text-center">
        <p className="font-display text-lg italic leading-relaxed text-sumi/60">
          Este es el libro de María Eugenia. 191 páginas, fotografías de archivo,
          encuadernación artesanal.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => scrollToSection("#contacto")}
            className="border border-burgundy/60 px-8 py-4 text-xs uppercase tracking-[0.3em] text-burgundy transition-colors duration-300 hover:bg-burgundy hover:text-parchment"
          >
            Quiero el libro de mi familia
          </button>
          <a
            href="/shelf"
            className="border border-sumi/30 px-8 py-4 text-xs uppercase tracking-[0.3em] text-sumi transition-colors duration-300 hover:border-burgundy hover:text-burgundy"
          >
            Explorar estante 3D →
          </a>
        </div>
      </div>

      {/* Páginas miniaturas abajo */}      <div className="mt-10 flex justify-center gap-3">
        {PAGINAS.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              setPaginaActual(i);
              gsap.fromTo(".libro-hoja-actual", { autoAlpha: 0, scale: 0.95 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power2.out" });
            }}
            className={`libro-pagina h-16 w-12 overflow-hidden rounded border-2 transition-all duration-300 ${
              i === paginaActual
                ? "border-burgundy shadow-[0_0_0_1px_#7A3B43]"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <img src={p.src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </section>
  );
}