import express from "express";

import Setting from "../models/Setting.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

const getOrCreateSettings = async () => {
  let settings = await Setting.findOne();

  if (!settings) {
    settings = await Setting.create({});
  }

  return settings;
};

// PUBLIC SETTINGS
router.get("/public", async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    res.json({
      success: true,
      settings: {
        websiteName: settings.websiteName,
        supportEmail: settings.supportEmail,
        businessName: settings.businessName,
        businessOwner: settings.businessOwner,
        businessAddress: settings.businessAddress,
        revolutInstructions: settings.revolutInstructions,
        cryptoInstructions: settings.cryptoInstructions,
        bankInstructions: settings.bankInstructions,
        paypalInstructions: settings.paypalInstructions,
        manualInstructions: settings.manualInstructions,
        homepageAnnouncement: settings.homepageAnnouncement,
        maintenanceMode: settings.maintenanceMode,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get public settings error",
      error: error.message,
    });
  }
});

// ADMIN GET SETTINGS
router.get("/admin", protect, adminOnly, async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get admin settings error",
      error: error.message,
    });
  }
});

// ADMIN UPDATE SETTINGS
router.put("/admin", protect, adminOnly, async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    const allowedFields = [
      "websiteName",
      "supportEmail",
      "businessName",
      "businessOwner",
      "businessAddress",
      "revolutInstructions",
      "cryptoInstructions",
      "bankInstructions",
      "paypalInstructions",
      "manualInstructions",
      "homepageAnnouncement",
      "maintenanceMode",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    }

    await settings.save();

    res.json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update settings error",
      error: error.message,
    });
  }
});

export default router;