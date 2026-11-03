/* og.tsx — shared pieces for the generated icon + social preview images (next/og) */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Walnut & Brass palette (mirrors :root in globals.css)
export const C = {
  bg: '#18120d',
  bg2: '#271b11',
  sqLight: '#ead4a6',
  sqDark: '#875534',
  frame: '#4f3220',
  frameHi: '#75492a',
  frameLo: '#2c1a0e',
  accent: '#e0a84a',
  accentSoft: '#f3cd7e',
  ink: '#f1e8d8',
  muted: '#ad9a7f',
};

// Satori can't read woff2 or next/font, so the images use local .woff copies
// (assets/fonts, SIL OFL). Read at build time — these routes are static.
const font = (file: string) => readFile(join(process.cwd(), 'assets/fonts', file));

export async function ogFonts() {
  const [display, displayExt, mono] = await Promise.all([
    font('cormorant-garamond-latin-600-normal.woff'),
    font('cormorant-garamond-latin-ext-600-normal.woff'), // ć
    font('jetbrains-mono-latin-500-normal.woff'),
  ]);
  return [
    { name: 'Cormorant', data: display, weight: 600 as const, style: 'normal' as const },
    { name: 'Cormorant', data: displayExt, weight: 600 as const, style: 'normal' as const },
    { name: 'JetBrains Mono', data: mono, weight: 500 as const, style: 'normal' as const },
  ];
}

// Brass "R" on a walnut tile — the favicon / app icon.
export function Monogram({ px, radius }: { px: number; radius: number }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius,
        background: `linear-gradient(150deg, ${C.frameHi}, ${C.bg2} 55%, ${C.bg})`,
        border: `${Math.max(1, Math.round(px / 32))}px solid ${C.accent}`,
        color: C.accent,
        fontFamily: 'Cormorant',
        fontWeight: 600,
        fontSize: px * 0.86,
        lineHeight: 1,
        paddingBottom: px * 0.06, // optical centring: the serif R sits low
      }}
    >
      R
    </div>
  );
}
