import { useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Turnstile } from "@marsidev/react-turnstile";
import api from "../lib/api.js";
import "./Register.css";

const floatingRegisterItems = [
  { icon: "🚀", label: "Create Account" },
  { icon: "💎", label: "EmpireBoost" },
  { icon: "💳", label: "Wallet" },
  { icon: "📦", label: "Orders" },
  { icon: "📸", label: "Instagram" },
  { icon: "🎵", label: "TikTok" },
  { icon: "▶️", label: "YouTube" },
  { icon: "✈️", label: "Telegram" },
  { icon: "📈", label: "Growth" },
  { icon: "🛡️", label: "Secure" },
  { icon: "⚡", label: "Fast Setup" },
  { icon: "📊", label: "Dashboard" },
  { icon: "🔥", label: "Boost Mode" },
  { icon: "✅", label: "Verified" },
  { icon: "🌍", label: "Creators" },
  { icon: "🧠", label: "Smart Panel" },
];

const benefits = [
  {
    icon: "📊",
    title: "Smart dashboard",
    text: "Track orders, wallet balance and support tickets from one clean control room.",
  },
  {
    icon: "💳",
    title: "Wallet system",
    text: "Add balance once and use it for Instagram, TikTok, YouTube, Telegram and more.",
  },
  {
    icon: "🛡️",
    title: "No passwords",
    text: "EmpireBoost never asks for your social media passwords. Only public links.",
  },
];

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

function getPasswordStrength(password) {
  let score = 0;

  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (!password) {
    return {
      label: "Waiting",
      className: "registerStrengthEmpty",
      width: "0%",
      hint: "Use at least 6 characters.",
    };
  }

  if (score <= 1) {
    return {
      label: "Weak",
      className: "registerStrengthWeak",
      width: "34%",
      hint: "Add more characters, numbers or symbols.",
    };
  }

  if (score <= 3) {
    return {
      label: "Good",
      className: "registerStrengthGood",
      width: "68%",
      hint: "Nice. Add symbols or uppercase letters for more protection.",
    };
  }

  return {
    label: "Strong",
    className: "registerStrengthStrong",
    width: "100%",
    hint: "Strong password. Your account setup looks clean.",
  };
}

function getPasswordMatch(password, confirmPassword) {
  if (!confirmPassword) {
    return {
      label: "Waiting",
      className: "registerMatchWaiting",
      text: "Repeat your password to confirm it.",
    };
  }

  if (password === confirmPassword) {
    return {
      label: "Match",
      className: "registerMatchSuccess",
      text: "Passwords match perfectly.",
    };
  }

  return {
    label: "No match",
    className: "registerMatchError",
    text: "Passwords are not the same.",
  };
}

