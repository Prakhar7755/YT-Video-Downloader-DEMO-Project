import express from "express";
import { download } from "../controllers/videoInfo.controller.js";

const router = express.Router();

router.post("/", download);

export default router;
