import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = "C:/Users/Felipe/Documents/WEB PROJECTS/El susurro del tiempo Landing";
const reelsDir = `${root}/exports/reels_finales`;
const landing = "https://el-susurro-del-tiempo.vercel.app/";
const whatsapp = "https://wa.me/573102300078";

const groups = [
    ["Descubrimiento", "Presentar el problema y despertar reconocimiento emocional.", "Tu historia merece permanecer. En El Susurro del Tiempo escuchamos, escribimos y convertimos memorias familiares en libros. 📖\n\n¿De quién te gustaría conservar la historia? Escríbenos por DM o visita el enlace de la bio.\n\n#ElSusurroDelTiempo #MemoriaFamiliar #HistoriasQueImportan #LegadoFamiliar"],
    ["Objetos con memoria", "Demostrar que los objetos familiares son puertas de entrada a una historia.", "Una máquina, una carta, una fotografía: los objetos también recuerdan.\n\nLos reunimos, los ordenamos y los devolvemos dentro de un libro que la familia puede conservar.\n\nGuarda este Reel y cuéntanos qué objeto guarda tu familia.\n\n#MemoriaFamiliar #ArchivoFamiliar #HistoriasQueImportan"],
    ["Historias", "Mostrar el resultado humano: una vida concreta, no un producto genérico.", "Cada vida tiene capítulos que merecen ser escuchados.\n\nEl libro nace de una conversación, de fotografías y de la voz de quien lo vivió.\n\nSi tienes una historia familiar pendiente, escríbenos: primero conversamos.\n\n#Autobiografía #HistoriasDeVida #LegadoFamiliar #ElSusurroDelTiempo"],
    ["El oficio", "Explicar el proceso consultivo y generar confianza.", "No llegamos con un formulario de respuestas. Nos sentamos, escuchamos, grabamos, transcribimos y devolvemos cada capítulo para que la persona lo corrija.\n\nLa memoria solo la edita quien la vivió.\n\nConoce el proceso en el enlace de la bio.\n\n#ProcesoCreativo #Memoria #Escritura #ArchivoFamiliar"],
    ["Conversión", "Invitar a iniciar una conversación sin publicar precios.", "No hace falta tener la historia ordenada para empezar.\n\nHablemos de esa persona, de esas fotos y de lo que no quieres que se pierda. La primera conversación es el comienzo.\n\nEscríbenos “HISTORIA” por DM o por WhatsApp.\n\n#MemoriasFamiliares #LibroFamiliar #LegadoEmocional"],
    ["Cierre y comunidad", "Cerrar la primera secuencia y convertir atención en conversación.", "Una vida, un libro.\n\nEl tiempo susurra; nosotros aprendemos a escucharlo.\n\n¿Quieres conversar sobre el libro de tu familia? Escríbenos por DM.\n\n#ElSusurroDelTiempo #UnaVidaUnLibro #HistoriasQuePermanecen"]
];

const days = ["Jueves", "Viernes", "Sábado", "Domingo", "Lunes", "Martes", "Miércoles"];
const times = ["19:30", "12:30", "19:30", "11:00", "19:30", "12:30", "19:30"];
const entries = Array.from({ length: 33 }, (_, i) => {
    const groupIndex = Math.min(5, Math.floor(i / 6));
    const [group, goal, copy] = groups[groupIndex];
    const dayOffset = i;
    const date = new Date(Date.UTC(2026, 7, 27 + dayOffset));
    return {
        n: i + 1,
        file: `Reel_${String(i + 1).padStart(2, "0")}.mp4`,
        group,
        goal,
        copy,
        day: days[dayOffset % days.length],
        date: date.toISOString().slice(0, 10),
        time: times[dayOffset % times.length],
    };
});

const esc = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const fileHref = (file) => `file:///${reelsDir}/${file}`.replaceAll(" ", "%20");
const rows = entries.map((e) => `
  <article class="reel-card">
    <div class="reel-head"><span class="number">${String(e.n).padStart(2, "0")}</span><div><h3>${e.group}</h3><p class="schedule">${e.day} · ${e.date} · ${e.time} COT</p></div></div>
    <p class="goal"><b>Objetivo:</b> ${e.goal}</p>
    <p class="copy">${esc(e.copy).replaceAll("\n", "<br>")}</p>
    <a class="video-link" href="${fileHref(e.file)}">Abrir ${e.file}</a>
  </article>`).join("");

