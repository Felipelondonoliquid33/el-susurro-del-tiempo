import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const ROOT = "C:/Users/Felipe/Documents/WEB PROJECTS/El susurro del tiempo Landing";
const REELS = `${ROOT}/exports/reels_finales`;
const LANDING = "https://el-susurro-del-tiempo.vercel.app/";
const WHATSAPP = "https://wa.me/573102300078";

// ── Datos de la cuenta ───────────────────────────────────────────────
const CREDENCIALES = {
    correo: { usuario: "elsusurrodeltiempo@proton.me", clave: "Juanita2026*" },
    instagram: { usuario: "3102300078 / elsusurrodeltiempo@proton.me", clave: "Juanita2026*" },
    tiktok: { usuario: "elsusurrodeltiempo2", clave: "Juanita2026*" },
};

// ── Grupos editoriales ────────────────────────────────────────────────
const groups = [
    ["Descubrimiento", "Presentar el problema y despertar reconocimiento emocional.", "Tu historia merece permanecer. En El Susurro del Tiempo escuchamos, escribimos y convertimos memorias familiares en libros. 📖\n\n¿De quién te gustaría conservar la historia? Escríbenos por DM o visita el enlace de la bio.\n\n#ElSusurroDelTiempo #MemoriaFamiliar #HistoriasQueImportan #LegadoFamiliar"],
    ["Objetos con memoria", "Demostrar que los objetos familiares son puertas de entrada a una historia.", "Una máquina, una carta, una fotografía: los objetos también recuerdan.\n\nLos reunimos, los ordenamos y los devolvemos dentro de un libro que la familia puede conservar.\n\nGuarda este Reel y cuéntanos qué objeto guarda tu familia.\n\n#MemoriaFamiliar #ArchivoFamiliar #HistoriasQueImportan"],
    ["Historias", "Mostrar el resultado humano: una vida concreta, no un producto genérico.", "Cada vida tiene capítulos que merecen ser escuchados.\n\nEl libro nace de una conversación, de fotografías y de la voz de quien lo vivió.\n\nSi tienes una historia familiar pendiente, escríbenos: primero conversamos.\n\n#Autobiografía #HistoriasDeVida #LegadoFamiliar #ElSusurroDelTiempo"],
    ["El oficio", "Explicar el proceso consultivo y generar confianza.", "No llegamos con un formulario de respuestas. Nos sentamos, escuchamos, grabamos, transcribimos y devolvemos cada capítulo para que la persona lo corrija.\n\nLa memoria solo la edita quien la vivió.\n\nConoce el proceso en el enlace de la bio.\n\n#ProcesoCreativo #Memoria #Escritura #ArchivoFamiliar"],
    ["Conversión", "Invitar a iniciar una conversación sin publicar precios.", "No hace falta tener la historia ordenada para empezar.\n\nHablemos de esa persona, de esas fotos y de lo que no quieres que se pierda. La primera conversación es el comienzo.\n\nEscríbenos “HISTORIA” por DM o por WhatsApp.\n\n#MemoriasFamiliares #LibroFamiliar #LegadoEmocional"],
    ["Cierre y comunidad", "Cerrar la primera secuencia y convertir atención en conversación.", "Una vida, un libro.\n\nEl tiempo susurra; nosotros aprendemos a escucharlo.\n\n¿Quieres conversar sobre el libro de tu familia? Escríbenos por DM.\n\n#ElSusurroDelTiempo #UnaVidaUnLibro #HistoriasQuePermanecen"],
];

// ── Generar entradas desde hoy (28/08/2026) ──────────────────────────
const DAY_NAMES = ["Viernes", "Sábado", "Domingo", "Lunes", "Martes", "Miércoles", "Jueves"];
const TIMES = ["19:30", "19:30", "11:00", "19:30", "12:30", "19:30", "12:30"];

const entries = Array.from({ length: 33 }, (_, i) => {
    const g = Math.min(5, Math.floor(i / 6));
    const [group, goal, copy] = groups[g];
    const d = new Date(2026, 7, 28 + i);
    return {
        n: i + 1,
        file: `Reel_${String(i + 1).padStart(2, "0")}.mp4`,
        group, goal, copy,
        day: DAY_NAMES[d.getDay()],
        date: d.toISOString().slice(0, 10),
        time: TIMES[d.getDay()],
        diaLabel: `${DAY_NAMES[d.getDay()]} ${d.getDate()} de agosto`,
    };
});

const esc = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const fh = (f) => `file:///${REELS}/${f}`.replaceAll(" ", "%20");