function Register() {
  const navigate = useNavigate();
  const turnstileRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const passwordStrength = useMemo(
    () => getPasswordStrength(password),
    [password]
  );

  const passwordMatch = useMemo(
    () => getPasswordMatch(password, confirmPassword),
    [password, confirmPassword]
  );

  const canSubmit =
    Boolean(captchaToken) &&
    acceptedTerms &&
    email.trim().includes("@") &&
    password.length >= 6 &&
    confirmPassword.length >= 6 &&
    password === confirmPassword &&
    !isLoading;

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

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (confirmPassword.length < 6) {
      setError("Please repeat your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      setError(
        "Please accept the Terms and Privacy Policy before creating an account."
      );
      return;
    }

    if (!validateCaptcha()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/auth/register", {
        email: cleanEmail,
        password,
        captchaToken,
      });

      saveSessionAndRedirect(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Register failed");
      resetCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");

    if (!acceptedTerms) {
      setError(
        "Please accept the Terms and Privacy Policy before continuing with Google."
      );
      return;
    }

    if (!validateCaptcha()) {
      return;
    }

    if (!credentialResponse?.credential) {
      setError("Google register did not return a valid credential.");
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
      setError(err.response?.data?.message || "Google register failed");
      resetCaptcha();
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google register was cancelled or failed.");
    resetCaptcha();
  };

  return (
    <main className="registerPagePro">
      <div className="registerBackgroundGrid" aria-hidden="true" />

      <div className="registerAurora" aria-hidden="true">
        <span className="registerAuroraOne" />
        <span className="registerAuroraTwo" />
        <span className="registerAuroraThree" />
        <span className="registerAuroraFour" />
      </div>

      <div className="registerNoiseLayer" aria-hidden="true" />
      <div className="registerLightLine registerLightLineOne" aria-hidden="true" />
      <div className="registerLightLine registerLightLineTwo" aria-hidden="true" />

      <div className="registerFloatingLayer" aria-hidden="true">
        {floatingRegisterItems.map((item, index) => (
          <span
            className={`registerFloat registerFloat${index + 1}`}
            key={`${item.label}-${index}`}
          >
            <b>{item.icon}</b>
            <em>{item.label}</em>
          </span>
        ))}
      </div>

      <section className="registerShell">
        <aside className="registerBrandPanel">
          <div className="registerBrandInner">
            <div className="registerBadge">
              <span />
              EmpireBoost member access
            </div>

            <h1 className="registerHeroTitle">
              <span>Create your</span>
              <strong>EmpireBoost account.</strong>
            </h1>

            <p>
              Start your social media growth dashboard, manage your wallet,
              place orders and contact support from one premium control room.
            </p>

            <div className="registerBenefits">
              {benefits.map((benefit) => (
                <article className="registerBenefitCard" key={benefit.title}>
                  <div className="registerBenefitIcon">{benefit.icon}</div>

                  <div>
                    <h2>{benefit.title}</h2>
                    <span>{benefit.text}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="registerMiniStats">
              <div>
                <strong>24/7</strong>
                <span>Panel access</span>
              </div>

              <div>
                <strong>0</strong>
                <span>Passwords needed</span>
              </div>

              <div>
                <strong>∞</strong>
                <span>Growth options</span>
              </div>
            </div>
          </div>

          <div className="registerLivePanel" aria-hidden="true">
            <div className="registerLiveTop">
              <span />
              Account setup status
            </div>

            <div className="registerLiveSteps">
              <i className={email.trim().includes("@") ? "isReady" : ""} />
              <i className={password.length >= 6 ? "isReady" : ""} />
              <i
                className={
                  password === confirmPassword && confirmPassword ? "isReady" : ""
                }
              />
              <i className={acceptedTerms ? "isReady" : ""} />
              <i className={captchaToken ? "isReady" : ""} />
            </div>

            <div className="registerLiveBottom">
              <b>{canSubmit ? "Ready" : "Almost ready"}</b>
              <em>
                {canSubmit
                  ? "Everything looks clean."
                  : "Finish the checks to create your account."}
              </em>
            </div>
          </div>
        </aside>

        <section className="registerFormPanel">
          <form className="registerCard" onSubmit={handleSubmit}>
            <div className="registerCardGlow" aria-hidden="true" />

            <div
              className="registerFormHeader"
              style={{
                width: "100%",
                maxWidth: "420px",
                margin: "0 auto 12px",
                textAlign: "center",
                display: "grid",
                justifyItems: "center",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "center",
                  marginBottom: "8px",
                }}
              >
                New account
              </span>

              <h2
                style={{
                  width: "100%",
                  textAlign: "center",
                  margin: "0 0 8px",
                }}
              >
                Join EmpireBoost
              </h2>

              <p
                style={{
                  width: "100%",
                  maxWidth: "360px",
                  margin: "0 auto",
                  textAlign: "center",
                }}
              >
                Create your account and open your dashboard in seconds.
              </p>
            </div>

            {error && (
              <div className="registerErrorBox">
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            <label className="registerTermsRow">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />

              <span className="registerCheckboxVisual" />

              <p>
                I agree to the <Link to="/terms">Terms of Service</Link>,{" "}
                <Link to="/privacy">Privacy Policy</Link> and{" "}
                <Link to="/refund-policy">Refund Policy</Link>.
              </p>
            </label>

            <div className="registerActionCard">
              <div className="registerCardTitleRow">
                <div className="registerCardIcon">🛡️</div>

                <div>
                  <span>Security check</span>
                  <strong>Verify you are human</strong>
                  <p>This helps protect registration from automated bot accounts.</p>
                </div>
              </div>

              <div className="registerTurnstileWrap">
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
                  <p className="registerMissingKey">
                    Missing VITE_TURNSTILE_SITE_KEY in client/.env
                  </p>
                )}
              </div>
            </div>

            <div className="registerActionCard">
              <div className="registerCardTitleRow">
                <div className="registerCardIcon googleIcon">G</div>

                <div>
                  <span>Fast registration</span>
                  <strong>Continue with Google</strong>
                  <p>One click account setup after the security check is completed.</p>
                </div>
              </div>

              <div
                className={`registerGoogleButtonWrap ${
                  googleLoading || !captchaToken || !acceptedTerms
                    ? "registerGoogleDisabled"
                    : ""
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
                <p className="registerHelperText">Creating Google account...</p>
              )}

              {!acceptedTerms && (
                <p className="registerHelperText">
                  Accept the terms first to enable Google registration.
                </p>
              )}

              {acceptedTerms && !captchaToken && (
                <p className="registerHelperText">
                  Complete the security check above to enable Google registration.
                </p>
              )}
            </div>

            <div className="registerDivider">
              <span />
              <p>or create with email</p>
              <span />
            </div>

            <label className="registerInputGroup">
              <span>Email address</span>

              <div className="registerInputShell">
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

            <label className="registerInputGroup">
              <span>Password</span>

              <div className="registerPasswordWrap">
                <b>🔒</b>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password, min 6 characters"
                  value={password}
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="registerShowPasswordBtn"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <div className={`registerStrengthBox ${passwordStrength.className}`}>
              <div className="registerStrengthTop">
                <span>Password strength</span>
                <strong>{passwordStrength.label}</strong>
              </div>

              <div className="registerStrengthTrack">
                <span style={{ width: passwordStrength.width }}>
                  <i />
                </span>
              </div>

              <p>{passwordStrength.hint}</p>
            </div>

            <label className="registerInputGroup">
              <span>Repeat password</span>

              <div className="registerPasswordWrap">
                <b>🔁</b>

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  autoComplete="new-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="registerShowPasswordBtn"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <div className={`registerPasswordMatch ${passwordMatch.className}`}>
              <div>
                <span>{passwordMatch.label}</span>
                <strong>{passwordMatch.text}</strong>
              </div>

              <b>
                {passwordMatch.className === "registerMatchSuccess"
                  ? "✓"
                  : passwordMatch.className === "registerMatchError"
                    ? "!"
                    : "•"}
              </b>
            </div>

            <button
              className="registerSubmitBtn"
              type="submit"
              disabled={!canSubmit}
            >
              <span>{isLoading ? "Creating account..." : "Create Account"}</span>
              <b>{isLoading ? "⏳" : "→"}</b>
            </button>

            {!canSubmit && (
              <p className="registerBottomHint">
                Complete terms, security check and password confirmation to enable
                registration.
              </p>
            )}

            <div className="registerDivider">
              <span />
              <p>Already registered?</p>
              <span />
            </div>

            <Link className="registerLoginLink" to="/login">
              <span>Login to existing account</span>
              <b>→</b>
            </Link>
          </form>

          <div className="registerTrustBox">
            <div>
              <strong>No social passwords</strong>
              <span>Use only public profile, post, video or channel links.</span>
            </div>

            <div>
              <strong>Bot protection active</strong>
              <span>Security checks protect the platform from fake accounts.</span>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Register;