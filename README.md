# Nicrosil — Sitio Web Oficial

Sitio de presentación corporativa de **Nicrosil**, agencia de desarrollo web basada en Oaxaca, México. Construido con Astro 5, Tailwind CSS v4 y Preact, con foco en rendimiento máximo, SEO técnico y accesibilidad.

---

## Stack

| Tecnología | Versión | Rol |
|---|---|---|
| [Astro](https://astro.build) | 5.x | Framework principal, SSG |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Estilos (vía plugin Vite, sin config JS) |
| [Preact](https://preactjs.com) | 10.x | Interactividad mínima (ThemeToggle, Contact) |
| Syne Variable | — | Tipografía display / headings |
| Plus Jakarta Sans Variable | — | Tipografía body / UI |

---

## Comandos

```bash
pnpm dev          # Servidor de desarrollo en localhost:4321
pnpm build        # Build de producción → ./dist/
pnpm preview      # Preview del build antes de desplegar
pnpm astro check  # Type-check de archivos .astro
```

---

## Estructura del proyecto

```
src/
├── components/
│   ├── Header.astro          # Nav sticky con toggle dark/light y hamburger mobile
│   ├── ThemeToggle.tsx        # Preact — toggle de tema, persiste en localStorage
│   ├── Hero.astro             # Sección principal, H1 SEO, orbs CSS
│   ├── Services.astro         # 4 cards de servicios
│   ├── Philosophy.astro       # "El Jardín Digital" — diferenciador de marca
│   ├── Authority.astro        # Trayectoria y credenciales
│   ├── Process.astro          # 4 pasos del proceso de trabajo
│   ├── ContactSection.astro   # Wrapper de sección de contacto
│   ├── Contact.tsx            # Preact — formulario con validación client-side
│   └── Footer.astro           # Siempre dark, nav, ubicación, copyright
├── layouts/
│   └── Layout.astro           # Head SEO completo + anti-FOUC + Schema.org
├── pages/
│   └── index.astro            # Landing page, ensambla todos los componentes
└── styles/
    └── global.css             # Tokens de marca, fuentes, temas light/dark
```

---

## Sistema de temas

El tema por defecto es **claro**. El usuario puede alternar a oscuro mediante el botón en el header; la preferencia se persiste en `localStorage`.

La configuración completa vive en `src/styles/global.css`:
- Variables CSS bajo `:root` (light) y `:root.dark` (dark)
- Variante `dark:` de Tailwind activada con `@custom-variant dark (&:where(.dark, .dark *))`
- Script anti-FOUC en `<head>` del Layout para evitar flash en usuarios con dark guardado

Para cambiar colores de marca editar las variables en `global.css`:

```css
:root {
  --spark: #16A34A;   /* acento verde — light mode */
}
:root.dark {
  --spark: #22C55E;   /* acento verde — dark mode */
}
```

---

## SEO

- **Schema.org** `ProfessionalService` con dirección Oaxaca y `areaServed: worldwide` en `Layout.astro`
- **Geo meta tags** (`geo.region: MX-OAX`, coordenadas) para SEO local
- **Open Graph** y **Twitter Card** configurados con props sobreescribibles por página
- `Layout.astro` acepta props `title`, `description`, `canonical` y `ogImage` para personalizar cada ruta futura

---

## Datos a actualizar antes de producción

Buscar y reemplazar los siguientes placeholders en el proyecto:

| Archivo | Campo | Valor actual |
|---|---|---|
| `src/layouts/Layout.astro` | `url` en Schema.org | `https://nicrosil.com` |
| `src/layouts/Layout.astro` | `email` en Schema.org | vacío |
| `src/layouts/Layout.astro` | `telephone` en Schema.org | vacío |
| `src/components/ContactSection.astro` | Email visible | `contacto@nicrosil.com` |
| `src/components/Contact.tsx` | `mailto:` destino | `contacto@nicrosil.com` |
| `src/layouts/Layout.astro` | `sameAs` (redes sociales) | array vacío |

---

## Pendiente

- [ ] **`robots.txt`** — agregar en `/public/robots.txt`
- [ ] **Sitemap** — instalar `@astrojs/sitemap` y configurar en `astro.config.mjs`
- [ ] **Dominio y deploy** — configurar `site` en `astro.config.mjs` con la URL final
- [ ] **Redes sociales** — completar array `sameAs` en Schema.org del Layout
- [ ] **Datos de contacto reales** — email, teléfono/WhatsApp
- [ ] **OG Image** — crear imagen 1200×630 px para compartir en redes
- [ ] **Google Search Console** — verificación y envío del sitemap
- [ ] **Analytics** — integrar Umami, Plausible o similar (privacy-first)
