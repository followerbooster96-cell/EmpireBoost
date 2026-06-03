import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import { OAuth2Client } from "google-auth-library";

import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { buildPasswordResetEmail, sendEmail } from "../utils/sendEmail.js";
import {
  buildLoginNotification,
  buildRegisterNotification,
  sendTelegramNotification,
} from "../utils/telegram.js";

const router = express.Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login or register attempts. Please try again later.",
  },
});

const strictLoginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please wait a few minutes.",
  },
});

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many password reset attempts. Please try again later.",
  },
});

const generateToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const generatePasswordResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  return {
    rawToken,
    hashedToken,
  };
};

const buildResetUrl = (rawToken) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  return `${clientUrl.replace(/\/$/, "")}/reset-password/${rawToken}`;
};

const buildUserResponse = (user) => {
  return {
    id: user._id,
    email: user.email,
    role: user.role,
    balance: user.balance,
    name: user.name || "",
    avatar: user.avatar || "",
    authProvider: user.authProvider || "local",
  };
};

const getClientIp = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (forwardedFor) {
    return String(forwardedFor).split(",")[0].trim();
  }

  return req.ip || req.socket?.remoteAddress || "";
};

const verifyTurnstile = async (req, res, next) => {
  try {
    const { captchaToken } = req.body;

    if (!process.env.TURNSTILE_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: "Security check is not configured on the server",
      });
    }

    if (!captchaToken) {
      return res.status(400).json({
        success: false,
        message: "Security check is required",
      });
    }

    const formData = new URLSearchParams();
    formData.append("secret", process.env.TURNSTILE_SECRET_KEY);
    formData.append("response", captchaToken);
    formData.append("remoteip", getClientIp(req));

    const turnstileResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );

    const turnstileData = await turnstileResponse.json();

    if (!turnstileData.success) {
      return res.status(403).json({
        success: false,
        message: "Security check failed. Please refresh and try again.",
        details: turnstileData["error-codes"] || [],
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Security check error",
      error: error.message,
    });
  }
};

// REGISTER
router.post("/register", authLimiter, verifyTurnstile, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      email: cleanEmail,
      passwordHash,
      authProvider: "local",
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    const token = generateToken(user._id);

    void sendTelegramNotification(
      buildRegisterNotification({
        user,
        req,
        provider: "local",
      })
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Register error",
      error: error.message,
    });
  }
});

// LOGIN
router.post("/login", strictLoginLimiter, verifyTurnstile, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.passwordHash) {
      return res.status(401).json({
        success: false,
        message:
          "This account was created with Google. Please continue with Google login.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    void sendTelegramNotification(
      buildLoginNotification({
        user,
        req,
        provider: "local",
      })
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login error",
      error: error.message,
    });
  }
});

// FORGOT PASSWORD
router.post("/forgot-password", passwordResetLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.json({
        success: true,
        message:
          "If an account with this email exists, a password reset link has been sent.",
      });
    }

    const { rawToken, hashedToken } = generatePasswordResetToken();

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);

    await user.save();

    const resetUrl = buildResetUrl(rawToken);

    const emailContent = buildPasswordResetEmail({
      resetUrl,
    });

    try {
      await sendEmail({
        to: user.email,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
      });

      if (process.env.NODE_ENV !== "production") {
        console.log("");
        console.log("==============================================");
        console.log("EMPIREBOOST PASSWORD RESET EMAIL SENT");
        console.log(`Email: ${user.email}`);
        console.log(`Reset URL: ${resetUrl}`);
        console.log("This dev link expires in 30 minutes.");
        console.log("==============================================");
        console.log("");
      }
    } catch (emailError) {
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      console.error("PASSWORD RESET EMAIL ERROR:", emailError);

      return res.status(500).json({
        success: false,
        message:
          "Password reset email could not be sent. Please contact support.",
      });
    }

    res.json({
      success: true,
      message:
        "If an account with this email exists, a password reset link has been sent.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Forgot password error",
      error: error.message,
    });
  }
});

// RESET PASSWORD
router.post("/reset-password/:token", passwordResetLimiter, async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(String(token))
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Password reset link is invalid or expired",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    user.passwordHash = passwordHash;
    user.authProvider = "local";
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.json({
      success: true,
      message: "Password has been reset successfully. You can now login.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Reset password error",
      error: error.message,
    });
  }
});

// GOOGLE LOGIN / REGISTER
router.post("/google", authLimiter, verifyTurnstile, async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({
        success: false,
        message: "Google login is not configured on the server",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google account",
      });
    }

    const cleanEmail = String(payload.email).toLowerCase().trim();

    let user = await User.findOne({ email: cleanEmail });
    let isNewGoogleUser = false;

    if (!user) {
      user = await User.create({
        email: cleanEmail,
        googleId: payload.sub,
        authProvider: "google",
        name: payload.name || "",
        avatar: payload.picture || "",
        passwordHash: null,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      });

      isNewGoogleUser = true;
    } else {
      let shouldSave = false;

      if (!user.googleId) {
        user.googleId = payload.sub;
        shouldSave = true;
      }

      if (!user.name && payload.name) {
        user.name = payload.name;
        shouldSave = true;
      }

      if (!user.avatar && payload.picture) {
        user.avatar = payload.picture;
        shouldSave = true;
      }

      if (user.authProvider !== "google" && !user.passwordHash) {
        user.authProvider = "google";
        shouldSave = true;
      }

      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      shouldSave = true;

      if (shouldSave) {
        await user.save();
      }
    }

    const token = generateToken(user._id);

    if (isNewGoogleUser) {
      void sendTelegramNotification(
        buildRegisterNotification({
          user,
          req,
          provider: "google",
        })
      );
    } else {
      void sendTelegramNotification(
        buildLoginNotification({
          user,
          req,
          provider: "google",
        })
      );
    }

    res.json({
      success: true,
      message: "Google login successful",
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Google login failed",
      error: error.message,
    });
  }
});

// GET CURRENT USER
router.get("/me", protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// TEST
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth route is working",
  });
});

export default router;