import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const CameraCallout: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 10,
  });

  const scanY = interpolate(
    frame % 30,
    [0, 30],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const exit = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const boxSize = 480;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: enter * exit,
      }}
    >
      <div
        style={{
          position: "relative",
          width: boxSize,
          height: boxSize * 0.55,
          transform: `scale(${0.85 + enter * 0.15})`,
        }}
      >
        {[
          { top: -4, left: -4, borderWidth: "6px 0 0 6px" },
          { top: -4, right: -4, borderWidth: "6px 6px 0 0" },
          { bottom: -4, left: -4, borderWidth: "0 0 6px 6px" },
          { bottom: -4, right: -4, borderWidth: "0 6px 6px 0" },
        ].map((corner, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 48,
              height: 48,
              borderColor: "#FFE600",
              borderStyle: "solid",
              ...corner,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${scanY}%`,
            height: 4,
            background: "#FFE600",
            boxShadow: "0 0 20px 4px #FFE600",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -70,
            left: 0,
            right: 0,
            textAlign: "center",
            color: "white",
            fontFamily: "Arial Black, Impact, sans-serif",
            fontWeight: 900,
            fontSize: 40,
            WebkitTextStroke: "6px black",
            paintOrder: "stroke",
            letterSpacing: 1,
          }}
        >
          CAMERA WORK...
        </div>
      </div>
    </AbsoluteFill>
  );
};
