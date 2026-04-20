# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server (Vite HMR)
pnpm build      # Type-check (tsc -b) then bundle for production
pnpm lint       # Run ESLint
pnpm preview    # Serve the production build locally
```

No test framework is configured.

## Architecture

This is a single-component SPA (`src/App.tsx`) — a scroll-driven interactive landing page for Max Verstappen / Oracle Red Bull Racing. There is no routing, no state management library, and no component decomposition beyond `App.tsx`.

### Scroll-driven animation loop

The core mechanic: a 550vh scroll container drives a progress value (0.0–1.0) which controls everything else.

- **Canvas frame rendering** — 52 pre-loaded JPEGs (`/public/frames/frame_0001.jpg`–`frame_0052.jpg`) are painted to a fullscreen `<canvas>` on each `requestAnimationFrame` tick. The current frame index is `Math.round(progress * 51)`.
- **Panel visibility** — four info panels (EL PILOTO, PALMARÉS, TEMPORADA 2024, LEGADO) each have a `[start, end]` scroll range defined in a constant array. React state (`activePanel`) only updates when the active panel changes, so canvas rendering never triggers re-renders.
- The `rAF` loop is started once on mount and runs continuously; scroll events only update a ref, not state.

### Styling system

All styles live in `src/App.css`. Design tokens are CSS custom properties at `:root`:
- Red Bull Red `#E8002D`, Navy `#001A72`, Yellow `#FFC906`, Dark bg `#06060A`
- Headlines: Bebas Neue (Google Fonts); body/UI: Inter (Google Fonts)
- Responsive breakpoints: 768px (tablet) and 480px (mobile, panels hidden)
- Reduced-motion support via `prefers-reduced-motion`

### Public assets

`/public/frames/` holds the 52 JPEG animation frames. These are served statically and loaded imperatively in JS — they are not imported through Vite.

## TypeScript config

- Target ES2023, module ESNext with bundler resolution
- `noUnusedLocals` and `noUnusedParameters` are **enabled** — the build will fail if you leave dead variables

## Notes

- `framer-motion` is installed but not used — the animation system is custom canvas + rAF
- All on-screen copy is in Spanish (target audience)
