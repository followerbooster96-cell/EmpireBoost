import { useEffect, useMemo, useState } from "react";
import api from "../lib/api.js";
import useCurrency from "../lib/useCurrency.js";
import "./Transactions.css";

const floatingTransactionItems = [
  "Transactions",
  "Wallet",
  "Balance",
  "Orders",
  "Deposits",
  "Refunds",
  "Credits",
  "Debits",
  "Completed",
  "Pending",
  "Tracking",
  "Payments",
  "History",
  "Secure",
  "Revenue",
  "Activity",
  "EmpireBoost",
  "Growth",
];

const filterOptions = [
  { value: "all", label: "All" },
  { value: "credit", label: "Credits" },
  { value: "debit", label: "Debits" },
  { value: "deposit", label: "Deposits" },
  { value: "order", label: "Orders" },
  { value: "refund", label: "Refunds" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

function formatDate(value) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return "-";
  }
}

function getCleanText(value) {
  return String(value || "").toLowerCase().trim();
}

function getTransactionType(transaction) {
  const type = getCleanText(transaction.type);
  const description = getCleanText(transaction.description);
  const provider = getCleanText(transaction.provider);
  const amount = Number(transaction.amount || 0);

  if (type.includes("refund") || description.includes("refund")) return "refund";
  if (type.includes("deposit") || description.includes("deposit")) return "deposit";
  if (type.includes("order") || description.includes("order")) return "order";
  if (type.includes("credit")) return "credit";
  if (type.includes("debit")) return "debit";

  if (
    provider.includes("paypal") ||
    provider.includes("crypto") ||
    provider.includes("revolut")
  ) {
    return amount >= 0 ? "deposit" : "debit";
  }

  if (amount > 0) return "credit";
  if (amount < 0) return "debit";

  return "activity";
}

function getTypeLabel(type) {
  if (type === "credit") return "Credit";
  if (type === "debit") return "Debit";
  if (type === "deposit") return "Deposit";
  if (type === "order") return "Order";
  if (type === "refund") return "Refund";

  return "Activity";
}

function getTypeIcon(type) {
  if (type === "credit") return "+";
  if (type === "debit") return "−";
  if (type === "deposit") return "↗";
  if (type === "order") return "↘";
  if (type === "refund") return "↺";

  return "•";
}

function getTypeClass(type) {
  if (type === "credit") return "transactionsTypeCredit";
  if (type === "deposit") return "transactionsTypeCredit";
  if (type === "debit") return "transactionsTypeDebit";
  if (type === "order") return "transactionsTypeDebit";
  if (type === "refund") return "transactionsTypeRefund";

  return "transactionsTypeNeutral";
}

function getStatusClass(status) {
  const cleanStatus = getCleanText(status);

  if (
    ["completed", "approved", "paid", "success", "captured"].includes(cleanStatus)
  ) {
    return "transactionsStatusSuccess";
  }

  if (
    ["pending", "created", "processing", "waiting", "review"].includes(cleanStatus)
  ) {
    return "transactionsStatusPending";
  }

  if (
    ["failed", "cancelled", "canceled", "rejected", "refunded"].includes(
      cleanStatus
    )
  ) {
    return "transactionsStatusDanger";
  }

  return "transactionsStatusNeutral";
}

function getDisplayTitle(transaction) {
  const type = getTransactionType(transaction);

  if (transaction.description) return transaction.description;
  if (type === "deposit") return "Wallet deposit";
  if (type === "order") return "Order payment";
  if (type === "refund") return "Balance refund";
  if (type === "credit") return "Wallet credit";
  if (type === "debit") return "Wallet debit";

  return "Wallet transaction";
}

