"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToSection } from "@/lib/scroll";

const links = [
  { label: "Manifiesto", href: "#manifiesto" },
  { label: "Capítulos", href: "#capitulos" },
  { label: "Pasajes", href: "#pasajes" },
  { label: "Contacto", href: "#contacto" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    // El fondo del header no es decoración: sin él, los enlaces en sumi quedan
    // sobre los paneles oscuros de video y dejan de leerse. Sólo se desactiva
    // el ocultado al bajar, que sí es movimiento.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (!reduced && !menuOpen) {
        setVisible(y < lastY.current || y < 120);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    scrollToSection(href);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 transition-[transform,background-color,backdrop-filter] duration-500 md:px-12 ${
        scrolled || menuOpen
          ? "bg-parchment/90 backdrop-blur-md"
          : "bg-transparent"
      } ${visible || menuOpen ? "translate-y-0" : "-translate-y-full"}`}
      style={{ willChange: "transform" }}
    >
      {/* El sello recortado sobre transparencia: la versión anterior arrastraba
          el fondo verde azulado del JPG y a 36px se leía como una mancha. */}
      <button
        onClick={() => handleNav("#hero")}
        className="group flex items-center gap-3.5"
        aria-label="El Susurro del Tiempo — ir al inicio"
      >
        <img
          src="/assets/logo-mark.webp"
          alt=""
          width={720}
          height={720}
          className="h-12 w-12 object-contain transition-transform duration-500 ease-[var(--ease-out-smooth)] group-hover:scale-105 md:h-14 md:w-14"
        />
        <span className="hidden font-display text-sm uppercase tracking-[0.28em] text-sumi sm:inline">
          El Susurro del Tiempo
        </span>
      </button>

      {/* Desktop nav */}
      <nav aria-label="Navegación principal" className="hidden md:block">
        <ul className="flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <button
                onClick={() => handleNav(l.href)}
                className="text-xs uppercase tracking-[0.25em] text-sumi/70 transition-colors duration-300 hover:text-burgundy"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile menu toggle */}
      <button
        onClick={() => setMenuOpen((o) => !o)}
        className="-mr-1.5 flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden"
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuOpen}
      >
        <span
          className={`block h-px w-6 bg-sumi transition-transform duration-300 ${
            menuOpen ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`block h-px w-6 bg-sumi transition-opacity duration-300 ${
            menuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-px w-6 bg-sumi transition-transform duration-300 ${
            menuOpen ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </button>

      {/* Menú móvil. Se desliza con `transform`: animar `max-height` obligaba a
          recalcular el diseño en cada fotograma de la apertura. */}
      <div
        className={`fixed inset-x-0 top-[72px] z-40 flex origin-top flex-col items-center gap-8 bg-parchment/95 py-12 backdrop-blur-md transition-[transform,opacity,visibility] duration-500 ease-[var(--ease-out-smooth)] md:hidden ${
          menuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-4 opacity-0"
        }`}
        aria-hidden={!menuOpen}
        // Cerrado seguía siendo enfocable: cuatro botones invisibles en el
        // orden de tabulación dentro de un contenedor `aria-hidden`.
        inert={!menuOpen}
      >
        {links.map((l) => (
          <button
            key={l.href}
            onClick={() => handleNav(l.href)}
            className="text-sm uppercase tracking-[0.3em] text-sumi/80 transition-colors duration-300 hover:text-burgundy"
          >
            {l.label}
          </button>
        ))}
      </div>
    </header>
  );
}
