import { useId } from "react";
import { countries } from "./world";

export const FPS = 30;
export const FRAMES = 750;
export const defaults = {
  background: "#F3F0E7",
  ink: "#123B32",
  green: "#008A68",
  coral: "#EF704C",
  title: "CRICKET",
  subtitle: "AROUND THE WORLD",
  caption: "A GAME WITHOUT BORDERS",
  teams: 12,
  fans: 80,
  bat: 42,
  closing: "ONE GAME. MANY WORLDS.",
};
export type Settings = typeof defaults;
export const beats = [
  { name: "Ranking reveal", start: 0, end: 2.5 },
  { name: "Cricket spotlight", start: 2.5, end: 4.75 },
  { name: "Kinetic title", start: 4.75, end: 6.75 },
  { name: "Color sweep", start: 6.75, end: 8.5 },
  { name: "Chart → world", start: 8.5, end: 10.25 },
  { name: "Region scan", start: 10.25, end: 16 },
  { name: "Fan counter", start: 16, end: 18.5 },
  { name: "Strategy split", start: 18.5, end: 23.5 },
  { name: "Stadium outro", start: 23.5, end: 25 },
];
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const e = (t: number, a: number, b: number) => 1 - Math.pow(1 - clamp((t - a) / (b - a)), 3);
const mix = (a: number, b: number, p: number) => a + (b - a) * p;

export function SportIcon({ kind = 3, color = "currentColor" }: { kind?: number; color?: string }) {
  const common = {
    fill: "none",
    stroke: color,
    strokeWidth: 3.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <g {...common}>
      {kind === 0 ? (
        <>
          <circle cx="0" cy="0" r="25" />
          <path d="M-8-9L8-9L14 5L0 14L-14 5Z M-8-9L-15-19 M8-9L15-19 M14 5L24 8 M0 14L0 25 M-14 5L-24 8" />
        </>
      ) : kind === 1 ? (
        <>
          <ellipse rx="15" ry="24" transform="rotate(35)" />
          <path d="M-18 23L-28 38 M-5-20L16 10 M-15-10L6 20 M-10-17L-18 7 M0-20L-11 18 M10-10L-2 23" />
        </>
      ) : kind === 2 ? (
        <>
          <path d="M-17-26L17-26L12 3L0 15L-12 3Z M-16-20L-27-20L-25-4L-12 2 M16-20L27-20L25-4L12 2 M0 15L0 30 M-15 30L15 30" />
        </>
      ) : kind === 3 ? (
        <>
          <path d="M-6-28L1-28L1-9L12-6L12 29L-6 29L-6-6L-1-9Z" transform="rotate(30)" />
          <circle cx="23" cy="20" r="8" />
          <path d="M20 13Q17 20 24 26" />
        </>
      ) : kind === 4 ? (
        <>
          <circle r="25" />
          <path d="M-25 0H25 M0-25V25 M-19-16Q10-10 18 17 M19-16Q-10-10-18 17" />
        </>
      ) : kind === 5 ? (
        <>
          <path d="M-22-22L15 15L27 10 M-14-30L23 7L27 10 M-24 27H-8" />
          <ellipse cx="-15" cy="27" rx="10" ry="4" />
        </>
      ) : kind === 6 ? (
        <>
          <ellipse rx="17" ry="27" transform="rotate(45)" />
          <path d="M-10-10L10 10 M-6-12L-12-6 M0-6L-6 0 M6 0L0 6 M12 6L6 12" />
        </>
      ) : (
        <>
          <circle r="25" />
          <path d="M-13-21Q3-2 24-2 M-24 4Q-3 11 5 24 M12-22Q-7-8-20-13" />
        </>
      )}
    </g>
  );
}

function Player({ bowler = false, color }: { bowler?: boolean; color: string }) {
  return (
    <g fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="0" cy="-64" r="15" fill={color} stroke="none" />
      {bowler ? (
        <path d="M0-40L-6 9L-42 53 M-6 9L37 45 M0-34L-29-61L-15-108 M0-30L32-10" />
      ) : (
        <>
          <path d="M0-40L-8 8L-29 54 M-8 8L35 53 M0-30L32-9L52-28 M0-28L17 1L52-28" />
          <path d="M47-33L72-64L83-53L58-22Z" strokeWidth="5" fill={color} />
        </>
      )}
    </g>
  );
}

