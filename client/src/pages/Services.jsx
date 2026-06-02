import { useEffect, useMemo, useState } from "react";
import api from "../lib/api.js";
import useCurrency from "../lib/useCurrency.js";
import {
  getStoredLanguage,
  getTranslations,
} from "../lib/language.js";
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

const SERVICES_TRANSLATIONS = {
  en: {
    all: "All",
    other: "Other",
    followers: "Followers",
    likes: "Likes",
    views: "Views",
    comments: "Comments",
    subscribers: "Subscribers",
    members: "Members",
    streams: "Streams",

    bestMatch: "Best match",
    lowestPrice: "Lowest price",
    highestPrice: "Highest price",
    highestMaxQuantity: "Highest max quantity",

    heroBadge: "Social growth marketplace",
    heroTitle: "Premium services built for creators who want clean, fast growth.",
    heroText:
      "Select a platform, choose the right package, paste your link and see the price instantly. Everything is designed to feel simple, serious and professional.",
    totalServices: "Total services",
    livePackages: "live packages available",
    platforms: "Platforms",
    majorNetworks: "major networks covered",
    startingFrom: "Starting from",
    shownIn: "shown in",
    serviceTypes: "Service types",
    growthOptionsReady: "growth options ready",
    browseMarketplace: "Browse Marketplace",
    clearFilters: "Clear Filters",
    pricesInfoStart: "Prices are stored and charged in EUR. You are viewing converted prices in",
    pricesInfoEnd: "for easier understanding.",

    failedLoad: "Failed to load services.",
    loginBeforeOrder: "Please log in before creating an order.",
    enterValidLink: "Please enter a valid link before creating the order.",
    quantityBetween: "Quantity must be between",
    and: "and",
    orderFailed: "Order failed.",
    orderCreated: "Order created successfully. New balance:",

    controlCenter: "Control center",
    findPerfectService: "Find the perfect service",
    controlText:
      "Use filters or search directly by platform, package name or service type.",
    matchingServices: "matching services",
    searchPlaceholder:
      "Search Instagram followers, TikTok views, YouTube likes...",
    allServiceTypes: "All service types",

    noServicesFound: "No services found",
    noServicesText:
      "Nothing matches these filters right now. Clear filters or try a different search term.",
    resetMarketplace: "Reset marketplace",

    pricePer1000: "Price / 1000",
    minimum: "Minimum",
    maximum: "Maximum",
    orderSetup: "Order setup",
    orderSetupText: "Paste link, quantity and launch.",
    targetLink: "Target link",
    targetPlaceholder: "Profile, video, post or channel link",
    quantity: "Quantity",
    enterQuantity: "Enter quantity to see the live price.",
    minimumQuantity: "Minimum quantity is",
    maximumQuantity: "Maximum quantity is",
    quantityGood: "Quantity looks good.",
    totalPrice: "Total price",
    calculatedLive: "Calculated live · shown in",
    creatingOrder: "Creating order...",
    createOrder: "Create Order",
    orderCurrencyInfoStart: "Order is charged in EUR. Display price is converted to",
  },

  de: {
    all: "Alle",
    other: "Andere",
    followers: "Follower",
    likes: "Likes",
    views: "Views",
    comments: "Kommentare",
    subscribers: "Abonnenten",
    members: "Mitglieder",
    streams: "Streams",

    bestMatch: "Beste Treffer",
    lowestPrice: "Niedrigster Preis",
    highestPrice: "Höchster Preis",
    highestMaxQuantity: "Höchste Maximalmenge",

    heroBadge: "Social Growth Marketplace",
    heroTitle: "Premium Services für Creator, die cleanes und schnelles Wachstum wollen.",
    heroText:
      "Wähle eine Plattform, such das passende Paket, füge deinen Link ein und sieh den Preis sofort. Alles ist einfach, seriös und professionell aufgebaut.",
    totalServices: "Services gesamt",
    livePackages: "aktive Pakete verfügbar",
    platforms: "Plattformen",
    majorNetworks: "große Netzwerke abgedeckt",
    startingFrom: "Ab",
    shownIn: "angezeigt in",
    serviceTypes: "Service-Arten",
    growthOptionsReady: "Growth-Optionen bereit",
    browseMarketplace: "Marketplace ansehen",
    clearFilters: "Filter löschen",
    pricesInfoStart:
      "Preise werden in EUR gespeichert und berechnet. Du siehst umgerechnete Preise in",
    pricesInfoEnd: "zum besseren Verständnis.",

    failedLoad: "Services konnten nicht geladen werden.",
    loginBeforeOrder: "Bitte logge dich ein, bevor du eine Bestellung erstellst.",
    enterValidLink: "Bitte gib einen gültigen Link ein, bevor du bestellst.",
    quantityBetween: "Die Menge muss zwischen",
    and: "und",
    orderFailed: "Bestellung fehlgeschlagen.",
    orderCreated: "Bestellung erfolgreich erstellt. Neues Guthaben:",

    controlCenter: "Control Center",
    findPerfectService: "Finde den perfekten Service",
    controlText:
      "Nutze Filter oder suche direkt nach Plattform, Paketname oder Service-Art.",
    matchingServices: "passende Services",
    searchPlaceholder:
      "Suche Instagram Follower, TikTok Views, YouTube Likes...",
    allServiceTypes: "Alle Service-Arten",

    noServicesFound: "Keine Services gefunden",
    noServicesText:
      "Aktuell passt nichts zu diesen Filtern. Lösche die Filter oder versuche einen anderen Suchbegriff.",
    resetMarketplace: "Marketplace zurücksetzen",

    pricePer1000: "Preis / 1000",
    minimum: "Minimum",
    maximum: "Maximum",
    orderSetup: "Bestellung einrichten",
    orderSetupText: "Link einfügen, Menge wählen und starten.",
    targetLink: "Ziel-Link",
    targetPlaceholder: "Profil-, Video-, Post- oder Channel-Link",
    quantity: "Menge",
    enterQuantity: "Gib eine Menge ein, um den Live-Preis zu sehen.",
    minimumQuantity: "Mindestmenge ist",
    maximumQuantity: "Maximalmenge ist",
    quantityGood: "Menge sieht gut aus.",
    totalPrice: "Gesamtpreis",
    calculatedLive: "Live berechnet · angezeigt in",
    creatingOrder: "Bestellung wird erstellt...",
    createOrder: "Bestellung erstellen",
    orderCurrencyInfoStart:
      "Bestellung wird in EUR berechnet. Der angezeigte Preis ist umgerechnet in",
  },

  es: {
    all: "Todo",
    other: "Otro",
    followers: "Seguidores",
    likes: "Likes",
    views: "Vistas",
    comments: "Comentarios",
    subscribers: "Suscriptores",
    members: "Miembros",
    streams: "Streams",

    bestMatch: "Mejor resultado",
    lowestPrice: "Precio más bajo",
    highestPrice: "Precio más alto",
    highestMaxQuantity: "Mayor cantidad máxima",

    heroBadge: "Marketplace de crecimiento social",
    heroTitle: "Servicios premium para creadores que quieren crecimiento limpio y rápido.",
    heroText:
      "Selecciona una plataforma, elige el paquete correcto, pega tu link y ve el precio al instante. Todo está diseñado para ser simple, serio y profesional.",
    totalServices: "Servicios totales",
    livePackages: "paquetes activos disponibles",
    platforms: "Plataformas",
    majorNetworks: "redes principales cubiertas",
    startingFrom: "Desde",
    shownIn: "mostrado en",
    serviceTypes: "Tipos de servicio",
    growthOptionsReady: "opciones de crecimiento listas",
    browseMarketplace: "Ver Marketplace",
    clearFilters: "Limpiar filtros",
    pricesInfoStart:
      "Los precios se guardan y cobran en EUR. Estás viendo precios convertidos en",
    pricesInfoEnd: "para entenderlo más fácil.",

    failedLoad: "No se pudieron cargar los servicios.",
    loginBeforeOrder: "Inicia sesión antes de crear un pedido.",
    enterValidLink: "Introduce un link válido antes de crear el pedido.",
    quantityBetween: "La cantidad debe estar entre",
    and: "y",
    orderFailed: "Pedido fallido.",
    orderCreated: "Pedido creado correctamente. Nuevo saldo:",

    controlCenter: "Centro de control",
    findPerfectService: "Encuentra el servicio perfecto",
    controlText:
      "Usa filtros o busca directamente por plataforma, nombre del paquete o tipo de servicio.",
    matchingServices: "servicios encontrados",
    searchPlaceholder:
      "Buscar Instagram followers, TikTok views, YouTube likes...",
    allServiceTypes: "Todos los tipos",

    noServicesFound: "No se encontraron servicios",
    noServicesText:
      "Nada coincide con estos filtros ahora. Limpia los filtros o prueba otro término.",
    resetMarketplace: "Resetear marketplace",

    pricePer1000: "Precio / 1000",
    minimum: "Mínimo",
    maximum: "Máximo",
    orderSetup: "Configurar pedido",
    orderSetupText: "Pega link, cantidad y lanza.",
    targetLink: "Link objetivo",
    targetPlaceholder: "Link de perfil, video, post o canal",
    quantity: "Cantidad",
    enterQuantity: "Introduce cantidad para ver el precio en vivo.",
    minimumQuantity: "La cantidad mínima es",
    maximumQuantity: "La cantidad máxima es",
    quantityGood: "La cantidad está bien.",
    totalPrice: "Precio total",
    calculatedLive: "Calculado en vivo · mostrado en",
    creatingOrder: "Creando pedido...",
    createOrder: "Crear pedido",
    orderCurrencyInfoStart:
      "El pedido se cobra en EUR. El precio mostrado está convertido a",
  },

  fr: {
    all: "Tous",
    other: "Autre",
    followers: "Followers",
    likes: "Likes",
    views: "Vues",
    comments: "Commentaires",
    subscribers: "Abonnés",
    members: "Membres",
    streams: "Streams",

    bestMatch: "Meilleur résultat",
    lowestPrice: "Prix le plus bas",
    highestPrice: "Prix le plus haut",
    highestMaxQuantity: "Quantité max la plus haute",

    heroBadge: "Marketplace de croissance sociale",
    heroTitle: "Services premium pour créateurs qui veulent une croissance propre et rapide.",
    heroText:
      "Sélectionnez une plateforme, choisissez le bon package, collez votre lien et voyez le prix instantanément. Tout est simple, sérieux et professionnel.",
    totalServices: "Services total",
    livePackages: "packages actifs disponibles",
    platforms: "Plateformes",
    majorNetworks: "réseaux majeurs couverts",
    startingFrom: "À partir de",
    shownIn: "affiché en",
    serviceTypes: "Types de service",
    growthOptionsReady: "options de croissance prêtes",
    browseMarketplace: "Voir Marketplace",
    clearFilters: "Effacer filtres",
    pricesInfoStart:
      "Les prix sont stockés et facturés en EUR. Vous voyez des prix convertis en",
    pricesInfoEnd: "pour mieux comprendre.",

    failedLoad: "Échec du chargement des services.",
    loginBeforeOrder: "Connectez-vous avant de créer une commande.",
    enterValidLink: "Entrez un lien valide avant de créer la commande.",
    quantityBetween: "La quantité doit être entre",
    and: "et",
    orderFailed: "Commande échouée.",
    orderCreated: "Commande créée avec succès. Nouveau solde :",

    controlCenter: "Centre de contrôle",
    findPerfectService: "Trouvez le service parfait",
    controlText:
      "Utilisez les filtres ou recherchez directement par plateforme, package ou type de service.",
    matchingServices: "services correspondants",
    searchPlaceholder:
      "Rechercher Instagram followers, TikTok views, YouTube likes...",
    allServiceTypes: "Tous les types",

    noServicesFound: "Aucun service trouvé",
    noServicesText:
      "Aucun résultat avec ces filtres. Effacez les filtres ou essayez une autre recherche.",
    resetMarketplace: "Réinitialiser marketplace",

    pricePer1000: "Prix / 1000",
    minimum: "Minimum",
    maximum: "Maximum",
    orderSetup: "Configuration commande",
    orderSetupText: "Collez le lien, quantité et lancez.",
    targetLink: "Lien cible",
    targetPlaceholder: "Lien profil, vidéo, post ou chaîne",
    quantity: "Quantité",
    enterQuantity: "Entrez une quantité pour voir le prix live.",
    minimumQuantity: "La quantité minimum est",
    maximumQuantity: "La quantité maximum est",
    quantityGood: "La quantité est correcte.",
    totalPrice: "Prix total",
    calculatedLive: "Calculé live · affiché en",
    creatingOrder: "Création commande...",
    createOrder: "Créer commande",
    orderCurrencyInfoStart:
      "La commande est facturée en EUR. Le prix affiché est converti en",
  },

  ru: {
    all: "Все",
    other: "Другое",
    followers: "Подписчики",
    likes: "Лайки",
    views: "Просмотры",
    comments: "Комментарии",
    subscribers: "Подписчики",
    members: "Участники",
    streams: "Стримы",

    bestMatch: "Лучшее совпадение",
    lowestPrice: "Самая низкая цена",
    highestPrice: "Самая высокая цена",
    highestMaxQuantity: "Максимальное количество",

    heroBadge: "Маркетплейс роста соцсетей",
    heroTitle: "Премиум услуги для creators, которым нужен чистый и быстрый рост.",
    heroText:
      "Выбери платформу, нужный пакет, вставь ссылку и сразу увидишь цену. Всё сделано просто, серьёзно и профессионально.",
    totalServices: "Всего услуг",
    livePackages: "активных пакетов доступно",
    platforms: "Платформы",
    majorNetworks: "основные сети покрыты",
    startingFrom: "От",
    shownIn: "показано в",
    serviceTypes: "Типы услуг",
    growthOptionsReady: "growth опции готовы",
    browseMarketplace: "Открыть Marketplace",
    clearFilters: "Очистить фильтры",
    pricesInfoStart:
      "Цены хранятся и списываются в EUR. Сейчас ты видишь цены, конвертированные в",
    pricesInfoEnd: "для более простого понимания.",

    failedLoad: "Не удалось загрузить услуги.",
    loginBeforeOrder: "Войдите в аккаунт перед созданием заказа.",
    enterValidLink: "Введите корректную ссылку перед созданием заказа.",
    quantityBetween: "Количество должно быть между",
    and: "и",
    orderFailed: "Заказ не удался.",
    orderCreated: "Заказ успешно создан. Новый баланс:",

    controlCenter: "Центр управления",
    findPerfectService: "Найди идеальную услугу",
    controlText:
      "Используй фильтры или ищи напрямую по платформе, названию пакета или типу услуги.",
    matchingServices: "подходящих услуг",
    searchPlaceholder:
      "Поиск Instagram followers, TikTok views, YouTube likes...",
    allServiceTypes: "Все типы услуг",

    noServicesFound: "Услуги не найдены",
    noServicesText:
      "Сейчас ничего не подходит под эти фильтры. Очисти фильтры или попробуй другой поиск.",
    resetMarketplace: "Сбросить marketplace",

    pricePer1000: "Цена / 1000",
    minimum: "Минимум",
    maximum: "Максимум",
    orderSetup: "Настройка заказа",
    orderSetupText: "Вставь ссылку, количество и запускай.",
    targetLink: "Целевая ссылка",
    targetPlaceholder: "Ссылка профиля, видео, поста или канала",
    quantity: "Количество",
    enterQuantity: "Введите количество, чтобы увидеть live цену.",
    minimumQuantity: "Минимальное количество",
    maximumQuantity: "Максимальное количество",
    quantityGood: "Количество выглядит хорошо.",
    totalPrice: "Итоговая цена",
    calculatedLive: "Рассчитано live · показано в",
    creatingOrder: "Создание заказа...",
    createOrder: "Создать заказ",
    orderCurrencyInfoStart:
      "Заказ списывается в EUR. Показанная цена конвертирована в",
  },
};

