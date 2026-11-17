> 🇧🇷 [Leia este README em português](README.pt.md)

# Calculadora de Financiamento

A free, educational web app for simulating and comparing loan financing in Brazil. It calculates **PRICE**, **SAC**, **SAM**, and **Americano** amortization schedules, helps you test different scenarios side by side, and shows exactly how much interest you would pay over time.

The application interface is currently in Brazilian Portuguese.

## Features

- **Four amortization systems:** PRICE (fixed installments), SAC (constant amortization), SAM (mixed), and Americano (interest-only with a final balloon payment).
- **Multiple studies:** create, clone, rename, and color-code simulations to compare systems, amounts, rates, or terms at once. Fields can be locked per study so each scenario can override shared values.
- **Extra payments:** add one-off payments that either reduce the installment amount or shorten the loan term.
- **Detailed results:** first/last installment, total paid, total interest, effective rate, a full amortization table, and a comparison chart. Click a chart point or table row to add an extra payment for that month.
- **Share and export:** copy a self-contained share link (state is compressed into the URL), or export the active study as CSV or PDF.
- **Works offline:** installable PWA with a service worker, responsive layout for mobile and desktop, and light/dark theme support.
- **Private by design:** all calculations run locally in the browser. Studies are saved in `localStorage`, and no personal data is sent to a server.

> This tool is for educational purposes only and is not financial advice. Results are estimates and may not include fees, insurance, taxes, or other charges.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | [SvelteKit 2](https://svelte.dev/docs/kit) + [Svelte 5](https://svelte.dev), TypeScript |
| Styling / UI | Tailwind CSS 4, bits-ui, Lucide icons, Embla Carousel |
| Features | Chart.js, jsPDF, PapaParse, lz-string (share links), vite-plugin-pwa |
| Tooling | Vite, Vitest, Prettier, svelte-check |
| Output | Static site via `@sveltejs/adapter-static` |

## Getting started

Prerequisites: **Node.js 20+** and npm.

```sh
npm install
npm run dev
```

Open <http://localhost:5173>. To bind the dev server to a different host/port, use `npm run dev -- --host 0.0.0.0 --port 3000` (the default host is already `0.0.0.0`).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Build the static site into `build/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run check` | Run svelte-check and TypeScript diagnostics. |
| `npm run check:watch` | Run type checks in watch mode. |
| `npm test` | Run the Vitest test suite (watch mode). Use `npm test -- --run` for a single run. |
| `npm run test:ui` | Open the Vitest UI. |

## Project structure

```text
src/
├── lib/
│   ├── calculator/   # Amortization algorithms, types, and formatting helpers
│   ├── components/   # Form, results, chart, amortization table, exports, UI primitives
│   └── stores/       # Studies state, persistence, share links, ad visibility
└── routes/           # Calculator, Comparar, Guias, FAQ, Sobre, Autor pages
```

Both `svelte.config.js` and `vite.config.ts` read the optional `SVELTE_BASE_PATH` environment variable to support deployment under a subpath.

## Deployment

The site is fully prerendered and deployed as static files:

- **GitHub Pages** — `.github/workflows/deploy.yml` runs on pushes to `main` and builds with `SVELTE_BASE_PATH=/calculadora-financeira`.
- **AWS S3 + CloudFront** — `.github/workflows/deploy-aws.yml` runs on `v*` tags, builds with an empty base path, syncs `build/` to the configured bucket, and invalidates the CloudFront cache.

Both workflows require the corresponding repository secrets to be configured.

## Privacy and disclaimer

Calculations are performed entirely in your browser; inputs and studies stay on your device (except when you explicitly copy a share link). This project provides educational estimates only — consult a qualified professional before making financial decisions.
