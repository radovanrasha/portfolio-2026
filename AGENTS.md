<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Project: Chess Portfolio

The visual design is the one in `../portfolio-2026-design/` (a Babel-standalone React
prototype). It was ported into this Next.js app. When changing look & feel, treat that
folder's `styles.css` + `screenshots/` as the source of truth.

## Architecture (overlay-based SPA — NOT routes)

- The whole experience is one client component tree mounted at `/` — there are **no**
  per-section routes (`/about` etc. were removed). Sections open as a fixed `.overlay`
  on top of the board, driven by React state (`route`), not navigation.
- `src/components/chess/ChessApp.tsx` — orchestrator: move flow, selection, the page
  overlay, the right-side legend, Esc/Arrow keyboard handling.
- `src/components/chess/BoardParts.tsx` — `Squares`, `Piece`, `TargetHint`, `OriginGlow`,
  `TargetClick`.
- `src/components/chess/Pages.tsx` — the six section panels + the Skills sub-board.
- `src/lib/portfolio.ts` — ALL content + the board layout (`PAGES`, `DECOR`, `SKILLS`, …).

## How the board works

- **No chess library, no SVG pieces** — pieces are Unicode glyphs (♚♛♜♝♞♟) styled via CSS
  (`globals.css`). The board is a CSS Grid; pieces/tiles are absolutely positioned by
  `[row, col]` via the `cell()` helper.
- The position in `PAGES` is a real legal "white to move": 6 white navigational pieces,
  one decorative black king, and black "victims" only on the two capture targets
  (Projects = queen×knight, Skills = knight×pawn). Each white piece has exactly one legal
  move that opens its page. **Do not change coordinates casually** — keep it legal.
- Move flow: click a white piece → its destination square lights up (ring + label) →
  click the lit square → piece glides (CSS transition, ~560ms) → overlay opens.

## Styling

- Animation is **pure CSS** (transitions/keyframes in `globals.css`). framer-motion and
  zustand are installed but unused by this design — don't reach for them.
- **No Tailwind** in the ported design — `globals.css` is hand-written CSS using CSS
  custom properties. The walnut palette + tilt are baked into `:root`.
- Fonts via `next/font/google` in `layout.tsx`: Cormorant Garamond (`--display`),
  Outfit (`--body`), JetBrains Mono (`--mono`). Never load fonts via `<link>`.

## Language & owner

- Entire UI is in **English**. No Serbian text anywhere.
- Owner is **Radovan Ivanović** (NOT Rašković). All personal data comes from the old
  portfolio at `../radovanrasha-portfolio/src/` — never invent personal info.
- The design has 6 sections; Courses + the BizKod competition are folded into **Education**.
