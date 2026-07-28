// Edit timeline for public/reel.mp4, built from the real transcript the
// creator provided (no speech-to-text was available in this environment).
//
// Timing method: each beat's on-screen duration is split proportionally by
// its share of the transcript's character count, anchored to the one real
// silence gap ffmpeg's silencedetect found in the source audio - 45.445s to
// 46.577s, the only pause longer than 1s, which sits right at the
// status/CTA boundary and gets trimmed out as dead air. The other four cuts
// (hook/intro, intro/free, free/build, build/status) are estimates based on
// natural speaking pace, not detected pauses - nudge `sourceStart`/
// `sourceEnd` below after reviewing in Remotion Studio.
export const FPS = 30;

export type Segment = {
  key: string;
  sourceStartFrame: number;
  durationInFrames: number;
  outStartFrame: number;
};

const toFrame = (seconds: number) => Math.round(seconds * FPS);

const raw = [
  { key: "hook", sourceStart: 0.909, sourceEnd: 9.327 },
  { key: "intro", sourceStart: 9.327, sourceEnd: 16.835 },
  { key: "free", sourceStart: 16.835, sourceEnd: 27.187 },
  { key: "build", sourceStart: 27.187, sourceEnd: 39.7 },
  { key: "status", sourceStart: 39.7, sourceEnd: 45.445 },
  // 45.445s-46.577s in the source is the dead-air gap that got trimmed.
  { key: "cta", sourceStart: 46.577, sourceEnd: 51.243 },
];

let cursor = 0;
export const segments: Segment[] = raw.map((s) => {
  const durationInFrames = toFrame(s.sourceEnd) - toFrame(s.sourceStart);
  const segment: Segment = {
    key: s.key,
    sourceStartFrame: toFrame(s.sourceStart),
    durationInFrames,
    outStartFrame: cursor,
  };
  cursor += durationInFrames;
  return segment;
});

export const totalDurationInFrames = cursor;

// "...but mine's free" lands here - punch in the FREE contrast.
export const freeOverlay = { fromFrame: 588, durationInFrames: 40 };

// "definitely the camera, to get the camera work" lands here.
export const cameraOverlay = { fromFrame: 997, durationInFrames: 69 };

export const ctaSegment = segments.find((s) => s.key === "cta")!;
