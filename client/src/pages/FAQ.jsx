import { useMemo, useState } from "react";
import "./FAQ.css";

const telegramLink = "https://t.me/EmpireBooster";
const supportEmail = "followerbooster96@gmail.com";

const faqItems = [
  {
    category: "Orders",
    question: "How fast is delivery?",
    answer:
      "Delivery depends on the selected service, quantity and platform. Some services can start very fast, while bigger or more sensitive orders may need more time to process safely.",
  },
  {
    category: "Orders",
    question: "What happens after I create an order?",
    answer:
      "Your order appears in your Orders page. You can track the status there: pending, processing, completed, failed, cancelled or refunded.",
  },
  {
    category: "Orders",
    question: "Can I cancel an order?",
    answer:
      "If the order has not started yet, contact support as soon as possible. Once the order is already processing, cancellation may not be possible anymore.",
  },
  {
    category: "Orders",
    question: "What happens if an order fails?",
    answer:
      "If an order fails, admin can review it and issue a refund to your wallet balance when appropriate. You can also open a support ticket for a manual check.",
  },
  {
    category: "Wallet",
    question: "How do deposits work?",
    answer:
      "Go to your Wallet, choose a payment method and enter the amount. PayPal can work automatically, while backup methods may need admin verification.",
  },
  {
    category: "Wallet",
    question: "How do promo codes work?",
    answer:
      "If you have a promo code, enter it during deposit checkout. Valid promo codes can add a bonus to your deposit after approval.",
  },
  {
    category: "Support",
    question: "Where can I contact support?",
    answer:
      "You can contact support directly through the Support page, by Telegram @EmpireBooster, or by email at followerbooster96@gmail.com.",
  },
  {
    category: "Support",
    question: "What should I write when I need help?",
    answer:
      "Write your username, order details, payment method and a short explanation of the issue. Clear details help support solve your problem much faster.",
  },
  {
    category: "Services",
    question: "Do I need a public profile?",
    answer:
      "For most services, the profile or post link should be public while the order is running. Private links can slow down or block delivery.",
  },
  {
    category: "Services",
    question: "Can I order multiple services at once?",
    answer:
      "Yes. You can create multiple orders, but for the cleanest delivery it is better not to spam the same link with too many similar services at the same time.",
  },
  {
    category: "Security",
    question: "Do you need my password?",
    answer:
      "No. Never send your password. EmpireBoost only needs the correct profile, post, video or channel link for the selected service.",
  },
  {
    category: "Transactions",
    question: "Where can I see my balance history?",
    answer:
      "Your Transactions page shows wallet movements like deposits, order payments, refunds and other balance updates.",
  },
];

const categories = ["All", "Orders", "Wallet", "Services", "Support", "Transactions", "Security"];

const floatingFAQItems = [
  "FAQ",
  "Support",
  "Telegram",
  "Email",
  "Orders",
  "Wallet",
  "Delivery",
  "Refunds",
  "Secure",
  "Payments",
  "Help Center",
  "Tracking",
  "Services",
  "Creator",
  "Growth",
  "Questions",
  "Answers",
  "EmpireBoost",
];

const contactOptions = [
  {
    title: "Telegram",
    value: "@EmpireBooster",
    description: "Fast direct message for urgent questions.",
    href: telegramLink,
    icon: "✈",
    className: "faqContactTelegram",
  },
  {
    title: "Email",
    value: supportEmail,
    description: "Send details, screenshots or payment questions.",
    href: `mailto:${supportEmail}`,
    icon: "✉",
    className: "faqContactMail",
  },
  {
    title: "Website Support",
    value: "Open a ticket",
    description: "Best option when your message should stay inside your account.",
    href: "/support",
    icon: "◆",
    className: "faqContactTicket",
  },
];

