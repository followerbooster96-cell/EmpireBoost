import "./RefundPolicy.css";

const refundSections = [
  {
    number: "01",
    title: "Wallet Balance",
    text:
      "Approved deposits are added to your EmpireBoost wallet balance. Orders are paid from your wallet balance when you create an order.",
  },
  {
    number: "02",
    title: "Failed Orders",
    text:
      "If an order fails or cannot be delivered, EmpireBoost may refund the order amount back to your wallet balance after admin review.",
  },
  {
    number: "03",
    title: "Processing Orders",
    text:
      "Orders that are already pending, running or processing may not always be cancellable. Contact support as soon as possible if you made a mistake.",
  },
  {
    number: "04",
    title: "Wrong Links",
    text:
      "If you submit a wrong, private, deleted, restricted, unavailable or incorrect link, the order may fail, be delayed or become non-refundable depending on the order status.",
  },
  {
    number: "05",
    title: "Deposit Refunds",
    text:
      "Deposit refunds depend on payment method, payment status, fees, fraud checks and admin review. Some payment methods may not support direct refunds.",
  },
  {
    number: "06",
    title: "Promo Bonus",
    text:
      "Promo bonus balance is promotional credit. It may be used for services on EmpireBoost, but it is not refundable as cash or external payment.",
  },
  {
    number: "07",
    title: "Partial Delivery",
    text:
      "If a service is partially delivered, a partial wallet refund may be considered for the undelivered part depending on provider data and admin review.",
  },
  {
    number: "08",
    title: "Completed Orders",
    text:
      "Completed orders are normally not refundable because the service has already been delivered. If you believe there is a mistake, contact support for review.",
  },
  {
    number: "09",
    title: "Third-Party Platform Actions",
    text:
      "EmpireBoost is not responsible for removals, drops, restrictions, account changes or actions taken by third-party platforms after delivery.",
  },
  {
    number: "10",
    title: "Abuse and Fraud",
    text:
      "Refunds may be refused if there is evidence of fraud, abuse, chargeback misuse, fake claims, repeated incorrect orders or violation of our Terms of Service.",
  },
  {
    number: "11",
    title: "Support Review",
    text:
      "If you believe an order should be refunded, create a support ticket and include your order ID, service name, link, quantity and a clear explanation.",
  },
  {
    number: "12",
    title: "Final Decision",
    text:
      "Refund decisions are made after reviewing order status, provider information, payment details and the situation described by the user.",
  },
];

function RefundPolicy() {
  return (
    <main className="refundPagePro">
      <div className="refundAurora" aria-hidden="true">
        <span className="refundAuroraOne" />
        <span className="refundAuroraTwo" />
        <span className="refundAuroraThree" />
      </div>

      <div className="refundFloatingLayer" aria-hidden="true">
        <span className="refundFloat refundFloat1">Refunds</span>
        <span className="refundFloat refundFloat2">Wallet</span>
        <span className="refundFloat refundFloat3">Orders</span>
        <span className="refundFloat refundFloat4">Support</span>
        <span className="refundFloat refundFloat5">Balance</span>
        <span className="refundFloat refundFloat6">Review</span>
        <span className="refundFloat refundFloat7">Policy</span>
        <span className="refundFloat refundFloat8">EmpireBoost</span>
      </div>

      <section className="refundHero">
        <div className="refundBadge">
          <span />
          Refund information
        </div>

        <h1>Refund Policy</h1>

        <p>
          This Refund Policy explains when refunds may be issued on EmpireBoost,
          how wallet refunds work and what users should do when an order has a
          problem.
        </p>

        <div className="refundHeroGrid">
          <div>
            <strong>Wallet refunds</strong>
            <span>Most refunds are returned to your balance.</span>
          </div>

          <div>
            <strong>Admin review</strong>
            <span>Failed or disputed orders are checked manually.</span>
          </div>

          <div>
            <strong>Support first</strong>
            <span>Open a ticket if something went wrong.</span>
          </div>
        </div>
      </section>

      <section className="refundIntroCard">
        <div>
          <span>Important refund notice</span>
          <h2>Refunds depend on order status and delivery data.</h2>
          <p>
            EmpireBoost uses wallet balance for orders. If an order cannot be
            delivered, a refund may be issued to your wallet after review.
            Completed, processing or incorrectly submitted orders may not always
            be refundable.
          </p>
        </div>

        <div className="refundIntroIcon">↺</div>
      </section>

      <section className="refundProcessCard">
        <div>
          <span>How refund review works</span>
          <h2>Simple review process</h2>
          <p>
            To review a refund request properly, our support team needs the
            correct order information and a clear explanation of what happened.
          </p>
        </div>

        <div className="refundProcessGrid">
          <div>
            <strong>1</strong>
            <span>Open support ticket</span>
          </div>

          <div>
            <strong>2</strong>
            <span>Send order details</span>
          </div>

          <div>
            <strong>3</strong>
            <span>Admin checks status</span>
          </div>

          <div>
            <strong>4</strong>
            <span>Wallet refund if approved</span>
          </div>
        </div>
      </section>

      <section className="refundContentGrid">
        {refundSections.map((section) => (
          <article className="refundSectionCard" key={section.number}>
            <div className="refundSectionTop">
              <span>{section.number}</span>
              <h2>{section.title}</h2>
            </div>

            <p>{section.text}</p>
          </article>
        ))}
      </section>

      <section className="refundWarningCard">
        <div className="refundWarningIcon">!</div>

        <div>
          <span>Before ordering</span>
          <h2>Always check your link before payment.</h2>
          <p>
            Make sure your profile, post, video, channel or livestream link is
            public, correct and available. Wrong or private links are one of the
            most common reasons why an order can be delayed or fail.
          </p>
        </div>
      </section>

      <section className="refundContactCard">
        <div>
          <span>Need a refund review?</span>
          <h2>Contact support with your order details.</h2>
          <p>
            Include your order ID, service name, quantity, link and a short
            explanation. This helps us review your request faster.
          </p>
        </div>

        <div className="refundContactActions">
          <a href="/support">Open Support</a>

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

export default RefundPolicy;