import express from "express";
import cors from "cors";
import { downloadAndMerge } from "./download.js";
import path from "path";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.post("/api/download", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).send("URL required");

  try {
    const filePath = await downloadAndMerge(url);
    res.download(filePath, "YourVideo.mp4", (err) => {
      if (!err) {
        // Optional: Clean up file after download
        fs.unlinkSync(filePath);
      }
    });
  } catch (err) {
    res.status(500).send("Error during download");
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
