import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";
import { EASE, prog, keys } from "../lib/anim";
import { CharReveal, Eyebrow } from "../components/Type";

const CY = 452;
const SKILLS = ["徒步", "攀岩", "溯溪", "露营", "越野"];

/** QRS-like spike riding on a sine. */
const waveAt = (x: number, frame: number) => {
  const calm = prog(frame, 54, 124, EASE.soft);
  const amp = keys(frame, [[10, 0], [32, 1], [110, 0.88], [150, 0.42], [172, 0.12]]);
  const base = Math.sin((x / 1920) * Math.PI * 10 - frame * 0.11) * 6.5 * calm;
  const d = (x - 940) / 24;
  const qrs =
    -Math.exp(-Math.pow(d / 0.45, 2)) * 0.8 +
    Math.exp(-Math.pow((d - 1.6) / 0.62, 2)) * 1.75 -
    Math.exp(-Math.pow((d - 2.7) / 0.8, 2)) * 0.6 +
    Math.exp(-Math.pow((d + 2.0) / 0.9, 2)) * 0.22 +
    Math.exp(-Math.pow((d - 1.6) / 0.2, 2)) * 0.35;
  return base + qrs * 96 * amp;
};

/** 04 — THE BODY. The pulse is written across the frame, then settles into breath. */
export const SceneBody: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames: dur } = useVideoConfig();
  const bgIn = prog(frame, 0, 18, EASE.out);
  const exit = prog(frame, dur - 16, dur - 3, EASE.in);

  const samples: string[] = [];
  for (let x = 0; x <= 1920; x += 4) samples.push(x + "," + (CY + waveAt(x, frame)).toFixed(2));
  const linePath = "M " + samples.join(" L ");

  const write = prog(frame, 4, 118, EASE.inOut);
  const headX = 40 + 1860 * write;
  const headY = CY + waveAt(headX, frame);

  return (
    <AbsoluteFill style={{ background: "transparent", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: "radial-gradient(58% 40% at 50% 42%, rgba(22,199,178,0.14) 0%, rgba(4,6,11,0) 72%)",
          opacity: bgIn * (1 - exit),
        }}
      />

      {/* breath field */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="writeClip">
            <rect x={0} y={0} width={Math.max(0, headX)} height={1080} />
          </clipPath>
        </defs>
        {Array.from({ length: 7 }).map((_, i) => {
          const p = prog(frame, 2 + i * 3, 34 + i * 3, EASE.out);
          const rx = 240 + i * 118;
          const ry = 96 + i * 46;
          return (
            <ellipse
              key={i}
              cx={960}
              cy={CY}
              rx={rx * (0.55 + 0.45 * p)}
              ry={ry * (0.55 + 0.45 * p)}
              fill="none"
              stroke={"rgba(121,232,211," + (0.15 - i * 0.016).toFixed(3) + ")"}
              strokeWidth={1}
              opacity={p * (1 - exit)}
            />
          );
        })}

        {/* baseline */}
        <line x1={0} y1={CY} x2={1920} y2={CY} stroke="rgba(239,244,242,0.10)" strokeWidth={1} opacity={1 - exit} />

        {/* the written pulse */}
        <g clipPath="url(#writeClip)" opacity={1 - exit}>
          <path d={linePath} fill="none" stroke={C.mint} strokeWidth={2.4} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 10px rgba(121,232,211,0.55))" }} />
        </g>

        {/* playhead */}
        <g opacity={(write > 0.002 && write < 0.999 ? 1 : 0) * (1 - exit)}>
          <line x1={headX} y1={CY - 190} x2={headX} y2={CY + 190} stroke="rgba(242,177,56,0.28)" strokeWidth={1} />
          <circle cx={headX} cy={headY} r={16} fill="none" stroke={C.amber} strokeWidth={1} opacity={0.5} />
          <circle cx={headX} cy={headY} r={5} fill={C.amber} />
          <circle cx={headX} cy={headY} r={2} fill="#FFF6E2" />
        </g>
      </svg>

      {/* skill axis */}
      <div
        style={{
          position: "absolute",
          left: 360,
          top: 686,
          width: 1200,
          height: 1,
          background: "linear-gradient(to right, rgba(239,244,242,0), rgba(239,244,242,0.26), rgba(239,244,242,0))",
          opacity: prog(frame, 88, 112, EASE.out) * (1 - exit),
        }}
      />
      {SKILLS.map((s, i) => {
        const x = 480 + i * 240;
        const p = prog(frame, 92 + i * 6, 120 + i * 6, EASE.out);
        return (
          <div key={s} style={{ position: "absolute", left: x, top: 700, translate: "-50% 0px", opacity: p * (1 - exit) }}>
            <div
              style={{
                fontFamily: FONT.sc,
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: 7,
                color: C.paper,
                opacity: 0.9,
                whiteSpace: "nowrap",
                translate: "0px " + ((1 - p) * 10).toFixed(2) + "px",
              }}
            >
              {s}
            </div>
          </div>
        );
      })}

      <div style={{ position: "absolute", left: 0, right: 0, top: 118, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Eyebrow text="CHAPTER 04 / THE BODY" from={18} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 806, display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - exit }}>
        <CharReveal text="强健的，不只是身体" from={116} size={70} weight={900} letterSpacing={7} />
        <div style={{ height: 16 }} />
        <CharReveal text="是敢往深处走的底气" from={138} size={34} weight={400} letterSpacing={14} color={C.amber} blur={8} />
      </div>

    </AbsoluteFill>
  );
};
