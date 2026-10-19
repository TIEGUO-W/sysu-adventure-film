import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";
import { EASE, prog } from "../lib/anim";
import { mulberry32 } from "../lib/rng";
import { ridgePoints, smoothPath, closeToFloor, mountainAltitude, type Pt } from "../lib/paths";
import { CharReveal, Eyebrow } from "../components/Type";

type Layer = {
  base: number;
  amp: number;
  freq: number;
  seed: number;
  top: string;
  bottom: string;
  stroke: string;
  strokeW: number;
  parallax: number;
  altitude?: { height: number; shift?: number; scaleX?: number };
  steps: number;
  haze?: string;
};

const LAYERS: Layer[] = [
  { base: 664, amp: 0, freq: 1, seed: 11, top: "#2E7E90", bottom: "#14425A", stroke: "rgba(170,244,232,0.34)", strokeW: 1.2, parallax: 6, altitude: { height: 292, shift: -260, scaleX: 1.3 }, steps: 180, haze: "rgba(44,124,142,0.14)" },
  { base: 776, amp: 0, freq: 1, seed: 23, top: "#1C5F76", bottom: "#0B2A3C", stroke: "rgba(150,238,224,0.28)", strokeW: 1.2, parallax: 20, altitude: { height: 372, shift: 150, scaleX: 1.14 }, steps: 200, haze: "rgba(26,92,114,0.18)" },
  { base: 900, amp: 0, freq: 1, seed: 37, top: "#0E3A50", bottom: "#051520", stroke: "rgba(22,199,178,0.30)", strokeW: 1.1, parallax: 42, altitude: { height: 436, shift: -70, scaleX: 1.0 }, steps: 220, haze: "rgba(13,50,68,0.3)" },
  { base: 1030, amp: 0, freq: 1, seed: 53, top: "#05080F", bottom: "#04060B", stroke: "rgba(242,177,56,0.45)", strokeW: 1.6, parallax: 72, altitude: { height: 512, shift: 0, scaleX: 1.0 }, steps: 260 },
];

const STARS = (() => {
  const rnd = mulberry32(9271);
  return Array.from({ length: 170 }).map(() => ({
    x: rnd() * 1920,
    y: rnd() * 520,
    r: 0.5 + rnd() * 1.5,
    phase: rnd() * Math.PI * 2,
    speed: 0.02 + rnd() * 0.05,
    bright: 0.25 + rnd() * 0.7,
  }));
})();

const TRAIL: Pt[] = (() => {
  const pts: Pt[] = [];
  const steps = 64;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = 196 + t * 1266;
    const y = 1032 - t * 518 + Math.sin(t * Math.PI * 3.4) * 28 * (1 - t * 0.3);
    pts.push({ x, y });
  }
  return pts;
})();

