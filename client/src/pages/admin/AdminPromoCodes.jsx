import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api.js";
import "./AdminPromoCodes.css";

const floatingPromoItems = [
  "Promo",
  "Codes",
  "Bonus",
  "Discount",
  "Wallet",
  "Deposits",
  "Marketing",
  "Campaign",
  "Users",
  "Growth",
  "Rewards",
  "Enabled",
  "Admin",
  "EmpireBoost",
  "Control",
  "Limited",
  "Unlimited",
  "Boost",
];

const statusFilters = ["All", "Enabled", "Disabled"];

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "bonusHigh", label: "Highest bonus" },
  { value: "bonusLow", label: "Lowest bonus" },
  { value: "mostUsed", label: "Most used" },
  { value: "code", label: "Code A-Z" },
];

const quickPromoPresets = [
  {
    code: "WELCOME10",
    bonusPercent: 10,
    maxUses: 0,
    label: "Welcome bonus",
  },
  {
    code: "BOOST25",
    bonusPercent: 25,
    maxUses: 100,
    label: "Campaign push",
  },
  {
    code: "VIP50",
    bonusPercent: 50,
    maxUses: 25,
    label: "VIP limited",
  },
  {
    code: "LAUNCH100",
    bonusPercent: 100,
    maxUses: 10,
    label: "Launch hype",
  },
];

function cleanText(value) {
  return String(value || "").toLowerCase().trim();
}

function formatDate(value) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return "-";
  }
}

function getUsagePercent(promoCode) {
  const maxUses = Number(promoCode.maxUses || 0);
  const usedCount = Number(promoCode.usedCount || 0);

  if (maxUses === 0) return 0;

  return Math.min(100, Math.round((usedCount / maxUses) * 100));
}

function getUsageLabel(promoCode) {
  const maxUses = Number(promoCode.maxUses || 0);
  const usedCount = Number(promoCode.usedCount || 0);

  if (maxUses === 0) return `${usedCount} used · unlimited`;

  return `${usedCount} / ${maxUses} used`;
}

function getPromoHealth(promoCode) {
  if (!promoCode.enabled) return "Disabled";

  const maxUses = Number(promoCode.maxUses || 0);
  const usedCount = Number(promoCode.usedCount || 0);

  if (maxUses > 0 && usedCount >= maxUses) return "Limit reached";
  if (Number(promoCode.bonusPercent || 0) >= 50) return "High bonus";

  return "Active";
}

function getHealthClass(promoCode) {
  const health = getPromoHealth(promoCode);

  if (health === "Active") return "adminPromoHealthActive";
  if (health === "High bonus") return "adminPromoHealthHigh";
  if (health === "Limit reached") return "adminPromoHealthLimit";

  return "adminPromoHealthDisabled";
}

