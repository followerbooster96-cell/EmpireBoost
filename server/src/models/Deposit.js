import mongoose from "mongoose";

const depositSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    promoCode: {
      type: String,
      default: "",
      uppercase: true,
      trim: true,
    },

    bonusAmount: {
      type: Number,
      default: 0,
    },

    finalAmount: {
      type: Number,
      default: 0,
    },

    method: {
      type: String,
      enum: [
        "payeer",
        "crypto",
        "revolut",
        "skrill",
        "bank",
        "paypal",
        "manual",
      ],
      default: "manual",
      lowercase: true,
      trim: true,
    },

    paymentReference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    userNote: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      lowercase: true,
      trim: true,
    },

    adminNote: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

depositSchema.index({ userId: 1, createdAt: -1 });
depositSchema.index({ status: 1, createdAt: -1 });
depositSchema.index({ method: 1, createdAt: -1 });

const Deposit = mongoose.model("Deposit", depositSchema);

export default Deposit;