'use client';

import type { CSSProperties } from 'react';
import type { Coord, PageDef } from '@/lib/portfolio';

export const cell = (r: number, c: number): CSSProperties => ({
  left: c * 12.5 + '%',
  top: r * 12.5 + '%',
});

// static 8x8 grid of wood squares
export function Squares() {
  const out = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const light = (r + c) % 2 === 0;
      out.push(<div key={r + '-' + c} className={'sq ' + (light ? 'light' : 'dark')} />);
    }
  }
  return <>{out}</>;
}

interface PieceProps {
  page?: PageDef | null;
  glyph: string;
  color: 'white' | 'black';
  selected?: boolean;
  captured?: boolean;
  pos: Coord;
  onClick?: (page: PageDef) => void;
  onHover?: (page: PageDef | null) => void;
}

export function Piece({ page, glyph, color, selected, captured, pos, onClick, onHover }: PieceProps) {
  const cls = ['piece'];
  if (!onClick) cls.push('inert');
  if (selected) cls.push('selected');
  if (captured) cls.push('captured');
  return (
    <div
      className={cls.join(' ')}
      data-style="flat"
      data-color={color}
      style={cell(pos[0], pos[1])}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick && page) onClick(page);
      }}
      onMouseEnter={() => onHover && onHover(page ?? null)}
      onMouseLeave={() => onHover && onHover(null)}
      aria-label={page ? page.label : 'piece'}
    >
      <span className="shadow" />
      <span className="glyph">{glyph}</span>
    </div>
  );
}

// glowing destination square (with page label)
export function TargetHint({ page, show }: { page: PageDef | null; show: boolean }) {
  if (!page) return null;
  return (
    <div className={'target ' + (show ? 'show' : '')} style={cell(page.to[0], page.to[1])}>
      <span className="ring" />
      <span className="glabel">{page.label}</span>
    </div>
  );
}

// highlight under the currently-selected origin square
export function OriginGlow({ page, show }: { page: PageDef | null; show: boolean }) {
  if (!page) return null;
  return <div className={'sq-glow ' + (show ? 'show' : '')} style={cell(page.from[0], page.from[1])} />;
}

// invisible clickable overlay on the destination so the user can "complete the move"
export function TargetClick({ page, onClick }: { page: PageDef; onClick: (p: PageDef) => void }) {
  return (
    <div
      className="target-click"
      style={{
        position: 'absolute',
        width: '12.5%',
        height: '12.5%',
        cursor: 'pointer',
        zIndex: 5,
        ...cell(page.to[0], page.to[1]),
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(page);
      }}
    />
  );
}
