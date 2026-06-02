import express from "express";
import { createRequire } from "module";

import User from "../models/User.js";
import Deposit from "../models/Deposit.js";
import PromoCode from "../models/PromoCode.js";
import Transaction from "../models/Transaction.js";
import { protect, adminOnly } from "../middleware/auth.js";

const require = createRequire(import.meta.url);
const CoinRemitter = require("coinremitter-api");

const router = express.Router();

const allowedManualMethods = [
  "payeer",
  "crypto",
  "coinremitter",
  "revolut",
  "skrill",
  "bank",
  "paypal",
  "manual",
];

const allowedCryptoCoins = ["LTC", "DOGE", "BTC", "DASH"];

const coinLabels = {
  LTC: "Litecoin",
  DOGE: "Dogecoin",
  BTC: "Bitcoin",
  DASH: "Dash",
};

const coinNetworks = {
  LTC: "Litecoin Network",
  DOGE: "Dogecoin Network",
  BTC: "Bitcoin Network",
  DASH: "Dash Network",
};

const createPaymentReference = () => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `EB${random}`;
};

const formatAmount = (value) => {
  return Number(Number(value || 0).toFixed(4));
};

const normalizeMethod = (method) => {
  return method ? String(method).toLowerCase().trim() : "manual";
};

const normalizeText = (value) => {
  return value ? String(value).trim() : "";
};

const normalizeCoin = (coin) => {
  return coin ? String(coin).toUpperCase().trim() : "LTC";
};

const getClientUrl = () => {
  return (
    process.env.CLIENT_URL ||
    process.env.VERCEL_CLIENT_URL ||
    "http://localhost:5173"
  ).replace(/\/$/, "");
};

const getApiBaseUrl = () => {
  return (
    process.env.API_BASE_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    "https://empireboost-api.onrender.com"
  ).replace(/\/$/, "");
};

const getCoinRemitterConfig = (coin) => {
  const cleanCoin = normalizeCoin(coin);

  const configs = {
    LTC: {
      apiKey: process.env.COINREMITTER_LTC_API_KEY,
      password: process.env.COINREMITTER_LTC_PASSWORD,
      currency: process.env.COINREMITTER_LTC_CURRENCY || "LTC",
    },
    DOGE: {
      apiKey: process.env.COINREMITTER_DOGE_API_KEY,
      password: process.env.COINREMITTER_DOGE_PASSWORD,
      currency: process.env.COINREMITTER_DOGE_CURRENCY || "DOGE",
    },
    BTC: {
      apiKey: process.env.COINREMITTER_BTC_API_KEY,
      password: process.env.COINREMITTER_BTC_PASSWORD,
      currency: process.env.COINREMITTER_BTC_CURRENCY || "BTC",
    },
    DASH: {
      apiKey: process.env.COINREMITTER_DASH_API_KEY,
      password: process.env.COINREMITTER_DASH_PASSWORD,
      currency: process.env.COINREMITTER_DASH_CURRENCY || "DASH",
    },
  };

  return configs[cleanCoin] || configs.LTC;
};

const createCoinRemitterWallet = (coin) => {
  const cleanCoin = normalizeCoin(coin);
  const config = getCoinRemitterConfig(cleanCoin);

  if (!config.apiKey || !config.password) {
    const error = new Error(
      `${cleanCoin} CoinRemitter wallet is not configured yet`
    );
    error.status = 400;
    throw error;
  }

  return new CoinRemitter(config.apiKey, config.password);
};

const createUniquePaymentReference = async () => {
  let paymentReference = createPaymentReference();
  let existingReference = await Deposit.findOne({ paymentReference });

  while (existingReference) {
    paymentReference = createPaymentReference();
    existingReference = await Deposit.findOne({ paymentReference });
  }

  return paymentReference;
};

const applyPromoIfNeeded = async (deposit) => {
  let bonusAmount = 0;
  let finalAmount = formatAmount(deposit.amount);
  let appliedPromoCode = "";

  if (deposit.promoCode && deposit.promoCode.trim() !== "") {
    const promo = await PromoCode.findOne({
      code: deposit.promoCode.trim().toUpperCase(),
      enabled: true,
    });

    if (!promo) {
      const error = new Error("Invalid or disabled promo code");
      error.status = 400;
      throw error;
    }

    if (promo.maxUses > 0 && promo.usedCount >= promo.maxUses) {
      const error = new Error("Promo code usage limit reached");
      error.status = 400;
      throw error;
    }

    bonusAmount = formatAmount(
      (Number(deposit.amount) * promo.bonusPercent) / 100
    );
    finalAmount = formatAmount(Number(deposit.amount) + bonusAmount);

    promo.usedCount += 1;
    await promo.save();

    appliedPromoCode = promo.code;
  }

  return {
    bonusAmount,
    finalAmount,
    appliedPromoCode,
  };
};

