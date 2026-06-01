import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api.js";
import "./AdminSupport.css";

const floatingAdminSupportItems = [
  "Support",
  "Admin",
  "Tickets",
  "Replies",
  "Users",
  "Orders",
  "Payments",
  "Wallet",
  "Help Desk",
  "Priority",
  "Open",
  "Closed",
  "Messages",
  "EmpireBoost",
  "Control",
  "Support Center",
  "Inbox",
  "Response",
];

const statusFilters = ["All", "open", "pending", "answered", "closed"];
const categoryFilters = ["All", "order", "deposit", "payment", "service", "account", "other"];

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "mostMessages", label: "Most messages" },
  { value: "user", label: "User A-Z" },
  { value: "subject", label: "Subject A-Z" },
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

function getUserEmail(ticket) {
  return ticket.userId?.email || ticket.user?.email || ticket.email || "-";
}

function getStatusClass(status) {
  const cleanStatus = cleanText(status);

  if (["open", "new"].includes(cleanStatus)) return "adminSupportStatusOpen";
  if (["pending", "waiting", "processing"].includes(cleanStatus)) {
    return "adminSupportStatusPending";
  }
  if (["answered", "replied", "admin_reply"].includes(cleanStatus)) {
    return "adminSupportStatusAnswered";
  }
  if (["closed", "solved", "resolved"].includes(cleanStatus)) {
    return "adminSupportStatusClosed";
  }

  return "adminSupportStatusNeutral";
}

