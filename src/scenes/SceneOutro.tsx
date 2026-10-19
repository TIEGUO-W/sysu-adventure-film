import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { EASE, prog } from "../lib/anim";
import { CharReveal } from "../components/Type";

/** 07 — SET OUT. Tagline, call to action, fade. */
export const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const out = prog(frame, 112, 135, EASE.inOut);
  const horizon = prog(frame, 0, 40, EASE.expo);

  return (
    <AbsoluteFill style={{ background: "transparent", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: "radial-gradient(60% 50% at 50% 86%, rgba(242,177,56,0.16) 0%, rgba(4,6,11,0) 62%)",
          opacity: horizon,
        }}
      />

      {/* horizon line */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 880,
          height: 1,
          width: 1600 * horizon,
          translate: "-50% 0px",
          background: "linear-gradient(to right, rgba(239,244,242,0), rgba(239,244,242,0.22), rgba(239,244,242,0))",
        }}
      />

      <div style={{ position: "absolute", left: 0, right: 0, top: 306, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <CharReveal text="去更高的地方" from={12} size={104} weight={900} letterSpacing={14} />
        <div style={{ height: 8 }} />
        <CharReveal text="看更远的世界" from={24} size={104} weight={900} letterSpacing={14} color={C.amber} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 588, display: "flex", justifyContent: "center" }}>
        <div style={{ height: 1, width: 90 * prog(frame, 44, 74, EASE.expo), background: "rgba(242,177,56,0.8)" }} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 640,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          opacity: prog(frame, 56, 84, EASE.out),
          translate: "0px " + ((1 - prog(frame, 56, 84, EASE.out)) * 14).toFixed(2) + "px",
        }}
      >
        <div style={{ fontFamily: FONT.sc, fontSize: 46, fontWeight: 700, color: C.paper, letterSpacing: 18, paddingLeft: 18 }}>加入我们</div>
        <div style={{ fontFamily: FONT.latin, fontSize: 15, fontWeight: 500, letterSpacing: "0.42em", color: "rgba(239,244,242,0.55)" }}>
          SYSU ADVENTURE ASSOCIATION · JOIN US
        </div>
      </div>

      <AbsoluteFill style={{ background: "#000", opacity: out }} />
    </AbsoluteFill>
  );
};
