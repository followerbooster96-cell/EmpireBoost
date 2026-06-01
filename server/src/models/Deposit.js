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
      enum: ["revolut", "crypto", "bank", "paypal", "manual"],
      default: "manual",
    },

    paymentReference: {
      type: String,
      required: true,
      unique: true,
    },

    userNote: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    adminNote: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Deposit = mongoose.model("Deposit", depositSchema);

export default Deposit;