function getCategoryLabel(category) {
  if (!category) return "Other";

  return String(category)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getCategoryIcon(category) {
  const cleanCategory = cleanText(category);

  if (cleanCategory === "order") return "↘";
  if (cleanCategory === "deposit") return "€";
  if (cleanCategory === "payment") return "◆";
  if (cleanCategory === "service") return "◎";
  if (cleanCategory === "account") return "◉";

  return "?";
}

function getLastMessage(ticket) {
  if (!ticket?.messages || ticket.messages.length === 0) {
    return "No messages yet.";
  }

  return ticket.messages[ticket.messages.length - 1]?.message || "No messages yet.";
}

function getLastMessageRole(ticket) {
  if (!ticket?.messages || ticket.messages.length === 0) {
    return "none";
  }

  return ticket.messages[ticket.messages.length - 1]?.senderRole || "user";
}

function getInitial(email) {
  if (!email || email === "-") return "U";
  return String(email).charAt(0).toUpperCase();
}

function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [replyMessages, setReplyMessages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [replyLoadingId, setReplyLoadingId] = useState("");
  const [closeLoadingId, setCloseLoadingId] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortMode, setSortMode] = useState("newest");

  const loadTickets = async () => {
    setIsLoading(true);

    try {
      const res = await api.get("/support/admin/all");
      setTickets(res.data.tickets || []);
      setMessage("");
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Failed to load tickets");
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const stats = useMemo(() => {
    const openTickets = tickets.filter((ticket) =>
      ["open", "new"].includes(cleanText(ticket.status))
    ).length;

    const pendingTickets = tickets.filter((ticket) =>
      ["pending", "waiting", "processing"].includes(cleanText(ticket.status))
    ).length;

    const answeredTickets = tickets.filter((ticket) =>
      ["answered", "replied", "admin_reply"].includes(cleanText(ticket.status))
    ).length;

    const closedTickets = tickets.filter((ticket) =>
      ["closed", "solved", "resolved"].includes(cleanText(ticket.status))
    ).length;

    const waitingForAdmin = tickets.filter((ticket) => {
      const status = cleanText(ticket.status);
      const lastRole = cleanText(getLastMessageRole(ticket));

      return !["closed", "solved", "resolved"].includes(status) && lastRole !== "admin";
    }).length;

    const totalMessages = tickets.reduce(
      (sum, ticket) => sum + Number(ticket.messages?.length || 0),
      0
    );

    return {
      total: tickets.length,
      open: openTickets,
      pending: pendingTickets,
      answered: answeredTickets,
      closed: closedTickets,
      waitingForAdmin,
      totalMessages,
    };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    const filtered = tickets.filter((ticket) => {
      const status = cleanText(ticket.status);
      const category = cleanText(ticket.category);

      const matchesStatus =
        statusFilter === "All" ||
        status === cleanText(statusFilter) ||
        (statusFilter === "open" && ["open", "new"].includes(status)) ||
        (statusFilter === "pending" && ["pending", "waiting", "processing"].includes(status)) ||
        (statusFilter === "answered" &&
          ["answered", "replied", "admin_reply"].includes(status)) ||
        (statusFilter === "closed" && ["closed", "solved", "resolved"].includes(status));

      const matchesCategory =
        categoryFilter === "All" || category === cleanText(categoryFilter);

      const searchBlob = [
        ticket.subject,
        ticket.category,
        ticket.status,
        ticket.createdAt,
        ticket.updatedAt,
        getUserEmail(ticket),
        getLastMessage(ticket),
        ...(ticket.messages || []).map((item) => `${item.senderRole} ${item.message}`),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !cleanSearch || searchBlob.includes(cleanSearch);

      return matchesStatus && matchesCategory && matchesSearch;
    });

    return filtered.sort((a, b) => {
      if (sortMode === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }

      if (sortMode === "mostMessages") {
        return Number(b.messages?.length || 0) - Number(a.messages?.length || 0);
      }

      if (sortMode === "user") {
        return String(getUserEmail(a)).localeCompare(String(getUserEmail(b)));
      }

      if (sortMode === "subject") {
        return String(a.subject || "").localeCompare(String(b.subject || ""));
      }

      return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
    });
  }, [tickets, search, statusFilter, categoryFilter, sortMode]);

  const priorityTickets = useMemo(() => {
    return tickets
      .filter((ticket) => {
        const status = cleanText(ticket.status);
        const lastRole = cleanText(getLastMessageRole(ticket));

        return !["closed", "solved", "resolved"].includes(status) && lastRole !== "admin";
      })
      .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
      .slice(0, 5);
  }, [tickets]);

  const handleReplyChange = (ticketId, value) => {
    setReplyMessages({
      ...replyMessages,
      [ticketId]: value,
    });
  };

  const useQuickReply = (ticketId, text) => {
    setReplyMessages({
      ...replyMessages,
      [ticketId]: text,
    });
  };

  const replyToTicket = async (ticketId) => {
    const replyMessage = replyMessages[ticketId];

    if (!replyMessage || replyMessage.trim() === "") {
      setMessageType("error");
      setMessage("Reply message is required.");
      return;
    }

    setReplyLoadingId(ticketId);
    setMessage("");

    try {
      await api.post(`/support/admin/${ticketId}/reply`, {
        message: replyMessage.trim(),
      });

      setMessageType("success");
      setMessage("Admin reply sent.");

      setReplyMessages({
        ...replyMessages,
        [ticketId]: "",
      });

      await loadTickets();
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Reply failed");
    } finally {
      setReplyLoadingId("");
    }
  };

  const closeTicket = async (ticketId) => {
    const confirmed = confirm("Close this support ticket?");
    if (!confirmed) return;

    setCloseLoadingId(ticketId);
    setMessage("");

    try {
      await api.put(`/support/admin/${ticketId}/close`);
      setMessageType("success");
      setMessage("Ticket closed.");

      await loadTickets();
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Close ticket failed");
    } finally {
      setCloseLoadingId("");
    }
  };

  return (
    <main className="adminSupportPagePro">
      <div className="adminSupportAurora" aria-hidden="true">
        <span className="adminSupportAuroraOne" />
        <span className="adminSupportAuroraTwo" />
        <span className="adminSupportAuroraThree" />
        <span className="adminSupportAuroraFour" />
      </div>

      <div className="adminSupportFloatingLayer" aria-hidden="true">
        {floatingAdminSupportItems.map((item, index) => (
          <span className={`adminSupportFloat adminSupportFloat${index + 1}`} key={`${item}-${index}`}>
            {item}
          </span>
        ))}
      </div>

      <section className="adminSupportHeroPro">
        <div className="adminSupportHeroContent">
          <div className="adminSupportBadgePro">
            <span />
            EmpireBoost admin help desk
          </div>

          <h1>Control every support ticket like a real operations center.</h1>

          <p>
            Review customer tickets, answer conversations, track open cases and close solved issues
            from one premium admin support inbox.
          </p>

          <div className="adminSupportHeroActions">
            <a href="#admin-support-inbox" className="adminSupportPrimaryBtn">
              Open Inbox
            </a>

            <button type="button" className="adminSupportSecondaryBtn" onClick={loadTickets}>
              Refresh Tickets
            </button>
          </div>
        </div>

        <aside className="adminSupportInfoCard">
          <div className="adminSupportInfoGlow" />

          <span>Total tickets</span>
          <strong>{stats.total}</strong>
          <small>{stats.waitingForAdmin} waiting for admin response</small>

          <div className="adminSupportInfoMiniGrid">
            <div>
              <span>Open</span>
              <b>{stats.open}</b>
            </div>

            <div>
              <span>Messages</span>
              <b>{stats.totalMessages}</b>
            </div>
          </div>
        </aside>
      </section>

      {message && (
        <section className={`adminSupportMessage adminSupportMessage-${messageType}`}>
          <span>{messageType === "success" ? "✓" : messageType === "error" ? "!" : "i"}</span>
          <p>{message}</p>
        </section>
      )}

      <section className="adminSupportStatsGrid">
        <article className="adminSupportStatCard adminSupportStatMain">
          <span>Total tickets</span>
          <strong>{stats.total}</strong>
          <small>All customer support cases</small>
        </article>

        <article className="adminSupportStatCard">
          <span>Waiting admin</span>
          <strong>{stats.waitingForAdmin}</strong>
          <small>Needs your answer</small>
        </article>

        <article className="adminSupportStatCard">
          <span>Answered</span>
          <strong>{stats.answered}</strong>
          <small>Admin already replied</small>
        </article>

        <article className="adminSupportStatCard">
          <span>Closed</span>
          <strong>{stats.closed}</strong>
          <small>Finished support cases</small>
        </article>
      </section>

      <section className="adminSupportMainGrid">
        <section className="adminSupportPanel adminSupportInboxPanel" id="admin-support-inbox">
          <div className="adminSupportPanelHeader">
            <div>
              <span>Ticket database</span>
              <h2>All Support Tickets</h2>
            </div>

            <div className="adminSupportPanelIcon">{filteredTickets.length}</div>
          </div>

          <div className="adminSupportToolbar">
            <label className="adminSupportSearchBox">
              <span>Search</span>
              <input
                type="text"
                placeholder="Search user, subject, category, message..."
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
              <span>Category</span>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                {categoryFilters.map((category) => (
                  <option value={category} key={category}>
                    {category === "All" ? "All categories" : category}
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
            <div className="adminSupportSkeletonList">
              <span />
              <span />
              <span />
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="adminSupportEmptyBox">
              <strong>No support tickets found</strong>
              <span>Try another filter, search term or refresh the support inbox.</span>
            </div>
          ) : (
            <div className="adminSupportTicketList">
              {filteredTickets.map((ticket) => {
                const ticketClosed = cleanText(ticket.status) === "closed";
                const userEmail = getUserEmail(ticket);

                return (
                  <article className="adminSupportTicketBox" key={ticket._id}>
                    <div className="adminSupportTicketHeader">
                      <div className="adminSupportTicketTitleBlock">
                        <div className="adminSupportCategoryIcon">
                          {getCategoryIcon(ticket.category)}
                        </div>

                        <div>
                          <span>{getCategoryLabel(ticket.category)}</span>
                          <h3>{ticket.subject}</h3>
                        </div>
                      </div>

                      <span className={`adminSupportStatusBadge ${getStatusClass(ticket.status)}`}>
                        {ticket.status || "open"}
                      </span>
                    </div>

                    <div className="adminSupportTicketMeta">
                      <div>
                        <span>User</span>
                        <b>{userEmail}</b>
                      </div>

                      <div>
                        <span>Created</span>
                        <b>{formatDate(ticket.createdAt)}</b>
                      </div>

                      <div>
                        <span>Messages</span>
                        <b>{ticket.messages?.length || 0}</b>
                      </div>

                      <div>
                        <span>Last sender</span>
                        <b>{getLastMessageRole(ticket)}</b>
                      </div>
                    </div>

                    <div className="adminSupportMessagesBox">
                      {(ticket.messages || []).map((item) => (
                        <div
                          className={
                            item.senderRole === "admin"
                              ? "adminSupportChatMessage adminSupportAdminMessage"
                              : "adminSupportChatMessage adminSupportUserMessage"
                          }
                          key={item._id || `${ticket._id}-${item.createdAt}-${item.message}`}
                        >
                          <div className="adminSupportChatTop">
                            <strong>
                              {item.senderRole === "admin" ? "EmpireBoost Admin" : userEmail}
                            </strong>
                            <small>{formatDate(item.createdAt)}</small>
                          </div>

                          <p>{item.message}</p>
                        </div>
                      ))}
                    </div>

                    {!ticketClosed ? (
                      <div className="adminSupportReplyBox">
                        <div className="adminSupportQuickReplies">
                          <button
                            type="button"
                            onClick={() =>
                              useQuickReply(
                                ticket._id,
                                "Hello, thanks for contacting EmpireBoost support. We are checking your request now and will update you shortly."
                              )
                            }
                          >
                            Checking now
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              useQuickReply(
                                ticket._id,
                                "Hello, please send us your order ID, link and more details so we can review this faster."
                              )
                            }
                          >
                            Need details
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              useQuickReply(
                                ticket._id,
                                "Hello, your issue has been reviewed. Everything should be solved now. Thank you for your patience."
                              )
                            }
                          >
                            Solved
                          </button>
                        </div>

                        <textarea
                          placeholder="Write admin reply..."
                          value={replyMessages[ticket._id] || ""}
                          onChange={(e) => handleReplyChange(ticket._id, e.target.value)}
                        />

                        <div className="adminSupportActionRow">
                          <button
                            type="button"
                            className="adminSupportReplyBtn"
                            onClick={() => replyToTicket(ticket._id)}
                            disabled={replyLoadingId === ticket._id}
                          >
                            {replyLoadingId === ticket._id ? "Sending..." : "Send Reply"}
                          </button>

                          <button
                            type="button"
                            className="adminSupportCloseBtn"
                            onClick={() => closeTicket(ticket._id)}
                            disabled={closeLoadingId === ticket._id}
                          >
                            {closeLoadingId === ticket._id ? "Closing..." : "Close Ticket"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="adminSupportClosedBox">
                        <strong>This ticket is closed.</strong>
                        <span>No more replies can be sent unless the backend allows reopening.</span>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside className="adminSupportPanel adminSupportSidePanel">
          <div className="adminSupportPanelHeader">
            <div>
              <span>Priority queue</span>
              <h2>Needs Reply</h2>
            </div>

            <div className="adminSupportPanelIcon">{priorityTickets.length}</div>
          </div>

          {isLoading ? (
            <div className="adminSupportSkeletonList">
              <span />
              <span />
              <span />
            </div>
          ) : priorityTickets.length === 0 ? (
            <div className="adminSupportEmptyBox">
              <strong>Inbox clean</strong>
              <span>No urgent tickets are waiting for an admin reply.</span>
            </div>
          ) : (
            <div className="adminSupportPriorityList">
              {priorityTickets.map((ticket) => (
                <a
                  href="#admin-support-inbox"
                  className="adminSupportPriorityItem"
                  key={`priority-${ticket._id}`}
                >
                  <div className="adminSupportAvatar">{getInitial(getUserEmail(ticket))}</div>

                  <div>
                    <strong>{ticket.subject}</strong>
                    <span>{getUserEmail(ticket)}</span>
                    <p>{getLastMessage(ticket)}</p>
                  </div>
                </a>
              ))}
            </div>
          )}

          <div className="adminSupportInsightBox">
            <span>Admin workflow</span>
            <strong>Answer fast, close only when solved.</strong>
            <p>
              Keep support clean by replying inside the ticket thread. Use close only when the
              customer issue is finished or no further action is needed.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default AdminSupport;