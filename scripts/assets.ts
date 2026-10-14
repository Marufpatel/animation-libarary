import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
async function download(url: string, target: string) {
  const path = resolve(root, target);
  if (await Bun.file(path).exists()) return;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Asset download failed: ${response.status} ${url}`);
  await writeFile(path, Buffer.from(await response.arrayBuffer()));
}
await mkdir(resolve(root, "public/fonts"), { recursive: true });
await mkdir(resolve(root, "src"), { recursive: true });
if (!(await Bun.file(resolve(root, "src/world.ts")).exists())) {
  const url =
    "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson";
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Map download failed: ${response.status}`);
  const geo = (await response.json()) as {
    features: {
      properties: { ADMIN: string; CONTINENT: string };
      geometry: { type: string; coordinates: number[][][][] | number[][][] };
    }[];
  };
  const countries = geo.features
    .filter((f) => f.properties.ADMIN !== "Antarctica")
    .map((f) => {
      const polygons = (
        f.geometry.type === "MultiPolygon" ? f.geometry.coordinates : [f.geometry.coordinates]
      ) as number[][][][];
      const d = polygons
        .map((poly) =>
          poly
            .map(
              (ring) =>
                "M" +
                ring
                  .map(
                    ([x, y]) => `${((x + 180) * 3.65).toFixed(1)},${((83 - y) * 3.65).toFixed(1)}`,
                  )
                  .join("L") +
                "Z",
            )
            .join(""),
        )
        .join("");
      const c = f.properties.CONTINENT;
      return {
        name: f.properties.ADMIN,
        group: ["North America", "South America"].includes(c)
          ? 1
          : ["Europe", "Asia"].includes(c)
            ? 2
            : 3,
        d,
      };
    });
  await writeFile(
    resolve(root, "src/world.ts"),
    "export const countries = " + JSON.stringify(countries) + ";\n",
  );
}
await Promise.all([
  download(
    "https://raw.githubusercontent.com/google/fonts/main/ofl/anton/Anton-Regular.ttf",
    "public/fonts/anton.ttf",
  ),
  download(
    "https://raw.githubusercontent.com/google/fonts/main/ofl/anton/OFL.txt",
    "public/fonts/ANTON-LICENSE.txt",
  ),
  download(
    "https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/DMSans%5Bopsz,wght%5D.ttf",
    "public/fonts/dm-sans.ttf",
  ),
  download(
    "https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/OFL.txt",
    "public/fonts/DM-SANS-LICENSE.txt",
  ),
]);
console.log("Public-domain map and OFL fonts ready. No reference-video assets downloaded.");
