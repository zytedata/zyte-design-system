# Zyte Design System — Next.js

Foundation for the Zyte design system / DesignOps dashboard.

## Stack

- [Next.js 16](https://nextjs.org/) with App Router and Turbopack
- [React 19](https://react.dev/)
- [TypeScript 5](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/postcss`)
- [shadcn/ui](https://ui.shadcn.com/) — `radix-nova` preset, neutral base color, CSS variables
- [lucide-react](https://lucide.dev/) icons
- [next-themes](https://github.com/pacocoursey/next-themes) for theme switching
- [sonner](https://sonner.emilkowal.ski/) for toasts
- ESLint 9 (flat config) + Prettier 3 + `prettier-plugin-tailwindcss`
- EditorConfig

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command                | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Start the dev server (Turbopack)                 |
| `npm run build`        | Create a production build                        |
| `npm run start`        | Start the production server                      |
| `npm run lint`         | Run ESLint                                       |
| `npm run lint:fix`     | Run ESLint with `--fix`                          |
| `npm run format`       | Format files with Prettier                       |
| `npm run format:check` | Verify formatting (CI)                           |
| `npm run typecheck`    | Run `tsc --noEmit`                               |

## Project structure

```
src/
├── app/                       # App Router (pages, layouts, route handlers)
│   ├── globals.css            # Tailwind v4 + shadcn theme tokens
│   ├── layout.tsx             # Root layout (providers + app shell)
│   └── page.tsx               # Dashboard landing page
├── components/
│   ├── ui/                    # shadcn primitives (button, card, sheet, …)
│   ├── layout/                # App-shell pieces (sidebar, topbar)
│   ├── common/                # Shared composed components (theme toggle, …)
│   └── providers/             # React context providers (theme, tooltip, …)
├── config/
│   ├── site.ts                # Site metadata, links
│   └── nav.ts                 # Navigation structure
├── hooks/                     # Reusable client hooks
├── lib/
│   └── utils.ts               # `cn()` helper and other utilities
└── types/                     # Shared TypeScript types
```

### Path aliases

Configured in `tsconfig.json`:

```ts
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
```

## Adding shadcn components

```bash
npx shadcn@latest add <component>
```

Components are added to `src/components/ui/` and tracked via `components.json`.

## Theming

Light / dark / system theme is wired via `next-themes` in
`src/components/providers/app-providers.tsx`. The `<html>` tag uses the `class`
attribute strategy so Tailwind's `dark:` variants work everywhere. Tokens live
in `src/app/globals.css` and follow the shadcn CSS-variables pattern.

## Conventions

- Server components by default; mark client components with `"use client"`.
- Co-locate route-specific UI under `src/app/<route>/_components/` if needed.
- Keep `src/components/ui/` for unmodified shadcn primitives — extend them in
  `src/components/common/` rather than editing in place.
- Format on save with Prettier; rely on the Tailwind plugin to sort classes.
