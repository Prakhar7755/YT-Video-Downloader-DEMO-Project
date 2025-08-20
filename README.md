# 🎬 YouTube Video Downloader

A full-stack MERN application to download YouTube videos in **MP4** or **MP3** formats.  
It uses `youtube-dl-exec` under the hood with **FFmpeg** for media processing, and integrates the **YouTube Data API** to fetch metadata. You can see the DEMO on [Google Drive](https://drive.google.com/file/d/1CAIpNm85lAc4DUd1PBYHX5g0SlgmvuWB/view)

⚠️ **Important:** This project is for **educational purposes only**.  
Due to YouTube’s bot detection system, it **cannot be deployed on hosting providers** — it is intended to run **locally**.

---

## 🚀 Features

- 🎥 Download YouTube videos in **MP4** format.
- 🎵 Extract audio and download in **MP3** format.
- 📊 Fetch video metadata (title, channel, duration, etc.) using the YouTube Data API.
- 💾 Store download history with MongoDB (video name + original URL).
- 🛡️ Error handling and safe cleanup of temp files.
- 🎨 Simple, intuitive UI built with React + Tailwind.

---

## 🛠 Tech Stack

- **Frontend:** React (Vite), TailwindCSS, Axios  
- **Backend:** Node.js, Express.js, Helmet, CORS  
- **Database:** MongoDB (Mongoose)  
- **Media Processing:** youtube-dl-exec, FFmpeg (via fluent-ffmpeg + ffmpeg-static)  
- **Other:** Dockerized setup, dotenv for environment config  

---

## 📂 Project Structure

```

youtube-video-downloader/
├── client/              # React frontend (Vite + Tailwind)
│   ├── src/             # Pages, components, API calls
│   └── vite.config.js
│
├── server/              # Express backend
│   ├── app.js           # Express app config (CORS, static serve, API mount)
│   |__ server.js        # Server bootstrap
|   |__ src/
│      ├── config/          # DB & env configs
│      ├── controllers/     # Business logic (downloads, merges)
│      ├── middleware/      # Error handling, CORS, helmet
│      ├── model/           # Mongoose schemas
│      ├── routes/          # API routes (video download, health checks)
│
├── Dockerfile           # Multi-stage Docker setup (client + server)
├── package.json         # Root scripts for build/start
└── README.md

````

---

## ⚙️ Environment Variables

### Client (`client/.env`)
```env
VITE_MODE=development
# VITE_MODE=production
````

### Server (`server/.env`)

```env
MONGO_URI="mongodb://localhost:27017/videoInfo"
PORT=5001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
YOUTUBE_DL_SKIP_PYTHON_CHECK=1
```

> **Note:** Replace `MONGO_URI` with your MongoDB Atlas URI if you prefer cloud persistence.

---

## 🖥️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Prakhar7755/YT-Video-Downloader-DEMO-Project.git
cd youtube-video-downloader
```

### 2️⃣ Install dependencies

```bash
yarn --cwd client install
yarn --cwd server install
```

### 3️⃣ Run locally (development)

Open two terminals:

```bash
# Backend (Express API)
yarn --cwd server dev

# Frontend (React app)
yarn --cwd client dev
```

Access app at 👉 [http://localhost:5173](http://localhost:5173)

---

## 🐳 Run with Docker

```bash
docker build -t youtube-downloader .
docker run -p 5001:5001 youtube-downloader
```

Frontend is served from `http://localhost:5001`.

---

## 📡 API Endpoints

| Method | Endpoint                 | Description                                            |
| ------ | ------------------------ | ------------------------------------------------------ |
| POST   | `/api/video/`            | Download video, merge audio/video, respond with `.mp4` |
| GET    | `/api/video/test-ffmpeg` | Verify FFmpeg installation                             |

---

## ⚙️ How It Works (Backend Flow)

1. **Request Handling**

   * `POST /api/video` expects `{ url, name }` in the body.
   * Validates input (`url` and `name` required).

2. **Download & Merge** (`videoInfo.controller.js`)

   * Downloads video (`bv[ext=mp4]`) and audio (`ba[ext=m4a]`) separately using **youtube-dl-exec**.
   * Uses **FFmpeg** to merge both into a single MP4.
   * Temporary video/audio files are deleted after merging.

3. **Database Persistence** (`videoInfo.model.js`)

   * Stores the `name` (optimized to be filesystem-safe) and `url` in MongoDB.
   * Schema also tracks `createdAt` and `updatedAt`.

4. **Response**

   * Sets correct `Content-Type` (`video/mp4`).
   * Triggers a file download on the client.
   * Deletes the merged file from server after sending.

5. **Error Handling**

   * Centralized `errorHandler.js` ensures consistent error responses.
   * CORS rules are enforced (only localhost + env-defined origins).

---

## 🚧 Limitations

* ❌ Deployment to public hosting (Vercel, Render, Railway) is not feasible due to **YouTube bot detection**.
* ✅ Runs perfectly on **localhost**.
* 📉 Relies on external tools (`youtube-dl-exec`, FFmpeg) — may break if YouTube changes.

---

## 📌 Roadmap

* [ ] Add progress indicators for downloads.
* [ ] Implement history management UI (view/delete past downloads).
* [ ] User authentication for personalized download logs.
* [ ] Playlist and batch download support.

---

## 🤝 Contributing

PRs are welcome!

* Fork the repo
* Create a feature branch (`feat/my-feature`)
* Commit and push
* Submit a PR

---

## 📜 License

MIT License.

---

## 🙏 Acknowledgements

* [youtube-dl-exec](https://www.npmjs.com/package/youtube-dl-exec)
* [FFmpeg](https://ffmpeg.org/)
* [MongoDB](https://www.mongodb.com/)
* [TailwindCSS](https://tailwindcss.com/)

