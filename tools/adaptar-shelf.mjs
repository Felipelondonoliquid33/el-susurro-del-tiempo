const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "..", "public", "shelf", "index.html");
let html = fs.readFileSync(htmlPath, "utf8");

// Reemplazar rutas de assets para que funcionen desde /shelf/
html = html.replace(/src="assets\//g, 'src="/shelf/assets/');
html = html.replace(/href="assets\//g, 'href="/shelf/assets/');

// Reemplazar title
html = html.replace(
    "<title>Working Volumes — Seven Tools for Making</title>,
  "<title>El Susurro del Tiempo — Nuestros libros</title>"
);

// Agregar boton de regreso
html = html.replace("</body>", `
  <a href="/"
    style="position:fixed;top:20px;left:20px;z-index:999;
           font-family:Inter,sans-serif;font-size:12px;
           letter-spacing:0.1em;text-transform:uppercase;
           color:#f4eee6;text-decoration:none;
           padding:10px 18px;border:1px solid rgba(244,238,230,0.24);
           border-radius:4px;transition:all 0.3s;
           background:rgba(23,26,36,0.8);backdrop-filter:blur(8px);"
    onmouseover="this.style.borderColor='#c87046';this.style.color='#c87046'"
    onmouseout="this.style.borderColor='rgba(244,238,230,0.24)';this.style.color='#f4eee6'"
  >\u2190 Volver a la landing</a>
</body>`);

fs.writeFileSync(htmlPath, html);
console.log("✅ Shelf adaptado exitosamente");
