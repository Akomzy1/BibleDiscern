import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

const WIDTH = 1200;
const HEIGHT = 630;

// Brand colours (must be hex/rgb — no Tailwind classes in ImageResponse)
const NAVY   = '#1a2744';
const GOLD   = '#c9a84c';
const CREAM  = '#faf6f0';
const PARCHMENT = '#f3ece0';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title   = searchParams.get('title') ?? 'BibleDiscern';
  const type    = searchParams.get('type') ?? 'default'; // 'blog' | 'default'
  const tagline = searchParams.get('tagline') ?? 'Weigh it with wisdom';

  return new ImageResponse(
    (
      <div
        style={{
          width:  WIDTH,
          height: HEIGHT,
          display: 'flex',
          flexDirection: 'column',
          background: NAVY,
          fontFamily: 'Georgia, serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle arc ornament top-right */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: '50%',
            border: `2px solid ${GOLD}22`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 320,
            height: 320,
            borderRadius: '50%',
            border: `1px solid ${GOLD}33`,
          }}
        />

        {/* Bottom arc ornament */}
        <div
          style={{
            position: 'absolute',
            bottom: -160,
            left: -80,
            width: 520,
            height: 520,
            borderRadius: '50%',
            border: `2px solid ${GOLD}1a`,
          }}
        />

        {/* Gold top bar */}
        <div style={{ width: '100%', height: 4, background: GOLD }} />

        {/* Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '56px 72px 56px 72px',
          }}
        >
          {/* Brand mark — gilt cross (two hairline strokes, crossbar at 26%) + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', position: 'relative', width: 16, height: 26 }}>
              <div style={{ position: 'absolute', left: 6.8, top: 0, width: 2.4, height: 26, background: GOLD }} />
              <div style={{ position: 'absolute', left: 0, top: 6.8, width: 16, height: 2.4, background: GOLD }} />
            </div>
            <span
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 22,
                fontWeight: 700,
                color: CREAM,
                letterSpacing: 1,
              }}
            >
              BibleDiscern
            </span>
          </div>

          {/* Main text area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 840 }}>
            {type === 'blog' && (
              <span
                style={{
                  fontSize: 13,
                  fontFamily: 'sans-serif',
                  fontWeight: 600,
                  color: GOLD,
                  textTransform: 'uppercase',
                  letterSpacing: 3,
                }}
              >
                BibleDiscern Blog
              </span>
            )}

            <div
              style={{
                fontSize: title.length > 60 ? 44 : title.length > 40 ? 52 : 62,
                fontFamily: 'Georgia, serif',
                fontWeight: 700,
                color: CREAM,
                lineHeight: 1.18,
              }}
            >
              {title}
            </div>

            <div
              style={{
                fontSize: 22,
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                color: `${CREAM}99`,
                lineHeight: 1.4,
              }}
            >
              {tagline}
            </div>
          </div>

          {/* Footer row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  background: `${GOLD}22`,
                  border: `1px solid ${GOLD}55`,
                  borderRadius: 20,
                  padding: '8px 18px',
                  fontSize: 13,
                  fontFamily: 'sans-serif',
                  color: GOLD,
                  letterSpacing: 1,
                }}
              >
                AI-Powered Christian Discernment
              </div>
            </div>
            <div
              style={{
                fontSize: 14,
                fontFamily: 'sans-serif',
                color: `${CREAM}44`,
                letterSpacing: 1,
              }}
            >
              biblediscern.com
            </div>
          </div>
        </div>

        {/* Gold bottom bar */}
        <div style={{ width: '100%', height: 4, background: GOLD }} />
      </div>
    ),
    {
      width:  WIDTH,
      height: HEIGHT,
    },
  );
}