function getServicesTranslations(languageCode) {
  return SERVICES_TRANSLATIONS[languageCode] || SERVICES_TRANSLATIONS.en;
}

function translateType(type, t) {
  const map = {
    All: t.all,
    Followers: t.followers,
    Likes: t.likes,
    Views: t.views,
    Comments: t.comments,
    Subscribers: t.subscribers,
    Members: t.members,
    Streams: t.streams,
    Other: t.other,
  };

  return map[type] || type;
}

function translatePlatform(platform, t) {
  if (platform === "All") return t.all;
  if (platform === "Other") return t.other;
  return platform;
}

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

const floatingSocialBase = [
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

const floatingSocials = Array.from({ length: 80 }, (_, index) => {
  return floatingSocialBase[index % floatingSocialBase.length];
});

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

  const [selectedLanguage, setSelectedLanguage] = useState(getStoredLanguage());
  const t = getServicesTranslations(selectedLanguage);
  const navT = getTranslations(selectedLanguage);

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

  const sortOptions = useMemo(
    () => [
      { label: t.bestMatch, value: "best" },
      { label: t.lowestPrice, value: "price-low" },
      { label: t.highestPrice, value: "price-high" },
      { label: t.highestMaxQuantity, value: "max-high" },
    ],
    [t]
  );

  useEffect(() => {
    const syncLanguage = () => {
      setSelectedLanguage(getStoredLanguage());
    };

    window.addEventListener("empire-language-updated", syncLanguage);
    window.addEventListener("storage", syncLanguage);

    syncLanguage();

    return () => {
      window.removeEventListener("empire-language-updated", syncLanguage);
      window.removeEventListener("storage", syncLanguage);
    };
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const res = await api.get("/services");
      setServices(res.data.services || []);
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || t.failedLoad);
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
      return t.enterQuantity;
    }

    if (quantity < service.min) {
      return `${t.minimumQuantity} ${formatQuantity(service.min)}.`;
    }

    if (quantity > service.max) {
      return `${t.maximumQuantity} ${formatQuantity(service.max)}.`;
    }

    return t.quantityGood;
  };

  const resetFilters = () => {
    setSearch("");
    setPlatform("All");
    setType("All");
    setSort("best");
  };

  const createOrder = async (service) => {
    setMessage("");

    const token = localStorage.getItem("token");
    const form = orderForms[service._id] || {};
    const link = form.link || "";
    const quantity = Number(form.quantity || 0);

    if (!token) {
      setMessageType("error");
      setMessage(t.loginBeforeOrder);
      return;
    }

    if (!link.trim()) {
      setMessageType("error");
      setMessage(t.enterValidLink);
      return;
    }

    if (!quantity || quantity < service.min || quantity > service.max) {
      setMessageType("error");
      setMessage(
        `${t.quantityBetween} ${formatQuantity(service.min)} ${t.and} ${formatQuantity(
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
      setMessage(`${t.orderCreated} ${formatMoney(res.data.newBalance || 0)}`);

      setOrderForms((current) => ({
        ...current,
        [service._id]: {
          link: "",
          quantity: "",
        },
      }));
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || t.orderFailed);
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
            {t.heroBadge}
          </div>

          <h1>{t.heroTitle}</h1>

          <p>{t.heroText}</p>

          <div className="servicesHeroStatsPro">
            <div className="servicesHeroStatCardPro">
              <div className="servicesHeroStatIconWrapPro">
                <PlatformLogo platformName="Instagram" className="servicesHeroStatIconPro" />
              </div>
              <span>{t.totalServices}</span>
              <strong>{serviceStats.total}</strong>
              <small>{t.livePackages}</small>
            </div>

            <div className="servicesHeroStatCardPro">
              <div className="servicesHeroStatIconWrapPro">
                <PlatformLogo platformName="YouTube" className="servicesHeroStatIconPro" />
              </div>
              <span>{t.platforms}</span>
              <strong>{serviceStats.platformsCount}</strong>
              <small>{t.majorNetworks}</small>
            </div>

            <div className="servicesHeroStatCardPro" title={currencyRateText}>
              <div className="servicesHeroStatIconWrapPro">
                <PlatformLogo platformName="TikTok" className="servicesHeroStatIconPro" />
              </div>
              <span>{t.startingFrom}</span>
              <strong>{formatMoney(serviceStats.cheapest)}</strong>
              <small>
                {t.shownIn} {selectedCurrency}
              </small>
            </div>

            <div className="servicesHeroStatCardPro">
              <div className="servicesHeroStatIconWrapPro">
                <PlatformLogo platformName="Telegram" className="servicesHeroStatIconPro" />
              </div>
              <span>{t.serviceTypes}</span>
              <strong>{serviceStats.typesCount}</strong>
              <small>{t.growthOptionsReady}</small>
            </div>
          </div>

          <div className="servicesHeroActionsPro">
            <a href="#services-marketplace" className="servicesMainActionPro">
              {t.browseMarketplace}
            </a>

            <button className="servicesSoftActionPro" type="button" onClick={resetFilters}>
              {t.clearFilters}
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
            {t.pricesInfoStart} {selectedCurrencyMeta.flag} {selectedCurrency}{" "}
            {t.pricesInfoEnd}
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
              <span>{t.controlCenter}</span>
              <h2>{t.findPerfectService}</h2>
              <p>{t.controlText}</p>
            </div>

            <div className="servicesControlCounterPro">
              <strong>{filteredServices.length}</strong>
              <span>{t.matchingServices}</span>
            </div>
          </div>

          <div className="servicesSearchGridPro">
            <div className="servicesSearchInputPro">
              <span>⌕</span>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select value={type} onChange={(e) => setType(e.target.value)}>
              {types.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? t.allServiceTypes : translateType(item, t)}
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
                <span>{translatePlatform(item, t)}</span>
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
            <h2>{t.noServicesFound}</h2>
            <p>{t.noServicesText}</p>
            <button type="button" onClick={resetFilters}>
              {t.resetMarketplace}
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

                    <span className="serviceTypeBadgePro">
                      {translateType(service.type, t)}
                    </span>
                  </div>

                  <p className="serviceDescriptionPro">
                    {service.description ||
                      "Premium growth service with simple order tracking, clean delivery and instant price calculation."}
                  </p>

                  <div className="serviceInfoGridPro">
                    <div title={currencyRateText}>
                      <small>{t.pricePer1000}</small>
                      <strong>{formatMoney(service.pricePer1000 || 0)}</strong>
                    </div>

                    <div>
                      <small>{t.minimum}</small>
                      <strong>{formatQuantity(service.min)}</strong>
                    </div>

                    <div>
                      <small>{t.maximum}</small>
                      <strong>{formatQuantity(service.max)}</strong>
                    </div>
                  </div>

                  <div className="serviceOrderPanelPro">
                    <div className="serviceOrderPanelTitlePro">
                      <div>
                        <span>{t.orderSetup}</span>
                        <p>{t.orderSetupText}</p>
                      </div>

                      <PlatformLogo platformName={service.platform} />
                    </div>

                    <label>
                      <span>{t.targetLink}</span>
                      <input
                        type="text"
                        placeholder={t.targetPlaceholder}
                        value={orderForms[service._id]?.link || ""}
                        onChange={(e) =>
                          updateOrderForm(service._id, "link", e.target.value)
                        }
                      />
                    </label>

                    <label>
                      <span>{t.quantity}</span>
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
                        <span>{t.totalPrice}</span>
                        <small>
                          {t.calculatedLive} {selectedCurrency}
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
                      {creatingId === service._id ? t.creatingOrder : t.createOrder}
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
                      {t.orderCurrencyInfoStart} {selectedCurrencyMeta.flag}{" "}
                      {selectedCurrency}.
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