function AdminPromoCodes() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortMode, setSortMode] = useState("newest");

  const [form, setForm] = useState({
    code: "",
    bonusPercent: "",
    maxUses: "",
  });

  const loadPromoCodes = async () => {
    setIsLoading(true);

    try {
      const res = await api.get("/admin/promo-codes");
      setPromoCodes(res.data.promoCodes || []);
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Failed to load promo codes");
      setPromoCodes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPromoCodes();
  }, []);

  const stats = useMemo(() => {
    const enabled = promoCodes.filter((promoCode) => promoCode.enabled).length;
    const disabled = promoCodes.length - enabled;

    const totalUses = promoCodes.reduce(
      (sum, promoCode) => sum + Number(promoCode.usedCount || 0),
      0
    );

    const averageBonus =
      promoCodes.length === 0
        ? 0
        : promoCodes.reduce(
            (sum, promoCode) => sum + Number(promoCode.bonusPercent || 0),
            0
          ) / promoCodes.length;

    const unlimited = promoCodes.filter((promoCode) => Number(promoCode.maxUses || 0) === 0).length;

    return {
      total: promoCodes.length,
      enabled,
      disabled,
      totalUses,
      averageBonus,
      unlimited,
    };
  }, [promoCodes]);

  const filteredPromoCodes = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    const filtered = promoCodes.filter((promoCode) => {
      const matchesSearch =
        !cleanSearch ||
        [
          promoCode.code,
          promoCode.bonusPercent,
          promoCode.maxUses,
          promoCode.usedCount,
          promoCode.enabled ? "enabled" : "disabled",
          getPromoHealth(promoCode),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(cleanSearch);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Enabled" && promoCode.enabled) ||
        (statusFilter === "Disabled" && !promoCode.enabled);

      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      if (sortMode === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }

      if (sortMode === "bonusHigh") {
        return Number(b.bonusPercent || 0) - Number(a.bonusPercent || 0);
      }

      if (sortMode === "bonusLow") {
        return Number(a.bonusPercent || 0) - Number(b.bonusPercent || 0);
      }

      if (sortMode === "mostUsed") {
        return Number(b.usedCount || 0) - Number(a.usedCount || 0);
      }

      if (sortMode === "code") {
        return String(a.code || "").localeCompare(String(b.code || ""));
      }

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [promoCodes, search, statusFilter, sortMode]);

  const recentPromoCodes = useMemo(() => {
    return [...promoCodes]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);
  }, [promoCodes]);

  const handleChange = (e) => {
    const value = e.target.name === "code" ? e.target.value.toUpperCase() : e.target.value;

    setForm({
      ...form,
      [e.target.name]: value,
    });
  };

  const fillPreset = (preset) => {
    setForm({
      code: preset.code,
      bonusPercent: String(preset.bonusPercent),
      maxUses: String(preset.maxUses),
    });

    setMessageType("info");
    setMessage(`${preset.code} loaded into the promo code form.`);
    window.location.hash = "admin-promo-form";
  };

  const createPromoCode = async (e) => {
    e.preventDefault();
    setMessage("");

    const cleanCode = form.code.trim().toUpperCase();
    const bonusPercent = Number(form.bonusPercent);
    const maxUses = Number(form.maxUses || 0);

    if (!cleanCode) {
      setMessageType("error");
      setMessage("Promo code is required.");
      return;
    }

    if (bonusPercent <= 0) {
      setMessageType("error");
      setMessage("Bonus percent must be higher than 0.");
      return;
    }

    if (bonusPercent > 500) {
      setMessageType("error");
      setMessage("Bonus percent is too high. Use something realistic.");
      return;
    }

    if (maxUses < 0) {
      setMessageType("error");
      setMessage("Max uses cannot be negative.");
      return;
    }

    setIsCreating(true);

    try {
      await api.post("/admin/promo-codes", {
        code: cleanCode,
        bonusPercent,
        maxUses,
      });

      setMessageType("success");
      setMessage("Promo code created successfully.");

      setForm({
        code: "",
        bonusPercent: "",
        maxUses: "",
      });

      await loadPromoCodes();
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Create promo code failed");
    } finally {
      setIsCreating(false);
    }
  };

  const togglePromoCode = async (id) => {
    setActionLoadingId(id);
    setMessage("");

    try {
      await api.patch(`/admin/promo-codes/${id}/toggle`);
      setMessageType("success");
      setMessage("Promo code status changed.");

      await loadPromoCodes();
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Toggle failed");
    } finally {
      setActionLoadingId("");
    }
  };

  const deletePromoCode = async (id) => {
    const confirmed = confirm("Delete this promo code?");
    if (!confirmed) return;

    setActionLoadingId(id);
    setMessage("");

    try {
      await api.delete(`/admin/promo-codes/${id}`);
      setMessageType("success");
      setMessage("Promo code deleted successfully.");

      await loadPromoCodes();
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Delete failed");
    } finally {
      setActionLoadingId("");
    }
  };

  return (
    <main className="adminPromoPagePro">
      <div className="adminPromoAurora" aria-hidden="true">
        <span className="adminPromoAuroraOne" />
        <span className="adminPromoAuroraTwo" />
        <span className="adminPromoAuroraThree" />
        <span className="adminPromoAuroraFour" />
      </div>

      <div className="adminPromoFloatingLayer" aria-hidden="true">
        {floatingPromoItems.map((item, index) => (
          <span className={`adminPromoFloat adminPromoFloat${index + 1}`} key={`${item}-${index}`}>
            {item}
          </span>
        ))}
      </div>

      <section className="adminPromoHeroPro">
        <div className="adminPromoHeroContent">
          <div className="adminPromoBadgePro">
            <span />
            EmpireBoost promo control
          </div>

          <h1>Create campaigns, bonuses and deposit boosters.</h1>

          <p>
            Build promo codes for wallet deposits, launch campaigns, VIP users and limited-time
            offers with clean usage tracking and one-click enable control.
          </p>

          <div className="adminPromoHeroActions">
            <a href="#admin-promo-form" className="adminPromoPrimaryBtn">
              Create Promo
            </a>

            <button type="button" className="adminPromoSecondaryBtn" onClick={loadPromoCodes}>
              Refresh Codes
            </button>
          </div>
        </div>

        <aside className="adminPromoInfoCard">
          <div className="adminPromoInfoGlow" />

          <span>Total promo codes</span>
          <strong>{stats.total}</strong>
          <small>{stats.enabled} currently enabled</small>

          <div className="adminPromoInfoMiniGrid">
            <div>
              <span>Total uses</span>
              <b>{stats.totalUses}</b>
            </div>

            <div>
              <span>Avg. bonus</span>
              <b>{stats.averageBonus.toFixed(1)}%</b>
            </div>
          </div>
        </aside>
      </section>

      {message && (
        <section className={`adminPromoMessage adminPromoMessage-${messageType}`}>
          <span>{messageType === "success" ? "✓" : messageType === "error" ? "!" : "i"}</span>
          <p>{message}</p>
        </section>
      )}

      <section className="adminPromoStatsGrid">
        <article className="adminPromoStatCard adminPromoStatMain">
          <span>Total codes</span>
          <strong>{stats.total}</strong>
          <small>All promo campaigns</small>
        </article>

        <article className="adminPromoStatCard">
          <span>Enabled</span>
          <strong>{stats.enabled}</strong>
          <small>Ready for customers</small>
        </article>

        <article className="adminPromoStatCard">
          <span>Total uses</span>
          <strong>{stats.totalUses}</strong>
          <small>How often codes were used</small>
        </article>

        <article className="adminPromoStatCard">
          <span>Unlimited</span>
          <strong>{stats.unlimited}</strong>
          <small>Codes without max limit</small>
        </article>
      </section>

      <section className="adminPromoMainGrid">
        <form
          className="adminPromoPanel adminPromoCreatePanel"
          id="admin-promo-form"
          onSubmit={createPromoCode}
        >
          <div className="adminPromoPanelHeader">
            <div>
              <span>Campaign builder</span>
              <h2>Create Promo Code</h2>
            </div>

            <div className="adminPromoPanelIcon">%</div>
          </div>

          <div className="adminPromoFormGrid">
            <label>
              <span>Promo code</span>
              <input
                name="code"
                placeholder="Example: WELCOME10"
                value={form.code}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Bonus percent</span>
              <input
                name="bonusPercent"
                placeholder="Example: 25"
                type="number"
                step="0.01"
                min="0.01"
                value={form.bonusPercent}
                onChange={handleChange}
                required
              />
            </label>

            <label className="adminPromoFullField">
              <span>Max uses</span>
              <input
                name="maxUses"
                placeholder="0 = unlimited"
                type="number"
                min="0"
                value={form.maxUses}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="adminPromoPreview">
            <div>
              <span>Promo preview</span>
              <strong>
                {form.code || "YOURCODE"} gives {Number(form.bonusPercent || 0).toFixed(0)}% bonus
              </strong>
              <p>
                {Number(form.maxUses || 0) === 0
                  ? "This promo code can be used unlimited times."
                  : `This promo code can be used ${form.maxUses} times.`}
              </p>
            </div>

            <div className="adminPromoPreviewPulse">%</div>
          </div>

          <div className="adminPromoPresetGrid">
            {quickPromoPresets.map((preset) => (
              <button type="button" key={preset.code} onClick={() => fillPreset(preset)}>
                <span>{preset.label}</span>
                <strong>{preset.code}</strong>
                <small>
                  {preset.bonusPercent}% · {preset.maxUses === 0 ? "Unlimited" : `${preset.maxUses} uses`}
                </small>
              </button>
            ))}
          </div>

          <button className="adminPromoCreateBtn" type="submit" disabled={isCreating}>
            {isCreating ? "Creating promo code..." : "Create Promo Code"}
          </button>
        </form>

        <aside className="adminPromoPanel adminPromoSidePanel">
          <div className="adminPromoPanelHeader">
            <div>
              <span>Recent campaigns</span>
              <h2>Latest Codes</h2>
            </div>

            <div className="adminPromoPanelIcon">↗</div>
          </div>

          {isLoading ? (
            <div className="adminPromoSkeletonList">
              <span />
              <span />
              <span />
            </div>
          ) : recentPromoCodes.length === 0 ? (
            <div className="adminPromoEmptyBox">
              <strong>No promo codes yet</strong>
              <span>Create your first campaign and it will appear here.</span>
            </div>
          ) : (
            <div className="adminPromoRecentList">
              {recentPromoCodes.map((promoCode) => (
                <article className="adminPromoRecentItem" key={`recent-${promoCode._id}`}>
                  <div className="adminPromoRecentIcon">%</div>

                  <div>
                    <strong>{promoCode.code}</strong>
                    <span>
                      {promoCode.bonusPercent}% bonus · {getUsageLabel(promoCode)}
                    </span>
                    <b className={promoCode.enabled ? "adminPromoRecentEnabled" : "adminPromoRecentDisabled"}>
                      {promoCode.enabled ? "Enabled" : "Disabled"}
                    </b>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="adminPromoInsightBox">
            <span>Marketing insight</span>
            <strong>Keep bonuses controlled and profitable.</strong>
            <p>
              Use higher bonuses for limited campaigns and lower bonuses for unlimited public codes.
              This keeps the website attractive without destroying margin.
            </p>
          </div>
        </aside>
      </section>

      <section className="adminPromoPanel adminPromoTablePanel">
        <div className="adminPromoPanelHeader">
          <div>
            <span>Promo database</span>
            <h2>All Promo Codes</h2>
          </div>

          <div className="adminPromoPanelIcon">{filteredPromoCodes.length}</div>
        </div>

        <div className="adminPromoToolbar">
          <label className="adminPromoSearchBox">
            <span>Search</span>
            <input
              type="text"
              placeholder="Search code, status, bonus, usage..."
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
          <div className="adminPromoSkeletonList">
            <span />
            <span />
            <span />
          </div>
        ) : filteredPromoCodes.length === 0 ? (
          <div className="adminPromoEmptyBox">
            <strong>No promo codes found</strong>
            <span>Try another search term or create a new promo campaign.</span>
          </div>
        ) : (
          <>
            <div className="adminPromoTableWrap">
              <table className="adminPromoTable">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Bonus</th>
                    <th>Usage</th>
                    <th>Max Uses</th>
                    <th>Health</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPromoCodes.map((promoCode) => (
                    <tr key={promoCode._id}>
                      <td>
                        <div className="adminPromoCodeCell">
                          <div className="adminPromoCodeIcon">%</div>

                          <div>
                            <strong>{promoCode.code}</strong>
                            <span>ID: {promoCode._id}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <strong className="adminPromoBonusText">
                          {promoCode.bonusPercent}%
                        </strong>
                      </td>

                      <td>
                        <div className="adminPromoUsageCell">
                          <div className="adminPromoUsageBar">
                            <span style={{ width: `${getUsagePercent(promoCode)}%` }} />
                          </div>
                          <small>{getUsageLabel(promoCode)}</small>
                        </div>
                      </td>

                      <td>
                        {Number(promoCode.maxUses || 0) === 0 ? (
                          <span className="adminPromoUnlimitedPill">Unlimited</span>
                        ) : (
                          <span className="adminPromoLimitText">{promoCode.maxUses}</span>
                        )}
                      </td>

                      <td>
                        <span className={`adminPromoHealthPill ${getHealthClass(promoCode)}`}>
                          {getPromoHealth(promoCode)}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`adminPromoStatusPill ${
                            promoCode.enabled
                              ? "adminPromoStatusEnabled"
                              : "adminPromoStatusDisabled"
                          }`}
                        >
                          {promoCode.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </td>

                      <td>{formatDate(promoCode.createdAt)}</td>

                      <td>
                        <div className="adminPromoActionGroup">
                          <button
                            type="button"
                            onClick={() => togglePromoCode(promoCode._id)}
                            disabled={actionLoadingId === promoCode._id}
                          >
                            {promoCode.enabled ? "Disable" : "Enable"}
                          </button>

                          <button
                            type="button"
                            className="adminPromoDangerBtn"
                            onClick={() => deletePromoCode(promoCode._id)}
                            disabled={actionLoadingId === promoCode._id}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="adminPromoMobileList">
              {filteredPromoCodes.map((promoCode) => (
                <article className="adminPromoMobileCard" key={`mobile-${promoCode._id}`}>
                  <div className="adminPromoMobileTop">
                    <div className="adminPromoCodeIcon">%</div>

                    <div>
                      <strong>{promoCode.code}</strong>
                      <small>{formatDate(promoCode.createdAt)}</small>
                    </div>
                  </div>

                  <div className="adminPromoMobileMeta">
                    <div>
                      <span>Bonus</span>
                      <b>{promoCode.bonusPercent}%</b>
                    </div>

                    <div>
                      <span>Used</span>
                      <b>{getUsageLabel(promoCode)}</b>
                    </div>

                    <div>
                      <span>Status</span>
                      <b>{promoCode.enabled ? "Enabled" : "Disabled"}</b>
                    </div>

                    <div>
                      <span>Health</span>
                      <b>{getPromoHealth(promoCode)}</b>
                    </div>
                  </div>

                  <div className="adminPromoActionGroup">
                    <button
                      type="button"
                      onClick={() => togglePromoCode(promoCode._id)}
                      disabled={actionLoadingId === promoCode._id}
                    >
                      {promoCode.enabled ? "Disable" : "Enable"}
                    </button>

                    <button
                      type="button"
                      className="adminPromoDangerBtn"
                      onClick={() => deletePromoCode(promoCode._id)}
                      disabled={actionLoadingId === promoCode._id}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default AdminPromoCodes;