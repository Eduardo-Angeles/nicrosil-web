# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
pnpm dev        # Start dev server at localhost:4321
pnpm build      # Build production site to ./dist/
pnpm preview    # Preview production build locally
pnpm astro check  # Type-check .astro files
```

Format code with Prettier (configured for Astro + Tailwind class sorting):
```sh
npx prettier --write .
```

## Stack

- **Astro 5** — file-based routing under `src/pages/`; layouts in `src/layouts/`
- **Preact** — used for interactive components (JSX is configured with `jsxImportSource: "preact"`)
- **Tailwind CSS v4** — loaded as a Vite plugin via `@tailwindcss/vite`; global CSS entry is `src/styles/global.css`
- **TypeScript** — strict mode extending `astro/tsconfigs/strict`

## Path Aliases

Defined in `tsconfig.json`:

| Alias | Resolves to |
|---|---|
| `@components/*` | `src/components/*` |
| `@layouts/*` | `src/layouts/*` |
| `@hooks/*` | `src/components/hooks/*` |
| `@icons/*` | `src/icons/*` |

## Architecture Notes

- `.astro` files use the frontmatter (`---`) block for server-side logic and imports; JSX/HTML below the second `---` is the template.
- Interactive Preact components are placed in `src/components/` and imported into `.astro` files. Use the `client:*` directive (e.g., `client:load`) to hydrate them on the client.
- There are no tests configured in this project.
