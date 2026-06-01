import "./Disclaimer.css";

const disclaimerSections = [
  {
    number: "01",
    title: "General Information",
    text:
      "EmpireBoost provides social media promotion and visibility services. Information on this website is provided for general service and business purposes only.",
  },
  {
    number: "02",
    title: "No Platform Affiliation",
    text:
      "EmpireBoost is not affiliated with Instagram, TikTok, YouTube, Facebook, X, Telegram, Spotify, Twitch or other third-party platforms. All trademarks belong to their respective owners.",
  },
  {
    number: "03",
    title: "No Guaranteed Results",
    text:
      "We do not guarantee specific business results, sales, revenue, viral growth, ranking improvement, engagement quality or long-term platform performance.",
  },
  {
    number: "04",
    title: "Variable Results",
    text:
      "Results can vary depending on platform conditions, account settings, link availability, selected service, quantity, provider availability and third-party platform changes.",
  },
  {
    number: "05",
    title: "Platform Rules",
    text:
      "Users are responsible for understanding and following the rules, terms and policies of the platforms they use. EmpireBoost is not responsible for platform actions against user accounts.",
  },
  {
    number: "06",
    title: "Service Availability",
    text:
      "Services may change, pause, fail, slow down or become unavailable depending on provider conditions, platform updates, technical issues or security restrictions.",
  },
  {
    number: "07",
    title: "Public Links Only",
    text:
      "EmpireBoost never requires social media passwords. Users should only submit public links such as profiles, posts, videos, channels or livestream links.",
  },
  {
    number: "08",
    title: "Third-Party Providers",
    text:
      "Some services may rely on third-party provider systems. Provider delays, shortages, errors or changes can affect delivery speed and availability.",
  },
  {
    number: "09",
    title: "User Responsibility",
    text:
      "Users are responsible for checking order details before submitting them, including the correct link, quantity, service type and platform.",
  },
  {
    number: "10",
    title: "Website Changes",
    text:
      "EmpireBoost may update, remove, improve or change website content, prices, services, features and policies at any time.",
  },
];

function Disclaimer() {
  return (
    <main className="disclaimerPagePro">
      <div className="disclaimerAurora" aria-hidden="true">
        <span className="disclaimerAuroraOne" />
        <span className="disclaimerAuroraTwo" />
        <span className="disclaimerAuroraThree" />
      </div>

      <div className="disclaimerFloatingLayer" aria-hidden="true">
        <span className="disclaimerFloat disclaimerFloat1">Disclaimer</span>
        <span className="disclaimerFloat disclaimerFloat2">Services</span>
        <span className="disclaimerFloat disclaimerFloat3">Platforms</span>
        <span className="disclaimerFloat disclaimerFloat4">Results</span>
        <span className="disclaimerFloat disclaimerFloat5">Orders</span>
        <span className="disclaimerFloat disclaimerFloat6">Support</span>
        <span className="disclaimerFloat disclaimerFloat7">Legal</span>
        <span className="disclaimerFloat disclaimerFloat8">EmpireBoost</span>
      </div>

      <section className="disclaimerHero">
        <div className="disclaimerBadge">
          <span />
          Important service notice
        </div>

        <h1>Disclaimer</h1>

        <p>
          EmpireBoost provides social media promotion and visibility services.
          Results can vary depending on platform conditions, account settings,
          link availability, selected service, quantity and provider availability.
        </p>

        <div className="disclaimerHeroGrid">
          <div>
            <strong>Independent</strong>
            <span>Not affiliated with social media platforms.</span>
          </div>

          <div>
            <strong>No passwords</strong>
            <span>Only public links should be submitted.</span>
          </div>

          <div>
            <strong>Variable results</strong>
            <span>Delivery depends on provider and platform conditions.</span>
          </div>
        </div>
      </section>

      <section className="disclaimerIntroCard">
        <div>
          <span>Service transparency</span>
          <h2>Promotion services can be affected by third-party platforms.</h2>
          <p>
            Social media platforms can change their systems, rules, detection,
            limits and availability at any time. This can affect delivery speed,
            retention, visibility and service performance.
          </p>
        </div>

        <div className="disclaimerIntroIcon">!</div>
      </section>

      <section className="disclaimerDataCard">
        <div>
          <span>Before placing an order</span>
          <h2>Check your order details carefully.</h2>
          <p>
            Wrong links, private profiles, deleted posts, unavailable videos or
            incorrect quantities can delay delivery or make an order harder to
            review.
          </p>
        </div>

        <div className="disclaimerDataGrid">
          <div>
            <strong>Correct link</strong>
            <span>Use public and working links only.</span>
          </div>

          <div>
            <strong>Right platform</strong>
            <span>Select the service for the correct platform.</span>
          </div>

          <div>
            <strong>Realistic timing</strong>
            <span>Delivery speed can vary by service.</span>
          </div>

          <div>
            <strong>Support review</strong>
            <span>Open a ticket if something looks wrong.</span>
          </div>
        </div>
      </section>

      <section className="disclaimerContentGrid">
        {disclaimerSections.map((section) => (
          <article className="disclaimerSectionCard" key={section.number}>
            <div className="disclaimerSectionTop">
              <span>{section.number}</span>
              <h2>{section.title}</h2>
            </div>

            <p>{section.text}</p>
          </article>
        ))}
      </section>

      <section className="disclaimerWarningCard">
        <div className="disclaimerWarningIcon">§</div>

        <div>
          <span>Legal notice</span>
          <h2>All platform names belong to their owners.</h2>
          <p>
            Names such as Instagram, TikTok, YouTube, Facebook, X, Telegram,
            Spotify and Twitch are used only to describe supported service
            categories. EmpireBoost is an independent service provider.
          </p>
        </div>
      </section>

      <section className="disclaimerContactCard">
        <div>
          <span>Need clarification?</span>
          <h2>Contact us before ordering.</h2>
          <p>
            If you are unsure about a service, platform, order link or delivery
            expectation, contact support before placing an order.
          </p>
        </div>

        <div className="disclaimerContactActions">
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

export default Disclaimer;