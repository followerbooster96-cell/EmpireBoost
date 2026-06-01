export const BASE_CURRENCY = "EUR";
export const CURRENCY_STORAGE_KEY = "empireboost_selected_currency";
export const CURRENCY_RATES_STORAGE_KEY = "empireboost_exchange_rates_cache";

export const SUPPORTED_CURRENCIES = [
  {
    code: "EUR",
    label: "Euro",
    symbol: "€",
    flag: "🇪🇺",
    locale: "de-DE",
    decimals: 2,
  },
  {
    code: "CHF",
    label: "Swiss Franc",
    symbol: "CHF",
    flag: "🇨🇭",
    locale: "de-CH",
    decimals: 2,
  },
  {
    code: "USD",
    label: "US Dollar",
    symbol: "$",
    flag: "🇺🇸",
    locale: "en-US",
    decimals: 2,
  },
  {
    code: "GBP",
    label: "British Pound",
    symbol: "£",
    flag: "🇬🇧",
    locale: "en-GB",
    decimals: 2,
  },
  {
    code: "RSD",
    label: "Serbian Dinar",
    symbol: "RSD",
    flag: "🇷🇸",
    locale: "sr-RS",
    decimals: 0,
  },
];

export const FALLBACK_EXCHANGE_RATES = {
  EUR: 1,
  CHF: 0.94,
  USD: 1.08,
  GBP: 0.84,
  RSD: 117.1,
};

export function getCurrencyMeta(currencyCode) {
  return (
    SUPPORTED_CURRENCIES.find((currency) => currency.code === currencyCode) ||
    SUPPORTED_CURRENCIES[0]
  );
}

export function getStoredCurrency() {
  const storedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY);

  if (
    storedCurrency &&
    SUPPORTED_CURRENCIES.some((currency) => currency.code === storedCurrency)
  ) {
    return storedCurrency;
  }

  return BASE_CURRENCY;
}

export function saveStoredCurrency(currencyCode) {
  const safeCurrency = SUPPORTED_CURRENCIES.some(
    (currency) => currency.code === currencyCode
  )
    ? currencyCode
    : BASE_CURRENCY;

  localStorage.setItem(CURRENCY_STORAGE_KEY, safeCurrency);

  window.dispatchEvent(
    new CustomEvent("empire-currency-updated", {
      detail: {
        currency: safeCurrency,
      },
    })
  );

  return safeCurrency;
}

export function getCachedExchangeRates() {
  try {
    const cached = localStorage.getItem(CURRENCY_RATES_STORAGE_KEY);

    if (!cached) return null;

    const parsed = JSON.parse(cached);

    if (!parsed || !parsed.rates || !parsed.timestamp) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function saveCachedExchangeRates(payload) {
  try {
    localStorage.setItem(
      CURRENCY_RATES_STORAGE_KEY,
      JSON.stringify({
        ...payload,
        timestamp: Date.now(),
      })
    );
  } catch {
    return null;
  }

  return payload;
}

export async function fetchLatestExchangeRates() {
  const cachedRates = getCachedExchangeRates();
  const sixHours = 6 * 60 * 60 * 1000;

  if (cachedRates && Date.now() - cachedRates.timestamp < sixHours) {
    return {
      base: BASE_CURRENCY,
      rates: {
        ...FALLBACK_EXCHANGE_RATES,
        ...cachedRates.rates,
        EUR: 1,
      },
      date: cachedRates.date || "cached",
      source: cachedRates.source || "cache",
    };
  }

  const targetCurrencies = SUPPORTED_CURRENCIES.filter(
    (currency) => currency.code !== BASE_CURRENCY
  )
    .map((currency) => currency.code)
    .join(",");

  try {
    const response = await fetch(
      `https://api.frankfurter.dev/v2/rates?base=${BASE_CURRENCY}&quotes=${targetCurrencies}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Exchange rate request failed");
    }

    const data = await response.json();

    const livePayload = {
      base: BASE_CURRENCY,
      rates: {
        ...FALLBACK_EXCHANGE_RATES,
        ...(data.rates || {}),
        EUR: 1,
      },
      date: data.date || new Date().toISOString().slice(0, 10),
      source: "live",
    };

    saveCachedExchangeRates(livePayload);

    return livePayload;
  } catch {
    if (cachedRates) {
      return {
        base: BASE_CURRENCY,
        rates: {
          ...FALLBACK_EXCHANGE_RATES,
          ...cachedRates.rates,
          EUR: 1,
        },
        date: cachedRates.date || "cached",
        source: "cache",
      };
    }

    return {
      base: BASE_CURRENCY,
      rates: FALLBACK_EXCHANGE_RATES,
      date: "fallback",
      source: "fallback",
    };
  }
}

export function convertFromBaseCurrency(amount, targetCurrency, rates) {
  const numberAmount = Number(amount || 0);
  const safeRates = rates || FALLBACK_EXCHANGE_RATES;
  const rate = Number(safeRates[targetCurrency] || 1);

  return numberAmount * rate;
}

export function formatCurrencyFromBase(amount, targetCurrency, rates) {
  const currencyMeta = getCurrencyMeta(targetCurrency);
  const convertedAmount = convertFromBaseCurrency(
    amount,
    currencyMeta.code,
    rates
  );

  try {
    return new Intl.NumberFormat(currencyMeta.locale, {
      style: "currency",
      currency: currencyMeta.code,
      minimumFractionDigits: currencyMeta.decimals,
      maximumFractionDigits: currencyMeta.decimals,
    }).format(convertedAmount);
  } catch {
    const fixedAmount = convertedAmount.toFixed(currencyMeta.decimals);

    if (currencyMeta.code === "EUR") return `€${fixedAmount}`;
    if (currencyMeta.code === "USD") return `$${fixedAmount}`;
    if (currencyMeta.code === "GBP") return `£${fixedAmount}`;
    if (currencyMeta.code === "CHF") return `CHF ${fixedAmount}`;

    return `${fixedAmount} ${currencyMeta.code}`;
  }
}

export function getCurrencyRateText(targetCurrency, rates, date, source) {
  const currencyMeta = getCurrencyMeta(targetCurrency);
  const safeRates = rates || FALLBACK_EXCHANGE_RATES;
  const rate = Number(safeRates[currencyMeta.code] || 1);

  if (currencyMeta.code === BASE_CURRENCY) {
    return `Base currency: ${BASE_CURRENCY}`;
  }

  const sourceText =
    source === "live"
      ? "live rate"
      : source === "cache"
        ? "cached rate"
        : "fallback rate";

  return `1 ${BASE_CURRENCY} ≈ ${rate.toFixed(4)} ${currencyMeta.code} · ${sourceText}${
    date ? ` · ${date}` : ""
  }`;
}