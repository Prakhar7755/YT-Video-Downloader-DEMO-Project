import youtubeDl from "youtube-dl-exec";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

ffmpeg.setFfmpegPath(
  `C:\\Users\\prakh\\OneDrive\\Desktop\\ffmpeg-7.1.1-essentials_build\\ffmpeg-7.1.1-essentials_build\\bin\\ffmpeg.exe`
);

export const downloadAndMerge = async (videoUrl) => {
  const videoOutput = path.join(__dirname, "video.mp4");
  const audioOutput = path.join(__dirname, "audio.mp4");
  const finalOutput = path.join(__dirname, "Hello_Song.mp4");

  try {
    console.log("Downloading video...");
    await youtubeDl(videoUrl, {
      output: videoOutput,
      format: "bv[ext=mp4]",
      quiet: true,
    });

    console.log("Downloading audio...");
    await youtubeDl(videoUrl, {
      output: audioOutput,
      format: "ba[ext=m4a]",
      quiet: true,
    });

    console.log("Merging...");
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(videoOutput)
        .input(audioOutput)
        .outputOptions("-c copy")
        .save(finalOutput)
        .on("end", () => {
          fs.unlinkSync(videoOutput);
          fs.unlinkSync(audioOutput);
          console.log("Merged successfully!");
          resolve();
        })
        .on("error", reject);
    });

    return finalOutput;
  } catch (err) {
    console.error(err);
    throw err;
  }
  finally{
    
  }
};
