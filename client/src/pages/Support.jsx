import { useEffect, useMemo, useState } from "react";
import api from "../lib/api.js";
import "./Support.css";

const telegramLink = "https://t.me/EmpireBooster";
const supportEmail = "followerbooster96@gmail.com";

const floatingSupportItems = [
  "Support",
  "Tickets",
  "Telegram",
  "Email",
  "Orders",
  "Wallet",
  "Payments",
  "Refunds",
  "Help Desk",
  "Live Help",
  "Admin Reply",
  "Secure",
  "EmpireBoost",
  "Creator",
  "Fast",
  "Tracking",
  "Messages",
  "Priority",
];

const categoryOptions = [
  { value: "order", label: "Order" },
  { value: "deposit", label: "Deposit" },
  { value: "payment", label: "Payment" },
  { value: "service", label: "Service" },
  { value: "account", label: "Account" },
  { value: "other", label: "Other" },
];

const statusFilters = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "pending", label: "Pending" },
  { value: "answered", label: "Answered" },
  { value: "closed", label: "Closed" },
];

const contactOptions = [
  {
    title: "Telegram",
    value: "@EmpireBooster",
    description: "Fast direct message for urgent questions.",
    href: telegramLink,
    icon: "✈",
    className: "supportContactTelegram",
  },
  {
    title: "Email",
    value: supportEmail,
    description: "Send screenshots, order details or payment questions.",
    href: `mailto:${supportEmail}`,
    icon: "✉",
    className: "supportContactMail",
  },
  {
    title: "Website Ticket",
    value: "Create ticket",
    description: "Best when the issue should stay connected to your account.",
    href: "#create-ticket",
    icon: "◆",
    className: "supportContactTicket",
  },
];

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

function getStatusClass(status) {
  const cleanStatus = cleanText(status);

  if (["open", "new"].includes(cleanStatus)) return "supportStatusOpen";
  if (["pending", "waiting", "processing"].includes(cleanStatus)) return "supportStatusPending";
  if (["answered", "replied", "admin_reply"].includes(cleanStatus)) return "supportStatusAnswered";
  if (["closed", "solved", "resolved"].includes(cleanStatus)) return "supportStatusClosed";

  return "supportStatusNeutral";
}

function getCategoryLabel(category) {
  const foundCategory = categoryOptions.find((item) => item.value === category);
  return foundCategory?.label || category || "Other";
}

function getLastMessage(ticket) {
  if (!ticket?.messages || ticket.messages.length === 0) {
    return "No messages yet.";
  }

  return ticket.messages[ticket.messages.length - 1]?.message || "No messages yet.";
}

