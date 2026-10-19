import React, { useEffect, useState } from "react";
import { continueRender, delayRender } from "remotion";
import { GLYPH_SAMPLES } from "./copy";

const WEIGHTS = [300, 400, 700, 900];

export const FontGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handle = delayRender("loading-cjk-fonts");
    const jobs = WEIGHTS.flatMap((w) =>
      GLYPH_SAMPLES.map((s) =>
        document.fonts.load(`${w} 64px "Noto Sans SC"`, s).catch(() => null),
      ),
    );
    Promise.all(jobs)
      .then(() => document.fonts.ready)
      .then(() => {
        setReady(true);
        window.setTimeout(() => continueRender(handle), 60);
      })
      .catch(() => {
        setReady(true);
        continueRender(handle);
      });
  }, []);

  return ready ? <>{children}</> : null;
};
