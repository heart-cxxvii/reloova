import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = await readFile(
  new URL("../public/motion-lab/demo.js", import.meta.url),
  "utf8",
);
const names = ["angles", "summary", "quality", "metadata", "events"];
const sample = Object.fromEntries(
  await Promise.all(
    names.map(async (name) => [
      name,
      JSON.parse(
        await readFile(
          new URL(
            "../public/motion-lab/sample/" + name + ".json",
            import.meta.url,
          ),
          "utf8",
        ),
      ),
    ]),
  ),
);
async function run(change = () => {}) {
  const data = structuredClone(sample);
  change(data);
  const nodes = new Map();
  const element = () => ({
    children: [],
    hidden: false,
    value: "",
    max: "0",
    currentTime: 0,
    append(...items) {
      this.children.push(...items);
    },
    replaceChildren(...items) {
      this.children = items;
    },
    setAttribute() {},
    addEventListener() {},
  });
  const get = (id) => {
    if (!nodes.has(id)) nodes.set(id, element());
    return nodes.get(id);
  };
  get("results").hidden = true;
  get("metric").value = "knee_flexion";
  const context = {
    document: {
      getElementById: get,
      createElement: element,
      createElementNS: element,
    },
    fetch: async (url) => {
      const name = url.match(/\/([a-z]+)\.json$/)?.[1];
      assert.ok(
        names.includes(name),
        "Only bundled JSON fixtures may be requested",
      );
      return { ok: true, json: async () => data[name] };
    },
    console: { error() {} },
  };
  // Run the actual loader and renderer; omit only the independent video Blob fetch.
  const loader = source.slice(0, source.indexOf("\nload();"));
  await vm.runInNewContext(loader + "\nload();", context);
  return { get, data };
}
const normal = await run();
assert.equal(normal.get("status").hidden, true);
assert.equal(normal.get("results").hidden, false);
assert.equal(normal.get("stats").children.length, 4);
assert.equal(normal.get("seek").max, sample.angles.at(-1).time_s);
assert.equal(normal.get("events").children.length, 2);
assert.equal(normal.get("downloads").children.length, 6);
for (const change of [
  (d) => {
    d.summary.duration_s = 16.4;
    d.metadata.duration_s = 16.37;
  },
  (d) => {
    d.summary.duration_s = d.angles.at(-1).time_s;
  },
  (d) => {
    d.quality.fps = 29.97;
    d.quality.timestamp_step_s = 0.0333;
  },
  // Expected capture frames are not the same measurement as actual analyzed frames.
  (d) => {
    d.quality.expected_frame_count += 5;
  },
])
  assert.equal((await run(change)).get("results").hidden, false);
const mismatches = [
  (d) => {
    d.summary.frame_count += 1;
  },
  (d) => {
    d.metadata.frame_count -= 1;
  },
  (d) => {
    d.quality.frame_count = 900;
  },
  (d) => {
    d.summary.duration_s = 30;
  },
  (d) => {
    d.metadata.duration_s = 30;
  },
  (d) => {
    d.summary.duration_s = d.metadata.duration_s = 30;
  },
  (d) => {
    d.quality.fps = 60;
  },
  (d) => {
    d.quality.timestamp_step_s = 0.1;
  },
  (d) => {
    d.summary.repetition_count = 3;
  },
  (d) => {
    d.events.pop();
  },
  (d) => {
    d.angles.at(-1).time_s = 40;
  },
  (d) => {
    d.angles[2].time_s = -1;
  },
  (d) => {
    d.metadata.duration_s = null;
  },
];
for (const change of mismatches) {
  const { get } = await run(change);
  assert.equal(get("results").hidden, true);
  assert.match(get("status").textContent, /解析データを読み込めませんでした/);
  assert.equal(get("status").hidden, false);
  assert.equal(get("seek").max, "0");
  assert.equal(get("stats").children.length, 0);
}
console.log(
  "Motion Lab: bundled sample, 4 tolerated variants, 13 inconsistent samples passed offline.",
);
