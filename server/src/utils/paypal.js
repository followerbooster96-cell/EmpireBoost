const getPayPalBaseUrl = () => {
  const mode = String(process.env.PAYPAL_MODE || "sandbox").toLowerCase();

  if (mode === "live") {
    return "https://api-m.paypal.com";
  }

  return "https://api-m.sandbox.paypal.com";
};

export const getPayPalAccessToken = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal client ID or secret is missing in .env");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error_description || data?.message || "PayPal auth failed");
  }

  return data.access_token;
};

export const createPayPalOrder = async ({ amount, currency, returnUrl, cancelUrl }) => {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: Number(amount).toFixed(2),
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
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "PayPal create order failed");
  }

  return data;
};

export const capturePayPalOrder = async (paypalOrderId) => {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${getPayPalBaseUrl()}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "PayPal capture failed");
  }

  return data;
};