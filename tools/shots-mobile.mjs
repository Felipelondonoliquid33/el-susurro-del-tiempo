/**
 * shots-mobile.mjs — El mismo recorrido en un iPhone.
 *
 * Los carriles horizontales y los paneles fijos son lo primero que se rompe en
 * pantalla estrecha, así que conviene mirarlos antes de dar nada por bueno.
 *
 * Uso:  node tools/shots-mobile.mjs http://localhost:60681 [salida]
 */
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";

const url = process.argv[2] ?? "http://localhost:3000";
const outDir = process.argv[3] ?? "shots-mobile";
const STEPS = 16;

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext(devices["iPhone 13"]);
const page = await context.newPage();

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
// El telón bloquea el scroll mientras está bajado.
await page
  .waitForSelector('[aria-label*="Cargando"]', { state: "detached", timeout: 20000 })
  .catch(() => console.log("aviso: el telón no se retiró a tiempo"));
await page.waitForTimeout(1800);

const total = await page.evaluate(
  () => document.documentElement.scrollHeight - window.innerHeight
);
const step = Math.round(total / STEPS);
console.log(`altura scrollable: ${total}px`);

// En táctil no hay rueda: se empuja la posición y se deja asentar a Lenis.
for (let i = 0; i <= STEPS; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), step * i);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${outDir}/${String(i).padStart(2, "0")}.png` });
  process.stdout.write(".");
}

// Desbordamiento lateral: el síntoma clásico de un carril mal contenido.
const overflow = await page.evaluate(() => ({
  scrollW: document.documentElement.scrollWidth,
  clientW: document.documentElement.clientWidth,
}));
console.log(`\nancho documento ${overflow.scrollW} / ventana ${overflow.clientW}`);
if (overflow.scrollW > overflow.clientW + 1) console.log("  ! desborde horizontal");

if (errors.length) {
  console.log("errores de consola:");
  for (const e of [...new Set(errors)]) console.log("  ! " + e);
} else {
  console.log("consola limpia");
}

await browser.close();