const approveDepositAndCreditUser = async (deposit, adminNote = "") => {
  if (!deposit) {
    const error = new Error("Deposit not found");
    error.status = 404;
    throw error;
  }

  if (deposit.status !== "pending") {
    return {
      alreadyProcessed: true,
      deposit,
      user: null,
    };
  }

  const user = await User.findById(deposit.userId);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  const { bonusAmount, finalAmount, appliedPromoCode } =
    await applyPromoIfNeeded(deposit);

  user.balance = formatAmount(Number(user.balance || 0) + finalAmount);
  await user.save();

  deposit.status = "approved";
  deposit.bonusAmount = bonusAmount;
  deposit.finalAmount = finalAmount;
  deposit.adminNote = normalizeText(adminNote) || deposit.adminNote || "";
  await deposit.save();

  const existingTransaction = await Transaction.findOne({
    userId: user._id,
    reference: deposit.paymentReference,
    type: "topup",
  });

  if (!existingTransaction) {
    await Transaction.create({
      userId: user._id,
      type: "topup",
      amount: finalAmount,
      status: "completed",
      provider: deposit.method,
      reference: deposit.paymentReference,
      description: appliedPromoCode
        ? `Deposit approved. Method ${deposit.method}. Amount €${deposit.amount}, bonus €${bonusAmount}, code ${appliedPromoCode}`
        : `Deposit approved. Method ${deposit.method}. Amount €${deposit.amount}`,
    });
  }

  return {
    alreadyProcessed: false,
    deposit,
    user,
  };
};

const extractCoinRemitterPayload = (body) => {
  const payload = body || {};
  const data = payload.data || payload;

  return {
    payload,
    data,
    invoiceId:
      data.invoice_id ||
      data.invoiceId ||
      data.invoice ||
      payload.invoice_id ||
      payload.invoiceId ||
      "",
    providerDepositId:
      data.id ||
      data.transaction_id ||
      data.tx_id ||
      data.txid ||
      payload.id ||
      payload.transaction_id ||
      payload.tx_id ||
      payload.txid ||
      "",
    customData1:
      data.custom_data1 ||
      data.customData1 ||
      payload.custom_data1 ||
      payload.customData1 ||
      "",
    customData2:
      data.custom_data2 ||
      data.customData2 ||
      payload.custom_data2 ||
      payload.customData2 ||
      "",
    status:
      data.status ||
      data.payment_status ||
      data.invoice_status ||
      payload.status ||
      payload.payment_status ||
      payload.invoice_status ||
      "",
    statusCode:
      data.status_code ??
      data.statusCode ??
      payload.status_code ??
      payload.statusCode ??
      null,
    coin:
      data.coin_symbol ||
      data.coin ||
      payload.coin_symbol ||
      payload.coin ||
      "",
    cryptoAmount:
      data.amount ||
      data.paid_amount?.[data.coin_symbol] ||
      payload.amount ||
      0,
    address: data.address || payload.address || "",
  };
};

const isCoinRemitterPaid = (status, statusCode) => {
  const cleanStatus = String(status || "").toLowerCase();

  return (
    cleanStatus === "paid" ||
    cleanStatus === "confirm" ||
    cleanStatus === "confirmed" ||
    cleanStatus === "completed" ||
    cleanStatus === "success" ||
    cleanStatus === "over paid" ||
    cleanStatus === "under paid" ||
    Number(statusCode) === 1
  );
};

// COINREMITTER WEBHOOK HEALTH CHECK / VALIDATION
router.get("/coinremitter/webhook", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "CoinRemitter webhook active",
    provider: "coinremitter",
  });
});

