import { useEffect, useMemo, useState } from "react";
import api from "../lib/api.js";
import useCurrency from "../lib/useCurrency.js";
import "./Services.css";

const platforms = [
  "All",
  "Instagram",
  "TikTok",
  "YouTube",
  "Facebook",
  "X",
  "Telegram",
  "Spotify",
  "Twitch",
  "Other",
];

const types = [
  "All",
  "Followers",
  "Likes",
  "Views",
  "Comments",
  "Subscribers",
  "Members",
  "Streams",
  "Other",
];

const sortOptions = [
  { label: "Best match", value: "best" },
  { label: "Lowest price", value: "price-low" },
  { label: "Highest price", value: "price-high" },
  { label: "Highest max quantity", value: "max-high" },
];

const platformVisuals = {
  All: {
    label: "All",
    short: "ALL",
    mark: "✦",
    image: "",
    tone: "toneAll",
  },
  Instagram: {
    label: "Instagram",
    short: "IG",
    mark: "◎",
    image: "https://cdn.simpleicons.org/instagram/ffffff",
    tone: "toneInstagram",
  },
  TikTok: {
    label: "TikTok",
    short: "TT",
    mark: "♫",
    image: "https://cdn.simpleicons.org/tiktok/ffffff",
    tone: "toneTikTok",
  },
  YouTube: {
    label: "YouTube",
    short: "YT",
    mark: "▶",
    image: "https://cdn.simpleicons.org/youtube/ffffff",
    tone: "toneYouTube",
  },
  Facebook: {
    label: "Facebook",
    short: "FB",
    mark: "f",
    image: "https://cdn.simpleicons.org/facebook/ffffff",
    tone: "toneFacebook",
  },
  X: {
    label: "X",
    short: "X",
    mark: "𝕏",
    image: "https://cdn.simpleicons.org/x/ffffff",
    tone: "toneX",
  },
  Telegram: {
    label: "Telegram",
    short: "TG",
    mark: "✈",
    image: "https://cdn.simpleicons.org/telegram/ffffff",
    tone: "toneTelegram",
  },
  Spotify: {
    label: "Spotify",
    short: "SP",
    mark: "◉",
    image: "https://cdn.simpleicons.org/spotify/ffffff",
    tone: "toneSpotify",
  },
  Twitch: {
    label: "Twitch",
    short: "TW",
    mark: "▣",
    image: "https://cdn.simpleicons.org/twitch/ffffff",
    tone: "toneTwitch",
  },
  Other: {
    label: "Other",
    short: "OT",
    mark: "◆",
    image: "",
    tone: "toneOther",
  },
};

const floatingSocials = [
  "Instagram",
  "TikTok",
  "YouTube",
  "Telegram",
  "Spotify",
  "Twitch",
  "Facebook",
  "X",
  "Followers",
  "Likes",
  "Views",
  "Comments",
  "Reels",
  "Streams",
  "Members",
  "Subscribers",
];

function getVisual(platformName) {
  return platformVisuals[platformName] || platformVisuals.Other;
}

function PlatformLogo({ platformName, className = "" }) {
  const visual = getVisual(platformName);

  return (
    <span className={`servicesLogoOrb ${visual.tone} ${className}`}>
      {visual.image ? (
        <img
          src={visual.image}
          alt=""
          aria-hidden="true"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <span>{visual.mark}</span>
      )}

      <b>{visual.image ? "" : visual.short}</b>
    </span>
  );
}

function formatQuantity(value) {
  const numberValue = Number(value || 0);

  return numberValue.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
}

