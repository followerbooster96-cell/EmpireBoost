import "./Imprint.css";

const imprintSections = [
  {
    number: "01",
    title: "Business Name",
    text: "EmpireBoost",
  },
  {
    number: "02",
    title: "Responsible Person",
    text: "Empire Boost Johhny",
  },
  {
    number: "03",
    title: "Address",
    text: "Zürich 8001, Switzerland",
  },
  {
    number: "04",
    title: "Email",
    text: "followerbooster96@gmail.com",
  },
  {
    number: "05",
    title: "Telegram",
    text: "@EmpireBooster",
  },
  {
    number: "06",
    title: "Business Registration",
    text: "To be added if applicable.",
  },
  {
    number: "07",
    title: "Platform Disclaimer",
    text:
      "EmpireBoost is not affiliated with Instagram, TikTok, YouTube, Facebook, X, Telegram, Spotify, Twitch or other third-party platforms. All trademarks belong to their respective owners.",
  },
  {
    number: "08",
    title: "Content Responsibility",
    text:
      "The information on this website is provided for general business and service information. We try to keep all information accurate and updated, but we do not guarantee that every detail is always complete or error-free.",
  },
  {
    number: "09",
    title: "External Links",
    text:
      "EmpireBoost may contain links to third-party websites or platforms. We are not responsible for the content, availability, policies or actions of external websites.",
  },
  {
    number: "10",
    title: "Contact for Legal Questions",
    text:
      "For legal, business or website-related questions, please contact us by email, Telegram or through the Support page.",
  },
];

function Imprint() {
  return (
    <main className="imprintPagePro">
      <div className="imprintAurora" aria-hidden="true">
        <span className="imprintAuroraOne" />
        <span className="imprintAuroraTwo" />
        <span className="imprintAuroraThree" />
      </div>

      <div className="imprintFloatingLayer" aria-hidden="true">
        <span className="imprintFloat imprintFloat1">Imprint</span>
        <span className="imprintFloat imprintFloat2">Impressum</span>
        <span className="imprintFloat imprintFloat3">Business</span>
        <span className="imprintFloat imprintFloat4">Contact</span>
        <span className="imprintFloat imprintFloat5">Zürich</span>
        <span className="imprintFloat imprintFloat6">Legal</span>
        <span className="imprintFloat imprintFloat7">Support</span>
        <span className="imprintFloat imprintFloat8">EmpireBoost</span>
      </div>

      <section className="imprintHero">
        <div className="imprintBadge">
          <span />
          Business information
        </div>

        <h1>Imprint / Impressum</h1>

        <p>
          This page contains business, contact and legal information for
          EmpireBoost. For questions about the website, services or legal
          information, please contact us directly.
        </p>

        <div className="imprintHeroGrid">
          <div>
            <strong>Business</strong>
            <span>EmpireBoost</span>
          </div>

          <div>
            <strong>Location</strong>
            <span>Zürich 8001, Switzerland</span>
          </div>

          <div>
            <strong>Contact</strong>
            <span>Email, Telegram or Support page</span>
          </div>
        </div>
      </section>

      <section className="imprintIntroCard">
        <div>
          <span>Official information</span>
          <h2>Business and contact details for EmpireBoost.</h2>
          <p>
            EmpireBoost provides social media promotion and visibility services.
            This imprint page is here to make the website contact information
            clear and accessible.
          </p>
        </div>

        <div className="imprintIntroIcon">§</div>
      </section>

      <section className="imprintBusinessCard">
        <div>
          <span>Quick contact</span>
          <h2>Reach EmpireBoost directly.</h2>
          <p>
            For support, legal questions, privacy questions, payment questions or
            general business requests, use one of the contact options below.
          </p>
        </div>

        <div className="imprintBusinessGrid">
          <div>
            <strong>Email</strong>
            <a href="mailto:followerbooster96@gmail.com">
              followerbooster96@gmail.com
            </a>
          </div>

          <div>
            <strong>Telegram</strong>
            <a
              href="https://t.me/EmpireBooster"
              target="_blank"
              rel="noreferrer"
            >
              @EmpireBooster
            </a>
          </div>

          <div>
            <strong>Support</strong>
            <a href="/support">Open Support Page</a>
          </div>

          <div>
            <strong>Address</strong>
            <span>Zürich 8001, Switzerland</span>
          </div>
        </div>
      </section>

      <section className="imprintContentGrid">
        {imprintSections.map((section) => (
          <article className="imprintSectionCard" key={section.number}>
            <div className="imprintSectionTop">
              <span>{section.number}</span>
              <h2>{section.title}</h2>
            </div>

            <p>{section.text}</p>
          </article>
        ))}
      </section>

      <section className="imprintDisclaimerCard">
        <div className="imprintDisclaimerIcon">!</div>

        <div>
          <span>Disclaimer</span>
          <h2>Independent service provider.</h2>
          <p>
            EmpireBoost is not owned by, operated by, sponsored by or officially
            connected with Instagram, TikTok, YouTube, Facebook, X, Telegram,
            Spotify, Twitch or other third-party platforms. All names, logos and
            trademarks belong to their respective owners.
          </p>
        </div>
      </section>

      <section className="imprintContactCard">
        <div>
          <span>Need help?</span>
          <h2>Contact us through the official channels.</h2>
          <p>
            For support, legal questions or business requests, contact us through
            support, email or Telegram.
          </p>
        </div>

        <div className="imprintContactActions">
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

export default Imprint;