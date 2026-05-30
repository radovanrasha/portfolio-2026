/* portfolio.ts — real content (from radovanrasha-portfolio) mapped to the design's shape */

export type PageId = 'about' | 'experience' | 'projects' | 'skills' | 'education' | 'contact';
export type Coord = [number, number]; // [row, col], 0 = top/left

// Unicode filled chess glyphs
export const GLYPH = {
  king: '♚',
  queen: '♛',
  rook: '♜',
  bishop: '♝',
  knight: '♞',
  pawn: '♟',
};

export interface PageDef {
  id: PageId;
  glyph: string;
  victim: string | null;
  label: string;
  from: Coord;
  to: Coord;
}

// Six WHITE navigational pieces — legal "white to move" position (kept exactly
// from the design). Each has one legal move (quiet or capture) that opens a page.
export const PAGES: PageDef[] = [
  { id: 'about',      glyph: GLYPH.king,   victim: null,         label: 'About',      from: [7, 1], to: [6, 1] },
  { id: 'experience', glyph: GLYPH.rook,   victim: null,         label: 'Experience', from: [7, 7], to: [7, 4] },
  { id: 'projects',   glyph: GLYPH.queen,  victim: GLYPH.knight, label: 'Projects',   from: [6, 4], to: [3, 4] },
  { id: 'skills',     glyph: GLYPH.knight, victim: GLYPH.pawn,   label: 'Skills',     from: [6, 6], to: [4, 5] },
  { id: 'education',  glyph: GLYPH.bishop, victim: null,         label: 'Education',  from: [5, 0], to: [2, 3] },
  { id: 'contact',    glyph: GLYPH.pawn,   victim: null,         label: 'Contact',    from: [6, 2], to: [5, 2] },
];

// lone decorative black king (never interactive)
export const DECOR: { glyph: string; pos: Coord }[] = [{ glyph: GLYPH.king, pos: [0, 3] }];

export const PROFILE = {
  name: 'Radovan Ivanović',
  role: 'Full-Stack Developer',
  blurb: 'I build web apps end to end — from Node and MongoDB APIs to React interfaces that feel effortless.',
};

export const ABOUT = {
  paras: [
    'I’m a full-stack JavaScript developer based in Subotica, Serbia, with 4+ years of professional experience. My journey began in economics and commerce, followed by specialized studies in Business Informatics at the University of Economics in Subotica.',
    'My core is backend development with Node.js, Express and MongoDB, paired with frontend work in React and Ant Design. I also work with NestJS, TypeScript, SQL, and Linux VPS servers behind Nginx.',
    'I’ve sharpened my craft through advanced courses, coding competitions, and a steady stream of personal and professional projects — and I care about building efficient, scalable solutions that hold up in production.',
  ],
  facts: [
    { k: 'Based in', v: '<b>Subotica</b>, Serbia' },
    { k: 'Experience', v: '<b>4+</b> years shipping' },
    { k: 'Focus', v: 'Node · React · MongoDB' },
    { k: 'Languages', v: 'Srpski · English' },
    { k: 'Currently', v: 'open to <b>new roles</b>' },
  ],
};

export interface ExperienceItem {
  when: string;
  role: string;
  org: string;
  points: string[];
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    when: 'July 2022 — Present',
    role: 'Full-Stack Developer',
    org: '<b>Concordsoft Solutions</b>',
    points: [
      'Delivered 7 real-world projects end to end across the JavaScript stack.',
      'Built with Node.js, React and MongoDB; owned features from API to UI.',
      'Ran planning and team collaboration through Trello and Jira.',
      'Managed SQL databases and Linux VPS server infrastructure behind Nginx.',
    ],
  },
];

export interface ProjectItem {
  glyph: string;
  name: string;
  tagline: string;
  desc: string;
  tags: string[];
  href: string;
}

export const PROJECTS: ProjectItem[] = [
  {
    glyph: GLYPH.queen,
    name: 'Playground',
    tagline: 'Real-time gaming platform',
    desc: 'A full-stack gaming platform with real-time multiplayer features, built on a Node/Express backend with Socket.IO and a React front end.',
    tags: ['Node.js', 'Express', 'MongoDB', 'Socket.IO', 'React'],
    href: 'https://playground.radovanrasha.com',
  },
  {
    glyph: GLYPH.rook,
    name: 'Weather App',
    tagline: 'Live weather',
    desc: 'A clean, responsive weather app pulling real-time data from multiple external APIs, with a focus on fast, legible UI.',
    tags: ['React', 'API Integration', 'CSS3'],
    href: 'https://weather.radovanrasha.com',
  },
  {
    glyph: GLYPH.bishop,
    name: 'Notes App',
    tagline: 'Secure note-taking',
    desc: 'A personal note-taking app with authentication and full CRUD, built on Express and MongoDB with an Ant Design interface.',
    tags: ['Express', 'MongoDB', 'Ant Design', 'React'],
    href: 'https://notes.radovanrasha.com',
  },
];

