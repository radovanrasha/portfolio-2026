'use client';

import { useState, useEffect, type ComponentType } from 'react';
import {
  PAGES,
  DECOR,
  PROFILE,
  SKILLS,
  SKILL_CATS,
  type PageDef,
  type PageId,
} from '@/lib/portfolio';
import { Squares, Piece, TargetHint, OriginGlow, TargetClick, cell } from './BoardParts';
import {
  AboutPage,
  ExperiencePage,
  ProjectsPage,
  EducationPage,
  ContactPage,
  SkillTile,
} from './Pages';

// Skills is NOT an overlay page — it transforms the home board in place.
const PAGE_COMP: Partial<Record<PageId, ComponentType>> = {
  about: AboutPage,
  experience: ExperiencePage,
  projects: ProjectsPage,
  education: EducationPage,
  contact: ContactPage,
};

// Pages that open as a full-screen overlay (everything except skills).
const OVERLAY_PAGES = PAGES.filter((p) => p.id !== 'skills');

// Neighbours of skills in the full board order — used by the prev/next
// buttons shown while the skills view is open.
const SKILLS_IDX = PAGES.findIndex((p) => p.id === 'skills');
const SKILLS_PREV = PAGES[(SKILLS_IDX + PAGES.length - 1) % PAGES.length];
const SKILLS_NEXT = PAGES[(SKILLS_IDX + 1) % PAGES.length];

const MOVE_MS = 560; // glide

function pageById(id: PageId | null): PageDef | null {
  return PAGES.find((p) => p.id === id) || null;
}

export default function ChessApp() {
  const [route, setRoute] = useState<PageId | null>(null);
  const [selected, setSelected] = useState<PageId | null>(null);
  const [hovered, setHovered] = useState<PageId | null>(null);
  const [movingId, setMovingId] = useState<PageId | null>(null);
  const [skills, setSkills] = useState(false); // in-board skills view

  const selPage = pageById(selected);
  const hoverPage = pageById(hovered);
  const hintPage = selPage || hoverPage;
  const busy = !!route || skills; // home board interactions are locked

  const onPieceClick = (page: PageDef) => {
    if (busy) return;
    setSelected((cur) => (cur === page.id ? null : page.id));
  };
  const onTargetClick = (page: PageDef) => {
    if (selected !== page.id || movingId) return;
    setMovingId(page.id);
    window.setTimeout(() => {
      // Skills morphs the board; the rest open an overlay.
      if (page.id === 'skills') {
        setSkills(true);
        setSelected(null);
        setHovered(null);
      } else {
        setRoute(page.id);
      }
    }, MOVE_MS);
    window.setTimeout(() => setMovingId(null), MOVE_MS + 60);
  };
  const onVictimClick = (page: PageDef) => {
    if (busy || movingId) return;
    if (selected === page.id) onTargetClick(page);
  };
  const selectFromLegend = (page: PageDef) => {
    if (busy) return;
    setSelected(page.id);
    setHovered(page.id);
  };
  const closePage = () => {
    setRoute(null);
    setSelected(null);
    setMovingId(null);
    setHovered(null);
  };
  const closeSkills = () => {
    setSkills(false);
    setSelected(null);
    setMovingId(null);
    setHovered(null);
  };
  // jump from the skills view straight into a neighbouring overlay section
  const goRoute = (id: PageId) => {
    setSkills(false);
    setSelected(null);
    setMovingId(null);
    setHovered(null);
    setRoute(id);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (route) closePage();
        else if (skills) closeSkills();
        else setSelected(null);
      }
      if (route && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        const i = OVERLAY_PAGES.findIndex((p) => p.id === route);
        const ni =
          (i + (e.key === 'ArrowRight' ? 1 : OVERLAY_PAGES.length - 1)) % OVERLAY_PAGES.length;
        setRoute(OVERLAY_PAGES[ni].id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [route, skills]);

  // Skills piece stays on its target square while the skills view is open.
  const posOf = (page: PageDef) =>
    route === page.id || movingId === page.id || (page.id === 'skills' && skills)
      ? page.to
      : page.from;

  const hint = route ? (
    ''
  ) : skills ? (
    <span>
      The Knight’s arsenal — <b>hover</b> a square to light it up
    </span>
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
  const routeIdx = route ? OVERLAY_PAGES.findIndex((p) => p.id === route) : -1;
  const prevPage = route ? OVERLAY_PAGES[(routeIdx + OVERLAY_PAGES.length - 1) % OVERLAY_PAGES.length] : null;
  const nextPage = route ? OVERLAY_PAGES[(routeIdx + 1) % OVERLAY_PAGES.length] : null;

  return (
    <div>
      {/* ===================== HOME ===================== */}
      <div className={'scene' + (skills ? ' skills-on' : '')} onClick={() => !busy && setSelected(null)}>
        <div className="masthead">
          <div className="name">
            {PROFILE.name}
            <span className="dot">.</span>
          </div>
          <div className="role">{skills ? 'The Knight · the arsenal' : PROFILE.role}</div>
        </div>

        <div className="board-3d">
          <div className="board-frame">
            <div className="board">
              <Squares />
              <div className="hint-layer">
                <OriginGlow page={selPage} show={!!selected && !skills} />
                <TargetHint page={hintPage} show={!!hintPage && !skills} />
              </div>

              {/* decorative black king — never interactive */}
              {DECOR.map((d, i) => (
                <Piece key={'d-' + i} glyph={d.glyph} color="black" pos={d.pos} faded={skills} />
              ))}

              {/* black victims sit only on capture targets */}
              {PAGES.filter((p) => p.victim).map((p) => (
                <Piece
                  key={'v-' + p.id}
                  page={p}
                  glyph={p.victim as string}
                  color="black"
                  captured={movingId === p.id || route === p.id}
                  faded={skills}
                  pos={p.to}
                  onClick={onVictimClick}
                  onHover={(pg) => !busy && setHovered(pg ? pg.id : null)}
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
                  faded={skills}
                  pos={posOf(p)}
                  onClick={onPieceClick}
                  onHover={(pg) => !busy && setHovered(pg ? pg.id : null)}
                />
              ))}

              {selPage && !movingId && <TargetClick page={selPage} onClick={onTargetClick} />}

              {/* skills view — same board, pieces swapped for skill icons */}
              <div className={'skill-layer' + (skills ? ' on' : '')} aria-hidden={!skills}>
                {SKILL_CATS.map((c) => (
                  <div className="skill-cat" key={c.t} style={cell(c.row, 0)}>
                    <span className="t">{c.t}</span>
                    <span className="n">{c.n}</span>
                  </div>
                ))}
                {SKILLS.map((s, i) => (
                  <SkillTile key={s.icon} s={s} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hint-bar">{hint}</div>

        {skills && (
          <>
            <button className="back-btn" onClick={closeSkills}>
              <span className="k">←</span> Back to board
            </button>
            <div className="page-nav">
              <button onClick={() => goRoute(SKILLS_PREV.id)}>
                <span className="pg">{SKILLS_PREV.glyph}</span> {SKILLS_PREV.label}
              </button>
              <button onClick={() => goRoute(SKILLS_NEXT.id)}>
                {SKILLS_NEXT.label} <span className="pg">{SKILLS_NEXT.glyph}</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* legend / index */}
      <div className={'legend' + (skills ? ' hidden' : '')}>
        {PAGES.map((p) => (
          <button
            key={p.id}
            className={
              'row' +
              (hovered === p.id || selected === p.id || route === p.id ? ' active' : '')
            }
            onMouseEnter={() => !busy && setHovered(p.id)}
            onMouseLeave={() => !busy && setHovered(null)}
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
