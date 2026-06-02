import { useEffect, useMemo, useState } from "react";
import api from "../lib/api.js";
import useCurrency from "../lib/useCurrency.js";
import { getStoredLanguage } from "../lib/language.js";
import "./Wallet.css";

const WALLET_TRANSLATIONS = {
  en: {
    crypto: "Crypto",
    manual: "Manual",
    instant: "Instant",
    backup: "Backup",
    fast: "Fast",
    classic: "Classic",
    comingSoon: "Coming soon",
    ltc: "Litecoin",
    doge: "Dogecoin",
    btc: "Bitcoin",
    dash: "Dash",

    cryptoDescription: "Crypto wallet top-up with CoinRemitter checkout.",
    ltcDescription: "Litecoin checkout is active now.",
    dogeDescription: "Dogecoin checkout will be added next.",
    btcDescription: "Bitcoin checkout will be added later.",
    dashDescription: "Dash checkout will be added later.",

    floatingWallet: "Wallet",
    floatingBalance: "Balance",
    floatingCheckout: "Checkout",
    floatingTopUp: "Top Up",
    floatingFunds: "Funds",
    floatingSecure: "Secure",
    floatingCompleted: "Completed",
    floatingPending: "Pending",
    floatingOrders: "Orders",
    floatingGrowth: "Growth",
    floatingCreator: "Creator",
    floatingRevenue: "Revenue",
    floatingPayments: "Payments",
    floatingTracking: "Tracking",

    requestCreated: "invoice created successfully.",
    enterMinimum: "Please enter at least 1.00 EUR.",
    couldNotCreatePayment: "Could not create crypto payment.",
    coinNotReady: "This coin is not connected yet. Use Litecoin for now.",

    heroBadge: "Premium crypto wallet top-up",
    heroTitle: "Fund your wallet with crypto checkout.",
    heroText:
      "Choose a crypto coin and create a secure CoinRemitter invoice. Litecoin is live first, more coins will be connected next.",
    addFunds: "Add Funds",
    paymentHistory: "Payment History",

    currentBalance: "Current balance",
    availableOrders: "Available for new orders",
    shownIn: "shown in",
    payments: "Payments",
    pending: "Pending",

    walletBalance: "Wallet balance",
    readyToSpend: "Ready to spend on services",
    totalDeposited: "Total deposited",
    completedPaymentsOnly: "Approved deposits only",
    pendingPayments: "Pending deposits",
    waitingNotCaptured: "Waiting for confirmation",
    totalPayments: "Total deposits",
    allAttempts: "All deposit requests",

    addFundsPanel: "Add funds",
    payWithCrypto: "Top up with Crypto",

    cryptoLong:
      "Create a crypto invoice. You will be redirected to CoinRemitter checkout and your wallet balance is credited after confirmation.",

    topupAmount: "Top-up amount",
    exampleAmount: "Example: 25.00",
    paymentCurrency: "Payment currency",
    cryptoCoin: "Crypto coin",
    promoOptional: "Promo code optional",
    promoPlaceholder: "Example: BOOST10",
    noteOptional: "Payment note",
    notePlaceholder: "Optional note for admin...",
    backupMethod: "CoinRemitter checkout",
    paymentPreview: "Payment preview",
    manualPreview: "Invoice is created in EUR. Display preview is shown in",
    creatingRequest: "Creating invoice...",
    createRequest: "Create",
    request: "Invoice",
    currencyInfo:
      "Wallet and payment calculations stay in EUR. The selected currency is only a display conversion so pricing stays safe and clear.",

    paymentGuide: "Payment guide",
    howItWorks: "How it works",
    stepOneTitle: "Choose coin",
    stepOneText: "Select Litecoin now. Dogecoin, Bitcoin and Dash are prepared for later.",
    stepTwoTitle: "Enter amount",
    stepTwoText: "Payment amount is entered in EUR to keep wallet accounting accurate.",
    stepThreeTitle: "Open checkout",
    stepThreeText: "CoinRemitter creates an invoice and opens the payment page.",
    stepFourTitle: "Balance updates",
    stepFourText:
      "After blockchain confirmation, webhook can approve the deposit and credit your wallet.",

    myPayments: "My deposits",
    noPaymentsYet: "No deposits yet",
    noPaymentsText: "Your crypto deposit requests will appear here.",
    provider: "Provider",
    reference: "Reference",
    amount: "Amount",
    display: "Display",
    status: "Status",
    info: "Info",
    date: "Date",
    originalCurrency: "Original payment currency",
  },

  de: {
    crypto: "Crypto",
    manual: "Manuell",
    instant: "Instant",
    backup: "Backup",
    fast: "Schnell",
    classic: "Klassisch",
    comingSoon: "Kommt bald",
    ltc: "Litecoin",
    doge: "Dogecoin",
    btc: "Bitcoin",
    dash: "Dash",

    cryptoDescription: "Crypto Wallet-Aufladung mit CoinRemitter Checkout.",
    ltcDescription: "Litecoin Checkout ist jetzt aktiv.",
    dogeDescription: "Dogecoin Checkout wird als nächstes hinzugefügt.",
    btcDescription: "Bitcoin Checkout wird später hinzugefügt.",
    dashDescription: "Dash Checkout wird später hinzugefügt.",

    floatingWallet: "Wallet",
    floatingBalance: "Guthaben",
    floatingCheckout: "Checkout",
    floatingTopUp: "Aufladen",
    floatingFunds: "Funds",
    floatingSecure: "Sicher",
    floatingCompleted: "Abgeschlossen",
    floatingPending: "Ausstehend",
    floatingOrders: "Bestellungen",
    floatingGrowth: "Growth",
    floatingCreator: "Creator",
    floatingRevenue: "Umsatz",
    floatingPayments: "Zahlungen",
    floatingTracking: "Tracking",

    requestCreated: "Invoice erfolgreich erstellt.",
    enterMinimum: "Bitte gib mindestens 1.00 EUR ein.",
    couldNotCreatePayment: "Crypto-Zahlung konnte nicht erstellt werden.",
    coinNotReady: "Dieser Coin ist noch nicht verbunden. Nutze aktuell Litecoin.",

    heroBadge: "Premium Crypto Wallet Aufladung",
    heroTitle: "Lade dein Wallet mit Crypto Checkout auf.",
    heroText:
      "Wähle einen Coin und erstelle eine sichere CoinRemitter Invoice. Litecoin ist zuerst live, weitere Coins kommen danach.",
    addFunds: "Guthaben aufladen",
    paymentHistory: "Zahlungsverlauf",

    currentBalance: "Aktuelles Guthaben",
    availableOrders: "Verfügbar für neue Bestellungen",
    shownIn: "angezeigt in",
    payments: "Zahlungen",
    pending: "Ausstehend",

    walletBalance: "Wallet-Guthaben",
    readyToSpend: "Bereit für Services",
    totalDeposited: "Gesamt eingezahlt",
    completedPaymentsOnly: "Nur genehmigte Deposits",
    pendingPayments: "Ausstehende Deposits",
    waitingNotCaptured: "Wartet auf Bestätigung",
    totalPayments: "Deposits gesamt",
    allAttempts: "Alle Deposit-Anfragen",

    addFundsPanel: "Guthaben aufladen",
    payWithCrypto: "Mit Crypto aufladen",

    cryptoLong:
      "Erstelle eine Crypto Invoice. Du wirst zum CoinRemitter Checkout weitergeleitet und dein Guthaben wird nach Bestätigung gutgeschrieben.",

    topupAmount: "Aufladebetrag",
    exampleAmount: "Beispiel: 25.00",
    paymentCurrency: "Zahlungswährung",
    cryptoCoin: "Crypto Coin",
    promoOptional: "Promo-Code optional",
    promoPlaceholder: "Beispiel: BOOST10",
    noteOptional: "Zahlungsnotiz",
    notePlaceholder: "Optionale Notiz für Admin...",
    backupMethod: "CoinRemitter Checkout",
    paymentPreview: "Zahlungsvorschau",
    manualPreview: "Invoice wird in EUR erstellt. Vorschau wird angezeigt in",
    creatingRequest: "Invoice wird erstellt...",
    createRequest: "Erstelle",
    request: "Invoice",
    currencyInfo:
      "Wallet- und Zahlungsberechnungen bleiben in EUR. Die ausgewählte Währung ist nur eine Anzeigeumrechnung.",

    paymentGuide: "Zahlungsanleitung",
    howItWorks: "So funktioniert es",
    stepOneTitle: "Coin wählen",
    stepOneText: "Wähle aktuell Litecoin. Dogecoin, Bitcoin und Dash sind vorbereitet.",
    stepTwoTitle: "Betrag eingeben",
    stepTwoText: "Der Zahlungsbetrag wird in EUR eingegeben, damit die Wallet korrekt bleibt.",
    stepThreeTitle: "Checkout öffnen",
    stepThreeText: "CoinRemitter erstellt eine Invoice und öffnet die Zahlungsseite.",
    stepFourTitle: "Guthaben aktualisiert",
    stepFourText:
      "Nach Blockchain-Bestätigung kann der Webhook den Deposit genehmigen und Wallet gutschreiben.",

    myPayments: "Meine Deposits",
    noPaymentsYet: "Noch keine Deposits",
    noPaymentsText: "Deine Crypto-Deposit-Anfragen erscheinen hier.",
    provider: "Anbieter",
    reference: "Referenz",
    amount: "Betrag",
    display: "Anzeige",
    status: "Status",
    info: "Info",
    date: "Datum",
    originalCurrency: "Originale Zahlungswährung",
  },
};

