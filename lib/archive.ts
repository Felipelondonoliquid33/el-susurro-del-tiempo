/**
 * Catálogo del archivo revelado.
 *
 * Las placas se generan con `tools/build-archive.py` a partir del material
 * bruto de marketing. Este módulo es la única fuente de rutas: si una placa
 * cambia de nombre, se cambia aquí y no en siete componentes.
 */

export type Plate = {
  /** Ruta a la placa a resolución completa. */
  src: string;
  /** Variante de 640px para grillas, tarjetas y hovers. */
  thumb: string;
  /** Texto alternativo en español; vacío sólo si la placa es decorativa. */
  alt: string;
};

const plate = (slug: string, alt: string): Plate => ({
  src: `/assets/archive/${slug}.webp`,
  thumb: `/assets/archive/${slug}@sm.webp`,
  alt,
});

/** Columnas de la galería, de fuera hacia dentro. El centro lo ocupa el video. */
export const GALLERY = {
  outerLeft: plate("paisaje-quebrada", "Quebrada entre piedras, fotografía de archivo"),
  innerLeft: [
    plate("gente-pareja-roca", "Una pareja descansa sobre una roca al sol"),
    plate("obj-maquina", "Máquina de escribir Smith-Corona sobre una cómoda"),
  ],
  // El río se fue a la portada y el puente ocupó su sitio: los dos se
  // intercambiaron para que la apertura la abra la fotografía del río.
  central: plate("paisaje-puente", "Puente colgante sobre el río, fotografía de archivo"),
  innerRight: [
    plate("doc-carta", "Carta manuscrita doblada por el uso"),
    plate("gente-familia-casa", "Una familia posa frente a la casa"),
  ],
  outerRight: plate("gente-dos-hombres", "Dos hombres de sombrero, retrato de cuerpo entero"),
} as const;

/** Las reliquias: objetos que sobrevivieron a sus dueños. */
export const RELIQUIAS: Array<Plate & { title: string; note: string }> = [
  {
    ...plate("obj-maquina-manos", "Manos sobre el teclado de una Smith-Corona"),
    title: "La máquina",
    note: "Una Smith-Corona Sterling. Escribió cartas que aún se leen.",
  },
  {
    ...plate("obj-baul", "Baúl de viaje tachonado con las iniciales «de S.»"),
    title: "El baúl",
    note: "Tachonado con las iniciales de la familia. Cruzó una cordillera.",
  },
  {
    ...plate("obj-singer", "Máquina de coser Singer sobre su mesa de hierro"),
    title: "La Singer",
    note: "El pedal marcaba el compás de las tardes.",
  },
  {
    ...plate("obj-rosario", "Rosario extendido sobre una Biblia abierta"),
    title: "El rosario",
    note: "Descansa sobre el Cantar de los Cantares, donde quedó la última vez.",
  },
  {
    ...plate("obj-arana", "Araña de cristal vista desde abajo"),
    title: "La araña",
    note: "Cristal sobre la mesa donde se decidían las cosas importantes.",
  },
  {
    ...plate("obj-lentes-libro", "Anteojos apoyados sobre un libro abierto"),
    title: "Los anteojos",
    note: "Quedaron marcando la página. Nadie se atrevió a moverlos.",
  },
  {
    ...plate("obj-anillo", "Anillo en su estuche de terciopelo"),
    title: "El anillo",
    note: "Terciopelo gastado en las esquinas de tanto abrirlo.",
  },
  {
    ...plate("obj-libro-floral", "Libro forrado en tela floral"),
    title: "El cuaderno",
    note: "Forrado a mano. Adentro, una letra que ya no se enseña.",
  },
];

/** Retratos que acompañan a cada capítulo. */
export const RETRATOS = {
  senora: plate("retrato-senora", "Retrato de estudio de una señora mayor"),
  joven: plate("retrato-joven", "Retrato de estudio de un hombre joven"),
  dosMujeres: plate("retrato-dos-mujeres", "Retrato de dos mujeres, madre e hija"),
  mujerSilla: plate("retrato-mujer-silla", "Mujer de pie junto a una silla"),
  dosHombres: plate("gente-dos-hombres", "Dos hombres de sombrero, retrato de cuerpo entero"),
} as const;

/**
 * Documentos: el sustrato de papel de la sección de pasajes.
 *
 * Fuera queda `doc-oficial`: es papel con membrete de la Vicepresidencia de la
 * República y la palabra «PRIVADO» perfectamente legible. Detrás de una cita de
 * Borges resultaba desconcertante, y su uso plantea además una cuestión de
 * derechos que no toca resolver aquí.
 */
export const DOCUMENTOS = [
  plate("doc-manuscrito", "Manuscrito a tinta sobre papel amarillado"),
  plate("doc-ledger", "Libro de cuentas abierto por la mitad"),
  plate("doc-libreta", "Libreta de apuntes con la letra corrida"),
  plate("doc-mecanografiado", "Página mecanografiada con correcciones a mano"),
];

/**
 * El reel de páginas al viento.
 *
 * Se recorre entero y en bucle, así que conviene alternar naturalezas —
 * paisaje, carta, objeto, retrato — para que ninguna vuelta se parezca a la
 * anterior. El orden importa: es el ritmo de la tira.
 */
export const REEL = [
  plate("paisaje-arboleda", "Arboleda al atardecer"),
  plate("doc-carta", "Carta manuscrita doblada por el uso"),
  plate("obj-maquina", "Máquina de escribir Smith-Corona"),
  plate("retrato-senora", "Retrato de estudio de una señora mayor"),
  plate("paisaje-puente", "Puente colgante sobre el río"),
  plate("doc-ledger", "Libro de cuentas abierto"),
  plate("gente-jinete", "Jinete en el camino"),
  plate("obj-rosario", "Rosario sobre una Biblia abierta"),
  plate("paisaje-vias", "Vías del tren entre el corte de la montaña"),
  plate("retrato-joven", "Retrato de estudio de un hombre joven"),
  plate("doc-cuaderno", "Cuaderno de tapas gastadas"),
  plate("obj-singer", "Máquina de coser Singer"),
  plate("gente-mujeres", "Dos mujeres junto al árbol"),
  plate("paisaje-quebrada", "Quebrada entre piedras"),
  plate("gente-rio", "Bañistas en el río"),
  plate("gente-hermanos", "Cuatro hermanos sentados en la ladera"),
  plate("campo-caballos", "Dos caballos en el potrero"),
] as const;