export function CricketFilm({
  frame,
  settings: s = defaults,
  id,
  fontFamily = "DM Sans, sans-serif",
  displayFont = "Anton",
}: {
  frame: number;
  settings?: Settings;
  id?: string;
  fontFamily?: string;
  displayFont?: string;
}) {
  const uid = `cricket-${useId().replace(/:/g, "")}`;
  frame = Math.min(FRAMES - 1, Math.max(0, Number.isFinite(frame) ? frame : 0));
  const t = frame / FPS,
    shrink = e(t, 8.5, 10.25),
    mapIn = e(t, 8.7, 10.25),
    split = e(t, 20.75, 21.9),
    banner = e(t, 18.5, 19.1);
  const scanY = mix(30, 210, e(t, 10.25, 11.5)) + mix(0, 300, e(t, 16, 17));
  const bg = s.background,
    ink = s.ink;
  const text = (x: number, y: number, content: string, size = 24, fill = ink, extra = {}) => (
    <text x={x} y={y} fontSize={size} fill={fill} {...extra}>
      {content}
    </text>
  );
  const stadium = t >= 23.5;
  return (
    <svg
      id={id ?? `${uid}-film`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1920 1080"
      width="1920"
      height="1080"
      style={{ fontFamily, background: bg }}
    >
      <defs>
        <pattern
          id={`${uid}-grid`}
          width="96"
          height="96"
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(${t * 1.5} 0)`}
        >
          <path d="M96 0H0V96" fill="none" stroke={ink} strokeOpacity=".045" strokeWidth="1" />
        </pattern>
        <clipPath id={`${uid}-scan`}>
          <rect x="0" y="0" width="1320" height={scanY} />
        </clipPath>
        <clipPath id={`${uid}-caption`}>
          <rect x="940" y="452" width={720 * e(t, 2.9, 3.55)} height="68" />
        </clipPath>
        <clipPath id={`${uid}-heading`}>
          <rect x="940" y="245" width={850 * (1 - e(t, 6.15, 6.75))} height="210" />
        </clipPath>
        <clipPath id={`${uid}-split`}>
          <rect x={mix(1660, 960, split)} y="120" width="700" height="180" />
        </clipPath>
      </defs>
      <rect width="1920" height="1080" fill={bg} />
      <rect width="1920" height="1080" fill={`url(#${uid}-grid)`} />
      <g stroke={ink} fill="none" opacity=".055" strokeWidth="2">
        <ellipse cx="960" cy="560" rx="1000" ry="730" />
        <ellipse cx="960" cy="560" rx="880" ry="650" />
        <path d="M740-50V1150 M1180-50V1150 M740 170H1180 M740 950H1180" />
      </g>
      {!stadium && (
        <>
          <g opacity={1 - e(t, 8.5, 9.3)}>
            {text(120, 135, "THE GLOBAL GAME", 22, ink, { letterSpacing: 5 })}
            {text(120, 208, "A WORLD OF SPORT", 58, ink, { fontFamily: displayFont })}
            {text(120, 245, "An illustrative cricket story", 23, ink, { opacity: 0.55 })}
          </g>
          <g
            transform={`translate(${mix(0, 412, shrink)} ${mix(0, 652, shrink)}) scale(${mix(1, 0.55, shrink)})`}
            opacity={1 - e(t, 10.35, 10.8)}
          >
            <g stroke={ink} strokeOpacity=".13" fill="none">
              {[0, 1, 2, 3, 4].map((i) => (
                <path key={i} d={`M250 ${820 - i * 105}H1670`} />
              ))}
              <path d="M250 290V820H1670" />
            </g>
            {[440, 330, 255, 175, 135, 110, 90, 75].map((h, i) => {
              const p = e(t, i * 0.1, 0.65 + i * 0.1),
                height = h * p,
                x = 270 + i * 172,
                y = 820 - height;
              const green = i < 3 && t >= 6.75 + i * 0.14;
              return (
                <g key={i}>
                  <path d={`M${x} 820h145l-45 62h-145Z`} fill={ink} opacity=".09" />
                  <rect
                    x={x}
                    y={y}
                    width="145"
                    height={height}
                    fill={i === 3 ? s.coral : green ? s.green : "#C0C9BD"}
                  />
                  <path
                    d={`M${x + 145} ${y}v${height}l12-15v-${height}Z`}
                    fill={ink}
                    opacity=".1"
                  />
                  <g transform={`translate(${x + 72} ${y - 63 + 22 * (1 - p)})`} opacity={p}>
                    <SportIcon kind={i} color={i === 3 ? s.coral : ink} />
                  </g>
                  {text(
                    x + 72,
                    862,
                    [
                      "FOOTBALL",
                      "TENNIS",
                      "ATHLETICS",
                      "CRICKET",
                      "BASKETBALL",
                      "HOCKEY",
                      "RUGBY",
                      "VOLLEYBALL",
                    ][i]!,
                    14,
                    ink,
                    { textAnchor: "middle", letterSpacing: 1 },
                  )}
                </g>
              );
            })}
            <g opacity={e(t, 2.5, 2.8) * (1 - e(t, 6.15, 6.6))}>
              <rect
                x="776"
                y="553"
                width="164"
                height="279"
                fill="none"
                stroke={s.coral}
                strokeWidth="3"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset={1 - e(t, 2.7, 3.4)}
              />
              <g
                transform={`translate(858 ${mix(460, 515, e(t, 2.5, 2.9))})`}
                stroke={s.coral}
                strokeWidth="4"
                fill="none"
              >
                <path d="M0-20V20 M-12 8L0 20L12 8" />
              </g>
              <g clipPath={`url(#${uid}-caption)`}>
                <rect x="940" y="452" width="720" height="68" fill={s.coral} />
                {text(967, 495, s.caption, 25, bg, { fontWeight: 700, letterSpacing: 1 })}
              </g>
            </g>
            <g clipPath={`url(#${uid}-heading)`}>
              {text(
                945,
                337,
                t < 5.15
                  ? s.title.slice(0, Math.floor(e(t, 4.75, 5.15) * s.title.length))
                  : s.title,
                88,
                ink,
                { fontFamily: displayFont },
              )}
              {text(945, 424, s.subtitle, 60, ink, {
                fontFamily: displayFont,
                opacity: e(t, 5.15, 5.7),
              })}
            </g>
          </g>
          <g
            opacity={mapIn}
            transform={`translate(${mix(310, 305, mapIn)} ${mix(230, 345, mapIn)}) scale(${mix(0.84, 1, mapIn)})`}
          >
            {countries.map((c) => (
              <path key={c.name} d={c.d} fill="#CAD1C4" stroke={bg} strokeWidth="1.1" />
            ))}
            <g clipPath={`url(#${uid}-scan)`} opacity={e(t, 10.25, 10.5)}>
              {countries.map((c) => (
                <path
                  key={c.name}
                  d={c.d}
                  fill={c.group === 1 ? s.coral : c.group === 2 ? s.green : ink}
                  stroke={bg}
                  strokeWidth="1.1"
                />
              ))}
            </g>
            <g opacity={e(t, 10.25, 10.5) * (1 - e(t, 17.3, 17.9))}>
              <path d={`M-25 ${scanY}H1340`} stroke={ink} strokeWidth="2" />
              <circle cx="1340" cy={scanY} r="5" fill={s.coral} />
            </g>
            <g opacity={e(t, 11, 11.6) * (1 - e(t, 16, 16.3))}>
              <rect x="805" y="114" width="350" height="112" fill={s.green} />
              {text(827, 174, `${Math.round(s.teams * e(t, 10.65, 12.4))} TEAMS`, 44, bg, {
                fontFamily: displayFont,
              })}
              {text(827, 206, "ONE SHARED PASSION", 15, bg, { letterSpacing: 2 })}
            </g>
            <g opacity={e(t, 16.15, 16.6) * (1 - e(t, 18.5, 19))}>
              <rect
                x="525"
                y="290"
                width="310"
                height="140"
                fill={bg}
                stroke={ink}
                strokeWidth="2"
              />
              {text(680, 380, `${Math.round(s.fans * e(t, 16.1, 18.3))}M`, 100, ink, {
                fontFamily: displayFont,
                textAnchor: "middle",
              })}
              {text(680, 412, "FANS · SAMPLE VALUE", 16, ink, {
                textAnchor: "middle",
                letterSpacing: 2,
              })}
            </g>
          </g>
          <g opacity={mapIn * (1 - banner)}>
            {text(120, 145, "02 / ACROSS BORDERS", 20, ink, { letterSpacing: 4 })}
            {text(120, 225, "THE WORLD IS OUR PITCH.", 65, ink, { fontFamily: displayFont })}
          </g>
          <g opacity={banner}>
            <rect x="260" y="120" width={1400 * banner} height="180" fill={s.coral} />
            <g clipPath={`url(#${uid}-split)`}>
              <rect x="960" y="120" width="700" height="180" fill={s.green} />
            </g>
            <g transform={`translate(${mix(820, 640, split)} 205)`}>
              {text(-150, 45, `${Math.round(s.bat * e(t, 19.1, 20.3))}%`, 116, bg, {
                fontFamily: displayFont,
                textAnchor: "middle",
              })}
              {text(-140, 79, "BAT FIRST", 16, bg, { letterSpacing: 3, textAnchor: "middle" })}
              <g
                transform={`translate(70 ${25 + 65 * (1 - e(t, 19, 19.65))})`}
                opacity={e(t, 19, 19.65)}
              >
                <Player color={bg} />
              </g>
            </g>
            <g opacity={split} transform="translate(1320 205)">
              {text(-100, 45, `${Math.round((100 - s.bat) * e(t, 21.1, 22.5))}%`, 116, bg, {
                fontFamily: displayFont,
                textAnchor: "middle",
              })}
              {text(-100, 79, "CHASE", 16, bg, { letterSpacing: 3, textAnchor: "middle" })}
              <g transform={`translate(115 ${34 + 65 * (1 - split)}) scale(.87)`}>
                <Player bowler color={bg} />
              </g>
            </g>
            {text(260, 95, "HOW WOULD YOU PLAY?", 19, ink, { letterSpacing: 4 })}
          </g>
        </>
      )}
      {stadium && (
        <g>
          <rect width="1920" height="1080" fill={ink} />
          <g
            transform={`translate(960 600) scale(${t < 24.3 ? 1 + e(t, 23.5, 24.3) * 0.07 : 1.65 + e(t, 24.3, 25) * 0.08})`}
          >
            <ellipse rx="780" ry="360" fill={bg} />
            {[0, 1, 2, 3, 4].map((i) => (
              <ellipse
                key={i}
                rx={740 - i * 28}
                ry={326 - i * 20}
                stroke={ink}
                strokeWidth="9"
                fill="none"
                opacity=".16"
              />
            ))}
            {Array.from({ length: 110 }, (_, i) => {
              const a = (i * Math.PI * 2) / 110;
              return (
                <circle
                  key={i}
                  cx={Math.cos(a) * 700}
                  cy={Math.sin(a) * 277}
                  r="5"
                  fill={i % 3 ? s.green : s.coral}
                />
              );
            })}
            <ellipse rx="592" ry="217" fill={s.green} />
            <ellipse
              rx="550"
              ry="190"
              fill="none"
              stroke={bg}
              strokeWidth="2"
              strokeDasharray="12 7"
            />
            <rect x="-44" y="-125" width="88" height="250" fill="#D5BC86" />
            <g stroke={bg} strokeWidth="4">
              <path d="M-68-91H68 M-68 91H68" />
              <path d="M-12-94V-121 M0-94V-121 M12-94V-121 M-16-123H16 M-12 90V63 M0 90V63 M12 90V63 M-16 61H16" />
            </g>
            <circle
              cx={mix(70, -10, e(t, 23.5, 25))}
              cy={mix(-150, 70, e(t, 23.5, 25))}
              r="9"
              fill={s.coral}
            />
          </g>
          {text(120, 145, "03 / THE BEAUTIFUL GAME", 20, bg, { letterSpacing: 4 })}
          {text(120, 258, s.closing, 88, bg, { fontFamily: displayFont })}
          {text(120, 319, "From the first ball to the final roar.", 27, bg, { opacity: 0.7 })}
          <g transform="translate(1720 180)">
            <SportIcon kind={3} color={s.coral} />
          </g>
        </g>
      )}
      <g>
        {text(120, 1016, "CRICKET / MOTION STUDY", 17, stadium ? bg : ink, {
          letterSpacing: 3,
          opacity: 0.6,
        })}
        {text(1800, 1016, "ILLUSTRATIVE DATA · NOT A SURVEY", 15, stadium ? bg : ink, {
          textAnchor: "end",
          letterSpacing: 2,
          opacity: 0.6,
        })}
        <path d="M120 1040H1800" stroke={stadium ? bg : ink} strokeOpacity=".15" />
        <path d={`M120 1040H${120 + 1680 * clamp(t / 25)}`} stroke={s.coral} strokeWidth="3" />
      </g>
    </svg>
  );
}