// COINREMITTER WEBHOOK RECEIVER
router.post("/coinremitter/webhook", async (req, res) => {
  try {
    const parsed = extractCoinRemitterPayload(req.body);

    console.log("CoinRemitter webhook received:", parsed.payload);

    let deposit = null;

    if (parsed.customData1) {
      deposit = await Deposit.findOne({
        paymentReference: parsed.customData1,
      });
    }

    if (!deposit && parsed.invoiceId) {
      deposit = await Deposit.findOne({
        provider: "coinremitter",
        providerInvoiceId: parsed.invoiceId,
      });
    }

    if (!deposit && parsed.providerDepositId) {
      deposit = await Deposit.findOne({
        provider: "coinremitter",
        providerDepositId: parsed.providerDepositId,
      });
    }

    if (!deposit) {
      return res.status(200).json({
        success: true,
        message: "Webhook received but deposit was not matched",
      });
    }

    deposit.providerRaw = parsed.payload;
    deposit.providerStatus = normalizeText(parsed.status);

    if (parsed.providerDepositId && !deposit.providerDepositId) {
      deposit.providerDepositId = parsed.providerDepositId;
    }

    if (parsed.cryptoAmount) {
      deposit.cryptoAmount =
        Number(parsed.cryptoAmount) || deposit.cryptoAmount || 0;
    }

    if (parsed.address) {
      deposit.cryptoAddress = parsed.address;
    }

    await deposit.save();

    if (isCoinRemitterPaid(parsed.status, parsed.statusCode)) {
      await approveDepositAndCreditUser(
        deposit,
        `Auto approved by CoinRemitter webhook. Status: ${
          parsed.status || parsed.statusCode
        }`
      );
    }

    return res.status(200).json({
      success: true,
      message: "CoinRemitter webhook processed",
    });
  } catch (error) {
    console.error("CoinRemitter webhook error:", error.message);

    return res.status(200).json({
      success: false,
      message: "CoinRemitter webhook error",
    });
  }
});

// USER CREATES COINREMITTER CRYPTO INVOICE
router.post("/coinremitter/create-invoice", protect, async (req, res) => {
  try {
    const { amount, promoCode, coin } = req.body;

    const numericAmount = Number(amount);
    const cleanCoin = normalizeCoin(coin);

    if (Number.isNaN(numericAmount) || numericAmount < 1) {
      return res.status(400).json({
        success: false,
        message: "Deposit amount must be at least 1 EUR",
      });
    }

    if (!allowedCryptoCoins.includes(cleanCoin)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported crypto coin",
      });
    }

    const wallet = createCoinRemitterWallet(cleanCoin);

    const cleanPromoCode = promoCode
      ? String(promoCode).trim().toUpperCase()
      : "";

    const paymentReference = await createUniquePaymentReference();

    const clientUrl = getClientUrl();
    const apiBaseUrl = getApiBaseUrl();

    const invoiceParams = {
      amount: String(formatAmount(numericAmount)),
      name: `EB ${cleanCoin}`,
      email: req.user.email || "",
      fiat_currency: "EUR",
      expiry_time_in_minutes: "60",
      notify_url:
        process.env.COINREMITTER_WEBHOOK_URL ||
        `${apiBaseUrl}/deposits/coinremitter/webhook`,
      success_url:
        process.env.COINREMITTER_SUCCESS_URL ||
        `${clientUrl}/wallet?deposit=success`,
      fail_url:
        process.env.COINREMITTER_CANCEL_URL ||
        `${clientUrl}/wallet?deposit=cancel`,
      description: "",
      custom_data1: paymentReference,
      custom_data2: String(req.user._id),
    };

    console.log("CoinRemitter invoice params:", {
      ...invoiceParams,
      email: req.user.email ? "user-email-present" : "missing-email",
      custom_data2: "hidden-user-id",
    });

    const invoice = await wallet.createInvoice(invoiceParams);

    console.log("CoinRemitter invoice response:", invoice);

    if (!invoice || invoice.success === false || !invoice.data?.url) {
      return res.status(400).json({
        success: false,
        message:
          invoice?.msg ||
          invoice?.message ||
          "CoinRemitter could not create invoice",
        providerResponse: invoice,
      });
    }

    const deposit = await Deposit.create({
      userId: req.user._id,
      amount: formatAmount(numericAmount),
      promoCode: cleanPromoCode,
      bonusAmount: 0,
      finalAmount: formatAmount(numericAmount),
      method: "crypto",
      cryptoCoin: cleanCoin,
      cryptoNetwork: coinNetworks[cleanCoin],
      cryptoAmount: Number(invoice.data.amount || 0),
      cryptoAddress: "",
      provider: "coinremitter",
      providerDepositId: invoice.data.id || "",
      providerInvoiceId: invoice.data.invoice_id || "",
      providerInvoiceUrl: invoice.data.url || "",
      providerStatus: invoice.data.status || "Pending",
      providerRaw: invoice,
      paymentReference,
      userNote: `${cleanCoin} CoinRemitter invoice`,
      status: "pending",
      adminNote: "",
    });

    res.status(201).json({
      success: true,
      message: "Crypto invoice created",
      deposit,
      invoice: {
        id: invoice.data.id,
        invoiceId: invoice.data.invoice_id,
        url: invoice.data.url,
        coin: cleanCoin,
        coinName: coinLabels[cleanCoin],
        amount: invoice.data.amount,
        totalAmount: invoice.data.total_amount,
        status: invoice.data.status,
      },
    });
  } catch (error) {
    console.error("CoinRemitter create invoice error:", error);

    res.status(error.status || 500).json({
      success: false,
      message: `CoinRemitter invoice error: ${
        error.message || "Create crypto invoice error"
      }`,
    });
  }
});