// ── HTML INTERACTIVO ─────────────────────────────────────────────────
const cardsHTML = entries.map((e) => `
  <article class="card" data-day="${e.day}" data-group="${e.group}">
    <div class="card-head"><span class="num">${String(e.n).padStart(2, "0")}</span><div><h3>${e.group}</h3><p class="sched">${e.diaLabel} · ${e.time} COT</p></div><span class="badge ${e.day.toLowerCase()}">${e.day}</span></div>
    <p class="goal"><b>🎯 Objetivo:</b> ${e.goal}</p>
    <div class="copy-box"><p>${esc(e.copy).replaceAll("\n", "<br>")}</p></div>
    <div class="actions"><a class="btn" href="${fh(e.file)}">📁 Abrir video</a><button class="btn copy-btn" data-copy="${esc(e.copy).replaceAll('"', "&quot;")}">📋 Copiar copy</button></div>
  </article>`).join("");

const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Calendario · El Susurro del Tiempo</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
<style>
:root{--parchment:#F4F0EA;--paper:#EFEAE1;--sumi:#2B2B2A;--burgundy:#7A3B43;--sakura:#E8C5C8;--slate:#3A5255;--font-d:'Cormorant Garamond',Georgia,serif;--font-b:'EB Garamond',Georgia,serif}*{box-sizing:border-box}body{margin:0;background:var(--parchment);color:var(--sumi);font:400 10.5pt var(--font-b);-webkit-font-smoothing:antialiased;padding:0 0 80px}h1{font:400 36pt/1 var(--font-d);color:var(--burgundy);margin:0}h2{font:400 28pt/1.1 var(--font-d);color:var(--burgundy);margin:24px 0 8px;border-bottom:1px solid var(--sakura);padding-bottom:8px}h3{font:500 14pt var(--font-d);margin:0;color:var(--burgundy)}.hero{background:var(--burgundy);color:var(--parchment);padding:48px 24px 40px;text-align:center}.hero h1{color:var(--parchment);font-size:40pt}.hero .kicker{text-transform:uppercase;letter-spacing:.25em;font-size:8pt;color:var(--sakura);margin-bottom:8px}.hero .sub{font:italic 16pt var(--font-d);color:var(--sakura);margin:10px 0 0}.container{max-width:1000px;margin:0 auto;padding:0 16px}.filtros{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0 16px;padding:0 16px;max-width:1000px;margin-left:auto;margin-right:auto}.filtros button{font:400 9pt var(--font-b);padding:6px 14px;border:1px solid var(--burgundy);background:transparent;color:var(--burgundy);border-radius:0;cursor:pointer;transition:.3s;text-transform:uppercase;letter-spacing:.08em}.filtros button.activo,.filtros button:hover{background:var(--burgundy);color:var(--parchment)}.grid{display:grid;grid-template-columns:1fr;gap:12px;padding:0 16px;max-width:1000px;margin:0 auto}@media(min-width:700px){.grid{grid-template-columns:1fr 1fr}}.card{border:1px solid #d9c9bd;background:#faf8f4;padding:14px;break-inside:avoid}.card-head{display:flex;gap:10px;align-items:flex-start;border-bottom:1px solid var(--sakura);padding-bottom:8px;margin-bottom:8px}.num{font:500 28pt var(--font-d);color:var(--burgundy);line-height:1}.sched{font-size:7.5pt;color:var(--slate);margin:2px 0 0;text-transform:uppercase;letter-spacing:.05em}.badge{font:400 7pt var(--font-b);padding:2px 8px;text-transform:uppercase;letter-spacing:.1em;margin-left:auto;white-space:nowrap;border:1px solid}.badge.lunes,.badge.martes,.badge.miércoles,.badge.jueves,.badge.viernes{color:var(--burgundy);border-color:var(--sakura)}.badge.sábado,.badge.domingo{color:var(--slate);border-color:var(--slate)}.goal{font-size:8.5pt;color:var(--slate);margin:7px 0}.copy-box{font:400 9.5pt var(--font-b);line-height:1.4;margin:7px 0 10px;background:#f4efe9;padding:10px;border-left:2px solid var(--sakura)}.actions{display:flex;gap:8px;flex-wrap:wrap}.btn{font:400 8pt var(--font-b);padding:6px 12px;border:1px solid var(--burgundy);color:var(--burgundy);text-decoration:none;cursor:pointer;transition:.3s;background:transparent;letter-spacing:.05em}.btn:hover{background:var(--burgundy);color:var(--parchment)}.btn-success{background:var(--burgundy);color:var(--parchment)!important}
/* Tutorial */
.tutorial{background:var(--paper);padding:24px 16px;margin:24px 0;max-width:1000px;margin-left:auto;margin-right:auto;border:1px solid #d9c9bd}.tutorial h2{margin-top:0;border-bottom-color:var(--burgundy)}.tutorial ol{padding-left:20px}.tutorial li{margin-bottom:10px;line-height:1.5}.tutorial strong{color:var(--burgundy)}
/* Credenciales */
.creds{background:#f4efe9;border:1px solid var(--sakura);padding:16px 20px;margin:20px 0;max-width:1000px;margin-left:auto;margin-right:auto}.creds h2{margin-top:0;border-bottom-color:var(--burgundy)}.creds table{width:100%;border-collapse:collapse;font-size:9.5pt}.creds td,.creds th{padding:8px 10px;border-bottom:1px solid var(--sakura);text-align:left}.creds th{color:var(--burgundy);font-weight:500;width:100px;font-family:var(--font-d);font-size:11pt}.creds .clave{font-family:monospace;letter-spacing:.1em;color:var(--slate)}
/* Tips */
.tips{max-width:1000px;margin:20px auto;padding:0 16px}.tips summary{font:400 12pt var(--font-d);color:var(--burgundy);cursor:pointer;padding:6px 0}.tips p{margin:6px 0;font-size:9.5pt;line-height:1.4}
</style></head><body>
<div class="hero"><p class="kicker">El Susurro del Tiempo</p><h1>Calendario de publicación</h1><p class="sub">33 Reels · 33 días · Una historia que contar</p></div>
<div class="container">
<h2>🔐 Acceso a las cuentas</h2>
</div>
<div class="creds">
<table><tr><th>📧 ProtonMail</th><td>${CREDENCIALES.correo.usuario}</td><td class="clave">${CREDENCIALES.correo.clave}</td></tr>
<tr><th>📸 Instagram</th><td>${CREDENCIALES.instagram.usuario}</td><td class="clave">${CREDENCIALES.instagram.clave}</td></tr>
<tr><th>🎵 TikTok</th><td>${CREDENCIALES.tiktok.usuario}</td><td class="clave">${CREDENCIALES.tiktok.clave}</td></tr>
</table>
<p style="margin:10px 0 0;font-size:8.5pt;color:var(--slate);">⚠️ No compartas esta página. Es solo para uso interno del proyecto.</p>
</div>

<div class="container"><h2>📋 Tutorial: cómo publicar un Reel</h2></div>
<div class="tutorial">
<ol>
<li><strong>Abrir el video:</strong> Pulsa <b>“📁 Abrir video”</b> en la tarjeta de abajo. El archivo se abrirá en tu computador.</li>
<li><strong>Pasarlo al teléfono:</strong> Si estás en el computador, envía el video por WhatsApp como <b>documento</b> (no como foto) a tu propio número. También puedes usar cable USB o Google Drive.</li>
<li><strong>Abrir Instagram:</strong> En el teléfono, abre la app de Instagram. Asegúrate de que la cuenta sea <b>@el.susurro.deltiempo</b> (ve al perfil para verificarlo).</li>
<li><strong>Crear Reel:</strong> Pulsa el <b>+</b> de la esquina superior derecha y selecciona <b>Reel</b>. Elige el video que acabas de recibir.</li>
<li><strong>No edites nada:</strong> No añadas filtros, texto ni recortes. El video ya está listo.</li>
<li><strong>Pegar el copy:</strong> En el campo de descripción, pulsa y mantén presionado hasta que aparezca <b>Pegar</b>. Pega el texto de la tarjeta. También puedes usar el botón <b>📋 Copiar copy</b> en el computador y enviártelo por WhatsApp.</li>
<li><strong>Compartir en Facebook:</strong> Antes de publicar, activa <b>Compartir también en Facebook</b> (debajo del campo de descripción).</li>
<li><strong>Publicar:</strong> Pulsa <b>Compartir</b> en la esquina superior derecha. El Reel se publicará automáticamente.</li>
<li><strong>Responder:</strong> Durante la primera hora, abre Instagram y responde todos los comentarios y mensajes que recibas.</li>
</ol>
</div>

<div class="container"><h2>📅 Calendario de publicaciones</h2></div>
<div class="filtros" id="filtros">
<button class="activo" data-filter="all">Todas</button>
<button data-filter="Descubrimiento">Descubrimiento</button>
<button data-filter="Objetos con memoria">Objetos</button>
<button data-filter="Historias">Historias</button>
<button data-filter="El oficio">El oficio</button>
<button data-filter="Conversión">Conversión</button>
<button data-filter="Cierre y comunidad">Cierre</button>
</div>
<div class="grid" id="grid">${cardsHTML}</div>

<div class="tips">
<h2>💡 Consejos rápidos</h2>
<details><summary>📊 ¿Por qué estos horarios?</summary><p>Basados en el análisis de Later (2026) sobre 6M+ publicaciones. Los Reels tienen mejor rendimiento entre semana a las 12:30 y 19:30 COT. Fines de semana a las 11:00 y 19:30. Después de 10 publicaciones, revisa Instagram Insights y ajusta.</p></details>
<details><summary>📈 ¿Qué medir?</summary><p>Reproducciones, retención (que vean más de 3s), compartidos, guardados, visitas al perfil y mensajes recibidos. Las visitas al perfil y los mensajes son más importantes que los likes.</p></details>
<details><summary>🔄 ¿Y después de los 33 Reels?</summary><p>Los Reels más vistos conviértelos en anuncios en Meta Ads. Sube Stories semanales con fotos de archivo. Publica 1 Reel nuevo por semana con testimonios reales.</p></details>
</div>

<script>
document.querySelectorAll('.copy-btn').forEach(b=>{b.addEventListener('click',()=>{navigator.clipboard.writeText(b.dataset.copy).then(()=>{b.textContent='✅ Copiado';b.classList.add('btn-success');setTimeout(()=>{b.textContent='📋 Copiar copy';b.classList.remove('btn-success')},2000)})})});
document.querySelectorAll('#filtros button').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('#filtros button').forEach(x=>x.classList.remove('activo'));b.classList.add('activo');const f=b.dataset.filter;document.querySelectorAll('.card').forEach(c=>{c.style.display=f==='all'||c.dataset.group===f?'':'none'})})});
</script>
</body></html>`;

// ── GUARDAR HTML ─────────────────────────────────────────────────────
const outDir = path.join(ROOT, "public", "calendario");
await mkdir(outDir, { recursive: true });
const htmlPath = path.join(outDir, "index.html");
await writeFile(htmlPath, html, "utf8");

// ── GENERAR PDF ───────────────────────────────────────────────────────
const pdfDir = path.join(ROOT, "marketing");
await mkdir(pdfDir, { recursive: true });

const pdfHTML = html.replace(
    '<meta name="viewport"',
    '<style>@page{size:A4;margin:12mm 10mm}body{padding:0!important}.hero{padding:30px 20px 28px!important}.hero h1{font-size:30pt!important}.grid{grid-template-columns:1fr 1fr!important;gap:8px!important}.card{padding:10px!important;font-size:9pt!important}.num{font-size:22pt!important}.tutorial ol li{margin-bottom:6px!important}.actions .btn{padding:4px 10px!important;font-size:7.5pt!important}.creds{padding:12px 16px!important}.tips{display:none!important}#filtros{display:none!important}.copy-btn{display:none!important}.badge{font-size:6.5pt!important}</style><meta name="viewport"'
);

const pdfHtmlPath = path.join(pdfDir, "calendario-pdf.html");
await writeFile(pdfHtmlPath, pdfHTML, "utf8");

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 1600 }, deviceScaleFactor: 1 });
await page.goto(`file:///${pdfHtmlPath.replaceAll("\\", "/")}`, { waitUntil: "networkidle" });
await page.pdf({ path: path.join(pdfDir, "calendario-publicacion.pdf"), format: "A4", printBackground: true, margin: { top: "0", right: "0", bottom: "0", left: "0" } });
await browser.close();

// ── CREAR RUTA EN NEXT.JS ───────────────────────────────────────────
const routeContent = `import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
export async function GET() {
  try {
    const html = await fs.readFile(path.join(process.cwd(), "public", "calendario", "index.html"), "utf-8");
    return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  } catch {
    return new NextResponse("Error", { status: 500 });
  }
}`;
await writeFile(path.join(ROOT, "app", "calendario", "route.ts"), routeContent, "utf8");

console.log("✅ Calendario interactivo:  https://el-susurro-del-tiempo.vercel.app/calendario");
console.log("✅ PDF generado:            marketing/calendario-publicacion.pdf");
console.log("✅ HTML del PDF:            marketing/calendario-pdf.html");
