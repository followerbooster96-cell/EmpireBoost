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
        "crypto",
        "coinremitter",
        "payeer",
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

    cryptoCoin: {
      type: String,
      enum: ["LTC", "DOGE", "BTC", "DASH", ""],
      default: "",
      uppercase: true,
      trim: true,
    },

    cryptoNetwork: {
      type: String,
      default: "",
      trim: true,
    },

    cryptoAmount: {
      type: Number,
      default: 0,
    },

    cryptoAddress: {
      type: String,
      default: "",
      trim: true,
    },

    provider: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },

    providerDepositId: {
      type: String,
      default: "",
      trim: true,
    },

    providerInvoiceId: {
      type: String,
      default: "",
      trim: true,
    },

    providerInvoiceUrl: {
      type: String,
      default: "",
      trim: true,
    },

    providerStatus: {
      type: String,
      default: "",
      trim: true,
    },

    providerRaw: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
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
depositSchema.index({ cryptoCoin: 1, createdAt: -1 });
depositSchema.index({ provider: 1, providerInvoiceId: 1 });
depositSchema.index({ provider: 1, providerDepositId: 1 });

const Deposit = mongoose.model("Deposit", depositSchema);

export default Deposit;