import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api.js";
import "./AdminTransactions.css";

const floatingAdminTransactionItems = [
  "Transactions",
  "Admin",
  "Wallet",
  "Balance",
  "Revenue",
  "Deposits",
  "Orders",
  "Refunds",
  "Payments",
  "Users",
  "History",
  "Control",
  "Tracking",
  "EmpireBoost",
  "Audit",
  "Credits",
  "Debits",
  "Finance",
];

const statusFilters = ["All", "completed", "pending", "failed", "cancelled", "refunded"];
const typeFilters = ["All", "credit", "debit", "deposit", "order", "refund", "payment", "other"];
const providerFilters = ["All", "wallet", "paypal", "crypto", "revolut", "bank", "admin", "other"];

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "highest", label: "Highest amount" },
  { value: "lowest", label: "Lowest amount" },
  { value: "user", label: "User A-Z" },
];

function formatMoney(value) {
  const number = Number(value || 0);

  return number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(value) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return "-";
  }
}

function cleanText(value) {
  return String(value || "").toLowerCase().trim();
}

function getUserEmail(transaction) {
  return transaction.userId?.email || transaction.user?.email || transaction.email || "-";
}

function getTransactionType(transaction) {
  const type = cleanText(transaction.type);
  const description = cleanText(transaction.description);
  const provider = cleanText(transaction.provider);
  const amount = Number(transaction.amount || 0);

  if (type.includes("refund") || description.includes("refund")) return "refund";
  if (type.includes("deposit") || description.includes("deposit")) return "deposit";
  if (type.includes("order") || description.includes("order")) return "order";
  if (type.includes("payment") || description.includes("payment")) return "payment";
  if (type.includes("credit")) return "credit";
  if (type.includes("debit")) return "debit";

  if (provider.includes("paypal") || provider.includes("crypto") || provider.includes("revolut")) {
    return amount >= 0 ? "deposit" : "payment";
  }

  if (amount > 0) return "credit";
  if (amount < 0) return "debit";

  return "other";
}

function getTypeLabel(type) {
  if (type === "credit") return "Credit";
  if (type === "debit") return "Debit";
  if (type === "deposit") return "Deposit";
  if (type === "order") return "Order";
  if (type === "refund") return "Refund";
  if (type === "payment") return "Payment";

  return "Other";
}

function getTypeIcon(type) {
  if (type === "credit") return "+";
  if (type === "debit") return "−";
  if (type === "deposit") return "↗";
  if (type === "order") return "↘";
  if (type === "refund") return "↺";
  if (type === "payment") return "€";

  return "•";
}

function getTypeClass(type) {
  if (type === "credit" || type === "deposit") return "adminTransactionsTypeCredit";
  if (type === "debit" || type === "order" || type === "payment") {
    return "adminTransactionsTypeDebit";
  }
  if (type === "refund") return "adminTransactionsTypeRefund";

  return "adminTransactionsTypeNeutral";
}

function getStatusClass(status) {
  const cleanStatus = cleanText(status);

  if (["completed", "approved", "paid", "success", "captured"].includes(cleanStatus)) {
    return "adminTransactionsStatusSuccess";
  }

  if (["pending", "created", "processing", "waiting", "review"].includes(cleanStatus)) {
    return "adminTransactionsStatusPending";
  }

  if (["failed", "cancelled", "canceled", "rejected"].includes(cleanStatus)) {
    return "adminTransactionsStatusDanger";
  }

  if (["refunded"].includes(cleanStatus)) {
    return "adminTransactionsStatusRefund";
  }

  return "adminTransactionsStatusNeutral";
}

