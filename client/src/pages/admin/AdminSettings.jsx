import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api.js";
import "./AdminSettings.css";

const floatingSettingsItems = [
  "Settings",
  "Admin",
  "Website",
  "Payments",
  "Business",
  "Support",
  "PayPal",
  "Crypto",
  "Revolut",
  "Bank",
  "Manual",
  "Imprint",
  "Maintenance",
  "EmpireBoost",
  "Control",
  "Config",
  "Secure",
  "Panel",
];

const defaultPaymentTemplates = {
  revolutInstructions:
    "Send the payment via Revolut and include your account email in the payment note. Your balance will be added after confirmation.",
  cryptoInstructions:
    "Send the exact amount to the crypto wallet shown during checkout. After payment, create a support ticket with the transaction hash if needed.",
  bankInstructions:
    "Send a bank transfer with your account email as payment reference. Bank payments can take longer to confirm.",
  paypalInstructions:
    "PayPal deposits are processed automatically when available. If anything is delayed, contact support with your PayPal email and payment details.",
  manualInstructions:
    "Manual payments are checked by admin. Always include your account email and payment reference when paying.",
};

function cleanText(value) {
  return String(value || "").trim();
}

function getFilledCount(form) {
  const keys = [
    "websiteName",
    "supportEmail",
    "businessName",
    "businessOwner",
    "businessAddress",
    "revolutInstructions",
    "cryptoInstructions",
    "bankInstructions",
    "paypalInstructions",
    "manualInstructions",
    "homepageAnnouncement",
  ];

  return keys.filter((key) => cleanText(form[key]).length > 0).length;
}

