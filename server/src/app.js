import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import servicesRoutes from "./routes/services.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import depositsRoutes from "./routes/deposits.routes.js";
import transactionsRoutes from "./routes/transactions.routes.js";
import supportRoutes from "./routes/support.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import paypalRoutes from "./routes/paypal.routes.js";

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
  process.env.VERCEL_CLIENT_URL,
]
  .filter(Boolean)
  .map((origin) => String(origin).replace(/\/$/, ""));

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const cleanOrigin = String(origin).replace(/\/$/, "");

      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please slow down and try again later.",
  },
});

app.use(globalApiLimiter);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "EmpireBoost API is working",
  });
});

app.use("/auth", authRoutes);
app.use("/services", servicesRoutes);
app.use("/orders", ordersRoutes);
app.use("/admin", adminRoutes);
app.use("/deposits", depositsRoutes);
app.use("/transactions", transactionsRoutes);
app.use("/support", supportRoutes);
app.use("/settings", settingsRoutes);
app.use("/payments/paypal", paypalRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Global error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error",
  });
});

export default app;