/** 02 — THE CLIMB. Ridgelines are drawn stroke-first, then filled, under a rising sun. */
export const SceneRidge: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames: dur } = useVideoConfig();

  const bgIn = prog(frame, 0, 22, EASE.expo);
  const sunP = prog(frame, 8, 78, EASE.expo);
  const sunY = 690 - sunP * 104;
  const trailP = prog(frame, 74, 168, EASE.soft);
  const exit = prog(frame, dur - 16, dur - 3, EASE.in);

  return (
    <AbsoluteFill style={{ background: "transparent", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: "linear-gradient(to bottom, #04060B 0%, #061320 38%, #0A2130 64%, #123544 84%, #17414F 100%)",
          opacity: bgIn * (1 - exit),
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(24% 20% at 1462px " + sunY + "px, rgba(242,177,56,0.30) 0%, rgba(4,6,11,0) 70%)",
          opacity: sunP * (1 - exit),
        }}
      />

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {STARS.map((s, i) => {
          const tw = 0.45 + 0.55 * Math.sin(frame * s.speed + s.phase);
          const appear = prog(frame, 2 + (i % 40) * 1.1, 22 + (i % 40) * 1.1, EASE.out);
          return <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={C.paper} opacity={appear * tw * s.bright * (1 - exit)} />;
        })}
      </svg>

      <div
        style={{
          position: "absolute",
          left: 1462,
          top: sunY,
          width: 240,
          height: 240,
          translate: "-120px -120px",
          borderRadius: 999,
          background: "radial-gradient(circle, rgba(255,214,138,0.50) 0%, rgba(242,177,56,0.10) 48%, rgba(242,177,56,0) 70%)",
          opacity: sunP * (1 - exit),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 1462,
          top: sunY,
          width: 54,
          height: 54,
          translate: "-27px -27px",
          borderRadius: 999,
          background: "radial-gradient(circle, #FFF8E8 0%, #FFDA9A 60%, rgba(255,214,138,0) 100%)",
          boxShadow: "0 0 46px 5px rgba(242,177,56,0.4)",
          opacity: sunP * (1 - exit),
        }}
      />

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          {LAYERS.map((L) => (
            <linearGradient key={L.seed} id={"rg" + L.seed} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={L.top} />
              <stop offset="100%" stopColor={L.bottom} />
            </linearGradient>
          ))}
        </defs>
        {LAYERS.map((L) => {
          const drawP = prog(frame, 6, 64 + L.seed * 0.1, EASE.inOut);
          const fillP = prog(frame, 40, 96, EASE.soft);
          const dx = -L.parallax * (frame / 195);
          const pts = ridgePoints({
            x0: -140,
            x1: 2060,
            base: L.base,
            amp: L.amp,
            freq: L.freq,
            seed: L.seed,
            altitude: L.altitude
              ? { fn: (x: number) => mountainAltitude(x, { shift: L.altitude!.shift, scaleX: L.altitude!.scaleX }), height: L.altitude.height }
              : undefined,
            steps: L.steps,
          });
          const d = smoothPath(pts);
          const filled = closeToFloor(d, 2060, 1220, -140);
          return (
            <g key={L.seed} transform={"translate(" + dx.toFixed(2) + ",0)"}>
              <path d={filled} fill={"url(#rg" + L.seed + ")"} opacity={fillP * (1 - exit)} />
              <path d={d} fill="none" stroke={L.stroke} strokeWidth={L.strokeW} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - drawP} strokeLinecap="round" opacity={(1 - exit) * fillP} />
            </g>
          );
        })}
      </svg>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {TRAIL.map((p, i) => {
          const local = i / (TRAIL.length - 1);
          const on = trailP > local;
          const head = Math.max(0, 1 - Math.abs(trailP - local) * 26);
          return (
            <circle key={i} cx={p.x} cy={p.y} r={on ? 1.6 + head * 2.2 : 0} fill={head > 0.25 ? C.amber : C.mint} opacity={(on ? 0.8 : 0) * (1 - exit)} />
          );
        })}
      </svg>

      {/* type scrim so the copy never fights the ridgeline */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(58% 46% at 26% 30%, rgba(4,6,11,0.92) 0%, rgba(4,6,11,0.55) 46%, rgba(4,6,11,0) 78%)",
          opacity: prog(frame, 140, 172, EASE.out) * (1 - exit),
        }}
      />

      <div style={{ position: "absolute", left: 180, top: 210, opacity: 1 - exit }}>
        <Eyebrow text="CHAPTER 02 / THE CLIMB" from={40} />
        <div style={{ height: 30 }} />
        <CharReveal text="因为热爱" from={148} size={104} weight={900} letterSpacing={6} />
        <div style={{ height: 6 }} />
        <CharReveal text="所以向高处去" from={162} size={104} weight={900} letterSpacing={6} color={C.amber} />
        <div
          style={{
            marginTop: 26,
            fontFamily: FONT.latin,
            fontSize: 16,
            fontWeight: 500,
            letterSpacing: "0.42em",
            color: "rgba(239,244,242,0.62)",
            opacity: prog(frame, 178, 200, EASE.out),
          }}
        >
          BECAUSE WE LOVE IT
        </div>
      </div>

    </AbsoluteFill>
  );
};
