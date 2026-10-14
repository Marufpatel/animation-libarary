import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  Play,
  Pause,
  SkipBack,
  ChevronLeft,
  ChevronRight,
  Download,
  SlidersHorizontal,
  Layers,
  Film,
  RotateCcw,
  Upload,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { CricketFilm, defaults, beats, FPS, FRAMES, type Settings } from "../src";

declare global {
  interface Window {
    setFilmFrame: (n: number) => void;
  }
}
const saveFile = (name: string, text: string, type = "application/json") => {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
export default function Studio() {
  const renderMode = new URLSearchParams(location.search).has("render");
  const [frame, setFrame] = useState(renderMode ? 0 : 150),
    [playing, setPlaying] = useState(false),
    [tab, setTab] = useState("Design"),
    [message, setMessage] = useState("");
  const [s, setS] = useState<Settings>(() => {
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem("cricket-settings") || "{}") };
    } catch {
      return defaults;
    }
  });
  const input = useRef<HTMLInputElement>(null);
  const frameRef = useRef(frame);
  frameRef.current = frame;
  const t = frame / FPS,
    beat = beats.find((b) => t >= b.start && t < b.end) || beats[8]!;
  useEffect(() => {
    window.setFilmFrame = (n) => flushSync(() => setFrame(n));
  }, []);
  useEffect(() => {
    localStorage.setItem("cricket-settings", JSON.stringify(s));
  }, [s]);
  useEffect(() => {
    if (!playing) return;
    let id = 0;
    const start = performance.now(),
      initial = frameRef.current;
    const tick = (now: number) => {
      const n = initial + Math.floor(((now - start) / 1000) * FPS);
      if (n >= FRAMES) {
        setFrame(FRAMES - 1);
        setPlaying(false);
        return;
      }
      setFrame(n);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [playing]);
  useEffect(() => {
    const fn = (ev: KeyboardEvent) => {
      if ((ev.target as HTMLElement).tagName === "INPUT") return;
      if (ev.code === "Space") {
        ev.preventDefault();
        setPlaying((p) => !p);
      }
      if (ev.code === "ArrowRight") setFrame((f) => Math.min(FRAMES - 1, f + 1));
      if (ev.code === "ArrowLeft") setFrame((f) => Math.max(0, f - 1));
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);
  const update = (key: keyof Settings, value: string | number) => setS({ ...s, [key]: value });
  const notify = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3500);
  };
  async function exportSvg() {
    const svg = document.querySelector("#film")?.cloneNode(true) as SVGElement;
    if (!svg) return;
    const fonts = await Promise.all(
      ["/fonts/anton.ttf", "/fonts/dm-sans.ttf"].map(async (path) => {
        const data = await (await fetch(path)).arrayBuffer();
        let binary = "";
        new Uint8Array(data).forEach((b) => (binary += String.fromCharCode(b)));
        return btoa(binary);
      }),
    );
    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = `@font-face{font-family:Anton;src:url(data:font/ttf;base64,${fonts[0]})}@font-face{font-family:'DM Sans';src:url(data:font/ttf;base64,${fonts[1]})}`;
    svg.prepend(style);
    saveFile(
      `cricket-frame-${frame}.svg`,
      new XMLSerializer().serializeToString(svg),
      "image/svg+xml",
    );
    notify("Editable vector frame exported");
  }
  if (renderMode)
    return (
      <div className="render-only">
        <CricketFilm id="film" frame={frame} settings={s} />
      </div>
    );
  return (
    <div className="studio">
      <header>
        <div className="brand">
          <span className="brand-mark">
            c<span>.</span>
          </span>
          <div>
            crease<span className="brand-sub">MOTION STUDIO</span>
          </div>
        </div>
        <div className="project-name">
          Cricket / A global game <span className="version">V.01</span>
        </div>
        <div className="header-actions">
          <span className="saved">
            <Check size={13} /> Saved locally
          </span>
          <a className="export-button" href="/cricket-motion.mp4" download>
            <Download size={15} /> Download MP4
          </a>
        </div>
      </header>
      <div className="workspace">
        <nav className="rail">
          <button
            title="Design"
            className={tab === "Design" ? "selected" : ""}
            onClick={() => setTab("Design")}
          >
            <SlidersHorizontal size={21} />
            <span>Design</span>
          </button>
          <button
            title="Copy and data"
            className={tab === "Content" ? "selected" : ""}
            onClick={() => setTab("Content")}
          >
            <Layers size={21} />
            <span>Content</span>
          </button>
          <button
            title="Timing"
            className={tab === "Timing" ? "selected" : ""}
            onClick={() => setTab("Timing")}
          >
            <Film size={21} />
            <span>Timing</span>
          </button>
          <div className="rail-bottom">
            30<span>FPS</span>
          </div>
        </nav>
        <main>
          <div className="stage-heading">
            <div>
              <span className="eyebrow">COMPOSITION 01</span>
              <h1>The global game</h1>
            </div>
            <span className="stage-meta">
              1920 × 1080 <span> / </span> 00:25
            </span>
          </div>
          <div className="stage">
            <CricketFilm id="film" frame={frame} settings={s} />
          </div>
          <div className="stage-footer">
            <span>
              <span className="live-dot" /> {beat.name}
            </span>
            <button onClick={exportSvg}>
              Export current SVG <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="transport">
            <div className="transport-left">
              <button
                title="Restart"
                onClick={() => {
                  setFrame(0);
                  setPlaying(false);
                }}
              >
                <SkipBack size={16} />
              </button>
              <button
                title="Previous frame"
                onClick={() => {
                  setPlaying(false);
                  setFrame(Math.max(0, frame - 1));
                }}
              >
                <ChevronLeft size={17} />
              </button>
              <button
                className="play-button"
                title="Play / pause"
                onClick={() => {
                  if (frame === FRAMES - 1) setFrame(0);
                  setPlaying(!playing);
                }}
              >
                {playing ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                title="Next frame"
                onClick={() => {
                  setPlaying(false);
                  setFrame(Math.min(FRAMES - 1, frame + 1));
                }}
              >
                <ChevronRight size={17} />
              </button>
              <span className="timecode">
                00:{String(Math.floor(t)).padStart(2, "0")}:{String(frame % 30).padStart(2, "0")}{" "}
                <span>/ 00:25:00</span>
              </span>
            </div>
            <span className="frame-label">
              FRAME {String(frame).padStart(3, "0")} <span>· SPACE TO PLAY</span>
            </span>
          </div>
        </main>
        <aside>
          <div className="panel-title">
            <h2>
              {tab === "Design"
                ? "Art direction"
                : tab === "Content"
                  ? "Copy & data"
                  : "Motion blueprint"}
            </h2>
            <span>{tab === "Design" ? "01" : tab === "Content" ? "02" : "03"}</span>
          </div>
          {tab === "Design" ? (
            <>
              <p className="panel-intro">
                A new identity.
                <br />
                The same motion language.
              </p>
              <div className="section-label">CANVAS PALETTE</div>
              {(["background", "ink", "green", "coral"] as const).map((key, i) => (
                <label className="color-row" key={key}>
                  <input
                    aria-label={`${key} color`}
                    type="color"
                    value={s[key]}
                    onChange={(ev) => update(key, ev.target.value)}
                  />
                  <span>
                    {["Warm ivory", "Forest ink", "Emerald", "Coral"][i]}
                    <small>{s[key].toUpperCase()}</small>
                  </span>
                </label>
              ))}
              <div className="section-label">TYPOGRAPHY</div>
              <div className="type-sample">
                Aa{" "}
                <span>
                  Anton<small>DISPLAY / CONDENSED</small>
                </span>
              </div>
              <div className="type-sample body-type">
                Aa{" "}
                <span>
                  DM Sans<small>BODY / GROTESK</small>
                </span>
              </div>
              <div className="note">
                Original cricket pictograms.
                <br />
                Vector layers. No copied footage.
              </div>
            </>
          ) : tab === "Content" ? (
            <>
              <p className="panel-intro">
                Every word and value
                <br />
                is yours to change.
              </p>
              {(["title", "subtitle", "caption", "closing"] as const).map((key) => (
                <label className="field" key={key}>
                  <span>{key}</span>
                  <input
                    aria-label={key}
                    value={s[key]}
                    maxLength={key === "title" ? 12 : key === "closing" ? 28 : 30}
                    onChange={(ev) => update(key, ev.target.value)}
                  />
                </label>
              ))}
              {(["teams", "fans", "bat"] as const).map((key) => (
                <label className="field" key={key}>
                  <span>
                    {key === "bat" ? "Bat first %" : key === "fans" ? "Fans (millions)" : "Teams"}
                  </span>
                  <input
                    aria-label={key}
                    type="number"
                    min="1"
                    max={key === "bat" ? 99 : 999}
                    value={s[key]}
                    onChange={(ev) =>
                      update(
                        key,
                        Math.max(
                          1,
                          Math.min(key === "bat" ? 99 : 999, Number(ev.target.value) || 1),
                        ),
                      )
                    }
                  />
                </label>
              ))}
              <div className="note">
                Demo values are illustrative, not survey results. Chase % is calculated
                automatically.
              </div>
            </>
          ) : (
            <>
              <p className="panel-intro">
                Reference-led rhythm.
                <br />
                Frame-accurate control.
              </p>
              {beats.map((b, i) => (
                <button
                  className={`beat-link ${beat === b ? "active" : ""}`}
                  key={b.name}
                  onClick={() => {
                    setPlaying(false);
                    setFrame(Math.round(b.start * FPS));
                  }}
                >
                  <span className="beat-number">0{i + 1}</span>
                  <span>
                    {b.name}
                    <small>
                      {b.start.toFixed(2)}s — {b.end.toFixed(2)}s
                    </small>
                  </span>
                  <ChevronRight size={13} />
                </button>
              ))}
            </>
          )}
          <div className="project-tools">
            <button onClick={() => saveFile("cricket-settings.json", JSON.stringify(s, null, 2))}>
              <Download size={14} /> Save settings
            </button>
            <button onClick={() => input.current?.click()}>
              <Upload size={14} /> Load settings
            </button>
            <input
              aria-label="Import project settings"
              hidden
              ref={input}
              type="file"
              accept=".json"
              onChange={async (ev) => {
                try {
                  const file = ev.target.files?.[0];
                  if (!file) return;
                  const v = JSON.parse(await file.text());
                  const next = { ...defaults };
                  for (const key of Object.keys(defaults) as (keyof Settings)[]) {
                    const val = v[key];
                    if (typeof val !== typeof defaults[key]) continue;
                    if (
                      typeof val === "string" &&
                      ["background", "ink", "green", "coral"].includes(key) &&
                      !/^#[0-9a-f]{6}$/i.test(val)
                    )
                      continue;
                    Object.assign(next, {
                      [key]:
                        typeof val === "number"
                          ? Math.max(1, Math.min(key === "bat" ? 99 : 999, val))
                          : val.slice(0, 30),
                    });
                  }
                  setS(next);
                  notify("Settings loaded");
                } catch {
                  notify("Could not load settings JSON");
                }
                ev.target.value = "";
              }}
            />
            <button
              onClick={() => {
                setS(defaults);
                notify("Design reset");
              }}
            >
              <RotateCcw size={14} /> Reset design
            </button>
          </div>
        </aside>
      </div>
      <section className="timeline">
        <div className="timeline-top">
          <span>
            TIMELINE <small> / 09 SEQUENCES</small>
          </span>
          <span className="timeline-hint">Drag to scrub · ← → step one frame</span>
        </div>
        <div className="timeline-ruler">
          <span className="track-label">SECONDS</span>
          <div className="ruler-numbers">
            {[0, 5, 10, 15, 20, 25].map((n) => (
              <span key={n}>{String(n).padStart(2, "0")}</span>
            ))}
          </div>
        </div>
        <div className="track">
          <span className="track-label">
            <Layers size={13} /> Graphics
          </span>
          <div className="segments">
            {beats.map((b, i) => (
              <button
                key={b.name}
                style={{ width: `${(b.end - b.start) * 4}%` }}
                className={i > 6 ? "coral-track" : ""}
                onClick={() => {
                  setPlaying(false);
                  setFrame(Math.round(b.start * FPS));
                }}
              >
                {b.name}
              </button>
            ))}
            <div className="playhead" style={{ left: `${t * 4}%` }}>
              <span />
            </div>
            <input
              aria-label="Timeline scrub"
              className="scrubber"
              type="range"
              min="0"
              max={FRAMES - 1}
              value={frame}
              onChange={(ev) => {
                setPlaying(false);
                setFrame(Number(ev.target.value));
              }}
            />
          </div>
        </div>
        <div className="track second-track">
          <span className="track-label">
            <Film size={13} /> Text & data
          </span>
          <div className="segments muted-segments">
            <div style={{ width: "19%" }}>Labels</div>
            <div style={{ width: "8%" }}>Title</div>
            <div style={{ width: "14%" }} />
            <div style={{ width: "23%" }}>Teams</div>
            <div style={{ width: "10%" }}>Fans</div>
            <div style={{ width: "20%" }}>Strategy split</div>
            <div style={{ width: "6%" }}>Outro</div>
          </div>
        </div>
        <div className="timeline-bottom">
          <span>REFERENCE TIMING · REDESIGNED FOR CRICKET</span>
          <span>
            25 SEC <span> / </span> 750 FRAMES <span> / </span> SILENT
          </span>
        </div>
      </section>
      {message && (
        <div className="toast">
          <Check size={16} />
          {message}
        </div>
      )}
    </div>
  );
}
