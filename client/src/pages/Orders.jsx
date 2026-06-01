import { useEffect, useMemo, useState } from "react";
import api from "../lib/api.js";
import useCurrency from "../lib/useCurrency.js";
import "./Orders.css";

const floatingItems = [
  "Orders",
  "Tracking",
  "Growth",
  "Views",
  "Likes",
  "Followers",
  "Processing",
  "Completed",
  "Queue",
  "Delivery",
  "Status",
  "Service",
  "Creator",
  "Boost",
  "Fast",
  "Premium",
];

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

  if (cleanStatus === "completed") return "ordersStatusCompleted";
  if (cleanStatus === "processing") return "ordersStatusProcessing";
  if (cleanStatus === "failed") return "ordersStatusFailed";
  if (cleanStatus === "cancelled") return "ordersStatusCancelled";
  if (cleanStatus === "refunded") return "ordersStatusRefunded";

  return "ordersStatusPending";
}

function getProgress(status) {
  const cleanStatus = String(status || "").toLowerCase();

  if (cleanStatus === "completed") return 100;
  if (cleanStatus === "processing") return 62;
  if (cleanStatus === "failed") return 100;
  if (cleanStatus === "cancelled") return 100;
  if (cleanStatus === "refunded") return 100;

  return 22;
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

function Orders() {
  const { selectedCurrency, selectedCurrencyMeta, currencyRateText, formatMoney } =
    useCurrency();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    setIsLoading(true);

    try {
      const res = await api.get("/orders/my");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const serviceName = order.serviceId?.name || "";
      const link = order.link || "";
      const status = order.status || "";

      const matchesSearch =
        search.trim() === "" ||
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
      ["pending", "processing"].includes(
        String(order.status || "").toLowerCase()
      )
    );

    const completed = orders.filter(
      (order) => String(order.status || "").toLowerCase() === "completed"
    );

    const spent = orders.reduce(
      (sum, order) => sum + Number(order.charge || 0),
      0
    );

    return {
      total: orders.length,
      active: active.length,
      completed: completed.length,
      spent,
    };
  }, [orders]);

  return (
    <main className="ordersPagePro">
      <div className="ordersAurora" aria-hidden="true">
        <span className="ordersAuroraOne" />
        <span className="ordersAuroraTwo" />
        <span className="ordersAuroraThree" />
      </div>

      <div className="ordersFloatingLayer" aria-hidden="true">
        {floatingItems.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className={`ordersFloat ordersFloat${index + 1}`}
          >
            {item}
          </span>
        ))}
      </div>

      <section className="ordersHero">
        <div className="ordersHeroContent">
          <div className="ordersBadge">
            <span />
            Order tracking center
          </div>

          <h1>Track every boost from one clean dashboard.</h1>

          <p>
            Follow your services, links, quantities and delivery status in a
            premium overview built for speed and clarity.
          </p>

          <div className="ordersHeroActions">
            <button
              type="button"
              onClick={loadOrders}
              className="ordersPrimaryBtn"
            >
              Refresh Orders
            </button>

            <a href="/services" className="ordersSecondaryBtn">
              Create New Order
            </a>
          </div>
        </div>

        <aside className="ordersControlCard" title={currencyRateText}>
          <div className="ordersControlGlow" />

          <span>Total spent</span>
          <strong>{formatMoney(stats.spent)}</strong>
          <small>
            Across all your orders · shown in {selectedCurrencyMeta.flag}{" "}
            {selectedCurrency}
          </small>

          <div className="ordersMiniGrid">
            <div>
              <span>Active</span>
              <b>{stats.active}</b>
            </div>

            <div>
              <span>Completed</span>
              <b>{stats.completed}</b>
            </div>
          </div>
        </aside>
      </section>

      <section className="ordersStatsGrid">
        <article className="ordersStatCard ordersStatMain">
          <span>Total orders</span>
          <strong>{stats.total}</strong>
          <small>All orders on your account</small>
        </article>

        <article className="ordersStatCard">
          <span>Active</span>
          <strong>{stats.active}</strong>
          <small>Pending or processing now</small>
        </article>

        <article className="ordersStatCard">
          <span>Completed</span>
          <strong>{stats.completed}</strong>
          <small>Successfully delivered</small>
        </article>

        <article className="ordersStatCard" title={currencyRateText}>
          <span>Total spent</span>
          <strong>{formatMoney(stats.spent)}</strong>
          <small>
            Calculated from your orders · shown in {selectedCurrencyMeta.flag}{" "}
            {selectedCurrency}
          </small>
        </article>
      </section>

      <section className="ordersPanel ordersFiltersPanel">
        <div className="ordersPanelHeader">
          <div>
            <span>Filters</span>
            <h2>Find your orders faster</h2>
          </div>

          <div className="ordersPanelIcon">⌕</div>
        </div>

        <div className="ordersFiltersGrid">
          <label>
            <span>Search</span>
            <input
              type="text"
              placeholder="Service, link or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <label>
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </label>

          <div className="ordersFilterActions">
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

      <section className="ordersPanel ordersTablePanel">
        <div className="ordersPanelHeader">
          <div>
            <span>My orders</span>
            <h2>Order activity</h2>
          </div>

          <div className="ordersPanelIcon">{filteredOrders.length}</div>
        </div>

        {isLoading ? (
          <div className="ordersSkeletonList">
            <span />
            <span />
            <span />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="ordersEmptyBox">
            <strong>No orders found</strong>
            <span>Create your first order or change your filters.</span>
          </div>
        ) : (
          <div className="ordersTableWrap">
            <table className="ordersTable">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Platform</th>
                  <th>Link</th>
                  <th>Quantity</th>
                  <th>Charge</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => {
                  const progress = getProgress(order.status);

                  return (
                    <tr key={order._id}>
                      <td>
                        <div className="ordersServiceCell">
                          <strong>
                            {order.serviceId?.name || "Service order"}
                          </strong>
                          <span>{order.serviceId?.type || "Boost"}</span>
                        </div>
                      </td>

                      <td>{order.serviceId?.platform || "-"}</td>

                      <td>
                        <a
                          href={order.link}
                          target="_blank"
                          rel="noreferrer"
                          className="ordersLink"
                        >
                          {order.link}
                        </a>
                      </td>

                      <td>{formatNumber(order.quantity)}</td>

                      <td title={currencyRateText}>
                        <strong>{formatMoney(order.charge)}</strong>
                      </td>

                      <td>
                        <span
                          className={`ordersStatusPill ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>

                      <td>
                        <div className="ordersProgressWrap">
                          <div className="ordersProgressTrack">
                            <span
                              className={`ordersProgressFill ${getStatusClass(
                                order.status
                              )}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <small>{progress}%</small>
                        </div>
                      </td>

                      <td>{formatDate(order.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
          Orders are charged and stored in EUR. Values on this page are displayed
          in {selectedCurrencyMeta.flag} {selectedCurrency} using your selected
          display currency.
        </p>
      </section>
    </main>
  );
}

export default Orders;