function getProviderLabel(provider) {
  if (!provider) return "Wallet";

  return String(provider)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getDisplayTitle(transaction) {
  const type = getTransactionType(transaction);

  if (transaction.description) return transaction.description;
  if (type === "deposit") return "Wallet deposit";
  if (type === "order") return "Order payment";
  if (type === "refund") return "Balance refund";
  if (type === "credit") return "Wallet credit";
  if (type === "debit") return "Wallet debit";
  if (type === "payment") return "Payment transaction";

  return "Wallet transaction";
}

function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [providerFilter, setProviderFilter] = useState("All");
  const [sortMode, setSortMode] = useState("newest");

  const loadTransactions = async () => {
    setIsLoading(true);

    try {
      const res = await api.get("/transactions/admin/all");
      setTransactions(res.data.transactions || []);
      setMessage("");
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Failed to load transactions");
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const preparedTransactions = useMemo(() => {
    return transactions.map((transaction) => {
      const amount = Number(transaction.amount || 0);
      const type = getTransactionType(transaction);

      return {
        ...transaction,
        amount,
        type,
        title: getDisplayTitle(transaction),
        userEmail: getUserEmail(transaction),
        provider: transaction.provider || "wallet",
        status: transaction.status || "completed",
        reference: transaction.reference || transaction.paymentReference || transaction._id || "-",
        createdAt: transaction.createdAt || transaction.updatedAt,
      };
    });
  }, [transactions]);

  const stats = useMemo(() => {
    const totalCredits = preparedTransactions
      .filter((transaction) => Number(transaction.amount || 0) > 0)
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);

    const totalDebits = preparedTransactions
      .filter((transaction) => Number(transaction.amount || 0) < 0)
      .reduce((sum, transaction) => sum + Math.abs(Number(transaction.amount || 0)), 0);

    const pendingCount = preparedTransactions.filter((transaction) =>
      ["pending", "created", "processing", "waiting", "review"].includes(
        cleanText(transaction.status)
      )
    ).length;

    const completedCount = preparedTransactions.filter((transaction) =>
      ["completed", "approved", "paid", "success", "captured"].includes(
        cleanText(transaction.status)
      )
    ).length;

    const refundTotal = preparedTransactions
      .filter((transaction) => transaction.type === "refund")
      .reduce((sum, transaction) => sum + Math.abs(Number(transaction.amount || 0)), 0);

    return {
      total: preparedTransactions.length,
      totalCredits,
      totalDebits,
      pendingCount,
      completedCount,
      refundTotal,
      netMovement: totalCredits - totalDebits,
    };
  }, [preparedTransactions]);

  const filteredTransactions = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    const filtered = preparedTransactions.filter((transaction) => {
      const status = cleanText(transaction.status);
      const type = cleanText(transaction.type);
      const provider = cleanText(transaction.provider);

      const matchesStatus = statusFilter === "All" || status === cleanText(statusFilter);
      const matchesType = typeFilter === "All" || type === cleanText(typeFilter);
      const matchesProvider =
        providerFilter === "All" ||
        provider === cleanText(providerFilter) ||
        provider.includes(cleanText(providerFilter));

      const searchBlob = [
        transaction.userEmail,
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

      return matchesStatus && matchesType && matchesProvider && matchesSearch;
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

      if (sortMode === "user") {
        return String(a.userEmail || "").localeCompare(String(b.userEmail || ""));
      }

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [preparedTransactions, search, statusFilter, typeFilter, providerFilter, sortMode]);

  const recentTransactions = useMemo(() => {
    return [...preparedTransactions]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);
  }, [preparedTransactions]);

  return (
    <main className="adminTransactionsPagePro">
      <div className="adminTransactionsAurora" aria-hidden="true">
        <span className="adminTransactionsAuroraOne" />
        <span className="adminTransactionsAuroraTwo" />
        <span className="adminTransactionsAuroraThree" />
        <span className="adminTransactionsAuroraFour" />
      </div>

      <div className="adminTransactionsFloatingLayer" aria-hidden="true">
        {floatingAdminTransactionItems.map((item, index) => (
          <span
            className={`adminTransactionsFloat adminTransactionsFloat${index + 1}`}
            key={`${item}-${index}`}
          >
            {item}
          </span>
        ))}
      </div>

      <section className="adminTransactionsHeroPro">
        <div className="adminTransactionsHeroContent">
          <div className="adminTransactionsBadgePro">
            <span />
            EmpireBoost financial control
          </div>

          <h1>Track every payment, refund and wallet movement.</h1>

          <p>
            Full admin transaction center for monitoring credits, debits, user balance movements,
            providers, references and financial activity across your panel.
          </p>

          <div className="adminTransactionsHeroActions">
            <a href="#admin-transactions-table" className="adminTransactionsPrimaryBtn">
              View Transactions
            </a>

            <button
              type="button"
              className="adminTransactionsSecondaryBtn"
              onClick={loadTransactions}
            >
              Refresh Data
            </button>
          </div>
        </div>

        <aside className="adminTransactionsInfoCard">
          <div className="adminTransactionsInfoGlow" />

          <span>Total records</span>
          <strong>{stats.total}</strong>
          <small>All wallet and payment movements</small>

          <div className="adminTransactionsInfoMiniGrid">
            <div>
              <span>Credits</span>
              <b>€{formatMoney(stats.totalCredits)}</b>
            </div>

            <div>
              <span>Pending</span>
              <b>{stats.pendingCount}</b>
            </div>
          </div>
        </aside>
      </section>

      {message && (
        <section className={`adminTransactionsMessage adminTransactionsMessage-${messageType}`}>
          <span>{messageType === "success" ? "✓" : messageType === "error" ? "!" : "i"}</span>
          <p>{message}</p>
        </section>
      )}

      <section className="adminTransactionsStatsGrid">
        <article className="adminTransactionsStatCard adminTransactionsStatMain">
          <span>Total credits</span>
          <strong>€{formatMoney(stats.totalCredits)}</strong>
          <small>Positive wallet movements</small>
        </article>

        <article className="adminTransactionsStatCard">
          <span>Total debits</span>
          <strong>€{formatMoney(stats.totalDebits)}</strong>
          <small>Orders and negative movements</small>
        </article>

        <article className="adminTransactionsStatCard">
          <span>Refunds</span>
          <strong>€{formatMoney(stats.refundTotal)}</strong>
          <small>Returned balance value</small>
        </article>

        <article className="adminTransactionsStatCard">
          <span>Net movement</span>
          <strong>€{formatMoney(stats.netMovement)}</strong>
          <small>Credits minus debits</small>
        </article>
      </section>

      <section className="adminTransactionsMainGrid">
        <section className="adminTransactionsPanel adminTransactionsTablePanel" id="admin-transactions-table">
          <div className="adminTransactionsPanelHeader">
            <div>
              <span>Transaction database</span>
              <h2>All Transactions</h2>
            </div>

            <div className="adminTransactionsPanelIcon">{filteredTransactions.length}</div>
          </div>

          <div className="adminTransactionsToolbar">
            <label className="adminTransactionsSearchBox">
              <span>Search</span>
              <input
                type="text"
                placeholder="Search user, type, provider, reference, description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>

            <label>
              <span>Status</span>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                {statusFilters.map((status) => (
                  <option value={status} key={status}>
                    {status === "All" ? "All statuses" : status}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Type</span>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                {typeFilters.map((type) => (
                  <option value={type} key={type}>
                    {type === "All" ? "All types" : type}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Provider</span>
              <select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)}>
                {providerFilters.map((provider) => (
                  <option value={provider} key={provider}>
                    {provider === "All" ? "All providers" : provider}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Sort</span>
              <select value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
                {sortOptions.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {isLoading ? (
            <div className="adminTransactionsSkeletonList">
              <span />
              <span />
              <span />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="adminTransactionsEmptyBox">
              <strong>No transactions found</strong>
              <span>Try another filter, search term or refresh the transaction database.</span>
            </div>
          ) : (
            <>
              <div className="adminTransactionsTableWrap">
                <table className="adminTransactionsTable">
                  <thead>
                    <tr>
                      <th>User</th>
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

                      return (
                        <tr key={transaction._id}>
                          <td>
                            <div className="adminTransactionsUserCell">
                              <div className="adminTransactionsAvatar">
                                {transaction.userEmail?.charAt(0)?.toUpperCase() || "U"}
                              </div>

                              <div>
                                <strong>{transaction.userEmail}</strong>
                                <span>ID: {transaction.userId?._id || transaction.userId || "-"}</span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span
                              className={`adminTransactionsTypePill ${getTypeClass(
                                transaction.type
                              )}`}
                            >
                              <b>{getTypeIcon(transaction.type)}</b>
                              {getTypeLabel(transaction.type)}
                            </span>
                          </td>

                          <td>
                            <strong
                              className={
                                isPositive
                                  ? "adminTransactionsAmountPositive"
                                  : "adminTransactionsAmountNegative"
                              }
                            >
                              {isPositive ? "+" : "−"}€{formatMoney(Math.abs(transaction.amount))}
                            </strong>
                          </td>

                          <td>
                            <span
                              className={`adminTransactionsStatusPill ${getStatusClass(
                                transaction.status
                              )}`}
                            >
                              {transaction.status || "completed"}
                            </span>
                          </td>

                          <td>
                            <span className="adminTransactionsProvider">
                              {getProviderLabel(transaction.provider)}
                            </span>
                          </td>

                          <td>
                            <span className="adminTransactionsReference">
                              {transaction.reference || "-"}
                            </span>
                          </td>

                          <td>
                            <div className="adminTransactionsDescriptionCell">
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

              <div className="adminTransactionsMobileList">
                {filteredTransactions.map((transaction) => {
                  const isPositive = Number(transaction.amount || 0) >= 0;

                  return (
                    <article className="adminTransactionsMobileCard" key={`mobile-${transaction._id}`}>
                      <div className="adminTransactionsMobileTop">
                        <div className="adminTransactionsAvatar">
                          {transaction.userEmail?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div>
                          <strong>{transaction.userEmail}</strong>
                          <small>{formatDate(transaction.createdAt)}</small>
                        </div>
                      </div>

                      <div className="adminTransactionsMobileMeta">
                        <div>
                          <span>Type</span>
                          <b>{getTypeLabel(transaction.type)}</b>
                        </div>

                        <div>
                          <span>Provider</span>
                          <b>{getProviderLabel(transaction.provider)}</b>
                        </div>

                        <div>
                          <span>Amount</span>
                          <b className={isPositive ? "adminTransactionsAmountPositive" : "adminTransactionsAmountNegative"}>
                            {isPositive ? "+" : "−"}€{formatMoney(Math.abs(transaction.amount))}
                          </b>
                        </div>

                        <div>
                          <span>Status</span>
                          <b>{transaction.status || "completed"}</b>
                        </div>
                      </div>

                      <p>{transaction.description || transaction.title || "Wallet transaction"}</p>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>

        <aside className="adminTransactionsPanel adminTransactionsSidePanel">
          <div className="adminTransactionsPanelHeader">
            <div>
              <span>Live overview</span>
              <h2>Recent Moves</h2>
            </div>

            <div className="adminTransactionsPanelIcon">↗</div>
          </div>

          {isLoading ? (
            <div className="adminTransactionsSkeletonList">
              <span />
              <span />
              <span />
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="adminTransactionsEmptyBox">
              <strong>No recent activity</strong>
              <span>Latest transactions will appear here.</span>
            </div>
          ) : (
            <div className="adminTransactionsRecentList">
              {recentTransactions.map((transaction) => {
                const isPositive = Number(transaction.amount || 0) >= 0;

                return (
                  <article className="adminTransactionsRecentItem" key={`recent-${transaction._id}`}>
                    <div className={`adminTransactionsRecentDot ${getTypeClass(transaction.type)}`}>
                      {getTypeIcon(transaction.type)}
                    </div>

                    <div>
                      <strong>{transaction.userEmail}</strong>
                      <span>{transaction.title}</span>
                      <b
                        className={
                          isPositive
                            ? "adminTransactionsAmountPositive"
                            : "adminTransactionsAmountNegative"
                        }
                      >
                        {isPositive ? "+" : "−"}€{formatMoney(Math.abs(transaction.amount))}
                      </b>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="adminTransactionsInsightBox">
            <span>Finance insight</span>
            <strong>{stats.pendingCount} pending transaction records.</strong>
            <p>
              Use search and filters to review providers, payments, refunds and user wallet
              movement without digging through raw database data.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default AdminTransactions;