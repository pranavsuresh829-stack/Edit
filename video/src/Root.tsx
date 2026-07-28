import "./index.css";
import { Composition, staticFile } from "remotion";
import { z } from "zod";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";
import { Reel } from "./Reel";
import { totalDurationInFrames } from "./Reel/timeline";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Reel"
        component={Reel}
        schema={z.object({ src: z.string() })}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={totalDurationInFrames}
        defaultProps={{
          src: staticFile("reel.mp4"),
        }}
      />
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        calculateMetadata={calculateCaptionedVideoMetadata}
        schema={captionedVideoSchema}
        width={1080}
        height={1920}
        defaultProps={{
          src: staticFile("sample-video.mp4"),
        }}
      />
    </>
  );
};
