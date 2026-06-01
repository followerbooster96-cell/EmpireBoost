import dotenv from "dotenv";
import mongoose from "mongoose";
import Service from "../src/models/Service.js";

dotenv.config();

const services = [
  {
    name: "Instagram Followers",
    platform: "Instagram",
    category: "Followers",
    type: "Followers",
    description:
      "Affordable Instagram follower growth for creators, brands and public profiles. Clean retail pricing with simple delivery tracking.",
    pricePer1000: 5.0,
    min: 100,
    max: 50000,
    enabled: true,
    providerServiceId: "IG-FOLLOWERS-RETAIL",
  },
  {
    name: "Instagram Likes",
    platform: "Instagram",
    category: "Likes",
    type: "Likes",
    description:
      "Fast Instagram likes for posts, reels and campaigns. Perfect low-entry service for cheap engagement packages.",
    pricePer1000: 2.0,
    min: 100,
    max: 100000,
    enabled: true,
    providerServiceId: "IG-LIKES-RETAIL",
  },
  {
    name: "Instagram Views",
    platform: "Instagram",
    category: "Views",
    type: "Views",
    description:
      "Budget-friendly Instagram views for reels and video posts with strong perceived value and clean customer pricing.",
    pricePer1000: 1.1,
    min: 100,
    max: 500000,
    enabled: true,
    providerServiceId: "IG-VIEWS-RETAIL",
  },
  {
    name: "Instagram Comments",
    platform: "Instagram",
    category: "Comments",
    type: "Comments",
    description:
      "Instagram comments for posts where customers need stronger social proof than only likes or views.",
    pricePer1000: 36.0,
    min: 10,
    max: 5000,
    enabled: true,
    providerServiceId: "IG-COMMENTS-RETAIL",
  },
  {
    name: "Instagram Live Views 15 Minutes",
    platform: "Instagram",
    category: "Live Views",
    type: "Views",
    description:
      "Instagram live viewers for 15 minute livestream boosts. Price includes a live delivery premium for short active sessions.",
    pricePer1000: 5.0,
    min: 100,
    max: 20000,
    enabled: true,
    providerServiceId: "IG-LIVE-VIEWS-15M-RETAIL",
  },
  {
    name: "Instagram Live Views 30 Minutes",
    platform: "Instagram",
    category: "Live Views",
    type: "Views",
    description:
      "Instagram live viewers for 30 minute streams. Longer live activity with a stronger premium than 15 minute delivery.",
    pricePer1000: 9.5,
    min: 100,
    max: 20000,
    enabled: true,
    providerServiceId: "IG-LIVE-VIEWS-30M-RETAIL",
  },

  {
    name: "TikTok Followers",
    platform: "TikTok",
    category: "Followers",
    type: "Followers",
    description:
      "TikTok follower growth for creators who want a stronger looking profile and faster credibility.",
    pricePer1000: 7.0,
    min: 100,
    max: 50000,
    enabled: true,
    providerServiceId: "TT-FOLLOWERS-RETAIL",
  },
  {
    name: "TikTok Likes",
    platform: "TikTok",
    category: "Likes",
    type: "Likes",
    description:
      "Cheap TikTok likes for videos. Good entry-level service with easy selling price and strong demand.",
    pricePer1000: 1.8,
    min: 100,
    max: 100000,
    enabled: true,
    providerServiceId: "TT-LIKES-RETAIL",
  },
  {
    name: "TikTok Views",
    platform: "TikTok",
    category: "Views",
    type: "Views",
    description:
      "TikTok views for quick visual boost on videos. Low retail price so customers can order bigger quantities.",
    pricePer1000: 0.7,
    min: 100,
    max: 1000000,
    enabled: true,
    providerServiceId: "TT-VIEWS-RETAIL",
  },
  {
    name: "TikTok Comments",
    platform: "TikTok",
    category: "Comments",
    type: "Comments",
    description:
      "TikTok comments for stronger activity signals and more human-looking engagement on important videos.",
    pricePer1000: 32.0,
    min: 10,
    max: 5000,
    enabled: true,
    providerServiceId: "TT-COMMENTS-RETAIL",
  },
  {
    name: "TikTok Live Views 15 Minutes",
    platform: "TikTok",
    category: "Live Views",
    type: "Views",
    description:
      "TikTok live viewers for 15 minute livestream boosts. Built for quick social proof during live sessions.",
    pricePer1000: 5.5,
    min: 100,
    max: 30000,
    enabled: true,
    providerServiceId: "TT-LIVE-VIEWS-15M-RETAIL",
  },
  {
    name: "TikTok Live Views 30 Minutes",
    platform: "TikTok",
    category: "Live Views",
    type: "Views",
    description:
      "TikTok live viewers for 30 minute streams. Longer delivery window with higher live activity premium.",
    pricePer1000: 10.0,
    min: 100,
    max: 30000,
    enabled: true,
    providerServiceId: "TT-LIVE-VIEWS-30M-RETAIL",
  },

  {
    name: "YouTube Subscribers",
    platform: "YouTube",
    category: "Subscribers",
    type: "Subscribers",
    description:
      "YouTube subscribers are more sensitive and usually more expensive than likes or views, so this uses safer retail pricing.",
    pricePer1000: 29.0,
    min: 100,
    max: 10000,
    enabled: true,
    providerServiceId: "YT-SUBSCRIBERS-RETAIL",
  },
  {
    name: "YouTube Views",
    platform: "YouTube",
    category: "Views",
    type: "Views",
    description:
      "YouTube video views for boosting visibility on videos, music, shorts and creator content.",
    pricePer1000: 4.4,
    min: 100,
    max: 250000,
    enabled: true,
    providerServiceId: "YT-VIEWS-RETAIL",
  },
  {
    name: "YouTube Shorts Views",
    platform: "YouTube",
    category: "Views",
    type: "Views",
    description:
      "YouTube Shorts views for creators who want quick visibility and stronger looking short-form content.",
    pricePer1000: 3.0,
    min: 100,
    max: 500000,
    enabled: true,
    providerServiceId: "YT-SHORTS-VIEWS-RETAIL",
  },
  {
    name: "YouTube Likes",
    platform: "YouTube",
    category: "Likes",
    type: "Likes",
    description:
      "YouTube likes for videos and shorts. Good upsell together with views for better social proof.",
    pricePer1000: 7.0,
    min: 50,
    max: 50000,
    enabled: true,
    providerServiceId: "YT-LIKES-RETAIL",
  },
  {
    name: "YouTube Comments",
    platform: "YouTube",
    category: "Comments",
    type: "Comments",
    description:
      "YouTube comments for videos where customers want more visible activity and stronger engagement signals.",
    pricePer1000: 48.0,
    min: 10,
    max: 3000,
    enabled: true,
    providerServiceId: "YT-COMMENTS-RETAIL",
  },
  {
    name: "YouTube Live Views 15 Minutes",
    platform: "YouTube",
    category: "Live Views",
    type: "Views",
    description:
      "YouTube live viewers for 15 minute streams, premieres and live sessions. Built as a premium live boost service.",
    pricePer1000: 8.0,
    min: 100,
    max: 20000,
    enabled: true,
    providerServiceId: "YT-LIVE-VIEWS-15M-RETAIL",
  },
  {
    name: "YouTube Live Views 30 Minutes",
    platform: "YouTube",
    category: "Live Views",
    type: "Views",
    description:
      "YouTube live viewers for 30 minute livestream visibility. Higher retail price because live delivery is more sensitive.",
    pricePer1000: 14.0,
    min: 100,
    max: 20000,
    enabled: true,
    providerServiceId: "YT-LIVE-VIEWS-30M-RETAIL",
  },

  {
    name: "Facebook Followers",
    platform: "Facebook",
    category: "Followers",
    type: "Followers",
    description:
      "Facebook followers for pages and profiles. Clean simple service for customers who want stronger presence.",
    pricePer1000: 9.0,
    min: 100,
    max: 50000,
    enabled: true,
    providerServiceId: "FB-FOLLOWERS-RETAIL",
  },
  {
    name: "Facebook Page Likes",
    platform: "Facebook",
    category: "Likes",
    type: "Likes",
    description:
      "Facebook page likes for social proof and better looking pages. Simple high-demand service.",
    pricePer1000: 6.0,
    min: 100,
    max: 50000,
    enabled: true,
    providerServiceId: "FB-PAGE-LIKES-RETAIL",
  },
  {
    name: "Facebook Post Likes",
    platform: "Facebook",
    category: "Likes",
    type: "Likes",
    description:
      "Facebook post likes for posts, campaigns and page activity. Cheap enough for small customer orders.",
    pricePer1000: 2.2,
    min: 100,
    max: 100000,
    enabled: true,
    providerServiceId: "FB-POST-LIKES-RETAIL",
  },
  {
    name: "Facebook Video Views",
    platform: "Facebook",
    category: "Views",
    type: "Views",
    description:
      "Facebook video views for reels and videos. Low-cost visual boost with strong retail margin.",
    pricePer1000: 1.5,
    min: 100,
    max: 500000,
    enabled: true,
    providerServiceId: "FB-VIEWS-RETAIL",
  },
  {
    name: "Facebook Live Views 15 Minutes",
    platform: "Facebook",
    category: "Live Views",
    type: "Views",
    description:
      "Facebook live viewers for 15 minute livestream boosts on pages, profiles and events.",
    pricePer1000: 6.0,
    min: 100,
    max: 20000,
    enabled: true,
    providerServiceId: "FB-LIVE-VIEWS-15M-RETAIL",
  },
  {
    name: "Facebook Live Views 30 Minutes",
    platform: "Facebook",
    category: "Live Views",
    type: "Views",
    description:
      "Facebook live viewers for 30 minute livestream boosts. Longer delivery window with higher live premium.",
    pricePer1000: 10.0,
    min: 100,
    max: 20000,
    enabled: true,
    providerServiceId: "FB-LIVE-VIEWS-30M-RETAIL",
  },

  {
    name: "X Followers",
    platform: "X",
    category: "Followers",
    type: "Followers",
    description:
      "X followers for profiles that need stronger social proof and a cleaner first impression.",
    pricePer1000: 8.0,
    min: 100,
    max: 30000,
    enabled: true,
    providerServiceId: "X-FOLLOWERS-RETAIL",
  },
  {
    name: "X Likes",
    platform: "X",
    category: "Likes",
    type: "Likes",
    description:
      "X likes for posts and campaigns. Good for engagement boosts on important posts.",
    pricePer1000: 3.0,
    min: 50,
    max: 50000,
    enabled: true,
    providerServiceId: "X-LIKES-RETAIL",
  },
  {
    name: "X Views",
    platform: "X",
    category: "Views",
    type: "Views",
    description:
      "X post views for visibility and social proof. Low-entry price for larger quantity orders.",
    pricePer1000: 1.2,
    min: 100,
    max: 500000,
    enabled: true,
    providerServiceId: "X-VIEWS-RETAIL",
  },
  {
    name: "X Reposts",
    platform: "X",
    category: "Reposts",
    type: "Other",
    description:
      "X reposts for stronger distribution and more activity around important posts.",
    pricePer1000: 10.0,
    min: 25,
    max: 10000,
    enabled: true,
    providerServiceId: "X-REPOSTS-RETAIL",
  },

  {
    name: "Telegram Members",
    platform: "Telegram",
    category: "Members",
    type: "Members",
    description:
      "Telegram members for channels and groups. Good for communities that need a stronger starting base.",
    pricePer1000: 5.5,
    min: 100,
    max: 50000,
    enabled: true,
    providerServiceId: "TG-MEMBERS-RETAIL",
  },
  {
    name: "Telegram Post Views",
    platform: "Telegram",
    category: "Views",
    type: "Views",
    description:
      "Telegram post views for channel posts. Cheap and simple visibility boost for announcements and campaigns.",
    pricePer1000: 0.9,
    min: 100,
    max: 500000,
    enabled: true,
    providerServiceId: "TG-POST-VIEWS-RETAIL",
  },
  {
    name: "Telegram Reactions",
    platform: "Telegram",
    category: "Reactions",
    type: "Likes",
    description:
      "Telegram reactions for posts where customers want more visible engagement and trust signals.",
    pricePer1000: 4.0,
    min: 50,
    max: 50000,
    enabled: true,
    providerServiceId: "TG-REACTIONS-RETAIL",
  },

  {
    name: "Spotify Plays",
    platform: "Spotify",
    category: "Streams",
    type: "Streams",
    description:
      "Spotify plays for tracks, artists and music campaigns. Retail priced for creators and small music brands.",
    pricePer1000: 4.5,
    min: 100,
    max: 500000,
    enabled: true,
    providerServiceId: "SPOTIFY-PLAYS-RETAIL",
  },
  {
    name: "Spotify Followers",
    platform: "Spotify",
    category: "Followers",
    type: "Followers",
    description:
      "Spotify followers for artist profiles and playlists. Strong add-on service for music growth packages.",
    pricePer1000: 10.0,
    min: 100,
    max: 50000,
    enabled: true,
    providerServiceId: "SPOTIFY-FOLLOWERS-RETAIL",
  },
  {
    name: "Spotify Playlist Followers",
    platform: "Spotify",
    category: "Followers",
    type: "Followers",
    description:
      "Spotify playlist followers for playlist owners who want stronger social proof and better looking playlists.",
    pricePer1000: 12.0,
    min: 100,
    max: 30000,
    enabled: true,
    providerServiceId: "SPOTIFY-PLAYLIST-FOLLOWERS-RETAIL",
  },

  {
    name: "Twitch Followers",
    platform: "Twitch",
    category: "Followers",
    type: "Followers",
    description:
      "Twitch followers for streamers who want a stronger looking channel and better first impression.",
    pricePer1000: 7.5,
    min: 100,
    max: 50000,
    enabled: true,
    providerServiceId: "TWITCH-FOLLOWERS-RETAIL",
  },
  {
    name: "Twitch Live Views 15 Minutes",
    platform: "Twitch",
    category: "Live Views",
    type: "Views",
    description:
      "Twitch live viewers for 15 minute livestream boosts. Good for short streams and launch moments.",
    pricePer1000: 6.0,
    min: 100,
    max: 20000,
    enabled: true,
    providerServiceId: "TWITCH-LIVE-VIEWS-15M-RETAIL",
  },
  {
    name: "Twitch Live Views 30 Minutes",
    platform: "Twitch",
    category: "Live Views",
    type: "Views",
    description:
      "Twitch live viewers for 30 minute streams. More premium because live viewers are more sensitive than normal views.",
    pricePer1000: 11.5,
    min: 100,
    max: 20000,
    enabled: true,
    providerServiceId: "TWITCH-LIVE-VIEWS-30M-RETAIL",
  },
  {
    name: "Twitch Live Views 60 Minutes",
    platform: "Twitch",
    category: "Live Views",
    type: "Views",
    description:
      "Twitch live viewers for 60 minute livestream sessions. Premium long-duration live boost for stronger visibility.",
    pricePer1000: 21.0,
    min: 100,
    max: 15000,
    enabled: true,
    providerServiceId: "TWITCH-LIVE-VIEWS-60M-RETAIL",
  },
];

async function seedServices() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connected to MongoDB");
    console.log(`🚀 Seeding ${services.length} services...`);

    let createdOrUpdated = 0;

    for (const service of services) {
      await Service.findOneAndUpdate(
        { name: service.name },
        {
          $set: {
            ...service,
            enabled: true,
          },
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
        }
      );

      createdOrUpdated += 1;
      console.log(`✅ ${service.name} — €${service.pricePer1000}/1000`);
    }

    console.log(`\n🔥 Done. ${createdOrUpdated} services created/updated.`);
    console.log("✅ Existing services updated with new prices.");
    console.log("✅ Live views updated with +€3 for 15 min, +€6 for 30 min, +€12 for 60 min.");
    console.log("✅ All services are enabled and should appear on /services.");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:");
    console.error(err.message);

    await mongoose.disconnect();
    process.exit(1);
  }
}

seedServices();