function getWalletTranslations(languageCode) {
  return WALLET_TRANSLATIONS[languageCode] || WALLET_TRANSLATIONS.en;
}

function formatDate(value) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return "-";
  }
}

function getStatusClass(status) {
  const cleanStatus = String(status || "").toLowerCase();

  if (["completed", "approved", "paid"].includes(cleanStatus)) {
    return "walletStatusApproved";
  }

  if (["failed", "cancelled", "rejected"].includes(cleanStatus)) {
    return "walletStatusRejected";
  }

  return "walletStatusPending";
}

function PaymentLogo({ method }) {
  return (
    <div className="walletRealLogo walletCryptoLogo" aria-hidden="true">
      <span className="walletCryptoCoin">{method.short || "₿"}</span>
      <span className="walletCryptoText">{method.label || "Crypto"}</span>
    </div>
  );
}

function Wallet() {
  const { selectedCurrency, selectedCurrencyMeta, currencyRateText, formatMoney } =
    useCurrency();

  const [selectedLanguage, setSelectedLanguage] = useState(getStoredLanguage());
  const t = getWalletTranslations(selectedLanguage);

  const cryptoCoins = useMemo(
    () => [
      {
        value: "LTC",
        label: t.ltc,
        short: "Ł",
        mode: t.instant,
        modeKey: "instant",
        tag: "Live",
        description: t.ltcDescription,
        brandClass: "walletBrandCrypto",
        enabled: true,
      },
      {
        value: "DOGE",
        label: t.doge,
        short: "Ð",
        mode: t.comingSoon,
        modeKey: "manual",
        tag: t.comingSoon,
        description: t.dogeDescription,
        brandClass: "walletBrandCrypto",
        enabled: false,
      },
      {
        value: "BTC",
        label: t.btc,
        short: "₿",
        mode: t.comingSoon,
        modeKey: "manual",
        tag: t.comingSoon,
        description: t.btcDescription,
        brandClass: "walletBrandCrypto",
        enabled: false,
      },
      {
        value: "DASH",
        label: t.dash,
        short: "D",
        mode: t.comingSoon,
        modeKey: "manual",
        tag: t.comingSoon,
        description: t.dashDescription,
        brandClass: "walletBrandCrypto",
        enabled: false,
      },
    ],
    [t]
  );

  const floatingWalletItems = useMemo(
    () => [
      t.floatingWallet,
      t.floatingBalance,
      "Litecoin",
      "Dogecoin",
      "Bitcoin",
      "Dash",
      "CoinRemitter",
      t.floatingCheckout,
      t.floatingTopUp,
      t.floatingFunds,
      t.floatingSecure,
      t.floatingCompleted,
      t.floatingPending,
      t.floatingOrders,
      t.floatingGrowth,
      t.floatingCreator,
      t.fast,
      t.floatingRevenue,
      t.floatingPayments,
      t.floatingTracking,
    ],
    [t]
  );

  const [user, setUser] = useState(null);
  const [manualDeposits, setManualDeposits] = useState([]);

  const [selectedCoin, setSelectedCoin] = useState("LTC");
  const [amount, setAmount] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [userNote, setUserNote] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const activeMethod =
    cryptoCoins.find((method) => method.value === selectedCoin) || cryptoCoins[0];

  useEffect(() => {
    const syncLanguage = () => {
      setSelectedLanguage(getStoredLanguage());
    };

    window.addEventListener("empire-language-updated", syncLanguage);
    window.addEventListener("storage", syncLanguage);

    syncLanguage();

    return () => {
      window.removeEventListener("empire-language-updated", syncLanguage);
      window.removeEventListener("storage", syncLanguage);
    };
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));

        window.dispatchEvent(
          new CustomEvent("empire-user-updated", {
            detail: {
              user: res.data.user,
            },
          })
        );
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const loadManualDeposits = async () => {
    try {
      const res = await api.get("/deposits/my");
      setManualDeposits(res.data.deposits || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const loadWalletData = async () => {
    setIsLoading(true);
    await Promise.allSettled([loadUser(), loadManualDeposits()]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadWalletData();
  }, []);

  const walletStats = useMemo(() => {
    const completedManualDeposits = manualDeposits.filter((deposit) =>
      ["approved", "completed", "paid"].includes(String(deposit.status || "").toLowerCase())
    );

    const totalManualDeposited = completedManualDeposits.reduce(
      (sum, deposit) => sum + Number(deposit.finalAmount || deposit.amount || 0),
      0
    );

    const pendingManualDeposits = manualDeposits.filter((deposit) =>
      ["pending", "waiting", "review"].includes(String(deposit.status || "").toLowerCase())
    ).length;

    return {
      totalDeposited: totalManualDeposited,
      pendingPayments: pendingManualDeposits,
      requests: manualDeposits.length,
    };
  }, [manualDeposits]);

  const previewAmount = Number(amount || 0);

  const historyItems = useMemo(() => {
    return manualDeposits
      .map((deposit) => ({
        id: deposit._id,
        provider: deposit.cryptoCoin
          ? `${deposit.method || "crypto"} · ${deposit.cryptoCoin}`
          : deposit.method || "Manual",
        reference: deposit.providerInvoiceId || deposit.paymentReference || "-",
        amount: deposit.finalAmount || deposit.amount,
        originalCurrency: "EUR",
        status: deposit.status || "pending",
        info:
          deposit.providerInvoiceUrl ||
          deposit.userNote ||
          deposit.providerStatus ||
          "-",
        createdAt: deposit.createdAt,
      }))
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 8);
  }, [manualDeposits]);

  const createCryptoInvoice = async () => {
    const selected = cryptoCoins.find((coin) => coin.value === selectedCoin);

    if (!selected?.enabled) {
      setMessageType("error");
      setMessage(t.coinNotReady);
      return;
    }

    const res = await api.post("/deposits/coinremitter/create-invoice", {
      amount: Number(amount),
      promoCode,
      coin: selectedCoin,
      userNote,
    });

    setMessageType("success");
    setMessage(`${selected.label} ${t.requestCreated}`);

    setAmount("");
    setPromoCode("");
    setUserNote("");

    await Promise.allSettled([loadManualDeposits(), loadUser()]);

    const invoiceUrl = res.data?.invoice?.url;

    if (invoiceUrl) {
      window.location.href = invoiceUrl;
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!amount || Number(amount) < 1) {
      setMessageType("error");
      setMessage(t.enterMinimum);
      return;
    }

    setIsCreating(true);

    try {
      await createCryptoInvoice();
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || t.couldNotCreatePayment);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <main className="walletPagePro">
      <div className="walletAurora" aria-hidden="true">
        <span className="walletAuroraOne" />
        <span className="walletAuroraTwo" />
        <span className="walletAuroraThree" />
        <span className="walletAuroraFour" />
      </div>

      <div className="walletFloatingLayer" aria-hidden="true">
        {floatingWalletItems.map((item, index) => (
          <span className={`walletFloat walletFloat${index + 1}`} key={`${item}-${index}`}>
            {item}
          </span>
        ))}
      </div>

      <section className="walletHeroPro">
        <div className="walletHeroContent">
          <div className="walletBadgePro">
            <span />
            {t.heroBadge}
          </div>

          <h1>{t.heroTitle}</h1>

          <p>{t.heroText}</p>

          <div className="walletHeroActions">
            <a href="#wallet-add-funds" className="walletPrimaryBtn">
              {t.addFunds}
            </a>

            <a href="#wallet-deposits" className="walletSecondaryBtn">
              {t.paymentHistory}
            </a>
          </div>
        </div>

        <aside className="walletBalanceCard" title={currencyRateText}>
          <div className="walletBalanceGlow" />

          <span>{t.currentBalance}</span>
          <strong>{formatMoney(user?.balance)}</strong>
          <small>
            {t.availableOrders} · {t.shownIn} {selectedCurrency}
          </small>

          <div className="walletBalanceMiniGrid">
            <div>
              <span>{t.payments}</span>
              <b>{walletStats.requests}</b>
            </div>

            <div>
              <span>{t.pending}</span>
              <b>{walletStats.pendingPayments}</b>
            </div>
          </div>
        </aside>
      </section>

      {message && (
        <section className={`walletMessage walletMessage-${messageType}`}>
          <span>{messageType === "success" ? "✓" : messageType === "error" ? "!" : "i"}</span>
          <p>{message}</p>
        </section>
      )}

      <section className="walletStatsGrid">
        <article className="walletStatCard walletStatMain" title={currencyRateText}>
          <span>{t.walletBalance}</span>
          <strong>{formatMoney(user?.balance)}</strong>
          <small>{t.readyToSpend}</small>
        </article>

        <article className="walletStatCard" title={currencyRateText}>
          <span>{t.totalDeposited}</span>
          <strong>{formatMoney(walletStats.totalDeposited)}</strong>
          <small>{t.completedPaymentsOnly}</small>
        </article>

        <article className="walletStatCard">
          <span>{t.pendingPayments}</span>
          <strong>{walletStats.pendingPayments}</strong>
          <small>{t.waitingNotCaptured}</small>
        </article>

        <article className="walletStatCard">
          <span>{t.totalPayments}</span>
          <strong>{walletStats.requests}</strong>
          <small>{t.allAttempts}</small>
        </article>
      </section>

      <section className="walletMainGrid">
        <form
          className="walletPanel walletDepositPanel"
          onSubmit={handlePayment}
          id="wallet-add-funds"
        >
          <div className="walletPanelHeader">
            <div>
              <span>{t.addFundsPanel}</span>
              <h2>{t.payWithCrypto}</h2>
            </div>

            <div className={`walletPanelBrandMark ${activeMethod.brandClass}`}>
              <PaymentLogo method={activeMethod} />
            </div>
          </div>

          <div className="walletMethodGrid">
            {cryptoCoins.map((method) => (
              <button
                type="button"
                key={method.value}
                onClick={() => setSelectedCoin(method.value)}
                className={`walletMethodOption ${method.brandClass} ${
                  selectedCoin === method.value ? "walletMethodOptionActive" : ""
                }`}
              >
                <div className="walletMethodOptionTop">
                  <PaymentLogo method={method} />
                  <span className="walletMethodOptionTag">{method.tag}</span>
                </div>

                <strong>{method.label}</strong>
                <p>{method.description}</p>

                <small>{method.mode}</small>
              </button>
            ))}
          </div>

          <div className="walletFormGrid">
            <label>
              <span>{t.topupAmount}</span>
              <input
                type="number"
                step="0.01"
                min="1"
                placeholder={t.exampleAmount}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isCreating}
              />
            </label>

            <label>
              <span>{t.paymentCurrency}</span>
              <input type="text" value="EUR" disabled />
            </label>

            <label>
              <span>{t.cryptoCoin}</span>
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
                disabled={isCreating}
              >
                {cryptoCoins.map((coin) => (
                  <option value={coin.value} key={coin.value}>
                    {coin.label} {coin.enabled ? "· Live" : `· ${t.comingSoon}`}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>{t.promoOptional}</span>
              <input
                type="text"
                placeholder={t.promoPlaceholder}
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                disabled={isCreating}
              />
            </label>

            <label>
              <span>{t.noteOptional}</span>
              <input
                type="text"
                placeholder={t.notePlaceholder}
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                disabled={isCreating}
              />
            </label>
          </div>

          <div className="walletMethodPreview">
            <div className={`walletMethodBadge ${activeMethod.brandClass}`}>
              <PaymentLogo method={activeMethod} />
            </div>

            <div>
              <span>{t.backupMethod}</span>
              <strong>{activeMethod.description}</strong>
              <p>{t.cryptoLong}</p>
            </div>
          </div>

          <div className="walletDepositPreview" title={currencyRateText}>
            <div>
              <span>{t.paymentPreview}</span>
              <small>
                {t.manualPreview} {selectedCurrency}.
              </small>
            </div>

            <strong>{formatMoney(previewAmount)}</strong>
          </div>

          <button className="walletCreateBtn" type="submit" disabled={isCreating}>
            {isCreating
              ? t.creatingRequest
              : `${t.createRequest} ${activeMethod.label} ${t.request}`}
          </button>

          <p
            style={{
              margin: "14px 0 0",
              color: "#8fa4c2",
              fontSize: "12px",
              fontWeight: 800,
              lineHeight: 1.5,
            }}
          >
            {t.currencyInfo}
          </p>
        </form>

        <aside className="walletPanel walletGuidePanel">
          <div className="walletPanelHeader">
            <div>
              <span>{t.paymentGuide}</span>
              <h2>{t.howItWorks}</h2>
            </div>

            <div className="walletPanelIcon">↗</div>
          </div>

          <div className="walletSteps">
            <div>
              <b>01</b>
              <strong>{t.stepOneTitle}</strong>
              <span>{t.stepOneText}</span>
            </div>

            <div>
              <b>02</b>
              <strong>{t.stepTwoTitle}</strong>
              <span>{t.stepTwoText}</span>
            </div>

            <div>
              <b>03</b>
              <strong>{t.stepThreeTitle}</strong>
              <span>{t.stepThreeText}</span>
            </div>

            <div>
              <b>04</b>
              <strong>{t.stepFourTitle}</strong>
              <span>{t.stepFourText}</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="walletPanel walletDepositsPanel" id="wallet-deposits">
        <div className="walletPanelHeader">
          <div>
            <span>{t.paymentHistory}</span>
            <h2>{t.myPayments}</h2>
          </div>

          <div className="walletPanelIcon">{historyItems.length}</div>
        </div>

        {isLoading ? (
          <div className="walletSkeletonList">
            <span />
            <span />
            <span />
          </div>
        ) : historyItems.length === 0 ? (
          <div className="walletEmptyBox">
            <strong>{t.noPaymentsYet}</strong>
            <span>{t.noPaymentsText}</span>
          </div>
        ) : (
          <div className="walletDepositsTableWrap">
            <table className="walletDepositsTable">
              <thead>
                <tr>
                  <th>{t.provider}</th>
                  <th>{t.reference}</th>
                  <th>{t.amount}</th>
                  <th>{t.display}</th>
                  <th>{t.status}</th>
                  <th>{t.info}</th>
                  <th>{t.date}</th>
                </tr>
              </thead>

              <tbody>
                {historyItems.map((item) => (
                  <tr key={`${item.provider}-${item.id}`}>
                    <td>{item.provider}</td>
                    <td>
                      <strong>{item.reference}</strong>
                    </td>
                    <td title={`${t.originalCurrency}: ${item.originalCurrency || "EUR"}`}>
                      {formatMoney(item.amount)}
                    </td>
                    <td>
                      {selectedCurrencyMeta.flag} {selectedCurrency}
                    </td>
                    <td>
                      <span className={`walletStatusPill ${getStatusClass(item.status)}`}>
                        {item.status || "pending"}
                      </span>
                    </td>
                    <td>{item.info || "-"}</td>
                    <td>{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Wallet;