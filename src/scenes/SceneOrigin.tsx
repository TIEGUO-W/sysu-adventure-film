import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { EASE, prog, springOut } from "../lib/anim";
import { clamp } from "../lib/rng";
import { CharReveal, Eyebrow } from "../components/Type";

const LINE_X = 1400;
const TOP_Y = 130;
const START_Y = 780;

/** 01 — ORIGIN. A single ember rises, then draws the first vertical line of the film. */
export const SceneOrigin: React.FC = () => {
  const frame = useCurrentFrame();

  const lineGrow = prog(frame, 12, 62, EASE.expo);
  const lineTop = START_Y + (TOP_Y - START_Y) * lineGrow;

  // the ember travels up the line, then halts and blooms
  const travel = prog(frame, 58, 104, EASE.inOut);
  const emberY = START_Y + (TOP_Y - START_Y) * travel;
  const emberIn = springOut(clamp((frame - 4) / 30), 6, 1.6);
  const bloom = prog(frame, 98, 120, EASE.out);
  const pulseGlow = 0.55 + 0.45 * Math.sin(frame * 0.18);

  const titleOut = prog(frame, 96, 118, EASE.in);

  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      {/* deep field gradient that warms as the ember climbs */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(58% 46% at " + LINE_X + "px " + START_Y + "px, rgba(242,177,56," +
            (0.05 + 0.1 * travel) +
            ") 0%, rgba(4,6,11,0) 62%)",
        }}
      />

      {/* altimeter ticks along the line */}
      {Array.from({ length: 13 }).map((_, i) => {
        const y = START_Y - i * 52;
        const p = prog(frame, 20 + i * 2.1, 40 + i * 2.1, EASE.out);
        const seen = y > lineTop - 4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: LINE_X,
              top: y,
              height: 1,
              width: (i % 4 === 0 ? 26 : 12) * p,
              background: C.paper,
              opacity: seen ? 0.16 + (i % 4 === 0 ? 0.14 : 0) : 0,
              translate: "-1px 0px",
            }}
          />
        );
      })}

      {/* the rising line */}
      <div
        style={{
          position: "absolute",
          left: LINE_X,
          top: lineTop,
          width: 1,
          height: Math.max(0, START_Y - lineTop),
          background: "linear-gradient(to bottom, rgba(239,244,242,0.05), rgba(239,244,242,0.55))",
          translate: "-0.5px 0px",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: LINE_X,
          top: emberY - 90,
          width: 2,
          height: 90,
          background: "linear-gradient(to top, rgba(242,177,56,0), rgba(242,177,56,0.7))",
          translate: "-1px 0px",
          opacity: 0.5 * emberIn,
        }}
      />

      {/* ember */}
      <div
        style={{
          position: "absolute",
          left: LINE_X,
          top: emberY,
          width: 10,
          height: 10,
          translate: "-5px -5px",
          borderRadius: 999,
          background: C.amber,
          scale: (0.5 + 0.5 * emberIn) * (1 + 0.16 * pulseGlow) * (1 + bloom * 2.2),
          boxShadow:
            "0 0 " + (18 + 26 * bloom + 8 * pulseGlow) + "px rgba(242,177,56," + (0.75 * emberIn) + "), 0 0 " +
            (60 + 90 * bloom) + "px rgba(242,177,56," + (0.3 * emberIn) + ")",
          opacity: emberIn,
        }}
      />

      {/* text block */}
      <div
        style={{
          position: "absolute",
          left: 180,
          top: 372,
          opacity: 1 - titleOut,
          translate: "0px " + (-10 * titleOut).toFixed(2) + "px",
        }}
      >
        <Eyebrow text="CHAPTER 01 / ORIGIN" from={26} />
        <div style={{ height: 34 }} />
        <CharReveal text="我们为什么" from={36} size={112} weight={900} letterSpacing={6} />
        <div style={{ height: 8 }} />
        <CharReveal text="出发" from={50} size={112} weight={900} letterSpacing={6} color={C.gold} />
      </div>

      {/* latin subtitle */}
      <div
        style={{
          position: "absolute",
          left: 184,
          top: 712,
          fontFamily: FONT.latin,
          fontSize: 17,
          fontWeight: 500,
          letterSpacing: "0.44em",
          color: C.dim,
          opacity: prog(frame, 66, 92, EASE.out) * (1 - titleOut),
          translate: "0px " + ((1 - prog(frame, 66, 92, EASE.out)) * 8).toFixed(2) + "px",
        }}
      >
        WHY DO WE SET OUT
      </div>

      {/* closing flare that hands off to the climb */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(34% 26% at " + LINE_X + "px " + TOP_Y + "px, rgba(255,214,138," + 0.55 * bloom + ") 0%, rgba(4,6,11,0) 70%)",
          opacity: bloom,
        }}
      />
    </AbsoluteFill>
  );
};