function FAQ() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState([0, 1]);

  const filteredFaqs = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    return faqItems.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;

      const matchesSearch =
        !cleanSearch ||
        `${item.category} ${item.question} ${item.answer}`.toLowerCase().includes(cleanSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const stats = useMemo(() => {
    return {
      total: faqItems.length,
      categories: categories.length - 1,
      visible: filteredFaqs.length,
    };
  }, [filteredFaqs.length]);

  const toggleItem = (index) => {
    setOpenItems((currentItems) => {
      if (currentItems.includes(index)) {
        return currentItems.filter((item) => item !== index);
      }

      return [...currentItems, index];
    });
  };

  return (
    <main className="faqPagePro">
      <div className="faqAurora" aria-hidden="true">
        <span className="faqAuroraOne" />
        <span className="faqAuroraTwo" />
        <span className="faqAuroraThree" />
        <span className="faqAuroraFour" />
      </div>

      <div className="faqFloatingLayer" aria-hidden="true">
        {floatingFAQItems.map((item, index) => (
          <span className={`faqFloat faqFloat${index + 1}`} key={`${item}-${index}`}>
            {item}
          </span>
        ))}
      </div>

      <section className="faqHeroPro">
        <div className="faqHeroContent">
          <div className="faqBadgePro">
            <span />
            EmpireBoost help center
          </div>

          <h1>Answers, support and real contact in one place.</h1>

          <p>
            Everything important about orders, deposits, delivery, refunds and support — with
            direct Telegram, email and website ticket options when you need human help.
          </p>

          <div className="faqHeroActions">
            <a href="#faq-list" className="faqPrimaryBtn">
              Browse FAQ
            </a>

            <a href={telegramLink} target="_blank" rel="noreferrer" className="faqSecondaryBtn">
              Message on Telegram
            </a>
          </div>
        </div>

        <aside className="faqInfoCard">
          <div className="faqInfoGlow" />

          <span>Help center</span>
          <strong>{stats.total}</strong>
          <small>Helpful answers available</small>

          <div className="faqInfoMiniGrid">
            <div>
              <span>Categories</span>
              <b>{stats.categories}</b>
            </div>

            <div>
              <span>Showing</span>
              <b>{stats.visible}</b>
            </div>
          </div>
        </aside>
      </section>

      <section className="faqContactGrid">
        {contactOptions.map((option) => (
          <a
            href={option.href}
            target={option.href.startsWith("http") ? "_blank" : undefined}
            rel={option.href.startsWith("http") ? "noreferrer" : undefined}
            className={`faqContactCard ${option.className}`}
            key={option.title}
          >
            <div className="faqContactIcon">{option.icon}</div>

            <div>
              <span>{option.title}</span>
              <strong>{option.value}</strong>
              <p>{option.description}</p>
            </div>
          </a>
        ))}
      </section>

      <section className="faqStatsGrid">
        <article className="faqStatCard faqStatMain">
          <span>Quick answers</span>
          <strong>{stats.total}</strong>
          <small>Common questions covered</small>
        </article>

        <article className="faqStatCard">
          <span>Telegram contact</span>
          <strong>Live</strong>
          <small>Direct message to @EmpireBooster</small>
        </article>

        <article className="faqStatCard">
          <span>Email support</span>
          <strong>Mail</strong>
          <small>{supportEmail}</small>
        </article>

        <article className="faqStatCard">
          <span>Website tickets</span>
          <strong>Fast</strong>
          <small>Send messages through Support page</small>
        </article>
      </section>

      <section className="faqMainGrid" id="faq-list">
        <section className="faqPanel faqListPanel">
          <div className="faqPanelHeader">
            <div>
              <span>Knowledge base</span>
              <h2>Frequently Asked Questions</h2>
            </div>

            <div className="faqPanelIcon">{filteredFaqs.length}</div>
          </div>

          <div className="faqToolbar">
            <label className="faqSearchBox">
              <span>Search FAQ</span>
              <input
                type="text"
                placeholder="Search orders, wallet, refunds, delivery, telegram..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>

          <div className="faqCategoryRail">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => setActiveCategory(category)}
                className={activeCategory === category ? "faqCategoryActive" : ""}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="faqEmptyBox">
              <strong>No answer found</strong>
              <span>
                Try another keyword, message @EmpireBooster on Telegram, send an email or open a
                support ticket.
              </span>
            </div>
          ) : (
            <div className="faqAccordionList">
              {filteredFaqs.map((item) => {
                const realIndex = faqItems.indexOf(item);
                const isOpen = openItems.includes(realIndex);

                return (
                  <article
                    className={`faqAccordionItem ${isOpen ? "faqAccordionOpen" : ""}`}
                    key={item.question}
                  >
                    <button type="button" onClick={() => toggleItem(realIndex)}>
                      <div>
                        <span>{item.category}</span>
                        <strong>{item.question}</strong>
                      </div>

                      <b>{isOpen ? "−" : "+"}</b>
                    </button>

                    <div className="faqAccordionAnswer">
                      <p>{item.answer}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside className="faqPanel faqSidePanel">
          <div className="faqPanelHeader">
            <div>
              <span>Contact support</span>
              <h2>Need human help?</h2>
            </div>

            <div className="faqPanelIcon">↗</div>
          </div>

          <div className="faqSupportCard">
            <span>Best next step</span>
            <strong>Choose the fastest contact option for your situation.</strong>
            <p>
              Telegram is good for fast direct messages. Email is better for longer details and
              screenshots. Website support is best when your issue should stay connected to your
              account.
            </p>

            <div className="faqSupportButtons">
              <a href={telegramLink} target="_blank" rel="noreferrer" className="faqSupportBtn">
                Telegram
              </a>

              <a href={`mailto:${supportEmail}`} className="faqSupportBtn faqSupportBtnDark">
                Email
              </a>

              <a href="/support" className="faqSupportBtn faqSupportBtnDark">
                Support Ticket
              </a>
            </div>
          </div>

          <div className="faqSteps">
            <div>
              <b>01</b>
              <strong>Check your Orders page</strong>
              <span>Look at the current order status first.</span>
            </div>

            <div>
              <b>02</b>
              <strong>Check your Wallet</strong>
              <span>For deposits, payment status and balance updates.</span>
            </div>

            <div>
              <b>03</b>
              <strong>Open Transactions</strong>
              <span>See every balance movement in one place.</span>
            </div>

            <div>
              <b>04</b>
              <strong>Contact support</strong>
              <span>Telegram, email or website ticket — all options are available.</span>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default FAQ;