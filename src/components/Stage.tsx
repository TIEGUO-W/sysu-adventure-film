import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, staticFile } from "remotion";
import { C, FONT } from "../theme";
import { prog, EASE } from "../lib/anim";


/** Animated film grain. Fixed per-frame offset so it never shimmers in place. */
export const Grain: React.FC<{ opacity?: number; size?: number }> = ({ opacity = 0.3, size = 640 }) => {
  const frame = useCurrentFrame();
  // Slow drift rather than per-frame randomness: it reads as film grain on screen
  // while staying temporally coherent enough for the encoder to compress.
  const ox = Math.floor(frame * 3 + Math.sin(frame * 0.09) * 18) % size;
  const oy = Math.floor(frame * 2 + Math.cos(frame * 0.07) * 14) % size;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: "url(" + staticFile("grain.png") + ")",
        backgroundRepeat: "repeat",
        backgroundSize: size,
        backgroundPosition: ox + "px " + oy + "px",
        opacity,
        mixBlendMode: "soft-light",
        pointerEvents: "none",
      }}
    />
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(120% 85% at 50% 46%, rgba(0,0,0,0) 38%, rgba(0,0,0," +
        0.5 * strength +
        ") 78%, rgba(0,0,0," +
        0.86 * strength +
        ") 100%)",
      pointerEvents: "none",
    }}
  />
);

/** Soft darkening at the very edges, cinematic letterbox breathing. */
export const Edges: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(to bottom, rgba(2,4,8,0.55) 0%, rgba(2,4,8,0) 14%, rgba(2,4,8,0) 86%, rgba(2,4,8,0.6) 100%)",
      pointerEvents: "none",
    }}
  />
);

/** The global camera: one continuous, very slow push across the whole film. */
export const Camera: React.FC<{ children: React.ReactNode; scaleTo?: number }> = ({
  children,
  scaleTo = 1.045,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = prog(frame, 0, durationInFrames, EASE.linear);
  return (
    <AbsoluteFill
      style={{
        scale: 1 + (scaleTo - 1) * p,
        translate: "0px " + (-14 * p).toFixed(2) + "px",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Chapter index in the lower-left corner. */
export const Chapter: React.FC<{
  index: string;
  latin: string;
  from: number;
  to: number;
  align?: "left" | "right";
}> = ({ index, latin, from, to, align = "left" }) => {
  const frame = useCurrentFrame();
  const inP = prog(frame, from + 6, from + 26, EASE.out);
  const outP = prog(frame, to - 19, to - 3, EASE.in);
  const o = (inP - outP) * 0.62;
  if (o <= 0.001) return null;
  const x = align === "left" ? 96 : 1920 - 96;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 66,
        left: align === "left" ? x : undefined,
        right: align === "right" ? 96 : undefined,
        display: "flex",
        alignItems: "baseline",
        gap: 14,
        opacity: o,
        translate: "0px " + ((1 - inP) * 10).toFixed(2) + "px",
        fontFamily: FONT.latin,
        color: C.paper,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.22em", color: C.gold }}>{index}</span>
      <span style={{ width: 34, height: 1, background: "rgba(239,244,242,0.35)", display: "inline-block", translate: "0px -4px" }} />
      <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: "0.34em", opacity: 0.72 }}>{latin}</span>
    </div>
  );
};
