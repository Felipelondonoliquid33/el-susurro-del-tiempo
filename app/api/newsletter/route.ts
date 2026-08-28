import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";
import { Resend } from "resend";

/**
 * POST /api/newsletter
 *
 * Recibe un email del formulario de la landing, lo almacena localmente
 * y lo reenvía al correo del proyecto vía Resend.
 *
 * Para activar los emails:
 *   1. Crea una cuenta gratis en https://resend.com
 *   2. Ve a API Keys → crea una key
 *   3. Agrégala como variable de entorno:
 *      - Local: .env.local → RESEND_API_KEY=re_xxxxx
 *      - Vercel: Dashboard → Project Settings → Environment Variables
 *
 * El plan gratis de Resend incluye 100 emails/día — más que suficiente.
 */
export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || typeof email !== "string") {
            return NextResponse.json({ error: "Email requerido" }, { status: 400 });
        }

        const emailLimpio = email.trim().toLowerCase();

        // ── 1. Validación básica ──────────────────────────────────────────────
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpio)) {
            return NextResponse.json({ error: "Email inválido" }, { status: 400 });
        }

        // ── 2. Almacenar localmente ───────────────────────────────────────────
        // En local se guarda en data/suscriptores.json.
        // En Vercel (producción) se guarda en /tmp/ porque el filesystem
        // principal es de solo lectura. Los datos en /tmp son efímeros,
        // pero el email vía Resend es el respaldo permanente.
        const isVercel = process.env.VERCEL === "1";
        const dataDir = path.join(isVercel ? "/tmp" : process.cwd(), "data");
        const archivo = path.join(dataDir, "suscriptores.json");

        try {
            await fs.mkdir(dataDir, { recursive: true });
        } catch {
            // Si no se puede crear el directorio, continuamos igual
        }

        let suscriptores: Array<{ email: string; fecha: string }> = [];
        try {
            const existente = await fs.readFile(archivo, "utf-8");
            suscriptores = JSON.parse(existente);
        } catch {
            // Archivo aún no existe → lista vacía
        }

        // Evitar duplicados
        const yaExiste = suscriptores.some((s) => s.email === emailLimpio);
        if (!yaExiste) {
            suscriptores.push({ email: emailLimpio, fecha: new Date().toISOString() });
            try {
                await fs.writeFile(archivo, JSON.stringify(suscriptores, null, 2));
            } catch {
                // En Vercel el write puede fallar, pero el email se envía igual
            }
        }

        // ── 3. Reenviar al correo del proyecto vía Resend ─────────────────────
        const apiKey = process.env.RESEND_API_KEY;
        if (apiKey) {
            const resend = new Resend(apiKey);
            await resend.emails.send({
                from: "El Susurro del Tiempo <onboarding@resend.dev>",
                to: ["elsusurrodeltiempo@proton.me"],
                subject: "🎙️ Nuevo suscriptor — El Susurro del Tiempo",
                html: `
          <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;">
            <h2 style="color:#7A3B43;">🎙️ Nuevo suscriptor</h2>
            <p style="font-size:18px;color:#2B2B2A;">
              <strong>${emailLimpio}</strong> se acaba de suscribir al newsletter.
            </p>
            <p style="color:#3A5255;">
              Fecha: ${new Date().toLocaleString("es-CO")}
            </p>
            <hr style="border:none;border-top:1px solid #E8C5C8;" />
            <p style="font-size:12px;color:#7A3B43;">
              El Susurro del Tiempo — elsusurrodeltiempo.com
            </p>
          </div>
        `,
            });
        }

        return NextResponse.json({
            ok: true,
            mensaje: yaExiste
                ? "Ya estabas en la lista ✨"
                : "¡Bienvenido a la comunidad! Te escribiremos pronto.",
        });
    } catch (error) {
        console.error("[Newsletter] Error:", error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}
