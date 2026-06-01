import "./Terms.css";

const termsSections = [
  {
    number: "01",
    title: "Services",
    text:
      "EmpireBoost provides social media promotion and visibility services for creators, businesses and influencers. Services may include promotion packages for platforms such as Instagram, TikTok, YouTube, Facebook, X, Telegram, Spotify and Twitch.",
  },
  {
    number: "02",
    title: "No Password Requirement",
    text:
      "We never ask for your social media passwords. Users should only submit public links such as profile links, post links, video links, livestream links or channel links.",
  },
  {
    number: "03",
    title: "User Responsibility",
    text:
      "You are responsible for making sure that your use of our services is allowed under the rules of the platform you use. EmpireBoost is not responsible for actions taken by third-party platforms.",
  },
  {
    number: "04",
    title: "Orders",
    text:
      "After placing an order, it may show as pending, processing, completed, failed, cancelled or refunded. Delivery speed depends on the selected service, quantity, provider availability and platform conditions.",
  },
  {
    number: "05",
    title: "Payments and Balance",
    text:
      "Deposits are credited to your wallet balance after payment review, approval or automatic confirmation where available. Manual payment methods may require correct payment details so we can match your payment to your account.",
  },
  {
    number: "06",
    title: "Promo Codes",
    text:
      "Promo codes may give users bonus balance during deposit approval. Promo codes can expire, be disabled, have a usage limit or be changed at any time by EmpireBoost.",
  },
  {
    number: "07",
    title: "Refunds",
    text:
      "Refunds may be issued to your wallet balance when an order fails or cannot be delivered. Refund decisions depend on the order status, service conditions and available provider information.",
  },
  {
    number: "08",
    title: "Prohibited Use",
    text:
      "Users may not use EmpireBoost for illegal activity, fraud, harassment, impersonation, abuse, spam, harmful activity or anything that violates applicable laws.",
  },
  {
    number: "09",
    title: "Third-Party Platforms",
    text:
      "EmpireBoost is not owned by, operated by or officially connected with Instagram, TikTok, YouTube, Facebook, X, Telegram, Spotify, Twitch or any other social media platform.",
  },
  {
    number: "10",
    title: "Changes",
    text:
      "We may update these terms at any time. Continued use of the website after changes means you accept the updated terms.",
  },
];

function Terms() {
  return (
    <main className="termsPagePro">
      <div className="termsAurora" aria-hidden="true">
        <span className="termsAuroraOne" />
        <span className="termsAuroraTwo" />
        <span className="termsAuroraThree" />
      </div>

      <div className="termsFloatingLayer" aria-hidden="true">
        <span className="termsFloat termsFloat1">Terms</span>
        <span className="termsFloat termsFloat2">EmpireBoost</span>
        <span className="termsFloat termsFloat3">Orders</span>
        <span className="termsFloat termsFloat4">Wallet</span>
        <span className="termsFloat termsFloat5">Refunds</span>
        <span className="termsFloat termsFloat6">Support</span>
        <span className="termsFloat termsFloat7">Legal</span>
        <span className="termsFloat termsFloat8">Services</span>
      </div>

      <section className="termsHero">
        <div className="termsBadge">
          <span />
          Legal information
        </div>

        <h1>Terms of Service</h1>

        <p>
          These Terms of Service explain the rules for using EmpireBoost. By
          creating an account, adding balance or placing an order, you agree to
          these terms.
        </p>

        <div className="termsHeroGrid">
          <div>
            <strong>No passwords</strong>
            <span>Only public links are required.</span>
          </div>

          <div>
            <strong>Wallet based</strong>
            <span>Orders are paid through balance.</span>
          </div>

          <div>
            <strong>Support ready</strong>
            <span>Contact us if you need help.</span>
          </div>
        </div>
      </section>

      <section className="termsIntroCard">
        <div>
          <span>Important notice</span>
          <h2>Use EmpireBoost responsibly.</h2>
          <p>
            Our services are created for promotion, visibility and social proof.
            You are responsible for checking if your use of any service is
            allowed by the platform you are promoting.
          </p>
        </div>

        <div className="termsIntroIcon">§</div>
      </section>

      <section className="termsContentGrid">
        {termsSections.map((section) => (
          <article className="termsSectionCard" key={section.number}>
            <div className="termsSectionTop">
              <span>{section.number}</span>
              <h2>{section.title}</h2>
            </div>

            <p>{section.text}</p>
          </article>
        ))}
      </section>

      <section className="termsContactCard">
        <div>
          <span>Contact</span>
          <h2>Questions about these terms?</h2>
          <p>
            If you have questions about these terms, contact us through the
            Support page or send us a direct message.
          </p>
        </div>

        <div className="termsContactActions">
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

export default Terms;