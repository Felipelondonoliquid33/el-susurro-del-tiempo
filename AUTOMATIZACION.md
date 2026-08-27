# 🚀 Plan de Automatización — El Susurro del Tiempo

## ✅ YA ESTÁ AUTOMATIZADO (implementado hoy)

### 1. Formulario de Newsletter → API propia
- **Endpoint:** `POST /api/newsletter`
- **Almacenamiento:** `data/suscriptores.json` (local, versionado con `.gitignore`)
- **Validación:** formato email, duplicados
- **Para activar envío real:** descomenta el fetch a Resend/Brevo en `app/api/newsletter/route.ts`

### 2. Contactos en la landing
- **Email:** `elsusurrodeltiempo@proton.me`
- **WhatsApp:** enlace directo `wa.me` (cambia el número)
- **Instagram:** @elsusurrodeltiempo
- **Ubicación:** Bogotá

---

## 🔲 PENDIENTE DE AUTOMATIZAR (lo que falta)

### 3. 📧 Notificaciones por email (Resend / Brevo)
Cuando alguien se suscriba, que te llegue un correo.

**Opción A — Resend (recomendada, más simple):**
```bash
npm install resend
```
```ts
// app/api/newsletter/route.ts — descomentar el bloque comentado
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({
  from: "El Susurro del Tiempo <suscriptores@tudominio.com>",
  to: ["elsusurrodeltiempo@proton.me"],
  subject: "🎙️ Nuevo suscriptor",
  html: `<p><strong>Email:</strong> ${email}</p>`,
});
```

**Opción B — ProtonMail Bridge (ya tienes Proton):**
Requiere servidor SMTP configurado. Más complejo.

### 4. 📱 Publicación automática a Instagram
**Herramientas:**
- **Meta Graph API** — la oficial, permite publicar Reels y fotos
- **Buffer / Later / Hootsuite** — programación visual, plan gratis limitado

**Flujo ideal:**
```
Carpeta marketing/videos/ → Google Drive / Dropbox
                         → Buffer programa 1 Reel/día
                         → Se publica solo en Instagram
```

### 5. 🤖 Chatbot WhatsApp (respuestas automáticas)
**Herramientas gratuitas:**
- **WhatsApp Business API** (gratis, app móvil)
- **Twilio** (gratis hasta cierto límite)
- **ChatGPT + Twilio** (respuestas con IA)

**Flujo:**
```
Usuario envía WhatsApp
  → Respuesta automática:
    "¡Gracias por escribirnos! 🎙️
     Cuéntanos: ¿es para ti o para un familiar?
     mientras, conoce más en elsusurrodeltiempo.com"
  → Si no responde en 24h → te notifica a ti
```

### 6. 📊 Analytics — seguimiento de visitas
- **Vercel Analytics** (gratis si deployas en Vercel)
- **Google Analytics** (gratis, más completo)
- **Plausible / Fathom** (alternativas privacy-first)

### 7. 🎬 Pipeline de video (marketing → redes)
**Automatizable con:**
```bash
# tools/ — ya tienes scripts de build
shots.mjs         # Genera screenshots de la landing
build-archive.py  # Procesa fotos a WebP
```

**Pendiente:**
- Script que tome un video de `marketing/audios/` + texto → lo suba a Instagram
- O al menos: genere el caption listo para copiar-pegar

---

## 📋 CHECKLIST SEMANAL (lo que puedes hacer manual en 15 min)

| Tarea | Tiempo | Automatable |
|---|---|---|
| Revisar `data/suscriptores.json` | 2 min | ✅ Ya con API |
| Responder WhatsApps | 5 min | Parcial |
| Subir 1 Reel a Instagram | 5 min | Con Buffer/SocialBu |
| Responder comments | 3 min | ❌ Humano |
| Revisar analytics | 2 min | ✅ Vercel/GA |

---

## 🧰 HERRAMIENTAS RECOMENDADAS (gratis / low-cost)

| Servicio | Para qué | Costo |
|---|---|---|
| **Vercel** | Deploy de la landing | Gratis |
| **Resend** | Emails transaccionales | Gratis (100/día) |
| **Brevo** | Newsletter + CRM | Gratis (300 emails/día) |
| **Buffer** | Programar redes sociales | Gratis (3 cuentas) |
| **SocialBu** | Alternativa a Buffer | Gratis limitado |
| **WhatsApp Business** | Chat semi-automático | Gratis |
| **Cloudflare R2** | Backup de fotos/videos | Gratis (10GB) |
