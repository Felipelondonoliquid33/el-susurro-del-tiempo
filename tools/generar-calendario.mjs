import { mkdir, writeFile, rename, readdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const ROOT = "C:/Users/Felipe/Documents/WEB PROJECTS/El susurro del tiempo Landing";
const REELS_DIR = `${ROOT}/exports/reels_finales`;
const LANDING = "https://el-susurro-del-tiempo.vercel.app/";
const WHATSAPP = "https://wa.me/573102300078";

const CRED = {
  correo: { u: "elsusurrodeltiempo@proton.me", c: "Juanita2026*" },
  instagram: { u: "3102300078 / elsusurrodeltiempo@proton.me", c: "Juanita2026*" },
  tiktok: { u: "elsusurrodeltiempo2", c: "Juanita2026*" },
};

const groups = [
  ["Descubrimiento","Presentar el problema y despertar reconocimiento emocional.","Tu historia merece permanecer. En El Susurro del Tiempo escuchamos, escribimos y convertimos memorias familiares en libros. 📖\n\n¿De quién te gustaría conservar la historia? Escríbenos por DM o visita el enlace de la bio.\n\n#ElSusurroDelTiempo #MemoriaFamiliar #HistoriasQueImportan #LegadoFamiliar"],
  ["Objetos con memoria","Demostrar que los objetos familiares son puertas de entrada a una historia.","Una máquina, una carta, una fotografía: los objetos también recuerdan.\n\nLos reunimos, los ordenamos y los devolvemos dentro de un libro que la familia puede conservar.\n\nGuarda este Reel y cuéntanos qué objeto guarda tu familia.\n\n#MemoriaFamiliar #ArchivoFamiliar #HistoriasQueImportan"],
  ["Historias","Mostrar el resultado humano, no un producto genérico.","Cada vida tiene capítulos que merecen ser escuchados.\n\nEl libro nace de una conversación, de fotografías y de la voz de quien lo vivió.\n\nSi tienes una historia familiar pendiente, escríbenos: primero conversamos.\n\n#Autobiografía #HistoriasDeVida #LegadoFamiliar #ElSusurroDelTiempo"],
  ["El oficio","Explicar el proceso consultivo y generar confianza.","No llegamos con un formulario. Nos sentamos, escuchamos, grabamos, transcribimos y devolvemos cada capítulo para que la persona lo corrija.\n\nLa memoria solo la edita quien la vivió.\n\nConoce el proceso en el enlace de la bio.\n\n#ProcesoCreativo #Memoria #Escritura #ArchivoFamiliar"],
  ["Conversión","Invitar a iniciar una conversación.","No hace falta tener la historia ordenada para empezar.\n\nHablemos de esa persona, de esas fotos y de lo que no quieres que se pierda. La primera conversación es el comienzo.\n\nEscríbenos “HISTORIA” por DM o por WhatsApp.\n\n#MemoriasFamiliares #LibroFamiliar #LegadoEmocional"],
  ["Cierre","Cerrar la secuencia y convertir atención en conversación.","Una vida, un libro.\n\nEl tiempo susurra; nosotros aprendemos a escucharlo.\n\n¿Quieres conversar sobre el libro de tu familia? Escríbenos por DM.\n\n#ElSusurroDelTiempo #UnaVidaUnLibro #HistoriasQuePermanecen"],
];

const DIAS_PUB = [1,3,5,6]; // Lun, Mie, Vie, Sab
const HORAS = {1:"19:30",3:"12:30",5:"19:30",6:"11:00"};
const NOM_D = {1:"Lunes",2:"Martes",3:"Miércoles",4:"Jueves",5:"Viernes",6:"Sábado",0:"Domingo"};
const MES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

const fechas = [];
let f = new Date(2026,7,28);
while (fechas.length < 33) {
  if (DIAS_PUB.includes(f.getDay())) fechas.push(new Date(f));
  f.setDate(f.getDate()+1);
}

// 1. Renombrar
const olds = (await readdir(REELS_DIR)).filter(x=>x.endsWith(".mp4")).sort();
for (let i=0; i<Math.min(olds.length, fechas.length); i++) {
  const oldP = path.join(REELS_DIR, olds[i]);
  const newN = `${fechas[i].toISOString().slice(0,10)}.mp4`;
  const newP = path.join(REELS_DIR, newN);
  if (oldP !== newP) { await rename(oldP, newP); console.log(`  ${olds[i]} → ${newN}`); }
}
console.log("OK - Renombrados");

// 2. Entradas
const entries = fechas.map((d,i) => {
  const g = Math.min(5, Math.floor(i/6));
  const [group, goal, copy] = groups[g];
  const ds = NOM_D[d.getDay()];
  const fs = d.toISOString().slice(0,10);
  const hr = HORAS[d.getDay()];
  return { n:i+1, file:`${fs}.mp4`, group, goal, copy, day:ds, date:fs, time:hr, diaLabel:`${ds} ${d.getDate()} de ${MES[d.getMonth()]}` };
});

// 3. HTML
const esc = s => s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const cards = entries.map(e => `
<article class="card" data-group="${e.group}">
  <div class="card-head"><span class="num">${String(e.n).padStart(2,"0")}</span><div><h3>${e.group}</h3><p class="sched">${e.diaLabel} · ${e.time} COT</p></div><span class="badge">${e.day}</span></div>
  <p class="goal"><b>🎯 Objetivo:</b> ${e.goal}</p>
  <div class="copy-box"><p>${esc(e.copy).replaceAll("\n","<br>")}</p></div>
  <p class="filename">📁 ${e.file}</p>
  <button class="btn copy-btn" data-copy="${esc(e.copy)}">📋 Copiar copy</button>
</article>`).join("");

const estilos = `:root{--parchment:#F4F0EA;--paper:#EFEAE1;--sumi:#2B2B2A;--burgundy:#7A3B43;--sakura:#E8C5C8;--slate:#3A5255;--font-d:'Cormorant Garamond',Georgia,serif;--font-b:'EB Garamond',Georgia,serif}*{box-sizing:border-box}body{margin:0;background:var(--parchment);color:var(--sumi);font:400 10pt var(--font-b);-webkit-font-smoothing:antialiased;padding:0 0 60px}h1{font:400 34pt/1 var(--font-d);color:var(--burgundy);margin:0}h2{font:400 26pt/1.1 var(--font-d);color:var(--burgundy);margin:28px 0 10px;border-bottom:1px solid var(--sakura);padding-bottom:8px}h3{font:500 13pt var(--font-d);margin:0;color:var(--burgundy)}.hero{background:var(--burgundy);color:var(--parchment);padding:40px 20px 32px;text-align:center}.hero h1{color:var(--parchment);font-size:36pt}.hero .kicker{text-transform:uppercase;letter-spacing:.25em;font-size:7.5pt;color:var(--sakura);margin-bottom:6px}.hero .sub{font:italic 15pt var(--font-d);color:var(--sakura);margin:8px 0 0}.hero .meta{font-size:8pt;color:var(--sakura);margin-top:12px;opacity:.8}.container{max-width:960px;margin:0 auto;padding:0 16px}.filtros{display:flex;flex-wrap:wrap;gap:6px;margin:16px 0 12px;max-width:960px;margin-left:auto;margin-right:auto;padding:0 16px}.filtros button{font:400 8.5pt var(--font-b);padding:5px 12px;border:1px solid var(--burgundy);background:transparent;color:var(--burgundy);cursor:pointer;transition:.3s;text-transform:uppercase;letter-spacing:.08em}.filtros button.activo,.filtros button:hover{background:var(--burgundy);color:var(--parchment)}.grid{display:grid;grid-template-columns:1fr;gap:10px;max-width:960px;margin:0 auto;padding:0 16px}@media(min-width:680px){.grid{grid-template-columns:1fr 1fr}}.card{border:1px solid #d9c9bd;background:#faf8f4;padding:12px;break-inside:avoid}.card-head{display:flex;gap:8px;align-items:flex-start;border-bottom:1px solid var(--sakura);padding-bottom:6px;margin-bottom:6px}.num{font:500 26pt var(--font-d);color:var(--burgundy);line-height:1}.sched{font-size:7pt;color:var(--slate);margin:2px 0 0;text-transform:uppercase;letter-spacing:.04em}.badge{font:400 6.5pt var(--font-b);padding:2px 7px;text-transform:uppercase;letter-spacing:.1em;margin-left:auto;white-space:nowrap;border:1px solid var(--sakura);color:var(--burgundy)}.goal{font-size:8pt;color:var(--slate);margin:6px 0}.copy-box{font:400 9pt var(--font-b);line-height:1.35;margin:6px 0 8px;background:#f4efe9;padding:8px;border-left:2px solid var(--sakura)}.filename{font-size:7.5pt;color:var(--slate);font-family:monospace;margin:4px 0}.btn{font:400 7.5pt var(--font-b);padding:5px 10px;border:1px solid var(--burgundy);color:var(--burgundy);cursor:pointer;transition:.3s;background:transparent;letter-spacing:.04em;display:inline-block;text-decoration:none}.btn:hover,.btn-success{background:var(--burgundy);color:var(--parchment)!important}.tutorial{background:var(--paper);padding:20px 16px;margin:20px auto;max-width:960px;border:1px solid #d9c9bd}.tutorial h2{margin-top:0}.tutorial ol{padding-left:18px}.tutorial li{margin-bottom:8px;line-height:1.45;font-size:9pt}.tutorial strong{color:var(--burgundy)}.creds{background:#f4efe9;border:1px solid var(--sakura);padding:14px 18px;margin:20px auto;max-width:960px}.creds h2{margin-top:0}.creds table{width:100%;border-collapse:collapse;font-size:9pt}.creds td,.creds th{padding:6px 8px;border-bottom:1px solid var(--sakura);text-align:left}.creds th{color:var(--burgundy);font-weight:500;width:100px;font-family:var(--font-d);font-size:10pt}.creds .clave{font-family:monospace;letter-spacing:.08em;color:var(--slate);font-size:8.5pt}.tips{max-width:960px;margin:16px auto;padding:0 16px}.tips details{margin-bottom:8px}.tips summary{font:400 11pt var(--font-d);color:var(--burgundy);cursor:pointer;padding:4px 0}.tips p{margin:4px 0;font-size:9pt;line-height:1.4}`;

const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Calendario · El Susurro del Tiempo</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet"><style>${estilos}</style></head><body>
<div class="hero"><p class="kicker">El Susurro del Tiempo</p><h1>Calendario de publicación</h1><p class="sub">33 Reels · 4 por semana · ~2 meses</p><p class="meta">Empieza hoy · ${entries[0].diaLabel} · ${entries[0].time} COT</p></div>
<div class="container"><h2>🔐 Datos de acceso</h2></div>
<div class="creds"><table><tr><th>📧 Correo</th><td>${CRED.correo.u}</td><td class="clave">${CRED.correo.c}</td></tr><tr><th>📸 Instagram</th><td>${CRED.instagram.u}</td><td class="clave">${CRED.instagram.c}</td></tr><tr><th>🎵 TikTok</th><td>${CRED.tiktok.u}</td><td class="clave">${CRED.tiktok.c}</td></tr></table><p style="margin:8px 0 0;font-size:8pt;color:var(--slate);">⚠️ No compartas esta página. Solo uso interno.</p></div>
<div class="container"><h2>📋 Tutorial paso a paso</h2></div>
<div class="tutorial"><ol>
<li><strong>Abrir la carpeta de videos:</strong> Ve a <code>exports/reels_finales</code> y busca el archivo <b>${entries[0].file}</b>. Ese es el video de hoy.</li>
<li><strong>Pasarlo al teléfono:</strong> Envíalo por WhatsApp como <b>documento</b> a tu propio número. También puedes usar cable USB o Google Drive.</li>
<li><strong>Abrir Instagram:</strong> En el teléfono, abre Instagram. Verifica que estés en <b>@el.susurro.deltiempo</b>.</li>
<li><strong>Crear Reel:</strong> Pulsa el <b>+</b> → <b>Reel</b>. Selecciona el video que acabas de recibir.</li>
<li><strong>No edites nada:</strong> El video ya está listo. No añadas filtros, texto ni recortes.</li>
<li><strong>Pegar el copy:</strong> Pulsa <b>📋 Copiar copy</b> de esta página (o copia el texto de abajo), pégalo en el campo de descripción de Instagram.</li>
<li><strong>Compartir en Facebook:</strong> Activa <b>Compartir también en Facebook</b>.</li>
<li><strong>Publicar:</strong> Pulsa <b>Compartir</b>. ¡Listo!</li>
<li><strong>Responder:</strong> Durante la primera hora, responde comentarios y mensajes.</li>
</ol></div>
<div class="container"><h2>📅 Calendario</h2><p style="font-size:8.5pt;color:var(--slate);">Publica lunes, miércoles, viernes y sábado. 33 Reels para ~2 meses de contenido.</p></div>
<div class="filtros" id="filtros">
<button class="activo" data-filter="all">Todas</button>
<button data-filter="Descubrimiento">Descubrimiento</button>
<button data-filter="Objetos con memoria">Objetos</button>
<button data-filter="Historias">Historias</button>
<button data-filter="El oficio">El oficio</button>
<button data-filter="Conversión">Conversión</button>
<button data-filter="Cierre">Cierre</button>
</div>
<div class="grid" id="grid">${cards}</div>
<div class="tips"><h2>💡 Consejos</h2>
<details><summary>📊 ¿Por qué estos horarios?</summary><p>Basados en el análisis de Later (2026) sobre 6M+ publicaciones. Los Reels rinden mejor entre semana a las 12:30 y 19:30 COT, y los fines de semana a las 11:00. Después de 10 publicaciones, revisa Instagram Insights y ajusta.</p></details>
<details><summary>📈 ¿Qué debes medir?</summary><p>Reproducciones, retención (>3s), compartidos, guardados, visitas al perfil y mensajes. Las visitas al perfil y los mensajes importan más que los likes.</p></details>
<details><summary>🔁 ¿Después de los 33 Reels?</summary><p>Los Reels más vistos conviértelos en anuncios en Meta Ads. Publica Stories con fotos de archivo. Crea 1 Reel nuevo por semana con testimonios reales cuando tengas clientes.</p></details>
</div>
<script>
document.querySelectorAll('.copy-btn').forEach(b=>{b.addEventListener('click',()=>{navigator.clipboard.writeText(b.dataset.copy).then(()=>{b.textContent='✅ Copiado';b.classList.add('btn-success');setTimeout(()=>{b.textContent='📋 Copiar copy';b.classList.remove('btn-success')},2000)})})});
document.querySelectorAll('#filtros button').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('#filtros button').forEach(x=>x.classList.remove('activo'));b.classList.add('activo');const f=b.dataset.filter;document.querySelectorAll('.card').forEach(c=>{c.style.display=f==='all'||c.dataset.group===f?'':'none'})})});
</script>
</body></html>`;

// 4. Guardar
const outDir = path.join(ROOT, "public", "calendario");
await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, "index.html"), html, "utf8");

// 5. PDF
const pdfDir = path.join(ROOT, "marketing");
await mkdir(pdfDir, { recursive: true });
const pdfHTML = html.replace('<meta name="viewport"', '<style>@page{size:A4;margin:10mm 8mm}body{padding:0!important}.hero{padding:24px 16px 20px!important}.hero h1{font-size:26pt!important}.grid{grid-template-columns:1fr 1fr!important;gap:6px!important}.card{padding:8px!important;font-size:8pt!important}.num{font-size:20pt!important}.tutorial li{font-size:8pt!important;margin-bottom:5px!important}.creds{padding:10px 14px!important}.tips{display:none!important}#filtros{display:none!important}.copy-btn{display:none!important}.filename{font-size:7pt!important}.badge{font-size:6pt!important;padding:1px 5px!important}.copy-box{font-size:8pt!important;padding:6px!important}</style><meta name="viewport"');
await writeFile(path.join(pdfDir, "calendario-pdf.html"), pdfHTML, "utf8");
const browser = await chromium.launch({ headless: true });
const p = await browser.newPage({ viewport: { width: 1200, height: 1600 } });
await p.goto(`file:///${path.join(pdfDir, "calendario-pdf.html").replaceAll("\\","/")}`, { waitUntil: "networkidle" });
await p.pdf({ path: path.join(pdfDir, "calendario-publicacion.pdf"), format: "A4", printBackground: true, margin: { top: "0", right: "0", bottom: "0", left: "0" } });
await browser.close();
console.log("OK - Hecho");
console.log(`  Inicio: ${entries[0].diaLabel} ${entries[0].time} - ${entries[0].file}`);
console.log(`  Fin:    ${entries[33].diaLabel} ${entries[33].time} - ${entries[33].file}`);
console.log("  Web:    https://el-susurro-del-tiempo.vercel.app/calendario");
console.log("  PDF:    marketing/calendario-publicacion.pdf");