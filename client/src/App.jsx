import { useState } from "react";
import api from "./lib/axios.js";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!name.trim() || !url.trim()) {
      alert("Both name and URL are required.");
      return;
    }

    setLoading(true);
    try {
      // const response = await axios.post(
      //   "http://localhost:5001/api/download",
      //   { url },
      //   {
      //     responseType: "blob", // important for downloading
      //   }
      // );
      const response = await api.post(
        "/",
        {
          name: name.trim(),
          url: url.trim(),
        },
        {
          responseType: "blob", // important for downloading
        }
      );

      const blob = new Blob([response.data], { type: "video/mp4" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${name.trim().split(/\s+/).join("_")}.mp4`;
      link.click();

      // reset the fields
      setUrl("");
      setName("");
    } catch (err) {
      console.error(err);
      alert("Download failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-500 flex flex-col items-center justify-center gap-30">
      {/* Title */}
      <p className="text-[100px] sm:text-5xl font-bold italic text-white mb-12 text-center">
        Download YouTube Video
      </p>

      {/* Form Container */}
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl  p-6 sm:p-8 rounded-lg  flex flex-col items-center gap-3">
        {/* Input */}

        <div className="w-full mb-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter the Name"
            className="w-full px-6 py-5 rounded-md bg-white text-black   placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="w-full mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube URL"
            className="w-full px-6 py-5 rounded-md bg-white text-black   placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleDownload}
          disabled={loading || !url.trim() || !name.trim()}
          className={`w-full py-5 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold text-lg ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Downloading..." : "Download"}
        </button>
      </div>
    </div>
  );
}

export default App;
