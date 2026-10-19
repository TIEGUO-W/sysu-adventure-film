export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const DURATION = 1200;

export const C = {
  ink: "#04060B",
  deep: "#061320",
  slate: "#0B2433",
  steel: "#123A4C",
  teal: "#16C7B2",
  mint: "#79E8D3",
  gold: "#F2B138",
  amber: "#FFD68A",
  paper: "#EFF4F2",
  dim: "#8AA3AE",
};

export const FONT = {
  sc: '"Noto Sans SC", sans-serif',
  latin: '"Space Grotesk Variable", "Space Grotesk", sans-serif',
};

/** Scene boundaries in frames. 1200 frames at 30fps = 40s. */
export const SCENES = {
  origin: { from: 0, dur: 132 },
  ridge: { from: 120, dur: 207 },
  many: { from: 315, dur: 207 },
  body: { from: 510, dur: 192 },
  rivers: { from: 690, dur: 237 },
  mark: { from: 915, dur: 162 },
  outro: { from: 1065, dur: 135 },
} as const;

export type SceneKey = keyof typeof SCENES;

/** Chapter HUD labels, index-ordered. */
export const CHAPTERS: { key: SceneKey; index: string; latin: string }[] = [
  { key: "origin", index: "01", latin: "ORIGIN" },
  { key: "ridge", index: "02", latin: "THE CLIMB" },
  { key: "many", index: "03", latin: "TOGETHER" },
  { key: "body", index: "04", latin: "THE BODY" },
  { key: "rivers", index: "05", latin: "THE LAND" },
  { key: "mark", index: "06", latin: "THE NAME" },
  { key: "outro", index: "07", latin: "SET OUT" },
];
