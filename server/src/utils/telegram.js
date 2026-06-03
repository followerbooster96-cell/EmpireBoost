const isTelegramEnabled = () => {
  return (
    String(process.env.TELEGRAM_NOTIFICATIONS_ENABLED || "false").toLowerCase() ===
      "true" &&
    Boolean(process.env.TELEGRAM_BOT_TOKEN) &&
    Boolean(process.env.TELEGRAM_ADMIN_CHAT_ID)
  );
};

const safeValue = (value, fallback = "-") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return String(value);
};

const limitText = (value, maxLength = 3500) => {
  const text = safeValue(value, "");

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}...`;
};

export const getRequestMeta = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  const ip = forwardedFor
    ? String(forwardedFor).split(",")[0].trim()
    : req.ip || req.socket?.remoteAddress || "-";

  const userAgent = req.headers["user-agent"] || "-";

  return {
    ip,
    userAgent,
  };
};

export const sendTelegramNotification = async (message) => {
  try {
    if (!isTelegramEnabled()) {
      return false;
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: limitText(message),
          disable_web_page_preview: true,
        }),
      }
    );

    if (!response.ok) {
      const data = await response.text();
      console.error("Telegram notification failed:", data);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Telegram notification error:", error.message);
    return false;
  }
};

export const buildLoginNotification = ({ user, req, provider = "local" }) => {
  const meta = getRequestMeta(req);

  return [
    "🔐 EmpireBoost Login",
    "",
    `User: ${safeValue(user?.email)}`,
    `Role: ${safeValue(user?.role)}`,
    `Provider: ${safeValue(provider)}`,
    `Balance: €${safeValue(user?.balance, "0")}`,
    `IP: ${safeValue(meta.ip)}`,
    `Device: ${safeValue(meta.userAgent)}`,
    `Time: ${new Date().toLocaleString()}`,
  ].join("\n");
};

export const buildRegisterNotification = ({ user, req, provider = "local" }) => {
  const meta = getRequestMeta(req);

  return [
    "🆕 EmpireBoost New Register",
    "",
    `User: ${safeValue(user?.email)}`,
    `Role: ${safeValue(user?.role)}`,
    `Provider: ${safeValue(provider)}`,
    `IP: ${safeValue(meta.ip)}`,
    `Device: ${safeValue(meta.userAgent)}`,
    `Time: ${new Date().toLocaleString()}`,
  ].join("\n");
};

export const buildOrderNotification = ({ user, service, order }) => {
  return [
    "🛒 EmpireBoost New Order",
    "",
    `User: ${safeValue(user?.email)}`,
    `Service: ${safeValue(service?.name)}`,
    `Platform: ${safeValue(service?.platform)}`,
    `Type: ${safeValue(service?.type)}`,
    `Quantity: ${safeValue(order?.quantity)}`,
    `Charge: €${safeValue(order?.charge)}`,
    `Link: ${safeValue(order?.link)}`,
    `Order ID: ${safeValue(order?._id)}`,
    `Time: ${new Date().toLocaleString()}`,
  ].join("\n");
};

export const buildDepositNotification = ({ user, deposit }) => {
  return [
    "💰 EmpireBoost New Deposit Request",
    "",
    `User: ${safeValue(user?.email)}`,
    `Method: ${safeValue(deposit?.method)}`,
    `Amount: €${safeValue(deposit?.amount)}`,
    `Final amount: €${safeValue(deposit?.finalAmount || deposit?.amount)}`,
    `Promo: ${safeValue(deposit?.promoCode)}`,
    `Reference: ${safeValue(deposit?.paymentReference)}`,
    `Status: ${safeValue(deposit?.status)}`,
    "",
    `Info: ${safeValue(deposit?.userNote)}`,
    "",
    `Time: ${new Date().toLocaleString()}`,
  ].join("\n");
};

export const buildSupportNotification = ({ user, ticket }) => {
  const firstMessage = ticket?.messages?.[0]?.message || "-";

  return [
    "🎫 EmpireBoost New Support Ticket",
    "",
    `User: ${safeValue(user?.email)}`,
    `Category: ${safeValue(ticket?.category)}`,
    `Subject: ${safeValue(ticket?.subject)}`,
    `Status: ${safeValue(ticket?.status)}`,
    `Ticket ID: ${safeValue(ticket?._id)}`,
    "",
    `Message: ${safeValue(firstMessage)}`,
    "",
    `Time: ${new Date().toLocaleString()}`,
  ].join("\n");
};