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

          {/* El formulario envía a la API real. Los emails se guardan en
              `data/suscriptores.json` y puedes consultarlos cuando quieras.
              Cuando configures Resend/Brevo, se reenviarán automáticamente
              a tu correo. */}
          <form
            className="footer-reveal mt-12"
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
            <label htmlFor="newsletter-email" className="text-sm text-parchment/80">
              Recibe noticias del proyecto
            </label>
            <div ref={magnet} className="mt-3 flex flex-col gap-3 py-2 sm:flex-row sm:items-center">
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="tu@correo.com"
                className="w-full border-b border-parchment/55 bg-transparent py-3 text-parchment transition-colors placeholder:text-parchment/60 focus:border-sakura focus:outline-none"
              />
              <button
                data-magnet
                type="submit"
                disabled={sent}
                className="shrink-0 border border-parchment/55 px-6 py-3 text-xs uppercase tracking-[0.25em] transition-colors duration-300 hover:border-sakura hover:text-sakura disabled:opacity-60"
                style={{ willChange: "transform" }}
              >
                {sent ? "Gracias" : "Unirme"}
              </button>
            </div>
            {sent && (
              <p className="mt-3 text-sm text-sakura" role="status">
                ¡Gracias! Te escribiremos pronto a tu correo.
              </p>
            )}
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
