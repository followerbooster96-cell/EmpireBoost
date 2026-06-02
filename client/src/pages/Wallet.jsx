import { useEffect, useMemo, useState } from "react";
import api from "../lib/api.js";
import useCurrency from "../lib/useCurrency.js";
import { getStoredLanguage } from "../lib/language.js";
import "./Wallet.css";

const telegramLink = "https://t.me/EmpireBooster";
const supportEmail = "followerbooster96@gmail.com";

const CRYPTO_WALLETS = [
  {
    value: "LTC",
    label: "Litecoin",
    symbol: "Ł",
    network: "LTC Network",
    address: "LRLFcSR86JZkKxLKtCz2TR35cDny56e6py",
    tag: "Fast",
    tone: "walletCoinLtc",
    note: "Send only Litecoin through the LTC network.",
  },
  {
    value: "DOGE",
    label: "Dogecoin",
    symbol: "Ð",
    network: "DOGE Network",
    address: "DRvjYJcr4yNMkQkY2zRzw6yV7CpFAaTgik",
    tag: "Low fee",
    tone: "walletCoinDoge",
    note: "Send only Dogecoin through the DOGE network.",
  },
  {
    value: "BTC",
    label: "Bitcoin",
    symbol: "₿",
    network: "BTC Network",
    address: "1EbimWWDP5JkpDgqomMftrTDmy1UWysDDo",
    tag: "Classic",
    tone: "walletCoinBtc",
    note: "Send only Bitcoin through the BTC network.",
  },
  {
    value: "DASH",
    label: "Dash",
    symbol: "D",
    network: "DASH Network",
    address: "XiCWoagxUfZJothfvR2gK68JjEw3cjHGBP",
    tag: "Instant",
    tone: "walletCoinDash",
    note: "Send only Dash through the DASH network.",
  },
  {
    value: "USDT_SOL",
    label: "USDT",
    symbol: "$",
    network: "SOL Network",
    address: "4JjC3b1cBywBWrs7oM8UzAMhZM79t2XaPZnF1PjKjgjD",
    tag: "Stable",
    tone: "walletCoinUsdt",
    note: "Send only USDT through the Solana / SOL network.",
  },
  {
    value: "ETH_BSC",
    label: "ETH",
    symbol: "Ξ",
    network: "BSC Network",
    address: "0x5bb9220525b857097afb80e9180dcdf37b2b335d",
    tag: "BSC",
    tone: "walletCoinEth",
    note: "Send only ETH through the BSC network.",
  },
  {
    value: "SOL",
    label: "Solana",
    symbol: "◎",
    network: "SOL Network",
    address: "4JjC3b1cBywBWrs7oM8UzAMhZM79t2XaPZnF1PjKjgjD",
    tag: "Fast",
    tone: "walletCoinSol",
    note: "Send only SOL through the Solana / SOL network.",
  },
];

