import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { prog, EASE, springOut } from "../lib/anim";
import { clamp } from "../lib/rng";

/** Per-character spring reveal with optional blur-in. */
export const CharReveal: React.FC<{
  text: string;
  from: number;
  stagger?: number;
  size?: number;
  weight?: number;
  color?: string;
  letterSpacing?: number;
  style?: React.CSSProperties;
  blur?: number;
}> = ({
  text,
  from,
  stagger = 2,
  size = 96,
  weight = 900,
  color = C.paper,
  letterSpacing = 4,
  style,
  blur = 14,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        fontFamily: FONT.sc,
        fontSize: size,
        fontWeight: weight,
        color,
        letterSpacing,
        lineHeight: 1.12,
        ...style,
      }}
    >
      {Array.from(text).map((ch, i) => {
        const p = springOut(clamp((frame - from - i * stagger) / 26), 7.5, 2.2);
        const fade = prog(frame, from + i * stagger, from + i * stagger + 14, EASE.out);
        if (ch === " ") return <span key={i} style={{ width: size * 0.32 }} />;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: fade,
              translate: "0px " + ((1 - p) * size * 0.34).toFixed(2) + "px",
              filter: "blur(" + ((1 - fade) * blur).toFixed(2) + "px)",
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

/** Vertical clip wipe over a single line of type. */
export const LineWipe: React.FC<{
  children: React.ReactNode;
  from: number;
  dur?: number;
  exitAt?: number;
}> = ({ children, from, dur = 22, exitAt }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, from, from + dur, EASE.out);
  const out = exitAt === undefined ? 0 : prog(frame, exitAt, exitAt + 16, EASE.in);
  return (
    <div style={{ overflow: "hidden", clipPath: "inset(" + (1 - p) * 100 + "% 0% " + (1 - p) * 100 + "% 0%)" }}>
      <div style={{ translate: "0px " + ((1 - p) * 40).toFixed(2) + "px", opacity: 1 - out }}>{children}</div>
    </div>
  );
};

/** Small latin eyebrow label with a leading rule. */
export const Eyebrow: React.FC<{ text: string; from: number; color?: string; width?: number }> = ({
  text,
  from,
  color = C.gold,
  width = 46,
}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, from, from + 24, EASE.out);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: p }}>
      <div style={{ height: 1, width: width * p, background: color, opacity: 0.8 }} />
      <div
        style={{
          fontFamily: FONT.latin,
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "0.34em",
          color,
          translate: "0px " + ((1 - p) * 6).toFixed(2) + "px",
        }}
      >
        {text}
      </div>
    </div>
  );
};
