# Animation Library

Reusable, deterministic **React/SVG** animation components extracted from our cricket motion project. Pass a frame number to get an exact visual state; playback and MP4 export share the same timeline.

## Included
- `CricketFilm`: original 25-second infographic preset, 1920×1080, 30 fps, 750 frames. Editable palette, headlines, captions, illustrative values and closing copy.
- `SportIcon`: original SVG sport pictograms, kinds 0–7.
- `StaggeredBars`: configurable labels, heights, icons, stagger, gap and highlight.
- `Wipe`: left/right/top/bottom reveal with collision-safe SVG masks.
- `CountUp`: numeric animation with precision, prefix and suffix.
- `Spotlight`: animated outline and downward marker.
- Frame helpers: `progress`, `counter`, `stagger`, `lerp`, `clamp`, `linear`, `smoothstep`, `easeOutCubic`.
- Original studio editor example and a Python MP4 renderer.

**Excluded:** supplied reference video, reference-derived silhouettes/textures, faithful reference reconstruction, reference screenshots and renders. All preset data is illustrative, not survey research.

## Get started
Requires Bun, React 19+, and TypeScript for builds.

```bash
git clone https://github.com/Marufpatel/animation-libarary.git
cd animation-libarary
bun install
bun run build
bun test
```

This is a library, not a standalone hosted app. Integrate it into a managed Bun/Vite/React app. No npm release has been published.

Install from GitHub into an existing app:

```bash
bun add github:Marufpatel/animation-libarary
```

The prepare/build step fetches public-domain Natural Earth geography and OFL fonts; first build needs internet. Alternatively clone beside your app, build, then `bun add ../animation-libarary`.

## Full preset

```tsx
import { CricketFilm, defaults, FPS, FRAMES } from '@marufpatel/animation-library';

const settings = {
  ...defaults,
  title: 'CRICKET',
  background: '#F3F0E7',
  green: '#008A68',
  coral: '#EF704C',
  teams: 12,
  fans: 80,
  bat: 42,
};

export function Composition({ frame }: { frame: number }) {
  return <CricketFilm frame={frame} settings={settings} />;
}
// frame = elapsed seconds × FPS; use 0 through FRAMES - 1.
```

Preset props: `frame` (required), `settings` (defaults supplied), `id` (optional outer SVG ID), `fontFamily` (defaults DM Sans), `displayFont` (defaults Anton). Each instance has independent SVG definition IDs.

Settings: `background`, `ink`, `green`, `coral`, `title`, `subtitle`, `caption`, `teams`, `fans`, `bat`, `closing`. `bat` controls the first split percentage; the second is `100 - bat`. Keep copy short to avoid overflowing the designed text regions. The overall ranking categories and geometry are currently defined in preset source; use `StaggeredBars` to design a new ranking.

## Compose new animation pieces

SVG primitives must be children of an `<svg>`; they don't create their own canvas. They don't need external assets or a CSS framework.

```tsx
import { StaggeredBars, Wipe, CountUp, Spotlight, SportIcon } from '@marufpatel/animation-library';

export function Ranking({ frame }: { frame: number }) {
  return (
    <svg viewBox="0 0 1000 600" style={{ color: '#123B32', background: '#F3F0E7' }}>
      <StaggeredBars frame={frame} x={80} baseline={450} highlight={1}
        items={[
          { label: 'Batting', height: 280, icon: <SportIcon kind={3} /> },
          { label: 'Bowling', height: 210 },
          { label: 'Fielding', height: 160 },
        ]} />
      <Spotlight frame={frame} start={45} end={65} x={176} y={190} width={108} height={270} />
      <Wipe frame={frame} start={70} end={95} x={500} y={100} width={350} height={80} direction="right-to-left">
        <rect x={500} y={100} width={350} height={80} fill="#EF704C" />
        <CountUp frame={frame} start={95} end={135} to={80} x={530} y={157} suffix="M fans" fill="white" />
      </Wipe>
    </svg>
  );
}
```

## Reuse the editor
`examples/studio.tsx` contains the original editor: play/pause, frame stepping, timeline scrub, palette/copy editing, local storage, JSON import/export and current SVG export. It's an integration example, not a separate app scaffold.

1. Copy it into your existing managed app's `packages/web/src/web/pages/`.
2. Change its import from `../src` to `@marufpatel/animation-library`.
3. Copy or merge `examples/studio.css` into your app stylesheet. It uses Tailwind 4, self-hosted fonts and lucide-react icons.
4. Provide `/fonts/anton.ttf` and `/fonts/dm-sans.ttf` by copying this package's generated `public/fonts/` into your app's `packages/web/public/fonts/`.
5. Provide `/cricket-motion.mp4` after rendering if you want the editor's download link. The MP4 isn't stored in this repository.

Standalone preset usage can instead pass your own `fontFamily` and `displayFont`.

## MP4 export
Install Python Playwright; have Chrome/Chromium and ffmpeg on PATH. Start your managed app, with the editor render route setting `window.setFilmFrame(frame)` and showing only the composition.

```bash
pip install playwright
python scripts/render.py --url 'http://localhost:4200/cricket?render=1' --output cricket.mp4
# Optional exported editor settings:
python scripts/render.py --url 'http://localhost:4200/cricket?render=1' --settings cricket-settings.json --output custom.mp4
```

Use your app's assigned port and actual route; the example URL is not a port override. Output is 750 frames, 25 seconds, 1920×1080, H.264, silent. The editor download button serves the last rendered file; edits require rerendering.

## Build and test
`bun run assets` fetches map/fonts, `bun run build` produces browser JS and TypeScript declarations, `bun run typecheck` checks types, `bun test` tests deterministic frame helpers, preset boundary frames and independent SVG IDs. Generated assets and build output are ignored in Git.

## License
Code and original SVG graphics: MIT. Natural Earth geography: public domain. Anton and DM Sans: SIL Open Font License. See `THIRD-PARTY-NOTICES.md` and generated font license files. No rights to the supplied reference-video assets are granted or needed by this public package.