function Services() {
  const { selectedCurrency, selectedCurrencyMeta, currencyRateText, formatMoney } =
    useCurrency();

  const [services, setServices] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isLoading, setIsLoading] = useState(true);
  const [creatingId, setCreatingId] = useState("");

  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("All");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("best");

  const [orderForms, setOrderForms] = useState({});

  const loadServices = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const res = await api.get("/services");
      setServices(res.data.services || []);
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Failed to load services.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const filteredServices = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    const filtered = services.filter((service) => {
      const searchableText = [
        service.name,
        service.platform,
        service.type,
        service.category,
        service.description,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !cleanSearch || searchableText.includes(cleanSearch);
      const matchesPlatform = platform === "All" || service.platform === platform;
      const matchesType = type === "All" || service.type === type;

      return matchesSearch && matchesPlatform && matchesType;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-low") {
        return Number(a.pricePer1000) - Number(b.pricePer1000);
      }

      if (sort === "price-high") {
        return Number(b.pricePer1000) - Number(a.pricePer1000);
      }

      if (sort === "max-high") {
        return Number(b.max) - Number(a.max);
      }

      return (
        String(a.platform).localeCompare(String(b.platform)) ||
        String(a.type).localeCompare(String(b.type)) ||
        Number(a.pricePer1000) - Number(b.pricePer1000)
      );
    });
  }, [services, search, platform, type, sort]);

  const serviceStats = useMemo(() => {
    const cheapest =
      services.length > 0
        ? Math.min(...services.map((service) => Number(service.pricePer1000 || 0)))
        : 0;

    const platformsCount = new Set(services.map((service) => service.platform)).size;
    const typesCount = new Set(services.map((service) => service.type)).size;

    return {
      total: services.length,
      cheapest,
      platformsCount,
      typesCount,
    };
  }, [services]);

  const updateOrderForm = (serviceId, field, value) => {
    setOrderForms((current) => ({
      ...current,
      [serviceId]: {
        ...current[serviceId],
        [field]: value,
      },
    }));
  };

  const calculatePriceNumber = (service) => {
    const quantity = Number(orderForms[service._id]?.quantity || 0);

    if (!quantity || quantity <= 0) {
      return 0;
    }

    return (quantity / 1000) * Number(service.pricePer1000 || 0);
  };

  const getQuantityState = (service) => {
    const quantity = Number(orderForms[service._id]?.quantity || 0);

    if (!quantity) {
      return "Enter quantity to see the live price.";
    }

    if (quantity < service.min) {
      return `Minimum quantity is ${formatQuantity(service.min)}.`;
    }

    if (quantity > service.max) {
      return `Maximum quantity is ${formatQuantity(service.max)}.`;
    }

    return "Quantity looks good.";
  };

  const resetFilters = () => {
    setSearch("");
    setPlatform("All");
    setType("All");
    setSort("best");
  };

  const createOrder = async (service) => {
    setMessage("");

    const form = orderForms[service._id] || {};
    const link = form.link || "";
    const quantity = Number(form.quantity || 0);

    if (!link.trim()) {
      setMessageType("error");
      setMessage("Please enter a valid link before creating the order.");
      return;
    }

    if (!quantity || quantity < service.min || quantity > service.max) {
      setMessageType("error");
      setMessage(
        `Quantity must be between ${formatQuantity(service.min)} and ${formatQuantity(
          service.max
        )}.`
      );
      return;
    }

    setCreatingId(service._id);

    try {
      const res = await api.post("/orders", {
        serviceId: service._id,
        link,
        quantity,
      });

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));

        window.dispatchEvent(
          new CustomEvent("empire-user-updated", {
            detail: {
              user: res.data.user,
            },
          })
        );
      } else {
        window.dispatchEvent(new CustomEvent("empire-user-updated"));
      }

      setMessageType("success");
      setMessage(
        `Order created successfully. New balance: ${formatMoney(
          res.data.newBalance || 0
        )}`
      );

      setOrderForms((current) => ({
        ...current,
        [service._id]: {
          link: "",
          quantity: "",
        },
      }));
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Order failed.");
    } finally {
      setCreatingId("");
    }
  };

  return (
    <main className="servicesPagePro">
      <div className="servicesAuroraFlow" aria-hidden="true">
        <span className="servicesAuroraBand bandOne" />
        <span className="servicesAuroraBand bandTwo" />
        <span className="servicesAuroraBand bandThree" />
        <span className="servicesAuroraBand bandFour" />
      </div>

      <div className="servicesAmbient" aria-hidden="true">
        <span className="servicesAmbientGlow glowOne" />
        <span className="servicesAmbientGlow glowTwo" />
        <span className="servicesAmbientGlow glowThree" />
      </div>

      <div className="servicesFloatingUniverse" aria-hidden="true">
        {floatingSocials.map((item, index) => {
          const visual = platformVisuals[item] || {
            label: item,
            short: item.slice(0, 2).toUpperCase(),
            mark: "+",
            image: "",
            tone: "toneOther",
          };

          return (
            <span
              className={`servicesFloatingIcon servicesFloatingIcon${index + 1}`}
              key={`${item}-${index}`}
            >
              <span className={`servicesFloatingBubble ${visual.tone}`}>
                {visual.image ? (
                  <img src={visual.image} alt="" aria-hidden="true" />
                ) : (
                  <b>{visual.mark}</b>
                )}
              </span>
              <em>{visual.label || item}</em>
            </span>
          );
        })}
      </div>

      <section className="servicesHeroPro">
        <div className="servicesHeroProInner">
          <div className="servicesHeroBadgePro">
            <span className="servicesLivePulse" />
            Social growth marketplace
          </div>

          <h1>Premium services built for creators who want clean, fast growth.</h1>

          <p>
            Select a platform, choose the right package, paste your link and see
            the price instantly. Everything is designed to feel simple, serious
            and professional.
          </p>

          <div className="servicesHeroStatsPro">
            <div className="servicesHeroStatCardPro">
              <div className="servicesHeroStatIconWrapPro">
                <PlatformLogo platformName="Instagram" className="servicesHeroStatIconPro" />
              </div>
              <span>Total services</span>
              <strong>{serviceStats.total}</strong>
              <small>live packages available</small>
            </div>

            <div className="servicesHeroStatCardPro">
              <div className="servicesHeroStatIconWrapPro">
                <PlatformLogo platformName="YouTube" className="servicesHeroStatIconPro" />
              </div>
              <span>Platforms</span>
              <strong>{serviceStats.platformsCount}</strong>
              <small>major networks covered</small>
            </div>

            <div className="servicesHeroStatCardPro" title={currencyRateText}>
              <div className="servicesHeroStatIconWrapPro">
                <PlatformLogo platformName="TikTok" className="servicesHeroStatIconPro" />
              </div>
              <span>Starting from</span>
              <strong>{formatMoney(serviceStats.cheapest)}</strong>
              <small>shown in {selectedCurrency}</small>
            </div>

            <div className="servicesHeroStatCardPro">
              <div className="servicesHeroStatIconWrapPro">
                <PlatformLogo platformName="Telegram" className="servicesHeroStatIconPro" />
              </div>
              <span>Service types</span>
              <strong>{serviceStats.typesCount}</strong>
              <small>growth options ready</small>
            </div>
          </div>

          <div className="servicesHeroActionsPro">
            <a href="#services-marketplace" className="servicesMainActionPro">
              Browse Marketplace
            </a>

            <button className="servicesSoftActionPro" type="button" onClick={resetFilters}>
              Clear Filters
            </button>
          </div>

          <p
            style={{
              margin: "20px auto 0",
              maxWidth: "720px",
              color: "#8fa4c2",
              fontSize: "12px",
              fontWeight: 800,
              lineHeight: 1.55,
              textAlign: "center",
            }}
            title={currencyRateText}
          >
            Prices are stored and charged in EUR. You are viewing converted prices in{" "}
            {selectedCurrencyMeta.flag} {selectedCurrency} for easier understanding.
          </p>
        </div>
      </section>

      <section className="servicesMarketplacePro" id="services-marketplace">
        {message && (
          <div className={`servicesMessagePro servicesMessagePro-${messageType}`}>
            <span>{messageType === "success" ? "✓" : messageType === "error" ? "!" : "i"}</span>
            <p>{message}</p>
          </div>
        )}

        <div className="servicesControlPanelPro">
          <div className="servicesControlHeaderPro">
            <div>
              <span>Control center</span>
              <h2>Find the perfect service</h2>
              <p>
                Use filters or search directly by platform, package name or service type.
              </p>
            </div>

            <div className="servicesControlCounterPro">
              <strong>{filteredServices.length}</strong>
              <span>matching services</span>
            </div>
          </div>

          <div className="servicesSearchGridPro">
            <div className="servicesSearchInputPro">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Search Instagram followers, TikTok views, YouTube likes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select value={type} onChange={(e) => setType(e.target.value)}>
              {types.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All service types" : item}
                </option>
              ))}
            </select>

            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {sortOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="servicesPlatformDockPro">
            {platforms.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  platform === item
                    ? "servicesPlatformButtonPro servicesPlatformButtonProActive"
                    : "servicesPlatformButtonPro"
                }
                onClick={() => setPlatform(item)}
              >
                <PlatformLogo platformName={item} />
                <span>{item}</span>
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="servicesLoadingGridPro">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div className="servicesSkeletonPro" key={item}>
                <div />
                <span />
                <span />
                <section />
              </div>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="servicesEmptyPro">
            <PlatformLogo platformName="All" />
            <h2>No services found</h2>
            <p>
              Nothing matches these filters right now. Clear filters or try a different
              search term.
            </p>
            <button type="button" onClick={resetFilters}>
              Reset marketplace
            </button>
          </div>
        ) : (
          <div className="servicesCardGridPro">
            {filteredServices.map((service, index) => {
              const visual = getVisual(service.platform);
              const totalPrice = calculatePriceNumber(service);

              return (
                <article
                  className={`serviceBuyCardPro ${visual.tone}`}
                  key={service._id}
                  style={{ "--entryDelay": `${Math.min(index * 0.045, 0.5)}s` }}
                >
                  <div className="serviceBuyCardGlowPro" />

                  <div className="serviceBuyTopPro">
                    <div className="serviceBuyIdentityPro">
                      <PlatformLogo platformName={service.platform} className="serviceBuyLogoPro" />

                      <div>
                        <span className="servicePlatformBadgePro">
                          {service.platform}
                        </span>
                        <h2>{service.name}</h2>
                      </div>
                    </div>

                    <span className="serviceTypeBadgePro">{service.type}</span>
                  </div>

                  <p className="serviceDescriptionPro">
                    {service.description ||
                      "Premium growth service with simple order tracking, clean delivery and instant price calculation."}
                  </p>

                  <div className="serviceInfoGridPro">
                    <div title={currencyRateText}>
                      <small>Price / 1000</small>
                      <strong>{formatMoney(service.pricePer1000 || 0)}</strong>
                    </div>

                    <div>
                      <small>Minimum</small>
                      <strong>{formatQuantity(service.min)}</strong>
                    </div>

                    <div>
                      <small>Maximum</small>
                      <strong>{formatQuantity(service.max)}</strong>
                    </div>
                  </div>

                  <div className="serviceOrderPanelPro">
                    <div className="serviceOrderPanelTitlePro">
                      <div>
                        <span>Order setup</span>
                        <p>Paste link, quantity and launch.</p>
                      </div>

                      <PlatformLogo platformName={service.platform} />
                    </div>

                    <label>
                      <span>Target link</span>
                      <input
                        type="text"
                        placeholder="Profile, video, post or channel link"
                        value={orderForms[service._id]?.link || ""}
                        onChange={(e) =>
                          updateOrderForm(service._id, "link", e.target.value)
                        }
                      />
                    </label>

                    <label>
                      <span>Quantity</span>
                      <input
                        type="number"
                        min={service.min}
                        max={service.max}
                        placeholder={`${service.min} - ${service.max}`}
                        value={orderForms[service._id]?.quantity || ""}
                        onChange={(e) =>
                          updateOrderForm(service._id, "quantity", e.target.value)
                        }
                      />
                    </label>

                    <div className="serviceQuantityStatePro">
                      {getQuantityState(service)}
                    </div>

                    <div className="servicePricePreviewPro" title={currencyRateText}>
                      <div>
                        <span>Total price</span>
                        <small>
                          Calculated live · shown in {selectedCurrency}
                        </small>
                      </div>

                      <strong>{formatMoney(totalPrice)}</strong>
                    </div>

                    <button
                      type="button"
                      className="serviceCreateButtonPro"
                      disabled={creatingId === service._id}
                      onClick={() => createOrder(service)}
                    >
                      {creatingId === service._id ? "Creating order..." : "Create Order"}
                    </button>

                    <p
                      style={{
                        margin: "12px 0 0",
                        color: "#7f93b1",
                        fontSize: "11px",
                        fontWeight: 800,
                        lineHeight: 1.45,
                      }}
                    >
                      Order is charged in EUR. Display price is converted to{" "}
                      {selectedCurrencyMeta.flag} {selectedCurrency}.
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Services;