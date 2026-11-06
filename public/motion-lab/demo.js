"use strict";
const $ = (id) => document.getElementById(id),
  fmt = (x, n = 1) =>
    Number.isFinite(Number(x)) ? Number(x).toFixed(n) : "未評価";
let rows = [],
  duration = 0;
function row(label, value) {
  const el = document.createElement("div");
  el.className = "row";
  const a = document.createElement("span"),
    b = document.createElement("b");
  a.textContent = label;
  b.textContent = value;
  el.append(a, b);
  return el;
}
function stat(label, value, unit = "") {
  const el = document.createElement("div");
  el.className = "stat";
  for (const [tag, txt] of [
    ["small", label],
    ["strong", value],
    ["em", unit],
  ]) {
    const c = document.createElement(tag);
    c.textContent = txt;
    el.append(c);
  }
  $("stats").append(el);
}
const ns = "http://www.w3.org/2000/svg";
function svg(tag, attrs, text) {
  const e = document.createElementNS(ns, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text !== undefined) e.textContent = text;
  return e;
}
function draw() {
  const chart = $("chart");
  chart.replaceChildren();
  const metric = $("metric").value,
    keys = ["left_" + metric + "_deg", "right_" + metric + "_deg"];
  const vals = rows
    .flatMap((r) => keys.map((k) => r[k]))
    .filter((v) => typeof v === "number" && Number.isFinite(v));
  const ymax = Math.max(90, Math.ceil(Math.max(...vals, 0) / 30) * 30);
  const xmin = 55,
    xmax = 880,
    top = 16,
    bottom = 245,
    x = (t) => xmin + ((xmax - xmin) * t) / Math.max(duration, 0.01),
    y = (v) => bottom - ((bottom - top) * v) / ymax;
  for (let i = 0; i <= 3; i++) {
    const v = (ymax * i) / 3;
    chart.append(
      svg("line", {
        x1: xmin,
        y1: y(v),
        x2: xmax,
        y2: y(v),
        stroke: "#e1e8ec",
      }),
    );
    chart.append(
      svg(
        "text",
        { x: 43, y: y(v) + 4, "text-anchor": "end" },
        Math.round(v) + "°",
      ),
    );
  }
  for (let i = 0; i <= 4; i++) {
    const t = (duration * i) / 4;
    chart.append(
      svg(
        "text",
        { x: x(t), y: 278, "text-anchor": "middle" },
        t.toFixed(1) + "秒",
      ),
    );
  }
  keys.forEach((k, i) => {
    let d = "",
      connected = false;
    for (const r of rows) {
      const v = r[k];
      if (typeof v !== "number" || !Number.isFinite(v)) {
        connected = false;
        continue;
      }
      d +=
        (connected ? "L" : "M") +
        x(r.time_s).toFixed(2) +
        " " +
        y(v).toFixed(2) +
        " ";
      connected = true;
    }
    chart.append(
      svg("path", {
        d,
        fill: "none",
        stroke: i ? "#926e35" : "#2b6b75",
        "stroke-width": 2.5,
        "stroke-linejoin": "round",
      }),
    );
  });
  chart.append(
    svg("line", {
      id: "cursor",
      x1: x($("video").currentTime || 0),
      x2: x($("video").currentTime || 0),
      y1: top,
      y2: bottom,
      stroke: "#a03a43",
      "stroke-width": 1.5,
      "stroke-dasharray": "4 4",
    }),
  );
  $("definition").textContent =
    {
      knee_flexion:
        "膝屈曲角：股関節・膝・足首の内角を180°から引いた値。伸展で約0°です。",
      hip_flexion: "股関節屈曲角：肩・股関節・膝の内角を180°から引いた値です。",
      trunk_inclination:
        "体幹傾斜角：股関節から肩へ向かう線分と画像上方の鉛直軸との角度です。",
    }[metric] + " カメラに対する向きの影響を受ける2D投影値です。";
}
$("metric").addEventListener("change", draw);
$("seek").addEventListener("input", (e) => {
  $("video").currentTime = Number(e.target.value);
});
$("video").addEventListener("timeupdate", () => {
  const t = $("video").currentTime;
  $("seek").value = t;
  $("time").value = t.toFixed(2) + " 秒";
  const c = $("cursor");
  if (c) {
    const x = 55 + (825 * t) / Math.max(duration, 0.01);
    c.setAttribute("x1", x);
    c.setAttribute("x2", x);
  }
});
async function load() {
  try {
    const names = ["angles", "summary", "quality", "metadata", "events"];
    const data = await Promise.all(
      names.map(async (n) => {
        const r = await fetch("/motion-lab/sample/" + n + ".json");
        if (!r.ok) throw Error(n + " " + r.status);
        return r.json();
      }),
    );
    const [angles, summary, quality, metadata, events] = data;
    rows = Array.isArray(angles)
      ? angles
      : angles.data || angles.frames || angles.records;
    if (!Array.isArray(rows) || !rows.length)
      throw Error("時系列データがありません");
    duration = rows.at(-1).time_s;
    $("seek").max = duration;
    const reps = Array.isArray(events)
      ? events
      : events.repetitions || events.events || [];
    const count =
      summary.repetition_count ??
      summary.squat_count ??
      summary.repetitions ??
      reps.length;
    stat("検出した反復", typeof count === "number" ? count : reps.length, "回");
    stat("解析した動画", fmt(summary.duration_s ?? duration), "秒");
    stat("フレーム数", rows.length, "frames");
    const seconds =
      metadata.processing_seconds ??
      metadata.processing_time_s ??
      metadata.elapsed_seconds ??
      summary.processing_seconds ??
      summary.processing_time_s ??
      summary.elapsed_seconds;
    stat("処理時間", seconds == null ? "詳細参照" : fmt(seconds), "秒");
    $("summary").textContent = JSON.stringify(summary, null, 2);
    $("metadata").textContent = JSON.stringify(metadata, null, 2);
    $("quality-json").textContent = JSON.stringify(quality, null, 2);
    if (reps.length) {
      reps.forEach((r, i) =>
        $("events").append(
          row(
            "反復 " + (i + 1),
            fmt(
              r.duration_s ??
                (r.end_s ?? r.end_time_s) - (r.start_s ?? r.start_time_s),
              2,
            ) + " 秒",
          ),
        ),
      );
    } else {
      $("events").append(row("完了した反復", "検出なし"));
    }
    const labels = {
      processed_coordinate_missing_fraction: "処理後の主要点欠損率",
      major_landmark_low_confidence_fraction: "主要点の低信頼度率",
      angle_jumps_over_20deg_per_frame: "膝角度の急変件数",
      missing_fraction: "欠損率",
      low_confidence_fraction: "低信頼度の割合",
      valid_frame_fraction: "有効フレーム率",
      major_landmark_valid_fraction: "主要点の有効率",
      angle_jump_count: "角度急変の件数",
      frame_count: "フレーム数",
    };
    let shown = 0;
    for (const [k, label] of Object.entries(labels)) {
      if (typeof quality[k] === "number") {
        $("quality").append(
          row(
            label,
            k.includes("fraction")
              ? fmt(quality[k] * 100, 2) + "%"
              : fmt(quality[k], 0),
          ),
        );
        shown++;
      }
    }
    if (!shown)
      $("quality").append(row("フレームごとの品質", "下のJSONで詳細を確認"));
    $("quality").append(row("絶対精度（正解との誤差）", "未評価"));
    for (const [name, label] of [
      ["angles.csv", "関節角度 CSV"],
      ["landmarks_raw.csv", "生の座標・信頼度 CSV"],
      ["landmarks_processed.csv", "処理後の座標 CSV"],
      ["events.json", "動作イベント JSON"],
      ["metadata.json", "解析条件 JSON"],
      ["analysis.zip", "CSV・JSON一式 ZIP"],
    ]) {
      const a = document.createElement("a");
      a.href = "/motion-lab/sample/" + name;
      a.download = name;
      a.textContent = label;
      $("downloads").append(a);
    }
    $("status").hidden = true;
    $("results").hidden = false;
    draw();
  } catch (e) {
    $("status").textContent =
      "解析データを読み込めませんでした。時間をおいて再読み込みしてください。";
    console.error(e);
  }
}
load();
// Static hosting may omit HTTP byte-range support. A local Blob makes this
// bounded (~4 MB) sample seekable, including in WebKit-based browsers.
let videoBlobUrl;
fetch("/motion-lab/sample/overlay.mp4")
  .then((r) => {
    if (!r.ok) throw Error("video " + r.status);
    return r.blob();
  })
  .then((blob) => {
    videoBlobUrl = URL.createObjectURL(blob);
    $("video").src = videoBlobUrl;
  })
  .catch(() => {
    const p = document.createElement("p");
    p.className = "notice";
    p.textContent = "動画を読み込めませんでした。再読み込みしてください。";
    $("video").after(p);
  });
window.addEventListener("pagehide", (e) => {
  if (!e.persisted && videoBlobUrl) URL.revokeObjectURL(videoBlobUrl);
});