const WALLET_TRANSLATIONS = {
  en: {
    heroBadge: "Manual crypto wallet top-up",
    heroTitle: "Fund your wallet directly with crypto.",
    heroText:
      "Choose a coin, copy the correct wallet address, send the payment on the exact network and submit your transaction hash for approval.",
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
    waitingNotCaptured: "Waiting for admin approval",
    totalPayments: "Total deposits",
    allAttempts: "All deposit requests",

    addFundsPanel: "Add funds",
    payWithCrypto: "Manual crypto payment",
    live: "Live",
    directPayment: "Direct wallet payment",
    topupAmount: "Top-up amount",
    exampleAmount: "Example: 25.00",
    paymentCurrency: "Payment currency",
    cryptoCoin: "Crypto coin",
    promoOptional: "Promo code optional",
    promoPlaceholder: "Example: BOOST10",
    txidRequired: "Transaction hash / TXID required",
    txidPlaceholder: "Paste blockchain transaction hash here...",
    noteOptional: "Optional note",
    notePlaceholder: "Optional note for admin...",
    paymentAddress: "Payment address",
    addressCopied: "Address copied.",
    copyAddress: "Copy address",
    selectedNetwork: "Selected network",
    importantWarning: "Important",
    warningText:
      "Send only the selected coin on the selected network. Wrong coin or wrong network can permanently lose the payment.",
    paymentPreview: "Payment preview",
    manualPreview:
      "After sending crypto, submit the TXID. Your balance is credited after admin verification.",
    creatingRequest: "Submitting request...",
    createRequest: "Submit crypto deposit",
    requestCreated:
      "Crypto deposit request created. We will verify the TXID and approve your wallet balance.",
    enterMinimum: "Please enter at least 1.00 EUR.",
    txidMissing: "Please paste your transaction hash / TXID.",
    couldNotCreatePayment: "Could not create crypto deposit request.",
    currencyInfo:
      "Wallet accounting stays in EUR. Crypto payments are checked manually by transaction hash.",

    comingSoonTitle: "More payment methods",
    comingSoonText:
      "Apple Pay and Google Pay are planned for later. Crypto is live first because it is the safest direct option right now.",
    applePay: "Apple Pay",
    googlePay: "Google Pay",
    soon: "Coming soon",

    contactTitle: "Need help?",
    contactText:
      "If you are unsure about the network, TXID or payment status, contact us before sending money.",
    telegram: "Telegram",
    email: "Email",

    paymentGuide: "Payment guide",
    howItWorks: "How it works",
    stepOneTitle: "Choose coin and network",
    stepOneText: "Select the coin you want to use and check the network carefully.",
    stepTwoTitle: "Copy address",
    stepTwoText: "Copy the shown address and send the exact crypto payment.",
    stepThreeTitle: "Paste TXID",
    stepThreeText: "After payment, paste the blockchain transaction hash.",
    stepFourTitle: "Admin approval",
    stepFourText:
      "We verify the payment and credit your wallet balance manually.",

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

    floatingWallet: "Wallet",
    floatingBalance: "Balance",
    floatingCrypto: "Crypto",
    floatingBinance: "Binance",
    floatingTopUp: "Top Up",
    floatingFunds: "Funds",
    floatingSecure: "Secure",
    floatingCompleted: "Completed",
    floatingPending: "Pending",
    floatingOrders: "Orders",
    floatingGrowth: "Growth",
    floatingPayments: "Payments",
    floatingTracking: "Tracking",
  },

  de: {
    heroBadge: "Manuelle Crypto Wallet-Aufladung",
    heroTitle: "Lade dein Wallet direkt mit Crypto auf.",
    heroText:
      "Wähle einen Coin, kopiere die richtige Wallet-Adresse, sende die Zahlung im exakten Netzwerk und sende danach deinen Transaction Hash zur Prüfung.",
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
    waitingNotCaptured: "Wartet auf Admin-Freigabe",
    totalPayments: "Deposits gesamt",
    allAttempts: "Alle Deposit-Anfragen",

    addFundsPanel: "Guthaben aufladen",
    payWithCrypto: "Manuelle Crypto-Zahlung",
    live: "Live",
    directPayment: "Direkte Wallet-Zahlung",
    topupAmount: "Aufladebetrag",
    exampleAmount: "Beispiel: 25.00",
    paymentCurrency: "Zahlungswährung",
    cryptoCoin: "Crypto Coin",
    promoOptional: "Promo-Code optional",
    promoPlaceholder: "Beispiel: BOOST10",
    txidRequired: "Transaction Hash / TXID erforderlich",
    txidPlaceholder: "Blockchain Transaction Hash hier einfügen...",
    noteOptional: "Optionale Notiz",
    notePlaceholder: "Optionale Notiz für Admin...",
    paymentAddress: "Zahlungsadresse",
    addressCopied: "Adresse kopiert.",
    copyAddress: "Adresse kopieren",
    selectedNetwork: "Ausgewähltes Netzwerk",
    importantWarning: "Wichtig",
    warningText:
      "Sende nur den ausgewählten Coin im ausgewählten Netzwerk. Falscher Coin oder falsches Netzwerk kann die Zahlung dauerhaft verlieren.",
    paymentPreview: "Zahlungsvorschau",
    manualPreview:
      "Nach der Crypto-Zahlung TXID senden. Dein Guthaben wird nach Admin-Prüfung gutgeschrieben.",
    creatingRequest: "Anfrage wird gesendet...",
    createRequest: "Crypto Deposit senden",
    requestCreated:
      "Crypto Deposit-Anfrage erstellt. Wir prüfen die TXID und geben dein Wallet-Guthaben frei.",
    enterMinimum: "Bitte gib mindestens 1.00 EUR ein.",
    txidMissing: "Bitte füge deinen Transaction Hash / TXID ein.",
    couldNotCreatePayment: "Crypto Deposit-Anfrage konnte nicht erstellt werden.",
    currencyInfo:
      "Wallet-Buchhaltung bleibt in EUR. Crypto-Zahlungen werden manuell per Transaction Hash geprüft.",

    comingSoonTitle: "Weitere Zahlungsmethoden",
    comingSoonText:
      "Apple Pay und Google Pay sind für später geplant. Crypto ist zuerst live, weil es aktuell die sicherste direkte Option ist.",
    applePay: "Apple Pay",
    googlePay: "Google Pay",
    soon: "Kommt bald",

    contactTitle: "Brauchst du Hilfe?",
    contactText:
      "Wenn du beim Netzwerk, TXID oder Zahlungsstatus unsicher bist, kontaktiere uns vor der Zahlung.",
    telegram: "Telegram",
    email: "E-Mail",

    paymentGuide: "Zahlungsanleitung",
    howItWorks: "So funktioniert es",
    stepOneTitle: "Coin und Netzwerk wählen",
    stepOneText: "Wähle den Coin und prüfe das Netzwerk sehr genau.",
    stepTwoTitle: "Adresse kopieren",
    stepTwoText: "Kopiere die angezeigte Adresse und sende die Crypto-Zahlung.",
    stepThreeTitle: "TXID einfügen",
    stepThreeText: "Nach der Zahlung den Blockchain Transaction Hash einfügen.",
    stepFourTitle: "Admin-Freigabe",
    stepFourText:
      "Wir prüfen die Zahlung und schreiben dein Wallet-Guthaben manuell gut.",

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

    floatingWallet: "Wallet",
    floatingBalance: "Guthaben",
    floatingCrypto: "Crypto",
    floatingBinance: "Binance",
    floatingTopUp: "Aufladen",
    floatingFunds: "Funds",
    floatingSecure: "Sicher",
    floatingCompleted: "Abgeschlossen",
    floatingPending: "Ausstehend",
    floatingOrders: "Bestellungen",
    floatingGrowth: "Growth",
    floatingPayments: "Zahlungen",
    floatingTracking: "Tracking",
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

function shortenText(value, start = 10, end = 8) {
  const text = String(value || "");

  if (text.length <= start + end + 5) {
    return text;
  }

  return `${text.slice(0, start)}...${text.slice(-end)}`;
}

function CryptoLogo({ coin }) {
  return (
    <div className={`walletCryptoLogoReal ${coin.tone}`} aria-hidden="true">
      <span className="walletCryptoLogoSymbol">{coin.symbol}</span>
      <span className="walletCryptoLogoText">{coin.label}</span>
    </div>
  );
}

function ComingSoonPayCard({ type, title, label }) {
  return (
    <div className={`walletSoonPayCard walletSoonPayCard-${type}`}>
      <div className="walletSoonPayIcon">
        {type === "apple" ? "" : "G"}
      </div>

      <div>
        <strong>{title}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function Wallet() {
  const { selectedCurrency, selectedCurrencyMeta, currencyRateText, formatMoney } =
    useCurrency();

  const [selectedLanguage, setSelectedLanguage] = useState(getStoredLanguage());
  const t = getWalletTranslations(selectedLanguage);

  const cryptoCoins = useMemo(() => CRYPTO_WALLETS, []);

  const floatingWalletItems = useMemo(
    () => [
      t.floatingWallet,
      t.floatingBalance,
      "Litecoin",
      "Dogecoin",
      "Bitcoin",
      "Dash",
      "USDT SOL",
      "ETH BSC",
      "Solana",
      t.floatingCrypto,
      t.floatingBinance,
      t.floatingTopUp,
      t.floatingFunds,
      t.floatingSecure,
      t.floatingCompleted,
      t.floatingPending,
      t.floatingOrders,
      t.floatingGrowth,
      t.floatingPayments,
      t.floatingTracking,
    ],
    [t]
  );

  const [user, setUser] = useState(null);
  const [manualDeposits, setManualDeposits] = useState([]);

  const [selectedCoinValue, setSelectedCoinValue] = useState("LTC");
  const [amount, setAmount] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [txid, setTxid] = useState("");
  const [userNote, setUserNote] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const activeCoin =
    cryptoCoins.find((coin) => coin.value === selectedCoinValue) || cryptoCoins[0];

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
      ["approved", "completed", "paid"].includes(
        String(deposit.status || "").toLowerCase()
      )
    );

    const totalManualDeposited = completedManualDeposits.reduce(
      (sum, deposit) => sum + Number(deposit.finalAmount || deposit.amount || 0),
      0
    );

    const pendingManualDeposits = manualDeposits.filter((deposit) =>
      ["pending", "waiting", "review"].includes(
        String(deposit.status || "").toLowerCase()
      )
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
        provider: deposit.method || "crypto",
        reference: deposit.paymentReference || "-",
        amount: deposit.finalAmount || deposit.amount,
        originalCurrency: "EUR",
        status: deposit.status || "pending",
        info: deposit.userNote || deposit.adminNote || "-",
        createdAt: deposit.createdAt,
      }))
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 8);
  }, [manualDeposits]);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(activeCoin.address);

      setMessageType("success");
      setMessage(t.addressCopied);
    } catch {
      setMessageType("error");
      setMessage(activeCoin.address);
    }
  };

  const createManualCryptoDeposit = async () => {
    const cleanTxid = txid.trim();

    if (!cleanTxid) {
      setMessageType("error");
      setMessage(t.txidMissing);
      return;
    }

    const cryptoNote = [
      "MANUAL CRYPTO DEPOSIT",
      `Coin: ${activeCoin.label} (${activeCoin.value})`,
      `Network: ${activeCoin.network}`,
      `Payment address: ${activeCoin.address}`,
      `TXID: ${cleanTxid}`,
      userNote.trim() ? `User note: ${userNote.trim()}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    await api.post("/deposits", {
      amount: Number(amount),
      promoCode,
      method: "crypto",
      userNote: cryptoNote,
    });

    setMessageType("success");
    setMessage(t.requestCreated);

    setAmount("");
    setPromoCode("");
    setTxid("");
    setUserNote("");

    await Promise.allSettled([loadManualDeposits(), loadUser()]);
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
      await createManualCryptoDeposit();
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
          <span
            className={`walletFloat walletFloat${index + 1}`}
            key={`${item}-${index}`}
          >
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
          <span>
            {messageType === "success" ? "✓" : messageType === "error" ? "!" : "i"}
          </span>
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

            <div className="walletPanelBrandMark">
              <CryptoLogo coin={activeCoin} />
            </div>
          </div>

          <div className="walletMethodGrid">
            {cryptoCoins.map((coin) => (
              <button
                type="button"
                key={coin.value}
                onClick={() => setSelectedCoinValue(coin.value)}
                className={`walletMethodOption ${
                  selectedCoinValue === coin.value ? "walletMethodOptionActive" : ""
                } ${coin.tone}`}
              >
                <div className="walletMethodOptionTop">
                  <CryptoLogo coin={coin} />
                  <span className="walletMethodOptionTag">{coin.tag}</span>
                </div>

                <strong>{coin.label}</strong>
                <p>{coin.network}</p>

                <small>{t.live}</small>
              </button>
            ))}
          </div>

          <div className="walletAddressBox">
            <div className="walletAddressHeader">
              <div>
                <span>{t.paymentAddress}</span>
                <strong>{activeCoin.label}</strong>
              </div>

              <CryptoLogo coin={activeCoin} />
            </div>

            <div className="walletNetworkLine">
              <span>{t.selectedNetwork}</span>
              <b>{activeCoin.network}</b>
            </div>

            <div className="walletAddressLine">
              <code>{activeCoin.address}</code>
              <button type="button" onClick={handleCopyAddress}>
                {t.copyAddress}
              </button>
            </div>

            <div className="walletWarningBox">
              <b>{t.importantWarning}</b>
              <p>{t.warningText}</p>
              <small>{activeCoin.note}</small>
            </div>
          </div>

          <div className="walletComingSoonBox">
            <div className="walletComingSoonText">
              <span>{t.comingSoonTitle}</span>
              <p>{t.comingSoonText}</p>
            </div>

            <div className="walletComingSoonMethods">
              <ComingSoonPayCard type="apple" title={t.applePay} label={t.soon} />
              <ComingSoonPayCard type="google" title={t.googlePay} label={t.soon} />
            </div>
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
                value={selectedCoinValue}
                onChange={(e) => setSelectedCoinValue(e.target.value)}
                disabled={isCreating}
              >
                {cryptoCoins.map((coin) => (
                  <option value={coin.value} key={coin.value}>
                    {coin.label} · {coin.network}
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

            <label className="walletFormWide">
              <span>{t.txidRequired}</span>
              <input
                type="text"
                placeholder={t.txidPlaceholder}
                value={txid}
                onChange={(e) => setTxid(e.target.value)}
                disabled={isCreating}
              />
            </label>

            <label className="walletFormWide">
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
            <div className="walletMethodBadge">
              <CryptoLogo coin={activeCoin} />
            </div>

            <div>
              <span>{t.directPayment}</span>
              <strong>
                {activeCoin.label} · {activeCoin.network}
              </strong>
              <p>{activeCoin.note}</p>
            </div>
          </div>

          <div className="walletDepositPreview" title={currencyRateText}>
            <div>
              <span>{t.paymentPreview}</span>
              <small>{t.manualPreview}</small>
            </div>

            <strong>{formatMoney(previewAmount)}</strong>
          </div>

          <button className="walletCreateBtn" type="submit" disabled={isCreating}>
            {isCreating ? t.creatingRequest : t.createRequest}
          </button>

          <p className="walletCurrencyInfo">{t.currencyInfo}</p>
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

          <div className="walletHelpBox">
            <div className="walletHelpHeader">
              <span>?</span>
              <div>
                <strong>{t.contactTitle}</strong>
                <p>{t.contactText}</p>
              </div>
            </div>

            <div className="walletHelpActions">
              <a href={telegramLink} target="_blank" rel="noreferrer">
                <span>✈</span>
                {t.telegram}
                <small>@EmpireBooster</small>
              </a>

              <a href={`mailto:${supportEmail}`}>
                <span>✉</span>
                {t.email}
                <small>{supportEmail}</small>
              </a>
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
                    <td title={item.info}>{shortenText(item.info, 28, 16)}</td>
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