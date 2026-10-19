import { fbm1, clamp, lerp } from "./rng";

export type Pt = { x: number; y: number };

/** Densely sample a ridge silhouette across [x0,x1]. */
export const ridgePoints = (opts: {
  x0: number;
  x1: number;
  base: number;
  amp: number;
  freq: number;
  seed: number;
  peak?: { x: number; height: number; width: number };
  /** When set, the silhouette is driven by this altitude function instead of fbm. */
  altitude?: { fn: (x: number) => number; height: number };
  steps?: number;
}): Pt[] => {
  const steps = opts.steps ?? 96;
  const out: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = lerp(opts.x0, opts.x1, i / steps);
    const n = fbm1((x / 1920) * opts.freq * 6, 5, opts.seed);
    let y = opts.altitude
      ? opts.base - opts.altitude.fn(x) * opts.altitude.height
      : opts.base - (n - 0.5) * 2 * opts.amp;
    if (opts.peak) {
      const d = (x - opts.peak.x) / opts.peak.width;
      y -= opts.peak.height * Math.exp(-d * d);
    }
    out.push({ x, y });
  }
  return out;
};

/** Smooth SVG path through points using midpoint quadratics. */
export const smoothPath = (pts: Pt[]) => {
  if (pts.length < 2) return "";
  let d = "M " + pts[0].x.toFixed(2) + " " + pts[0].y.toFixed(2);
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2;
    const my = (pts[i].y + pts[i + 1].y) / 2;
    d += " Q " + pts[i].x.toFixed(2) + " " + pts[i].y.toFixed(2) + " " + mx.toFixed(2) + " " + my.toFixed(2);
  }
  const last = pts[pts.length - 1];
  d += " L " + last.x.toFixed(2) + " " + last.y.toFixed(2);
  return d;
};

/** Close a ridge into a filled shape down to `floor`. */
export const closeToFloor = (d: string, x1: number, floor: number, x0: number) =>
  d + " L " + x1.toFixed(2) + " " + floor + " L " + x0.toFixed(2) + " " + floor + " Z";

/** The film's signature skyline: three summits, sharp valleys. Returns a 0..1 altitude. */
export const mountainAltitude = (x: number, opts: { shift?: number; scaleX?: number } = {}) => {
  const xx = (x - (opts.shift ?? 0)) * (opts.scaleX ?? 1);
  // px, peak height, half-width, skew (left slope steeper when > 1)
  const peaks: [number, number, number, number][] = [
    [398, 0.78, 322, 1.42],
    [1004, 0.52, 218, 1.18],
    [1470, 1.0, 312, 1.55],
  ];
  let h = 0;
  for (const [px, ph, pw, skew] of peaks) {
    const d = (xx - px) / pw;
    const dd = d < 0 ? d / skew : d * skew;
    h = Math.max(h, ph * Math.pow(Math.max(0, 1 - Math.abs(dd)), 1.28));
  }
  const detail = (fbm1((xx / 1920) * 15, 4, 9) - 0.5) * 0.13;
  const crest = (fbm1((xx / 1920) * 5.5, 3, 31) - 0.5) * 0.09;
  return clamp(h * 0.97 + detail * clamp(h * 3) + crest * clamp(h * 2));
};

/** Wobbly closed contour ring, used for topographic fields. */
export const contourRing = (opts: {
  cx: number;
  cy: number;
  r: number;
  wobble: number;
  seed: number;
  steps?: number;
  squash?: number;
  rotation?: number;
}): Pt[] => {
  const steps = opts.steps ?? 140;
  const pts: Pt[] = [];
  const rot = opts.rotation ?? 0;
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const n =
      fbm1(i / 9 + Math.cos(a) * 1.4, 4, opts.seed) * 0.6 +
      fbm1(i / 3.1 + Math.sin(a) * 1.4, 3, opts.seed + 21) * 0.4;
    const r = opts.r * (1 + (n - 0.5) * opts.wobble);
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r * (opts.squash ?? 1);
    pts.push({
      x: opts.cx + x * Math.cos(rot) - y * Math.sin(rot),
      y: opts.cy + x * Math.sin(rot) + y * Math.cos(rot),
    });
  }
  return pts;
};

export const ringPath = (pts: Pt[]) => {
  if (pts.length < 3) return "";
  let d = "M " + pts[0].x.toFixed(2) + " " + pts[0].y.toFixed(2);
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[i];
    const p1 = pts[(i + 1) % pts.length];
    const mx = (p0.x + p1.x) / 2;
    const my = (p0.y + p1.y) / 2;
    d += " Q " + p0.x.toFixed(2) + " " + p0.y.toFixed(2) + " " + mx.toFixed(2) + " " + my.toFixed(2);
  }
  return d + " Z";
};
