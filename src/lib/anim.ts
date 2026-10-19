import { Easing, interpolate } from "remotion";
import { clamp } from "./rng";

export const EASE = {
  /** Long, decelerating settle — the house default for reveals. */
  out: Easing.bezier(0.16, 1, 0.3, 1),
  /** Very long tail, for camera and light moves. */
  expo: Easing.bezier(0.19, 1, 0.22, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.55, 0, 0.85, 0.3),
  soft: Easing.bezier(0.33, 1, 0.68, 1),
  linear: Easing.linear,
};

export type EaseFn = (input: number) => number;

/** Normalised 0..1 progress between two frames. */
export const prog = (frame: number, from: number, to: number, easing: EaseFn = EASE.out) =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Multi-stop scalar interpolation with a single easing across segments. */
export const keys = (frame: number, stops: number[][], easing: EaseFn = EASE.out) =>
  interpolate(frame, stops.map((s) => s[0]), stops.map((s) => s[1]), {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Linear 0..1 without easing. */
export const lin = (frame: number, from: number, to: number) =>
  clamp((frame - from) / Math.max(1e-6, to - from));

/** In/out envelope: ramps in over `fade`, holds, ramps out. */
export const envelope = (frame: number, from: number, to: number, fade = 10) =>
  Math.min(clamp((frame - from) / fade), clamp((to - frame) / fade));

/** Staggered item progress. */
export const stagger = (frame: number, start: number, i: number, gap: number, dur = 16, easing: EaseFn = EASE.out) =>
  prog(frame, start + i * gap, start + i * gap + dur, easing);

/** Closed-form overshoot spring: 0 at p=0, settles on 1. */
export const springOut = (p: number, damping = 7, freq = 2.4) => {
  const t = clamp(p);
  return 1 - Math.exp(-damping * t) * Math.cos(freq * Math.PI * t);
};

/** Symmetric pulse in 0..1 range peaking at 0.5 of the window. */
export const pulse = (frame: number, from: number, to: number) => {
  const p = lin(frame, from, to);
  return Math.sin(p * Math.PI);
};