function AdminSettings() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    websiteName: "",
    supportEmail: "",
    businessName: "",
    businessOwner: "",
    businessAddress: "",
    revolutInstructions: "",
    cryptoInstructions: "",
    bankInstructions: "",
    paypalInstructions: "",
    manualInstructions: "",
    homepageAnnouncement: "",
    maintenanceMode: false,
  });

  const loadSettings = async () => {
    setIsLoading(true);

    try {
      const res = await api.get("/settings/admin");
      const settings = res.data.settings || {};

      setForm({
        websiteName: settings.websiteName || "",
        supportEmail: settings.supportEmail || "",
        businessName: settings.businessName || "",
        businessOwner: settings.businessOwner || "",
        businessAddress: settings.businessAddress || "",
        revolutInstructions: settings.revolutInstructions || "",
        cryptoInstructions: settings.cryptoInstructions || "",
        bankInstructions: settings.bankInstructions || "",
        paypalInstructions: settings.paypalInstructions || "",
        manualInstructions: settings.manualInstructions || "",
        homepageAnnouncement: settings.homepageAnnouncement || "",
        maintenanceMode: settings.maintenanceMode || false,
      });
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const stats = useMemo(() => {
    const filledCount = getFilledCount(form);
    const totalFields = 11;
    const paymentFields = [
      form.revolutInstructions,
      form.cryptoInstructions,
      form.bankInstructions,
      form.paypalInstructions,
      form.manualInstructions,
    ];

    const filledPayments = paymentFields.filter((item) => cleanText(item).length > 0).length;

    return {
      filledCount,
      totalFields,
      filledPayments,
      completionPercent: Math.round((filledCount / totalFields) * 100),
      maintenanceMode: form.maintenanceMode,
    };
  }, [form]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const applyPaymentTemplates = () => {
    const confirmed = confirm(
      "Apply clean default payment instructions for Revolut, Crypto, Bank, PayPal and Manual?"
    );

    if (!confirmed) return;

    setForm({
      ...form,
      ...defaultPaymentTemplates,
    });

    setMessageType("info");
    setMessage("Default payment instruction templates loaded. Review and save settings.");
  };

  const clearAnnouncement = () => {
    setForm({
      ...form,
      homepageAnnouncement: "",
    });

    setMessageType("info");
    setMessage("Homepage announcement cleared. Save settings to apply.");
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.supportEmail && !form.supportEmail.includes("@")) {
      setMessageType("error");
      setMessage("Support email must be a valid email address.");
      return;
    }

    setIsSaving(true);

    try {
      await api.put("/settings/admin", form);

      setMessageType("success");
      setMessage("Settings saved successfully.");

      await loadSettings();
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Save settings failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="adminSettingsPagePro">
      <div className="adminSettingsAurora" aria-hidden="true">
        <span className="adminSettingsAuroraOne" />
        <span className="adminSettingsAuroraTwo" />
        <span className="adminSettingsAuroraThree" />
        <span className="adminSettingsAuroraFour" />
      </div>

      <div className="adminSettingsFloatingLayer" aria-hidden="true">
        {floatingSettingsItems.map((item, index) => (
          <span
            className={`adminSettingsFloat adminSettingsFloat${index + 1}`}
            key={`${item}-${index}`}
          >
            {item}
          </span>
        ))}
      </div>

      <section className="adminSettingsHeroPro">
        <div className="adminSettingsHeroContent">
          <div className="adminSettingsBadgePro">
            <span />
            EmpireBoost configuration center
          </div>

          <h1>Control website settings, business details and payment instructions.</h1>

          <p>
            Manage public website identity, support contact, imprint information, deposit
            instructions and maintenance mode from one premium admin settings panel.
          </p>

          <div className="adminSettingsHeroActions">
            <a href="#admin-settings-form" className="adminSettingsPrimaryBtn">
              Edit Settings
            </a>

            <button type="button" className="adminSettingsSecondaryBtn" onClick={loadSettings}>
              Refresh Settings
            </button>
          </div>
        </div>

        <aside className="adminSettingsInfoCard">
          <div className="adminSettingsInfoGlow" />

          <span>Configuration</span>
          <strong>{stats.completionPercent}%</strong>
          <small>{stats.filledCount} of {stats.totalFields} fields completed</small>

          <div className="adminSettingsInfoMiniGrid">
            <div>
              <span>Payments</span>
              <b>{stats.filledPayments}/5</b>
            </div>

            <div>
              <span>Status</span>
              <b>{stats.maintenanceMode ? "Locked" : "Live"}</b>
            </div>
          </div>
        </aside>
      </section>

      {message && (
        <section className={`adminSettingsMessage adminSettingsMessage-${messageType}`}>
          <span>{messageType === "success" ? "✓" : messageType === "error" ? "!" : "i"}</span>
          <p>{message}</p>
        </section>
      )}

      <section className="adminSettingsStatsGrid">
        <article className="adminSettingsStatCard adminSettingsStatMain">
          <span>Website name</span>
          <strong>{form.websiteName || "Not set"}</strong>
          <small>Main public brand name</small>
        </article>

        <article className="adminSettingsStatCard">
          <span>Support email</span>
          <strong>{form.supportEmail || "Missing"}</strong>
          <small>Customer contact address</small>
        </article>

        <article className="adminSettingsStatCard">
          <span>Maintenance</span>
          <strong>{form.maintenanceMode ? "Enabled" : "Disabled"}</strong>
          <small>Controls public access mode</small>
        </article>

        <article className="adminSettingsStatCard">
          <span>Payment text</span>
          <strong>{stats.filledPayments}/5</strong>
          <small>Instruction blocks completed</small>
        </article>
      </section>

      <form
        className="adminSettingsMainGrid"
        id="admin-settings-form"
        onSubmit={saveSettings}
      >
        <section className="adminSettingsPanel adminSettingsWebsitePanel">
          <div className="adminSettingsPanelHeader">
            <div>
              <span>Website identity</span>
              <h2>Website Settings</h2>
            </div>

            <div className="adminSettingsPanelIcon">◎</div>
          </div>

          {isLoading ? (
            <div className="adminSettingsSkeletonList">
              <span />
              <span />
              <span />
            </div>
          ) : (
            <div className="adminSettingsFormGrid">
              <label>
                <span>Website name</span>
                <input
                  name="websiteName"
                  placeholder="Example: EmpireBoost"
                  value={form.websiteName}
                  onChange={handleChange}
                />
              </label>

              <label>
                <span>Support email</span>
                <input
                  name="supportEmail"
                  placeholder="support@example.com"
                  value={form.supportEmail}
                  onChange={handleChange}
                />
              </label>

              <label className="adminSettingsFullField">
                <span>Homepage announcement</span>
                <input
                  name="homepageAnnouncement"
                  placeholder="Optional homepage announcement"
                  value={form.homepageAnnouncement}
                  onChange={handleChange}
                />
              </label>

              <div className="adminSettingsAnnouncementPreview">
                <div>
                  <span>Announcement preview</span>
                  <strong>{form.homepageAnnouncement || "No announcement active"}</strong>
                  <p>
                    This can be shown on your homepage for promos, maintenance notes or important
                    customer updates.
                  </p>
                </div>

                <button type="button" onClick={clearAnnouncement}>
                  Clear
                </button>
              </div>

              <label className="adminSettingsSwitchRow">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={form.maintenanceMode}
                  onChange={handleChange}
                />

                <span className="adminSettingsSwitchVisual" />

                <div>
                  <strong>Maintenance mode</strong>
                  <small>
                    {form.maintenanceMode
                      ? "Website is marked as under maintenance."
                      : "Website is live for customers."}
                  </small>
                </div>
              </label>
            </div>
          )}
        </section>

        <aside className="adminSettingsPanel adminSettingsSidePanel">
          <div className="adminSettingsPanelHeader">
            <div>
              <span>Live status</span>
              <h2>System Overview</h2>
            </div>

            <div className="adminSettingsPanelIcon">↗</div>
          </div>

          <div className="adminSettingsStatusList">
            <div>
              <span>Website</span>
              <strong>{form.websiteName || "Not configured"}</strong>
            </div>

            <div>
              <span>Support</span>
              <strong>{form.supportEmail || "Missing email"}</strong>
            </div>

            <div>
              <span>Business</span>
              <strong>{form.businessName || "No imprint name"}</strong>
            </div>

            <div>
              <span>Mode</span>
              <strong>{form.maintenanceMode ? "Maintenance" : "Public live"}</strong>
            </div>
          </div>

          <div className="adminSettingsInsightBox">
            <span>Admin note</span>
            <strong>Keep payment instructions short and clear.</strong>
            <p>
              Customers should instantly understand how to pay, what reference to use and when
              their wallet balance will be updated.
            </p>
          </div>
        </aside>

        <section className="adminSettingsPanel adminSettingsBusinessPanel">
          <div className="adminSettingsPanelHeader">
            <div>
              <span>Legal identity</span>
              <h2>Business / Imprint Settings</h2>
            </div>

            <div className="adminSettingsPanelIcon">§</div>
          </div>

          <div className="adminSettingsFormGrid">
            <label>
              <span>Business name</span>
              <input
                name="businessName"
                placeholder="Business name"
                value={form.businessName}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Responsible person / owner</span>
              <input
                name="businessOwner"
                placeholder="Responsible person / owner"
                value={form.businessOwner}
                onChange={handleChange}
              />
            </label>

            <label className="adminSettingsFullField">
              <span>Business address</span>
              <textarea
                name="businessAddress"
                placeholder="Business address"
                value={form.businessAddress}
                onChange={handleChange}
              />
            </label>
          </div>
        </section>

        <section className="adminSettingsPanel adminSettingsPaymentsPanel">
          <div className="adminSettingsPanelHeader">
            <div>
              <span>Deposit instructions</span>
              <h2>Payment Instructions</h2>
            </div>

            <button
              type="button"
              className="adminSettingsTemplateBtn"
              onClick={applyPaymentTemplates}
            >
              Apply Templates
            </button>
          </div>

          <div className="adminSettingsPaymentGrid">
            <label>
              <span>Revolut instructions</span>
              <textarea
                name="revolutInstructions"
                placeholder="Revolut instructions"
                value={form.revolutInstructions}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Crypto instructions</span>
              <textarea
                name="cryptoInstructions"
                placeholder="Crypto instructions"
                value={form.cryptoInstructions}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Bank instructions</span>
              <textarea
                name="bankInstructions"
                placeholder="Bank instructions"
                value={form.bankInstructions}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>PayPal instructions</span>
              <textarea
                name="paypalInstructions"
                placeholder="PayPal instructions"
                value={form.paypalInstructions}
                onChange={handleChange}
              />
            </label>

            <label className="adminSettingsFullField">
              <span>Manual payment instructions</span>
              <textarea
                name="manualInstructions"
                placeholder="Manual payment instructions"
                value={form.manualInstructions}
                onChange={handleChange}
              />
            </label>
          </div>
        </section>

        <section className="adminSettingsSavePanel">
          <div>
            <span>Ready to publish</span>
            <strong>Save all settings</strong>
            <p>Changes will be sent to your backend settings endpoint.</p>
          </div>

          <button className="adminSettingsSaveBtn" type="submit" disabled={isSaving}>
            {isSaving ? "Saving settings..." : "Save Settings"}
          </button>
        </section>
      </form>
    </main>
  );
}

export default AdminSettings;