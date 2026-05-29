# Chess Portfolio — Implementation Plan

## Vision

A portfolio where the entire navigation is a chessboard. The user lands on an empty board with two pieces and a single hint. Playing through unlocks the full board, where each piece is a doorway to a section of the portfolio. The experience is meant to be surprising, memorable, and smooth — not a gimmick that gets in the way.

---

## UX Flow

### Phase 1 — The Empty Board
- Full-viewport chessboard appears on load
- Board is mostly empty, dark background, premium feel
- Only two pieces are visible:
  - **White Pawn** at `e2` — the user's identity, their starting position
  - **Black Queen** at `d5` — the challenge, placed centrally for visual drama
- A subtle animated hint appears below the board: `"eat a queen"` — it pulses softly every few seconds if the user hasn't interacted yet

### Phase 2 — The Capture
1. User clicks (or taps) the Pawn → it glows gold, valid capture square highlights on `d5`
2. User clicks the Queen at `d5` → pawn slides diagonally in a smooth animation
3. Queen dissolves with a particle burst effect
4. Brief pause (0.4s), then...

### Phase 3 — The Board Opens
New pieces materialize one by one with a staggered entrance animation (pop + glow):
- **King** at `a8` → About
- **Knight** at `g8` → Projects
- **Bishop** at `a1` → Skills
- **Rook** at `h1` → Experience
- **Pawn** at `c7` → Courses
- **Pawn** at `e7` → Competitions
- **Pawn** at `g7` → Contact

Each piece has a subtle glow aura. On hover, a small label floats above it (e.g., `"O meni"` or `"About"`). On mobile, labels are always visible.

### Phase 4 — Navigation
- Clicking any piece triggers a chess-board dissolve transition → the squares fade out in a checkerboard wave pattern, revealing the section page
- Every section page has a `←` back button in the top-left, styled as chess notation (e.g., `← board`)
- Back button reverses the dissolve transition, returning to the board with all pieces still visible

---

## Board Layout

### Initial state
```
8  .  .  .  .  .  .  .  .
7  .  .  .  .  .  .  .  .
6  .  .  .  .  .  .  .  .
5  .  .  .  ♛  .  .  .  .
4  .  .  .  .  .  .  .  .
3  .  .  .  .  .  .  .  .
2  .  .  .  .  ♙  .  .  .
1  .  .  .  .  .  .  .  .
   a  b  c  d  e  f  g  h
```

### After capture (pawn moves to d5, more pieces appear)
```
8  ♚  .  .  .  .  .  ♞  .
7  .  .  ♟  .  ♟  .  ♟  .
6  .  .  .  .  .  .  .  .
5  .  .  .  ♙  .  .  .  .  ← promoted pawn stays here
4  .  .  .  .  .  .  .  .
3  .  .  .  .  .  .  .  .
2  .  .  .  .  .  .  .  .
1  ♝  .  .  .  .  .  .  ♜
   a  b  c  d  e  f  g  h
```

---

## Piece → Section Mapping

| Piece | Position | Section | Thematic reason |
|-------|----------|---------|----------------|
| ♚ King | a8 | **About** | The king is the most important piece — your story matters most |
| ♞ Knight | g8 | **Projects** | The knight jumps over obstacles, moves in unexpected ways — creative work |
| ♝ Bishop | a1 | **Skills** | Bishops cover the diagonal — range across technologies |
| ♜ Rook | h1 | **Experience** | Rooks are solid, powerful in straight lines — foundational work history |
| ♟ Pawn | c7 | **Courses** | Pawns are small consistent steps forward — learning and growth |
| ♟ Pawn | e7 | **Competitions** | Another pawn — achievements earned in the field |
| ♟ Pawn | g7 | **Contact** | The pawn that can become anything — reach out and let's build |

---

## Visual Design System

### Color Palette
```
Background:       #080c14   (near-black with blue tint)
Dark squares:     #1a2744   (deep navy)
Light squares:    #e8dcc8   (warm cream/parchment)
Board border:     #0f1a2e
Piece (white):    #f5f0e8   (off-white/ivory)
Piece (black):    #1a1a2e   with #4a9eff glow for interactive pieces
Accent gold:      #d4af37   (selection glow, highlights)
Hint text:        #6b8aad   (muted blue-grey)
```

### Typography
- **Headings**: `Playfair Display` (Google Fonts) — serif, classic chess/literature feel
- **Body/UI**: `Inter` (Google Fonts) — clean, modern, readable on all sizes
- **Chess notation labels**: `Space Mono` — monospace, adds developer personality

