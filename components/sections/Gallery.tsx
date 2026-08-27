"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GALLERY } from "@/lib/archive";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * El muro del archivo.
 *
 * Cinco columnas de placas se separan con el scroll y, desde el hueco que
 * dejan en el centro, el video crece hasta ocupar la pantalla entera. Es el
 * único momento de la página en el que el pergamino desaparece: pasar de la
 * fotografía quieta a la voz que lee es todo el argumento del proyecto.
 */
export default function Gallery() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const central = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;
      if (!root.current || !stage.current || !central.current || !overlay.current) return;

      // El recorte inicial calca la caja de la placa central. Se mide en cada
      // refresh (resize, cambio de fuentes) para que nunca quede desalineado.
      //
      // Se usa geometría de offset y no `getBoundingClientRect`: la columna
      // central lleva su propio tween de `yPercent`, así que el rect incluye el
      // desplazamiento actual y, si el refresh caía con la línea de tiempo a
      // medias, el recorte nacía desalineado unos veinte píxeles.
      const startInset = () => {
        const c = central.current;
        const s = stage.current;
        if (!c || !s) return "inset(0px)";
        const top = c.offsetTop - s.offsetTop;
        const left = c.offsetLeft - s.offsetLeft;
        return `inset(${top}px ${s.offsetWidth - left - c.offsetWidth}px ${
          s.offsetHeight - top - c.offsetHeight
        }px ${left}px)`;
      };

      // El velo nace apagado (ver globals.css) para que, sin animación, quede
      // a la vista el muro de placas en vez de un video a pantalla completa.
      gsap.set(overlay.current, { opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=160%",
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

      // Las columnas se abren en direcciones opuestas: las de fuera suben,
      // las de dentro bajan. El ojo lee el hueco antes de que el video llegue.
      tl.to(".gal-col-outer", { yPercent: -14, ease: "none" }, 0)
        .to(".gal-col-inner", { yPercent: 10, ease: "none" }, 0)
        .to(".gal-col-central", { yPercent: -4, ease: "none" }, 0)
        .fromTo(
          overlay.current,
          { clipPath: startInset },
          { clipPath: "inset(0px)", ease: "none" },
          0.32
        )
        // El muro se apaga mientras el video crece. Si se queda a plena
        // opacidad debajo, el recorte se lee como una ventana mal pegada
        // encima de las placas en vez de como una que se abre.
        .to(".gal-wall", { autoAlpha: 0, ease: "none", duration: 0.35 }, 0.4)
        .fromTo(
          ".gal-title",
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, ease: "none" },
          0.55
        );
    },
    { scope: root }
  );

  return (
    <section id="archivo" ref={root} className="relative">
      <div ref={stage} className="gallery-stage relative h-dvh overflow-hidden">
        {/* Las cinco columnas. Las exteriores sangran fuera del encuadre a
            propósito: sugieren que el archivo continúa más allá de la pantalla. */}
        {/* Las columnas se miden en alto de pantalla, no por proporción de la
            imagen: así el muro llena el encuadre en vez de flotar desparejo,
            y la placa central queda como una ventana neta que el video abre. */}
        {/* En un móvil de 390px no hay muro posible: cinco columnas dejaban
            tiras de 74px y hasta tres seguían siendo astillas de 1:3. Ahí se
            renuncia al muro y queda una sola placa, grande y legible, de la que
            el video sale igual. El muro es un lujo de pantalla ancha. */}
        <div className="gal-wall absolute inset-0 flex items-center justify-center gap-[1.2vw] px-6 md:px-[1vw]">
          <Column className="gal-col-outer hidden h-[84vh] w-[19vw] md:flex">
            <Plate plate={GALLERY.outerLeft} />
          </Column>

          <Column className="gal-col-inner hidden h-[74vh] w-[19vw] md:flex">
            {GALLERY.innerLeft.map((p) => (
              <Plate key={p.src} plate={p} />
            ))}
          </Column>

          <div
            ref={central}
            className="gal-col-central relative flex h-[58vh] w-full max-w-[420px] flex-col md:h-[56vh] md:w-[26vw] md:max-w-none"
            style={{ willChange: "transform" }}
          >
            <Plate plate={GALLERY.central} />
          </div>

          <Column className="gal-col-inner hidden h-[74vh] w-[19vw] md:flex">
            {GALLERY.innerRight.map((p) => (
              <Plate key={p.src} plate={p} />
            ))}
          </Column>

          <Column className="gal-col-outer hidden h-[84vh] w-[19vw] md:flex">
            <Plate plate={GALLERY.outerRight} />
          </Column>
        </div>

        {/* El video vive siempre a pantalla completa; lo que se anima es el
            recorte. Así no hay reflow ni escalado borroso. */}
        <div
          ref={overlay}
          className="gal-overlay absolute inset-0 bg-sumi"
          style={{ clipPath: "inset(0px)", willChange: "clip-path" }}
        >
          <video
            ref={video}
            className="h-full w-full object-cover"
            poster="/assets/video/lectura-poster.webp"
            preload="metadata"
            loop
            muted
            playsInline
            aria-label="Lectura en voz alta de uno de los libros"
          >
            <source src="/assets/video/lectura.webm" type="video/webm" />
            <source src="/assets/video/lectura.mp4" type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sumi/70 via-transparent to-sumi/25" />
        </div>

        <h2
          className="gal-title pointer-events-none absolute inset-x-0 bottom-[12vh] z-10 px-6 text-center font-display text-[clamp(28px,4.4vw,64px)] font-light italic leading-tight text-parchment opacity-0"
          style={{ willChange: "transform, opacity" }}
        >
          Toda casa guarda un archivo.
          <br />
          Casi nadie lo ha abierto.
        </h2>

        {/* Mismo mensaje para quien navega sin animaciones: ahí el velo del
            video nunca se enciende y el titular anterior no llega a verse. */}
        <p className="gal-static-note mx-auto max-w-2xl px-6 pt-14 text-center font-display text-[clamp(24px,3.4vw,44px)] font-light italic leading-tight text-sumi">
          Toda casa guarda un archivo. Casi nadie lo ha abierto.
        </p>
      </div>
    </section>
  );
}

function Column({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <div
      className={`relative flex-col gap-[2vw] md:gap-[1.2vw] ${className}`}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
}

/** Reparte el alto de su columna a partes iguales y recorta al centro. */
function Plate({ plate }: { plate: { src: string; alt: string } }) {
  return (
    <div className="relative w-full flex-1 overflow-hidden">
      <img
        src={plate.src}
        alt={plate.alt}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
