# Nicrosil — Sitio Web Oficial

Sitio de presentación corporativa de **Nicrosil**, agencia de desarrollo web. Construido con Astro 6, Tailwind CSS v4 y Preact, con foco en rendimiento máximo, SEO técnico y accesibilidad.

---

## Stack

| Tecnología | Versión | Rol |
|---|---|---|
| [Astro](https://astro.build) | 6.x | Framework principal, SSG |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Estilos (vía plugin Vite, sin config JS) |
| [Preact](https://preactjs.com) | 10.x | Componentes interactivos con `client:*` |
| Poppins | — | Tipografía principal (display + body) |

---

## Comandos

```bash
pnpm dev          # Servidor de desarrollo en localhost:4321
pnpm build        # Build de producción → ./dist/
pnpm preview      # Preview del build antes de desplegar
pnpm astro check  # Type-check de archivos .astro
npx prettier --write .  # Formatear todo el proyecto
```

---

## Estructura del proyecto

```
src/
├── components/
│   ├── sections/              # Secciones de la landing page
│   │   ├── Hero.astro         # H1, CTAs, slider de portfolio
│   │   ├── TrustMetrics.astro # 4 métricas con animación CountUp
│   │   ├── Services.astro     # 4 servicios — cambia color al seleccionar
│   │   ├── Philosophy.astro   # Filosofía de marca con pilares interactivos
│   │   ├── Process.astro      # 4 pasos del proceso (scroll-driven)
│   │   ├── ContactSection.astro # Sección de contacto
│   │   ├── Authority.astro    # Trayectoria y credenciales
│   │   └── Clients.astro      # Franja de logos de clientes
│   │
│   ├── layout/                # Estructura chrome de la página
│   │   ├── Header.astro       # Nav sticky pill, hamburger mobile, CTA
│   │   ├── Footer.astro       # Siempre dark, nav, copyright
│   │   └── Fondo.astro        # SVG decorativo de fondo (fixed, aria-hidden)
│   │
│   ├── interactive/           # Componentes Preact (hidratados en cliente)
│   │   ├── HeroSlider.tsx     # Slider con drag/swipe y auto-avance
│   │   ├── ServicesCards.tsx  # Grid de cards con color dinámico por servicio
│   │   ├── PhilosophyPillars.tsx # Acordeón de pilares con auto-ciclo
│   │   ├── ProcessScrolled.tsx  # Sección sticky scroll-driven
│   │   ├── Contact.tsx        # Formulario con validación client-side
│   │   └── ThemeToggle.tsx    # Toggle dark/light con glow en hover
│   │
│   ├── ui/                    # Primitivos reutilizables
│   │   ├── SectionHeader.astro  # Eyebrow + H2 + descripción (patrón compartido)
│   │   ├── PulseDot.astro     # Punto pulsante animado (estado "live")
│   │   └── CountUp.tsx        # Número animado con IntersectionObserver
│   │
│   └── hooks/                 # Custom hooks de Preact
│       ├── useDarkMode.ts     # Detecta dark mode vía MutationObserver
│       └── useProgressiveNumber.ts # Animación numérica interpolada
│
├── data/
│   └── navigation.ts          # Links de nav compartidos entre Header y Footer
│
├── icons/
│   └── Arrow.astro            # Ícono flecha derecha reutilizable
│
├── layouts/
│   └── Layout.astro           # Head SEO completo, anti-FOUC, Schema.org
│
├── pages/
│   └── index.astro            # Landing page, ensambla todos los componentes
│
└── styles/
    └── global.css             # Tokens de diseño, fuentes, temas light/dark
```

---

## Path aliases

Definidos en `tsconfig.json`:

| Alias | Resuelve a |
|---|---|
| `@components/*` | `src/components/*` |
| `@layouts/*` | `src/layouts/*` |
| `@hooks/*` | `src/components/hooks/*` |
| `@icons/*` | `src/icons/*` |

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
  --primary: #0891B2;  /* cyan — acento principal light */
  --spark:   #16A34A;  /* verde — acento secundario light */
}
:root.dark {
  --primary: #22D3EE;  /* cyan — acento principal dark */
  --spark:   #22C55E;  /* verde — acento secundario dark */
}
```

---

## Componentes interactivos

Los componentes Preact usan directivas `client:` para controlar cuándo se hidratan:

| Componente | Directiva | Motivo |
|---|---|---|
| `ThemeToggle` | `client:only="preact"` | Necesita localStorage desde el primer frame |
| `HeroSlider` | `client:load` | Visible inmediatamente en el hero |
| `ServicesCards` | `client:visible` | Debajo del fold, se hidrata al entrar en viewport |
| `PhilosophyPillars` | `client:visible` | Ídem |
| `ProcessScrolled` | `client:visible` | Scroll-driven, no necesita hidratarse antes |
| `Contact` | `client:visible` | Formulario debajo del fold |
| `CountUp` | `client:visible` | Animación al entrar en viewport |

---

## SEO

- **Schema.org** `ProfessionalService` con dirección y `areaServed: worldwide` en `Layout.astro`
- **Geo meta tags** (`geo.region`, coordenadas) para SEO local
- **Open Graph** y **Twitter Card** configurados con props sobreescribibles por página
- `Layout.astro` acepta props `title`, `description`, `canonical` y `ogImage`

---

## Datos a completar antes de producción

| Archivo | Campo | Estado |
|---|---|---|
| `src/layouts/Layout.astro` | `email` en Schema.org | vacío |
| `src/layouts/Layout.astro` | `telephone` en Schema.org | vacío |
| `src/layouts/Layout.astro` | `sameAs` (redes sociales) | array vacío |
| `src/components/sections/Process.astro` | Imágenes de pasos | CDN placeholder (codepen.io) |

---

## Pendiente

- [ ] **`robots.txt`** — agregar en `/public/robots.txt`
- [ ] **Sitemap** — instalar `@astrojs/sitemap` y configurar en `astro.config.mjs`
- [ ] **Dominio y deploy** — configurar `site` en `astro.config.mjs` con la URL final
- [ ] **Redes sociales** — completar array `sameAs` en Schema.org
- [ ] **Datos de contacto reales** — email, teléfono/WhatsApp en Schema.org
- [ ] **Imágenes de proceso** — reemplazar placeholders de codepen.io con imágenes propias
- [ ] **OG Image** — crear imagen 1200×630 px para compartir en redes
- [ ] **Backend de formulario** — reemplazar `mailto:` por Formspree, Resend o similar
- [ ] **Google Search Console** — verificación y envío del sitemap
- [ ] **Analytics** — integrar Umami, Plausible o similar (privacy-first)