### Board Visual Details
- Pieces are SVG-based — crisp at any screen size, no raster blurriness
- Selected piece: gold drop-shadow ring + slight scale-up (1.08x)
- Valid capture highlight: subtle red-tinted glow on the target square
- Piece entrance animation: scale from 0 to 1 with a spring physics feel + brief golden flash
- Board coordinates (`a–h`, `1–8`) rendered in small monospace text along edges

### CSS 3D Perspective — "Lifted Board" Effect
The board gets a subtle 3D feel with pure CSS — no Three.js, no WebGL.

```css
.board-wrapper {
  perspective: 900px;
  perspective-origin: 50% 30%;
}

.board {
  transform: rotateX(16deg);
  transform-style: preserve-3d;

  /* thick layered shadow simulates board sitting on a surface */
  box-shadow:
    0 6px 0px #0a0e1a,     /* hard bottom edge — board thickness */
    0 8px 2px #060810,     /* secondary edge */
    0 20px 60px rgba(0,0,0,0.8),   /* large ambient shadow on surface */
    0 40px 100px rgba(0,0,0,0.5);  /* distant soft shadow */
}
```

This gives the impression the board is a physical object lying on a table, viewed from slightly above and in front — like sitting across from it. No load overhead, works on all devices, degrades gracefully if CSS 3D is unsupported.

The `rotateX` angle should be tweakable: on mobile drop it to `8deg` so the top rows don't get cut off.

### Page Sections (common layout)
- Dark background (`#080c14`), matching the board
- Max width `1200px`, centered
- Section title in Playfair Display with a small chess piece icon prefix
- Content in Inter
- Subtle decorative chess board texture in background (5% opacity) on section pages

---

## Tech Stack

### Core (already installed)
- **Next.js 16** (App Router) — routing, SSR, image optimization
- **React 19** — UI
- **TypeScript** — type safety
- **Tailwind CSS 4** — utility styles

### To Install
```bash
npm install framer-motion zustand
```

| Library | Version target | Why |
|---------|---------------|-----|
| `framer-motion` | ^12 | Piece animations, page transitions, spring physics — the single most important dep |
| `zustand` | ^5 | Chess game state (which pieces are on board, which are unlocked, selected piece) — lightweight, no boilerplate |

### Explicitly NOT using
- `react-chessboard` — designed for real chess, we need custom visual behavior
- `chess.js` — real chess rule engine, overkill; we handle only 1 legal move (pawn captures queen)
- `react-spring` — Framer Motion does everything we need more ergonomically
- Any CSS-in-JS lib — Tailwind 4 is sufficient

### SVG Chess Pieces
Use inline SVG components sourced from the cburnett set (public domain, Wikimedia Commons). Store as React components in `src/components/chess/pieces/`. This avoids external font dependencies and gives full style control.

---

## File Structure

```
portfolio-2026/
  src/
    app/
      layout.tsx              ← root layout (fonts, global providers)
      page.tsx                ← chess board landing (the whole experience)
      globals.css             ← base styles, CSS custom properties
      about/
        page.tsx
      projects/
        page.tsx
      skills/
        page.tsx
      experience/
        page.tsx
      courses/
        page.tsx
      competitions/
        page.tsx
      contact/
        page.tsx
    components/
      chess/
        ChessBoard.tsx        ← 8×8 grid, manages square rendering
        ChessSquare.tsx       ← individual square with highlight states
        ChessPiece.tsx        ← animated piece wrapper + click handler
        CaptureEffect.tsx     ← particle burst when queen is captured
        HintText.tsx
        pieces/
          King.tsx
          Queen.tsx
          Knight.tsx
          Bishop.tsx
          Rook.tsx
          Pawn.tsx
      layout/
        PageWrapper.tsx       ← wraps all section pages (back button, transition)
        BackToBoard.tsx       ← chess-notation styled ← button
        SectionTitle.tsx      ← piece icon + title heading
      ui/
        TechTag.tsx           ← skill/tech badge pill
        ProjectCard.tsx       ← project card with hover lift
        TimelineEntry.tsx     ← experience timeline item
    lib/
      chess-store.ts          ← zustand store: board state, unlocked pieces, phase
      chess-config.ts         ← piece definitions, positions, route mappings
      animations.ts           ← shared Framer Motion variants
    hooks/
      useChessGame.ts         ← game logic: handle clicks, phase transitions
      useMediaQuery.ts        ← responsive breakpoint detection
```

