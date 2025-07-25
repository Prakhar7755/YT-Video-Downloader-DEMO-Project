import youtubeDl from "youtube-dl-exec";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

import { VideoInfoModel } from "../model/videoInfo.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

ffmpeg.setFfmpegPath(ffmpegPath);

const downloadAndMerge = async (videoUrl) => {
  const id = randomUUID();

  const videoOutput = path.join(__dirname, `video_${id}.mp4`);
  const audioOutput = path.join(__dirname, `audio_${id}.mp4`);
  const finalOutput = path.join(__dirname, `merged_${id}.mp4`);

  try {
    console.log("Downloading Video..");

    await youtubeDl(videoUrl, {
      output: videoOutput,
      format: "bv[ext=mp4]",
      quiet: true,
    });

    console.log("Downloading Audio...");

    await youtubeDl(videoUrl, {
      output: audioOutput,
      format: "ba[ext=m4a]",
      quiet: true,
    });

    console.log("Merging Audio and Video...");

    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(videoOutput)
        .input(audioOutput)
        .outputOptions("-c copy")
        .save(finalOutput)
        .on("end", () => {
          try {
            fs.unlinkSync(videoOutput);
            fs.unlinkSync(audioOutput);
            console.log("Temp files deleted.");
          } catch (unlinkErr) {
            console.warn("Cleanup failed:", unlinkErr);
          }
          resolve();
        })
        .on("error", (ffmpegErr) => {
          console.error("FFmpeg error:", ffmpegErr);
          reject(ffmpegErr);
        });
    });

    return finalOutput;
  } catch (err) {
    console.error("Download and merge failed:", err);
    throw err;
  }
};

export const download = async (req, res) => {
  const { url, name } = req.body;

  if (!url || !name)
    return res.status(400).send("URL and name both are required");

  const optimizedName = name.trim().split(/\s+/).join("_");

  try {
    const filePath = await downloadAndMerge(url);

    await VideoInfoModel.create({ name: optimizedName, url: url.trim() });

    res.setHeader("Content-Type", "video/mp4");
    res.download(filePath, `${optimizedName}.mp4`, (err) => {
      fs.unlinkSync(filePath);
      if (err) {
        console.error("Download error:", err);
      }
    });
  } catch (err) {
    console.error("Processing error:", err);
    res.status(500).send("Error during download");
  }
};
