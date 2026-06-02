const getPayPalMode = () => {
  return String(process.env.PAYPAL_MODE || "sandbox").trim().toLowerCase();
};

const getPayPalBaseUrl = () => {
  const mode = getPayPalMode();

  if (mode === "live") {
    return "https://api-m.paypal.com";
  }

  return "https://api-m.sandbox.paypal.com";
};

const safePayPalError = (data) => {
  return {
    name: data?.name,
    message: data?.message,
    error: data?.error,
    error_description: data?.error_description,
    details: data?.details,
    debug_id: data?.debug_id,
    links: data?.links,
  };
};

export const getPayPalAccessToken = async () => {
  const mode = getPayPalMode();
  const baseUrl = getPayPalBaseUrl();

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  console.log("PayPal auth started:", {
    mode,
    baseUrl,
    hasClientId: Boolean(clientId),
    hasClientSecret: Boolean(clientSecret),
    clientIdPreview: clientId ? `${clientId.slice(0, 8)}...${clientId.slice(-6)}` : null,
  });

  if (!clientId || !clientSecret) {
    throw new Error("PayPal client ID or secret is missing in environment variables");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("PayPal auth error:", {
      status: response.status,
      statusText: response.statusText,
      mode,
      baseUrl,
      paypal: safePayPalError(data),
    });

    throw new Error(
      data?.error_description ||
        data?.message ||
        data?.error ||
        `PayPal auth failed with status ${response.status}`
    );
  }

  console.log("PayPal auth success:", {
    mode,
    tokenType: data?.token_type,
    expiresIn: data?.expires_in,
  });

  return data.access_token;
};

export const createPayPalOrder = async ({
  amount,
  currency,
  returnUrl,
  cancelUrl,
}) => {
  const mode = getPayPalMode();
  const baseUrl = getPayPalBaseUrl();

  const cleanAmount = Number(amount);
  const cleanCurrency = String(currency || "EUR").trim().toUpperCase();

  if (!Number.isFinite(cleanAmount) || cleanAmount <= 0) {
    throw new Error("Invalid PayPal amount");
  }

  if (!returnUrl || !cancelUrl) {
    throw new Error("PayPal returnUrl or cancelUrl is missing");
  }

  const accessToken = await getPayPalAccessToken();

  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: cleanCurrency,
          value: cleanAmount.toFixed(2),
        },
        description: "EmpireBoost wallet top-up",
      },
    ],
    application_context: {
      brand_name: "EmpireBoost",
      landing_page: "LOGIN",
      user_action: "PAY_NOW",
      return_url: returnUrl,
      cancel_url: cancelUrl,
    },
  };

  console.log("PayPal create order started:", {
    mode,
    baseUrl,
    amount: cleanAmount.toFixed(2),
    currency: cleanCurrency,
    returnUrl,
    cancelUrl,
  });

  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("PayPal create order error:", {
      status: response.status,
      statusText: response.statusText,
      mode,
      baseUrl,
      request: {
        amount: cleanAmount.toFixed(2),
        currency: cleanCurrency,
        returnUrl,
        cancelUrl,
      },
      paypal: safePayPalError(data),
    });

    throw new Error(
      data?.message ||
        data?.error_description ||
        data?.error ||
        `PayPal create order failed with status ${response.status}`
    );
  }

  console.log("PayPal create order success:", {
    mode,
    orderId: data?.id,
    status: data?.status,
    links: Array.isArray(data?.links)
      ? data.links.map((link) => ({
          rel: link.rel,
          method: link.method,
          href: link.href,
        }))
      : [],
  });

  return data;
};

export const capturePayPalOrder = async (paypalOrderId) => {
  const mode = getPayPalMode();
  const baseUrl = getPayPalBaseUrl();

  if (!paypalOrderId) {
    throw new Error("PayPal order ID is missing");
  }

  const accessToken = await getPayPalAccessToken();

  console.log("PayPal capture started:", {
    mode,
    baseUrl,
    paypalOrderId,
  });

  const response = await fetch(
    `${baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("PayPal capture error:", {
      status: response.status,
      statusText: response.statusText,
      mode,
      baseUrl,
      paypalOrderId,
      paypal: safePayPalError(data),
    });

    throw new Error(
      data?.message ||
        data?.error_description ||
        data?.error ||
        `PayPal capture failed with status ${response.status}`
    );
  }

  console.log("PayPal capture success:", {
    mode,
    paypalOrderId,
    status: data?.status,
  });

  return data;
};