---

## Section Content

### About (`/about`)
**Layout**: Two-column on desktop (text left, photo right), stacked on mobile
**Content**:
- Name: Radovan Ivanović
- Role: Full-Stack JavaScript Developer
- Location: Serbia
- Bio: ~3 paragraphs (economics background → informatics → professional dev)
- Education: Business Informatics, University of Economics Subotica
- Photo: reuse assets from `radovanrasha-portfolio` if available

**Chess motif**: Section title: `♚ About`

---

### Projects (`/projects`)
**Layout**: Responsive card grid (3 cols desktop → 2 tablet → 1 mobile)
**Content**:
1. **Playground** — full-stack gaming platform (Node.js, Express, MongoDB, Socket.IO, React)
2. **Weather App** — real-time weather from external APIs (React, CSS3)
3. **Notes App** — CRUD note-taking with auth (Express, MongoDB, Ant Design, React)

**Card design**: Screenshot top half, info bottom half. Tags as pill badges. Hover: card lifts 8px, border glows gold.
**Chess motif**: Section title: `♞ Projects`

---

### Skills (`/skills`) — SPECIAL: skills laid out ON a chessboard
**Layout**: The wooden chessboard stays (`SkillsBoard.tsx`). Skill brand icons sit on
the squares like pieces, animating in with a staggered spring. Three category rows,
each labelled on a left rail. Hover (or tap) lights an icon up in its brand color +
glow; the name shows under each icon on a dark pill.
- **Frontend** (rank 6): React, JavaScript, TypeScript, HTML, CSS, Ant Design
- **Backend** (rank 4): Node.js, Express, NestJS, MongoDB, SQL
- **Tools & Infra** (rank 2): Git/GitHub, VPS Linux, Nginx, Photoshop

**Icons**: brand SVG paths hardcoded in `src/lib/skills.ts` (extracted from simple-icons,
CC0). SQL + Photoshop are custom marks (not in simple-icons). Board visual styles are
shared via `src/components/chess/boardStyles.ts`.

**Chess motif**: Section title: `♝ Skills`. This is the one section that reuses the
interactive board surface instead of a plain content page.

---

### Experience (`/experience`)
**Layout**: Vertical timeline (single column centered)
**Content**:
- **Concordsoft Solutions** — Full-Stack Developer, July 2022 – Present
  - 7 real-world projects delivered
  - Node.js, React, MongoDB stack
  - Project planning (Trello/Jira), team collaboration
  - VPS Linux server management, SQL

**Chess motif**: Section title: `♜ Experience`. Timeline nodes styled as small rook icons.

---

### Courses (`/courses`)
**Layout**: Card list (1 per row, wider cards)
**Content**:
1. The Complete Node.js Developer Course (Udemy)
2. The Complete React Developer Course (Udemy)
3. MongoDB – The Complete Developer's Guide (Udemy)

**Chess motif**: Section title: `♟ Courses`

---

### Competitions (`/competitions`)
**Layout**: Single featured card (centred, hero style)
**Content**:
- **BizKod v7.0 Hackathon – 3rd Place**, March 2023
  - 24h competition by Inspira Grupa
  - Built mobile app with React Native, Node.js, MongoDB
  - Led backend development

**Chess motif**: Section title: `♟ Competitions`

---

### Contact (`/contact`)
**Layout**: Centered, minimal
**Content**:
- Email link (mailto)
- GitHub link
- LinkedIn link (if applicable)
- Short CTA: "Open to new opportunities and interesting projects"

**Chess motif**: Section title: `♟ Contact`. Tagline at bottom: `"Your move."` — chess pun + call to action.

---

## Language

The entire portfolio is in **English**. No Serbian text anywhere in the UI — including hints, labels, section titles, and button text.

---

## Animation Breakdown

### Board Entry (page load)
```
1. Background fades in (300ms, ease-out)
2. Board container scales from 0.95 → 1.0 + fades in (400ms, spring)
3. Pawn appears with pop (scale 0 → 1.1 → 1.0, 300ms)
4. Queen appears 200ms after pawn
5. Hint text fades in (600ms delay)
```

### Pawn Selection
```
- Clicked pawn: scale 1.0 → 1.08, gold drop-shadow appears
- Target square (d5): subtle red glow pulses once
- Transition: 150ms spring
```

