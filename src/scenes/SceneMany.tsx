import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";
import { EASE, prog } from "../lib/anim";
import { mulberry32, clamp } from "../lib/rng";
import { mountainAltitude } from "../lib/paths";
import { CharReveal, Eyebrow } from "../components/Type";

const FLOOR = 1014;
const RISE = 476;

type Dot = {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  r: number;
  delay: number;
  arc: number;
  tone: number;
  edge: number;
};

const DOTS: Dot[] = (() => {
  const rnd = mulberry32(4417);
  const out: Dot[] = [];
  for (let i = 0; i < 1150; i++) {
    const tx = 120 + rnd() * 1680;
    const alt = mountainAltitude(tx);
    const topY = FLOOR - alt * RISE;
    // Dense along the silhouette line, thinning toward the base: it must read as a range, not a cloud.
    const depth = Math.pow(rnd(), 3.1) * (FLOOR - topY) * 0.82;
    const ty = topY + depth;
    const edge = 1 - clamp(depth / 140);
    const a = rnd() * Math.PI * 2;
    const rad = 1180 + rnd() * 820;
    out.push({
      sx: 960 + Math.cos(a) * rad,
      sy: 520 + Math.sin(a) * rad * 0.66,
      tx,
      ty,
      r: 1.3 + rnd() * 1.7 + edge * 1.1,
      delay: (tx / 1920) * 44 + rnd() * 12,
      arc: (rnd() - 0.5) * 170,
      tone: rnd(),
      edge,
    });
  }
  return out;
})();

/** 03 — TOGETHER. Individual points converge into one mountain. */
export const SceneMany: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames: dur } = useVideoConfig();
  const bgIn = prog(frame, 0, 18, EASE.out);
  const wave = prog(frame, 128, 180, EASE.inOut);
  const bandX = -460 + (1920 + 920) * wave;
  const exit = prog(frame, dur - 16, dur - 3, EASE.in);

  return (
    <AbsoluteFill style={{ background: "transparent", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: "radial-gradient(64% 52% at 52% 72%, rgba(22,199,178,0.16) 0%, rgba(4,6,11,0) 68%)",
          opacity: bgIn * (1 - exit),
        }}
      />

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {DOTS.map((d, i) => {
          const p = prog(frame, d.delay, d.delay + 36, EASE.out);
          const x = d.sx + (d.tx - d.sx) * p;
          const y = d.sy + (d.ty - d.sy) * p + Math.sin(p * Math.PI) * d.arc;
          const glow = Math.exp(-Math.pow((d.tx - bandX) / 190, 2)) * wave;
          const settle = 0.34 + 0.66 * d.edge;
          const op = p * (settle * 0.9 + glow * 0.55 + d.tone * 0.2);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={d.r * (1 + glow * 1.7)}
              fill={glow > 0.36 ? C.amber : d.tone > 0.86 ? C.mint : C.paper}
              opacity={clamp(op, 0, 1) * (1 - exit)}
            />
          );
        })}
      </svg>



      <div style={{ position: "absolute", left: 0, right: 0, top: 246, display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - exit }}>
        <CharReveal text="一个人，是一个点" from={62} size={84} weight={900} letterSpacing={10} />
        <div style={{ height: 10 }} />
        <CharReveal text="我们，是一整座山" from={96} size={84} weight={900} letterSpacing={10} color={C.amber} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 148, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Eyebrow text="CHAPTER 03 / TOGETHER" from={44} />
      </div>

    </AbsoluteFill>
  );
};
