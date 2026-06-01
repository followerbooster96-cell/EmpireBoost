import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api.js";
import "./AdminServices.css";

const platformOptions = ["Instagram", "TikTok", "YouTube", "Facebook"];

const typeOptions = [
  "Followers",
  "Likes",
  "Views",
  "Comments",
  "Subscribers",
  "Members",
  "Streams",
  "Other",
];

const presetServices = [
  {
    name: "Instagram Followers",
    platform: "Instagram",
    category: "Followers",
    type: "Followers",
    description:
      "Affordable Instagram follower growth for creators, brands and public profiles. Clean retail pricing with simple delivery tracking.",
    pricePer1000: 2.5,
    previewSmall: "100 followers ≈ €0.25",
    min: 100,
    max: 50000,
    providerServiceId: "IG-FOLLOWERS-RETAIL",
  },
  {
    name: "Instagram Likes",
    platform: "Instagram",
    category: "Likes",
    type: "Likes",
    description:
      "Fast Instagram likes for posts, reels and campaigns. Perfect low-entry service for cheap engagement packages.",
    pricePer1000: 1.0,
    previewSmall: "100 likes ≈ €0.10",
    min: 100,
    max: 100000,
    providerServiceId: "IG-LIKES-RETAIL",
  },
  {
    name: "Instagram Views",
    platform: "Instagram",
    category: "Views",
    type: "Views",
    description:
      "Budget-friendly Instagram views for reels and video posts with strong perceived value and clean customer pricing.",
    pricePer1000: 0.55,
    previewSmall: "100 views ≈ €0.06",
    min: 100,
    max: 500000,
    providerServiceId: "IG-VIEWS-RETAIL",
  },
  {
    name: "Instagram Comments",
    platform: "Instagram",
    category: "Comments",
    type: "Comments",
    description:
      "Instagram comments for posts where customers need stronger social proof than only likes or views.",
    pricePer1000: 18.0,
    previewSmall: "100 comments ≈ €1.80",
    min: 10,
    max: 5000,
    providerServiceId: "IG-COMMENTS-RETAIL",
  },
  {
    name: "TikTok Followers",
    platform: "TikTok",
    category: "Followers",
    type: "Followers",
    description:
      "TikTok follower growth for creators who want a stronger looking profile and faster credibility.",
    pricePer1000: 3.5,
    previewSmall: "100 followers ≈ €0.35",
    min: 100,
    max: 50000,
    providerServiceId: "TT-FOLLOWERS-RETAIL",
  },
  {
    name: "TikTok Likes",
    platform: "TikTok",
    category: "Likes",
    type: "Likes",
    description:
      "Cheap TikTok likes for videos. Good entry-level service with easy selling price and strong demand.",
    pricePer1000: 0.9,
    previewSmall: "100 likes ≈ €0.09",
    min: 100,
    max: 100000,
    providerServiceId: "TT-LIKES-RETAIL",
  },
  {
    name: "TikTok Views",
    platform: "TikTok",
    category: "Views",
    type: "Views",
    description:
      "TikTok views for quick visual boost on videos. Low retail price so customers can order bigger quantities.",
    pricePer1000: 0.35,
    previewSmall: "100 views ≈ €0.04",
    min: 100,
    max: 1000000,
    providerServiceId: "TT-VIEWS-RETAIL",
  },
  {
    name: "TikTok Comments",
    platform: "TikTok",
    category: "Comments",
    type: "Comments",
    description:
      "TikTok comments for stronger activity signals and more human-looking engagement on important videos.",
    pricePer1000: 16.0,
    previewSmall: "100 comments ≈ €1.60",
    min: 10,
    max: 5000,
    providerServiceId: "TT-COMMENTS-RETAIL",
  },
  {
    name: "YouTube Subscribers",
    platform: "YouTube",
    category: "Subscribers",
    type: "Subscribers",
    description:
      "YouTube subscribers are more sensitive and usually more expensive than likes or views, so this uses safer retail pricing.",
    pricePer1000: 14.5,
    previewSmall: "100 subscribers ≈ €1.45",
    min: 100,
    max: 10000,
    providerServiceId: "YT-SUBSCRIBERS-RETAIL",
  },
  {
    name: "YouTube Views",
    platform: "YouTube",
    category: "Views",
    type: "Views",
    description:
      "YouTube video views for boosting visibility on videos, music, shorts and creator content.",
    pricePer1000: 2.2,
    previewSmall: "100 views ≈ €0.22",
    min: 100,
    max: 250000,
    providerServiceId: "YT-VIEWS-RETAIL",
  },
  {
    name: "YouTube Likes",
    platform: "YouTube",
    category: "Likes",
    type: "Likes",
    description:
      "YouTube likes for videos and shorts. Good upsell together with views for better social proof.",
    pricePer1000: 3.5,
    previewSmall: "100 likes ≈ €0.35",
    min: 50,
    max: 50000,
    providerServiceId: "YT-LIKES-RETAIL",
  },
  {
    name: "YouTube Comments",
    platform: "YouTube",
    category: "Comments",
    type: "Comments",
    description:
      "YouTube comments for videos where customers want more visible activity and stronger engagement signals.",
    pricePer1000: 24.0,
    previewSmall: "100 comments ≈ €2.40",
    min: 10,
    max: 3000,
    providerServiceId: "YT-COMMENTS-RETAIL",
  },
  {
    name: "Facebook Followers",
    platform: "Facebook",
    category: "Followers",
    type: "Followers",
    description:
      "Facebook followers for pages and profiles. Clean simple service for customers who want stronger presence.",
    pricePer1000: 4.5,
    previewSmall: "100 followers ≈ €0.45",
    min: 100,
    max: 50000,
    providerServiceId: "FB-FOLLOWERS-RETAIL",
  },
  {
    name: "Facebook Page Likes",
    platform: "Facebook",
    category: "Likes",
    type: "Likes",
    description:
      "Facebook page likes for social proof and better looking pages. Simple high-demand service.",
    pricePer1000: 3.0,
    previewSmall: "100 likes ≈ €0.30",
    min: 100,
    max: 50000,
    providerServiceId: "FB-PAGE-LIKES-RETAIL",
  },
  {
    name: "Facebook Post Likes",
    platform: "Facebook",
    category: "Likes",
    type: "Likes",
    description:
      "Facebook post likes for posts, campaigns and page activity. Cheap enough for small customer orders.",
    pricePer1000: 1.1,
    previewSmall: "100 likes ≈ €0.11",
    min: 100,
    max: 100000,
    providerServiceId: "FB-POST-LIKES-RETAIL",
  },
  {
    name: "Facebook Video Views",
    platform: "Facebook",
    category: "Views",
    type: "Views",
    description:
      "Facebook video views for reels and videos. Low-cost visual boost with strong retail margin.",
    pricePer1000: 0.75,
    previewSmall: "100 views ≈ €0.08",
    min: 100,
    max: 500000,
    providerServiceId: "FB-VIEWS-RETAIL",
  },
];

