import "./Privacy.css";

const privacySections = [
  {
    number: "01",
    title: "Information We Collect",
    text:
      "We may collect your email address, account information, wallet balance, order history, deposit requests, payment status, support tickets, transaction records and submitted public social media links.",
  },
  {
    number: "02",
    title: "Information We Do Not Need",
    text:
      "We do not need or request your social media passwords. Do not submit passwords, private login credentials, recovery codes or sensitive private information through EmpireBoost.",
  },
  {
    number: "03",
    title: "How We Use Data",
    text:
      "We use your data to create and manage your account, process orders, manage wallet balance, approve deposits, provide customer support, prevent abuse, improve website performance and operate our services.",
  },
  {
    number: "04",
    title: "Payment Data",
    text:
      "Manual payments may include payment references, payment notes or transaction details. We use this information only to match payments with deposit requests, confirm wallet balance and resolve payment issues.",
  },
  {
    number: "05",
    title: "Support Data",
    text:
      "Messages sent through support tickets are stored so admins can answer, review and solve user issues. Please do not send passwords or unnecessary sensitive data through support messages.",
  },
  {
    number: "06",
    title: "Public Social Media Links",
    text:
      "When placing an order, users submit public links such as profile links, video links, post links, channel links or livestream links. These links are used to process the selected service.",
  },
  {
    number: "07",
    title: "Cookies and Local Storage",
    text:
      "EmpireBoost may use cookies, browser storage or similar technologies to keep users logged in, protect accounts, remember settings and improve website functionality.",
  },
  {
    number: "08",
    title: "Third-Party Services",
    text:
      "We may use third-party services for hosting, database storage, payment processing, analytics, email delivery, provider integrations, security or infrastructure. These providers may process data only as needed for their services.",
  },
  {
    number: "09",
    title: "Data Security",
    text:
      "We take reasonable technical and organizational steps to protect user data. However, no online system, website, payment system or database can be guaranteed to be completely risk-free.",
  },
  {
    number: "10",
    title: "Data Retention",
    text:
      "We keep account, order, wallet, transaction and support data as long as needed to provide the service, resolve disputes, prevent abuse, meet legal obligations or maintain accurate business records.",
  },
  {
    number: "11",
    title: "User Rights",
    text:
      "Depending on your location, you may have rights to request access, correction, deletion, restriction or export of your personal data. You can contact us to make a privacy request.",
  },
  {
    number: "12",
    title: "Account Deletion",
    text:
      "Users may contact support to request account deletion. Some records may need to be kept when required for payment, fraud prevention, dispute handling, tax, accounting or legal reasons.",
  },
  {
    number: "13",
    title: "Age Requirement",
    text:
      "EmpireBoost is intended for users who are legally allowed to use online services and make payments in their country. If you are under the required age, you should not use the service without proper permission.",
  },
  {
    number: "14",
    title: "Policy Updates",
    text:
      "We may update this Privacy Policy from time to time. Continued use of EmpireBoost after an update means the updated policy applies to your use of the website.",
  },
];

function Privacy() {
  return (
    <main className="privacyPagePro">
      <div className="privacyAurora" aria-hidden="true">
        <span className="privacyAuroraOne" />
        <span className="privacyAuroraTwo" />
        <span className="privacyAuroraThree" />
      </div>

      <div className="privacyFloatingLayer" aria-hidden="true">
        <span className="privacyFloat privacyFloat1">Privacy</span>
        <span className="privacyFloat privacyFloat2">Data</span>
        <span className="privacyFloat privacyFloat3">Security</span>
        <span className="privacyFloat privacyFloat4">Wallet</span>
        <span className="privacyFloat privacyFloat5">Orders</span>
        <span className="privacyFloat privacyFloat6">Support</span>
        <span className="privacyFloat privacyFloat7">Cookies</span>
        <span className="privacyFloat privacyFloat8">EmpireBoost</span>
      </div>

      <section className="privacyHero">
        <div className="privacyBadge">
          <span />
          Data protection information
        </div>

        <h1>Privacy Policy</h1>

        <p>
          This Privacy Policy explains what data EmpireBoost collects, why we
          collect it, how we use it and how users can contact us about privacy
          questions.
        </p>

        <div className="privacyHeroGrid">
          <div>
            <strong>No passwords</strong>
            <span>We never need your social media login details.</span>
          </div>

          <div>
            <strong>Order data</strong>
            <span>Public links are used only for service processing.</span>
          </div>

          <div>
            <strong>Support access</strong>
            <span>You can contact us for privacy questions anytime.</span>
          </div>
        </div>
      </section>

      <section className="privacyIntroCard">
        <div>
          <span>Important privacy notice</span>
          <h2>Your account data should stay protected.</h2>
          <p>
            EmpireBoost does not need your social media passwords. Only submit
            public links and normal account information needed to process your
            order, deposit or support request.
          </p>
        </div>

        <div className="privacyIntroIcon">🔒</div>
      </section>

      <section className="privacyContentGrid">
        {privacySections.map((section) => (
          <article className="privacySectionCard" key={section.number}>
            <div className="privacySectionTop">
              <span>{section.number}</span>
              <h2>{section.title}</h2>
            </div>

            <p>{section.text}</p>
          </article>
        ))}
      </section>

      <section className="privacyDataCard">
        <div>
          <span>Data overview</span>
          <h2>What kind of data matters most?</h2>
          <p>
            The most important data inside EmpireBoost is usually your account
            email, wallet balance, order history, transaction history, support
            messages and public social media links submitted for orders.
          </p>
        </div>

        <div className="privacyDataGrid">
          <div>
            <strong>Account</strong>
            <span>Email, login status and user role.</span>
          </div>

          <div>
            <strong>Wallet</strong>
            <span>Balance, deposits and transactions.</span>
          </div>

          <div>
            <strong>Orders</strong>
            <span>Service, quantity, public link and status.</span>
          </div>

          <div>
            <strong>Support</strong>
            <span>Tickets, replies and issue history.</span>
          </div>
        </div>
      </section>

      <section className="privacyContactCard">
        <div>
          <span>Contact</span>
          <h2>Questions about your privacy?</h2>
          <p>
            For privacy questions, data requests or account-related questions,
            contact us through support, email or Telegram.
          </p>
        </div>

        <div className="privacyContactActions">
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

export default Privacy;