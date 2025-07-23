import youtubeDl from "youtube-dl-exec";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

import { VideoInfoModel } from "../model/videoInfo.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

ffmpeg.setFfmpegPath(ffmpegPath);

const downloadAndMerge = async (videoUrl) => {
  const id = uuidv4();

  const videoOutput = path.join(__dirname, `video_${id}.mp4`);
  const audioOutput = path.join(__dirname, `audio_${id}.mp4`);
  const finalOutput = path.join(__dirname, `merged_${id}.mp4`);

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
  } finally {
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