### Capture Animation
```
1. Pawn slides from e2 to d5 (400ms, ease-in-out, slight diagonal arc)
2. At d5 arrival: Queen flashes white (100ms), then dissolves
   with scale 1→1.5 + opacity 1→0 (200ms)
3. Particle burst: 8 small squares scatter from center (300ms, physics-based)
4. Pawn settles at d5 (spring bounce, 150ms)
```

### New Pieces Appear
```
Each piece: scale 0 → 1.1 → 1.0, opacity 0 → 1
Staggered: 150ms between each piece
Order: King → Knight → Bishop → Rook → Pawn1 → Pawn2 → Pawn3
Total duration: ~1.3s for full reveal
Each piece briefly pulses gold after appearance (glow fade, 500ms)
```

### Page Transition (piece click → section)
```
1. Clicked piece glows intensely (scale 1.1, bright gold, 200ms)
2. Board squares fade out in a checkerboard wave:
   white squares first, then dark squares (staggered by distance from center)
   Total dissolve: 400ms
3. Section page content fades up from below (translateY +20px → 0, 300ms)
```

### Back to Board
```
1. Section page fades out + slides down slightly (300ms)
2. Board squares appear in reverse checkerboard wave (400ms)
3. Board state restored (all pieces in place)
```

---

## Mobile Responsiveness

### Board
- Size: `min(100vw, 100svh) - 32px` — always square, fits without scrolling
- Each square: board size / 8
- On 375px (iPhone SE): squares ≈ 43px — comfortably tappable
- Tap to select, tap valid square to move (no drag required)
- Piece labels always visible on mobile (no hover state)

### Section Pages
- Single column below 768px
- Project cards: 1 per row on mobile
- Skills grid: 3 per row on mobile
- Back button pinned top-left, minimum 48×48px touch target

---

## Implementation Phases

### Phase 1 — Foundation
- [ ] Install `framer-motion` and `zustand`
- [ ] Set up fonts in `layout.tsx` (Playfair Display, Inter, Space Mono via `next/font/google`)
- [ ] Write global CSS variables (colors, board sizing)
- [ ] Create `chess-config.ts` — piece definitions and route mappings
- [ ] Create `chess-store.ts` — zustand store with phases: `INITIAL | CAPTURED | NAVIGATING`
- [ ] Build `ChessBoard.tsx` and `ChessSquare.tsx` — static board rendering
- [ ] Add SVG piece components (Pawn and Queen first)

### Phase 2 — Core Interaction
- [ ] Build `ChessPiece.tsx` with selection state and click handlers
- [ ] Implement `useChessGame.ts` — pawn selection → queen capture → phase change
- [ ] Add capture animation (`CaptureEffect.tsx`)
- [ ] Add staggered piece entrance animations for Phase 3
- [ ] Add `HintText.tsx` with pulsing animation

### Phase 3 — Routing & Transitions
- [ ] Build `PageWrapper.tsx` with board-dissolve transition
- [ ] Build `BackToBoard.tsx` with reverse transition
- [ ] Wire piece clicks to `router.push()` inside transition sequence
- [ ] Test all 7 section routes

### Phase 4 — Section Pages
- [ ] `/about`
- [ ] `/projects`
- [ ] `/skills`
- [ ] `/experience`
- [ ] `/courses`
- [ ] `/competitions`
- [ ] `/contact`

### Phase 5 — Polish & Responsive
- [ ] Mobile testing (375px, 390px, 414px)
- [ ] Touch interaction testing
- [ ] Performance audit (no layout shift, smooth 60fps)
- [ ] `metadata` exports for SEO on all pages
- [ ] Final visual pass: shadows, spacing, typography rhythm

---

## Key Decisions & Trade-offs

**Custom board vs library**: Custom gives exact control over the unique UX. A chess library would fight us at every step since we're not implementing real chess.

**Framer Motion for all animation**: Keeps animation logic centralized, handles layout animations and exit animations natively, works well with React 19.

**Zustand over Context**: Chess state is accessed across many components; zustand avoids prop drilling with zero boilerplate. State resets cleanly on board return.

**App Router, client components for board**: The chess board is fully interactive — use `"use client"` on all chess components. Section pages can be server components (static content).

**SVG pieces over Unicode**: Unicode chess symbols (♙♛) render inconsistently across OS/browser fonts and can't be animated as individual elements. SVG gives pixel-perfect rendering and full animation control.
