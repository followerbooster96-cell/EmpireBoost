import express from "express";
import Service from "../models/Service.js";

const router = express.Router();

// GET PUBLIC ENABLED SERVICES
router.get("/", async (req, res) => {
  try {
    const { platform, type, search } = req.query;

    const filter = {
      enabled: true,
    };

    if (platform) {
      filter.platform = platform;
    }

    if (type) {
      filter.type = type;
    }

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    const services = await Service.find(filter).sort({
      platform: 1,
      type: 1,
      pricePer1000: 1,
    });

    res.json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get services error",
      error: error.message,
    });
  }
});

export default router;