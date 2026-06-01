import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api.js";
import "./AdminUsers.css";

const floatingAdminUserItems = [
  "Users",
  "Admin",
  "Balance",
  "Wallet",
  "Customers",
  "Roles",
  "Promo",
  "Revenue",
  "Accounts",
  "EmpireBoost",
  "Control",
  "Deposits",
  "Security",
  "Growth",
  "Panel",
  "Activity",
  "Credits",
  "Management",
];

const roleFilters = ["All", "user", "admin"];
const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "balanceHigh", label: "Highest balance" },
  { value: "balanceLow", label: "Lowest balance" },
  { value: "email", label: "Email A-Z" },
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

function getInitial(email) {
  if (!email) return "U";
  return String(email).charAt(0).toUpperCase();
}

function getRoleClass(role) {
  if (role === "admin") return "adminUsersRoleAdmin";
  return "adminUsersRoleUser";
}

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const [isLoading, setIsLoading] = useState(true);
  const [isAddingBalance, setIsAddingBalance] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortMode, setSortMode] = useState("newest");

  const [balanceForm, setBalanceForm] = useState({
    email: "",
    amount: "",
    promoCode: "",
  });

  const loadUsers = async () => {
    setIsLoading(true);

    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Failed to load users");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const stats = useMemo(() => {
    const totalBalance = users.reduce((sum, user) => sum + Number(user.balance || 0), 0);
    const admins = users.filter((user) => user.role === "admin").length;
    const normalUsers = users.filter((user) => user.role !== "admin").length;

    const richestUser = users.reduce(
      (topUser, user) => {
        if (Number(user.balance || 0) > Number(topUser.balance || 0)) {
          return user;
        }

        return topUser;
      },
      { balance: 0 }
    );

    return {
      totalUsers: users.length,
      normalUsers,
      admins,
      totalBalance,
      richestBalance: richestUser.balance || 0,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    const filtered = users.filter((user) => {
      const matchesSearch =
        !cleanSearch ||
        [user.email, user.role, user.balance, user.createdAt]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(cleanSearch);

      const matchesRole = roleFilter === "All" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });

    return filtered.sort((a, b) => {
      if (sortMode === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }

      if (sortMode === "balanceHigh") {
        return Number(b.balance || 0) - Number(a.balance || 0);
      }

      if (sortMode === "balanceLow") {
        return Number(a.balance || 0) - Number(b.balance || 0);
      }

      if (sortMode === "email") {
        return String(a.email || "").localeCompare(String(b.email || ""));
      }

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [users, search, roleFilter, sortMode]);

  const recentUsers = useMemo(() => {
    return [...users]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);
  }, [users]);

  const handleChange = (e) => {
    setBalanceForm({
      ...balanceForm,
      [e.target.name]: e.target.value,
    });
  };

  const addBalance = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!balanceForm.email.trim()) {
      setMessageType("error");
      setMessage("User email is required.");
      return;
    }

    if (!balanceForm.amount || Number(balanceForm.amount) <= 0) {
      setMessageType("error");
      setMessage("Amount must be higher than 0.");
      return;
    }

    setIsAddingBalance(true);

    try {
      const res = await api.post("/admin/users/add-balance", {
        email: balanceForm.email.trim(),
        amount: Number(balanceForm.amount),
        promoCode: balanceForm.promoCode.trim(),
      });

      setMessageType("success");
      setMessage(
        `Added €${formatMoney(res.data.finalAmount)}. Bonus: €${formatMoney(
          res.data.bonusAmount
        )}. New balance: €${formatMoney(res.data.user.balance)}`
      );

      setBalanceForm({
        email: "",
        amount: "",
        promoCode: "",
      });

      await loadUsers();
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Add balance failed");
    } finally {
      setIsAddingBalance(false);
    }
  };

  const fillUserEmail = (email) => {
    setBalanceForm({
      ...balanceForm,
      email,
    });

    setMessageType("info");
    setMessage(`${email} loaded into balance form.`);
    window.location.hash = "admin-add-balance";
  };

  const fillQuickAmount = (amount) => {
    setBalanceForm({
      ...balanceForm,
      amount: String(amount),
    });
  };

  return (
    <main className="adminUsersPagePro">
      <div className="adminUsersAurora" aria-hidden="true">
        <span className="adminUsersAuroraOne" />
        <span className="adminUsersAuroraTwo" />
        <span className="adminUsersAuroraThree" />
        <span className="adminUsersAuroraFour" />
      </div>

      <div className="adminUsersFloatingLayer" aria-hidden="true">
        {floatingAdminUserItems.map((item, index) => (
          <span
            className={`adminUsersFloat adminUsersFloat${index + 1}`}
            key={`${item}-${index}`}
          >
            {item}
          </span>
        ))}
      </div>

      <section className="adminUsersHeroPro">
        <div className="adminUsersHeroContent">
          <div className="adminUsersBadgePro">
            <span />
            EmpireBoost user control
          </div>

          <h1>Manage users, balances and account power from one place.</h1>

          <p>
            Search customers, inspect roles, add wallet balance, apply promo codes and keep your
            EmpireBoost user base clean, controlled and ready for orders.
          </p>

          <div className="adminUsersHeroActions">
            <a href="#admin-add-balance" className="adminUsersPrimaryBtn">
              Add Balance
            </a>

            <button type="button" className="adminUsersSecondaryBtn" onClick={loadUsers}>
              Refresh Users
            </button>
          </div>
        </div>

        <aside className="adminUsersInfoCard">
          <div className="adminUsersInfoGlow" />

          <span>Total users</span>
          <strong>{stats.totalUsers}</strong>
          <small>Registered accounts in your panel</small>

          <div className="adminUsersInfoMiniGrid">
            <div>
              <span>Admins</span>
              <b>{stats.admins}</b>
            </div>

            <div>
              <span>Wallet total</span>
              <b>€{formatMoney(stats.totalBalance)}</b>
            </div>
          </div>
        </aside>
      </section>

      {message && (
        <section className={`adminUsersMessage adminUsersMessage-${messageType}`}>
          <span>{messageType === "success" ? "✓" : messageType === "error" ? "!" : "i"}</span>
          <p>{message}</p>
        </section>
      )}

      <section className="adminUsersStatsGrid">
        <article className="adminUsersStatCard adminUsersStatMain">
          <span>Total users</span>
          <strong>{stats.totalUsers}</strong>
          <small>All registered accounts</small>
        </article>

        <article className="adminUsersStatCard">
          <span>Normal users</span>
          <strong>{stats.normalUsers}</strong>
          <small>Customer accounts</small>
        </article>

        <article className="adminUsersStatCard">
          <span>Admins</span>
          <strong>{stats.admins}</strong>
          <small>Admin access accounts</small>
        </article>

        <article className="adminUsersStatCard">
          <span>Total balance</span>
          <strong>€{formatMoney(stats.totalBalance)}</strong>
          <small>Wallet value across all users</small>
        </article>
      </section>

      <section className="adminUsersMainGrid">
        <form
          className="adminUsersPanel adminUsersBalancePanel"
          id="admin-add-balance"
          onSubmit={addBalance}
        >
          <div className="adminUsersPanelHeader">
            <div>
              <span>Wallet control</span>
              <h2>Add Balance</h2>
            </div>

            <div className="adminUsersPanelIcon">€</div>
          </div>

          <div className="adminUsersBalanceForm">
            <label>
              <span>User email</span>
              <input
                name="email"
                placeholder="customer@email.com"
                value={balanceForm.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Deposit amount</span>
              <input
                name="amount"
                placeholder="Example: 25.00"
                type="number"
                step="0.01"
                min="0.01"
                value={balanceForm.amount}
                onChange={handleChange}
                required
              />
            </label>

            <label className="adminUsersFullField">
              <span>Promo code optional</span>
              <input
                name="promoCode"
                placeholder="Example: IGOR777 or ALEX999"
                value={balanceForm.promoCode}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="adminUsersQuickAmounts">
            {[5, 10, 25, 50, 100, 250].map((amount) => (
              <button type="button" key={amount} onClick={() => fillQuickAmount(amount)}>
                €{amount}
              </button>
            ))}
          </div>

          <div className="adminUsersBalancePreview">
            <div>
              <span>Balance preview</span>
              <strong>€{formatMoney(balanceForm.amount)}</strong>
              <p>
                {balanceForm.email
                  ? `Balance will be added to ${balanceForm.email}.`
                  : "Select or type a user email first."}
              </p>
            </div>

            <div className="adminUsersBalancePulse">+</div>
          </div>

          <button className="adminUsersCreateBtn" type="submit" disabled={isAddingBalance}>
            {isAddingBalance ? "Adding balance..." : "Add Balance"}
          </button>
        </form>

        <aside className="adminUsersPanel adminUsersSidePanel">
          <div className="adminUsersPanelHeader">
            <div>
              <span>Recent users</span>
              <h2>Latest Accounts</h2>
            </div>

            <div className="adminUsersPanelIcon">↗</div>
          </div>

          {isLoading ? (
            <div className="adminUsersSkeletonList">
              <span />
              <span />
              <span />
            </div>
          ) : recentUsers.length === 0 ? (
            <div className="adminUsersEmptyBox">
              <strong>No users yet</strong>
              <span>New users will appear here after registration.</span>
            </div>
          ) : (
            <div className="adminUsersRecentList">
              {recentUsers.map((user) => (
                <button
                  type="button"
                  className="adminUsersRecentItem"
                  key={user._id}
                  onClick={() => fillUserEmail(user.email)}
                >
                  <div className="adminUsersAvatar">{getInitial(user.email)}</div>

                  <div>
                    <strong>{user.email}</strong>
                    <span>
                      {user.role || "user"} · €{formatMoney(user.balance)}
                    </span>
                  </div>

                  <b>Fill</b>
                </button>
              ))}
            </div>
          )}

          <div className="adminUsersInsightBox">
            <span>Admin insight</span>
            <strong>Highest wallet balance: €{formatMoney(stats.richestBalance)}</strong>
            <p>
              Use quick fill from the user table or recent accounts to add balance faster without
              copying emails manually.
            </p>
          </div>
        </aside>
      </section>

      <section className="adminUsersPanel adminUsersTablePanel">
        <div className="adminUsersPanelHeader">
          <div>
            <span>User database</span>
            <h2>All Users</h2>
          </div>

          <div className="adminUsersPanelIcon">{filteredUsers.length}</div>
        </div>

        <div className="adminUsersToolbar">
          <label className="adminUsersSearchBox">
            <span>Search</span>
            <input
              type="text"
              placeholder="Search email, role, balance..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <label>
            <span>Role</span>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              {roleFilters.map((role) => (
                <option value={role} key={role}>
                  {role === "All" ? "All roles" : role}
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
          <div className="adminUsersSkeletonList">
            <span />
            <span />
            <span />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="adminUsersEmptyBox">
            <strong>No users found</strong>
            <span>Try another search term or filter.</span>
          </div>
        ) : (
          <>
            <div className="adminUsersTableWrap">
              <table className="adminUsersTable">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Balance</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="adminUsersUserCell">
                          <div className="adminUsersAvatar">{getInitial(user.email)}</div>

                          <div>
                            <strong>{user.email}</strong>
                            <span>ID: {user._id}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className={`adminUsersRolePill ${getRoleClass(user.role)}`}>
                          {user.role || "user"}
                        </span>
                      </td>

                      <td>
                        <strong className="adminUsersBalanceText">
                          €{formatMoney(user.balance)}
                        </strong>
                      </td>

                      <td>{formatDate(user.createdAt)}</td>

                      <td>
                        <button
                          type="button"
                          className="adminUsersTableBtn"
                          onClick={() => fillUserEmail(user.email)}
                        >
                          Fill Email
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="adminUsersMobileList">
              {filteredUsers.map((user) => (
                <article className="adminUsersMobileCard" key={`mobile-${user._id}`}>
                  <div className="adminUsersMobileTop">
                    <div className="adminUsersAvatar">{getInitial(user.email)}</div>

                    <div>
                      <strong>{user.email}</strong>
                      <small>{formatDate(user.createdAt)}</small>
                    </div>
                  </div>

                  <div className="adminUsersMobileMeta">
                    <div>
                      <span>Role</span>
                      <b>{user.role || "user"}</b>
                    </div>

                    <div>
                      <span>Balance</span>
                      <b>€{formatMoney(user.balance)}</b>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="adminUsersTableBtn"
                    onClick={() => fillUserEmail(user.email)}
                  >
                    Fill Email
                  </button>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default AdminUsers;