import { useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Turnstile } from "@marsidev/react-turnstile";
import api from "../lib/api.js";
import "./Login.css";

const floatingLoginItems = [
  { icon: "🔐", label: "Secure Login" },
  { icon: "⚡", label: "Fast Access" },
  { icon: "📊", label: "Dashboard" },
  { icon: "💳", label: "Wallet" },
  { icon: "📦", label: "Orders" },
  { icon: "💬", label: "Support" },
  { icon: "📸", label: "Instagram" },
  { icon: "🎵", label: "TikTok" },
  { icon: "▶️", label: "YouTube" },
  { icon: "✈️", label: "Telegram" },
  { icon: "🛡️", label: "Protected" },
  { icon: "🚀", label: "Growth Room" },
  { icon: "✅", label: "Verified" },
  { icon: "🌍", label: "Creators" },
  { icon: "💎", label: "Premium" },
  { icon: "📈", label: "Live Stats" },
  { icon: "🔥", label: "Boost Mode" },
  { icon: "🧠", label: "Smart Panel" },
];

const loginBenefits = [
  {
    icon: "📦",
    title: "Control your orders",
    text: "Check order status, delivery progress and your full order history.",
  },
  {
    icon: "💳",
    title: "Manage wallet balance",
    text: "View wallet activity, deposits, payments and transaction history.",
  },
  {
    icon: "💬",
    title: "Open support tickets",
    text: "Contact EmpireBoost support directly from your account dashboard.",
  },
];

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

function getEmailPreview(email) {
  const cleanEmail = email.trim();

  if (!cleanEmail) return "Waiting for email";
  if (!cleanEmail.includes("@")) return "Email not complete";

  return cleanEmail.toLowerCase();
}

