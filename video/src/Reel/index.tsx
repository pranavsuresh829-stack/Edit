import { Caption, createTikTokStyleCaptions } from "@remotion/captions";
import React, { useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  getStaticFiles,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import SubtitlePage from "../CaptionedVideo/SubtitlePage";
import { loadFont } from "../load-font";
import { CameraCallout } from "./CameraCallout";
import { CtaOverlay } from "./CtaOverlay";
import { FreeOverlay } from "./FreeOverlay";
import { cameraOverlay, ctaSegment, freeOverlay, segments } from "./timeline";

const SWITCH_CAPTIONS_EVERY_MS = 1200;
const CUT_PUNCH_FRAMES = 8;

const fileExists = (file: string) =>
  getStaticFiles().some((f) => f.src === file);

const CutIn: React.FC<{ isFirst: boolean; children: React.ReactNode }> = ({
  isFirst,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const punch = isFirst
    ? 1
    : spring({
        frame,
        fps,
        config: { damping: 20, stiffness: 300 },
        durationInFrames: CUT_PUNCH_FRAMES,
      });

  const scale = interpolate(punch, [0, 1], [1.08, 1]);

  return (
    <AbsoluteFill style={{ transform: `scale(${scale})` }}>
      {children}
    </AbsoluteFill>
  );
};

export const Reel: React.FC<{ src: string }> = ({ src }) => {
  const [subtitles, setSubtitles] = useState<Caption[]>([]);
  const { fps, durationInFrames } = useVideoConfig();

  useEffect(() => {
    loadFont().then(() =>
      fetch(staticFile("reel.json"))
        .then((res) => res.json())
        .then((data: Caption[]) => setSubtitles(data)),
    );
  }, []);

  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
        captions: subtitles ?? [],
      }),
    [subtitles],
  );

  const hasMusic = fileExists(staticFile("background-music.mp3"));
  const hasTransitionSfx = fileExists(staticFile("transition.mp3"));

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {segments.map((segment, i) => (
        <Sequence
          key={segment.key}
          from={segment.outStartFrame}
          durationInFrames={segment.durationInFrames}
        >
          <CutIn isFirst={i === 0}>
            <OffthreadVideo
              src={src}
              trimBefore={segment.sourceStartFrame}
              trimAfter={segment.sourceStartFrame + segment.durationInFrames}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              onError={(e) => console.warn("Video decode error", e)}
            />
          </CutIn>
          {i > 0 && hasTransitionSfx ? (
            <Audio src={staticFile("transition.mp3")} volume={0.9} />
          ) : null}
        </Sequence>
      ))}

      {hasMusic ? (
        <Audio
          src={staticFile("background-music.mp3")}
          volume={(frame) =>
            interpolate(
              frame,
              [0, 10, durationInFrames - 20, durationInFrames],
              [0, 0.18, 0.18, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          }
        />
      ) : null}

      <Sequence from={freeOverlay.fromFrame} durationInFrames={freeOverlay.durationInFrames}>
        <FreeOverlay />
      </Sequence>

      <Sequence from={cameraOverlay.fromFrame} durationInFrames={cameraOverlay.durationInFrames}>
        <CameraCallout />
      </Sequence>

      <Sequence from={ctaSegment.outStartFrame} durationInFrames={ctaSegment.durationInFrames}>
        <CtaOverlay />
      </Sequence>

      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const subtitleStartFrame = (page.startMs / 1000) * fps;
        const subtitleEndFrame = Math.min(
          nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
          subtitleStartFrame + SWITCH_CAPTIONS_EVERY_MS,
        );
        const captionDurationInFrames = subtitleEndFrame - subtitleStartFrame;
        if (captionDurationInFrames <= 0) {
          return null;
        }
        return (
          <Sequence
            key={index}
            from={subtitleStartFrame}
            durationInFrames={captionDurationInFrames}
          >
            <SubtitlePage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
