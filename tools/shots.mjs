/**
 * shots.mjs — Contactos visuales de la página en scroll.
 *
 * Lenis + ScrollTrigger sólo revelan sus fallos a media animación, así que en
 * vez de fotografiar secciones sueltas se recorre la página entera y se dispara
 * a intervalos fijos de scroll.
 *
 * Uso:  node tools/shots.mjs http://localhost:60681 [salida]
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const url = process.argv[2] ?? "http://localhost:3000";
const outDir = process.argv[3] ?? "shots";
const STEPS = 22;

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(url, { waitUntil: "networkidle" });
// Las fuentes de Google cambian la métrica del titular: sin esperarlas, el
// primer contacto sale con el layout equivocado.
await page.evaluate(() => document.fonts.ready);
// El telón bloquea el scroll mientras está bajado: fotografiar antes de que
// se retire produce veintitrés capturas idénticas de la pantalla de carga.
await page
  .waitForSelector('[aria-label*="Cargando"]', { state: "detached", timeout: 20000 })
  .catch(() => console.log("aviso: el telón no se retiró a tiempo"));
await page.waitForTimeout(1800);

const total = await page.evaluate(
  () => document.documentElement.scrollHeight - window.innerHeight
);
console.log(`altura scrollable: ${total}px`);

// Se avanza con la rueda real en vez de window.scrollTo: Lenis se alimenta de
// eventos wheel, y forzar la posición desde fuera produce capturas de estados
// que un usuario nunca llega a ver.
const step = Math.round(total / STEPS);
await page.mouse.move(720, 450);

for (let i = 0; i <= STEPS; i++) {
  if (i > 0) {
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(900); // Lenis suaviza ~1.2s; 900ms basta para asentar
  }
  const y = await page.evaluate(() => Math.round(window.scrollY));
  const name = `${outDir}/${String(i).padStart(2, "0")}.png`;
  await page.screenshot({ path: name });
  process.stdout.write(`${i}:${y} `);
}

console.log(`\n${STEPS + 1} contactos en ${outDir}/`);
if (errors.length) {
  console.log("\nerrores de consola:");
  for (const e of [...new Set(errors)]) console.log("  ! " + e);
} else {
  console.log("consola limpia");
}

await browser.close();