const emptyForm = {
  name: "",
  platform: "Instagram",
  category: "Followers",
  type: "Followers",
  description: "",
  pricePer1000: "",
  min: "",
  max: "",
  providerServiceId: "",
};

const floatingAdminItems = [
  "Admin",
  "Services",
  "Instagram",
  "TikTok",
  "YouTube",
  "Facebook",
  "Prices",
  "Retail",
  "Provider",
  "Profit",
  "Enabled",
  "Orders",
  "Growth",
  "EmpireBoost",
  "Control",
  "Catalog",
  "Boost",
  "Panel",
];

function formatMoney(value) {
  const number = Number(value || 0);

  return number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function cleanText(value) {
  return String(value || "").toLowerCase().trim();
}

function getPlatformIcon(platform) {
  if (platform === "Instagram") return "◎";
  if (platform === "TikTok") return "♪";
  if (platform === "YouTube") return "▶";
  if (platform === "Facebook") return "f";

  return "◆";
}

function getPlatformClass(platform) {
  if (platform === "Instagram") return "adminServicesPlatformInstagram";
  if (platform === "TikTok") return "adminServicesPlatformTikTok";
  if (platform === "YouTube") return "adminServicesPlatformYouTube";
  if (platform === "Facebook") return "adminServicesPlatformFacebook";

  return "adminServicesPlatformOther";
}

function AdminServices() {
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [form, setForm] = useState(emptyForm);

  const loadServices = async () => {
    setIsLoading(true);

    try {
      const res = await api.get("/admin/services");
      setServices(res.data.services || []);
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Failed to load services");
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const stats = useMemo(() => {
    const enabled = services.filter((service) => service.enabled).length;
    const disabled = services.length - enabled;

    const averagePrice =
      services.length === 0
        ? 0
        : services.reduce((sum, service) => sum + Number(service.pricePer1000 || 0), 0) /
          services.length;

    return {
      total: services.length,
      enabled,
      disabled,
      averagePrice,
      presets: presetServices.length,
    };
  }, [services]);

  const filteredServices = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    return services
      .filter((service) => {
        const matchesSearch =
          !cleanSearch ||
          [
            service.name,
            service.platform,
            service.type,
            service.category,
            service.description,
            service.providerServiceId,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(cleanSearch);

        const matchesPlatform = platformFilter === "All" || service.platform === platformFilter;
        const matchesType = typeFilter === "All" || service.type === typeFilter;
        const matchesStatus =
          statusFilter === "All" ||
          (statusFilter === "Enabled" && service.enabled) ||
          (statusFilter === "Disabled" && !service.enabled);

        return matchesSearch && matchesPlatform && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        const platformCompare = String(a.platform || "").localeCompare(String(b.platform || ""));
        if (platformCompare !== 0) return platformCompare;

        const typeCompare = String(a.type || "").localeCompare(String(b.type || ""));
        if (typeCompare !== 0) return typeCompare;

        return Number(a.pricePer1000 || 0) - Number(b.pricePer1000 || 0);
      });
  }, [services, search, platformFilter, typeFilter, statusFilter]);

  const missingPresets = useMemo(() => {
    const existingNames = new Set(services.map((service) => cleanText(service.name)));
    return presetServices.filter((service) => !existingNames.has(cleanText(service.name)));
  }, [services]);

  const platformGroups = useMemo(() => {
    return platformOptions.map((platform) => {
      const platformServices = services.filter((service) => service.platform === platform);
      const enabled = platformServices.filter((service) => service.enabled).length;

      return {
        platform,
        total: platformServices.length,
        enabled,
      };
    });
  }, [services]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const fillPreset = (service) => {
    setForm({
      name: service.name,
      platform: service.platform,
      category: service.category,
      type: service.type,
      description: service.description,
      pricePer1000: String(service.pricePer1000),
      min: String(service.min),
      max: String(service.max),
      providerServiceId: service.providerServiceId,
    });

    setMessageType("info");
    setMessage(`${service.name} loaded into the form. You can adjust it or create it now.`);
    window.location.hash = "admin-service-form";
  };

  const createService = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.name.trim()) {
      setMessageType("error");
      setMessage("Service name is required.");
      return;
    }

    if (Number(form.pricePer1000) <= 0 || Number(form.min) <= 0 || Number(form.max) <= 0) {
      setMessageType("error");
      setMessage("Price, min and max must be valid positive numbers.");
      return;
    }

    if (Number(form.min) > Number(form.max)) {
      setMessageType("error");
      setMessage("Min quantity cannot be higher than max quantity.");
      return;
    }

    setIsCreating(true);

    try {
      await api.post("/admin/services", {
        ...form,
        name: form.name.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        providerServiceId: form.providerServiceId.trim(),
        pricePer1000: Number(form.pricePer1000),
        min: Number(form.min),
        max: Number(form.max),
      });

      setMessageType("success");
      setMessage("Service created successfully.");

      setForm(emptyForm);
      await loadServices();
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Create service failed");
    } finally {
      setIsCreating(false);
    }
  };

  const createMissingPresetServices = async () => {
    if (missingPresets.length === 0) {
      setMessageType("info");
      setMessage("All preset services already exist.");
      return;
    }

    const confirmed = confirm(
      `Create ${missingPresets.length} missing preset services for Instagram, TikTok, YouTube and Facebook?`
    );

    if (!confirmed) return;

    setIsSeeding(true);
    setMessage("");

    let createdCount = 0;
    let failedCount = 0;

    for (const service of missingPresets) {
      try {
        await api.post("/admin/services", service);
        createdCount += 1;
      } catch (err) {
        console.log(err.response?.data || err.message);
        failedCount += 1;
      }
    }

    await loadServices();

    setMessageType(failedCount > 0 ? "error" : "success");
    setMessage(
      failedCount > 0
        ? `Created ${createdCount} services, ${failedCount} failed.`
        : `Created ${createdCount} preset services successfully.`
    );

    setIsSeeding(false);
  };

  const toggleService = async (id) => {
    try {
      await api.patch(`/admin/services/${id}/toggle`);
      setMessageType("success");
      setMessage("Service status changed.");
      await loadServices();
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Toggle failed");
    }
  };

  const deleteService = async (id) => {
    const confirmed = confirm("Delete this service?");
    if (!confirmed) return;

    try {
      await api.delete(`/admin/services/${id}`);
      setMessageType("success");
      setMessage("Service deleted successfully.");
      await loadServices();
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <main className="adminServicesPagePro">
      <div className="adminServicesAurora" aria-hidden="true">
        <span className="adminServicesAuroraOne" />
        <span className="adminServicesAuroraTwo" />
        <span className="adminServicesAuroraThree" />
        <span className="adminServicesAuroraFour" />
      </div>

      <div className="adminServicesFloatingLayer" aria-hidden="true">
        {floatingAdminItems.map((item, index) => (
          <span
            className={`adminServicesFloat adminServicesFloat${index + 1}`}
            key={`${item}-${index}`}
          >
            {item}
          </span>
        ))}
      </div>

      <section className="adminServicesHeroPro">
        <div className="adminServicesHeroContent">
          <div className="adminServicesBadgePro">
            <span />
            EmpireBoost service control
          </div>

          <h1>Build your public service catalog like a real SMM brand.</h1>

          <p>
            Manage Instagram, TikTok, YouTube and Facebook services with clean retail prices,
            preset seed services, filters and one-click enable or disable control.
          </p>

          <div className="adminServicesHeroActions">
            <a href="#admin-service-form" className="adminServicesPrimaryBtn">
              Add Service
            </a>

            <button
              type="button"
              className="adminServicesSecondaryBtn"
              onClick={createMissingPresetServices}
              disabled={isSeeding}
            >
              {isSeeding ? "Creating presets..." : "Create Missing Presets"}
            </button>
          </div>
        </div>

        <aside className="adminServicesInfoCard">
          <div className="adminServicesInfoGlow" />

          <span>Total services</span>
          <strong>{stats.total}</strong>
          <small>{missingPresets.length} preset services still missing</small>

          <div className="adminServicesInfoMiniGrid">
            <div>
              <span>Enabled</span>
              <b>{stats.enabled}</b>
            </div>

            <div>
              <span>Avg. price</span>
              <b>€{formatMoney(stats.averagePrice)}</b>
            </div>
          </div>
        </aside>
      </section>

      {message && (
        <section className={`adminServicesMessage adminServicesMessage-${messageType}`}>
          <span>{messageType === "success" ? "✓" : messageType === "error" ? "!" : "i"}</span>
          <p>{message}</p>
        </section>
      )}

      <section className="adminServicesStatsGrid">
        <article className="adminServicesStatCard adminServicesStatMain">
          <span>Total services</span>
          <strong>{stats.total}</strong>
          <small>All services in database</small>
        </article>

        <article className="adminServicesStatCard">
          <span>Enabled</span>
          <strong>{stats.enabled}</strong>
          <small>Visible on public services page</small>
        </article>

        <article className="adminServicesStatCard">
          <span>Disabled</span>
          <strong>{stats.disabled}</strong>
          <small>Hidden from customers</small>
        </article>

        <article className="adminServicesStatCard">
          <span>Preset catalog</span>
          <strong>{stats.presets}</strong>
          <small>Instagram, TikTok, YouTube, Facebook</small>
        </article>
      </section>

      <section className="adminServicesPlatformGrid">
        {platformGroups.map((group) => (
          <article
            className={`adminServicesPlatformCard ${getPlatformClass(group.platform)}`}
            key={group.platform}
          >
            <div className="adminServicesPlatformIcon">{getPlatformIcon(group.platform)}</div>

            <div>
              <span>{group.platform}</span>
              <strong>{group.total} services</strong>
              <p>{group.enabled} enabled in your catalog</p>
            </div>
          </article>
        ))}
      </section>

      <section className="adminServicesMainGrid">
        <form
          className="adminServicesPanel adminServicesCreatePanel"
          id="admin-service-form"
          onSubmit={createService}
        >
          <div className="adminServicesPanelHeader">
            <div>
              <span>Create service</span>
              <h2>Add New Service</h2>
            </div>

            <div className="adminServicesPanelIcon">+</div>
          </div>

          <div className="adminServicesFormGrid">
            <label>
              <span>Service name</span>
              <input
                name="name"
                placeholder="Example: Instagram Followers"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Platform</span>
              <select name="platform" value={form.platform} onChange={handleChange}>
                {platformOptions.map((platform) => (
                  <option value={platform} key={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Type</span>
              <select name="type" value={form.type} onChange={handleChange}>
                {typeOptions.map((type) => (
                  <option value={type} key={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Category</span>
              <input
                name="category"
                placeholder="Example: Followers"
                value={form.category}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Price per 1000</span>
              <input
                name="pricePer1000"
                placeholder="Example: 2.50"
                type="number"
                step="0.01"
                min="0.01"
                value={form.pricePer1000}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Min quantity</span>
              <input
                name="min"
                placeholder="Example: 100"
                type="number"
                min="1"
                value={form.min}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Max quantity</span>
              <input
                name="max"
                placeholder="Example: 50000"
                type="number"
                min="1"
                value={form.max}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Provider service ID</span>
              <input
                name="providerServiceId"
                placeholder="Optional internal/provider ID"
                value={form.providerServiceId}
                onChange={handleChange}
              />
            </label>

            <label className="adminServicesFullField">
              <span>Description</span>
              <textarea
                name="description"
                placeholder="Short customer-facing service description..."
                value={form.description}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="adminServicesPricePreview">
            <div>
              <span>Customer preview</span>
              <strong>
                100 units ≈ €{formatMoney((Number(form.pricePer1000 || 0) / 1000) * 100)}
              </strong>
              <p>
                Price per 1000: €{formatMoney(form.pricePer1000)} · Min {form.min || "-"} · Max{" "}
                {form.max || "-"}
              </p>
            </div>

            <div className="adminServicesPricePulse">€</div>
          </div>

          <button className="adminServicesCreateBtn" type="submit" disabled={isCreating}>
            {isCreating ? "Creating service..." : "Create Service"}
          </button>
        </form>

        <aside className="adminServicesPanel adminServicesPresetPanel">
          <div className="adminServicesPanelHeader">
            <div>
              <span>Preset services</span>
              <h2>Retail Catalog</h2>
            </div>

            <div className="adminServicesPanelIcon">{missingPresets.length}</div>
          </div>

          <div className="adminServicesPresetInfo">
            <span>Pricing logic</span>
            <strong>Provider-style low base price × retail margin.</strong>
            <p>
              These presets are simple customer-facing services, not dozens of provider duplicates.
              One clean service per main product keeps the website easy to understand.
            </p>
          </div>

          <div className="adminServicesPresetList">
            {presetServices.map((service) => {
              const exists = services.some(
                (existingService) => cleanText(existingService.name) === cleanText(service.name)
              );

              return (
                <button
                  type="button"
                  className={`adminServicesPresetButton ${exists ? "adminServicesPresetExists" : ""}`}
                  key={service.name}
                  onClick={() => fillPreset(service)}
                >
                  <div className={getPlatformClass(service.platform)}>
                    {getPlatformIcon(service.platform)}
                  </div>

                  <section>
                    <span>
                      {service.platform} · {service.type}
                    </span>
                    <strong>{service.name}</strong>
                    <p>
                      €{formatMoney(service.pricePer1000)} / 1000 · {service.previewSmall}
                    </p>
                  </section>

                  <b>{exists ? "Exists" : "Use"}</b>
                </button>
              );
            })}
          </div>
        </aside>
      </section>

      <section className="adminServicesPanel adminServicesTablePanel">
        <div className="adminServicesPanelHeader">
          <div>
            <span>Service database</span>
            <h2>All Services</h2>
          </div>

          <div className="adminServicesPanelIcon">{filteredServices.length}</div>
        </div>

        <div className="adminServicesToolbar">
          <label className="adminServicesSearchBox">
            <span>Search</span>
            <input
              type="text"
              placeholder="Search name, platform, provider ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <label>
            <span>Platform</span>
            <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}>
              <option>All</option>
              {platformOptions.map((platform) => (
                <option value={platform} key={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Type</span>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option>All</option>
              {typeOptions.map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Status</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option>All</option>
              <option>Enabled</option>
              <option>Disabled</option>
            </select>
          </label>
        </div>

        {isLoading ? (
          <div className="adminServicesSkeletonList">
            <span />
            <span />
            <span />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="adminServicesEmptyBox">
            <strong>No services found</strong>
            <span>
              Create a service manually or use the preset catalog for Instagram, TikTok, YouTube and
              Facebook.
            </span>
          </div>
        ) : (
          <>
            <div className="adminServicesTableWrap">
              <table className="adminServicesTable">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Platform</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Min / Max</th>
                    <th>Status</th>
                    <th>Provider ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredServices.map((service) => (
                    <tr key={service._id}>
                      <td>
                        <div className="adminServicesNameCell">
                          <strong>{service.name}</strong>
                          <span>{service.description || "No description added"}</span>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`adminServicesPlatformPill ${getPlatformClass(
                            service.platform
                          )}`}
                        >
                          {getPlatformIcon(service.platform)} {service.platform}
                        </span>
                      </td>

                      <td>
                        <span className="adminServicesTypePill">{service.type}</span>
                      </td>

                      <td>
                        <strong className="adminServicesPriceText">
                          €{formatMoney(service.pricePer1000)}
                        </strong>
                        <small>per 1000</small>
                      </td>

                      <td>
                        <span className="adminServicesRangeText">
                          {service.min} - {service.max}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`adminServicesStatusPill ${
                            service.enabled
                              ? "adminServicesStatusEnabled"
                              : "adminServicesStatusDisabled"
                          }`}
                        >
                          {service.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </td>

                      <td>
                        <span className="adminServicesProviderId">
                          {service.providerServiceId || "-"}
                        </span>
                      </td>

                      <td>
                        <div className="adminServicesActionGroup">
                          <button type="button" onClick={() => toggleService(service._id)}>
                            {service.enabled ? "Disable" : "Enable"}
                          </button>

                          <button
                            type="button"
                            className="adminServicesDangerBtn"
                            onClick={() => deleteService(service._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="adminServicesMobileList">
              {filteredServices.map((service) => (
                <article className="adminServicesMobileCard" key={`mobile-${service._id}`}>
                  <div className="adminServicesMobileTop">
                    <span className={`adminServicesMobileIcon ${getPlatformClass(service.platform)}`}>
                      {getPlatformIcon(service.platform)}
                    </span>

                    <div>
                      <strong>{service.name}</strong>
                      <small>
                        {service.platform} · {service.type}
                      </small>
                    </div>
                  </div>

                  <p>{service.description || "No description added"}</p>

                  <div className="adminServicesMobileMeta">
                    <div>
                      <span>Price</span>
                      <b>€{formatMoney(service.pricePer1000)} / 1000</b>
                    </div>

                    <div>
                      <span>Min / Max</span>
                      <b>
                        {service.min} - {service.max}
                      </b>
                    </div>
                  </div>

                  <div className="adminServicesMobileBottom">
                    <span
                      className={`adminServicesStatusPill ${
                        service.enabled
                          ? "adminServicesStatusEnabled"
                          : "adminServicesStatusDisabled"
                      }`}
                    >
                      {service.enabled ? "Enabled" : "Disabled"}
                    </span>

                    <div className="adminServicesActionGroup">
                      <button type="button" onClick={() => toggleService(service._id)}>
                        {service.enabled ? "Disable" : "Enable"}
                      </button>

                      <button
                        type="button"
                        className="adminServicesDangerBtn"
                        onClick={() => deleteService(service._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default AdminServices;