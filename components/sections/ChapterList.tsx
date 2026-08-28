"use client";

import { RETRATOS } from "@/lib/archive";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const chapters = [
  {
    num: "01",
    name: "María Eugenia — 84 años",
    desc: "Llegué a Medellín con una mano atrás y otra adelante, como dicen. Venía del campo, con las uñas gastadas de arrancar café y una berraquera que una no sabe que tiene hasta que la necesita. Mi primer trabajo fue en una emisora chiquitica, de esas que transmiten desde la sala de la casa, con el micrófono colgando de un clavo y el control de sonido que era una perilla que chirriaba. Don Rodrigo, el director, me puso frente a ese micrófono y me dijo: “Lea, mija.” Yo, toda nerviosa, empecé a leer el noticiero. Pero a la mitá se me secó la boca. Las palabras se me quedaron pegadas en la garganta como si fueran de papel periódico mojado. Me quedé muda. El silencio era tan profundo que se oían hasta las moscas. Don Rodrigo me miró, sonrió con esa sonrisa que él tenía, y dijo al aire: “Señores, la señorita está teniendo su bautizo de fuego.” La gente empezó a llamar a la emisora para decirme que no me preocupara, que a todos nos pasaba, que siguiera adelante. Esa noche lloré. Pero al otro día volví. Y no paré hasta cumplir sesenta años de oficio. La radio me enseñó que uno no nace sabiendo: uno se va haciendo, a punta de tropezones y de ganas. Y que el micrófono, como la vida, perdona si uno habla con el corazón.",
    retrato: RETRATOS.senora,
  },
  {
    num: "02",
    name: "Rafael — 79 años",
    desc: "El primer reloj que me trajeron pa' arreglar fue un despertador viejo, de esos con carátula amarilla y manecilas doradas que parecían de oro. Mi papá lo trajo a la casa envuelto en un trapo y me dijo: “Mire a ver si puede hacer que funcione.” Yo tenía doce años y no sabía ni por dónde se abría esa vaina. Pero me senté en la mesa del comedor, lo pusé boca abajo y empecé a desarmarlo pieza por pieza. Las fui poniendo en orden sobre un pañuelo blanco, como quien hace un altar. Mi mamá casi me mata cuando vió los tornilos regados por toda la mesa. Pero mi papá la calmó: “Déjelo quieto, que esto es cosa de hombresh.” Pasé tres días armando y desarmando esa máquina, entendiendo cómo encajaba cada pieza, como si estuviera aprendiendo el lenguaje del tiempo. Al cuarto día, cuando el segundero empezó a caminar otra ves… uy, qué cosa tan berraca. Ese tictac sonaba como si el tiempo mismo me estuviera diciendo: “Bien echo, Rafael, bien echo.” Sesenta años después, todavía siento lo mismo cada ves que un reloj vuelve a la vida. Y es que uno no arregla solamento mecanismos. Uno arregla recuerdos.",
    retrato: RETRATOS.joven,
  },
  {
    num: "03",
    name: "Margarita — 76 años",
desc: "Mi taller no es un taller: es mi casa entera. Los pinceles están por todas partes, en la cocina, en el baño, en la mesita de noche. Los gatos se acuestan sobre los lienzos aún mojados y me miran con cara de \"esa mancha no quedó bien.\" Llegué a tener hasta diecisiete bebés en la casa, más los míos. Les tenía un corralito especial donde se quedaban seguros. Primero fueron los perros: la Layla y sus cachorros. De una camada de nueve, la más especial se quedó conmigo: mi Lorenza. Mi amor, repartido entre colas que se movían y ojos que miraban con más fidelidad que cualquier humano. Lorenza vivió casi catorce años, y Layla se fue rondando los diecisiete. Mis compañeras de vida. Hasta el día de hoy tengo sus urnas conmigo, porque si algunos guardan fotos, yo guardo cenizas. La pintura me salvó. Estudié en la Escuela de Artes y Letras, hice carrera en arte y decoración. Con Rocha empecé a trabajar óleo. Mi primera obra seria en esa técnica era una composición en tonos rosas y verdosos, con un cielo claro, parecía una alcachofa. En esa época mi trabajo tenía una fuerte carga orgánica: formas naturales, estructuras vegetales, elementos casi oníricos. La influencia de El Bosco era clarísima. Curiosamente, algunos cuadros de ese entonces todavía existen; mi sobrina Marisa tiene dos o tres enmarcados en su casa. Es extraño reencontrarse con esas primeras obras y darse cuenta de que, sí, una tenía talento. Pintar es como respirar: si lo dejo de hacer, me ahogo. Y aquí, entre gatos, perros, pinceles y el olor a óleo y aguarrás, he encontrado lo que mucha gente busca toda la vida y nunca encuentra: la paz. Aunque sea una paz un poco alborotada.",
    retrato: RETRATOS.dosMujeres,
  },
  {
    num: "04",
    name: "Antonio — 77 años",
    desc: "Siempre me gustó montar a caballo. Con los amigotes, todos los años nos íbamos de cabalgata; eso era cuando el cuerpo aguantaba y el aguardiente bajaba como agüita. En una de esas jornadas, sintiéndome el jinete más berraco y al calor de los tragos, ni cuenta me di de que la cincha se soltó. El mundo se me puso al revés, y no lo digo en sentido figurado: en un parpadeo pasé de dominar el paisaje de las montañas de Fredonia a quedar patas pa' arriba, con la cabeza balanceándose peligrosamente entre las patas de la yegua. Yo veía los cascos del animal a centímetros de mi nariz. Así que, con la dignidad más arrastrada que el sombrero aguadeño que lucía orgullosamente (regalo de mi hijjo mayor), pude confirmar dos verdades: que definitivamente esa yegua era una santa y que el aguardiente, ciertamente, tiene la magia de hacerle ver a uno la vida desde otra perespectiva… ¡Eh, ave maría!",
    retrato: RETRATOS.dosHombres,
  },
];

