import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const CtaOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 12,
  });

  const bounce = 1 + Math.sin(frame / 6) * 0.045;

  const arrowBob = interpolate(Math.sin(frame / 5), [-1, 1], [-6, 6]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        top: undefined,
        bottom: 550,
        height: 220,
      }}
    >
      <div
        style={{
          transform: `scale(${enter * bounce})`,
          textAlign: "center",
          fontFamily: "Arial Black, Impact, sans-serif",
          fontWeight: 900,
          fontSize: 82,
          color: "white",
          WebkitTextStroke: "12px black",
          paintOrder: "stroke",
          lineHeight: 1.15,
        }}
      >
        Comment &apos;APP&apos;{" "}
        <span style={{ display: "inline-block", transform: `translateY(${arrowBob}px)` }}>
          👇
        </span>
      </div>
    </AbsoluteFill>
  );
};
