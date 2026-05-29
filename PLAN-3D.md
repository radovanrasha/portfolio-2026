# Chess Portfolio — Alternative 3D Plan (React Three Fiber)

> This is the alternative implementation using a fully 3D chessboard.
> The primary plan (flat 2D board, SVG pieces) is in `PLAN.md`.
> Core concept, UX flow, sections, and content are identical — only the rendering layer differs.

---

## What's Different vs PLAN.md

| | PLAN.md (primary) | PLAN-3D.md (this) |
|---|---|---|
| Board rendering | CSS Grid + SVG pieces | WebGL via React Three Fiber |
| Pieces | SVG React components | 3D GLTF models or lathe geometry |
| Lighting | CSS box-shadow / filter | Real-time PBR lighting, shadows |
| Camera | None (flat top-down) | Animated perspective camera |
| Glow effects | CSS drop-shadow | Bloom postprocessing |
| Capture effect | CSS particles | 3D particle burst |
| Bundle size | ~200KB added | ~700KB+ added |
| Mobile risk | Low | Medium (GPU dependent) |
| Implementation complexity | Medium | High |

---

## Additional Dependencies

```bash
npm install @react-three/fiber @react-three/drei @react-three/postprocessing three
npm install --save-dev @types/three
```

| Library | Why |
|---------|-----|
| `@react-three/fiber` | React renderer for Three.js — declarative scene graph |
| `@react-three/drei` | Helpers: shadows, environment maps, camera controls, Text3D, Float |
| `@react-three/postprocessing` | Bloom (glow on selected piece), depth of field, vignette |
| `three` | Three.js core |
| `@types/three` | TypeScript types |

Framer Motion and Zustand remain the same as in the primary plan.

---

## 3D Scene Setup

### Camera
- Position: `(0, 14, 10)` — slightly above and behind, looking down at the board at a ~55° angle
- Camera intro animation: starts at `(0, 30, 0)` (straight top-down), smoothly tilts to final position over 1.2s on load
- No user camera control (no OrbitControls) — camera is fixed for consistent experience
- On mobile: slightly more top-down `(0, 16, 7)` to fit the board in frame

### Lighting
```
- AmbientLight: intensity 0.4, color #c8d8ff (cool blue-white)
- DirectionalLight: position (5, 12, 6), intensity 1.2, castShadow: true
  - Shadow map size: 2048×2048
  - Shadow camera frustum covers the full board
- PointLight: position (0, 6, 0), intensity 0.3, color #d4af37 (gold fill)
  - This gives the board a warm center glow
- SpotLight on selected piece: follows active piece, gold color, castShadow
```

### Environment
- Use `<Environment preset="city" />` from Drei for IBL reflections on piece surfaces
- Board surface: PBR material — dark squares use roughness 0.3, metalness 0.1 (slight sheen); light squares roughness 0.6, metalness 0
- Background: solid `#080c14`, no HDRI skybox

---

## Chess Pieces — 3D Models

### Option A: GLTF models (recommended)
- Source: Kenney's Chess Kit (kenney.nl/assets/chess-kit) — CC0, free, clean low-poly style
- Load with `useGLTF` from Drei
- Each piece type is one mesh; tint with `meshStandardMaterial` color prop
- White pieces: `#f5f0e8` (ivory), Black pieces: `#1a1a2e` (deep navy)
- Preload all models at app start with `useGLTF.preload()`

### Option B: Programmatic geometry (fallback / no asset dependency)
Use Three.js `LatheGeometry` to generate piece profiles from a 2D curve:
- Pawn: small barrel body + round head
- Queen: tall with jagged crown points (CylinderGeometry crown on top)
- King: tall + cross on top
- Knight: rough stylized horse head (harder — use a simple angular approximation)
- Bishop: tall tapered body + ball tip
- Rook: cylinder with battlements (BoxGeometry notches on top)

Option B keeps zero asset files but Option A looks significantly better.

---

## Piece Interaction in 3D

### Selection (raycasting)
- `@react-three/fiber`'s `onClick` prop handles raycasting automatically
- Pawn click → selected state in Zustand → SpotLight moves to pawn position
- Valid target square highlights: raise the square mesh by 0.05 units + change emissive color to `#ff4444`

### Capture Animation
```
1. Pawn mesh lerps from e2 position to d5 (400ms, custom easing)
   - Slight arc: y position peaks at +2 units midway (jumping motion)
2. Queen mesh: emissive flashes white → scale 1 → 1.5 → 0 (300ms)
   + 12 small cube particles scatter outward with physics-like motion
3. Pawn settles at d5 with a bounce (spring, 150ms)
4. Camera does a subtle push-in zoom (+0.5 units closer) then settles
```

### New Pieces Materializing
Each piece spawns at y = +8 (above board), drops to y = 0 with overshoot (bounces once).
Stagger: 150ms between pieces. On arrival, brief gold emissive pulse.

