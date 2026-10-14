import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { CountUp, Wipe, CricketFilm, counter, progress, stagger, defaults, FRAMES } from "../src";

describe("deterministic frame helpers", () => {
  test("progress clamps and supports zero-length segments", () => {
    expect(progress(-1, 0, 30)).toBe(0);
    expect(progress(30, 0, 30)).toBe(1);
    expect(progress(9, 10, 10)).toBe(0);
    expect(progress(10, 10, 10)).toBe(1);
  });
  test("counters land on exact values", () => {
    expect(counter(0, 0, 30, 80)).toBe(0);
    expect(counter(30, 0, 30, 80)).toBe(80);
    expect(counter(30, 0, 30, 58, 42)).toBe(58);
  });
  test("stagger delays later items", () => {
    expect(stagger(3, 2, 0, 24, 3)).toBe(0);
    expect(stagger(30, 2, 0, 24, 3)).toBe(1);
  });
});
describe("SVG components", () => {
  test("numeric display matches final frame", () => {
    const html = renderToStaticMarkup(
      <svg>
        <CountUp frame={30} end={30} to={42} suffix="%" />
      </svg>,
    );
    expect(html).toContain("42");
    expect(html).toContain("%");
  });
  test("right-to-left wipe reveals from the right", () => {
    const html = renderToStaticMarkup(
      <svg>
        <Wipe frame={0} width={100} height={50} direction="right-to-left">
          <rect width={100} height={50} />
        </Wipe>
      </svg>,
    );
    expect(html).toContain('x="100"');
    expect(html).toContain('width="0"');
  });
  test("preset handles boundary frames and includes illustrative notice", () => {
    for (const frame of [-1, 0, 150, 310, 525, 685, FRAMES - 1, 9999]) {
      const html = renderToStaticMarkup(<CricketFilm frame={frame} settings={defaults} />);
      expect(html).not.toContain("NaN");
      expect(html).toContain("ILLUSTRATIVE DATA");
    }
  });
  test("two instances have independent clip and pattern IDs", () => {
    const html = renderToStaticMarkup(
      <>
        <CricketFilm frame={150} />
        <CricketFilm frame={150} />
      </>,
    );
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
