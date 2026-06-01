import express from "express";

import SupportTicket from "../models/SupportTicket.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// USER CREATES SUPPORT TICKET
router.post("/", protect, async (req, res) => {
  try {
    const { subject, category, message, relatedOrderId } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required",
      });
    }

    const ticket = await SupportTicket.create({
      userId: req.user._id,
      subject,
      category: category || "other",
      relatedOrderId: relatedOrderId || null,
      status: "open",
      messages: [
        {
          senderRole: "user",
          message,
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Support ticket created successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Create ticket error",
      error: error.message,
    });
  }
});

// USER GETS OWN TICKETS
router.get("/my", protect, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({
      userId: req.user._id,
    })
      .populate("relatedOrderId", "quantity charge status link")
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get my tickets error",
      error: error.message,
    });
  }
});

// USER REPLIES TO OWN TICKET
router.post("/:id/reply", protect, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    if (ticket.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "Ticket is closed",
      });
    }

    ticket.messages.push({
      senderRole: "user",
      message,
    });

    ticket.status = "open";
    await ticket.save();

    res.json({
      success: true,
      message: "Reply added successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Reply ticket error",
      error: error.message,
    });
  }
});

// ADMIN GETS ALL TICKETS
router.get("/admin/all", protect, adminOnly, async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .populate("userId", "email balance role")
      .populate("relatedOrderId", "quantity charge status link")
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get all tickets error",
      error: error.message,
    });
  }
});

// ADMIN REPLIES TO TICKET
router.post("/admin/:id/reply", protect, adminOnly, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    if (ticket.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "Ticket is closed",
      });
    }

    ticket.messages.push({
      senderRole: "admin",
      message,
    });

    ticket.status = "answered";
    await ticket.save();

    res.json({
      success: true,
      message: "Admin reply added successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Admin reply error",
      error: error.message,
    });
  }
});

// ADMIN CLOSES TICKET
router.put("/admin/:id/close", protect, adminOnly, async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    ticket.status = "closed";
    await ticket.save();

    res.json({
      success: true,
      message: "Ticket closed",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Close ticket error",
      error: error.message,
    });
  }
});

export default router;