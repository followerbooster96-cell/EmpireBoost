import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api.js";
import "./AdminOrders.css";

const statuses = ["pending", "processing", "completed", "failed", "cancelled", "refunded"];

const floatingItems = [
  "Admin",
  "Orders",
  "Queue",
  "Processing",
  "Completed",
  "Refund",
  "Users",
  "Service",
  "Links",
  "Delivery",
  "Control",
  "Status",
  "Growth",
  "Boost",
  "Tracking",
  "Review",
];

function formatMoney(value) {
  const number = Number(value || 0);

  return number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatNumber(value) {
  const number = Number(value || 0);
  return number.toLocaleString("en-US");
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

  if (cleanStatus === "completed") return "adminOrdersStatusCompleted";
  if (cleanStatus === "processing") return "adminOrdersStatusProcessing";
  if (cleanStatus === "failed") return "adminOrdersStatusFailed";
  if (cleanStatus === "cancelled") return "adminOrdersStatusCancelled";
  if (cleanStatus === "refunded") return "adminOrdersStatusRefunded";

  return "adminOrdersStatusPending";
}

function getStatusLabel(status) {
  const cleanStatus = String(status || "").toLowerCase();

  if (cleanStatus === "completed") return "Completed";
  if (cleanStatus === "processing") return "Processing";
  if (cleanStatus === "failed") return "Failed";
  if (cleanStatus === "cancelled") return "Cancelled";
  if (cleanStatus === "refunded") return "Refunded";

  return "Pending";
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState("");

  const loadOrders = async () => {
    setIsLoading(true);

    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const userEmail = order.userId?.email || "";
      const serviceName = order.serviceId?.name || "";
      const link = order.link || "";
      const status = order.status || "";

      const matchesSearch =
        search.trim() === "" ||
        userEmail.toLowerCase().includes(search.toLowerCase()) ||
        serviceName.toLowerCase().includes(search.toLowerCase()) ||
        link.toLowerCase().includes(search.toLowerCase()) ||
        status.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        String(order.status || "").toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const stats = useMemo(() => {
    const active = orders.filter((order) =>
      ["pending", "processing"].includes(String(order.status || "").toLowerCase())
    );

    const completed = orders.filter(
      (order) => String(order.status || "").toLowerCase() === "completed"
    );

    const revenue = orders
      .filter((order) => !["refunded", "cancelled"].includes(String(order.status || "").toLowerCase()))
      .reduce((sum, order) => sum + Number(order.charge || 0), 0);

    return {
      total: orders.length,
      active: active.length,
      completed: completed.length,
      revenue,
    };
  }, [orders]);

  const updateStatus = async (orderId, status) => {
    const notes = window.prompt(`Optional admin note for ${status}:`, "");

    if (notes === null) return;

    setActionId(orderId);
    setMessage("");

    try {
      await api.put(`/admin/orders/${orderId}/status`, {
        status,
        notes,
      });

      setMessageType("success");
      setMessage(`Order changed to ${status}.`);
      await loadOrders();
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Status update failed.");
    } finally {
      setActionId("");
    }
  };

  return (
    <main className="adminOrdersPage">
      <div className="adminOrdersAurora" aria-hidden="true">
        <span className="adminOrdersAuroraOne" />
        <span className="adminOrdersAuroraTwo" />
        <span className="adminOrdersAuroraThree" />
      </div>

      <div className="adminOrdersFloatingLayer" aria-hidden="true">
        {floatingItems.map((item, index) => (
          <span key={`${item}-${index}`} className={`adminOrdersFloat adminOrdersFloat${index + 1}`}>
            {item}
          </span>
        ))}
      </div>

      <section className="adminOrdersHero">
        <div className="adminOrdersHeroContent">
          <div className="adminOrdersBadge">
            <span />
            Admin order control
          </div>

          <h1>Control every customer order from one command room.</h1>

          <p>
            Review services, links, quantities and delivery states. Move orders through
            processing, completion, failure, cancellation or refund with clean admin control.
          </p>

          <div className="adminOrdersHeroActions">
            <button type="button" onClick={loadOrders} className="adminOrdersPrimaryBtn">
              Refresh Orders
            </button>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              className="adminOrdersSecondaryBtn"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <aside className="adminOrdersControlCard">
          <div className="adminOrdersControlGlow" />

          <span>Active queue</span>
          <strong>{stats.active}</strong>
          <small>Pending or processing orders</small>

          <div className="adminOrdersMiniGrid">
            <div>
              <span>Total</span>
              <b>{stats.total}</b>
            </div>

            <div>
              <span>Revenue</span>
              <b>€{formatMoney(stats.revenue)}</b>
            </div>
          </div>
        </aside>
      </section>

      {message && (
        <section className={`adminOrdersMessage adminOrdersMessage-${messageType}`}>
          <span>{messageType === "success" ? "✓" : messageType === "error" ? "!" : "i"}</span>
          <p>{message}</p>
        </section>
      )}

      <section className="adminOrdersStatsGrid">
        <article className="adminOrdersStatCard adminOrdersStatMain">
          <span>Total orders</span>
          <strong>{stats.total}</strong>
          <small>All customer orders</small>
        </article>

        <article className="adminOrdersStatCard">
          <span>Active queue</span>
          <strong>{stats.active}</strong>
          <small>Needs attention</small>
        </article>

        <article className="adminOrdersStatCard">
          <span>Completed</span>
          <strong>{stats.completed}</strong>
          <small>Delivered orders</small>
        </article>

        <article className="adminOrdersStatCard">
          <span>Revenue</span>
          <strong>€{formatMoney(stats.revenue)}</strong>
          <small>Excluding refunded/cancelled</small>
        </article>
      </section>

      <section className="adminOrdersPanel adminOrdersFiltersPanel">
        <div className="adminOrdersPanelHeader">
          <div>
            <span>Filters</span>
            <h2>Find orders faster</h2>
          </div>

          <div className="adminOrdersPanelIcon">⌕</div>
        </div>

        <div className="adminOrdersFiltersGrid">
          <label>
            <span>Search</span>
            <input
              type="text"
              placeholder="User, service, link or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <label>
            <span>Status</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
          </label>

          <div className="adminOrdersFilterActions">
            <button type="button" onClick={loadOrders}>
              Apply
            </button>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      <section className="adminOrdersPanel adminOrdersTablePanel">
        <div className="adminOrdersPanelHeader">
          <div>
            <span>Order list</span>
            <h2>Customer order queue</h2>
          </div>

          <div className="adminOrdersPanelIcon">{filteredOrders.length}</div>
        </div>

        {isLoading ? (
          <div className="adminOrdersSkeletonList">
            <span />
            <span />
            <span />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="adminOrdersEmptyBox">
            <strong>No orders found</strong>
            <span>Try changing filters or refresh the page.</span>
          </div>
        ) : (
          <div className="adminOrdersTableWrap">
            <table className="adminOrdersTable">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Service</th>
                  <th>Link</th>
                  <th>Qty</th>
                  <th>Charge</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Change Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <div className="adminOrdersUserCell">
                        <strong>{order.userId?.email || "-"}</strong>
                        <span>€{formatMoney(order.userId?.balance)} balance</span>
                      </div>
                    </td>

                    <td>
                      <div className="adminOrdersServiceCell">
                        <strong>{order.serviceId?.name || "Service order"}</strong>
                        <span>
                          {order.serviceId?.platform || "-"} · {order.serviceId?.type || "Boost"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <a
                        href={order.link}
                        target="_blank"
                        rel="noreferrer"
                        className="adminOrdersLink"
                      >
                        {order.link}
                      </a>
                    </td>

                    <td>{formatNumber(order.quantity)}</td>

                    <td>
                      <strong>€{formatMoney(order.charge)}</strong>
                    </td>

                    <td>
                      <span className={`adminOrdersStatusPill ${getStatusClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>

                    <td>{formatDate(order.createdAt)}</td>

                    <td>
                      <div className="adminOrdersActionGroup">
                        {statuses.map((status) => (
                          <button
                            key={status}
                            type="button"
                            className={`adminOrdersStatusBtn ${getStatusClass(status)}`}
                            onClick={() => updateStatus(order._id, status)}
                            disabled={actionId === order._id || order.status === status}
                          >
                            {getStatusLabel(status)}
                          </button>
                        ))}
                      </div>
                    </td>
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

export default AdminOrders;