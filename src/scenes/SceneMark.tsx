import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";
import { EASE, prog, springOut } from "../lib/anim";
import { clamp } from "../lib/rng";
import { contourRing, ringPath } from "../lib/paths";

const CX = 960;
const CY = 396;

/** 06 — THE NAME. A summit badge is drawn, the wordmark assembles, the rule lands. */
export const SceneMark: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames: dur } = useVideoConfig();
  const ring = prog(frame, 2, 44, EASE.inOut);
  const peak = prog(frame, 16, 62, EASE.inOut);
  const sealRot = (frame / 150) * 26;
  const pop = springOut(clamp((frame - 4) / 30), 6.5, 2.0);

  const spacing = 26 - 22 * prog(frame, 34, 78, EASE.expo);
  const markIn = prog(frame, 30, 54, EASE.out);
  const latinIn = prog(frame, 62, 88, EASE.out);
  const ruleIn = prog(frame, 82, 124, EASE.expo);
  const exit = prog(frame, dur - 16, dur - 3, EASE.in);

  const ringR = 146;
  const circ = 2 * Math.PI * ringR;

  return (
    <AbsoluteFill style={{ background: "transparent", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: "radial-gradient(40% 44% at 50% 40%, rgba(242,177,56,0.13) 0%, rgba(4,6,11,0) 66%)",
          opacity: prog(frame, 0, 40, EASE.out) * (1 - exit),
        }}
      />

      {/* badge */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(22% 22% at 50% 37%, rgba(242,177,56,0.10) 0%, rgba(4,6,11,0) 70%)",
          opacity: prog(frame, 10, 60, EASE.out) * (1 - exit),
        }}
      />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: prog(frame, 0, 70, EASE.out) }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <path
            key={i}
            d={ringPath(
              contourRing({
                cx: CX,
                cy: 470,
                r: 300 + i * 96,
                wobble: 0.16 + i * 0.012,
                seed: 7 + i * 5.1,
                steps: 150,
                squash: 0.66,
                rotation: 0.08 + i * 0.04 + frame * 0.0009,
              }),
            )}
            fill="none"
            stroke="rgba(239,244,242,0.055)"
            strokeWidth={1}
          />
        ))}
      </svg>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g transform={"translate(" + CX + "," + CY + ")"} opacity={1 - exit}>
          <circle r={ringR} fill="none" stroke="rgba(242,177,56,0.75)" strokeWidth={1.6} strokeDasharray={circ} strokeDashoffset={circ * (1 - ring)} />
          <circle
            r={ringR + 13}
            fill="none"
            stroke="rgba(239,244,242,0.30)"
            strokeWidth={1}
            transform={"rotate(" + sealRot % 360 + ")"}
            strokeDasharray="2 10"
            opacity={ring}
          />
          {/* summit glyph: two peaks and a rising sun */}
          <path
            d="M -62 40 L -16 -30 L 12 10 L 34 -16 L 66 40 Z"
            fill="none"
            stroke={C.paper}
            strokeWidth={2.4}
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - peak}
            opacity={peak}
          />
          <circle cx={34} cy={-16} r={6} fill={C.amber} opacity={peak * (0.6 + 0.4 * pop)} />
        </g>
      </svg>

      {/* wordmark */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: CY + 196,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONT.sc,
            fontSize: 92,
            fontWeight: 900,
            color: C.paper,
            letterSpacing: spacing,
            opacity: markIn * (1 - exit),
            clipPath: "inset(0px 0px " + (1 - markIn) * 100 + "% 0px)",
            translate: "0px " + ((1 - markIn) * 26).toFixed(2) + "px",
            whiteSpace: "nowrap",
            paddingLeft: spacing,
          }}
        >
          中山大学探险协会
        </div>
      </div>

      {/* latin lockup */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: CY + 320,
          display: "flex",
          justifyContent: "center",
          fontFamily: FONT.latin,
          fontSize: 15,
          fontWeight: 500,
          letterSpacing: "0.36em",
          color: "rgba(239,244,242,0.62)",
          opacity: latinIn * (1 - exit),
          translate: "0px " + ((1 - latinIn) * 10).toFixed(2) + "px",
        }}
      >
        SUN YAT-SEN UNIVERSITY ADVENTURE ASSOCIATION
      </div>

      {/* the rule that lands */}
      <div
        style={{
          position: "absolute",
          left: CX,
          top: CY + 378,
          height: 1,
          width: 460 * ruleIn,
          translate: "-50% 0px",
          background: "linear-gradient(to right, rgba(242,177,56,0), " + C.gold + " 50%, rgba(242,177,56,0))",
          opacity: 0.9 * (1 - exit),
        }}
      />

    </AbsoluteFill>
  );
};
