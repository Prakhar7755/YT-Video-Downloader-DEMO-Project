import mongoose from "mongoose";

const videoInfoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const VideoInfoModel =
  mongoose.models.VideoInfo || mongoose.model("VideoInfo", videoInfoSchema);

export { VideoInfoModel };
