"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Tiempo mínimo en pantalla: por debajo, la carga parpadea en vez de leerse. */
const MINIMO_MS = 1000;

/** Techo de seguridad: pase lo que pase con la red, el telón se levanta. */
const MAXIMO_MS = 7000;

const ListoContext = createContext(false);

/** `true` cuando la cortina ya se levantó. Las secciones esperan a esto para
 *  no gastar su animación de entrada por debajo del telón. */
export function useAppListo() {
  return useContext(ListoContext);
}

export function Preloader({ children }: { children: React.ReactNode }) {
  const [fuera, setFuera] = useState(false);

  // El telón bloquea el scroll del body mientras está bajado, y eso hace
  // desaparecer la barra de desplazamiento: todo lo medido en `vw` cambia de
  // ancho al soltarlo. Sin este refresh, los `pin` de Gallery, Reliquias y Foco
  // se quedan con las coordenadas del layout sin barra.
  useEffect(() => {
    if (!fuera) return;
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [fuera]);

  return (
    <ListoContext.Provider value={fuera}>
      {children}
      {/* El telón vive en su propio componente para que, al retirarse, React lo
          desmonte y `useGSAP` revierta su contexto. Cuando era parte de este
          componente el contexto sobrevivía con referencias al DOM ya separado. */}
      {!fuera && <Telon onFin={() => setFuera(true)} />}
    </ListoContext.Provider>
  );
}

/**
 * La cortina.
 *
 * Sello, nombre y una regla de tinta que se llena mientras el archivo termina
 * de cargar. La barra sigue el progreso real de las imágenes y las fuentes —
 * no un temporizador— y al completarse el papel se levanta y descubre la
 * portada.
 */
function Telon({ onFin }: { onFin: () => void }) {
  const [listo, setListo] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const barra = useRef<HTMLDivElement>(null);
  const cifra = useRef<HTMLSpanElement>(null);
  const progreso = useRef({ valor: 0 });

  // ── Progreso real ─────────────────────────────────────────────────────────
  useEffect(() => {
    let vivo = true;
    const inicio = performance.now();
    const proxy = progreso.current;

    const medir = () => {
      // Sólo cuentan las imágenes que el navegador va a pedir ya. Las marcadas
      // como `lazy` no se descargan hasta entrar en pantalla, así que nunca
      // llegan a `complete` y dejaban la barra clavada para siempre.
      const imgs = Array.from(document.images).filter((i) => i.loading !== "lazy");
      const cargadas = imgs.filter((i) => i.complete).length;
      return imgs.length ? cargadas / imgs.length : 1;
    };

    let fuentesListas = false;
    document.fonts.ready.then(() => {
      fuentesListas = true;
    });

    // Los nodos se resuelven una sola vez: hacerlo dentro del `onUpdate`
    // suponía dos `querySelector` por fotograma y por tween.
    const pintar = () => {
      const p = proxy.valor;
      if (barra.current) gsap.set(barra.current, { scaleX: p });
      if (cifra.current) cifra.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
    };

    const rematar = () => {
      if (!vivo) return;
      vivo = false;
      window.clearInterval(id);
      window.clearTimeout(alarma);
      gsap.to(proxy, {
        valor: 1,
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
        onUpdate: pintar,
        onComplete: () => setListo(true),
      });
    };

    const id = window.setInterval(() => {
      if (!vivo) return;
      const real = medir() * 0.85 + (fuentesListas ? 0.15 : 0);
      const transcurrido = (performance.now() - inicio) / MINIMO_MS;
      // El mínimo actúa como techo: aunque todo esté en caché, la barra sube
      // a un ritmo que se puede leer.
      const objetivo = Math.min(real, transcurrido);

      // `overwrite` es obligatorio: sin él cada vuelta del intervalo apilaba un
      // tween más sobre el mismo objeto y acababan peleándose por el valor.
      gsap.to(proxy, {
        valor: objetivo,
        duration: 0.25,
        ease: "power2.out",
        overwrite: true,
        onUpdate: pintar,
      });

      if (real >= 0.999 && transcurrido >= 1) rematar();
    }, 100);

    // Techo de seguridad con su propio temporizador. Vivía dentro del intervalo
    // y por tanto dependía de que el intervalo siguiera corriendo: bastaba que
    // el hilo principal se congestionara para dejar el telón bajado para siempre.
    const alarma = window.setTimeout(rematar, MAXIMO_MS);

    return () => {
      vivo = false;
      window.clearInterval(id);
      window.clearTimeout(alarma);
      // Los tweens del proxy no cuelgan de ningún contexto de useGSAP.
      gsap.killTweensOf(proxy);
    };
  }, []);

  // ── Bloqueo del scroll mientras el telón está montado ─────────────────────
  useEffect(() => {
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, []);

  // ── Entrada ───────────────────────────────────────────────────────────────
  // Sin dependencias, a propósito: cuando entrada y salida compartían un mismo
  // hook con `dependencies: [listo]`, al cambiar la dependencia se volvía a
  // ejecutar el bloque de entrada y el sello reaparecía desde cero justo
  // mientras la cortina subía.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap
        .timeline()
        .from("[data-sello]", { scale: 0.86, autoAlpha: 0, duration: 1.1, ease: "expo.out" })
        .from(
          "[data-letra]",
          { yPercent: 110, autoAlpha: 0, duration: 0.7, stagger: 0.028, ease: "power3.out" },
          0.25
        )
        .from("[data-pie]", { autoAlpha: 0, duration: 0.6 }, 0.6);
    },
    { scope: panel }
  );

  // ── Salida ────────────────────────────────────────────────────────────────
  useGSAP(
    () => {
      if (!listo) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        onFin();
        return;
      }

      // La cortina se recoge hacia arriba descubriendo la portada, y el cuerpo
      // se adelanta un poco para que el gesto tenga profundidad.
      gsap
        .timeline({ onComplete: onFin })
        .to("[data-cuerpo]", { yPercent: -12, autoAlpha: 0, duration: 0.45, ease: "power2.in" })
        .to(
          panel.current,
          { clipPath: "inset(0% 0% 100% 0%)", duration: 0.95, ease: "expo.inOut" },
          "-=0.2"
        );
    },
    { scope: panel, dependencies: [listo] }
  );

  return (
    <div
      ref={panel}
      role="status"
      aria-live="polite"
      aria-label="Cargando El Susurro del Tiempo"
      // Por debajo de <ParchmentOverlay> (z-90) a propósito: así el telón
      // recibe la misma textura de papel que el resto de la página.
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-parchment"
      style={{ clipPath: "inset(0% 0% 0% 0%)", willChange: "clip-path" }}
    >
      <div data-cuerpo className="flex flex-col items-center px-6">
        <img
          data-sello
          src="/assets/logo-mark.webp"
          alt=""
          width={720}
          height={720}
          className="h-[clamp(120px,14vw,190px)] w-[clamp(120px,14vw,190px)] object-contain"
        />

        {/* No es un `h1`: el de la página es el titular de la portada, y tener
            dos a la vez rompe la estructura del documento. */}
        <p
          className="mt-10 flex overflow-hidden font-display text-[clamp(11px,1.1vw,14px)] uppercase tracking-[0.42em] text-sumi"
          aria-label="El Susurro del Tiempo"
        >
          {"El Susurro del Tiempo".split("").map((c, i) => (
            <span key={i} data-letra aria-hidden="true" className="inline-block">
              {c === " " ? " " : c}
            </span>
          ))}
        </p>

        {/* Regla de tinta: se llena con scaleX, sin tocar el layout. */}
        <div
          data-pie
          className="mt-8 h-px w-[min(58vw,340px)] overflow-hidden bg-sumi/15"
          aria-hidden="true"
        >
          <div
            ref={barra}
            className="h-full w-full origin-left bg-sumi"
            style={{ transform: "scaleX(0)", willChange: "transform" }}
          />
        </div>

        <span
          ref={cifra}
          data-pie
          aria-hidden="true"
          className="mt-4 font-display text-[10px] tracking-[0.35em] text-slate-mute"
        >
          000
        </span>
      </div>

      {/* Se marca también como `data-cuerpo` para que se desvanezca con el
          resto: quedaba solo en una pantalla vacía mientras subía la cortina. */}
      <p
        data-pie
        data-cuerpo
        className="absolute bottom-10 text-[11px] uppercase tracking-[0.3em] text-slate-mute"
      >
        Abriendo el archivo
      </p>
    </div>
  );
}