function Login() {
  const navigate = useNavigate();
  const turnstileRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberInfo, setRememberInfo] = useState(true);
  const [captchaToken, setCaptchaToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const emailPreview = useMemo(() => getEmailPreview(email), [email]);

  const resetCaptcha = () => {
    setCaptchaToken("");

    if (turnstileRef.current) {
      turnstileRef.current.reset();
    }
  };

  const saveSessionAndRedirect = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    window.dispatchEvent(
      new CustomEvent("empire-user-updated", {
        detail: {
          user: data.user,
        },
      })
    );

    navigate("/dashboard");
  };

  const validateCaptcha = () => {
    if (!turnstileSiteKey) {
      setError("Security check is not configured. Missing Turnstile site key.");
      return false;
    }

    if (!captchaToken) {
      setError("Please complete the security check before continuing.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Email is required.");
      return;
    }

    if (!cleanEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (!validateCaptcha()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email: cleanEmail,
        password,
        captchaToken,
      });

      if (rememberInfo) {
        localStorage.setItem("lastLoginEmail", cleanEmail);
      } else {
        localStorage.removeItem("lastLoginEmail");
      }

      saveSessionAndRedirect(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      resetCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");

    if (!validateCaptcha()) {
      return;
    }

    if (!credentialResponse?.credential) {
      setError("Google login did not return a valid credential.");
      resetCaptcha();
      return;
    }

    setGoogleLoading(true);

    try {
      const res = await api.post("/auth/google", {
        credential: credentialResponse.credential,
        captchaToken,
      });

      saveSessionAndRedirect(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Google login failed");
      resetCaptcha();
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google login was cancelled or failed.");
    resetCaptcha();
  };

  return (
    <main className="loginPagePro">
      <div className="loginBackgroundGrid" aria-hidden="true" />

      <div className="loginAurora" aria-hidden="true">
        <span className="loginAuroraOne" />
        <span className="loginAuroraTwo" />
        <span className="loginAuroraThree" />
        <span className="loginAuroraFour" />
      </div>

      <div className="loginNoiseLayer" aria-hidden="true" />
      <div className="loginLightLine loginLightLineOne" aria-hidden="true" />
      <div className="loginLightLine loginLightLineTwo" aria-hidden="true" />

      <div className="loginFloatingLayer" aria-hidden="true">
        {floatingLoginItems.map((item, index) => (
          <span
            className={`loginFloat loginFloat${index + 1}`}
            key={`${item.label}-${index}`}
          >
            <b>{item.icon}</b>
            <em>{item.label}</em>
          </span>
        ))}
      </div>

      <section className="loginShell">
        <aside className="loginBrandPanel">
          <div className="loginBrandInner">
            <div className="loginBadge">
              <span />
              EmpireBoost secure access
            </div>

            <h1 className="loginHeroTitle">
              <span>Welcome back.</span>
              <strong>Your growth control room is ready.</strong>
            </h1>

            <p>
              Login to manage your wallet, track orders, open support tickets
              and control your EmpireBoost account from one premium dashboard.
            </p>

            <div className="loginBenefits">
              {loginBenefits.map((benefit) => (
                <article className="loginBenefitCard" key={benefit.title}>
                  <div className="loginBenefitIcon">{benefit.icon}</div>

                  <div>
                    <h2>{benefit.title}</h2>
                    <span>{benefit.text}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="loginMiniStats">
              <div>
                <strong>24/7</strong>
                <span>Account access</span>
              </div>

              <div>
                <strong>Live</strong>
                <span>Order tracking</span>
              </div>

              <div>
                <strong>Fast</strong>
                <span>Support flow</span>
              </div>
            </div>
          </div>

          <div className="loginLivePanel" aria-hidden="true">
            <div className="loginLiveTop">
              <span />
              Live security status
            </div>

            <div className="loginLiveBars">
              <i />
              <i />
              <i />
              <i />
            </div>

            <div className="loginLiveBottom">
              <b>Protected</b>
              <em>Encrypted session ready</em>
            </div>
          </div>
        </aside>

        <section className="loginFormPanel">
          <form className="loginCard" onSubmit={handleSubmit}>
            <div className="loginCardGlow" aria-hidden="true" />

            <div className="loginFormHeader">
              <span>Member login</span>
              <h2>Login</h2>
              <p>Enter your email and password to open your dashboard.</p>
            </div>

            {error && (
              <div className="loginErrorBox">
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            <div className="loginActionCard">
              <div className="loginCardTitleRow">
                <div className="loginCardIcon">🛡️</div>

                <div>
                  <span>Security check</span>
                  <strong>Verify you are human</strong>
                  <p>This protects EmpireBoost from automated login attacks.</p>
                </div>
              </div>

              <div className="loginTurnstileWrap">
                {turnstileSiteKey ? (
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={turnstileSiteKey}
                    options={{
                      theme: "dark",
                      size: "normal",
                    }}
                    onSuccess={(token) => {
                      setCaptchaToken(token);
                      setError("");
                    }}
                    onExpire={() => {
                      setCaptchaToken("");
                    }}
                    onError={() => {
                      setCaptchaToken("");
                      setError(
                        "Security check failed. Please refresh and try again."
                      );
                    }}
                  />
                ) : (
                  <p className="loginMissingKey">
                    Missing VITE_TURNSTILE_SITE_KEY in client/.env
                  </p>
                )}
              </div>
            </div>

            <div className="loginActionCard">
              <div className="loginCardTitleRow">
                <div className="loginCardIcon googleIcon">G</div>

                <div>
                  <span>Fast access</span>
                  <strong>Continue with Google</strong>
                  <p>One click login after the security check is completed.</p>
                </div>
              </div>

              <div
                className={`loginGoogleButtonWrap ${
                  googleLoading || !captchaToken ? "loginGoogleDisabled" : ""
                }`}
              >
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme="filled_black"
                  size="large"
                  shape="pill"
                  text="continue_with"
                  width="320"
                />
              </div>

              {googleLoading && (
                <p className="loginHelperText">Checking Google account...</p>
              )}

              {!captchaToken && (
                <p className="loginHelperText">
                  Complete the security check above to enable Google login.
                </p>
              )}
            </div>

            <div className="loginDivider">
              <span />
              <p>or use email</p>
              <span />
            </div>

            <label className="loginInputGroup">
              <span>Email address</span>

              <div className="loginInputShell">
                <b>✉️</b>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </label>

            <label className="loginInputGroup">
              <span>Password</span>

              <div className="loginPasswordWrap">
                <b>🔒</b>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="loginShowPasswordBtn"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <div className="loginSessionBox">
              <div>
                <span>Login preview</span>
                <strong>{emailPreview}</strong>
              </div>

              <div className="loginSessionActions">
                <label className="loginRememberRow">
                  <input
                    type="checkbox"
                    checked={rememberInfo}
                    onChange={(e) => setRememberInfo(e.target.checked)}
                  />

                  <span className="loginCheckboxVisual" />

                  <p>Remember email</p>
                </label>

                <Link className="loginForgotLink" to="/forgot-password">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              className="loginSubmitBtn"
              type="submit"
              disabled={isLoading || !captchaToken}
            >
              <span>{isLoading ? "Logging in..." : "Login"}</span>
              <b>{isLoading ? "⏳" : "→"}</b>
            </button>

            {!captchaToken && (
              <p className="loginBottomHint">
                Complete the security check to enable login.
              </p>
            )}

            <div className="loginDivider">
              <span />
              <p>New here?</p>
              <span />
            </div>

            <Link className="loginRegisterLink" to="/register">
              <span>Create new account</span>
              <b>+</b>
            </Link>
          </form>

          <div className="loginTrustBox">
            <div>
              <strong>No social passwords</strong>
              <span>EmpireBoost only needs public links for orders.</span>
            </div>

            <div>
              <strong>Bot protection active</strong>
              <span>
                Security checks protect the platform from automated abuse.
              </span>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Login;