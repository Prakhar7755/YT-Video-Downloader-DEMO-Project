import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import startServer from "./server.js";
import videoRouter from "./src/routes/videoInfo.route.js";
import errorHandler from "./src/middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Get directory name from ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.join(__dirname, "../client/dist");

// ---------------------------
// Global Middleware Setup
// ---------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

// ---------------------------
// CORS Setup (Dev Only)
// ---------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  process.env.CORS_ORIGIN,
].filter(Boolean);

if (process.env.NODE_ENV !== "production") {
  app.use(
    // cors()
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );
}

// ---------------------------
// API Route Handlers
// ---------------------------
app.use("/api/video", videoRouter);

// ---------------------------
// Serve Static Frontend Assets (Production)
// ---------------------------
if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

// ---------------------------
// Centralized Error Handling
// ---------------------------
app.use(errorHandler);

// ---------------------------
// Start Server
// ---------------------------
startServer(app, PORT);
