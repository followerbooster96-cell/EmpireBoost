import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api.js";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus("");
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

    setIsLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", {
        email: cleanEmail,
      });

      setStatus(
        res.data?.message ||
          "If an account with this email exists, a password reset link has been prepared."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Password reset request failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="forgotPagePro">
      <div className="forgotBackgroundGrid" aria-hidden="true" />

      <div className="forgotAurora" aria-hidden="true">
        <span className="forgotAuroraOne" />
        <span className="forgotAuroraTwo" />
        <span className="forgotAuroraThree" />
      </div>

      <div className="forgotNoiseLayer" aria-hidden="true" />

      <section className="forgotShell">
        <aside className="forgotBrandPanel">
          <div className="forgotBadge">
            <span />
            Secure password recovery
          </div>

          <h1>
            <span>Reset your</span>
            <strong>EmpireBoost password.</strong>
          </h1>

          <p>
            Enter the email connected to your account. If the account exists,
            a secure reset link will be sent only to the account owner.
          </p>

          <div className="forgotInfoGrid">
            <div>
              <b>01</b>
              <strong>Enter email</strong>
              <span>Use the email connected to your EmpireBoost account.</span>
            </div>

            <div>
              <b>02</b>
              <strong>Check your inbox</strong>
              <span>The reset link will be sent only to the account email.</span>
            </div>

            <div>
              <b>03</b>
              <strong>Create new password</strong>
              <span>Choose a strong password and login again.</span>
            </div>
          </div>
        </aside>

        <section className="forgotFormPanel">
          <form className="forgotCard" onSubmit={handleSubmit}>
            <div className="forgotCardGlow" aria-hidden="true" />

            <div className="forgotHeader">
              <span>Forgot password</span>
              <h2>Recover access</h2>
              <p>No stress. We will prepare a secure reset link.</p>
            </div>

            {error && (
              <div className="forgotMessage forgotError">
                <b>!</b>
                <p>{error}</p>
              </div>
            )}

            {status && (
              <div className="forgotMessage forgotSuccess">
                <b>✓</b>
                <p>{status}</p>
              </div>
            )}

            <label className="forgotInputGroup">
              <span>Email address</span>

              <div className="forgotInputShell">
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

            <button
              className="forgotSubmitBtn"
              type="submit"
              disabled={isLoading}
            >
              <span>
                {isLoading ? "Preparing reset link..." : "Send reset link"}
              </span>
              <b>{isLoading ? "⏳" : "→"}</b>
            </button>

            <div className="forgotDivider">
              <span />
              <p>Remembered it?</p>
              <span />
            </div>

            <Link className="forgotBackLink" to="/login">
              <span>Back to login</span>
              <b>←</b>
            </Link>
          </form>

          <div className="forgotTrustBox">
            <strong>Security note</strong>
            <span>
              For privacy, the same message is shown even if the email is not
              registered.
            </span>
          </div>
        </section>
      </section>
    </main>
  );
}

export default ForgotPassword;