import express from "express";
import {
  createPaypalPayment,
  capturePaypalPayment,
  getMyPaypalPayments,
} from "../controllers/paypal.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", protect, createPaypalPayment);
router.post("/capture", protect, capturePaypalPayment);
router.get("/my", protect, getMyPaypalPayments);

export default router;