import { useEffect, useState } from "react";
import {
  FALLBACK_EXCHANGE_RATES,
  fetchLatestExchangeRates,
  formatCurrencyFromBase,
  getCurrencyMeta,
  getCurrencyRateText,
  getStoredCurrency,
} from "./currency.js";

function useCurrency() {
  const [selectedCurrency, setSelectedCurrency] = useState(getStoredCurrency());
  const [exchangeRates, setExchangeRates] = useState(FALLBACK_EXCHANGE_RATES);
  const [exchangeRateDate, setExchangeRateDate] = useState("");
  const [exchangeRateSource, setExchangeRateSource] = useState("fallback");
  const [currencyLoading, setCurrencyLoading] = useState(false);

  const selectedCurrencyMeta = getCurrencyMeta(selectedCurrency);

  const loadRates = async () => {
    setCurrencyLoading(true);

    try {
      const data = await fetchLatestExchangeRates();

      setExchangeRates(data.rates || FALLBACK_EXCHANGE_RATES);
      setExchangeRateDate(data.date || "");
      setExchangeRateSource(data.source || "fallback");
    } finally {
      setCurrencyLoading(false);
    }
  };

  useEffect(() => {
    loadRates();

    const handleCurrencyUpdated = () => {
      setSelectedCurrency(getStoredCurrency());
    };

    const handleStorageChange = () => {
      setSelectedCurrency(getStoredCurrency());
    };

    window.addEventListener("empire-currency-updated", handleCurrencyUpdated);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("empire-currency-updated", handleCurrencyUpdated);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const formatMoney = (amount) => {
    return formatCurrencyFromBase(amount, selectedCurrency, exchangeRates);
  };

  const currencyRateText = getCurrencyRateText(
    selectedCurrency,
    exchangeRates,
    exchangeRateDate,
    exchangeRateSource
  );

  return {
    selectedCurrency,
    selectedCurrencyMeta,
    exchangeRates,
    exchangeRateDate,
    exchangeRateSource,
    currencyLoading,
    currencyRateText,
    formatMoney,
    refreshRates: loadRates,
  };
}

export default useCurrency;