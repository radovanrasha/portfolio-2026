'use client';

import Image from 'next/image';
import { Squares } from './BoardParts';
import { cell } from './BoardParts';
import { ICONS } from '@/lib/skill-icons';
import {
  GLYPH,
  PROFILE,
  ABOUT,
  EXPERIENCE,
  PROJECTS,
  EDUCATION,
  CONTACT,
  SKILL_CATS,
  SKILLS,
  type SkillItem,
} from '@/lib/portfolio';

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
        sub="Straight lines, solid ground — where I’ve been holding the file."
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
        sub="The piece that moves in every direction — selected work, live on the web."
      />
      <div className="proj-grid">
        {PROJECTS.map((p, i) => (
          <a
            className={'proj reveal d' + Math.min(i + 1, 5)}
            key={i}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="thumb">
              <span className="pc">{p.glyph}</span>
              <span className="ph">[ {p.name.toLowerCase()} — live ↗ ]</span>
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
          </a>
        ))}
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
        sub="Study, competitions and the habit of learning — the long diagonal."
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
            fastest way to reach me is email — I usually reply within a day.
          </p>
        </div>
      </div>
    </div>
  );
}

function SkillTile({ s }: { s: SkillItem }) {
  return (
    <div className="skill-tile" style={cell(s.pos[0], s.pos[1])}>
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

export function SkillsPage() {
  return (
    <div className="page" style={{ paddingTop: 'clamp(56px,8vh,96px)', textAlign: 'center' }}>
      <div className="masthead reveal" style={{ marginBottom: 8 }}>
        <div className="role" style={{ paddingLeft: '.42em' }}>
          The Knight · jumps the board
        </div>
        <div className="name" style={{ marginTop: 8 }}>
          Skills
        </div>
        <p
          className="sub"
          style={{ margin: '12px auto 0', maxWidth: '46ch', color: 'var(--muted)', lineHeight: 1.6 }}
        >
          The whole arsenal, set out by rank. Hover a square to light it up.
        </p>
      </div>

      <div className="skills-board-wrap reveal d1" style={{ justifyContent: 'center', marginTop: 24 }}>
        <div className="cat-rail">
          {SKILL_CATS.map((c, i) => (
            <div className="cat" key={i}>
              <span className="t">{c.t}</span>
              <span className="n">{c.n}</span>
            </div>
          ))}
        </div>
        <div className="board-3d">
          <div className="board-frame">
            <div className="board">
              <Squares />
              {SKILLS.map((s, i) => (
                <SkillTile key={i} s={s} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
