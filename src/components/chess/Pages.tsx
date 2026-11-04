'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import { cell } from './BoardParts';
import { ICONS } from '@/lib/skill-icons';
import {
  GLYPH,
  PROFILE,
  ABOUT,
  EXPERIENCE,
  PROJECTS,
  EDUCATION,
  HOBBIES,
  CONTACT,
  type HobbyItem,
  type SkillItem,
} from '@/lib/portfolio';

// 24×24 marks for the non-chess hobbies (chess uses the knight glyph)
const HOBBY_ICONS: Record<Exclude<HobbyItem['icon'], 'chess'>, string> = {
  running:
    'M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z',
  gaming:
    'M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91zM11 11H9v2H8v-2H6v-1h2V8h1v2h2v1zm4-1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z',
};

function PageHead({
  glyph,
  eyebrow,
  title,
  sub,
}: {
  glyph: string;
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="page-head reveal">
      <span className="pg-glyph">{glyph}</span>
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {sub && <p className="sub">{sub}</p>}
      </div>
    </div>
  );
}

export function AboutPage() {
  return (
    <div className="page">
      <PageHead glyph={GLYPH.king} eyebrow="The King · most valuable" title="About" sub={PROFILE.blurb} />
      <div className="about-grid">
        <div className="reveal d1">
          {ABOUT.paras.map((p, i) => (
            <p key={i}>
              <span className={i === 0 ? 'lead' : ''}>{p}</span>
            </p>
          ))}
          <div className="about-photos">
            <Image src="/about/about2.jpg" alt="Radovan at work" width={1050} height={499} />
            <Image src="/about/about1.jpg" alt="Radovan" width={848} height={468} />
          </div>
        </div>
        <div className="reveal d2">
          <div className="rule">
            <span className="lbl">Fact sheet</span>
            <span className="line" />
          </div>
          <div className="facts">
            {ABOUT.facts.map((f, i) => (
              <div className="f" key={i}>
                <span className="k">{f.k}</span>
                <span className="v" dangerouslySetInnerHTML={{ __html: f.v }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExperiencePage() {
  return (
    <div className="page">
      <PageHead
        glyph={GLYPH.rook}
        eyebrow="The Rook · holds the file"
        title="Experience"
        sub="Straight lines, solid ground - where I’ve been holding the file."
      />
      <div className="timeline reveal d1">
        {EXPERIENCE.map((e, i) => (
          <div className="tl-item" key={i}>
            <div className="when">{e.when}</div>
            <div className="role">{e.role}</div>
            <div className="org" dangerouslySetInnerHTML={{ __html: e.org }} />
            <ul>
              {e.points.map((p, j) => (
                <li key={j}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectsPage() {
  return (
    <div className="page">
      <PageHead
        glyph={GLYPH.queen}
        eyebrow="The Queen · most range"
        title="Projects"
        sub="The piece that moves in every direction - selected work."
      />
      <div className={'proj-grid' + (PROJECTS.length === 1 ? ' single' : '')}>
        {PROJECTS.map((p, i) => {
          const cls = 'proj reveal d' + Math.min(i + 1, 5);
          const inner = (
            <>
              <div className={'thumb' + (p.icon ? ' has-icon' : '')}>
                <span className="pc">{p.glyph}</span>
                {p.icon && (
                  <svg className="proj-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d={HOBBY_ICONS[p.icon]} />
                  </svg>
                )}
                <span className="ph">
                  [ {p.name.toLowerCase()} - {p.live ? 'live ↗' : 'coming soon'} ]
                </span>
              </div>
              <div className="body">
                <h3>{p.name}</h3>
                <div className="tagline">{p.tagline}</div>
                <p>{p.desc}</p>
                <div className="tags">
                  {p.tags.map((t, j) => (
                    <span key={j}>{t}</span>
                  ))}
                </div>
              </div>
            </>
          );
          // only deployed projects are links; the rest are plain cards
          return p.live ? (
            <a className={cls} key={i} href={p.href} target="_blank" rel="noopener noreferrer">
              {inner}
            </a>
          ) : (
            <div className={cls} key={i}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function EducationPage() {
  return (
    <div className="page">
      <PageHead
        glyph={GLYPH.bishop}
        eyebrow="The Bishop · the long diagonal"
        title="Education"
        sub="Study, competitions and the habit of learning - the long diagonal."
      />
      <div className="edu-grid reveal d1">
        {EDUCATION.map((e, i) => (
          <div className="edu" key={i}>
            <div className="yr">{e.yr}</div>
            <div>
              <h3>{e.title}</h3>
              <div className="inst">{e.inst}</div>
              <p>{e.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HobbiesPage() {
  return (
    <div className="page">
      <PageHead
        glyph={GLYPH.pawn}
        eyebrow="The h-Pawn · the long push"
        title="Hobbies"
        sub="Two squares at once - what keeps me moving when I’m off the clock."
      />
      <div className="hobby-grid">
        {HOBBIES.map((h, i) => (
          <div className={'hobby reveal d' + Math.min(i + 1, 5)} key={h.name}>
            <div className="hobby-mark" aria-hidden="true">
              {h.icon === 'chess' ? (
                <span className="hg">{GLYPH.knight}</span>
              ) : (
                <svg viewBox="0 0 24 24">
                  <path d={HOBBY_ICONS[h.icon]} />
                </svg>
              )}
            </div>
            <h3>{h.name}</h3>
            <div className="tagline">{h.tagline}</div>
            <p>{h.desc}</p>
            {h.href && (
              <a className="hobby-link" href={h.href} target="_blank" rel="noopener noreferrer">
                {h.linkLabel} <span className="arrow">↗</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContactPage() {
  return (
    <div className="page">
      <PageHead
        glyph={GLYPH.pawn}
        eyebrow="The Pawn · first move"
        title="Contact"
        sub="Every game starts with a pawn push. Open with one of these."
      />
      <div className="contact-wrap reveal d1">
        <div className="contact-links">
          {CONTACT.map((c, i) => (
            <a
              className="clink"
              href={c.href}
              key={i}
              target={c.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noreferrer"
            >
              <span>
                <span className="l">{c.l}</span>
                <br />
                <span className="h">{c.h}</span>
              </span>
              <span className="arrow">{c.arrow}</span>
            </a>
          ))}
        </div>
        <div className="reveal d2">
          <div className="rule">
            <span className="lbl">Open invitation</span>
            <span className="line" />
          </div>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: 16 }}>
            I’m open to full-stack roles, contract work and the occasional interesting puzzle. The
            fastest way to reach me is email - I usually reply within a day.
          </p>
        </div>
      </div>
    </div>
  );
}

// One skill icon, positioned on the board by [row, col]. Rendered on the home
// board itself (see ChessApp's skills mode) — not in a separate page anymore.
// `index` drives the staggered entrance delay via the `--i` custom property.
export function SkillTile({ s, index = 0 }: { s: SkillItem; index?: number }) {
  return (
    <div
      className="skill-tile"
      style={{ ...cell(s.pos[0], s.pos[1]), ['--i' as string]: index } as CSSProperties}
    >
      <div className="skill-tip">
        <div className="nm">{s.name}</div>
      </div>
      <div className="skill-mark" aria-label={s.name}>
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
          <path d={ICONS[s.icon]} />
        </svg>
      </div>
    </div>
  );
}
