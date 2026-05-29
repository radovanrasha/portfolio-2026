# Chess Portfolio — radovanrasha.com (2026)

A portfolio where navigation is a chessboard. Land on an empty board, eat the queen, unlock the pieces — each piece opens a section of the portfolio.

## Concept

- **Landing**: empty board, one pawn, one queen. Hint: *"eat a queen"*
- **Capture**: pawn eats the queen → full board materializes
- **Navigate**: each piece leads to a section (About, Projects, Skills, Experience, Courses, Competitions, Contact)
- **Return**: every section has a back-to-board button with a reverse transition

See [`PLAN.md`](./PLAN.md) for the full implementation plan, section content, animation breakdown, and phase checklist.

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Framer Motion (animations)
- Zustand (chess game state)
- Custom SVG chess pieces (no chess library)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
