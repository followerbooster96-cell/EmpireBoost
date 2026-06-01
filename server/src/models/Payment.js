import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    provider: {
      type: String,
      enum: ["paypal"],
      default: "paypal",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    currency: {
      type: String,
      default: "EUR",
      uppercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["created", "completed", "cancelled", "failed"],
      default: "created",
      index: true,
    },

    paypalOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    paypalCaptureId: {
      type: String,
      default: "",
    },

    approveUrl: {
      type: String,
      default: "",
    },

    rawCreateResponse: {
      type: Object,
      default: {},
    },

    rawCaptureResponse: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;