function Transactions() {
  const { selectedCurrency, selectedCurrencyMeta, currencyRateText, formatMoney } =
    useCurrency();

  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortMode, setSortMode] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);

  const loadTransactions = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const res = await api.get("/transactions/my");
      setTransactions(res.data.transactions || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load transactions");
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const formatSignedMoney = (amount) => {
    const numberAmount = Number(amount || 0);
    const sign = numberAmount >= 0 ? "+" : "−";

    return `${sign}${formatMoney(Math.abs(numberAmount))}`;
  };

  const preparedTransactions = useMemo(() => {
    return transactions.map((transaction) => {
      const amount = Number(transaction.amount || 0);
      const type = getTransactionType(transaction);
      const status = transaction.status || "completed";

      return {
        ...transaction,
        amount,
        type,
        status,
        title: getDisplayTitle(transaction),
        provider: transaction.provider || "Wallet",
        reference:
          transaction.reference ||
          transaction.paymentReference ||
          transaction._id ||
          "-",
        createdAt: transaction.createdAt || transaction.updatedAt,
      };
    });
  }, [transactions]);

  const stats = useMemo(() => {
    const completedTransactions = preparedTransactions.filter((transaction) =>
      ["completed", "approved", "paid", "success", "captured"].includes(
        getCleanText(transaction.status)
      )
    );

    const totalCredits = completedTransactions
      .filter((transaction) => transaction.amount > 0)
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

    const totalDebits = completedTransactions
      .filter((transaction) => transaction.amount < 0)
      .reduce(
        (sum, transaction) => sum + Math.abs(Number(transaction.amount || 0)),
        0
      );

    const pendingCount = preparedTransactions.filter((transaction) =>
      ["pending", "created", "processing", "waiting", "review"].includes(
        getCleanText(transaction.status)
      )
    ).length;

    const refundTotal = completedTransactions
      .filter((transaction) => transaction.type === "refund")
      .reduce(
        (sum, transaction) => sum + Math.abs(Number(transaction.amount || 0)),
        0
      );

    return {
      totalCredits,
      totalDebits,
      pendingCount,
      refundTotal,
      totalCount: preparedTransactions.length,
    };
  }, [preparedTransactions]);

  const filteredTransactions = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    const filtered = preparedTransactions.filter((transaction) => {
      const cleanStatus = getCleanText(transaction.status);
      const cleanType = getCleanText(transaction.type);

      const matchesFilter =
        activeFilter === "all" ||
        activeFilter === cleanType ||
        activeFilter === cleanStatus ||
        (activeFilter === "completed" &&
          ["completed", "approved", "paid", "success", "captured"].includes(
            cleanStatus
          )) ||
        (activeFilter === "pending" &&
          ["pending", "created", "processing", "waiting", "review"].includes(
            cleanStatus
          ));

      const searchBlob = [
        transaction.type,
        transaction.amount,
        transaction.status,
        transaction.provider,
        transaction.reference,
        transaction.description,
        transaction.title,
        transaction.createdAt,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !cleanSearch || searchBlob.includes(cleanSearch);

      return matchesFilter && matchesSearch;
    });

    return filtered.sort((a, b) => {
      if (sortMode === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }

      if (sortMode === "highest") {
        return Math.abs(Number(b.amount || 0)) - Math.abs(Number(a.amount || 0));
      }

      if (sortMode === "lowest") {
        return Math.abs(Number(a.amount || 0)) - Math.abs(Number(b.amount || 0));
      }

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [preparedTransactions, search, activeFilter, sortMode]);

  const latestTransactions = useMemo(() => {
    return [...preparedTransactions]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 4);
  }, [preparedTransactions]);

  return (
    <main className="transactionsPagePro">
      <div className="transactionsAurora" aria-hidden="true">
        <span className="transactionsAuroraOne" />
        <span className="transactionsAuroraTwo" />
        <span className="transactionsAuroraThree" />
        <span className="transactionsAuroraFour" />
      </div>

      <div className="transactionsFloatingLayer" aria-hidden="true">
        {floatingTransactionItems.map((item, index) => (
          <span
            className={`transactionsFloat transactionsFloat${index + 1}`}
            key={`${item}-${index}`}
          >
            {item}
          </span>
        ))}
      </div>

      <section className="transactionsHeroPro">
        <div className="transactionsHeroContent">
          <div className="transactionsBadgePro">
            <span />
            Premium balance history
          </div>

          <h1>Track every wallet movement with full control.</h1>

          <p>
            Deposits, orders, refunds and balance updates are organized in one
            clean transaction center with filters, search and live account
            overview.
          </p>

          <div className="transactionsHeroActions">
            <a href="#transactions-history" className="transactionsPrimaryBtn">
              View Transactions
            </a>

            <button
              type="button"
              className="transactionsSecondaryBtn"
              onClick={loadTransactions}
            >
              Refresh Data
            </button>
          </div>
        </div>

        <aside className="transactionsBalanceCard" title={currencyRateText}>
          <div className="transactionsBalanceGlow" />

          <span>Total records</span>
          <strong>{stats.totalCount}</strong>
          <small>
            All wallet balance movements · shown in {selectedCurrencyMeta.flag}{" "}
            {selectedCurrency}
          </small>

          <div className="transactionsBalanceMiniGrid">
            <div>
              <span>Credits</span>
              <b>{formatMoney(stats.totalCredits)}</b>
            </div>

            <div>
              <span>Pending</span>
              <b>{stats.pendingCount}</b>
            </div>
          </div>
        </aside>
      </section>

      {message && (
        <section className="transactionsMessage transactionsMessageError">
          <span>!</span>
          <p>{message}</p>
        </section>
      )}

      <section className="transactionsStatsGrid">
        <article
          className="transactionsStatCard transactionsStatMain"
          title={currencyRateText}
        >
          <span>Total credits</span>
          <strong>{formatMoney(stats.totalCredits)}</strong>
          <small>
            Completed positive balance movements · shown in{" "}
            {selectedCurrencyMeta.flag} {selectedCurrency}
          </small>
        </article>

        <article className="transactionsStatCard" title={currencyRateText}>
          <span>Total spent</span>
          <strong>{formatMoney(stats.totalDebits)}</strong>
          <small>
            Orders and debit movements · shown in {selectedCurrencyMeta.flag}{" "}
            {selectedCurrency}
          </small>
        </article>

        <article className="transactionsStatCard" title={currencyRateText}>
          <span>Refunds</span>
          <strong>{formatMoney(stats.refundTotal)}</strong>
          <small>
            Returned wallet balance · shown in {selectedCurrencyMeta.flag}{" "}
            {selectedCurrency}
          </small>
        </article>

        <article className="transactionsStatCard">
          <span>Pending</span>
          <strong>{stats.pendingCount}</strong>
          <small>Waiting or processing records</small>
        </article>
      </section>

      <section className="transactionsMainGrid">
        <section
          className="transactionsPanel transactionsHistoryPanel"
          id="transactions-history"
        >
          <div className="transactionsPanelHeader">
            <div>
              <span>Balance activity</span>
              <h2>My Transactions</h2>
            </div>

            <div className="transactionsPanelIcon">
              {filteredTransactions.length}
            </div>
          </div>

          <div className="transactionsToolbar">
            <label className="transactionsSearchBox">
              <span>Search history</span>
              <input
                type="text"
                placeholder="Search type, provider, reference, description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>

            <label className="transactionsSortBox">
              <span>Sort by</span>
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value)}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="highest">Highest amount</option>
                <option value="lowest">Lowest amount</option>
              </select>
            </label>
          </div>

          <div className="transactionsFilterRail">
            {filterOptions.map((filter) => (
              <button
                type="button"
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={
                  activeFilter === filter.value
                    ? "transactionsFilterActive"
                    : ""
                }
              >
                {filter.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="transactionsSkeletonList">
              <span />
              <span />
              <span />
              <span />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="transactionsEmptyBox">
              <strong>No transactions found</strong>
              <span>
                Your deposits, orders and refunds will appear here after your
                first wallet activity.
              </span>
            </div>
          ) : (
            <>
              <div className="transactionsTableWrap">
                <table className="transactionsTable">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Provider</th>
                      <th>Reference</th>
                      <th>Description</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTransactions.map((transaction) => {
                      const isPositive = Number(transaction.amount || 0) >= 0;
                      const type = transaction.type;

                      return (
                        <tr key={transaction._id}>
                          <td>
                            <span
                              className={`transactionsTypePill ${getTypeClass(
                                type
                              )}`}
                            >
                              <b>{getTypeIcon(type)}</b>
                              {getTypeLabel(type)}
                            </span>
                          </td>

                          <td title={currencyRateText}>
                            <strong
                              className={
                                isPositive
                                  ? "transactionsAmountPositive"
                                  : "transactionsAmountNegative"
                              }
                            >
                              {formatSignedMoney(transaction.amount)}
                            </strong>
                          </td>

                          <td>
                            <span
                              className={`transactionsStatusPill ${getStatusClass(
                                transaction.status
                              )}`}
                            >
                              {transaction.status || "completed"}
                            </span>
                          </td>

                          <td>
                            <span className="transactionsProvider">
                              {transaction.provider || "Wallet"}
                            </span>
                          </td>

                          <td>
                            <span className="transactionsReference">
                              {transaction.reference || "-"}
                            </span>
                          </td>

                          <td>
                            <div className="transactionsDescriptionCell">
                              <strong>{transaction.title}</strong>
                              <span>{transaction.description || "-"}</span>
                            </div>
                          </td>

                          <td>{formatDate(transaction.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="transactionsMobileList">
                {filteredTransactions.map((transaction) => {
                  const isPositive = Number(transaction.amount || 0) >= 0;
                  const type = transaction.type;

                  return (
                    <article
                      className="transactionsMobileCard"
                      key={`mobile-${transaction._id}`}
                    >
                      <div className="transactionsMobileTop">
                        <span
                          className={`transactionsTypeBubble ${getTypeClass(
                            type
                          )}`}
                        >
                          {getTypeIcon(type)}
                        </span>

                        <div>
                          <strong>{transaction.title}</strong>
                          <small>{formatDate(transaction.createdAt)}</small>
                        </div>
                      </div>

                      <div className="transactionsMobileMeta">
                        <div>
                          <span>Provider</span>
                          <b>{transaction.provider || "Wallet"}</b>
                        </div>

                        <div>
                          <span>Reference</span>
                          <b>{transaction.reference || "-"}</b>
                        </div>
                      </div>

                      <div className="transactionsMobileBottom">
                        <strong
                          className={
                            isPositive
                              ? "transactionsAmountPositive"
                              : "transactionsAmountNegative"
                          }
                          title={currencyRateText}
                        >
                          {formatSignedMoney(transaction.amount)}
                        </strong>

                        <span
                          className={`transactionsStatusPill ${getStatusClass(
                            transaction.status
                          )}`}
                        >
                          {transaction.status || "completed"}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}

          <p
            style={{
              margin: "18px 0 0",
              color: "#8fa4c2",
              fontSize: "12px",
              fontWeight: 800,
              lineHeight: 1.5,
              textAlign: "center",
            }}
            title={currencyRateText}
          >
            Transactions are stored in EUR. Values on this page are displayed in{" "}
            {selectedCurrencyMeta.flag} {selectedCurrency} using your selected
            display currency.
          </p>
        </section>

        <aside className="transactionsPanel transactionsSidePanel">
          <div className="transactionsPanelHeader">
            <div>
              <span>Live overview</span>
              <h2>Recent Moves</h2>
            </div>

            <div className="transactionsPanelIcon">↗</div>
          </div>

          {isLoading ? (
            <div className="transactionsSideSkeleton">
              <span />
              <span />
              <span />
            </div>
          ) : latestTransactions.length === 0 ? (
            <div className="transactionsEmptyBox">
              <strong>No recent activity</strong>
              <span>Latest balance movements will appear here.</span>
            </div>
          ) : (
            <div className="transactionsTimeline">
              {latestTransactions.map((transaction) => {
                const type = transaction.type;
                const isPositive = Number(transaction.amount || 0) >= 0;

                return (
                  <article
                    className="transactionsTimelineItem"
                    key={`latest-${transaction._id}`}
                  >
                    <div
                      className={`transactionsTimelineDot ${getTypeClass(type)}`}
                    >
                      {getTypeIcon(type)}
                    </div>

                    <div>
                      <strong>{transaction.title}</strong>
                      <span>{formatDate(transaction.createdAt)}</span>
                      <b
                        className={
                          isPositive
                            ? "transactionsAmountPositive"
                            : "transactionsAmountNegative"
                        }
                        title={currencyRateText}
                      >
                        {formatSignedMoney(transaction.amount)}
                      </b>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="transactionsInsightBox">
            <span>Account insight</span>
            <strong>
              {stats.pendingCount > 0
                ? `${stats.pendingCount} pending transaction${
                    stats.pendingCount === 1 ? "" : "s"
                  } in review.`
                : "Your wallet history is clean."}
            </strong>
            <p>
              Every payment, order and refund stays visible here, so your
              balance never feels random or unclear.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default Transactions;