const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Parrilla editorial · El Susurro del Tiempo</title><style>
@page{size:A4;margin:16mm 14mm}*{box-sizing:border-box}body{margin:0;background:#f4f0ea;color:#2b2b2a;font-family:Arial,sans-serif;font-size:10pt;line-height:1.45}h1,h2,h3{font-family:Georgia,serif;font-weight:400}h1{font-size:31pt;line-height:1.02;margin:0 0 10px;color:#f4f0ea}h2{font-size:20pt;color:#7a3b43;margin:24px 0 8px;border-bottom:1px solid #d9c9bd;padding-bottom:6px}h3{font-size:14pt;margin:0;color:#7a3b43}.cover{background:#7a3b43;color:#f4f0ea;padding:22mm 16mm 18mm;min-height:245mm;display:flex;flex-direction:column;justify-content:space-between}.kicker{text-transform:uppercase;letter-spacing:.22em;font-size:8pt;color:#e8c5c8}.subtitle{font:italic 17pt Georgia,serif;max-width:130mm}.meta{border-top:1px solid #e8c5c8;padding-top:10px;font-size:9pt;color:#f4f0ea}.intro{page-break-before:always}.callout{border-left:3px solid #7a3b43;background:#efeae1;padding:10px 14px;margin:12px 0}.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.reel-card{break-inside:avoid;border:1px solid #d9c9bd;background:#faf8f4;padding:11px;margin-bottom:10px}.reel-head{display:flex;gap:10px;align-items:flex-start;border-bottom:1px solid #e8c5c8;padding-bottom:7px;margin-bottom:7px}.number{font:24pt Georgia,serif;color:#7a3b43;line-height:1}.schedule{font-size:8pt;color:#3a5255;margin:2px 0 0;text-transform:uppercase;letter-spacing:.05em}.goal{font-size:8.5pt;color:#3a5255;margin:7px 0}.copy{font-family:Georgia,serif;font-size:9.5pt;line-height:1.35;margin:7px 0 10px}.video-link{font-size:8pt;color:#7a3b43;text-decoration:none;border-bottom:1px solid #7a3b43}.small{font-size:8.5pt;color:#555}.page-break{page-break-before:always}.footer{margin-top:18px;border-top:1px solid #d9c9bd;padding-top:10px;color:#3a5255;font-size:8pt}table{border-collapse:collapse;width:100%;font-size:8.5pt}td,th{border-bottom:1px solid #d9c9bd;padding:6px;text-align:left}th{color:#7a3b43;font-weight:400}a{color:#7a3b43}
</style></head><body>
<section class="cover"><div><p class="kicker">Estrategia de lanzamiento · 2026</p><h1>El Susurro<br>del Tiempo</h1><p class="subtitle">Parrilla editorial para 33 Reels finales</p><p>Una secuencia para volver a poner la marca en circulación, construir confianza y llevar cada conversación hacia una fase consultiva.</p></div><div class="meta"><b>Cuenta:</b> @el.susurro.deltiempo<br><b>Landing:</b> ${landing}<br><b>WhatsApp:</b> ${whatsapp}<br><b>Zona horaria:</b> Colombia (COT, UTC−5)</div></section>
<section class="intro"><h2>Cómo usar esta parrilla</h2><div class="callout"><b>Los videos no se reeditan.</b> El copy de este documento se pega en el campo de descripción/caption de Instagram al publicar el Reel. El texto que ya está dentro del video permanece intacto.</div><p>Los enlaces “Abrir Reel” apuntan a los archivos locales de tu carpeta <b>exports/reels_finales</b>. Funcionan en este computador; para publicar desde el teléfono, transfiere los MP4 por Drive, AirDrop, cable o WhatsApp como documento.</p><h2>Recomendación de lanzamiento</h2><ol><li>No publiques los 33 de una vez.</li><li>Publica <b>1 Reel diario durante 33 días</b>. La cuenta está recién creada y necesita acumular señales.</li><li>Empieza hoy, jueves 27 de agosto, a las <b>19:30 COT</b> con Reel 01.</li><li>Durante la primera hora responde comentarios y DMs.</li><li>Tras 7–10 publicaciones, reemplaza estos horarios por los datos reales de Instagram Insights.</li></ol><div class="callout"><b>Horario de prueba:</b> no existe una hora universal. Estudios recientes de Later recomiendan ventanas tempranas para Reels, pero para una marca local nueva y una audiencia de familiares adultos conviene probar 12:30 y 19:30 COT. La métrica propia manda.</div><h2>Objetivo de negocio</h2><p>El objetivo no es conseguir likes: es generar conversaciones calificadas. CTA constante: <b>“Escríbenos HISTORIA”</b> o visita la landing para iniciar la conversación.</p><table><tr><th>Canal</th><th>Acción</th><th>Destino</th></tr><tr><td>Reel</td><td>Atención + identificación emocional</td><td>Perfil / DM</td></tr><tr><td>Bio</td><td>Explicar el servicio</td><td>Landing</td></tr><tr><td>Landing</td><td>Capturar email o WhatsApp</td><td>Fase consultiva</td></tr><tr><td>Conversación</td><td>Entender historia, alcance y familia</td><td>Propuesta personalizada</td></tr></table></section>
<section class="page-break"><h2>Calendario completo · 33 publicaciones</h2><p class="small">Días y fechas en hora de Colombia. La clasificación editorial es una guía de lanzamiento basada en la secuencia de archivos; valida el contenido visual de cada Reel antes de publicar.</p><div class="grid">${rows}</div></section>
<section class="page-break"><h2>Rutina de publicación</h2><ol><li>Abre el archivo del Reel correspondiente.</li><li>En Instagram pulsa <b>+</b> → <b>Reel</b> y selecciona el MP4.</li><li>No añadas filtros ni vuelvas a editar el video.</li><li>Pega el caption de esta parrilla en la descripción.</li><li>Activa compartir también en Facebook.</li><li>Publica y fija un comentario: <i>“Si quieres conversar sobre la historia de tu familia, escríbenos HISTORIA.”</i></li><li>Responde durante 60 minutos.</li><li>Registra al día siguiente: reproducciones, retención, compartidos, guardados, visitas al perfil, DMs y clics al enlace.</li></ol><h2>Qué medir</h2><table><tr><th>Métrica</th><th>Qué indica</th><th>Decisión</th></tr><tr><td>Retención inicial</td><td>Si el comienzo detiene el scroll</td><td>Reutilizar el tipo de apertura ganador</td></tr><tr><td>Compartidos y guardados</td><td>Valor emocional o utilidad</td><td>Convertir en serie</td></tr><tr><td>Visitas al perfil</td><td>Interés por la marca</td><td>Revisar bio y portada</td></tr><tr><td>DMs y clics</td><td>Intención comercial</td><td>Dar prioridad a ese tema en Ads</td></tr></table><div class="footer">Fuentes de referencia de horarios: Instagram Professional Dashboard (datos propios) y análisis de Later sobre más de 6 millones de publicaciones, actualizado en abril de 2026. Son puntos de partida, no garantías.</div></section>
</body></html>`;

await mkdir(path.join(root, "marketing"), { recursive: true });
const htmlPath = path.join(root, "marketing", "parrilla-contenidos.html");
const pdfPath = path.join(root, "marketing", "parrilla-contenidos.pdf");
await writeFile(htmlPath, html, "utf8");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 1600 }, deviceScaleFactor: 1 });
await page.goto(`file:///${htmlPath.replaceAll("\\", "/")}`, { waitUntil: "load" });
await page.pdf({ path: pdfPath, format: "A4", printBackground: true, margin: { top: "0", right: "0", bottom: "0", left: "0" } });
await browser.close();
console.log(`PDF creado: ${pdfPath}`);
console.log(`HTML editable: ${htmlPath}`);
