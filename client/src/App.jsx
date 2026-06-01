import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import api from "./lib/api.js";

import {
  BASE_CURRENCY,
  FALLBACK_EXCHANGE_RATES,
  SUPPORTED_CURRENCIES,
  fetchLatestExchangeRates,
  formatCurrencyFromBase,
  getCurrencyMeta,
  getCurrencyRateText,
  getStoredCurrency,
  saveStoredCurrency,
} from "./lib/currency.js";

import {
  SUPPORTED_LANGUAGES,
  getLanguageMeta,
  getStoredLanguage,
  getTranslations,
  saveStoredLanguage,
} from "./lib/language.js";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Services from "./pages/Services.jsx";
import Orders from "./pages/Orders.jsx";
import Wallet from "./pages/Wallet.jsx";
import Transactions from "./pages/Transactions.jsx";
import FAQ from "./pages/FAQ.jsx";
import Support from "./pages/Support.jsx";

import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";
import RefundPolicy from "./pages/RefundPolicy.jsx";
import CookiePolicy from "./pages/CookiePolicy.jsx";
import Imprint from "./pages/Imprint.jsx";
import Disclaimer from "./pages/Disclaimer.jsx";
import Contact from "./pages/Contact.jsx";

import AdminServices from "./pages/admin/AdminServices.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminPromoCodes from "./pages/admin/AdminPromoCodes.jsx";
import AdminDeposits from "./pages/admin/AdminDeposits.jsx";
import AdminTransactions from "./pages/admin/AdminTransactions.jsx";
import AdminSupport from "./pages/admin/AdminSupport.jsx";
import AdminSettings from "./pages/admin/AdminSettings.jsx";

const topbarFloatItems = [
  { className: "topbarFloatOne", icon: "◎", label: "Instagram" },
  { className: "topbarFloatTwo", icon: "♫", label: "TikTok" },
  { className: "topbarFloatThree", icon: "▶", label: "YouTube" },
  { className: "topbarFloatFour", icon: "◉", label: "Spotify" },
  { className: "topbarFloatFive", icon: "✈", label: "Telegram" },
  { className: "topbarFloatSix", icon: "♡", label: "Likes" },
  { className: "topbarFloatSeven", icon: "+", label: "Followers" },
  { className: "topbarFloatEight", icon: "↗", label: "Views" },
  { className: "topbarFloatNine", icon: "◍", label: "Reels" },
  { className: "topbarFloatTen", icon: "▶", label: "Shorts" },
  { className: "topbarFloatEleven", icon: "★", label: "Premium" },
  { className: "topbarFloatTwelve", icon: "⚡", label: "Boost" },
  { className: "topbarFloatThirteen", icon: "◈", label: "Wallet" },
  { className: "topbarFloatFourteen", icon: "▣", label: "Orders" },
  { className: "topbarFloatFifteen", icon: "✓", label: "Done" },
  { className: "topbarFloatSixteen", icon: "∞", label: "Growth" },
  { className: "topbarFloatSeventeen", icon: "#", label: "Reach" },
  { className: "topbarFloatEighteen", icon: "●", label: "Live" },
  { className: "topbarFloatNineteen", icon: "◆", label: "Creator" },
  { className: "topbarFloatTwenty", icon: "↯", label: "Viral" },
];

