import { Link } from "react-router-dom";
import "./Contact.css";

const contactOptions = [
  {
    title: "Support Ticket",
    text:
      "Best option for order questions, payment problems, refunds, account issues or service problems. Your message arrives directly inside the EmpireBoost support system.",
    button: "Open Support",
    href: "/support",
    type: "internal",
    icon: "◎",
  },
  {
    title: "Email",
    text:
      "For business questions, privacy questions, legal requests or payment questions, you can contact us directly by email.",
    button: "followerbooster96@gmail.com",
    href: "mailto:followerbooster96@gmail.com",
    type: "external",
    icon: "@",
  },
  {
    title: "Telegram",
    text:
      "For fast direct messages, quick questions or urgent support contact, message EmpireBoost directly on Telegram.",
    button: "Telegram: @EmpireBooster",
    href: "https://t.me/EmpireBooster",
    type: "external",
    icon: "↗",
  },
];

const contactInfo = [
  {
    label: "Website",
    value: "EmpireBoost",
  },
  {
    label: "Responsible Person",
    value: "Empire Boost Johhny",
  },
  {
    label: "Address",
    value: "Zürich 8001, Switzerland",
  },
  {
    label: "Support Email",
    value: "followerbooster96@gmail.com",
  },
];

const contactReasons = [
  "Order status",
  "Payment issue",
  "Refund review",
  "Wallet balance",
  "Service question",
  "Account problem",
  "Legal request",
  "Business inquiry",
];

function Contact() {
  return (
    <main className="contactPagePro">
      <div className="contactAurora" aria-hidden="true">
        <span className="contactAuroraOne" />
        <span className="contactAuroraTwo" />
        <span className="contactAuroraThree" />
      </div>

      <div className="contactFloatingLayer" aria-hidden="true">
        <span className="contactFloat contactFloat1">Contact</span>
        <span className="contactFloat contactFloat2">Support</span>
        <span className="contactFloat contactFloat3">Telegram</span>
        <span className="contactFloat contactFloat4">Email</span>
        <span className="contactFloat contactFloat5">Orders</span>
        <span className="contactFloat contactFloat6">Wallet</span>
        <span className="contactFloat contactFloat7">Help</span>
        <span className="contactFloat contactFloat8">EmpireBoost</span>
      </div>

      <section className="contactHero">
        <div className="contactBadge">
          <span />
          EmpireBoost contact center
        </div>

        <h1>Contact EmpireBoost</h1>

        <p>
          Need help with an order, wallet deposit, refund, account question or
          business request? Choose the right contact option below and we will
          help you as fast as possible.
        </p>

        <div className="contactHeroGrid">
          <div>
            <strong>Support tickets</strong>
            <span>Best for order, wallet and refund cases.</span>
          </div>

          <div>
            <strong>Direct email</strong>
            <span>Best for legal, privacy and business questions.</span>
          </div>

          <div>
            <strong>Telegram</strong>
            <span>Fast direct message contact.</span>
          </div>
        </div>
      </section>

      <section className="contactIntroCard">
        <div>
          <span>Fastest support route</span>
          <h2>Create a support ticket for website issues.</h2>
          <p>
            If your question is about an order, deposit, payment, wallet balance
            or refund, the Support page is the best option because your message
            is saved directly inside your EmpireBoost account.
          </p>
        </div>

        <div className="contactIntroIcon">✦</div>
      </section>

      <section className="contactOptionsGrid">
        {contactOptions.map((option) => (
          <article className="contactOptionCard" key={option.title}>
            <div className="contactOptionIcon">{option.icon}</div>

            <h2>{option.title}</h2>
            <p>{option.text}</p>

            {option.type === "internal" ? (
              <Link className="contactOptionBtn" to={option.href}>
                {option.button}
              </Link>
            ) : (
              <a
                className="contactOptionBtn"
                href={option.href}
                target={option.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={option.href.startsWith("mailto:") ? undefined : "noreferrer"}
              >
                {option.button}
              </a>
            )}
          </article>
        ))}
      </section>

      <section className="contactReasonCard">
        <div>
          <span>What can you contact us about?</span>
          <h2>We can help with orders, payments and account questions.</h2>
          <p>
            To make support faster, include important details like your order ID,
            service name, payment method, email address and a short explanation
            of what happened.
          </p>
        </div>

        <div className="contactReasonGrid">
          {contactReasons.map((reason) => (
            <div key={reason}>
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="contactBusinessCard">
        <div>
          <span>Business information</span>
          <h2>EmpireBoost contact details.</h2>
          <p>
            This section contains the main contact and business information for
            EmpireBoost. For full legal details, you can also visit the Imprint
            page.
          </p>
        </div>

        <div className="contactBusinessGrid">
          {contactInfo.map((item) => (
            <div key={item.label}>
              <strong>{item.label}</strong>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="contactWarningCard">
        <div className="contactWarningIcon">!</div>

        <div>
          <span>Important</span>
          <h2>Never send social media passwords.</h2>
          <p>
            EmpireBoost never asks for Instagram, TikTok, YouTube, Facebook, X,
            Telegram, Spotify or Twitch passwords. Only send public links,
            order details and normal support information.
          </p>
        </div>
      </section>

      <section className="contactFinalCard">
        <div>
          <span>Ready?</span>
          <h2>Get help through the right channel.</h2>
          <p>
            For normal customer support, open a ticket. For business or legal
            questions, email us. For fast direct contact, use Telegram.
          </p>
        </div>

        <div className="contactFinalActions">
          <Link to="/support">Open Support</Link>

          <a href="mailto:followerbooster96@gmail.com">
            followerbooster96@gmail.com
          </a>

          <a
            href="https://t.me/EmpireBooster"
            target="_blank"
            rel="noreferrer"
          >
            Telegram: @EmpireBooster
          </a>
        </div>
      </section>
    </main>
  );
}

export default Contact;