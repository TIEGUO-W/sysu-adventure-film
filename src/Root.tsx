import React from "react";
import { Composition } from "remotion";
import "./index.css";
import { Film } from "./Film";
import { FontGate } from "./FontGate";
import { DURATION, FPS, H, W } from "./theme";

const Gated: React.FC = () => (
  <FontGate>
    <Film />
  </FontGate>
);

export const RemotionRoot: React.FC = () => (
  <Composition id="Film" component={Gated} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);