function Support() {
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [replyLoadingId, setReplyLoadingId] = useState("");

  const [activeStatus, setActiveStatus] = useState("all");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    subject: "",
    category: "order",
    message: "",
  });

  const [replyMessages, setReplyMessages] = useState({});

  const loadTickets = async () => {
    setIsLoading(true);

    try {
      const res = await api.get("/support/my");
      setTickets(res.data.tickets || []);
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

    return {
      total: tickets.length,
      open: openTickets,
      pending: pendingTickets,
      answered: answeredTickets,
      closed: closedTickets,
    };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    return tickets
      .filter((ticket) => {
        const status = cleanText(ticket.status);
        const category = cleanText(ticket.category);

        const matchesStatus =
          activeStatus === "all" ||
          activeStatus === status ||
          (activeStatus === "open" && ["open", "new"].includes(status)) ||
          (activeStatus === "pending" && ["pending", "waiting", "processing"].includes(status)) ||
          (activeStatus === "answered" &&
            ["answered", "replied", "admin_reply"].includes(status)) ||
          (activeStatus === "closed" && ["closed", "solved", "resolved"].includes(status));

        const searchBlob = [
          ticket.subject,
          ticket.category,
          ticket.status,
          ticket.createdAt,
          ticket.updatedAt,
          getLastMessage(ticket),
          ...(ticket.messages || []).map((item) => item.message),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch = !cleanSearch || searchBlob.includes(cleanSearch);

        return matchesStatus && matchesSearch && category !== "hidden";
      })
      .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
  }, [tickets, activeStatus, search]);

  const latestTickets = useMemo(() => {
    return [...tickets]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
      .slice(0, 4);
  }, [tickets]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createTicket = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.subject.trim() || !form.message.trim()) {
      setMessageType("error");
      setMessage("Subject and message are required.");
      return;
    }

    setIsCreating(true);

    try {
      await api.post("/support", {
        subject: form.subject.trim(),
        category: form.category,
        message: form.message.trim(),
      });

      setMessageType("success");
      setMessage("Support ticket created successfully.");

      setForm({
        subject: "",
        category: "order",
        message: "",
      });

      await loadTickets();
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Create ticket failed");
    } finally {
      setIsCreating(false);
    }
  };

  const handleReplyChange = (ticketId, value) => {
    setReplyMessages({
      ...replyMessages,
      [ticketId]: value,
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

    try {
      await api.post(`/support/${ticketId}/reply`, {
        message: replyMessage.trim(),
      });

      setMessageType("success");
      setMessage("Reply sent.");

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

  return (
    <main className="supportPagePro">
      <div className="supportAurora" aria-hidden="true">
        <span className="supportAuroraOne" />
        <span className="supportAuroraTwo" />
        <span className="supportAuroraThree" />
        <span className="supportAuroraFour" />
      </div>

      <div className="supportFloatingLayer" aria-hidden="true">
        {floatingSupportItems.map((item, index) => (
          <span className={`supportFloat supportFloat${index + 1}`} key={`${item}-${index}`}>
            {item}
          </span>
        ))}
      </div>

      <section className="supportHeroPro">
        <div className="supportHeroContent">
          <div className="supportBadgePro">
            <span />
            EmpireBoost support center
          </div>

          <h1>Real help for orders, payments and account issues.</h1>

          <p>
            Create a website ticket, send a Telegram message or contact us by email. Everything is
            built to keep support clean, fast and easy to track.
          </p>

          <div className="supportHeroActions">
            <a href="#create-ticket" className="supportPrimaryBtn">
              Create Ticket
            </a>

            <a href={telegramLink} target="_blank" rel="noreferrer" className="supportSecondaryBtn">
              Message Telegram
            </a>
          </div>
        </div>

        <aside className="supportInfoCard">
          <div className="supportInfoGlow" />

          <span>Ticket center</span>
          <strong>{stats.total}</strong>
          <small>Total support tickets</small>

          <div className="supportInfoMiniGrid">
            <div>
              <span>Open</span>
              <b>{stats.open}</b>
            </div>

            <div>
              <span>Answered</span>
              <b>{stats.answered}</b>
            </div>
          </div>
        </aside>
      </section>

      <section className="supportContactGrid">
        {contactOptions.map((option) => (
          <a
            href={option.href}
            target={option.href.startsWith("http") ? "_blank" : undefined}
            rel={option.href.startsWith("http") ? "noreferrer" : undefined}
            className={`supportContactCard ${option.className}`}
            key={option.title}
          >
            <div className="supportContactIcon">{option.icon}</div>

            <div>
              <span>{option.title}</span>
              <strong>{option.value}</strong>
              <p>{option.description}</p>
            </div>
          </a>
        ))}
      </section>

      {message && (
        <section className={`supportMessage supportMessage-${messageType}`}>
          <span>{messageType === "success" ? "✓" : messageType === "error" ? "!" : "i"}</span>
          <p>{message}</p>
        </section>
      )}

      <section className="supportStatsGrid">
        <article className="supportStatCard supportStatMain">
          <span>Total tickets</span>
          <strong>{stats.total}</strong>
          <small>All support conversations</small>
        </article>

        <article className="supportStatCard">
          <span>Open tickets</span>
          <strong>{stats.open}</strong>
          <small>Waiting for support flow</small>
        </article>

        <article className="supportStatCard">
          <span>Pending</span>
          <strong>{stats.pending}</strong>
          <small>Currently being reviewed</small>
        </article>

        <article className="supportStatCard">
          <span>Closed</span>
          <strong>{stats.closed}</strong>
          <small>Finished support cases</small>
        </article>
      </section>

      <section className="supportMainGrid">
        <section className="supportPanel supportCreatePanel" id="create-ticket">
          <div className="supportPanelHeader">
            <div>
              <span>New request</span>
              <h2>Create Ticket</h2>
            </div>

            <div className="supportPanelIcon">+</div>
          </div>

          <form className="supportTicketForm" onSubmit={createTicket}>
            <label>
              <span>Subject</span>
              <input
                name="subject"
                placeholder="Example: Order not started"
                value={form.subject}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Category</span>
              <select name="category" value={form.category} onChange={handleChange}>
                {categoryOptions.map((category) => (
                  <option value={category.value} key={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="supportFullField">
              <span>Message</span>
              <textarea
                name="message"
                placeholder="Describe your issue. Add order ID, payment method, link or anything important..."
                value={form.message}
                onChange={handleChange}
                required
              />
            </label>

            <div className="supportFormHint">
              <span>Tip</span>
              <p>
                For faster help, include your order details, payment method, link and what exactly
                happened.
              </p>
            </div>

            <button className="supportCreateBtn" type="submit" disabled={isCreating}>
              {isCreating ? "Creating ticket..." : "Create Ticket"}
            </button>
          </form>
        </section>

        <aside className="supportPanel supportSidePanel">
          <div className="supportPanelHeader">
            <div>
              <span>Quick contact</span>
              <h2>Other ways</h2>
            </div>

            <div className="supportPanelIcon">↗</div>
          </div>

          <div className="supportSideContactBox">
            <span>Fastest direct option</span>
            <strong>Message @EmpireBooster on Telegram.</strong>
            <p>
              Good for urgent questions. For account-based issues, website tickets are still the
              cleanest option.
            </p>

            <div className="supportSideButtons">
              <a href={telegramLink} target="_blank" rel="noreferrer" className="supportSideBtn">
                Telegram
              </a>

              <a href={`mailto:${supportEmail}`} className="supportSideBtn supportSideBtnDark">
                Email
              </a>
            </div>
          </div>

          <div className="supportSteps">
            <div>
              <b>01</b>
              <strong>Create ticket</strong>
              <span>Choose subject, category and explain the issue.</span>
            </div>

            <div>
              <b>02</b>
              <strong>Admin reviews</strong>
              <span>Your message appears inside your support conversation.</span>
            </div>

            <div>
              <b>03</b>
              <strong>Reply inside ticket</strong>
              <span>Keep all details in one clean chat thread.</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="supportPanel supportTicketsPanel">
        <div className="supportPanelHeader">
          <div>
            <span>My inbox</span>
            <h2>My Tickets</h2>
          </div>

          <div className="supportPanelIcon">{filteredTickets.length}</div>
        </div>

        <div className="supportToolbar">
          <label className="supportSearchBox">
            <span>Search tickets</span>
            <input
              type="text"
              placeholder="Search subject, category, message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>

        <div className="supportFilterRail">
          {statusFilters.map((filter) => (
            <button
              type="button"
              key={filter.value}
              onClick={() => setActiveStatus(filter.value)}
              className={activeStatus === filter.value ? "supportFilterActive" : ""}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="supportSkeletonList">
            <span />
            <span />
            <span />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="supportEmptyBox">
            <strong>No support tickets found</strong>
            <span>
              Create your first ticket, message us on Telegram or send an email if you need help.
            </span>
          </div>
        ) : (
          <div className="supportTicketsGrid">
            {filteredTickets.map((ticket) => (
              <article className="supportTicketBox" key={ticket._id}>
                <div className="supportTicketHeader">
                  <div>
                    <span>{getCategoryLabel(ticket.category)}</span>
                    <h3>{ticket.subject}</h3>
                  </div>

                  <span className={`supportStatusBadge ${getStatusClass(ticket.status)}`}>
                    {ticket.status || "open"}
                  </span>
                </div>

                <div className="supportTicketMeta">
                  <div>
                    <span>Created</span>
                    <b>{formatDate(ticket.createdAt)}</b>
                  </div>

                  <div>
                    <span>Messages</span>
                    <b>{ticket.messages?.length || 0}</b>
                  </div>
                </div>

                <div className="supportMessagesBox">
                  {(ticket.messages || []).map((item) => (
                    <div
                      className={
                        item.senderRole === "admin"
                          ? "supportChatMessage supportAdminMessage"
                          : "supportChatMessage supportUserMessage"
                      }
                      key={item._id || `${ticket._id}-${item.createdAt}-${item.message}`}
                    >
                      <div className="supportChatTop">
                        <strong>{item.senderRole === "admin" ? "EmpireBoost Support" : "You"}</strong>
                        <small>{formatDate(item.createdAt)}</small>
                      </div>

                      <p>{item.message}</p>
                    </div>
                  ))}
                </div>

                {ticket.status !== "closed" && (
                  <div className="supportReplyBox">
                    <textarea
                      placeholder="Write reply..."
                      value={replyMessages[ticket._id] || ""}
                      onChange={(e) => handleReplyChange(ticket._id, e.target.value)}
                    />

                    <button
                      type="button"
                      onClick={() => replyToTicket(ticket._id)}
                      disabled={replyLoadingId === ticket._id}
                    >
                      {replyLoadingId === ticket._id ? "Sending..." : "Send Reply"}
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {latestTickets.length > 0 && (
        <section className="supportPanel supportRecentPanel">
          <div className="supportPanelHeader">
            <div>
              <span>Recent activity</span>
              <h2>Latest Support Moves</h2>
            </div>

            <div className="supportPanelIcon">↗</div>
          </div>

          <div className="supportRecentGrid">
            {latestTickets.map((ticket) => (
              <article className="supportRecentCard" key={`recent-${ticket._id}`}>
                <span className={`supportStatusBadge ${getStatusClass(ticket.status)}`}>
                  {ticket.status || "open"}
                </span>

                <strong>{ticket.subject}</strong>
                <p>{getLastMessage(ticket)}</p>
                <small>{formatDate(ticket.updatedAt || ticket.createdAt)}</small>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default Support;