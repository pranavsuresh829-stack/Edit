import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const FreeOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.6 },
    durationInFrames: 14,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        top: undefined,
        bottom: 900,
        height: 200,
      }}
    >
      <div
        style={{
          transform: `scale(${0.6 + pop * 0.4}) rotate(-6deg)`,
          fontFamily: "Arial Black, Impact, sans-serif",
          fontWeight: 900,
          fontSize: 150,
          color: "#FFE600",
          WebkitTextStroke: "10px black",
          paintOrder: "stroke",
          letterSpacing: 2,
        }}
      >
        FREE
      </div>
    </AbsoluteFill>
  );
};