// USER CREATES MANUAL DEPOSIT REQUEST
router.post("/", protect, async (req, res) => {
  try {
    const { amount, promoCode, method, userNote } = req.body;

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Deposit amount must be positive",
      });
    }

    const cleanMethod = normalizeMethod(method);

    if (!allowedManualMethods.includes(cleanMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid manual payment method",
      });
    }

    const cleanPromoCode = promoCode
      ? String(promoCode).trim().toUpperCase()
      : "";
    const cleanUserNote = normalizeText(userNote);
    const paymentReference = await createUniquePaymentReference();

    const deposit = await Deposit.create({
      userId: req.user._id,
      amount: formatAmount(numericAmount),
      promoCode: cleanPromoCode,
      bonusAmount: 0,
      finalAmount: formatAmount(numericAmount),
      method: cleanMethod,
      paymentReference,
      userNote: cleanUserNote,
      status: "pending",
      adminNote: "",
    });

    res.status(201).json({
      success: true,
      message: "Deposit request created. Waiting for admin approval.",
      deposit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Create deposit error",
      error: error.message,
    });
  }
});

// USER GETS OWN DEPOSITS
router.get("/my", protect, async (req, res) => {
  try {
    const deposits = await Deposit.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: deposits.length,
      deposits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get my deposits error",
      error: error.message,
    });
  }
});

// ADMIN GETS ALL DEPOSITS
router.get("/admin/all", protect, adminOnly, async (req, res) => {
  try {
    const { status, method, search } = req.query;

    const filter = {};

    if (status && status !== "all") {
      filter.status = String(status).toLowerCase().trim();
    }

    if (method && method !== "all") {
      const cleanMethod = normalizeMethod(method);

      if (allowedManualMethods.includes(cleanMethod)) {
        filter.method = cleanMethod;
      }
    }

    if (search && search.trim() !== "") {
      const cleanSearch = search.trim();

      filter.$or = [
        { paymentReference: { $regex: cleanSearch, $options: "i" } },
        { promoCode: { $regex: cleanSearch, $options: "i" } },
        { userNote: { $regex: cleanSearch, $options: "i" } },
        { adminNote: { $regex: cleanSearch, $options: "i" } },
        { providerInvoiceId: { $regex: cleanSearch, $options: "i" } },
        { cryptoCoin: { $regex: cleanSearch, $options: "i" } },
      ];
    }

    const deposits = await Deposit.find(filter)
      .populate("userId", "email balance role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: deposits.length,
      deposits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Get all deposits error",
      error: error.message,
    });
  }
});

// ADMIN APPROVES DEPOSIT
router.put("/admin/:id/approve", protect, adminOnly, async (req, res) => {
  try {
    const { adminNote } = req.body;

    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) {
      return res.status(404).json({
        success: false,
        message: "Deposit not found",
      });
    }

    if (deposit.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Deposit already processed",
      });
    }

    const result = await approveDepositAndCreditUser(deposit, adminNote);

    const populatedDeposit = await Deposit.findById(deposit._id).populate(
      "userId",
      "email balance role"
    );

    res.json({
      success: true,
      message: "Deposit approved successfully",
      deposit: populatedDeposit,
      user: result.user
        ? {
            id: result.user._id,
            email: result.user.email,
            balance: result.user.balance,
          }
        : null,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Approve deposit error",
    });
  }
});

// ADMIN REJECTS DEPOSIT
router.put("/admin/:id/reject", protect, adminOnly, async (req, res) => {
  try {
    const { adminNote } = req.body;

    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) {
      return res.status(404).json({
        success: false,
        message: "Deposit not found",
      });
    }

    if (deposit.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Deposit already processed",
      });
    }

    deposit.status = "rejected";
    deposit.adminNote = normalizeText(adminNote);
    deposit.finalAmount = formatAmount(deposit.finalAmount || deposit.amount);
    await deposit.save();

    const populatedDeposit = await Deposit.findById(deposit._id).populate(
      "userId",
      "email balance role"
    );

    res.json({
      success: true,
      message: "Deposit rejected",
      deposit: populatedDeposit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Reject deposit error",
      error: error.message,
    });
  }
});

export default router;