### Hover Effect
- `onPointerOver` → piece `Float` animation activates (gentle bob up/down, Drei's `<Float>`)
- Piece emissive color shifts to `#d4af37` (gold tint)
- Label appears above piece (HTML overlay via `<Html>` from Drei, or `Text` mesh)

---

## Labels in 3D

Use Drei's `<Html>` component to render HTML labels anchored to 3D positions:
```tsx
<Html position={[x, 2, z]} center occlude>
  <div className="piece-label">About</div>
</Html>
```
Labels are DOM elements so they stay sharp at any resolution and can be styled with Tailwind/CSS.
On mobile: always visible. On desktop: visible on hover.

---

## Page Transitions

The board-dissolve transition from PLAN.md still applies but in 3D:

1. Clicked piece glows intensely (bloom intensity spikes)
2. Camera zooms toward the piece (lerp over 300ms)
3. Screen fades to black (fullscreen overlay, opacity 0 → 1)
4. Next.js routes to section page
5. Section page fades in

The 3D scene is unmounted during section pages (saves GPU). On back navigation:
1. Section page fades out
2. 3D scene mounts, camera starts zoomed in
3. Camera pulls back to default position
4. Board state restored

---

## Performance & Mobile

### Lazy loading
The entire 3D canvas is loaded client-side only:
```tsx
const ChessScene = dynamic(() => import('@/components/chess/ChessScene'), {
  ssr: false,
  loading: () => <ChessBoardFallback /> // simple CSS grid while 3D loads
})
```

### Mobile performance
- Detect GPU tier with `detect-gpu` library
- Low-end GPU: disable shadows, reduce shadow map size, skip postprocessing
- Very low-end / no WebGL: fall back to 2D CSS board (same as PLAN.md)
- Use `<Canvas dpr={[1, 1.5]}>` — cap pixel ratio at 1.5 on mobile

### Bundle
- Three.js tree-shakes reasonably well
- `@react-three/fiber` + `@react-three/drei` + `three` ≈ 600–700KB gzipped in total
- Split into a separate chunk — only loaded on the landing page

---

## File Structure Changes vs PLAN.md

```
src/
  components/
    chess/
      ChessScene.tsx          ← replaces ChessBoard.tsx — contains <Canvas> + full scene
      Board3D.tsx             ← the 8×8 board mesh (PlaneGeometry + grid of squares)
      ChessPiece3D.tsx        ← individual 3D piece (model + animations + interaction)
      CaptureEffect3D.tsx     ← particle burst in 3D
      SceneCamera.tsx         ← animated camera component
      SceneLighting.tsx       ← all lights in one component
      pieces/                 ← GLTF loaders or lathe geometry generators
        usePieceModel.ts      ← hook: returns geometry + material for a piece type
      ChessBoardFallback.tsx  ← 2D CSS fallback while 3D loads / for no-WebGL
```

Everything else (section pages, PageWrapper, zustand store, chess-config) is identical to PLAN.md.

---

## Why the Primary Plan Might Still Be Better

- **Load time**: 3D adds ~700KB and WebGL init time — the flat board is instant
- **Mobile**: ~15% of mobile devices have GPU issues with WebGL — the flat board works everywhere
- **Focus**: The portfolio content (projects, skills, experience) is what matters — the 3D board is a longer "loading ceremony" before getting there
- **Maintenance**: Three.js APIs change; SVG components don't
- **The interaction concept is identical** — 3D adds visual wow but not a different experience

If you want 3D feel without WebGL weight, a middle path is possible: keep the flat CSS board but add a subtle CSS 3D perspective transform (`rotateX(20deg)`) + thick box-shadow to fake depth. Gets 70% of the 3D look at 0% of the cost.

---

## Implementation Phases (3D variant)

### Phase 1 — 3D Foundation
- [ ] Install R3F deps
- [ ] Set up `ChessScene.tsx` with basic `<Canvas>` + lighting
- [ ] Create static `Board3D.tsx` — 64 squares as meshes with correct materials
- [ ] Load/generate piece models, verify they render correctly
- [ ] Set up camera at correct angle
- [ ] `dynamic()` import with 2D fallback

### Phase 2 — Interaction
- [ ] Raycasting for piece + square clicks
- [ ] Selection state → SpotLight follows selected piece
- [ ] Capture animation (pawn arc jump, queen dissolve, particles)
- [ ] New piece entrance animations (drop from above + bounce)

### Phase 3 — Postprocessing & Polish
- [ ] Add `<EffectComposer>` with Bloom
- [ ] Float animation on interactive pieces
- [ ] HTML labels via `<Html>`
- [ ] Camera intro animation on load
- [ ] GPU tier detection + fallback logic

### Phases 4 & 5 — same as PLAN.md
