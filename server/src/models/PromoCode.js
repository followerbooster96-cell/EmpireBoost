import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    bonusPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    enabled: {
      type: Boolean,
      default: true,
    },

    maxUses: {
      type: Number,
      default: 0,
    },

    usedCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);

export default PromoCode;