import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";
import { EASE, prog, keys } from "../lib/anim";
import { contourRing, ringPath } from "../lib/paths";
import { CharReveal, Eyebrow } from "../components/Type";

const RINGS = 18;

/** 05 — THE LAND. A topographic field rotates while the four characters settle into it. */
export const SceneRivers: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames: dur } = useVideoConfig();
  const bgIn = prog(frame, 0, 14, EASE.expo);
  const rot = (frame / 225) * 0.16;
  const exit = prog(frame, dur - 18, dur - 3, EASE.in);
  const collapse = prog(frame, dur - 18, dur - 3, EASE.in);
  const sweep = prog(frame, 132, 176, EASE.inOut);

  return (
    <AbsoluteFill style={{ background: "transparent", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: "linear-gradient(to bottom, #050B14 0%, #071722 46%, #0C2634 78%, #12343F 100%)",
          opacity: bgIn * (1 - exit),
        }}
      />

      {/* dawn */}
      <div
        style={{
          position: "absolute",
          left: 1290,
          top: 470,
          width: 560,
          height: 560,
          translate: "-280px -280px",
          borderRadius: 999,
          background: "radial-gradient(circle, rgba(255,214,138,0.30) 0%, rgba(242,177,56,0.12) 34%, rgba(242,177,56,0.04) 56%, rgba(4,6,11,0) 74%)",
          filter: "blur(24px)",
          opacity: prog(frame, 10, 70, EASE.expo) * (1 - exit),
        }}
      />

      {/* contour field */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g style={{ opacity: bgIn }}>
          {Array.from({ length: RINGS }).map((_, i) => {
            const r = 96 + i * 62;
            const wob = 0.12 + i * 0.004;
            const pts = contourRing({
              cx: 960,
              cy: 560,
              r: r * (1 - collapse * 0.62),
              wobble: wob,
              seed: 100 + i * 7.3,
              steps: 96,
              squash: 0.78,
              rotation: rot + i * 0.045,
            });
            const t = i / (RINGS - 1);
            const stroke = "rgba(" + Math.round(22 + t * 220) + "," + Math.round(150 + t * 27) + "," + Math.round(170 - t * 60) + "," + (0.30 - t * 0.16).toFixed(3) + ")";
            const p = prog(frame, 1 + i * 1.7, 30 + i * 1.7, EASE.out);
            return <path key={i} d={ringPath(pts)} fill="none" stroke={stroke} strokeWidth={i % 4 === 0 ? 1.5 : 1} opacity={p * (1 - exit * 0.4)} />;
          })}
        </g>
      </svg>

      {/* technical grid */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: bgIn * 0.5 * (1 - collapse) }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={"v" + i} x1={i * 240} y1={0} x2={i * 240} y2={1080} stroke="rgba(239,244,242,0.045)" strokeWidth={1} />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={"h" + i} x1={0} y1={i * 240} x2={1920} y2={i * 240} stroke="rgba(239,244,242,0.045)" strokeWidth={1} />
        ))}
      </svg>

      {/* the four characters */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - exit }}>
        <div style={{ position: "relative" }}>
          <CharReveal text="名山大川" from={40} size={196} weight={900} letterSpacing={38} blur={22} />

        </div>
        <div style={{ height: 34 }} />
        <CharReveal text="从此，有了我们的脚印" from={128} size={42} weight={300} letterSpacing={14} color={C.paper} blur={10} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 214, display: "flex", justifyContent: "center", opacity: 1 - exit }}>
        <Eyebrow text="CHAPTER 05 / THE LAND" from={22} />
      </div>

      {/* measuring rule */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 706,
          height: 1,
          width: 720 * prog(frame, 108, 158, EASE.expo),
          translate: "-50% 0px",
          background: "linear-gradient(to right, rgba(242,177,56,0), rgba(242,177,56,0.7), rgba(242,177,56,0))",
        }}
      />

      {/* travelling light band — a single motion-graphics flourish across the frame */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(96deg, rgba(255,238,205,0) 43%, rgba(255,238,205,0.30) 50%, rgba(255,238,205,0) 57%)",
          backgroundSize: "260% 100%",
          backgroundPosition: (160 - sweep * 160).toFixed(2) + "% 0%",
          mixBlendMode: "screen",
          opacity: sweep > 0 && sweep < 1 ? 1 : 0,
        }}
      />

    </AbsoluteFill>
  );
};