export interface EducationItem {
  yr: string;
  title: string;
  inst: string;
  desc: string;
}

// Bishop = "Education": formal study + courses + the competition (learning by doing)
export const EDUCATION: EducationItem[] = [
  {
    yr: 'Degree',
    title: 'Business Informatics',
    inst: 'University of Economics — Subotica',
    desc: 'A foundation bridging economics and software — where the move from commerce into development began.',
  },
  {
    yr: '2023',
    title: 'BizKod v7.0 Hackathon — 3rd place',
    inst: 'Inspira Grupa',
    desc: 'A 24-hour student competition. Led backend development for a mobile app built with React Native, Node.js and MongoDB.',
  },
  {
    yr: 'Udemy',
    title: 'The Complete Node.js Developer Course',
    inst: 'Andrew Mead',
    desc: 'Node.js, Express, MongoDB and REST APIs — async programming, Socket.IO, authentication and deployment.',
  },
  {
    yr: 'Udemy',
    title: 'The Complete React Developer Course',
    inst: 'Andrew Mead',
    desc: 'React Hooks, Router, Redux and authentication, with an emphasis on scalable, performant front ends.',
  },
  {
    yr: 'Udemy',
    title: 'MongoDB — The Complete Developer’s Guide',
    inst: 'Maximilian Schwarzmüller',
    desc: 'NoSQL data modeling, CRUD, aggregation pipelines and schema design for high-performance apps.',
  },
];

export interface ContactLink {
  l: string;
  h: string;
  href: string;
  arrow: string;
}

export const CONTACT: ContactLink[] = [
  { l: 'Email', h: 'ivanovicradovan18@gmail.com', href: 'mailto:ivanovicradovan18@gmail.com', arrow: '→' },
  { l: 'GitHub', h: 'github.com/radovanrasha', href: 'https://www.github.com/radovanrasha/', arrow: '↗' },
  { l: 'LinkedIn', h: 'in/radovanrasha', href: 'https://www.linkedin.com/in/radovanrasha/', arrow: '↗' },
  { l: 'Chess.com', h: 'member/radovanrasha', href: 'https://www.chess.com/member/radovanrasha', arrow: '↗' },
];

export const SKILL_CATS = [
  { t: 'Frontend', n: 'interfaces', row: 1 },
  { t: 'Backend', n: 'services', row: 3 },
  { t: 'Tools', n: 'infra & ops', row: 5 },
];

export interface SkillItem {
  icon: string; // key into ICONS (skill-icons.ts)
  name: string;
  pos: Coord;
}

export const SKILLS: SkillItem[] = [
  // Frontend — row 1
  { icon: 'react', name: 'React', pos: [1, 1] },
  { icon: 'typescript', name: 'TypeScript', pos: [1, 2] },
  { icon: 'javascript', name: 'JavaScript', pos: [1, 3] },
  { icon: 'html', name: 'HTML', pos: [1, 4] },
  { icon: 'css', name: 'CSS', pos: [1, 5] },
  { icon: 'antdesign', name: 'Ant Design', pos: [1, 6] },
  // Backend — row 3 (knight rank)
  { icon: 'nodejs', name: 'Node.js', pos: [3, 1] },
  { icon: 'express', name: 'Express', pos: [3, 2] },
  { icon: 'nestjs', name: 'NestJS', pos: [3, 3] },
  { icon: 'mongodb', name: 'MongoDB', pos: [3, 4] },
  { icon: 'sql', name: 'SQL', pos: [3, 5] },
  // Tools — row 5
  { icon: 'github', name: 'Git / GitHub', pos: [5, 1] },
  { icon: 'linux', name: 'Linux / VPS', pos: [5, 2] },
  { icon: 'nginx', name: 'Nginx', pos: [5, 3] },
  { icon: 'photoshop', name: 'Photoshop', pos: [5, 4] },
];
