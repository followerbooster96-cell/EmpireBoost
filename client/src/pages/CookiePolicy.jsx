import "./CookiePolicy.css";

const cookieSections = [
  {
    number: "01",
    title: "Login Storage",
    text:
      "EmpireBoost may store login tokens, session information or authentication data in your browser so you can stay logged in while using the website.",
  },
  {
    number: "02",
    title: "Essential Cookies and Storage",
    text:
      "Essential cookies or browser storage may be used for login, security, user sessions, account protection, wallet functionality and core website features.",
  },
  {
    number: "03",
    title: "Local Storage",
    text:
      "We may use browser local storage to remember login state, access tokens, user interface preferences or other technical information needed for website functionality.",
  },
  {
    number: "04",
    title: "Security Purposes",
    text:
      "Cookies and storage may help us protect accounts, reduce abuse, manage sessions and keep the website working correctly.",
  },
  {
    number: "05",
    title: "Payment and Wallet Flow",
    text:
      "Some storage may be used during wallet deposits, payment redirects, order creation or checkout flows to keep the process stable and connected to your account.",
  },
  {
    number: "06",
    title: "Analytics",
    text:
      "In the future, EmpireBoost may use analytics tools to understand website usage, improve pages, measure performance and make the platform better.",
  },
  {
    number: "07",
    title: "Third-Party Services",
    text:
      "Third-party providers such as hosting, payment, analytics or security tools may use their own cookies or similar technologies according to their own policies.",
  },
  {
    number: "08",
    title: "Managing Cookies",
    text:
      "You can clear cookies and local storage in your browser settings. Doing this may log you out or reset parts of the website experience.",
  },
  {
    number: "09",
    title: "Blocking Cookies",
    text:
      "You can block cookies in your browser, but some features such as login, wallet, checkout or account pages may not work correctly without essential storage.",
  },
  {
    number: "10",
    title: "Policy Updates",
    text:
      "We may update this Cookie Policy from time to time. Continued use of EmpireBoost means the updated policy applies to your use of the website.",
  },
];

function CookiePolicy() {
  return (
    <main className="cookiePagePro">
      <div className="cookieAurora" aria-hidden="true">
        <span className="cookieAuroraOne" />
        <span className="cookieAuroraTwo" />
        <span className="cookieAuroraThree" />
      </div>

      <div className="cookieFloatingLayer" aria-hidden="true">
        <span className="cookieFloat cookieFloat1">Cookies</span>
        <span className="cookieFloat cookieFloat2">Storage</span>
        <span className="cookieFloat cookieFloat3">Login</span>
        <span className="cookieFloat cookieFloat4">Security</span>
        <span className="cookieFloat cookieFloat5">Wallet</span>
        <span className="cookieFloat cookieFloat6">Session</span>
        <span className="cookieFloat cookieFloat7">Privacy</span>
        <span className="cookieFloat cookieFloat8">EmpireBoost</span>
      </div>

      <section className="cookieHero">
        <div className="cookieBadge">
          <span />
          Browser storage information
        </div>

        <h1>Cookie Policy</h1>

        <p>
          This Cookie Policy explains how EmpireBoost may use cookies, browser
          storage and similar technologies to keep the website secure, stable
          and functional.
        </p>

        <div className="cookieHeroGrid">
          <div>
            <strong>Login sessions</strong>
            <span>Storage helps keep users logged in.</span>
          </div>

          <div>
            <strong>Essential usage</strong>
            <span>Some storage is required for core features.</span>
          </div>

          <div>
            <strong>User control</strong>
            <span>You can clear cookies in your browser.</span>
          </div>
        </div>
      </section>

      <section className="cookieIntroCard">
        <div>
          <span>Important cookie notice</span>
          <h2>Some storage is needed for EmpireBoost to work properly.</h2>
          <p>
            Login, wallet, checkout, order creation and account pages may depend
            on essential cookies or browser storage. If you delete or block
            storage, you may be logged out or some functions may stop working.
          </p>
        </div>

        <div className="cookieIntroIcon">◉</div>
      </section>

      <section className="cookieDataCard">
        <div>
          <span>What we may store</span>
          <h2>Cookies and browser storage can support key features.</h2>
          <p>
            EmpireBoost may use browser storage for technical functionality,
            user sessions and security. We do not use cookies to ask for or
            store your social media passwords.
          </p>
        </div>

        <div className="cookieDataGrid">
          <div>
            <strong>Authentication</strong>
            <span>Login tokens and session status.</span>
          </div>

          <div>
            <strong>Security</strong>
            <span>Account protection and abuse prevention.</span>
          </div>

          <div>
            <strong>Wallet</strong>
            <span>Payment and balance flow stability.</span>
          </div>

          <div>
            <strong>Preferences</strong>
            <span>Interface or website experience settings.</span>
          </div>
        </div>
      </section>

      <section className="cookieContentGrid">
        {cookieSections.map((section) => (
          <article className="cookieSectionCard" key={section.number}>
            <div className="cookieSectionTop">
              <span>{section.number}</span>
              <h2>{section.title}</h2>
            </div>

            <p>{section.text}</p>
          </article>
        ))}
      </section>

      <section className="cookieManageCard">
        <div className="cookieManageIcon">⚙</div>

        <div>
          <span>Browser control</span>
          <h2>You can manage cookies yourself.</h2>
          <p>
            Most browsers let you delete cookies, clear local storage or block
            storage completely. If you do that, EmpireBoost may log you out and
            some pages may need you to sign in again.
          </p>
        </div>
      </section>

      <section className="cookieContactCard">
        <div>
          <span>Contact</span>
          <h2>Questions about cookies or privacy?</h2>
          <p>
            Contact us if you have questions about browser storage, account
            data, privacy or how EmpireBoost handles technical website data.
          </p>
        </div>

        <div className="cookieContactActions">
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

export default CookiePolicy;