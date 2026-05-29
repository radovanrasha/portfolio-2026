'use client';

import { useState, useEffect, type ComponentType } from 'react';
import { PAGES, DECOR, PROFILE, type PageDef, type PageId } from '@/lib/portfolio';
import { Squares, Piece, TargetHint, OriginGlow, TargetClick } from './BoardParts';
import {
  AboutPage,
  ExperiencePage,
  ProjectsPage,
  SkillsPage,
  EducationPage,
  ContactPage,
} from './Pages';

const PAGE_COMP: Record<PageId, ComponentType> = {
  about: AboutPage,
  experience: ExperiencePage,
  projects: ProjectsPage,
  skills: SkillsPage,
  education: EducationPage,
  contact: ContactPage,
};

const MOVE_MS = 560; // glide

function pageById(id: PageId | null): PageDef | null {
  return PAGES.find((p) => p.id === id) || null;
}

export default function ChessApp() {
  const [route, setRoute] = useState<PageId | null>(null);
  const [selected, setSelected] = useState<PageId | null>(null);
  const [hovered, setHovered] = useState<PageId | null>(null);
  const [movingId, setMovingId] = useState<PageId | null>(null);

  const selPage = pageById(selected);
  const hoverPage = pageById(hovered);
  const hintPage = selPage || hoverPage;

  const onPieceClick = (page: PageDef) => {
    if (route) return;
    setSelected((cur) => (cur === page.id ? null : page.id));
  };
  const onTargetClick = (page: PageDef) => {
    if (selected !== page.id || movingId) return;
    setMovingId(page.id);
    window.setTimeout(() => setRoute(page.id), MOVE_MS);
    window.setTimeout(() => setMovingId(null), MOVE_MS + 60);
  };
  const onVictimClick = (page: PageDef) => {
    if (route || movingId) return;
    if (selected === page.id) onTargetClick(page);
  };
  const selectFromLegend = (page: PageDef) => {
    if (route) return;
    setSelected(page.id);
    setHovered(page.id);
  };
  const closePage = () => {
    setRoute(null);
    setSelected(null);
    setMovingId(null);
    setHovered(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (route) closePage();
        else setSelected(null);
      }
      if (route && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        const i = PAGES.findIndex((p) => p.id === route);
        const ni = (i + (e.key === 'ArrowRight' ? 1 : PAGES.length - 1)) % PAGES.length;
        setRoute(PAGES[ni].id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [route]);

  const posOf = (page: PageDef) =>
    route === page.id || movingId === page.id ? page.to : page.from;

  const hint = route ? (
    ''
  ) : selected && selPage ? (
    <span>
      Now click the <b>lit square</b> to play {selPage.label}
    </span>
  ) : hovered && hoverPage ? (
    <span>
      <b>{hoverPage.label}</b> — click the piece, then its lit square
    </span>
  ) : (
    <span>Play a white piece · follow the move it lights up</span>
  );

  const RouteComp = route ? PAGE_COMP[route] : null;
  const routeIdx = route ? PAGES.findIndex((p) => p.id === route) : -1;
  const prevPage = route ? PAGES[(routeIdx + PAGES.length - 1) % PAGES.length] : null;
  const nextPage = route ? PAGES[(routeIdx + 1) % PAGES.length] : null;

  return (
    <div>
      {/* ===================== HOME ===================== */}
      <div className="scene" onClick={() => !route && setSelected(null)}>
        <div className="masthead">
          <div className="name">
            {PROFILE.name}
            <span className="dot">.</span>
          </div>
          <div className="role">{PROFILE.role}</div>
        </div>

        <div className="board-3d">
          <div className="board-frame">
            <div className="board">
              <Squares />
              <div className="hint-layer">
                <OriginGlow page={selPage} show={!!selected} />
                <TargetHint page={hintPage} show={!!hintPage} />
              </div>

              {/* decorative black king — never interactive */}
              {DECOR.map((d, i) => (
                <Piece key={'d-' + i} glyph={d.glyph} color="black" pos={d.pos} />
              ))}

              {/* black victims sit only on capture targets */}
              {PAGES.filter((p) => p.victim).map((p) => (
                <Piece
                  key={'v-' + p.id}
                  page={p}
                  glyph={p.victim as string}
                  color="black"
                  captured={movingId === p.id || route === p.id}
                  pos={p.to}
                  onClick={onVictimClick}
                  onHover={(pg) => !route && setHovered(pg ? pg.id : null)}
                />
              ))}

              {/* white navigational pieces — the only playable side */}
              {PAGES.map((p) => (
                <Piece
                  key={p.id}
                  page={p}
                  glyph={p.glyph}
                  color="white"
                  selected={selected === p.id}
                  pos={posOf(p)}
                  onClick={onPieceClick}
                  onHover={(pg) => !route && setHovered(pg ? pg.id : null)}
                />
              ))}

              {selPage && !movingId && <TargetClick page={selPage} onClick={onTargetClick} />}
            </div>
          </div>
        </div>

        <div className="hint-bar">{hint}</div>
      </div>

      {/* legend / index */}
      <div className="legend">
        {PAGES.map((p) => (
          <button
            key={p.id}
            className={
              'row' + (hovered === p.id || selected === p.id || route === p.id ? ' active' : '')
            }
            onMouseEnter={() => !route && setHovered(p.id)}
            onMouseLeave={() => !route && setHovered(null)}
            onClick={(e) => {
              e.stopPropagation();
              selectFromLegend(p);
            }}
          >
            <span>{p.label}</span>
            <span className="pg">{p.glyph}</span>
          </button>
        ))}
      </div>

      {/* ===================== PAGE OVERLAY ===================== */}
      <div className={'overlay' + (route ? ' open' : '')}>
        {route && (
          <>
            <button className="back-btn" onClick={closePage}>
              <span className="k">←</span> Back to board
            </button>
            <div key={route}>{RouteComp && <RouteComp />}</div>
            {prevPage && nextPage && (
              <div className="page-nav">
                <button onClick={() => setRoute(prevPage.id)}>
                  <span className="pg">{prevPage.glyph}</span> {prevPage.label}
                </button>
                <button onClick={() => setRoute(nextPage.id)}>
                  {nextPage.label} <span className="pg">{nextPage.glyph}</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
