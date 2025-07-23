import express from "express";
import { download } from "../controllers/videoInfo.controller.js";

const router = express.Router();

router.post("/", download);

router.get("/test-ffmpeg", async (req, res) => {
  const { exec } = await import("child_process");

  exec(`${ffmpegPath} -version`, (error, stdout, stderr) => {
    if (error) return res.status(500).send("FFmpeg not working: " + error.message);
    res.send("FFmpeg works:\n" + stdout);
  });
});


export default router;
