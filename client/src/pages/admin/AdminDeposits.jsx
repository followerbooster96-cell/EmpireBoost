import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api.js";
import "./AdminDeposits.css";

const methods = [
  { value: "all", label: "All Methods", short: "ALL" },
  { value: "crypto", label: "Crypto", short: "CR" },
  { value: "revolut", label: "Revolut", short: "RV" },
  { value: "bank", label: "Bank", short: "BK" },
  { value: "manual", label: "Manual", short: "MN" },
];

const statuses = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const floatingItems = [
  "Approve",
  "Crypto",
  "Revolut",
  "Bank",
  "Deposits",
  "Wallet",
  "Balance",
  "Payments",
  "Pending",
  "Secure",
  "Admin",
  "Review",
  "Top Up",
  "Manual",
  "Tracking",
  "Growth",
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

function getStatusLabel(status) {
  const cleanStatus = String(status || "").toLowerCase();

  if (cleanStatus === "approved") return "Approved";
  if (cleanStatus === "rejected") return "Rejected";

  return "Pending";
}

function getStatusClass(status) {
  const cleanStatus = String(status || "").toLowerCase();

  if (cleanStatus === "approved") return "adminDepositStatusApproved";
  if (cleanStatus === "rejected") return "adminDepositStatusRejected";

  return "adminDepositStatusPending";
}

function getMethodData(method) {
  const cleanMethod = String(method || "manual").toLowerCase();

  if (cleanMethod === "crypto") {
    return {
      label: "Crypto",
      short: "CR",
      className: "adminDepositMethodCrypto",
    };
  }

  if (cleanMethod === "revolut") {
    return {
      label: "Revolut",
      short: "RV",
      className: "adminDepositMethodRevolut",
    };
  }

  if (cleanMethod === "bank") {
    return {
      label: "Bank",
      short: "BK",
      className: "adminDepositMethodBank",
    };
  }

  if (cleanMethod === "paypal") {
    return {
      label: "PayPal",
      short: "PP",
      className: "adminDepositMethodPaypal",
    };
  }

  return {
    label: "Manual",
    short: "MN",
    className: "adminDepositMethodManual",
  };
}

function AdminDeposits() {
  const [deposits, setDeposits] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState("");

  const loadDeposits = async () => {
    setIsLoading(true);

    try {
      const res = await api.get("/deposits/admin/all", {
        params: {
          status: statusFilter,
          method: methodFilter,
          search,
        },
      });

      setDeposits(res.data.deposits || []);
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Failed to load deposits.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDeposits();
  }, []);

  const stats = useMemo(() => {
    const pending = deposits.filter((deposit) => deposit.status === "pending");
    const approved = deposits.filter((deposit) => deposit.status === "approved");
    const rejected = deposits.filter((deposit) => deposit.status === "rejected");

    const pendingAmount = pending.reduce(
      (sum, deposit) => sum + Number(deposit.finalAmount || deposit.amount || 0),
      0
    );

    const approvedAmount = approved.reduce(
      (sum, deposit) => sum + Number(deposit.finalAmount || deposit.amount || 0),
      0
    );

    return {
      total: deposits.length,
      pending: pending.length,
      approved: approved.length,
      rejected: rejected.length,
      pendingAmount,
      approvedAmount,
    };
  }, [deposits]);

  const approveDeposit = async (id) => {
    const adminNote = window.prompt("Admin note optional:", "");

    if (adminNote === null) return;

    setActionId(id);
    setMessage("");

    try {
      await api.put(`/deposits/admin/${id}/approve`, {
        adminNote,
      });

      setMessageType("success");
      setMessage("Deposit approved. Balance has been added to the user.");
      await loadDeposits();
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Approve failed.");
    } finally {
      setActionId("");
    }
  };

  const rejectDeposit = async (id) => {
    const adminNote = window.prompt("Reason for rejection:");

    if (adminNote === null) return;

    setActionId(id);
    setMessage("");

    try {
      await api.put(`/deposits/admin/${id}/reject`, {
        adminNote,
      });

      setMessageType("success");
      setMessage("Deposit rejected.");
      await loadDeposits();
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Reject failed.");
    } finally {
      setActionId("");
    }
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setMethodFilter("all");
    setSearch("");

    setTimeout(() => {
      loadDeposits();
    }, 0);
  };

  return (
    <main className="adminDepositsPage">
      <div className="adminDepositsAurora" aria-hidden="true">
        <span className="adminDepositsAuroraOne" />
        <span className="adminDepositsAuroraTwo" />
        <span className="adminDepositsAuroraThree" />
      </div>

      <div className="adminDepositsFloatingLayer" aria-hidden="true">
        {floatingItems.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className={`adminDepositsFloat adminDepositsFloat${index + 1}`}
          >
            {item}
          </span>
        ))}
      </div>

      <section className="adminDepositsHero">
        <div className="adminDepositsHeroContent">
          <div className="adminDepositsBadge">
            <span />
            Admin wallet control
          </div>

          <h1>Review and approve manual deposit requests.</h1>

          <p>
            Control Crypto, Revolut and Bank top-ups from one clean admin page.
            Approve requests, reject suspicious payments and keep wallet credits
            under control.
          </p>

          <div className="adminDepositsHeroActions">
            <button type="button" onClick={loadDeposits} className="adminDepositsPrimaryBtn">
              Refresh Deposits
            </button>

            <button type="button" onClick={clearFilters} className="adminDepositsSecondaryBtn">
              Clear Filters
            </button>
          </div>
        </div>

        <aside className="adminDepositsControlCard">
          <div className="adminDepositsControlGlow" />

          <span>Pending amount</span>
          <strong>€{formatMoney(stats.pendingAmount)}</strong>
          <small>Waiting for admin verification</small>

          <div className="adminDepositsMiniGrid">
            <div>
              <span>Pending</span>
              <b>{stats.pending}</b>
            </div>

            <div>
              <span>Approved</span>
              <b>{stats.approved}</b>
            </div>
          </div>
        </aside>
      </section>

      {message && (
        <section className={`adminDepositsMessage adminDepositsMessage-${messageType}`}>
          <span>{messageType === "success" ? "✓" : messageType === "error" ? "!" : "i"}</span>
          <p>{message}</p>
        </section>
      )}

      <section className="adminDepositsStatsGrid">
        <article className="adminDepositsStatCard adminDepositsStatMain">
          <span>Total requests</span>
          <strong>{stats.total}</strong>
          <small>All loaded deposit requests</small>
        </article>

        <article className="adminDepositsStatCard">
          <span>Pending</span>
          <strong>{stats.pending}</strong>
          <small>€{formatMoney(stats.pendingAmount)} waiting</small>
        </article>

        <article className="adminDepositsStatCard">
          <span>Approved</span>
          <strong>{stats.approved}</strong>
          <small>€{formatMoney(stats.approvedAmount)} credited</small>
        </article>

        <article className="adminDepositsStatCard">
          <span>Rejected</span>
          <strong>{stats.rejected}</strong>
          <small>Declined manual requests</small>
        </article>
      </section>

      <section className="adminDepositsPanel adminDepositsFiltersPanel">
        <div className="adminDepositsPanelHeader">
          <div>
            <span>Filters</span>
            <h2>Find requests faster</h2>
          </div>

          <div className="adminDepositsPanelIcon">⌕</div>
        </div>

        <div className="adminDepositsFiltersGrid">
          <label>
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Method</span>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
            >
              {methods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Search</span>
            <input
              type="text"
              placeholder="Reference, promo, user note..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <div className="adminDepositsFilterActions">
            <button type="button" onClick={loadDeposits}>
              Apply
            </button>

            <button type="button" onClick={clearFilters}>
              Reset
            </button>
          </div>
        </div>
      </section>

      <section className="adminDepositsPanel adminDepositsTablePanel">
        <div className="adminDepositsPanelHeader">
          <div>
            <span>Deposit requests</span>
            <h2>Manual wallet top-ups</h2>
          </div>

          <div className="adminDepositsPanelIcon">{deposits.length}</div>
        </div>

        {isLoading ? (
          <div className="adminDepositsSkeletonList">
            <span />
            <span />
            <span />
          </div>
        ) : deposits.length === 0 ? (
          <div className="adminDepositsEmptyBox">
            <strong>No deposits found</strong>
            <span>Try changing filters or refresh the page.</span>
          </div>
        ) : (
          <div className="adminDepositsTableWrap">
            <table className="adminDepositsTable">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>User</th>
                  <th>Balance</th>
                  <th>Amount</th>
                  <th>Promo</th>
                  <th>Bonus</th>
                  <th>Final</th>
                  <th>Method</th>
                  <th>User Note</th>
                  <th>Admin Note</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {deposits.map((deposit) => {
                  const methodData = getMethodData(deposit.method);

                  return (
                    <tr key={deposit._id}>
                      <td>
                        <strong className="adminDepositsReference">
                          {deposit.paymentReference}
                        </strong>
                      </td>

                      <td>
                        <div className="adminDepositsUserCell">
                          <strong>{deposit.userId?.email || "-"}</strong>
                          <span>{deposit.userId?.role || "user"}</span>
                        </div>
                      </td>

                      <td>€{formatMoney(deposit.userId?.balance)}</td>

                      <td>€{formatMoney(deposit.amount)}</td>

                      <td>{deposit.promoCode || "-"}</td>

                      <td>€{formatMoney(deposit.bonusAmount)}</td>

                      <td>
                        <strong>€{formatMoney(deposit.finalAmount || deposit.amount)}</strong>
                      </td>

                      <td>
                        <span className={`adminDepositsMethodPill ${methodData.className}`}>
                          <b>{methodData.short}</b>
                          {methodData.label}
                        </span>
                      </td>

                      <td>
                        <span className="adminDepositsNoteText">
                          {deposit.userNote || "-"}
                        </span>
                      </td>

                      <td>
                        <span className="adminDepositsNoteText">
                          {deposit.adminNote || "-"}
                        </span>
                      </td>

                      <td>
                        <span className={`adminDepositsStatusPill ${getStatusClass(deposit.status)}`}>
                          {getStatusLabel(deposit.status)}
                        </span>
                      </td>

                      <td>{formatDate(deposit.createdAt)}</td>

                      <td>
                        {deposit.status === "pending" ? (
                          <div className="adminDepositsActionGroup">
                            <button
                              type="button"
                              className="adminDepositsApproveBtn"
                              onClick={() => approveDeposit(deposit._id)}
                              disabled={actionId === deposit._id}
                            >
                              {actionId === deposit._id ? "..." : "Approve"}
                            </button>

                            <button
                              type="button"
                              className="adminDepositsRejectBtn"
                              onClick={() => rejectDeposit(deposit._id)}
                              disabled={actionId === deposit._id}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="adminDepositsProcessedText">
                            Processed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminDeposits;