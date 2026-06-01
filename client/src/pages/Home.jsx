import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const initialOrders = [
  {
    id: 1,
    service: "Instagram Followers",
    status: "Processing",
    progress: 24,
    eta: "8 min",
    amount: "1,000",
  },
  {
    id: 2,
    service: "TikTok Views",
    status: "Processing",
    progress: 38,
    eta: "7 min",
    amount: "5,000",
  },
  {
    id: 3,
    service: "YouTube Subscribers",
    status: "Pending",
    progress: 14,
    eta: "10 min",
    amount: "250",
  },
  {
    id: 4,
    service: "Telegram Members",
    status: "Processing",
    progress: 31,
    eta: "9 min",
    amount: "800",
  },
];

const randomServices = [
  "Instagram Followers",
  "Instagram Likes",
  "TikTok Views",
  "TikTok Followers",
  "YouTube Subscribers",
  "YouTube Likes",
  "Telegram Members",
  "Spotify Plays",
  "Twitch Followers",
];

const galaxyBurstItems = [
  {
    id: 1,
    icon: "IG",
    text: "Instagram",
    tone: "rose",
    driftX: "-720px",
    driftY: "-260px",
    delay: "-1.5s",
    duration: "19s",
    rotate: "-16deg",
  },
  {
    id: 2,
    icon: "TT",
    text: "TikTok",
    tone: "cyan",
    driftX: "700px",
    driftY: "-230px",
    delay: "-8s",
    duration: "21s",
    rotate: "14deg",
  },
  {
    id: 3,
    icon: "YT",
    text: "YouTube",
    tone: "red",
    driftX: "-680px",
    driftY: "185px",
    delay: "-12s",
    duration: "20s",
    rotate: "11deg",
  },
  {
    id: 4,
    icon: "TG",
    text: "Telegram",
    tone: "blue",
    driftX: "690px",
    driftY: "170px",
    delay: "-4s",
    duration: "22s",
    rotate: "-13deg",
  },
  {
    id: 5,
    icon: "❤",
    text: "Likes",
    tone: "rose",
    driftX: "-520px",
    driftY: "-405px",
    delay: "-15s",
    duration: "18.5s",
    rotate: "9deg",
  },
  {
    id: 6,
    icon: "👥",
    text: "Followers",
    tone: "emerald",
    driftX: "540px",
    driftY: "-385px",
    delay: "-6s",
    duration: "20.5s",
    rotate: "-10deg",
  },
  {
    id: 7,
    icon: "▶",
    text: "Views",
    tone: "blue",
    driftX: "-360px",
    driftY: "430px",
    delay: "-18s",
    duration: "23s",
    rotate: "-8deg",
  },
  {
    id: 8,
    icon: "💬",
    text: "Comments",
    tone: "violet",
    driftX: "390px",
    driftY: "420px",
    delay: "-10s",
    duration: "21.5s",
    rotate: "12deg",
  },
  {
    id: 9,
    icon: "♫",
    text: "Plays",
    tone: "emerald",
    driftX: "-750px",
    driftY: "-30px",
    delay: "-20s",
    duration: "24s",
    rotate: "-14deg",
  },
  {
    id: 10,
    icon: "⚡",
    text: "Boost",
    tone: "amber",
    driftX: "760px",
    driftY: "25px",
    delay: "-2s",
    duration: "19.8s",
    rotate: "15deg",
  },
  {
    id: 11,
    icon: "↗",
    text: "Reach",
    tone: "cyan",
    driftX: "-610px",
    driftY: "335px",
    delay: "-14s",
    duration: "22.8s",
    rotate: "10deg",
  },
  {
    id: 12,
    icon: "✦",
    text: "Growth",
    tone: "indigo",
    driftX: "620px",
    driftY: "320px",
    delay: "-9s",
    duration: "21.2s",
    rotate: "-11deg",
  },
  {
    id: 13,
    icon: "★",
    text: "Premium",
    tone: "amber",
    driftX: "-230px",
    driftY: "-520px",
    delay: "-16s",
    duration: "23.5s",
    rotate: "-7deg",
  },
  {
    id: 14,
    icon: "◆",
    text: "Creator",
    tone: "violet",
    driftX: "250px",
    driftY: "-520px",
    delay: "-5s",
    duration: "20.2s",
    rotate: "8deg",
  },
  {
    id: 15,
    icon: "◉",
    text: "Live",
    tone: "emerald",
    driftX: "-245px",
    driftY: "525px",
    delay: "-22s",
    duration: "24.5s",
    rotate: "13deg",
  },
  {
    id: 16,
    icon: "#",
    text: "Trending",
    tone: "cyan",
    driftX: "265px",
    driftY: "520px",
    delay: "-11s",
    duration: "22.2s",
    rotate: "-13deg",
  },
  {
    id: 17,
    icon: "SP",
    text: "Spotify",
    tone: "green",
    driftX: "-790px",
    driftY: "-145px",
    delay: "-7s",
    duration: "25s",
    rotate: "6deg",
  },
  {
    id: 18,
    icon: "TW",
    text: "Twitch",
    tone: "violet",
    driftX: "790px",
    driftY: "-125px",
    delay: "-19s",
    duration: "24.2s",
    rotate: "-6deg",
  },
  {
    id: 19,
    icon: "✓",
    text: "Orders",
    tone: "blue",
    driftX: "-760px",
    driftY: "95px",
    delay: "-3s",
    duration: "22.6s",
    rotate: "-12deg",
  },
  {
    id: 20,
    icon: "∞",
    text: "Viral",
    tone: "rose",
    driftX: "760px",
    driftY: "110px",
    delay: "-13s",
    duration: "23.8s",
    rotate: "12deg",
  },
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createRandomOrder(id) {
  const progress = Math.floor(Math.random() * 18) + 6;

  return {
    id,
    service: getRandomItem(randomServices),
    status: progress > 28 ? "Processing" : "Pending",
    progress,
    eta: `${Math.floor(Math.random() * 5) + 6} min`,
    amount: `${(Math.floor(Math.random() * 20) + 1) * 100}`,
  };
}

function getNumericValue(value) {
  if (typeof value === "number") return value;

  const cleanValue = String(value).replace(/[^\d.-]/g, "");
  const parsedValue = Number(cleanValue);

  return Number.isNaN(parsedValue) ? 0 : parsedValue;
}

function AnimatedStatValue({ value, prefix = "", suffix = "", decimals = null }) {
  const previousValueRef = useRef(value);
  const [direction, setDirection] = useState("up");
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const currentNumber = getNumericValue(value);
    const previousNumber = getNumericValue(previousValueRef.current);

    if (currentNumber !== previousNumber) {
      setDirection(currentNumber >= previousNumber ? "up" : "down");
      setAnimationKey((prev) => prev + 1);
      previousValueRef.current = value;
    }
  }, [value]);

  const displayValue =
    typeof value === "number" && decimals !== null ? value.toFixed(decimals) : value;

  return (
    <span className="bankNumberShell">
      <span key={animationKey} className={`bankNumberRoll bankNumberRoll-${direction}`}>
        {prefix}
        {displayValue}
        {suffix}
      </span>
    </span>
  );
}

function Home() {
  const nextOrderIdRef = useRef(5);
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const [liveStats, setLiveStats] = useState({
    walletBalance: 278.76,
    activeOrders: 14,
    tickets: 5,
    completedToday: 40,
    uptime: "99.90%",
    newUsersToday: 31,
    ordersToday: 87,
    revenueToday: 486.2,
    avgDelivery: 8,
    successRate: "98.7%",
    onlineUsers: 19,
    lastSync: "just now",
  });

  const [liveOrders, setLiveOrders] = useState(initialOrders);

  useEffect(() => {
    const statsInterval = setInterval(() => {
      setLiveStats((prev) => {
        const deliveryMove = Math.floor(Math.random() * 3 - 1);
        const nextAvgDelivery = Math.max(5, Math.min(10, prev.avgDelivery + deliveryMove));

        return {
          ...prev,
          walletBalance: Number(
            Math.max(120, prev.walletBalance + (Math.random() * 10 - 3)).toFixed(2)
          ),
          activeOrders: Math.max(8, prev.activeOrders + Math.floor(Math.random() * 3 - 1)),
          tickets: Math.max(2, prev.tickets + Math.floor(Math.random() * 3 - 1)),
          completedToday: Math.max(20, prev.completedToday + Math.floor(Math.random() * 2)),
          ordersToday: Math.max(50, prev.ordersToday + Math.floor(Math.random() * 2)),
          revenueToday: Number((prev.revenueToday + Math.random() * 8).toFixed(2)),
          uptime: `${(99.85 + Math.random() * 0.14).toFixed(2)}%`,
          successRate: `${(98.4 + Math.random() * 1.4).toFixed(1)}%`,
          onlineUsers: Math.max(8, prev.onlineUsers + Math.floor(Math.random() * 5 - 2)),
          avgDelivery: nextAvgDelivery,
          lastSync: "just now",
        };
      });
    }, 3500);

    const progressInterval = setInterval(() => {
      setLiveOrders((prev) =>
        prev.map((order) => {
          if (order.status === "Completed") return order;

          const increase = Math.floor(Math.random() * 5) + 3;
          const nextProgress = Math.min(100, order.progress + increase);

          if (nextProgress >= 100) {
            return {
              ...order,
              progress: 100,
              status: "Completed",
              eta: "Done",
            };
          }

          const etaMinutes = Math.max(1, Math.min(10, Math.ceil((100 - nextProgress) / 12)));

          return {
            ...order,
            progress: nextProgress,
            status: nextProgress > 30 ? "Processing" : "Pending",
            eta: `${etaMinutes} min`,
          };
        })
      );
    }, 25000);

    const newOrderInterval = setInterval(() => {
      const freshOrder = createRandomOrder(nextOrderIdRef.current);
      nextOrderIdRef.current += 1;

      setLiveOrders((prev) => [freshOrder, ...prev].slice(0, 6));

      setLiveStats((prev) => ({
        ...prev,
        activeOrders: prev.activeOrders + 1,
        ordersToday: prev.ordersToday + 1,
      }));
    }, 120000);

    const newUsersInterval = setInterval(() => {
      setLiveStats((prev) => ({
        ...prev,
        newUsersToday: prev.newUsersToday + 1,
        onlineUsers: prev.onlineUsers + 1,
      }));
    }, 300000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(progressInterval);
      clearInterval(newOrderInterval);
      clearInterval(newUsersInterval);
    };
  }, []);

  return (
    <main>
      <section className="homeHero fullGifHero">
        <div className="homeOverlay"></div>

        <div className="galaxyBurstLayer" aria-hidden="true">
          <div className="galaxyCoreGlow"></div>

          {galaxyBurstItems.map((item) => (
            <div
              key={item.id}
              className={`galaxyBurstItem tone-${item.tone}`}
              style={{
                "--drift-x": item.driftX,
                "--drift-y": item.driftY,
                "--delay": item.delay,
                "--duration": item.duration,
                "--rotate": item.rotate,
              }}
            >
              <span className="burstIcon">{item.icon}</span>
              <span className="burstText">{item.text}</span>
            </div>
          ))}
        </div>

        <div className="homeHeroContent centeredHeroContent">
          <div className="heroBadge">Creator Growth Platform</div>

          <h1>Grow your social media faster with smart promotion tools</h1>

          <p>
            Promotion packages for Instagram, TikTok, YouTube and more. Fast
            delivery, clear pricing, wallet deposits, promo codes and simple
            order tracking.
          </p>

          <div className="heroButtons">
            <Link to={isLoggedIn ? "/services" : "/login"}>Get Started</Link>
            <Link to="/services" className="secondaryButton">
              View Services
            </Link>
          </div>

          <div className="heroTrust">
            <span>No passwords required</span>
            <span>Wallet balance system</span>
            <span>Support tickets</span>
          </div>
        </div>
      </section>

      <section className="platformStrip">
        <span>Instagram</span>
        <span>TikTok</span>
        <span>YouTube</span>
        <span>Telegram</span>
        <span>Twitch</span>
        <span>Spotify</span>
      </section>

      <section className="homeSection premiumHomeSection">
        <div className="sectionHeader centeredSectionHeader">
          <span className="sectionEyebrow">All-in-one growth system</span>
          <h2>Everything you need in one platform</h2>
          <p>
            One clean system for buying services, adding funds, using promo codes,
            checking orders and getting help without confusion.
          </p>
        </div>

        <div className="premiumFeatureGrid">
          <div className="premiumFeatureCard">
            <div className="featureIcon">01</div>
            <h3>Fast Orders</h3>
            <p>
              Choose a service, paste your link, select quantity and place your
              order in seconds.
            </p>
          </div>

          <div className="premiumFeatureCard">
            <div className="featureIcon">02</div>
            <h3>Wallet System</h3>
            <p>
              Add funds once, keep balance ready and pay instantly without
              repeating the same steps.
            </p>
          </div>

          <div className="premiumFeatureCard">
            <div className="featureIcon">03</div>
            <h3>Support Tickets</h3>
            <p>
              If something goes wrong, open a ticket and get direct help without
              wasting time.
            </p>
          </div>
        </div>
      </section>

      <section className="controlRoomSection">
        <div className="controlRoomInner">
          <div className="controlRoomContent">
            <span className="sectionEyebrow">Control room</span>

            <h2>Built for serious creators, brands and resellers.</h2>

            <p>
              A clean growth command center for people who want speed, control and
              a premium order flow without messy panels or confusing steps.
            </p>

            <div className="processList">
              <div>
                <strong>1</strong>
                <span>Select the growth service</span>
              </div>

              <div>
                <strong>2</strong>
                <span>Drop your profile or post link</span>
              </div>

              <div>
                <strong>3</strong>
                <span>Choose quantity and confirm</span>
              </div>

              <div>
                <strong>4</strong>
                <span>Watch the progress live</span>
              </div>
            </div>

            <div className="leftInfoBadges">
              <span>Fast delivery</span>
              <span>Live tracking</span>
              <span>Premium flow</span>
              <span>Clean control</span>
            </div>

            <Link to="/services" className="buttonLink">
              Explore Services
            </Link>
          </div>

          <div className="dashboardMockup liveDashboardCard">
            <div className="dashboardGlow"></div>
            <div className="dashboardElectricGrid"></div>

            <div className="mockupTopBar">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="mockupHeader">
              <div>
                <small>EmpireBoost Panel</small>
                <h3>Live Growth Dashboard</h3>
              </div>

              <div className="liveStatusWrap">
                <span className="liveDot"></span>
                <span className="liveBadge">LIVE</span>
              </div>
            </div>

            <div className="liveMiniStats">
              <div className="liveStatMiniCard">
                <span>Last sync</span>
                <strong>{liveStats.lastSync}</strong>
              </div>

              <div className="liveStatMiniCard">
                <span>Uptime</span>
                <strong>
                  <AnimatedStatValue value={liveStats.uptime} />
                </strong>
              </div>

              <div className="liveStatMiniCard">
                <span>New users today</span>
                <strong>
                  <AnimatedStatValue value={liveStats.newUsersToday} prefix="+" />
                </strong>
              </div>
            </div>

            <div className="mockupStats strongMockupStats">
              <div className="liveStatBox">
                <small>Wallet Volume</small>
                <strong>
                  <AnimatedStatValue
                    value={liveStats.walletBalance}
                    prefix="€"
                    decimals={2}
                  />
                </strong>
              </div>

              <div className="liveStatBox">
                <small>Active Orders</small>
                <strong>
                  <AnimatedStatValue value={liveStats.activeOrders} />
                </strong>
              </div>

              <div className="liveStatBox">
                <small>Tickets</small>
                <strong>
                  <AnimatedStatValue value={liveStats.tickets} />
                </strong>
              </div>

              <div className="liveStatBox">
                <small>Completed Today</small>
                <strong>
                  <AnimatedStatValue value={liveStats.completedToday} />
                </strong>
              </div>

              <div className="liveStatBox">
                <small>Orders Today</small>
                <strong>
                  <AnimatedStatValue value={liveStats.ordersToday} />
                </strong>
              </div>

              <div className="liveStatBox">
                <small>Revenue Today</small>
                <strong>
                  <AnimatedStatValue
                    value={liveStats.revenueToday}
                    prefix="€"
                    decimals={2}
                  />
                </strong>
              </div>

              <div className="liveStatBox">
                <small>Avg Delivery</small>
                <strong>
                  <AnimatedStatValue value={liveStats.avgDelivery} suffix=" min" />
                </strong>
              </div>

              <div className="liveStatBox">
                <small>Success Rate</small>
                <strong>
                  <AnimatedStatValue value={liveStats.successRate} />
                </strong>
              </div>
            </div>

            <div className="dashboardBottomMiniCards">
              <div className="dashboardMiniCard">
                <span>Online users right now</span>
                <strong>
                  <AnimatedStatValue value={liveStats.onlineUsers} />
                </strong>
              </div>

              <div className="dashboardMiniCard">
                <span>Best performing service</span>
                <strong>Instagram Followers</strong>
              </div>

              <div className="dashboardMiniCard">
                <span>Most used payment flow</span>
                <strong>Wallet balance</strong>
              </div>
            </div>

            <div className="liveOrdersBoard">
              {liveOrders.map((order) => (
                <div className="liveOrderRow" key={order.id}>
                  <div className="liveOrderTop">
                    <div className="liveOrderMain">
                      <span>{order.service}</span>
                      <small>{order.amount} quantity</small>
                    </div>

                    <div className="liveOrderRight">
                      <small className="etaText">{order.eta}</small>
                      <strong
                        className={
                          order.status === "Completed"
                            ? "statusCompleted"
                            : order.status === "Processing"
                              ? "statusProcessing"
                              : "statusPending"
                        }
                      >
                        {order.status}
                      </strong>
                    </div>
                  </div>

                  <div className="progressTrack">
                    <div
                      className="progressFill"
                      style={{ width: `${order.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;