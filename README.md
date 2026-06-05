# ETH Agent — Landing (Ethernaly)

Landing para ofrecer **ETH Agent**, el agente de IA conversacional de Ethernaly
(integrable en web y WhatsApp, entrenable con documentos).

Sitio **estático**: no necesita build. Vercel lo sirve tal cual.

## Estructura

```
index.html            ← página principal
styles.css            ← estilos
app.js                ← demo de chat en vivo + lógica del formulario
tweaks-panel.jsx      ← panel de ajustes (se carga en el navegador con Babel)
tweaks-app.jsx        ← configuración de los ajustes
assets/
  └─ ethernaly-logo.png
```

## Publicar con GitHub + Vercel

1. Creá un repo nuevo en GitHub y subí estos archivos (raíz del repo).
   ```bash
   git init
   git add .
   git commit -m "ETH Agent landing"
   git branch -M main
   git remote add origin git@github.com:TU_USUARIO/eth-agent-landing.git
   git push -u origin main
   ```
2. En Vercel: **New Project → Import** el repo.
   - Framework Preset: **Other** (es estático).
   - Build Command: *(vacío)*
   - Output Directory: *(vacío / raíz)*
3. Deploy. Cada `git push` vuelve a publicar automáticamente.
4. Cuando esté ok, conectá tu dominio propio desde **Settings → Domains**
   (ej. `agent.ethernaly.com`).

## Formulario (Formspree)

El form "Solicitá una demo" envía vía Formspree (ID `xpqeqzqd`, en `app.js`).
Para producción:

1. Hacé un envío de prueba desde el sitio publicado y confirmá el mail de
   verificación de Formspree (solo la primera vez).
2. En Formspree → Settings, agregá tu dominio a los **allowed domains**.
3. Para que llegue a las tres casillas (ivant@, marianob@, diegom@ethernaly.com),
   agregalas como destinatarios o usá un alias que reenvíe a las tres.

Si no hay ID configurado, el form usa un respaldo que abre el correo del
visitante con los tres destinatarios.

## Editar

Editá `index.html`, `styles.css` o `app.js` directamente — o pedímelo a mí
(o a Claude Code) y lo cambio. Los ajustes rápidos de color/tipografía también
están en el panel de Tweaks (`tweaks-app.jsx`).

---
© 2026 Ethernaly · ETH SAS
