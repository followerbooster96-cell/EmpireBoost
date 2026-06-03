import { useEffect, useRef, useState } from "react";
import {
  Link,
  Navigate,
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

function unlockDocumentScroll() {
  if (typeof document === "undefined") return;

  document.body.classList.remove("empireMobileMenuLocked");

  document.body.style.overflow = "";
  document.body.style.overflowX = "";
  document.body.style.overflowY = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.body.style.height = "";
  document.body.style.touchAction = "";

  document.documentElement.style.overflow = "";
  document.documentElement.style.overflowX = "";
  document.documentElement.style.overflowY = "";
  document.documentElement.style.position = "";
  document.documentElement.style.height = "";
  document.documentElement.style.touchAction = "";
}

function lockDocumentScroll() {
  if (typeof document === "undefined") return;

  document.body.classList.add("empireMobileMenuLocked");
}

function getStoredUser() {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const adminDropdownRef = useRef(null);
  const adminCloseTimerRef = useRef(null);

  const [adminOpen, setAdminOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setAdminOpen(false);
    setMobileMenuOpen(false);
    unlockDocumentScroll();

    window.requestAnimationFrame(() => {
      unlockDocumentScroll();
    });

    const firstUnlockTimer = window.setTimeout(() => {
      unlockDocumentScroll();
    }, 80);

    const secondUnlockTimer = window.setTimeout(() => {
      unlockDocumentScroll();
    }, 250);

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    return () => {
      window.clearTimeout(firstUnlockTimer);
      window.clearTimeout(secondUnlockTimer);
    };
  }, [location.pathname, location.search, location.hash]);

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
    if (!mobileMenuOpen) {
      unlockDocumentScroll();
      return;
    }

    lockDocumentScroll();

    return () => {
      unlockDocumentScroll();
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    return () => {
      unlockDocumentScroll();

      if (adminCloseTimerRef.current) {
        clearTimeout(adminCloseTimerRef.current);
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
    setMobileMenuOpen(false);
    unlockDocumentScroll();

    navigate("/login", { replace: true });
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
    }, 220);
  };

  const closeMobileMenu = () => {
    setAdminOpen(false);
    setMobileMenuOpen(false);
    unlockDocumentScroll();

    window.requestAnimationFrame(() => {
      unlockDocumentScroll();
    });

    window.setTimeout(() => {
      unlockDocumentScroll();
    }, 120);
  };

  const toggleMobileMenu = () => {
    setAdminOpen(false);

    setMobileMenuOpen((current) => {
      if (current) {
        unlockDocumentScroll();
        return false;
      }

      lockDocumentScroll();
      return true;
    });
  };

  const goToSupportOrLogin = (event) => {
    event.preventDefault();

    closeMobileMenu();

    if (!isLoggedIn) {
      navigate("/login", { replace: true });
      return;
    }

    navigate("/support");
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
        setMobileMenuOpen(false);
        unlockDocumentScroll();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, {
      passive: true,
    });
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);

      if (adminCloseTimerRef.current) {
        clearTimeout(adminCloseTimerRef.current);
      }

      unlockDocumentScroll();
    };
  }, []);

  const navLinkClass = ({ isActive }) =>
    isActive ? "navItem navItemActive" : "navItem";

  const protectedSupportLinkClass = ({ isActive }) => {
    if (!isLoggedIn) {
      return "navItem";
    }

    return isActive ? "navItem navItemActive" : "navItem";
  };

  const adminMenuStyle = adminOpen
    ? {
        opacity: 1,
        visibility: "visible",
        transform: "translateY(0) scale(1)",
        pointerEvents: "auto",
      }
    : {
        opacity: 0,
        visibility: "hidden",
        transform: "translateY(8px) scale(0.97)",
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

  const appShellClass = [
    "empireAppShell",
    isLoggedIn ? "empireAppLoggedIn" : "empireAppGuest",
    isAdmin ? "empireAppAdmin" : "",
    mobileMenuOpen ? "mobileMenuIsOpen" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={appShellClass}>
      <MobileTopbarStyles />

      <nav className="navbar premiumNavbar desktopNavbar">
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

        <Link to="/" className="logo premiumLogo" onClick={closeMobileMenu}>
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
                onClick={closeMobileMenu}
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

          <NavLink to="/services" className={navLinkClass}>
            <span className="navIcon">⚡</span>
            <span>{t.services}</span>
          </NavLink>

          {isLoggedIn && (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                <span className="navIcon">◆</span>
                <span>{t.dashboard}</span>
              </NavLink>

              <NavLink to="/wallet" className={navLinkClass}>
                <span className="navIcon">◈</span>
                <span>{t.wallet}</span>
              </NavLink>

              <NavLink to="/orders" className={navLinkClass}>
                <span className="navIcon">▣</span>
                <span>{t.orders}</span>
              </NavLink>

              <NavLink to="/transactions" className={navLinkClass}>
                <span className="navIcon">↗</span>
                <span>{t.transactions}</span>
              </NavLink>
            </>
          )}

          <NavLink to="/faq" className={navLinkClass}>
            <span className="navIcon">?</span>
            <span>{t.faq}</span>
          </NavLink>

          <NavLink
            to={isLoggedIn ? "/support" : "/login"}
            className={protectedSupportLinkClass}
            onClick={goToSupportOrLogin}
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
              <NavLink to="/login" className="navLoginButton">
                <span className="navIcon">→</span>
                <span>{t.login}</span>
              </NavLink>

              <NavLink to="/register" className="navRegisterButton">
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

      <div className="mobileMenuDock">
        <Link to="/" className="mobileMenuBrand" onClick={closeMobileMenu}>
          <img src="/EmpireBoostLogo.png" alt="EmpireBoost logo" />
          <span>EmpireBoost</span>
        </Link>

        {isLoggedIn && (
          <Link
            to="/wallet"
            className="mobileMenuBalance"
            onClick={closeMobileMenu}
          >
            {displayedBalance}
          </Link>
        )}

        <button
          className={`mobileMenuButton ${
            mobileMenuOpen ? "mobileMenuButtonOpen" : ""
          }`}
          type="button"
          onClick={toggleMobileMenu}
          aria-label={
            mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileMenuOpen}
        >
          <span className="mobileMenuButtonIcon" aria-hidden="true">
            <i></i>
            <i></i>
            <i></i>
          </span>

          <strong>{mobileMenuOpen ? "Close" : "Menu"}</strong>
        </button>
      </div>

      <div
        className={`mobileMenuBackdrop ${
          mobileMenuOpen ? "mobileMenuBackdropOpen" : ""
        }`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      <aside
        className={`mobileMenuPanel ${
          mobileMenuOpen ? "mobileMenuPanelOpen" : ""
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobileMenuPanelGlow" aria-hidden="true" />

        <div className="mobileMenuPanelHeader">
          <div>
            <span>Navigation</span>
            <strong>EmpireBoost Control</strong>
            <small>Choose your next move</small>
          </div>

          <button type="button" onClick={closeMobileMenu} aria-label="Close menu">
            <span>×</span>
          </button>
        </div>

        {isLoggedIn && (
          <Link
            to="/wallet"
            className="mobileMenuWalletCard"
            onClick={closeMobileMenu}
            title={`Real balance is stored in ${BASE_CURRENCY}. ${currencyRateText}`}
          >
            <span>
              {selectedCurrencyMeta.symbol === "CHF"
                ? "₣"
                : selectedCurrencyMeta.symbol === "RSD"
                  ? "R"
                  : selectedCurrencyMeta.symbol}
            </span>

            <div>
              <small>{t.balance}</small>
              <strong>{displayedBalance}</strong>
            </div>
          </Link>
        )}

        {isLoggedIn && (
          <div className="mobileMenuSelectors">
            <label>
              <span className="mobileMenuSelectIcon">
                <em>{selectedCurrencyMeta.flag}</em>
              </span>

              <select
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
            </label>

            <label>
              <span className="mobileMenuSelectIcon">
                <em>{selectedLanguageMeta.flag}</em>
              </span>

              <select
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
            </label>
          </div>
        )}

        <div className="mobileMenuLinks">
          {!isLoggedIn && (
            <label className="mobileMenuSelectPill">
              <span className="mobileMenuSelectIcon">
                <em>{selectedLanguageMeta.flag}</em>
              </span>

              <select
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
            </label>
          )}

          {!isLoggedIn && (
            <NavLink to="/faq" className={navLinkClass} onClick={closeMobileMenu}>
              <span className="navIcon">?</span>
              <span>{t.faq}</span>
            </NavLink>
          )}

          <NavLink to="/services" className={navLinkClass} onClick={closeMobileMenu}>
            <span className="navIcon">⚡</span>
            <span>{t.services}</span>
          </NavLink>

          <NavLink
            to={isLoggedIn ? "/support" : "/login"}
            className={protectedSupportLinkClass}
            onClick={goToSupportOrLogin}
          >
            <span className="navIcon">✦</span>
            <span>{t.support}</span>
          </NavLink>

          {isLoggedIn && (
            <>
              <NavLink
                to="/dashboard"
                className={navLinkClass}
                onClick={closeMobileMenu}
              >
                <span className="navIcon">◆</span>
                <span>{t.dashboard}</span>
              </NavLink>

              <NavLink
                to="/wallet"
                className={navLinkClass}
                onClick={closeMobileMenu}
              >
                <span className="navIcon">◈</span>
                <span>{t.wallet}</span>
              </NavLink>

              <NavLink
                to="/orders"
                className={navLinkClass}
                onClick={closeMobileMenu}
              >
                <span className="navIcon">▣</span>
                <span>{t.orders}</span>
              </NavLink>

              <NavLink
                to="/transactions"
                className={navLinkClass}
                onClick={closeMobileMenu}
              >
                <span className="navIcon">↗</span>
                <span>{t.transactions}</span>
              </NavLink>

              <NavLink to="/faq" className={navLinkClass} onClick={closeMobileMenu}>
                <span className="navIcon">?</span>
                <span>{t.faq}</span>
              </NavLink>
            </>
          )}
        </div>

        {isLoggedIn && isAdmin && (
          <div className="mobileMenuAdminBlock">
            <span>Admin Area</span>

            <div>
              <NavLink
                to="/admin/services"
                className={navLinkClass}
                onClick={closeMobileMenu}
              >
                <span className="navIcon">⚙</span>
                <span>{t.adminServices}</span>
              </NavLink>

              <NavLink
                to="/admin/orders"
                className={navLinkClass}
                onClick={closeMobileMenu}
              >
                <span className="navIcon">▣</span>
                <span>{t.adminOrders}</span>
              </NavLink>

              <NavLink
                to="/admin/users"
                className={navLinkClass}
                onClick={closeMobileMenu}
              >
                <span className="navIcon">◉</span>
                <span>{t.adminUsers}</span>
              </NavLink>

              <NavLink
                to="/admin/deposits"
                className={navLinkClass}
                onClick={closeMobileMenu}
              >
                <span className="navIcon">◆</span>
                <span>{t.adminDeposits}</span>
              </NavLink>

              <NavLink
                to="/admin/transactions"
                className={navLinkClass}
                onClick={closeMobileMenu}
              >
                <span className="navIcon">↗</span>
                <span>{t.adminTransactions}</span>
              </NavLink>

              <NavLink
                to="/admin/support"
                className={navLinkClass}
                onClick={closeMobileMenu}
              >
                <span className="navIcon">✦</span>
                <span>{t.adminSupport}</span>
              </NavLink>

              <NavLink
                to="/admin/promo-codes"
                className={navLinkClass}
                onClick={closeMobileMenu}
              >
                <span className="navIcon">%</span>
                <span>{t.promoCodes}</span>
              </NavLink>

              <NavLink
                to="/admin/settings"
                className={navLinkClass}
                onClick={closeMobileMenu}
              >
                <span className="navIcon">⚙</span>
                <span>{t.settings}</span>
              </NavLink>
            </div>
          </div>
        )}

        <div className="mobileMenuAuthArea">
          {!isLoggedIn ? (
            <>
              <NavLink
                to="/login"
                className="navLoginButton"
                onClick={closeMobileMenu}
              >
                <span className="navIcon">→</span>
                <span>{t.login}</span>
              </NavLink>

              <NavLink
                to="/register"
                className="navRegisterButton"
                onClick={closeMobileMenu}
              >
                <span className="navIcon">+</span>
                <span>{t.register}</span>
              </NavLink>
            </>
          ) : (
            <button className="navLogoutButton" onClick={logout} type="button">
              <span className="navIcon">×</span>
              <span>{t.logout}</span>
            </button>
          )}
        </div>
      </aside>

      <div className="mobileTopbarSpacer" aria-hidden="true" />

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
        <Route
          path="/support"
          element={isLoggedIn ? <Support /> : <Navigate to="/login" replace />}
        />

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
        html {
          overflow-x: hidden;
          scroll-behavior: auto;
        }

        body {
          overflow-x: hidden;
          scroll-behavior: auto;
          -webkit-overflow-scrolling: touch;
        }

        .mobileTopbarSpacer,
        .mobileMenuDock,
        .mobileMenuBackdrop,
        .mobileMenuPanel {
          display: none;
        }

        body.empireMobileMenuLocked {
          overflow: hidden !important;
          touch-action: none !important;
          overscroll-behavior: none !important;
        }

        @media (min-width: 761px) {
          .premiumNavbar,
          .desktopNavbar,
          .navlinks,
          .premiumNavlinks {
            overflow: visible !important;
          }

          .premiumNavbar {
            position: sticky !important;
            top: 0 !important;
            z-index: 999999 !important;
            overflow: visible !important;
          }

          .premiumNavlinks {
            position: relative !important;
            z-index: 999999 !important;
          }

          .adminDropdown {
            position: relative !important;
            z-index: 1000000 !important;
            overflow: visible !important;
          }

          .adminDropdownButton {
            position: relative !important;
            z-index: 1000001 !important;
          }

          .adminDropdownMenu {
            position: absolute !important;
            top: calc(100% + 10px) !important;
            right: 0 !important;
            z-index: 1000002 !important;

            min-width: 250px !important;
            padding: 10px !important;
            border-radius: 20px !important;

            display: grid !important;
            gap: 7px !important;

            background:
              radial-gradient(circle at 20% 0%, rgba(96, 165, 250, 0.18), transparent 42%),
              linear-gradient(145deg, rgba(5, 12, 25, 0.98), rgba(2, 6, 23, 0.96)) !important;

            border: 1px solid rgba(147, 197, 253, 0.22) !important;

            box-shadow:
              0 28px 70px rgba(0, 0, 0, 0.58),
              0 0 42px rgba(56, 189, 248, 0.13),
              inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;

            backdrop-filter: blur(18px) saturate(145%) !important;
            -webkit-backdrop-filter: blur(18px) saturate(145%) !important;

            transition:
              opacity 0.18s ease,
              visibility 0.18s ease,
              transform 0.22s ease !important;
          }

          .adminDropdownOpen .adminDropdownMenu,
          .adminDropdown:hover .adminDropdownMenu {
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
            transform: translateY(0) scale(1) !important;
          }

          .adminDropdownMenu::before {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            top: -14px;
            height: 14px;
            background: transparent;
          }

          .adminDropdownMenu .navItem {
            width: 100% !important;
            min-height: 42px !important;
            justify-content: flex-start !important;
            border-radius: 14px !important;
            white-space: nowrap !important;
          }
        }

        @media (max-width: 760px) {
          html,
          body,
          #root {
            width: 100%;
            min-height: 100%;
            height: auto;
            overflow-x: hidden;
            overscroll-behavior-x: none;
            -webkit-overflow-scrolling: touch;
          }

          body {
            position: static !important;
            touch-action: pan-y !important;
            overflow-y: auto;
          }

          body.empireMobileMenuLocked {
            overflow: hidden !important;
            touch-action: none !important;
            overscroll-behavior: none !important;
          }

          body:not(.empireMobileMenuLocked) {
            overflow-y: auto !important;
            touch-action: pan-y !important;
          }

          .empireAppShell {
            width: 100%;
            min-height: 100%;
            overflow-x: hidden;
            overflow-y: visible;
          }

          .desktopNavbar {
            display: none !important;
          }

          .mobileTopbarSpacer {
            display: block;
            height: 82px;
            width: 100%;
            flex: 0 0 auto;
            pointer-events: none;
          }

          .mobileMenuDock {
            position: fixed;
            top: max(12px, calc(env(safe-area-inset-top) + 8px));
            left: 50%;
            z-index: 1000000;
            width: min(382px, calc(100% - 20px));
            min-height: 54px;
            padding: 7px;
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto auto;
            gap: 8px;
            align-items: center;
            border-radius: 999px;
            overflow: hidden;
            background:
              radial-gradient(circle at 18% 0%, rgba(255, 255, 255, 0.16), transparent 42%),
              radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.2), transparent 46%),
              radial-gradient(circle at 50% 120%, rgba(37, 99, 235, 0.18), transparent 44%),
              linear-gradient(135deg, rgba(5, 12, 25, 0.97), rgba(3, 8, 18, 0.93));
            border: 1px solid rgba(147, 197, 253, 0.22);
            box-shadow:
              0 18px 42px rgba(0, 0, 0, 0.44),
              0 0 30px rgba(56, 189, 248, 0.15),
              0 0 60px rgba(37, 99, 235, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.09);
            backdrop-filter: blur(16px) saturate(145%);
            -webkit-backdrop-filter: blur(16px) saturate(145%);
            transform: translate3d(-50%, 0, 0);
            will-change: transform;
            contain: paint;
          }

          .mobileMenuDock::before {
            content: "";
            position: absolute;
            inset: 0;
            pointer-events: none;
            background:
              linear-gradient(
                110deg,
                transparent 0%,
                transparent 32%,
                rgba(255, 255, 255, 0.11) 45%,
                rgba(56, 189, 248, 0.12) 50%,
                transparent 64%,
                transparent 100%
              );
            transform: translateX(-120%);
            animation: mobileDockScan 5.6s ease-in-out infinite;
          }

          .mobileMenuDock::after {
            content: "";
            position: absolute;
            left: 20px;
            right: 20px;
            bottom: -1px;
            height: 1px;
            pointer-events: none;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(96, 165, 250, 0.9),
              rgba(255, 255, 255, 0.38),
              rgba(14, 165, 233, 0.82),
              transparent
            );
            opacity: 0.85;
            filter: blur(0.2px);
          }

          @keyframes mobileDockScan {
            0% {
              transform: translateX(-125%);
              opacity: 0;
            }

            18% {
              opacity: 0.65;
            }

            42% {
              opacity: 0.28;
            }

            100% {
              transform: translateX(125%);
              opacity: 0;
            }
          }

          .mobileMenuBrand {
            position: relative;
            z-index: 2;
            min-width: 0;
            height: 40px;
            padding: 0 12px 0 7px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            border-radius: 999px;
            text-decoration: none;
            color: #ffffff;
            background:
              radial-gradient(circle at 20% 0%, rgba(255, 255, 255, 0.1), transparent 42%),
              linear-gradient(135deg, rgba(15, 23, 42, 0.66), rgba(2, 6, 23, 0.38));
            border: 1px solid rgba(147, 197, 253, 0.12);
            overflow: hidden;
          }

          .mobileMenuBrand img {
            width: 30px;
            height: 30px;
            min-width: 30px;
            object-fit: contain;
            border-radius: 999px;
            filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.18));
          }

          .mobileMenuBrand span {
            min-width: 0;
            display: block;
            color: #ffffff;
            font-size: 12.5px;
            font-weight: 950;
            letter-spacing: 0.48px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-shadow:
              0 0 14px rgba(255, 255, 255, 0.16),
              0 0 22px rgba(56, 189, 248, 0.12);
          }

          .mobileMenuBalance {
            position: relative;
            z-index: 2;
            height: 40px;
            max-width: 98px;
            padding: 0 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            text-decoration: none;
            color: #eaf5ff;
            font-size: 11px;
            font-weight: 950;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            background:
              radial-gradient(circle at 25% 0%, rgba(255, 255, 255, 0.14), transparent 42%),
              linear-gradient(135deg, rgba(37, 99, 235, 0.52), rgba(14, 165, 233, 0.18));
            border: 1px solid rgba(147, 197, 253, 0.16);
            box-shadow:
              0 10px 24px rgba(0, 0, 0, 0.22),
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
          }

          .mobileMenuButton {
            position: relative;
            z-index: 2;
            width: 92px;
            height: 40px;
            padding: 0 10px;
            border: 1px solid rgba(147, 197, 253, 0.18);
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            align-self: center;
            justify-self: end;
            gap: 7px;
            cursor: pointer;
            color: #ffffff;
            font-family: inherit;
            transform: translateY(1px);
            background:
              radial-gradient(circle at 25% 0%, rgba(255, 255, 255, 0.18), transparent 42%),
              linear-gradient(135deg, rgba(37, 99, 235, 0.82), rgba(14, 165, 233, 0.36));
            box-shadow:
              0 12px 28px rgba(0, 0, 0, 0.3),
              0 0 22px rgba(56, 189, 248, 0.12),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            transition:
              border-color 0.22s ease,
              filter 0.22s ease,
              transform 0.18s ease,
              background 0.22s ease;
          }

          .mobileMenuButton:active {
            transform: translateY(1px) scale(0.97);
            filter: brightness(1.08);
          }

          .mobileMenuButtonIcon {
            width: 22px;
            height: 22px;
            min-width: 22px;
            border-radius: 999px;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            background: rgba(255, 255, 255, 0.12);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
          }

          .mobileMenuButtonIcon i {
            width: 11px;
            height: 2px;
            border-radius: 999px;
            background: #ffffff;
            display: block;
            transition:
              transform 0.24s ease,
              opacity 0.18s ease,
              width 0.24s ease;
          }

          .mobileMenuButton strong {
            color: #ffffff;
            font-size: 10.5px;
            font-weight: 950;
            line-height: 1;
            letter-spacing: 0.22px;
            text-transform: uppercase;
            transform: translateY(0.5px);
            text-shadow:
              0 0 12px rgba(255, 255, 255, 0.18),
              0 0 22px rgba(56, 189, 248, 0.12);
          }

          .mobileMenuButtonOpen {
            border-color: rgba(191, 219, 254, 0.34);
            background:
              radial-gradient(circle at 25% 0%, rgba(255, 255, 255, 0.2), transparent 42%),
              linear-gradient(135deg, rgba(14, 165, 233, 0.82), rgba(79, 70, 229, 0.48));
          }

          .mobileMenuButtonOpen .mobileMenuButtonIcon i:nth-child(1) {
            width: 12px;
            transform: translateY(5px) rotate(45deg);
          }

          .mobileMenuButtonOpen .mobileMenuButtonIcon i:nth-child(2) {
            opacity: 0;
          }

          .mobileMenuButtonOpen .mobileMenuButtonIcon i:nth-child(3) {
            width: 12px;
            transform: translateY(-5px) rotate(-45deg);
          }

          .mobileMenuBackdrop {
            position: fixed;
            inset: 0;
            z-index: 999998;
            display: block;
            opacity: 0;
            pointer-events: none;
            background:
              radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.12), transparent 36%),
              rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(0px);
            -webkit-backdrop-filter: blur(0px);
            transition:
              opacity 0.24s ease,
              backdrop-filter 0.24s ease;
          }

          .mobileMenuBackdropOpen {
            opacity: 1;
            pointer-events: auto;
            backdrop-filter: blur(7px);
            -webkit-backdrop-filter: blur(7px);
          }

          .mobileMenuPanel {
            position: fixed;
            top: max(78px, calc(70px + env(safe-area-inset-top)));
            left: 50%;
            z-index: 999999;
            width: min(382px, calc(100% - 20px));
            max-height: calc(100svh - 98px - env(safe-area-inset-bottom));
            padding: 14px;
            display: grid;
            gap: 12px;
            overflow-y: auto;
            overscroll-behavior: contain;
            border-radius: 30px;
            opacity: 0;
            pointer-events: none;
            transform: translate3d(-50%, -12px, 0) scale(0.96);
            transform-origin: top center;
            background:
              radial-gradient(circle at 10% 0%, rgba(56, 189, 248, 0.2), transparent 42%),
              radial-gradient(circle at 90% 10%, rgba(37, 99, 235, 0.17), transparent 46%),
              radial-gradient(circle at 50% 105%, rgba(79, 70, 229, 0.14), transparent 48%),
              linear-gradient(145deg, rgba(5, 12, 25, 0.98), rgba(3, 8, 18, 0.95));
            border: 1px solid rgba(147, 197, 253, 0.2);
            box-shadow:
              0 26px 70px rgba(0, 0, 0, 0.56),
              0 0 38px rgba(56, 189, 248, 0.14),
              0 0 80px rgba(37, 99, 235, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(18px) saturate(145%);
            -webkit-backdrop-filter: blur(18px) saturate(145%);
            transition:
              opacity 0.24s ease,
              transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
          }

          .mobileMenuPanelOpen {
            opacity: 1;
            pointer-events: auto;
            transform: translate3d(-50%, 0, 0) scale(1);
          }

          .mobileMenuPanelGlow {
            position: absolute;
            inset: -80px -80px auto auto;
            width: 230px;
            height: 230px;
            border-radius: 999px;
            background:
              radial-gradient(circle, rgba(56, 189, 248, 0.18), transparent 64%);
            filter: blur(28px);
            pointer-events: none;
            animation: mobilePanelGlowBreath 4.8s ease-in-out infinite alternate;
          }

          @keyframes mobilePanelGlowBreath {
            from {
              opacity: 0.45;
              transform: scale(0.92);
            }

            to {
              opacity: 0.9;
              transform: scale(1.08);
            }
          }

          .mobileMenuPanelHeader {
            position: relative;
            z-index: 2;
            min-height: 58px;
            display: grid;
            grid-template-columns: 1fr 42px;
            align-items: center;
            gap: 10px;
            padding: 0 0 2px;
            text-align: center;
          }

          .mobileMenuPanelHeader > div {
            min-width: 0;
            width: 100%;
            display: grid;
            place-items: center;
            text-align: center;
            padding-left: 42px;
          }

          .mobileMenuPanelHeader span {
            display: block;
            color: #93c5fd;
            font-size: 10px;
            font-weight: 950;
            letter-spacing: 1.4px;
            text-transform: uppercase;
            text-shadow: 0 0 18px rgba(147, 197, 253, 0.18);
          }

          .mobileMenuPanelHeader strong {
            display: block;
            margin-top: 4px;
            color: #ffffff;
            font-size: 17px;
            font-weight: 950;
            letter-spacing: -0.35px;
            text-align: center;
            text-shadow:
              0 0 18px rgba(56, 189, 248, 0.16),
              0 2px 14px rgba(0, 0, 0, 0.36);
          }

          .mobileMenuPanelHeader small {
            display: block;
            margin-top: 4px;
            color: rgba(219, 234, 254, 0.62);
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.2px;
          }

          .mobileMenuPanelHeader button {
            width: 42px;
            height: 42px;
            border-radius: 999px;
            border: 1px solid rgba(147, 197, 253, 0.22);
            color: #ffffff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            align-self: center;
            justify-self: end;
            padding: 0;
            margin: 0;
            transform: translateY(7px);
            background:
              radial-gradient(circle at 25% 0%, rgba(255, 255, 255, 0.14), transparent 42%),
              linear-gradient(135deg, rgba(15, 23, 42, 0.82), rgba(2, 6, 23, 0.56));
            box-shadow:
              0 10px 22px rgba(0, 0, 0, 0.26),
              0 0 18px rgba(56, 189, 248, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.07);
            -webkit-tap-highlight-color: transparent;
          }

          .mobileMenuPanelHeader button span {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            color: #ffffff;
            font-size: 24px;
            font-weight: 900;
            line-height: 1;
            transform: translateY(0);
            text-shadow:
              0 0 12px rgba(255, 255, 255, 0.2),
              0 0 22px rgba(56, 189, 248, 0.18);
          }

          .mobileMenuWalletCard {
            position: relative;
            z-index: 2;
            padding: 13px;
            border-radius: 22px;
            display: grid;
            grid-template-columns: 46px minmax(0, 1fr);
            gap: 12px;
            align-items: center;
            text-decoration: none;
            background:
              radial-gradient(circle at 0% 0%, rgba(34, 197, 94, 0.11), transparent 42%),
              linear-gradient(145deg, rgba(2, 6, 23, 0.82), rgba(15, 23, 42, 0.62));
            border: 1px solid rgba(147, 197, 253, 0.13);
          }

          .mobileMenuWalletCard > span {
            width: 46px;
            height: 46px;
            border-radius: 18px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-weight: 950;
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.7), rgba(34, 197, 94, 0.35));
            box-shadow: 0 0 28px rgba(34, 197, 94, 0.14);
          }

          .mobileMenuWalletCard small {
            display: block;
            color: #93c5fd;
            font-size: 10px;
            font-weight: 950;
            letter-spacing: 0.8px;
            text-transform: uppercase;
          }

          .mobileMenuWalletCard strong {
            display: block;
            margin-top: 4px;
            color: #ffffff;
            font-size: 17px;
            font-weight: 950;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .mobileMenuSelectors {
            position: relative;
            z-index: 2;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }

          .mobileMenuSelectors label,
          .mobileMenuSelectPill {
            min-width: 0;
            height: 46px;
            padding: 0 10px;
            border-radius: 18px;
            display: grid;
            grid-template-columns: 30px minmax(0, 1fr);
            align-items: center;
            gap: 8px;
            background:
              radial-gradient(circle at 25% 0%, rgba(255, 255, 255, 0.1), transparent 42%),
              linear-gradient(135deg, rgba(2, 6, 23, 0.84), rgba(15, 23, 42, 0.68));
            border: 1px solid rgba(147, 197, 253, 0.13);
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.04),
              0 10px 24px rgba(0, 0, 0, 0.14);
          }

          .mobileMenuSelectIcon {
            width: 30px;
            height: 30px;
            min-width: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            place-items: center;
            align-self: center;
            justify-self: center;
            border-radius: 999px;
            background:
              radial-gradient(circle at 35% 20%, rgba(255, 255, 255, 0.2), transparent 42%),
              linear-gradient(135deg, rgba(37, 99, 235, 0.38), rgba(14, 165, 233, 0.18));
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.09),
              0 0 18px rgba(37, 99, 235, 0.1);
            overflow: hidden;
            transform: translateY(-1px);
          }

          .mobileMenuSelectIcon em {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            margin: 0;
            padding: 0;
            font-style: normal;
            font-size: 15px;
            line-height: 1;
            text-align: center;
            transform: translate3d(0, -1px, 0);
            font-family:
              "Apple Color Emoji",
              "Segoe UI Emoji",
              "Noto Color Emoji",
              system-ui,
              sans-serif;
          }

          .mobileMenuSelectors select,
          .mobileMenuSelectPill select {
            width: 100%;
            min-width: 0;
            height: 100%;
            border: 0;
            outline: 0;
            color: #ffffff;
            font-size: 12px;
            font-weight: 950;
            letter-spacing: 0.35px;
            text-shadow:
              0 0 12px rgba(255, 255, 255, 0.16),
              0 0 18px rgba(56, 189, 248, 0.12);
            background: transparent;
            appearance: none;
            -webkit-appearance: none;
          }

          .mobileMenuLinks,
          .mobileMenuAdminBlock div {
            position: relative;
            z-index: 2;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }

          .mobileMenuLinks .navItem,
          .mobileMenuAdminBlock .navItem,
          .mobileMenuAuthArea .navLoginButton,
          .mobileMenuAuthArea .navRegisterButton,
          .mobileMenuAuthArea .navLogoutButton {
            width: 100%;
            min-width: 0;
            height: 46px;
            padding: 0 10px;
            border-radius: 18px;
            display: inline-flex;
            align-items: center;
            justify-content: flex-start;
            gap: 8px;
            text-decoration: none;
            color: #eaf5ff;
            font-size: 12px;
            font-weight: 930;
            background:
              radial-gradient(circle at 20% 0%, rgba(255, 255, 255, 0.09), transparent 42%),
              linear-gradient(135deg, rgba(2, 6, 23, 0.84), rgba(15, 23, 42, 0.62));
            border: 1px solid rgba(147, 197, 253, 0.13);
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.04),
              0 10px 24px rgba(0, 0, 0, 0.14);
            transition:
              transform 0.2s ease,
              border-color 0.2s ease,
              background 0.2s ease,
              box-shadow 0.2s ease,
              filter 0.2s ease;
          }

          .mobileMenuLinks .navItem:active,
          .mobileMenuAdminBlock .navItem:active,
          .mobileMenuAuthArea .navLoginButton:active,
          .mobileMenuAuthArea .navRegisterButton:active,
          .mobileMenuAuthArea .navLogoutButton:active {
            transform: scale(0.98);
            filter: brightness(1.08);
          }

          .mobileMenuLinks .navItemActive,
          .mobileMenuAdminBlock .navItemActive {
            color: #ffffff;
            border-color: rgba(147, 197, 253, 0.34);
            background:
              radial-gradient(circle at 20% 0%, rgba(255, 255, 255, 0.14), transparent 42%),
              linear-gradient(135deg, rgba(37, 99, 235, 0.58), rgba(14, 165, 233, 0.22));
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.08),
              0 12px 28px rgba(0, 0, 0, 0.18),
              0 0 24px rgba(56, 189, 248, 0.11);
          }

          .mobileMenuLinks .navIcon,
          .mobileMenuAdminBlock .navIcon,
          .mobileMenuAuthArea .navIcon {
            width: 24px;
            height: 24px;
            min-width: 24px;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            background:
              radial-gradient(circle at 25% 0%, rgba(255, 255, 255, 0.16), transparent 42%),
              rgba(37, 99, 235, 0.24);
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.08),
              0 0 14px rgba(56, 189, 248, 0.08);
          }

          .mobileMenuLinks .navItem span:last-child,
          .mobileMenuAdminBlock .navItem span:last-child,
          .mobileMenuAuthArea .navLoginButton span:last-child,
          .mobileMenuAuthArea .navRegisterButton span:last-child,
          .mobileMenuAuthArea .navLogoutButton span:last-child {
            min-width: 0;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            letter-spacing: 0.25px;
            text-shadow:
              0 0 12px rgba(255, 255, 255, 0.12),
              0 0 18px rgba(56, 189, 248, 0.1);
          }

          .mobileMenuSelectPill {
            grid-template-columns: 24px minmax(0, 1fr);
            justify-content: flex-start;
            gap: 8px;
          }

          .mobileMenuSelectPill .mobileMenuSelectIcon {
            width: 24px;
            height: 24px;
            min-width: 24px;
            transform: translateY(-5px);
          }

          .mobileMenuSelectPill .mobileMenuSelectIcon em {
            width: 24px;
            height: 24px;
            font-size: 12.5px;
            transform: translate3d(0, -1px, 0);
          }

          .mobileMenuAdminBlock {
            position: relative;
            z-index: 2;
            display: grid;
            gap: 9px;
            padding-top: 3px;
          }

          .mobileMenuAdminBlock > span {
            color: #93c5fd;
            font-size: 10px;
            font-weight: 950;
            letter-spacing: 1px;
            text-transform: uppercase;
          }

          .mobileMenuAuthArea {
            position: relative;
            z-index: 2;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }

          .mobileMenuAuthArea .navLogoutButton {
            grid-column: 1 / -1;
            border-color: rgba(248, 113, 113, 0.16);
            cursor: pointer;
          }
        }

        @media (max-width: 420px) {
          .mobileTopbarSpacer {
            height: 80px;
          }

          .mobileMenuDock {
            top: max(12px, calc(env(safe-area-inset-top) + 8px));
            width: calc(100% - 14px);
            min-height: 52px;
            padding: 6px;
            gap: 6px;
          }

          .mobileMenuBrand {
            height: 39px;
            padding-right: 9px;
          }

          .mobileMenuBrand img {
            width: 28px;
            height: 28px;
            min-width: 28px;
          }

          .mobileMenuBrand span {
            font-size: 12px;
          }

          .mobileMenuBalance {
            max-width: 82px;
            height: 39px;
            padding: 0 10px;
            font-size: 10px;
          }

          .mobileMenuButton {
            width: 86px;
            height: 39px;
            padding: 0 8px;
            gap: 6px;
            transform: translateY(1px);
          }

          .mobileMenuButtonIcon {
            width: 20px;
            height: 20px;
            min-width: 20px;
          }

          .mobileMenuButton strong {
            font-size: 10px;
          }

          .mobileMenuPanel {
            top: max(76px, calc(68px + env(safe-area-inset-top)));
            width: calc(100% - 14px);
            max-height: calc(100svh - 94px - env(safe-area-inset-bottom));
            border-radius: 26px;
            padding: 12px;
          }

          .mobileMenuPanelHeader {
            grid-template-columns: 1fr 40px;
            min-height: 58px;
          }

          .mobileMenuPanelHeader > div {
            padding-left: 40px;
          }

          .mobileMenuPanelHeader strong {
            font-size: 16px;
          }

          .mobileMenuPanelHeader button {
            width: 40px;
            height: 40px;
            transform: translateY(7px);
          }

          .mobileMenuPanelHeader button span {
            width: 40px;
            height: 40px;
          }

          .mobileMenuLinks,
          .mobileMenuAdminBlock div {
            gap: 7px;
          }

          .mobileMenuLinks .navItem,
          .mobileMenuAdminBlock .navItem,
          .mobileMenuAuthArea .navLoginButton,
          .mobileMenuAuthArea .navRegisterButton,
          .mobileMenuAuthArea .navLogoutButton,
          .mobileMenuSelectPill,
          .mobileMenuSelectors label {
            height: 44px;
            border-radius: 17px;
            font-size: 11px;
            padding: 0 8px;
          }

          .mobileMenuSelectIcon {
            width: 28px;
            height: 28px;
            min-width: 28px;
            transform: translateY(-1px);
          }

          .mobileMenuSelectIcon em {
            width: 28px;
            height: 28px;
            font-size: 14px;
            transform: translate3d(0, -1px, 0);
          }

          .mobileMenuSelectPill {
            grid-template-columns: 24px minmax(0, 1fr);
          }

          .mobileMenuSelectPill .mobileMenuSelectIcon {
            width: 24px;
            height: 24px;
            min-width: 24px;
            transform: translateY(-5px);
          }

          .mobileMenuSelectPill .mobileMenuSelectIcon em {
            width: 24px;
            height: 24px;
            font-size: 12.5px;
            transform: translate3d(0, -1px, 0);
          }
        }

        @media (max-width: 360px) {
          .mobileMenuDock {
            grid-template-columns: minmax(0, 1fr) auto;
          }

          .mobileMenuBalance {
            display: none;
          }

          .mobileMenuButton {
            width: 84px;
          }

          .mobileMenuBrand span {
            max-width: 126px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mobileMenuBackdrop,
          .mobileMenuPanel,
          .mobileMenuButtonIcon i,
          .mobileMenuButton,
          .mobileMenuDock::before,
          .mobileMenuPanelGlow {
            transition: none !important;
            animation: none !important;
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