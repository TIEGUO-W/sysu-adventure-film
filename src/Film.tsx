import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { C, SCENES, CHAPTERS } from "./theme";
import { Camera, Chapter, Edges, Grain, Vignette } from "./components/Stage";
import { SceneOrigin } from "./scenes/SceneOrigin";
import { SceneRidge } from "./scenes/SceneRidge";
import { SceneMany } from "./scenes/SceneMany";
import { SceneBody } from "./scenes/SceneBody";
import { SceneRivers } from "./scenes/SceneRivers";
import { SceneMark } from "./scenes/SceneMark";
import { SceneOutro } from "./scenes/SceneOutro";

export const Film: React.FC = () => (
  <AbsoluteFill style={{ background: C.ink }}>
    <Camera scaleTo={1.05}>
      <Sequence from={SCENES.origin.from} durationInFrames={SCENES.origin.dur} name="01 Origin">
        <SceneOrigin />
      </Sequence>
      <Sequence from={SCENES.ridge.from} durationInFrames={SCENES.ridge.dur} name="02 The Climb">
        <SceneRidge />
      </Sequence>
      <Sequence from={SCENES.many.from} durationInFrames={SCENES.many.dur} name="03 Together">
        <SceneMany />
      </Sequence>
      <Sequence from={SCENES.body.from} durationInFrames={SCENES.body.dur} name="04 The Body">
        <SceneBody />
      </Sequence>
      <Sequence from={SCENES.rivers.from} durationInFrames={SCENES.rivers.dur} name="05 The Land">
        <SceneRivers />
      </Sequence>
      <Sequence from={SCENES.mark.from} durationInFrames={SCENES.mark.dur} name="06 The Name">
        <SceneMark />
      </Sequence>
      <Sequence from={SCENES.outro.from} durationInFrames={SCENES.outro.dur} name="07 Set Out">
        <SceneOutro />
      </Sequence>
    </Camera>

    <Vignette strength={0.9} />
    <Edges />
    <Grain opacity={0.3} />

    <Audio src={staticFile("score.wav")} />

    {CHAPTERS.filter((c) => c.key !== "outro").map((c) => (
      <Chapter key={c.key} index={c.index} latin={c.latin} from={SCENES[c.key].from} to={SCENES[c.key].from + SCENES[c.key].dur - 14} />
    ))}
  </AbsoluteFill>
);
