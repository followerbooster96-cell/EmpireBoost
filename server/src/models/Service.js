import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    platform: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Instagram",
        "TikTok",
        "YouTube",
        "Facebook",
        "X",
        "Telegram",
        "Spotify",
        "Twitch",
        "Other",
      ],
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Followers",
        "Likes",
        "Views",
        "Comments",
        "Subscribers",
        "Members",
        "Streams",
        "Other",
      ],
    },

    description: {
      type: String,
      default: "",
    },

    pricePer1000: {
      type: Number,
      required: true,
      min: 0,
    },

    min: {
      type: Number,
      required: true,
      min: 1,
    },

    max: {
      type: Number,
      required: true,
      min: 1,
    },

    enabled: {
      type: Boolean,
      default: true,
    },

    providerServiceId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;