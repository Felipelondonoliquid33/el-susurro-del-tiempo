/**
 * shot-footer.mjs — Fotografía el cierre en varios instantes.
 *
 * El reparto de placas, el reel de páginas y el imán del botón sólo se dejan
 * ver a mitad de animación, así que se baja al pie y se dispara en ráfaga.
 *
 * Uso:  node tools/shot-footer.mjs http://localhost:60681 [salida]
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const url = process.argv[2] ?? "http://localhost:3000";
const outDir = process.argv[3] ?? "shots-footer";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1500);

// Se baja con la rueda para que Lenis y los ScrollTrigger pasen por todos sus
// estados: un salto directo al final deja animaciones sin disparar.
await page.mouse.move(720, 450);
const total = await page.evaluate(
  () => document.documentElement.scrollHeight - window.innerHeight
);
for (let y = 0; y < total; y += 900) {
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(180);
}
await page.waitForTimeout(1200);

// Ráfaga: el reel y las ráfagas de viento cambian entre disparo y disparo.
for (let i = 0; i < 6; i++) {
  await page.screenshot({ path: `${outDir}/${i}.png` });
  await page.waitForTimeout(900);
}

// El imán: se acerca el puntero al botón y se comprueba que lo persigue.
const btn = page.locator("[data-magnet]");
if (await btn.count()) {
  const box = await btn.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2 + 46, box.y + box.height / 2 + 24);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${outDir}/magnet.png` });
    const m = await btn.evaluate((el) => getComputedStyle(el).transform);
    console.log(`transform del botón con el puntero cerca: ${m}`);
  }
}

// Hover en una fila de contacto: la etiqueta debe subir y el dato ocupar su sitio.
const row = page.locator("footer li.group").first();
if (await row.count()) {
  await row.hover();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${outDir}/row-hover.png` });
}

console.log(errors.length ? `errores: ${[...new Set(errors)].join(" | ")}` : "consola limpia");
await browser.close();
