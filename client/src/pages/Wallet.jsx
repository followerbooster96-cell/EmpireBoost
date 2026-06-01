import { useEffect, useMemo, useState } from "react";
import api from "../lib/api.js";
import useCurrency from "../lib/useCurrency.js";
import "./Wallet.css";

const paymentMethods = [
  {
    value: "paypal",
    label: "PayPal",
    short: "PP",
    mode: "Automatic",
    tag: "Instant",
    description: "Real checkout with automatic wallet credit.",
    brandClass: "walletBrandPaypal",
  },
  {
    value: "crypto",
    label: "Crypto",
    short: "CR",
    mode: "Manual",
    tag: "Backup",
    description: "USDT, BTC or ETH request for manual verification.",
    brandClass: "walletBrandCrypto",
  },
  {
    value: "revolut",
    label: "Revolut",
    short: "RV",
    mode: "Manual",
    tag: "Fast",
    description: "Quick Revolut top-up request with payment note.",
    brandClass: "walletBrandRevolut",
  },
  {
    value: "bank",
    label: "Bank",
    short: "BK",
    mode: "Manual",
    tag: "Classic",
    description: "Bank transfer request with reference check.",
    brandClass: "walletBrandBank",
  },
];

const floatingWalletItems = [
  "Wallet",
  "Balance",
  "PayPal",
  "Crypto",
  "Revolut",
  "Checkout",
  "Top Up",
  "Funds",
  "Secure",
  "Completed",
  "Pending",
  "Orders",
  "Growth",
  "Creator",
  "Fast",
  "Revenue",
  "Payments",
  "Tracking",
];

