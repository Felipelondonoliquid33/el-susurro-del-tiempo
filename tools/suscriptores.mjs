#!/usr/bin/env node
/**
 * Consulta los suscriptores del newsletter.
 *
 * Uso:
 *   node tools/suscriptores.mjs          # Lista todos
 *   node tools/suscriptores.mjs --count  # Solo el total
 *   node tools/suscriptores.mjs --latest # Últimos 5
 */
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const archivo = join(__dirname, "..", "data", "suscriptores.json");

if (!existsSync(archivo)) {
    console.log("📭 No hay suscriptores todavía.");
    process.exit(0);
}

const suscriptores = JSON.parse(readFileSync(archivo, "utf-8"));
const flag = process.argv[2];

if (flag === "--count") {
    console.log(`📊 Total: ${suscriptores.length} suscriptores`);
} else if (flag === "--latest") {
    const ultimos = suscriptores.slice(-5).reverse();
    console.log("🆕 Últimos suscriptores:\n");
    ultimos.forEach((s) => {
        const fecha = new Date(s.fecha).toLocaleDateString("es-CO");
        console.log(`  • ${s.email} — ${fecha}`);
    });
} else {
    console.log(`📋 ${suscriptores.length} suscriptores:\n`);
    suscriptores.forEach((s) => {
        const fecha = new Date(s.fecha).toLocaleDateString("es-CO");
        console.log(`  • ${s.email} (${fecha})`);
    });
}