function getStoredUser() {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const navbarRef = useRef(null);
  const adminDropdownRef = useRef(null);
  const adminCloseTimerRef = useRef(null);

  const lastScrollYRef = useRef(0);
  const currentLiftRef = useRef(0);
  const targetLiftRef = useRef(0);
  const scrollFrameRef = useRef(null);
  const animationFrameRef = useRef(null);

  const [adminOpen, setAdminOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(getStoredUser());

  const [selectedCurrency, setSelectedCurrency] = useState(getStoredCurrency());
  const [exchangeRates, setExchangeRates] = useState(FALLBACK_EXCHANGE_RATES);
  const [exchangeRateDate, setExchangeRateDate] = useState("");
  const [exchangeRateSource, setExchangeRateSource] = useState("fallback");
  const [currencyLoading, setCurrencyLoading] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState(getStoredLanguage());

  const isLoggedIn = Boolean(token);
  const isAdmin = user?.role === "admin";
  const balance = user?.balance || 0;

  const selectedCurrencyMeta = getCurrencyMeta(selectedCurrency);
  const selectedLanguageMeta = getLanguageMeta(selectedLanguage);
  const t = getTranslations(selectedLanguage);

  const displayedBalance = formatCurrencyFromBase(
    balance,
    selectedCurrency,
    exchangeRates
  );

  const currencyRateText = getCurrencyRateText(
    selectedCurrency,
    exchangeRates,
    exchangeRateDate,
    exchangeRateSource
  );

  const setMobileLift = (value) => {
    const safeValue = clampNumber(value, 0, 178);

    targetLiftRef.current = safeValue;

    if (!animationFrameRef.current) {
      animateMobileLift();
    }
  };

  const animateMobileLift = () => {
    const current = currentLiftRef.current;
    const target = targetLiftRef.current;
    const next = current + (target - current) * 0.18;

    currentLiftRef.current = Math.abs(target - next) < 0.35 ? target : next;

    if (navbarRef.current) {
      navbarRef.current.style.setProperty(
        "--mobile-topbar-lift",
        `${currentLiftRef.current}px`
      );

      const fadeAmount = clampNumber(currentLiftRef.current / 178, 0, 1);
      navbarRef.current.style.setProperty(
        "--mobile-topbar-alpha",
        `${1 - fadeAmount * 0.18}`
      );

      navbarRef.current.style.setProperty(
        "--mobile-topbar-shadow",
        `${1 - fadeAmount * 0.36}`
      );
    }

    if (Math.abs(target - currentLiftRef.current) > 0.35) {
      animationFrameRef.current = window.requestAnimationFrame(animateMobileLift);
    } else {
      animationFrameRef.current = null;
    }
  };

  const refreshUserFromStorage = () => {
    const nextToken = localStorage.getItem("token");
    const storedUser = getStoredUser();

    setToken(nextToken);
    setUser(storedUser);
  };

  const refreshUserFromApi = async () => {
    const nextToken = localStorage.getItem("token");

    setToken(nextToken);

    if (!nextToken) {
      setUser(null);
      return;
    }

    try {
      const res = await api.get("/auth/me");
      const nextUser = res.data.user || res.data;

      setUser(nextUser);
      localStorage.setItem("user", JSON.stringify(nextUser));
    } catch {
      setUser(getStoredUser());
    }
  };

  const refreshExchangeRates = async () => {
    setCurrencyLoading(true);

    try {
      const data = await fetchLatestExchangeRates();

      setExchangeRates(data.rates || FALLBACK_EXCHANGE_RATES);
      setExchangeRateDate(data.date || "");
      setExchangeRateSource(data.source || "fallback");
    } finally {
      setCurrencyLoading(false);
    }
  };

  useEffect(() => {
    refreshUserFromApi();
  }, [location.pathname]);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY || 0;
    currentLiftRef.current = 0;
    targetLiftRef.current = 0;

    if (navbarRef.current) {
      navbarRef.current.style.setProperty("--mobile-topbar-lift", "0px");
      navbarRef.current.style.setProperty("--mobile-topbar-alpha", "1");
      navbarRef.current.style.setProperty("--mobile-topbar-shadow", "1");
    }
  }, [location.pathname]);

  useEffect(() => {
    refreshExchangeRates();

    const handleCurrencyUpdated = () => {
      setSelectedCurrency(getStoredCurrency());
    };

    const handleLanguageUpdated = () => {
      setSelectedLanguage(getStoredLanguage());
    };

    window.addEventListener("empire-currency-updated", handleCurrencyUpdated);
    window.addEventListener("empire-language-updated", handleLanguageUpdated);

    return () => {
      window.removeEventListener(
        "empire-currency-updated",
        handleCurrencyUpdated
      );
      window.removeEventListener(
        "empire-language-updated",
        handleLanguageUpdated
      );
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      refreshUserFromStorage();
      setSelectedCurrency(getStoredCurrency());
      setSelectedLanguage(getStoredLanguage());
    };

    const handleUserUpdated = () => {
      refreshUserFromApi();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("empire-user-updated", handleUserUpdated);
    window.addEventListener("focus", handleUserUpdated);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("empire-user-updated", handleUserUpdated);
      window.removeEventListener("focus", handleUserUpdated);
    };
  }, []);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY || 0;

    const handleScroll = () => {
      if (scrollFrameRef.current) return;

      scrollFrameRef.current = window.requestAnimationFrame(() => {
        const isMobile = window.innerWidth <= 760;
        const currentY = window.scrollY || 0;
        const previousY = lastScrollYRef.current;
        const diff = currentY - previousY;

        if (!isMobile) {
          setMobileLift(0);
          lastScrollYRef.current = currentY;
          scrollFrameRef.current = null;
          return;
        }

        if (currentY <= 8) {
          setMobileLift(0);
          lastScrollYRef.current = currentY;
          scrollFrameRef.current = null;
          return;
        }

        if (Math.abs(diff) >= 1) {
          const nextTarget = clampNumber(
            targetLiftRef.current + diff * 1.05,
            0,
            178
          );

          setMobileLift(nextTarget);

          if (diff > 2) {
            setAdminOpen(false);
          }
        }

        lastScrollYRef.current = currentY;
        scrollFrameRef.current = null;
      });
    };

    const handleResize = () => {
      if (window.innerWidth > 760) {
        setMobileLift(0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      if (scrollFrameRef.current) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }

      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleCurrencyChange = (event) => {
    const nextCurrency = saveStoredCurrency(event.target.value);
    setSelectedCurrency(nextCurrency);
  };

  const handleLanguageChange = (event) => {
    const nextLanguage = saveStoredLanguage(event.target.value);
    setSelectedLanguage(nextLanguage);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setAdminOpen(false);

    navigate("/login");
  };

  const closeAdminDropdown = () => {
    if (adminCloseTimerRef.current) {
      clearTimeout(adminCloseTimerRef.current);
    }

    setAdminOpen(false);
  };

  const openAdminDropdown = () => {
    if (adminCloseTimerRef.current) {
      clearTimeout(adminCloseTimerRef.current);
    }

    setAdminOpen(true);
  };

  const delayedCloseAdminDropdown = () => {
    if (adminCloseTimerRef.current) {
      clearTimeout(adminCloseTimerRef.current);
    }

    adminCloseTimerRef.current = setTimeout(() => {
      setAdminOpen(false);
    }, 180);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        adminDropdownRef.current &&
        !adminDropdownRef.current.contains(event.target)
      ) {
        setAdminOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setAdminOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);

      if (adminCloseTimerRef.current) {
        clearTimeout(adminCloseTimerRef.current);
      }
    };
  }, []);

  const navLinkClass = ({ isActive }) =>
    isActive ? "navItem navItemActive" : "navItem";

  const adminMenuStyle = adminOpen
    ? {
        opacity: 1,
        visibility: "visible",
        transform: "translateY(0) scale(1)",
        pointerEvents: "auto",
      }
    : {
        pointerEvents: "none",
      };

  const topbarSelectBoxStyle = {
    height: "42px",
    minHeight: "42px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "0 9px 0 11px",
    borderRadius: "999px",
    border: "1px solid rgba(147, 197, 253, 0.18)",
    background:
      "radial-gradient(circle at 20% 0%, rgba(255,255,255,0.12), transparent 42%), linear-gradient(135deg, rgba(15,23,42,0.82), rgba(2,6,23,0.62))",
    boxShadow:
      "0 14px 34px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06)",
    boxSizing: "border-box",
  };

  const topbarSelectWrapStyle = {
    position: "relative",
    height: "30px",
    minWidth: "82px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const topbarSelectStyle = {
    width: "82px",
    height: "30px",
    lineHeight: "30px",
    border: "0",
    outline: "none",
    borderRadius: "999px",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 950,
    fontSize: "12px",
    background:
      "linear-gradient(135deg, rgba(37,99,235,0.55), rgba(14,165,233,0.22))",
    padding: "0 28px 0 13px",
    margin: 0,
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    boxSizing: "border-box",
    display: "block",
    textAlign: "left",
    textAlignLast: "left",
    verticalAlign: "middle",
  };

  const topbarArrowStyle = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "rgba(219, 234, 254, 0.86)",
    fontSize: "9px",
    fontWeight: 950,
    pointerEvents: "none",
    lineHeight: 1,
  };

  const topbarFlagStyle = {
    width: "27px",
    height: "27px",
    minWidth: "27px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "999px",
    fontSize: "14px",
    lineHeight: "27px",
    background:
      "radial-gradient(circle at 35% 25%, rgba(255,255,255,0.26), transparent 38%), linear-gradient(135deg, rgba(37,99,235,0.5), rgba(14,165,233,0.2))",
    boxShadow:
      "0 0 18px rgba(56,189,248,0.12), inset 0 1px 0 rgba(255,255,255,0.12)",
  };

  return (
    <div>
      <MobileTopbarStyles />

      <nav
        ref={navbarRef}
        className="navbar premiumNavbar mobileCinemaTopbar"
        style={{
          overflow: "visible",
          "--mobile-topbar-lift": "0px",
          "--mobile-topbar-alpha": "1",
          "--mobile-topbar-shadow": "1",
        }}
      >
        <div className="topbarFloatLayer" aria-hidden="true">
          {topbarFloatItems.map((item) => (
            <span
              className={`topbarFloatItem ${item.className}`}
              key={`${item.className}-${item.label}`}
            >
              <b>{item.icon}</b>
              <em>{item.label}</em>
            </span>
          ))}
        </div>

        <Link to="/" className="logo premiumLogo" onClick={closeAdminDropdown}>
          <span className="logoImageWrap">
            <img
              src="/EmpireBoostLogo.png"
              alt="EmpireBoost logo"
              className="logoImage"
            />
          </span>

          <span className="logoText">EmpireBoost</span>
        </Link>

        <div className="navlinks premiumNavlinks">
          {isLoggedIn && (
            <>
              <Link
                to="/wallet"
                className="navBalancePill"
                onClick={closeAdminDropdown}
                title={`Real balance is stored in ${BASE_CURRENCY}. ${currencyRateText}`}
              >
                <span className="navBalanceIcon">
                  {selectedCurrencyMeta.symbol === "CHF"
                    ? "₣"
                    : selectedCurrencyMeta.symbol === "RSD"
                      ? "R"
                      : selectedCurrencyMeta.symbol}
                </span>

                <span className="navBalanceText">
                  <small>{t.balance}</small>
                  <strong>{displayedBalance}</strong>
                </span>
              </Link>

              <div
                className="navCurrencyBox"
                style={topbarSelectBoxStyle}
                title={currencyRateText}
              >
                <span style={topbarFlagStyle}>{selectedCurrencyMeta.flag}</span>

                <span style={topbarSelectWrapStyle}>
                  <select
                    className="navCurrencySelect"
                    style={topbarSelectStyle}
                    value={selectedCurrency}
                    onChange={handleCurrencyChange}
                    aria-label="Select display currency"
                  >
                    {SUPPORTED_CURRENCIES.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code}
                      </option>
                    ))}
                  </select>

                  <span style={topbarArrowStyle}>▼</span>
                </span>

                {currencyLoading && (
                  <span
                    style={{
                      color: "#93c5fd",
                      fontSize: "10px",
                      fontWeight: 950,
                      lineHeight: 1,
                    }}
                  >
                    ↻
                  </span>
                )}
              </div>
            </>
          )}

          <div
            className="navLanguageBox"
            style={topbarSelectBoxStyle}
            title={t.languageTitle}
          >
            <span style={topbarFlagStyle}>{selectedLanguageMeta.flag}</span>

            <span style={topbarSelectWrapStyle}>
              <select
                className="navLanguageSelect"
                style={topbarSelectStyle}
                value={selectedLanguage}
                onChange={handleLanguageChange}
                aria-label="Select website language"
              >
                {SUPPORTED_LANGUAGES.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.short}
                  </option>
                ))}
              </select>

              <span style={topbarArrowStyle}>▼</span>
            </span>
          </div>

          <NavLink
            to="/services"
            className={navLinkClass}
            onClick={closeAdminDropdown}
          >
            <span className="navIcon">⚡</span>
            <span>{t.services}</span>
          </NavLink>

          {isLoggedIn && (
            <>
              <NavLink
                to="/dashboard"
                className={navLinkClass}
                onClick={closeAdminDropdown}
              >
                <span className="navIcon">◆</span>
                <span>{t.dashboard}</span>
              </NavLink>

              <NavLink
                to="/wallet"
                className={navLinkClass}
                onClick={closeAdminDropdown}
              >
                <span className="navIcon">◈</span>
                <span>{t.wallet}</span>
              </NavLink>

              <NavLink
                to="/orders"
                className={navLinkClass}
                onClick={closeAdminDropdown}
              >
                <span className="navIcon">▣</span>
                <span>{t.orders}</span>
              </NavLink>

              <NavLink
                to="/transactions"
                className={navLinkClass}
                onClick={closeAdminDropdown}
              >
                <span className="navIcon">↗</span>
                <span>{t.transactions}</span>
              </NavLink>
            </>
          )}

          <NavLink
            to="/faq"
            className={navLinkClass}
            onClick={closeAdminDropdown}
          >
            <span className="navIcon">?</span>
            <span>{t.faq}</span>
          </NavLink>

          <NavLink
            to="/support"
            className={navLinkClass}
            onClick={closeAdminDropdown}
          >
            <span className="navIcon">✦</span>
            <span>{t.support}</span>
          </NavLink>

          {isLoggedIn && isAdmin && (
            <div
              className={`adminDropdown ${adminOpen ? "adminDropdownOpen" : ""}`}
              ref={adminDropdownRef}
              onMouseEnter={openAdminDropdown}
              onMouseLeave={delayedCloseAdminDropdown}
            >
              <button
                className="adminDropdownButton"
                type="button"
                onClick={() => setAdminOpen((current) => !current)}
                aria-expanded={adminOpen}
                aria-haspopup="true"
              >
                <span className="navIcon">⬢</span>
                <span>{t.admin}</span>
                <span className="adminArrow">{adminOpen ? "▴" : "▾"}</span>
              </button>

              <div
                className="adminDropdownMenu"
                style={adminMenuStyle}
                onMouseEnter={openAdminDropdown}
                onMouseLeave={delayedCloseAdminDropdown}
              >
                <NavLink
                  to="/admin/services"
                  className={navLinkClass}
                  onClick={closeAdminDropdown}
                >
                  <span className="navIcon">⚙</span>
                  <span>{t.adminServices}</span>
                </NavLink>

                <NavLink
                  to="/admin/orders"
                  className={navLinkClass}
                  onClick={closeAdminDropdown}
                >
                  <span className="navIcon">▣</span>
                  <span>{t.adminOrders}</span>
                </NavLink>

                <NavLink
                  to="/admin/users"
                  className={navLinkClass}
                  onClick={closeAdminDropdown}
                >
                  <span className="navIcon">◉</span>
                  <span>{t.adminUsers}</span>
                </NavLink>

                <NavLink
                  to="/admin/deposits"
                  className={navLinkClass}
                  onClick={closeAdminDropdown}
                >
                  <span className="navIcon">◆</span>
                  <span>{t.adminDeposits}</span>
                </NavLink>

                <NavLink
                  to="/admin/transactions"
                  className={navLinkClass}
                  onClick={closeAdminDropdown}
                >
                  <span className="navIcon">↗</span>
                  <span>{t.adminTransactions}</span>
                </NavLink>

                <NavLink
                  to="/admin/support"
                  className={navLinkClass}
                  onClick={closeAdminDropdown}
                >
                  <span className="navIcon">✦</span>
                  <span>{t.adminSupport}</span>
                </NavLink>

                <NavLink
                  to="/admin/promo-codes"
                  className={navLinkClass}
                  onClick={closeAdminDropdown}
                >
                  <span className="navIcon">%</span>
                  <span>{t.promoCodes}</span>
                </NavLink>

                <NavLink
                  to="/admin/settings"
                  className={navLinkClass}
                  onClick={closeAdminDropdown}
                >
                  <span className="navIcon">⚙</span>
                  <span>{t.settings}</span>
                </NavLink>
              </div>
            </div>
          )}

          {!isLoggedIn ? (
            <div className="navAuthGroup">
              <NavLink
                to="/login"
                className="navLoginButton"
                onClick={closeAdminDropdown}
              >
                <span className="navIcon">→</span>
                <span>{t.login}</span>
              </NavLink>

              <NavLink
                to="/register"
                className="navRegisterButton"
                onClick={closeAdminDropdown}
              >
                <span className="navIcon">+</span>
                <span>{t.register}</span>
              </NavLink>
            </div>
          ) : (
            <button className="navLogoutButton" onClick={logout} type="button">
              <span className="navIcon">×</span>
              <span>{t.logout}</span>
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/services" element={<Services />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/support" element={<Support />} />

        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/imprint" element={<Imprint />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/deposits" element={<AdminDeposits />} />
        <Route path="/admin/transactions" element={<AdminTransactions />} />
        <Route path="/admin/support" element={<AdminSupport />} />
        <Route path="/admin/promo-codes" element={<AdminPromoCodes />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>

      <Footer translations={t} />
    </div>
  );
}

function MobileTopbarStyles() {
  return (
    <style>
      {`
        @media (min-width: 761px) {
          .mobileCinemaTopbar {
            transform: translateY(0) !important;
          }
        }

        @media (max-width: 760px) {
          body {
            scroll-behavior: auto !important;
          }

          .mobileCinemaTopbar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 999999 !important;
            width: 100% !important;
            min-height: auto !important;
            padding: 7px 8px 8px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            gap: 5px !important;
            overflow: hidden !important;
            transform: translate3d(0, calc(var(--mobile-topbar-lift, 0px) * -1), 0) !important;
            opacity: var(--mobile-topbar-alpha, 1) !important;
            will-change: transform !important;
            contain: layout paint style !important;
            background:
              radial-gradient(circle at 12% 0%, rgba(56, 189, 248, 0.18), transparent 38%),
              radial-gradient(circle at 88% 10%, rgba(96, 165, 250, 0.14), transparent 38%),
              linear-gradient(180deg, rgba(5, 12, 25, 0.988), rgba(3, 8, 18, 0.974)) !important;
            border-bottom: 1px solid rgba(147, 197, 253, 0.15) !important;
            box-shadow:
              0 calc(14px * var(--mobile-topbar-shadow, 1)) calc(34px * var(--mobile-topbar-shadow, 1)) rgba(0, 0, 0, 0.42),
              0 0 calc(26px * var(--mobile-topbar-shadow, 1)) rgba(37, 99, 235, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.055) !important;
            backdrop-filter: blur(18px) saturate(145%) !important;
            -webkit-backdrop-filter: blur(18px) saturate(145%) !important;
          }

          body:has(.mobileCinemaTopbar) {
            padding-top: 154px !important;
          }

          .mobileCinemaTopbar::before {
            opacity: 0.22 !important;
          }

          .mobileCinemaTopbar::after {
            opacity: 0.12 !important;
          }

          .mobileCinemaTopbar .topbarFloatLayer {
            display: block !important;
            position: absolute !important;
            inset: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            opacity: 0.42 !important;
            overflow: hidden !important;
            pointer-events: none !important;
            z-index: 0 !important;
            mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%) !important;
            -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%) !important;
          }

          .mobileCinemaTopbar .topbarFloatLayer::before {
            display: none !important;
          }

          .mobileCinemaTopbar .topbarFloatItem {
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            height: 22px !important;
            padding: 4px 7px !important;
            gap: 5px !important;
            opacity: 0 !important;
            border-radius: 999px !important;
            border-color: rgba(147, 197, 253, 0.08) !important;
            background:
              radial-gradient(circle at 18% 0%, rgba(255, 255, 255, 0.1), transparent 42%),
              linear-gradient(135deg, rgba(15, 23, 42, 0.36), rgba(2, 6, 23, 0.18)) !important;
            box-shadow:
              0 8px 18px rgba(0, 0, 0, 0.15),
              0 0 12px rgba(96, 165, 250, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.035) !important;
            animation-name: mobileTopbarLivingFloat !important;
            animation-timing-function: cubic-bezier(0.42, 0, 0.25, 1) !important;
            animation-iteration-count: infinite !important;
          }

          .mobileCinemaTopbar .topbarFloatItem b {
            width: 15px !important;
            height: 15px !important;
            min-width: 15px !important;
            font-size: 8px !important;
          }

          .mobileCinemaTopbar .topbarFloatItem em {
            font-size: 8px !important;
            letter-spacing: 0.35px !important;
            color: rgba(239, 246, 255, 0.52) !important;
          }

          @keyframes mobileTopbarLivingFloat {
            0% {
              opacity: 0;
              transform:
                translate(-50%, -50%)
                translate(var(--m-start-x), var(--m-start-y))
                scale(0.62)
                rotate(calc(var(--m-rot) * -1));
              filter: blur(5px) brightness(0.38);
            }

            15% {
              opacity: 0.22;
              filter: blur(2px) brightness(0.76);
            }

            38% {
              opacity: 0.48;
              transform:
                translate(-50%, -50%)
                translate(
                  calc(var(--m-start-x) * 0.35 + var(--m-wander-x)),
                  calc(var(--m-start-y) * 0.35 + var(--m-wander-y))
                )
                scale(0.88)
                rotate(var(--m-rot));
              filter: blur(0.4px) brightness(0.96);
            }

            66% {
              opacity: 0.31;
              transform:
                translate(-50%, -50%)
                translate(
                  calc(var(--m-end-x) * 0.45 + var(--m-wander2-x)),
                  calc(var(--m-end-y) * 0.45 + var(--m-wander2-y))
                )
                scale(0.76)
                rotate(calc(var(--m-rot) * 1.6));
              filter: blur(1.7px) brightness(0.72);
            }

            100% {
              opacity: 0;
              transform:
                translate(-50%, -50%)
                translate(var(--m-end-x), var(--m-end-y))
                scale(0.46)
                rotate(calc(var(--m-rot) * 2.2));
              filter: blur(6px) brightness(0.24);
            }
          }

          .mobileCinemaTopbar .topbarFloatOne {
            --m-start-x: -170px;
            --m-start-y: -36px;
            --m-wander-x: 28px;
            --m-wander-y: 18px;
            --m-wander2-x: -24px;
            --m-wander2-y: -8px;
            --m-end-x: 150px;
            --m-end-y: 42px;
            --m-rot: -8deg;
            animation-duration: 18s !important;
            animation-delay: -2s !important;
          }

          .mobileCinemaTopbar .topbarFloatTwo {
            --m-start-x: 170px;
            --m-start-y: -42px;
            --m-wander-x: -32px;
            --m-wander-y: 20px;
            --m-wander2-x: 20px;
            --m-wander2-y: -18px;
            --m-end-x: -160px;
            --m-end-y: 38px;
            --m-rot: 7deg;
            animation-duration: 21s !important;
            animation-delay: -8s !important;
          }

          .mobileCinemaTopbar .topbarFloatThree {
            --m-start-x: -190px;
            --m-start-y: 12px;
            --m-wander-x: 36px;
            --m-wander-y: -19px;
            --m-wander2-x: -18px;
            --m-wander2-y: 23px;
            --m-end-x: 175px;
            --m-end-y: -30px;
            --m-rot: 10deg;
            animation-duration: 20s !important;
            animation-delay: -13s !important;
          }

          .mobileCinemaTopbar .topbarFloatFour {
            --m-start-x: 190px;
            --m-start-y: 18px;
            --m-wander-x: -28px;
            --m-wander-y: -22px;
            --m-wander2-x: 24px;
            --m-wander2-y: 18px;
            --m-end-x: -180px;
            --m-end-y: -34px;
            --m-rot: -10deg;
            animation-duration: 23s !important;
            animation-delay: -16s !important;
          }

          .mobileCinemaTopbar .topbarFloatFive {
            --m-start-x: -145px;
            --m-start-y: 44px;
            --m-wander-x: 30px;
            --m-wander-y: -28px;
            --m-wander2-x: -30px;
            --m-wander2-y: 14px;
            --m-end-x: 130px;
            --m-end-y: -46px;
            --m-rot: 6deg;
            animation-duration: 19s !important;
            animation-delay: -5s !important;
          }

          .mobileCinemaTopbar .topbarFloatSix {
            --m-start-x: 145px;
            --m-start-y: 46px;
            --m-wander-x: -24px;
            --m-wander-y: -30px;
            --m-wander2-x: 28px;
            --m-wander2-y: 15px;
            --m-end-x: -135px;
            --m-end-y: -48px;
            --m-rot: -6deg;
            animation-duration: 22s !important;
            animation-delay: -11s !important;
          }

          .mobileCinemaTopbar .topbarFloatSeven {
            --m-start-x: -70px;
            --m-start-y: -55px;
            --m-wander-x: 36px;
            --m-wander-y: 34px;
            --m-wander2-x: -18px;
            --m-wander2-y: -28px;
            --m-end-x: 82px;
            --m-end-y: 54px;
            --m-rot: 8deg;
            animation-duration: 24s !important;
            animation-delay: -17s !important;
          }

          .mobileCinemaTopbar .topbarFloatEight {
            --m-start-x: 82px;
            --m-start-y: -54px;
            --m-wander-x: -38px;
            --m-wander-y: 30px;
            --m-wander2-x: 20px;
            --m-wander2-y: -26px;
            --m-end-x: -92px;
            --m-end-y: 52px;
            --m-rot: -8deg;
            animation-duration: 25s !important;
            animation-delay: -20s !important;
          }

          .mobileCinemaTopbar .topbarFloatNine,
          .mobileCinemaTopbar .topbarFloatTen,
          .mobileCinemaTopbar .topbarFloatEleven,
          .mobileCinemaTopbar .topbarFloatTwelve,
          .mobileCinemaTopbar .topbarFloatThirteen,
          .mobileCinemaTopbar .topbarFloatFourteen,
          .mobileCinemaTopbar .topbarFloatFifteen,
          .mobileCinemaTopbar .topbarFloatSixteen,
          .mobileCinemaTopbar .topbarFloatSeventeen,
          .mobileCinemaTopbar .topbarFloatEighteen,
          .mobileCinemaTopbar .topbarFloatNineteen,
          .mobileCinemaTopbar .topbarFloatTwenty {
            display: none !important;
          }

          .mobileCinemaTopbar .premiumLogo,
          .mobileCinemaTopbar .logo {
            position: relative !important;
            z-index: 3 !important;
            width: 100% !important;
            max-width: 310px !important;
            height: 35px !important;
            min-height: 35px !important;
            padding: 0 8px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 7px !important;
            border-radius: 16px !important;
            background:
              radial-gradient(circle at 20% 0%, rgba(255, 255, 255, 0.08), transparent 42%),
              linear-gradient(135deg, rgba(15, 23, 42, 0.58), rgba(2, 6, 23, 0.28)) !important;
            border: 1px solid rgba(147, 197, 253, 0.11) !important;
            box-shadow:
              0 9px 20px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.04) !important;
          }

          .mobileCinemaTopbar .logoImageWrap {
            width: 27px !important;
            height: 27px !important;
            min-width: 27px !important;
            border-radius: 10px !important;
          }

          .mobileCinemaTopbar .logoImage {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
          }

          .mobileCinemaTopbar .logoText {
            font-size: 13px !important;
            line-height: 1 !important;
            letter-spacing: 0.48px !important;
            max-width: 175px !important;
            overflow: hidden !important;
            white-space: nowrap !important;
            text-overflow: ellipsis !important;
          }

          .mobileCinemaTopbar .premiumNavlinks,
          .mobileCinemaTopbar .navlinks {
            position: relative !important;
            z-index: 3 !important;
            width: 100% !important;
            max-width: 338px !important;
            margin: 0 auto !important;
            padding: 5px !important;
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 4px !important;
            border-radius: 18px !important;
            background:
              radial-gradient(circle at 50% 0%, rgba(96, 165, 250, 0.09), transparent 52%),
              rgba(2, 6, 23, 0.5) !important;
            border: 1px solid rgba(148, 163, 184, 0.12) !important;
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.04),
              0 10px 24px rgba(0, 0, 0, 0.18) !important;
          }

          .mobileCinemaTopbar .navAuthGroup {
            display: contents !important;
          }

          .mobileCinemaTopbar .navItem,
          .mobileCinemaTopbar .adminDropdownButton,
          .mobileCinemaTopbar .navLogoutButton,
          .mobileCinemaTopbar .navLoginButton,
          .mobileCinemaTopbar .navRegisterButton {
            width: 100% !important;
            min-width: 0 !important;
            height: 30px !important;
            min-height: 30px !important;
            padding: 0 7px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 5px !important;
            border-radius: 14px !important;
            font-size: 10.5px !important;
            line-height: 1 !important;
            white-space: nowrap !important;
          }

          .mobileCinemaTopbar .navItem span:last-child,
          .mobileCinemaTopbar .adminDropdownButton span:nth-child(2),
          .mobileCinemaTopbar .navLogoutButton span:last-child,
          .mobileCinemaTopbar .navLoginButton span:last-child,
          .mobileCinemaTopbar .navRegisterButton span:last-child {
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
          }

          .mobileCinemaTopbar .navIcon {
            width: 18px !important;
            height: 18px !important;
            min-width: 18px !important;
            font-size: 8.5px !important;
          }

          .mobileCinemaTopbar .navBalancePill {
            grid-column: 1 / -1 !important;
            width: 100% !important;
            height: 32px !important;
            min-height: 32px !important;
            margin: 0 !important;
            padding: 0 9px !important;
            justify-content: center !important;
            border-radius: 16px !important;
          }

          .mobileCinemaTopbar .navBalanceIcon {
            width: 21px !important;
            height: 21px !important;
            min-width: 21px !important;
            font-size: 10px !important;
          }

          .mobileCinemaTopbar .navBalanceText {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 5px !important;
          }

          .mobileCinemaTopbar .navBalanceText small {
            display: inline-flex !important;
            font-size: 7.5px !important;
          }

          .mobileCinemaTopbar .navBalanceText strong {
            font-size: 10.5px !important;
          }

          .mobileCinemaTopbar .navCurrencyBox,
          .mobileCinemaTopbar .navLanguageBox {
            width: 100% !important;
            height: 30px !important;
            min-height: 30px !important;
            padding: 0 6px !important;
            border-radius: 14px !important;
            justify-content: center !important;
            gap: 5px !important;
          }

          .mobileCinemaTopbar .navCurrencySelect,
          .mobileCinemaTopbar .navLanguageSelect {
            width: 66px !important;
            height: 24px !important;
            line-height: 24px !important;
            font-size: 10px !important;
            padding-left: 9px !important;
          }

          .mobileCinemaTopbar .adminDropdown {
            width: 100% !important;
            position: relative !important;
          }

          .mobileCinemaTopbar .adminDropdownMenu {
            position: absolute !important;
            top: calc(100% + 6px) !important;
            left: 50% !important;
            right: auto !important;
            width: min(310px, 92vw) !important;
            transform-origin: top center !important;
            transform: translateX(-50%) translateY(10px) scale(0.98) !important;
            z-index: 9999999 !important;
            padding: 9px !important;
            border-radius: 20px !important;
          }

          .mobileCinemaTopbar .adminDropdownMenu[style*="opacity: 1"] {
            transform: translateX(-50%) translateY(0) scale(1) !important;
          }

          .mobileCinemaTopbar .adminDropdownMenu .navItem {
            justify-content: flex-start !important;
          }
        }

        @media (max-width: 420px) {
          body:has(.mobileCinemaTopbar) {
            padding-top: 146px !important;
          }

          .mobileCinemaTopbar {
            padding: 6px 6px 7px !important;
            gap: 4px !important;
          }

          .mobileCinemaTopbar .premiumLogo,
          .mobileCinemaTopbar .logo {
            max-width: 300px !important;
            height: 33px !important;
            min-height: 33px !important;
          }

          .mobileCinemaTopbar .logoText {
            font-size: 12.5px !important;
          }

          .mobileCinemaTopbar .premiumNavlinks,
          .mobileCinemaTopbar .navlinks {
            max-width: 318px !important;
            padding: 5px !important;
            gap: 4px !important;
            border-radius: 17px !important;
          }

          .mobileCinemaTopbar .navItem,
          .mobileCinemaTopbar .adminDropdownButton,
          .mobileCinemaTopbar .navLogoutButton,
          .mobileCinemaTopbar .navLoginButton,
          .mobileCinemaTopbar .navRegisterButton {
            height: 29px !important;
            min-height: 29px !important;
            font-size: 10px !important;
            padding: 0 6px !important;
          }

          .mobileCinemaTopbar .navIcon {
            width: 17px !important;
            height: 17px !important;
            min-width: 17px !important;
            font-size: 8px !important;
          }

          .mobileCinemaTopbar .navBalancePill {
            height: 31px !important;
            min-height: 31px !important;
          }

          .mobileCinemaTopbar .navCurrencyBox,
          .mobileCinemaTopbar .navLanguageBox {
            height: 29px !important;
            min-height: 29px !important;
          }
        }
      `}
    </style>
  );
}

function Footer({ translations }) {
  return (
    <footer className="footer">
      <div>
        <strong>EmpireBoost</strong>
        <p>{translations.footerText}</p>
      </div>

      <div className="footerLinks">
        <Link to="/terms">{translations.terms}</Link>
        <Link to="/privacy">{translations.privacy}</Link>
        <Link to="/refund-policy">{translations.refundPolicy}</Link>
        <Link to="/cookie-policy">{translations.cookiePolicy}</Link>
        <Link to="/imprint">{translations.imprint}</Link>
        <Link to="/disclaimer">{translations.disclaimer}</Link>
        <Link to="/contact">{translations.contact}</Link>
      </div>
    </footer>
  );
}

export default App;