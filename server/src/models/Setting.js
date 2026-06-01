import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    websiteName: {
      type: String,
      default: "EmpireBoost",
    },

    supportEmail: {
      type: String,
      default: "support@empireboost.com",
    },

    businessName: {
      type: String,
      default: "EmpireBoost",
    },

    businessOwner: {
      type: String,
      default: "To be added",
    },

    businessAddress: {
      type: String,
      default: "To be added",
    },

    revolutInstructions: {
      type: String,
      default:
        "Send payment via Revolut and write your payment reference in the payment note.",
    },

    cryptoInstructions: {
      type: String,
      default:
        "Send crypto payment to the wallet address provided by support and include your payment reference.",
    },

    bankInstructions: {
      type: String,
      default:
        "Send bank transfer and use your payment reference as the payment purpose.",
    },

    paypalInstructions: {
      type: String,
      default:
        "Send PayPal payment and add your payment reference in the PayPal note.",
    },

    manualInstructions: {
      type: String,
      default: "Contact support and include your payment reference.",
    },

    homepageAnnouncement: {
      type: String,
      default: "",
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;