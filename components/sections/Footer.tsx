"use client";

import ReelDeCierre from "@/components/sections/ReelDeCierre";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/** En minúscula: la T mayúscula de antes leía como errata justo encima del
 *  handle de Instagram, que va todo en minúscula. */
const CORREO = "elsusurrodeltiempo@proton.me";

const CONTACTO = [
  { label: "Escríbenos", value: CORREO, href: `mailto:${CORREO}` },
  { label: "WhatsApp", value: "Escríbenos por WhatsApp", href: "https://wa.me/573102300078" },
  { label: "Instagram", value: "@elsusurrodeltiempo", href: "https://instagram.com/elsusurrodeltiempo" },
  { label: "Dónde estamos", value: "Bogotá — y donde haga falta", href: null },
];

/**
 * El cierre del álbum.
 *
 * Tres gestos, tomados del showroom de GSAP y traducidos al idioma de la
 * página: las placas entran apiladas y se despliegan como quien reparte
 * fotografías sobre la mesa; las filas de contacto cambian de cara al pasar
 * por encima; y el botón de envío tiene imán. Todo con transform y opacity,
 * nada que obligue al navegador a recalcular el diseño.
 */
export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const magnet = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState(false);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      // ── 1. El titular se descubre letra a letra tras su propia máscara ────
      SplitText.create(".footer-title", {
        type: "chars,lines",
        autoSplit: true,
        mask: "lines",
        onSplit(self) {
          return gsap.from(self.chars, {
            yPercent: 120,
            autoAlpha: 0,
            stagger: 0.012,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: root.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          });
        },
      });

      gsap.from(".footer-reveal", {
        y: 30,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      // El reparto de las fotografías y su vuelo en bucle viven en
      // <ReelDeCierre>, que se ocupa también de limpiar sus propios tweens.

      // ── 2. Imán elástico en el botón de envío ─────────────────────────────
      // El botón persigue al puntero dentro de un radio corto y vuelve con un
      // rebote. Se conduce desde el ticker de GSAP, no desde React, para no
      // provocar un render por cada píxel de ratón.
      const zone = magnet.current;
      const btn = zone?.querySelector<HTMLElement>("[data-magnet]");
      let removeMagnet: (() => void) | undefined;

      if (zone && btn && window.matchMedia("(pointer: fine)").matches) {
        const state = { tx: 0, ty: 0, near: false };
        const xTo = gsap.quickTo(btn, "x", { duration: 0.7, ease: "elastic.out(1, 0.35)" });
        const yTo = gsap.quickTo(btn, "y", { duration: 0.7, ease: "elastic.out(1, 0.35)" });

        const tick = () => {
          const pull = state.near && Math.hypot(state.tx, state.ty) < 130 ? 0.38 : 0;
          xTo(state.tx * pull);
          yTo(state.ty * pull);
        };

        // El ticker sólo corre mientras el puntero está sobre la zona. Añadido
        // en el montaje, hacía este cálculo en cada fotograma de toda la sesión
        // aunque nadie se hubiera acercado nunca al botón.
        const onEnter = () => {
          state.near = true;
          gsap.ticker.add(tick);
        };
        const onMove = (e: PointerEvent) => {
          const r = btn.getBoundingClientRect();
          state.tx = e.clientX - (r.left + r.width / 2);
          state.ty = e.clientY - (r.top + r.height / 2);
        };
        const onLeave = () => {
          state.tx = 0;
          state.ty = 0;
          state.near = false;
          // Un último paso devuelve el botón a su sitio; luego se apaga.
          tick();
          gsap.ticker.remove(tick);
        };

        zone.addEventListener("pointerenter", onEnter);
        zone.addEventListener("pointermove", onMove);
        zone.addEventListener("pointerleave", onLeave);

        removeMagnet = () => {
          zone.removeEventListener("pointerenter", onEnter);
          zone.removeEventListener("pointermove", onMove);
          zone.removeEventListener("pointerleave", onLeave);
          gsap.ticker.remove(tick);
        };
      }

      return () => removeMagnet?.();
    },
    { scope: root }
  );

  return (
    <footer ref={root} id="contacto" className="relative overflow-hidden bg-sumi text-parchment">
      <div className="mx-auto grid max-w-6xl gap-16 px-6 py-28 md:grid-cols-2">
        <div>
          <p className="footer-reveal text-xs uppercase tracking-[0.35em] text-sakura">
            Contacto
          </p>
          <h2 className="footer-title mt-6 font-display text-4xl font-light leading-tight md:text-5xl">
            El tiempo susurra.
            <br />
            <em className="italic text-sakura">Escuchémoslo juntos.</em>
          </h2>

          {/* Filas de contacto. El intercambio etiqueta→dato es un lujo de
              ratón: sólo se activa donde hay hover real. En táctil, y al llegar
              con el teclado, el dato está siempre a la vista — antes un móvil
              no llegaba a ver nunca el correo ni la ciudad. */}
          <ul className="footer-reveal mt-12">
            {CONTACTO.map((c) => {
              const Row = (
                <>
                  <span className="block leading-tight">
                    <span className="foot-etiqueta block text-parchment">{c.label}</span>
                    <span className="foot-dato block text-[0.72em] text-sakura">{c.value}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-sakura transition-transform duration-500 ease-[var(--ease-out-smooth)] group-hover:scale-x-100 group-focus-within:scale-x-100"
                  />
                </>
              );

              return (
                <li
                  key={c.label}
                  className="foot-fila group relative border-b border-parchment/30 py-5 font-display text-xl md:text-2xl"
                >
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="block focus-visible:outline-offset-8"
                    >
                      {Row}
                    </a>
                  ) : (
                    <div>{Row}</div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Formulario rediseñado — tarjeta de suscripción con relieve,
              el botón responde al hover con un destello de foil y al hacer
              clic se repliega para mostrar un mensaje de confirmación. */}
          <form
            className="footer-reveal mt-14"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const email = String(new FormData(form).get("email") ?? "");

              try {
                const res = await fetch("/api/newsletter", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                });

                if (res.ok) {
                  setSent(true);
                } else {
                  const err = await res.json();
                  alert(err.error || "Algo salió mal, inténtalo de nuevo.");
                }
              } catch {
                alert("No pudimos conectarnos. ¿Estás en línea?");
              }
            }}
          >
            <div className="relative rounded-sm border border-parchment/20 bg-parchment/[0.03] p-6 backdrop-blur-sm md:p-8">
              {/* Esquina decorativa — el detalle del archivo. */}
              <span className="pointer-events-none absolute -top-px left-8 h-px w-12 bg-sakura/70" />
              <span className="pointer-events-none absolute -right-px top-8 flex h-1 w-1 items-center justify-center">
                <span className="inline-block h-2 w-2 rotate-45 border border-sakura/40" />
              </span>

              <div className="flex items-start gap-3">
                <div className="mt-1 shrink-0">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <rect x="1" y="3" width="16" height="12" rx="2" stroke="#E8C5C8" strokeWidth="1.2" />
                    <path d="M2 4.5 9 10l7-5.5" stroke="#E8C5C8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-display text-base italic leading-snug text-parchment/90">
                    Recibe noticias del proyecto
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed tracking-wide text-parchment/50">
                    Sin spam, solo el trabajo callado del archivo.
                  </p>
                </div>
              </div>

              <div ref={magnet} className="relative mt-6 flex flex-col gap-3 sm:flex-row">
                <div className="group relative flex-1">
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="tu@correo.com"
                    className="w-full border-b border-parchment/30 bg-transparent py-3.5 pl-0 pr-2 text-sm text-parchment placeholder:text-parchment/40 transition-all duration-300 focus:border-sakura focus:outline-none focus:ring-0"
                  />
                  <span className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-sakura transition-all duration-500 group-focus-within:w-full" />
                </div>
                <button
                  data-magnet
                  type="submit"
                  disabled={sent}
                  className="group relative shrink-0 overflow-hidden border border-parchment/30 px-7 py-3.5 text-xs uppercase tracking-[0.28em] text-parchment transition-all duration-500 hover:border-sakura hover:text-sakura disabled:opacity-50"
                  style={{ willChange: "transform" }}
                >
                  {/* Destello foil en hover. */}
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-sakura/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative z-10 flex items-center gap-2">
                    {sent ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                          <path d="M2 7.5 5.5 11 12 3" stroke="#E8C5C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Gracias
                      </>
                    ) : (
                      <>
                        Unirme
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                          <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </div>

              {sent && (
                <div className="mt-5 flex items-center gap-3 rounded-sm border border-sakura/20 bg-sakura/[0.04] px-4 py-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
                    <circle cx="8" cy="8" r="6.5" stroke="#E8C5C8" strokeWidth="1.2" />
                    <path d="M5 8.5 7 10.5 11 6" stroke="#E8C5C8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-sm text-sakura/90" role="status">
                    Te escribiremos pronto a tu correo.
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* El archivo entero desfila por este hueco, de tres en tres. */}
        <div className="relative hidden items-center md:flex">
          <ReelDeCierre />
        </div>
      </div>

      <div className="border-t border-parchment/25">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs tracking-wide text-parchment/60 md:flex-row">
          <span>El Susurro del Tiempo © MMXXVI</span>
          <span className="italic">Una vida, un libro — Recuperar la memoria</span>
        </div>
      </div>
    </footer>
  );
}