export default function ChapterList() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const burgundy =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--color-burgundy")
          .trim() || "#7A3B43";

      if (!reduced) {
        gsap.from(".chapter-row", {
          y: 48,
          autoAlpha: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".chapters-list",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // Quien pide menos movimiento no debería recibir una tarjeta que gira y
      // persigue el cursor: el hover entero queda fuera en ese caso.
      if (reduced) return;

      // El hover trae el retrato de esa persona hasta el cursor. Antes la
      // tarjeta salía vacía; ahora la fila entrega exactamente lo que promete.
      const rows = gsap.utils.toArray<HTMLElement>(".chapter-row", root.current);
      const cleanups: Array<() => void> = [];

      rows.forEach((row) => {
        const name = row.querySelector(".chapter-name");
        const card = row.querySelector<HTMLElement>(".chapter-card");
        const inner = row.querySelector<HTMLElement>(".chapter-card-inner");

        const tl = gsap.timeline({ paused: true });
        tl.to(name, { color: burgundy, x: 16, duration: 0.35, ease: "power2.out" }, 0);
        // La entrada de la tarjeta se anima en la capa interior. Compartiendo
        // elemento con el seguimiento del cursor, ambos escribían `y` a la vez
        // y al salir de la fila el retrato temblaba.
        if (inner) {
          tl.fromTo(
            inner,
            { autoAlpha: 0, y: 26, scale: 0.94, rotate: -2 },
            { autoAlpha: 1, y: 0, scale: 1, rotate: 0, duration: 0.45, ease: "power2.out" },
            0
          );
        }

        // El retrato sigue al cursor con retardo: da peso físico al gesto.
        const quickY = card ? gsap.quickTo(card, "y", { duration: 0.5, ease: "power3.out" }) : null;
        const onMove = (e: MouseEvent) => {
          if (!quickY) return;
          const rect = row.getBoundingClientRect();
          quickY((e.clientY - rect.top - rect.height / 2) * 0.35);
        };

        const enter = () => tl.play();
        const leave = () => {
          tl.reverse();
          quickY?.(0);
        };

        row.addEventListener("mouseenter", enter);
        row.addEventListener("mouseleave", leave);
        row.addEventListener("mousemove", onMove);
        cleanups.push(() => {
          row.removeEventListener("mouseenter", enter);
          row.removeEventListener("mouseleave", leave);
          row.removeEventListener("mousemove", onMove);
          tl.kill();
        });
      });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: root }
  );

  return (
    <section ref={root} id="capitulos" className="relative mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-28">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-mute">Relatos</p>
      <h2 className="mt-4 font-display text-4xl font-light italic text-sumi md:text-5xl">
        Capítulos del tiempo
      </h2>
      {/* Cada fila es número + contenido a ancho completo. El retrato hover
          se superpone desde la derecha sin robarle espacio al texto. */}
      <ul className="chapters-list mt-16">
        {chapters.map((c) => (
          <li
            key={c.num}
            className="chapter-row relative grid grid-cols-[auto_1fr] items-start gap-4 border-t border-sumi/30 py-8 last:border-b md:gap-8 md:py-10"
            style={{ willChange: "transform, opacity" }}
          >
            <span className="font-display text-xs tracking-[0.3em] text-slate-mute">
              {c.num}
            </span>
            <div className="flex flex-col gap-4 md:pr-56">
              <span className="chapter-name font-display text-2xl font-light text-sumi md:text-4xl">
                {c.name}
              </span>
              {/* En móvil retrato + descripción visibles siempre */}
              <div className="flex items-start gap-4 md:hidden">
                <img
                  src={c.retrato.thumb}
                  alt=""
                  loading="lazy"
                  className="mt-1 h-24 w-16 shrink-0 rounded object-cover shadow-[0_8px_20px_-10px_rgba(43,43,42,0.4)]"
                />
                <p className="text-base leading-relaxed text-sumi/70">{c.desc}</p>
              </div>
              {/* En escritorio descripción ocupa todo el ancho disponible;
                  el retrato aparece en hover superpuesto desde la derecha. */}
              <p className="hidden text-base leading-[1.8] text-sumi/70 md:block md:text-lg">
                {c.desc}
              </p>
            </div>

            {/* Retrato hover: flota a la derecha, no comprime el texto.
                Si la ventana es angosta se oculta para no salirse. */}
            <figure
              className="chapter-card pointer-events-none absolute right-0 top-1/2 z-20 hidden w-52 -translate-y-1/2 2xl:block"
              aria-hidden="true"
            >
              <div className="chapter-card-inner opacity-0">
                <img
                  src={c.retrato.thumb}
                  alt=""
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover shadow-[0_24px_60px_-24px_rgba(43,43,42,0.7)]"
                />
                <figcaption className="mt-2 bg-burgundy px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-parchment">
                  Capítulo {c.num}
                </figcaption>
              </div>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