function PaymentLogo({ method }) {
  if (method.value === "paypal") {
    return (
      <div className="walletRealLogo walletPaypalLogo" aria-hidden="true">
        <span className="walletPaypalP">P</span>
        <span className="walletPaypalText">PayPal</span>
      </div>
    );
  }

  if (method.value === "crypto") {
    return (
      <div className="walletRealLogo walletCryptoLogo" aria-hidden="true">
        <span className="walletCryptoCoin">₿</span>
        <span className="walletCryptoText">Crypto</span>
      </div>
    );
  }

  if (method.value === "revolut") {
    return (
      <div className="walletRealLogo walletRevolutLogo" aria-hidden="true">
        <span className="walletRevolutMark">R</span>
        <span className="walletRevolutText">Revolut</span>
      </div>
    );
  }

  return (
    <div className="walletRealLogo walletBankLogo" aria-hidden="true">
      <span className="walletBankMark">▰</span>
      <span className="walletBankText">Bank</span>
    </div>
  );
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

function Wallet() {
  const { selectedCurrency, selectedCurrencyMeta, currencyRateText, formatMoney } =
    useCurrency();

  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [manualDeposits, setManualDeposits] = useState([]);

  const [selectedMethod, setSelectedMethod] = useState("paypal");
  const [amount, setAmount] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [userNote, setUserNote] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const activeMethod =
    paymentMethods.find((method) => method.value === selectedMethod) || paymentMethods[0];

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

  const loadPayments = async () => {
    try {
      const res = await api.get("/payments/paypal/my");
      setPayments(res.data.payments || []);
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
    await Promise.allSettled([loadUser(), loadPayments(), loadManualDeposits()]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadWalletData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paypalStatus = params.get("paypal");
    const paypalOrderId = params.get("token");

    if (paypalStatus === "cancelled") {
      setMessageType("error");
      setMessage("PayPal payment was cancelled.");
      window.history.replaceState({}, "", "/wallet");
      return;
    }

    if (paypalStatus === "success" && paypalOrderId) {
      capturePaypalPayment(paypalOrderId);
    }
  }, []);

  const walletStats = useMemo(() => {
    const completedPaypalPayments = payments.filter(
      (payment) => String(payment.status || "").toLowerCase() === "completed"
    );

    const completedManualDeposits = manualDeposits.filter((deposit) =>
      ["approved", "completed", "paid"].includes(String(deposit.status || "").toLowerCase())
    );

    const totalPaypalDeposited = completedPaypalPayments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );

    const totalManualDeposited = completedManualDeposits.reduce(
      (sum, deposit) => sum + Number(deposit.finalAmount || deposit.amount || 0),
      0
    );

    const pendingPaypalPayments = payments.filter(
      (payment) => String(payment.status || "").toLowerCase() === "created"
    ).length;

    const pendingManualDeposits = manualDeposits.filter((deposit) =>
      ["pending", "waiting", "review"].includes(String(deposit.status || "").toLowerCase())
    ).length;

    return {
      totalDeposited: totalPaypalDeposited + totalManualDeposited,
      pendingPayments: pendingPaypalPayments + pendingManualDeposits,
      requests: payments.length + manualDeposits.length,
    };
  }, [payments, manualDeposits]);

  const previewAmount = Number(amount || 0);

  const historyItems = useMemo(() => {
    const paypalItems = payments.map((payment) => ({
      id: payment._id,
      provider: "PayPal",
      reference: payment.paypalOrderId,
      amount: payment.amount,
      originalCurrency: payment.currency || "EUR",
      status: payment.status || "created",
      info: payment.paypalCaptureId || "-",
      createdAt: payment.createdAt,
    }));

    const manualItems = manualDeposits.map((deposit) => ({
      id: deposit._id,
      provider: deposit.method || "Manual",
      reference: deposit.paymentReference || "-",
      amount: deposit.finalAmount || deposit.amount,
      originalCurrency: "EUR",
      status: deposit.status || "pending",
      info: deposit.userNote || "-",
      createdAt: deposit.createdAt,
    }));

    return [...paypalItems, ...manualItems]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 8);
  }, [payments, manualDeposits]);

  const createPaypalPayment = async () => {
    const res = await api.post("/payments/paypal/create", {
      amount: Number(amount),
    });

    window.location.href = res.data.approveUrl;
  };

  const createManualDeposit = async () => {
    const res = await api.post("/deposits", {
      amount: Number(amount),
      promoCode,
      method: selectedMethod,
      userNote,
    });

    setMessageType("success");
    setMessage(`${activeMethod.label} request created successfully.`);

    setAmount("");
    setPromoCode("");
    setUserNote("");

    await Promise.allSettled([loadManualDeposits(), loadUser()]);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!amount || Number(amount) < 1) {
      setMessageType("error");
      setMessage("Please enter at least 1.00 EUR.");
      return;
    }

    setIsCreating(true);

    try {
      if (selectedMethod === "paypal") {
        await createPaypalPayment();
        return;
      }

      await createManualDeposit();
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Could not create payment.");
    } finally {
      setIsCreating(false);
    }
  };

  const capturePaypalPayment = async (paypalOrderId) => {
    setIsCapturing(true);
    setMessageType("info");
    setMessage("Confirming PayPal payment...");

    try {
      const res = await api.post("/payments/paypal/capture", {
        paypalOrderId,
      });

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

      setMessageType("success");
      setMessage(
        `Payment completed. New wallet balance: ${formatMoney(res.data.newBalance)}`
      );

      await loadPayments();
      window.history.replaceState({}, "", "/wallet");
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "PayPal payment confirmation failed.");
      window.history.replaceState({}, "", "/wallet");
    } finally {
      setIsCapturing(false);
    }
  };

  const getMethodTitle = () => {
    if (selectedMethod === "paypal") return "Pay with PayPal";
    if (selectedMethod === "crypto") return "Pay with Crypto";
    if (selectedMethod === "revolut") return "Pay with Revolut";
    return "Bank transfer";
  };

  const getMethodDescription = () => {
    if (selectedMethod === "paypal") {
      return "You will be redirected to PayPal. After payment, your wallet balance updates automatically.";
    }

    if (selectedMethod === "crypto") {
      return "Submit a crypto payment request. Add your transaction hash or wallet note so admin can verify it.";
    }

    if (selectedMethod === "revolut") {
      return "Submit a Revolut payment request. Add your Revolut name or transfer note for faster approval.";
    }

    return "Submit a bank transfer request. Add your sender name or bank reference in the note.";
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
            Premium wallet checkout
          </div>

          <h1>Fund your wallet with trusted payment options.</h1>

          <p>
            PayPal runs as automatic checkout. Crypto, Revolut and bank transfer are
            clean backup methods for customers who prefer alternative payments.
          </p>

          <div className="walletHeroActions">
            <a href="#wallet-add-funds" className="walletPrimaryBtn">
              Add Funds
            </a>

            <a href="#wallet-deposits" className="walletSecondaryBtn">
              Payment History
            </a>
          </div>
        </div>

        <aside className="walletBalanceCard" title={currencyRateText}>
          <div className="walletBalanceGlow" />

          <span>Current balance</span>
          <strong>{formatMoney(user?.balance)}</strong>
          <small>
            Available for new orders · shown in {selectedCurrency}
          </small>

          <div className="walletBalanceMiniGrid">
            <div>
              <span>Payments</span>
              <b>{walletStats.requests}</b>
            </div>

            <div>
              <span>Pending</span>
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
          <span>Wallet balance</span>
          <strong>{formatMoney(user?.balance)}</strong>
          <small>Ready to spend on services</small>
        </article>

        <article className="walletStatCard" title={currencyRateText}>
          <span>Total deposited</span>
          <strong>{formatMoney(walletStats.totalDeposited)}</strong>
          <small>Completed payments only</small>
        </article>

        <article className="walletStatCard">
          <span>Pending payments</span>
          <strong>{walletStats.pendingPayments}</strong>
          <small>Waiting or not captured yet</small>
        </article>

        <article className="walletStatCard">
          <span>Total payments</span>
          <strong>{walletStats.requests}</strong>
          <small>All payment attempts</small>
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
              <span>Add funds</span>
              <h2>{getMethodTitle()}</h2>
            </div>

            <div className={`walletPanelBrandMark ${activeMethod.brandClass}`}>
              <PaymentLogo method={activeMethod} />
            </div>
          </div>

          <div className="walletMethodGrid">
            {paymentMethods.map((method) => (
              <button
                type="button"
                key={method.value}
                onClick={() => setSelectedMethod(method.value)}
                className={`walletMethodOption ${method.brandClass} ${
                  selectedMethod === method.value ? "walletMethodOptionActive" : ""
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
              <span>Top-up amount</span>
              <input
                type="number"
                step="0.01"
                min="1"
                placeholder="Example: 25.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isCreating || isCapturing}
              />
            </label>

            <label>
              <span>Payment currency</span>
              <input type="text" value="EUR" disabled />
            </label>

            {selectedMethod !== "paypal" && (
              <>
                <label>
                  <span>Promo code optional</span>
                  <input
                    type="text"
                    placeholder="Example: BOOST10"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    disabled={isCreating || isCapturing}
                  />
                </label>

                <label>
                  <span>Payment note optional</span>
                  <input
                    type="text"
                    placeholder="Tx hash, Revolut name or bank note"
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    disabled={isCreating || isCapturing}
                  />
                </label>
              </>
            )}
          </div>

          <div className="walletMethodPreview">
            <div className={`walletMethodBadge ${activeMethod.brandClass}`}>
              <PaymentLogo method={activeMethod} />
            </div>

            <div>
              <span>{activeMethod.mode === "Automatic" ? "Automatic checkout" : "Backup method"}</span>
              <strong>{activeMethod.description}</strong>
              <p>{getMethodDescription()}</p>
            </div>
          </div>

          <div className="walletDepositPreview" title={currencyRateText}>
            <div>
              <span>Payment preview</span>
              <small>
                {selectedMethod === "paypal"
                  ? `You pay in EUR. Display preview is shown in ${selectedCurrency}.`
                  : `Request is created in EUR. Display preview is shown in ${selectedCurrency}.`}
              </small>
            </div>

            <strong>{formatMoney(previewAmount)}</strong>
          </div>

          <button className="walletCreateBtn" type="submit" disabled={isCreating || isCapturing}>
            {isCreating
              ? selectedMethod === "paypal"
                ? "Redirecting to PayPal..."
                : "Creating request..."
              : isCapturing
                ? "Confirming payment..."
                : selectedMethod === "paypal"
                  ? "Pay with PayPal"
                  : `Create ${activeMethod.label} Request`}
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
            Real wallet and payment calculations stay in EUR. The selected currency is
            only a display conversion so pricing stays safe and clear.
          </p>
        </form>

        <aside className="walletPanel walletGuidePanel">
          <div className="walletPanelHeader">
            <div>
              <span>Payment guide</span>
              <h2>How it works</h2>
            </div>

            <div className="walletPanelIcon">↗</div>
          </div>

          <div className="walletSteps">
            <div>
              <b>01</b>
              <strong>Choose method</strong>
              <span>Select PayPal, Crypto, Revolut or bank transfer.</span>
            </div>

            <div>
              <b>02</b>
              <strong>Enter amount</strong>
              <span>Payment amount is entered in EUR to keep checkout accurate.</span>
            </div>

            <div>
              <b>03</b>
              <strong>Pay or submit</strong>
              <span>PayPal redirects instantly. Other methods create a backup request.</span>
            </div>

            <div>
              <b>04</b>
              <strong>Balance updates</strong>
              <span>Wallet updates in EUR, while your selected currency controls display.</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="walletPanel walletDepositsPanel" id="wallet-deposits">
        <div className="walletPanelHeader">
          <div>
            <span>Payment history</span>
            <h2>My payments</h2>
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
            <strong>No payments yet</strong>
            <span>Your PayPal, Crypto, Revolut and bank payments will appear here.</span>
          </div>
        ) : (
          <div className="walletDepositsTableWrap">
            <table className="walletDepositsTable">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Reference</th>
                  <th>Amount</th>
                  <th>Display</th>
                  <th>Status</th>
                  <th>Info</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {historyItems.map((item) => (
                  <tr key={`${item.provider}-${item.id}`}>
                    <td>{item.provider}</td>
                    <td>
                      <strong>{item.reference}</strong>
                    </td>
                    <td title={`Original payment currency: ${item.originalCurrency || "EUR"}`}>
                      {formatMoney(item.amount)}
                    </td>
                    <td>
                      {selectedCurrencyMeta.flag} {selectedCurrency}
                    </td>
                    <td>
                      <span className={`walletStatusPill ${getStatusClass(item.status)}`}>
                        {item.status || "created"}
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