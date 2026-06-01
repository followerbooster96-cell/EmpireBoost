import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../lib/api.js";
import "./ResetPassword.css";

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
      className: "resetStrengthEmpty",
      width: "0%",
      hint: "Use at least 6 characters.",
    };
  }

  if (score <= 1) {
    return {
      label: "Weak",
      className: "resetStrengthWeak",
      width: "34%",
      hint: "Add more characters, numbers or symbols.",
    };
  }

  if (score <= 3) {
    return {
      label: "Good",
      className: "resetStrengthGood",
      width: "68%",
      hint: "Nice. Add symbols or uppercase letters for more protection.",
    };
  }

  return {
    label: "Strong",
    className: "resetStrengthStrong",
    width: "100%",
    hint: "Strong password. This looks clean.",
  };
}

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = useMemo(
    () => getPasswordStrength(password),
    [password]
  );

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const canSubmit =
    token &&
    password.length >= 6 &&
    confirmPassword.length >= 6 &&
    password === confirmPassword &&
    !isLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus("");
    setError("");

    if (!token) {
      setError("Reset token is missing.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post(`/auth/reset-password/${token}`, {
        password,
      });

      setStatus(
        res.data?.message ||
          "Password has been reset successfully. You can now login."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1400);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Password reset failed. The link may be invalid or expired."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="resetPagePro">
      <div className="resetBackgroundGrid" aria-hidden="true" />

      <div className="resetAurora" aria-hidden="true">
        <span className="resetAuroraOne" />
        <span className="resetAuroraTwo" />
        <span className="resetAuroraThree" />
      </div>

      <div className="resetNoiseLayer" aria-hidden="true" />

      <section className="resetShell">
        <aside className="resetBrandPanel">
          <div className="resetBadge">
            <span />
            New secure password
          </div>

          <h1>
            Create a new <strong>EmpireBoost password.</strong>
          </h1>

          <p>
            Choose a fresh password for your account. After reset, the old
            password will stop working.
          </p>

          <div className="resetInfoGrid">
            <div>
              <b>Protected</b>
              <span>Reset links expire automatically.</span>
            </div>

            <div>
              <b>Private</b>
              <span>Your old password is never shown or sent back.</span>
            </div>

            <div>
              <b>Clean</b>
              <span>After reset, login with your new password.</span>
            </div>
          </div>
        </aside>

        <section className="resetFormPanel">
          <form className="resetCard" onSubmit={handleSubmit}>
            <div className="resetCardGlow" aria-hidden="true" />

            <div className="resetHeader">
              <span>Reset password</span>
              <h2>New password</h2>
              <p>Enter and confirm your new password.</p>
            </div>

            {error && (
              <div className="resetMessage resetError">
                <b>!</b>
                <p>{error}</p>
              </div>
            )}

            {status && (
              <div className="resetMessage resetSuccess">
                <b>✓</b>
                <p>{status}</p>
              </div>
            )}

            <label className="resetInputGroup">
              <span>New password</span>

              <div className="resetPasswordWrap">
                <b>🔒</b>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={password}
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="resetShowPasswordBtn"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <div className={`resetStrengthBox ${passwordStrength.className}`}>
              <div className="resetStrengthTop">
                <span>Password strength</span>
                <strong>{passwordStrength.label}</strong>
              </div>

              <div className="resetStrengthTrack">
                <span style={{ width: passwordStrength.width }}>
                  <i />
                </span>
              </div>

              <p>{passwordStrength.hint}</p>
            </div>

            <label className="resetInputGroup">
              <span>Repeat password</span>

              <div className="resetPasswordWrap">
                <b>🔁</b>

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  autoComplete="new-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="resetShowPasswordBtn"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <div
              className={`resetMatchBox ${
                passwordsMatch
                  ? "resetMatchSuccess"
                  : confirmPassword
                    ? "resetMatchError"
                    : "resetMatchWaiting"
              }`}
            >
              <div>
                <span>{passwordsMatch ? "Match" : confirmPassword ? "No match" : "Waiting"}</span>
                <strong>
                  {passwordsMatch
                    ? "Passwords match perfectly."
                    : confirmPassword
                      ? "Passwords are not the same."
                      : "Repeat your password to confirm it."}
                </strong>
              </div>

              <b>{passwordsMatch ? "✓" : confirmPassword ? "!" : "•"}</b>
            </div>

            <button className="resetSubmitBtn" type="submit" disabled={!canSubmit}>
              <span>{isLoading ? "Resetting password..." : "Reset password"}</span>
              <b>{isLoading ? "⏳" : "→"}</b>
            </button>

            <div className="resetDivider">
              <span />
              <p>Back to access</p>
              <span />
            </div>

            <Link className="resetBackLink" to="/login">
              <span>Back to login</span>
              <b>←</b>
            </Link>
          </form>
        </section>
      </section>
    </main>
  );
}

export default ResetPassword;