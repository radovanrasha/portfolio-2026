import { ImageResponse } from 'next/og';
import { C, ogFonts } from '@/lib/og';
import { PROFILE } from '@/lib/portfolio';

// Link-preview card (WhatsApp, Viber, LinkedIn, Slack, X, …)
export const alt = `${PROFILE.name} - ${PROFILE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const SQ = 46; // board square, px
const [first, ...rest] = PROFILE.name.split(' ');
const last = rest.join(' ');

function Board() {
  return (
    <div
      style={{
        display: 'flex',
        padding: 16,
        borderRadius: 10,
        background: `linear-gradient(150deg, ${C.frameHi}, ${C.frame} 38%, ${C.frameLo})`,
        boxShadow: '0 30px 60px -20px rgba(0,0,0,.85)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {Array.from({ length: 8 }, (_, r) => (
          <div key={r} style={{ display: 'flex' }}>
            {Array.from({ length: 8 }, (_, c) => (
              <div
                key={c}
                style={{
                  width: SQ,
                  height: SQ,
                  background: (r + c) % 2 === 0 ? C.sqLight : C.sqDark,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 84px',
          background: `radial-gradient(120% 90% at 30% 18%, ${C.bg2} 0%, ${C.bg} 58%, #000 130%)`,
          color: C.ink,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 560 }}>
          {/* first / last name on their own lines so the brass dot stays attached */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Cormorant',
              fontWeight: 600,
              fontSize: 92,
              lineHeight: 1,
            }}
          >
            <div style={{ display: 'flex' }}>{first}</div>
            <div style={{ display: 'flex' }}>
              {last}
              <span style={{ color: C.accent }}>.</span>
            </div>
          </div>
          <div
            style={{
              marginTop: 22,
              fontFamily: 'JetBrains Mono',
              fontSize: 22,
              letterSpacing: 7,
              textTransform: 'uppercase',
              color: C.accentSoft,
            }}
          >
            {PROFILE.role}
          </div>
          <div
            style={{
              marginTop: 40,
              fontFamily: 'Cormorant',
              fontWeight: 600,
              fontSize: 36,
              lineHeight: 1.25,
              color: C.muted,
            }}
          >
            A portfolio you play like a game of chess - make your move.
          </div>
          <div
            style={{
              marginTop: 48,
              fontFamily: 'JetBrains Mono',
              fontSize: 18,
              letterSpacing: 4,
              color: C.accent,
            }}
          >
            radovanrasha.com
          </div>
        </div>
        <Board />
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
