import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api.js";
import useCurrency from "../lib/useCurrency.js";
import "./Dashboard.css";

function getInitial(email) {
  if (!email) return "U";
  return email.slice(0, 1).toUpperCase();
}

function Dashboard() {
  const { selectedCurrency, selectedCurrencyMeta, currencyRateText, formatMoney } =
    useCurrency();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingExtra, setIsLoadingExtra] = useState(true);
  const [error, setError] = useState("");

  const floatingItems = [
    "Orders",
    "Wallet",
    "Growth",
    "Support",
    "Services",
    "Balance",
    "Tracking",
    "Fast",
    "Creators",
    "Secure",
    "TikTok",
    "Instagram",
    "YouTube",
    "Telegram",
    "Premium",
    "Analytics",
    "Revenue",
    "Delivery",
  ];

  const loadUser = async () => {
    setIsLoadingUser(true);
    setError("");

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
      setError(err.response?.data?.message || "Could not load dashboard.");
      console.log(err.response?.data || err.message);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const loadExtraData = async () => {
    setIsLoadingExtra(true);

    try {
      const [ordersRes, transactionsRes] = await Promise.allSettled([
        api.get("/orders/my"),
        api.get("/wallet/transactions"),
      ]);

      if (ordersRes.status === "fulfilled") {
        setOrders(ordersRes.value.data.orders || []);
      }

      if (transactionsRes.status === "fulfilled") {
        setTransactions(transactionsRes.value.data.transactions || []);
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setIsLoadingExtra(false);
    }
  };

  useEffect(() => {
    loadUser();
    loadExtraData();
  }, []);

  const dashboardStats = useMemo(() => {
    const totalOrders = orders.length;

    const activeOrders = orders.filter((order) =>
      ["pending", "processing", "in_progress"].includes(
        String(order.status || "").toLowerCase()
      )
    ).length;

    const completedOrders = orders.filter(
      (order) => String(order.status || "").toLowerCase() === "completed"
    ).length;

    const spent = orders.reduce(
      (sum, order) => sum + Number(order.charge || 0),
      0
    );

    return {
      totalOrders,
      activeOrders,
      completedOrders,
      spent,
    };
  }, [orders]);

  const recentOrders = orders.slice(0, 4);
  const recentTransactions = transactions.slice(0, 4);

  const getSignedAmount = (amount) => {
    const numericAmount = Number(amount || 0);
    const sign = numericAmount >= 0 ? "+" : "-";

    return `${sign}${formatMoney(Math.abs(numericAmount))}`;
  };

  if (isLoadingUser) {
    return (
      <main className="dashboardPagePro">
        <div className="dashboardAurora" aria-hidden="true">
          <span className="dashboardAuroraOne" />
          <span className="dashboardAuroraTwo" />
          <span className="dashboardAuroraThree" />
          <span className="dashboardAuroraFour" />
        </div>

        <section className="dashboardLoadingShell">
          <div className="dashboardLoadingBadge" />
          <div className="dashboardLoadingTitle" />
          <div className="dashboardLoadingText" />
          <div className="dashboardLoadingGrid">
            <span />
            <span />
            <span />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboardPagePro">
      <div className="dashboardAurora" aria-hidden="true">
        <span className="dashboardAuroraOne" />
        <span className="dashboardAuroraTwo" />
        <span className="dashboardAuroraThree" />
        <span className="dashboardAuroraFour" />
      </div>

      <div className="dashboardFloatingLayer" aria-hidden="true">
        {floatingItems.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className={`dashboardFloat dashboardFloat${index + 1}`}
          >
            {item}
          </span>
        ))}
      </div>

      <section className="dashboardHeroPro">
        <div className="dashboardHeroContent">
          <div className="dashboardBadgePro">
            <span />
            Creator control room
          </div>

          <h1>Welcome back to your growth dashboard.</h1>

          <p>
            Track your wallet, orders and account status from one clean control
            center. Everything is built to stay simple, fast and professional.
          </p>

          <div className="dashboardHeroActions">
            <Link to="/services" className="dashboardPrimaryBtn">
              Browse Services
            </Link>

            <Link to="/wallet" className="dashboardSecondaryBtn">
              Add Balance
            </Link>
          </div>
        </div>

        <aside className="dashboardProfileCard">
          <div className="dashboardProfileGlow" />

          <div className="dashboardAvatar">{getInitial(user?.email)}</div>

          <div className="dashboardProfileInfo">
            <span>Signed in as</span>
            <strong>{user?.email || "Unknown user"}</strong>
            <small>{user?.role || "user"} account</small>
          </div>

          <div className="dashboardProfileStatus">
            <span className="dashboardStatusDot" />
            Account active
          </div>
        </aside>
      </section>

      {error && (
        <section className="dashboardMessage dashboardMessageError">
          <span>!</span>
          <p>{error}</p>
        </section>
      )}

      <section className="dashboardStatsGrid">
        <article
          className="dashboardStatCard dashboardStatMain"
          title={currencyRateText}
        >
          <span>Wallet balance</span>
          <strong>{formatMoney(user?.balance)}</strong>
          <small>
            Available for new orders · shown in {selectedCurrencyMeta.flag}{" "}
            {selectedCurrency}
          </small>
        </article>

        <article className="dashboardStatCard">
          <span>Total orders</span>
          <strong>{dashboardStats.totalOrders}</strong>
          <small>All orders on your account</small>
        </article>

        <article className="dashboardStatCard">
          <span>Active orders</span>
          <strong>{dashboardStats.activeOrders}</strong>
          <small>Currently pending or processing</small>
        </article>

        <article className="dashboardStatCard" title={currencyRateText}>
          <span>Total spent</span>
          <strong>{formatMoney(dashboardStats.spent)}</strong>
          <small>
            Calculated from orders · shown in {selectedCurrencyMeta.flag}{" "}
            {selectedCurrency}
          </small>
        </article>
      </section>

      <section className="dashboardMainGrid">
        <div className="dashboardPanel dashboardAccountPanel">
          <div className="dashboardPanelHeader">
            <div>
              <span>Account overview</span>
              <h2>Your account</h2>
            </div>

            <div className="dashboardPanelIcon">●</div>
          </div>

          <div className="dashboardAccountList">
            <div>
              <span>Email</span>
              <strong>{user?.email || "Not available"}</strong>
            </div>

            <div>
              <span>Role</span>
              <strong>{user?.role || "user"}</strong>
            </div>

            <div title={currencyRateText}>
              <span>Balance</span>
              <strong>{formatMoney(user?.balance)}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>Active</strong>
            </div>
          </div>
        </div>

        <div className="dashboardPanel dashboardQuickPanel">
          <div className="dashboardPanelHeader">
            <div>
              <span>Quick actions</span>
              <h2>Move faster</h2>
            </div>

            <div className="dashboardPanelIcon">↗</div>
          </div>

          <div className="dashboardQuickActions">
            <Link to="/services">
              <strong>Start new order</strong>
              <span>Choose followers, likes, views and more.</span>
            </Link>

            <Link to="/wallet">
              <strong>Top up wallet</strong>
              <span>Add balance before creating orders.</span>
            </Link>

            <Link to="/orders">
              <strong>View orders</strong>
              <span>Track order status and progress.</span>
            </Link>

            <Link to="/support">
              <strong>Open support</strong>
              <span>Get help if something needs checking.</span>
            </Link>
          </div>
        </div>

        <div className="dashboardPanel dashboardRecentPanel">
          <div className="dashboardPanelHeader">
            <div>
              <span>Recent orders</span>
              <h2>Latest activity</h2>
            </div>

            <Link to="/orders" className="dashboardMiniLink">
              View all
            </Link>
          </div>

          {isLoadingExtra ? (
            <div className="dashboardMiniSkeleton">
              <span />
              <span />
              <span />
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="dashboardActivityList">
              {recentOrders.map((order) => (
                <div className="dashboardActivityItem" key={order._id}>
                  <div>
                    <strong>
                      {order.serviceId?.name ||
                        order.serviceName ||
                        "Service order"}
                    </strong>
                    <span>{order.status || "pending"}</span>
                  </div>

                  <small title={currencyRateText}>
                    {formatMoney(order.charge)}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboardEmptyBox">
              <strong>No orders yet</strong>
              <span>Browse services and create your first order.</span>
            </div>
          )}
        </div>

        <div className="dashboardPanel dashboardRecentPanel">
          <div className="dashboardPanelHeader">
            <div>
              <span>Wallet activity</span>
              <h2>Transactions</h2>
            </div>

            <Link to="/transactions" className="dashboardMiniLink">
              View all
            </Link>
          </div>

          {isLoadingExtra ? (
            <div className="dashboardMiniSkeleton">
              <span />
              <span />
              <span />
            </div>
          ) : recentTransactions.length > 0 ? (
            <div className="dashboardActivityList">
              {recentTransactions.map((transaction) => (
                <div className="dashboardActivityItem" key={transaction._id}>
                  <div>
                    <strong>
                      {transaction.description ||
                        transaction.type ||
                        "Transaction"}
                    </strong>
                    <span>{transaction.status || "completed"}</span>
                  </div>

                  <small title={currencyRateText}>
                    {getSignedAmount(transaction.amount)}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboardEmptyBox">
              <strong>No transactions yet</strong>
              <span>Your wallet activity will appear here.</span>
            </div>
          )}
        </div>
      </section>

      <section
        style={{
          width: "min(1180px, 100%)",
          margin: "24px auto 0",
          padding: "18px 22px",
          borderRadius: "24px",
          border: "1px solid rgba(147, 197, 253, 0.13)",
          background:
            "linear-gradient(145deg, rgba(9, 16, 32, 0.82), rgba(3, 8, 22, 0.72))",
          boxShadow:
            "0 18px 52px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255,255,255,0.05)",
          color: "#8fa4c2",
          fontSize: "12px",
          fontWeight: 800,
          lineHeight: 1.55,
          textAlign: "center",
        }}
        title={currencyRateText}
      >
        Real wallet balance, orders and transactions are stored in EUR. Dashboard
        values are displayed in {selectedCurrencyMeta.flag} {selectedCurrency}{" "}
        using the selected display currency.
      </section>
    </main>
  );
}

export default Dashboard;