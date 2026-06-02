import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getStoredLanguage } from "../lib/language.js";

const HOME_TRANSLATIONS = {
  en: {
    heroBadge: "Creator Growth Platform",
    heroTitle: "Grow your social media faster with smart promotion tools",
    heroText:
      "Promotion packages for Instagram, TikTok, YouTube and more. Fast delivery, clear pricing, wallet deposits, promo codes and simple order tracking.",
    getStarted: "Get Started",
    viewServices: "View Services",
    noPasswords: "No passwords required",
    walletBalanceSystem: "Wallet balance system",
    supportTickets: "Support tickets",

    sectionEyebrow: "All-in-one growth system",
    sectionTitle: "Everything you need in one platform",
    sectionText:
      "One clean system for buying services, adding funds, using promo codes, checking orders and getting help without confusion.",

    fastOrders: "Fast Orders",
    fastOrdersText:
      "Choose a service, paste your link, select quantity and place your order in seconds.",
    walletSystem: "Wallet System",
    walletSystemText:
      "Add funds once, keep balance ready and pay instantly without repeating the same steps.",
    supportTicketsTitle: "Support Tickets",
    supportTicketsText:
      "If something goes wrong, open a ticket and get direct help without wasting time.",

    controlRoomEyebrow: "Control room",
    controlRoomTitle: "Built for serious creators, brands and resellers.",
    controlRoomText:
      "A clean growth command center for people who want speed, control and a premium order flow without messy panels or confusing steps.",
    processOne: "Select the growth service",
    processTwo: "Drop your profile or post link",
    processThree: "Choose quantity and confirm",
    processFour: "Watch the progress live",
    fastDelivery: "Fast delivery",
    liveTracking: "Live tracking",
    premiumFlow: "Premium flow",
    cleanControl: "Clean control",
    exploreServices: "Explore Services",

    panelSmall: "EmpireBoost Panel",
    liveDashboard: "Live Growth Dashboard",
    live: "LIVE",
    lastSync: "Last sync",
    uptime: "Uptime",
    newUsersToday: "New users today",
    walletVolume: "Wallet Volume",
    activeOrders: "Active Orders",
    tickets: "Tickets",
    completedToday: "Completed Today",
    ordersToday: "Orders Today",
    revenueToday: "Revenue Today",
    avgDelivery: "Avg Delivery",
    successRate: "Success Rate",
    onlineUsers: "Online users right now",
    bestService: "Best performing service",
    bestServiceValue: "Instagram Followers",
    mostUsedPayment: "Most used payment flow",
    mostUsedPaymentValue: "Wallet balance",
    quantity: "quantity",
    justNow: "just now",
    done: "Done",
    min: "min",

    processing: "Processing",
    pending: "Pending",
    completed: "Completed",
  },

  de: {
    heroBadge: "Creator Growth Plattform",
    heroTitle:
      "Wachse schneller auf Social Media mit smarten Promotion Tools",
    heroText:
      "Promotion-Pakete für Instagram, TikTok, YouTube und mehr. Schnelle Lieferung, klare Preise, Wallet-Einzahlungen, Promo-Codes und einfache Bestellverfolgung.",
    getStarted: "Loslegen",
    viewServices: "Services ansehen",
    noPasswords: "Keine Passwörter nötig",
    walletBalanceSystem: "Wallet-Guthaben System",
    supportTickets: "Support Tickets",

    sectionEyebrow: "All-in-one Growth System",
    sectionTitle: "Alles, was du brauchst, in einer Plattform",
    sectionText:
      "Ein sauberes System für Services, Guthaben, Promo-Codes, Bestellungen und Support ohne Verwirrung.",

    fastOrders: "Schnelle Bestellungen",
    fastOrdersText:
      "Service auswählen, Link einfügen, Menge wählen und in Sekunden bestellen.",
    walletSystem: "Wallet System",
    walletSystemText:
      "Einmal Guthaben aufladen und sofort für neue Bestellungen nutzen.",
    supportTicketsTitle: "Support Tickets",
    supportTicketsText:
      "Wenn etwas schiefgeht, öffnest du ein Ticket und bekommst direkt Hilfe.",

    controlRoomEyebrow: "Control Room",
    controlRoomTitle: "Gebaut für Creator, Brands und Reseller.",
    controlRoomText:
      "Ein cleanes Growth Command Center für Leute, die Speed, Kontrolle und einen Premium Order Flow wollen.",
    processOne: "Growth Service auswählen",
    processTwo: "Profil- oder Post-Link einfügen",
    processThree: "Menge wählen und bestätigen",
    processFour: "Fortschritt live verfolgen",
    fastDelivery: "Schnelle Lieferung",
    liveTracking: "Live Tracking",
    premiumFlow: "Premium Flow",
    cleanControl: "Saubere Kontrolle",
    exploreServices: "Services entdecken",

    panelSmall: "EmpireBoost Panel",
    liveDashboard: "Live Growth Dashboard",
    live: "LIVE",
    lastSync: "Letzter Sync",
    uptime: "Uptime",
    newUsersToday: "Neue User heute",
    walletVolume: "Wallet Volumen",
    activeOrders: "Aktive Bestellungen",
    tickets: "Tickets",
    completedToday: "Heute abgeschlossen",
    ordersToday: "Bestellungen heute",
    revenueToday: "Umsatz heute",
    avgDelivery: "Ø Lieferung",
    successRate: "Erfolgsrate",
    onlineUsers: "User gerade online",
    bestService: "Bester Service",
    bestServiceValue: "Instagram Follower",
    mostUsedPayment: "Meistgenutzte Zahlung",
    mostUsedPaymentValue: "Wallet Guthaben",
    quantity: "Menge",
    justNow: "gerade eben",
    done: "Fertig",
    min: "Min",

    processing: "In Bearbeitung",
    pending: "Ausstehend",
    completed: "Abgeschlossen",
  },

  es: {
    heroBadge: "Plataforma de crecimiento",
    heroTitle:
      "Haz crecer tus redes sociales más rápido con herramientas inteligentes",
    heroText:
      "Paquetes de promoción para Instagram, TikTok, YouTube y más. Entrega rápida, precios claros, depósitos wallet, códigos promo y seguimiento simple.",
    getStarted: "Empezar",
    viewServices: "Ver servicios",
    noPasswords: "Sin contraseñas",
    walletBalanceSystem: "Sistema de saldo wallet",
    supportTickets: "Tickets de soporte",

    sectionEyebrow: "Sistema growth todo en uno",
    sectionTitle: "Todo lo que necesitas en una plataforma",
    sectionText:
      "Un sistema limpio para comprar servicios, añadir saldo, usar códigos promo, revisar pedidos y recibir ayuda sin confusión.",

    fastOrders: "Pedidos rápidos",
    fastOrdersText:
      "Elige un servicio, pega tu enlace, selecciona cantidad y crea tu pedido en segundos.",
    walletSystem: "Sistema wallet",
    walletSystemText:
      "Añade saldo una vez y paga al instante sin repetir los mismos pasos.",
    supportTicketsTitle: "Tickets de soporte",
    supportTicketsText:
      "Si algo sale mal, abre un ticket y recibe ayuda directa sin perder tiempo.",

    controlRoomEyebrow: "Sala de control",
    controlRoomTitle: "Creado para creators, marcas y resellers serios.",
    controlRoomText:
      "Un centro de control growth limpio para personas que quieren velocidad, control y un flujo premium.",
    processOne: "Selecciona el servicio growth",
    processTwo: "Pega tu link de perfil o post",
    processThree: "Elige cantidad y confirma",
    processFour: "Mira el progreso en vivo",
    fastDelivery: "Entrega rápida",
    liveTracking: "Tracking en vivo",
    premiumFlow: "Flujo premium",
    cleanControl: "Control limpio",
    exploreServices: "Explorar servicios",

    panelSmall: "Panel EmpireBoost",
    liveDashboard: "Dashboard Growth en vivo",
    live: "LIVE",
    lastSync: "Última sync",
    uptime: "Uptime",
    newUsersToday: "Nuevos usuarios hoy",
    walletVolume: "Volumen wallet",
    activeOrders: "Pedidos activos",
    tickets: "Tickets",
    completedToday: "Completados hoy",
    ordersToday: "Pedidos hoy",
    revenueToday: "Ingresos hoy",
    avgDelivery: "Entrega media",
    successRate: "Tasa de éxito",
    onlineUsers: "Usuarios online ahora",
    bestService: "Mejor servicio",
    bestServiceValue: "Instagram Followers",
    mostUsedPayment: "Pago más usado",
    mostUsedPaymentValue: "Saldo wallet",
    quantity: "cantidad",
    justNow: "ahora mismo",
    done: "Listo",
    min: "min",

    processing: "Procesando",
    pending: "Pendiente",
    completed: "Completado",
  },

  fr: {
    heroBadge: "Plateforme Growth Creator",
    heroTitle:
      "Développez vos réseaux sociaux plus vite avec des outils intelligents",
    heroText:
      "Packages de promotion pour Instagram, TikTok, YouTube et plus. Livraison rapide, prix clairs, dépôts wallet, codes promo et suivi simple.",
    getStarted: "Commencer",
    viewServices: "Voir les services",
    noPasswords: "Aucun mot de passe requis",
    walletBalanceSystem: "Système de solde wallet",
    supportTickets: "Tickets support",

    sectionEyebrow: "Système growth tout-en-un",
    sectionTitle: "Tout ce qu’il faut dans une seule plateforme",
    sectionText:
      "Un système propre pour acheter des services, ajouter du solde, utiliser des codes promo, suivre les commandes et recevoir de l’aide.",

    fastOrders: "Commandes rapides",
    fastOrdersText:
      "Choisissez un service, collez votre lien, sélectionnez la quantité et commandez en secondes.",
    walletSystem: "Système wallet",
    walletSystemText:
      "Ajoutez du solde une fois et payez instantanément sans répéter les mêmes étapes.",
    supportTicketsTitle: "Tickets support",
    supportTicketsText:
      "Si quelque chose ne va pas, ouvrez un ticket et obtenez de l’aide directe.",

    controlRoomEyebrow: "Control room",
    controlRoomTitle: "Conçu pour creators, marques et resellers sérieux.",
    controlRoomText:
      "Un centre de commande growth propre pour ceux qui veulent vitesse, contrôle et flow premium.",
    processOne: "Sélectionnez le service growth",
    processTwo: "Collez votre lien profil ou post",
    processThree: "Choisissez la quantité et confirmez",
    processFour: "Suivez le progrès en direct",
    fastDelivery: "Livraison rapide",
    liveTracking: "Tracking live",
    premiumFlow: "Flow premium",
    cleanControl: "Contrôle propre",
    exploreServices: "Explorer les services",

    panelSmall: "Panel EmpireBoost",
    liveDashboard: "Dashboard Growth Live",
    live: "LIVE",
    lastSync: "Dernière sync",
    uptime: "Uptime",
    newUsersToday: "Nouveaux users aujourd’hui",
    walletVolume: "Volume wallet",
    activeOrders: "Commandes actives",
    tickets: "Tickets",
    completedToday: "Complété aujourd’hui",
    ordersToday: "Commandes aujourd’hui",
    revenueToday: "Revenu aujourd’hui",
    avgDelivery: "Livraison moyenne",
    successRate: "Taux de réussite",
    onlineUsers: "Utilisateurs online maintenant",
    bestService: "Meilleur service",
    bestServiceValue: "Instagram Followers",
    mostUsedPayment: "Paiement le plus utilisé",
    mostUsedPaymentValue: "Solde wallet",
    quantity: "quantité",
    justNow: "à l’instant",
    done: "Terminé",
    min: "min",

    processing: "En cours",
    pending: "En attente",
    completed: "Terminé",
  },

  ru: {
    heroBadge: "Платформа роста для creators",
    heroTitle:
      "Развивай соцсети быстрее с умными инструментами продвижения",
    heroText:
      "Пакеты продвижения для Instagram, TikTok, YouTube и других платформ. Быстрая доставка, понятные цены, wallet-пополнения, промокоды и простой трекинг заказов.",
    getStarted: "Начать",
    viewServices: "Смотреть услуги",
    noPasswords: "Пароли не нужны",
    walletBalanceSystem: "Wallet баланс система",
    supportTickets: "Support тикеты",

    sectionEyebrow: "All-in-one growth система",
    sectionTitle: "Всё, что нужно, в одной платформе",
    sectionText:
      "Одна чистая система для покупки услуг, пополнения баланса, промокодов, проверки заказов и поддержки.",

    fastOrders: "Быстрые заказы",
    fastOrdersText:
      "Выбери услугу, вставь ссылку, выбери количество и оформи заказ за секунды.",
    walletSystem: "Wallet система",
    walletSystemText:
      "Пополняй баланс один раз и оплачивай мгновенно без повторения шагов.",
    supportTicketsTitle: "Support тикеты",
    supportTicketsText:
      "Если что-то пошло не так, открой тикет и получи прямую помощь.",

    controlRoomEyebrow: "Control room",
    controlRoomTitle: "Создано для серьёзных creators, брендов и resellers.",
    controlRoomText:
      "Чистый growth command center для тех, кто хочет скорость, контроль и premium order flow.",
    processOne: "Выбери growth услугу",
    processTwo: "Вставь ссылку профиля или поста",
    processThree: "Выбери количество и подтверди",
    processFour: "Следи за прогрессом live",
    fastDelivery: "Быстрая доставка",
    liveTracking: "Live tracking",
    premiumFlow: "Premium flow",
    cleanControl: "Чистый контроль",
    exploreServices: "Открыть услуги",

    panelSmall: "EmpireBoost Panel",
    liveDashboard: "Live Growth Dashboard",
    live: "LIVE",
    lastSync: "Последний sync",
    uptime: "Uptime",
    newUsersToday: "Новые пользователи сегодня",
    walletVolume: "Wallet volume",
    activeOrders: "Активные заказы",
    tickets: "Тикеты",
    completedToday: "Завершено сегодня",
    ordersToday: "Заказы сегодня",
    revenueToday: "Доход сегодня",
    avgDelivery: "Средняя доставка",
    successRate: "Успешность",
    onlineUsers: "Пользователи онлайн сейчас",
    bestService: "Лучший сервис",
    bestServiceValue: "Instagram Followers",
    mostUsedPayment: "Самый частый payment",
    mostUsedPaymentValue: "Wallet balance",
    quantity: "количество",
    justNow: "только что",
    done: "Готово",
    min: "мин",

    processing: "В обработке",
    pending: "Ожидает",
    completed: "Завершено",
  },
};

function getHomeTranslations(languageCode) {
  return HOME_TRANSLATIONS[languageCode] || HOME_TRANSLATIONS.en;
}

const initialOrders = [
  {
    id: 1,
    service: "Instagram Followers",
    statusKey: "processing",
    progress: 24,
    eta: "8",
    amount: "1,000",
  },
  {
    id: 2,
    service: "TikTok Views",
    statusKey: "processing",
    progress: 38,
    eta: "7",
    amount: "5,000",
  },
  {
    id: 3,
    service: "YouTube Subscribers",
    statusKey: "pending",
    progress: 14,
    eta: "10",
    amount: "250",
  },
  {
    id: 4,
    service: "Telegram Members",
    statusKey: "processing",
    progress: 31,
    eta: "9",
    amount: "800",
  },
];

const randomServices = [
  "Instagram Followers",
  "Instagram Likes",
  "TikTok Views",
  "TikTok Followers",
  "YouTube Subscribers",
  "YouTube Likes",
  "Telegram Members",
  "Spotify Plays",
  "Twitch Followers",
];

const galaxyBurstItems = [
  {
    id: 1,
    icon: "IG",
    text: "Instagram",
    tone: "rose",
    driftX: "-865px",
    driftY: "-315px",
    delay: "-1.5s",
    duration: "28s",
    rotate: "-16deg",
  },
  {
    id: 2,
    icon: "TT",
    text: "TikTok",
    tone: "cyan",
    driftX: "845px",
    driftY: "-280px",
    delay: "-8s",
    duration: "30s",
    rotate: "14deg",
  },
  {
    id: 3,
    icon: "YT",
    text: "YouTube",
    tone: "red",
    driftX: "-825px",
    driftY: "230px",
    delay: "-12s",
    duration: "29s",
    rotate: "11deg",
  },
  {
    id: 4,
    icon: "TG",
    text: "Telegram",
    tone: "blue",
    driftX: "835px",
    driftY: "210px",
    delay: "-4s",
    duration: "31s",
    rotate: "-13deg",
  },
  {
    id: 5,
    icon: "❤",
    text: "Likes",
    tone: "rose",
    driftX: "-640px",
    driftY: "-500px",
    delay: "-15s",
    duration: "27s",
    rotate: "9deg",
  },
  {
    id: 6,
    icon: "👥",
    text: "Followers",
    tone: "emerald",
    driftX: "660px",
    driftY: "-475px",
    delay: "-6s",
    duration: "29.5s",
    rotate: "-10deg",
  },
  {
    id: 7,
    icon: "▶",
    text: "Views",
    tone: "blue",
    driftX: "-450px",
    driftY: "530px",
    delay: "-18s",
    duration: "32s",
    rotate: "-8deg",
  },
  {
    id: 8,
    icon: "💬",
    text: "Comments",
    tone: "violet",
    driftX: "485px",
    driftY: "515px",
    delay: "-10s",
    duration: "30.5s",
    rotate: "12deg",
  },
  {
    id: 9,
    icon: "♫",
    text: "Plays",
    tone: "emerald",
    driftX: "-910px",
    driftY: "-38px",
    delay: "-20s",
    duration: "33s",
    rotate: "-14deg",
  },
  {
    id: 10,
    icon: "⚡",
    text: "Boost",
    tone: "amber",
    driftX: "925px",
    driftY: "34px",
    delay: "-2s",
    duration: "28.8s",
    rotate: "15deg",
  },
  {
    id: 11,
    icon: "↗",
    text: "Reach",
    tone: "cyan",
    driftX: "-740px",
    driftY: "410px",
    delay: "-14s",
    duration: "31.8s",
    rotate: "10deg",
  },
  {
    id: 12,
    icon: "✦",
    text: "Growth",
    tone: "indigo",
    driftX: "760px",
    driftY: "395px",
    delay: "-9s",
    duration: "30.2s",
    rotate: "-11deg",
  },
  {
    id: 13,
    icon: "★",
    text: "Premium",
    tone: "amber",
    driftX: "-285px",
    driftY: "-640px",
    delay: "-16s",
    duration: "32.5s",
    rotate: "-7deg",
  },
  {
    id: 14,
    icon: "◆",
    text: "Creator",
    tone: "violet",
    driftX: "310px",
    driftY: "-640px",
    delay: "-5s",
    duration: "29.2s",
    rotate: "8deg",
  },
  {
    id: 15,
    icon: "◉",
    text: "Live",
    tone: "emerald",
    driftX: "-300px",
    driftY: "640px",
    delay: "-22s",
    duration: "33.5s",
    rotate: "13deg",
  },
  {
    id: 16,
    icon: "#",
    text: "Trending",
    tone: "cyan",
    driftX: "330px",
    driftY: "635px",
    delay: "-11s",
    duration: "31.2s",
    rotate: "-13deg",
  },
  {
    id: 17,
    icon: "SP",
    text: "Spotify",
    tone: "green",
    driftX: "-960px",
    driftY: "-180px",
    delay: "-7s",
    duration: "34s",
    rotate: "6deg",
  },
  {
    id: 18,
    icon: "TW",
    text: "Twitch",
    tone: "violet",
    driftX: "960px",
    driftY: "-160px",
    delay: "-19s",
    duration: "33.2s",
    rotate: "-6deg",
  },
  {
    id: 19,
    icon: "✓",
    text: "Orders",
    tone: "blue",
    driftX: "-920px",
    driftY: "120px",
    delay: "-3s",
    duration: "31.6s",
    rotate: "-12deg",
  },
  {
    id: 20,
    icon: "∞",
    text: "Viral",
    tone: "rose",
    driftX: "920px",
    driftY: "135px",
    delay: "-13s",
    duration: "32.8s",
    rotate: "12deg",
  },
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createRandomOrder(id) {
  const progress = Math.floor(Math.random() * 18) + 6;

  return {
    id,
    service: getRandomItem(randomServices),
    statusKey: progress > 28 ? "processing" : "pending",
    progress,
    eta: `${Math.floor(Math.random() * 5) + 6}`,
    amount: `${(Math.floor(Math.random() * 20) + 1) * 100}`,
  };
}

function getNumericValue(value) {
  if (typeof value === "number") return value;

  const cleanValue = String(value).replace(/[^\d.-]/g, "");
  const parsedValue = Number(cleanValue);

  return Number.isNaN(parsedValue) ? 0 : parsedValue;
}

function AnimatedStatValue({ value, prefix = "", suffix = "", decimals = null }) {
  const previousValueRef = useRef(value);
  const [direction, setDirection] = useState("up");
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const currentNumber = getNumericValue(value);
    const previousNumber = getNumericValue(previousValueRef.current);

    if (currentNumber !== previousNumber) {
      setDirection(currentNumber >= previousNumber ? "up" : "down");
      setAnimationKey((prev) => prev + 1);
      previousValueRef.current = value;
    }
  }, [value]);

  const displayValue =
    typeof value === "number" && decimals !== null ? value.toFixed(decimals) : value;

  return (
    <span className="bankNumberShell">
      <span key={animationKey} className={`bankNumberRoll bankNumberRoll-${direction}`}>
        {prefix}
        {displayValue}
        {suffix}
      </span>
    </span>
  );
}

function Home() {
  const nextOrderIdRef = useRef(5);
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const [selectedLanguage, setSelectedLanguage] = useState(getStoredLanguage());
  const t = getHomeTranslations(selectedLanguage);

  const [liveStats, setLiveStats] = useState({
    walletBalance: 278.76,
    activeOrders: 14,
    tickets: 5,
    completedToday: 40,
    uptime: "99.90%",
    newUsersToday: 31,
    ordersToday: 87,
    revenueToday: 486.2,
    avgDelivery: 8,
    successRate: "98.7%",
    onlineUsers: 19,
    lastSync: "justNow",
  });

  const [liveOrders, setLiveOrders] = useState(initialOrders);

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

  useEffect(() => {
    const statsInterval = setInterval(() => {
      setLiveStats((prev) => {
        const deliveryMove = Math.floor(Math.random() * 3 - 1);
        const nextAvgDelivery = Math.max(5, Math.min(10, prev.avgDelivery + deliveryMove));

        return {
          ...prev,
          walletBalance: Number(
            Math.max(120, prev.walletBalance + (Math.random() * 10 - 3)).toFixed(2)
          ),
          activeOrders: Math.max(8, prev.activeOrders + Math.floor(Math.random() * 3 - 1)),
          tickets: Math.max(2, prev.tickets + Math.floor(Math.random() * 3 - 1)),
          completedToday: Math.max(20, prev.completedToday + Math.floor(Math.random() * 2)),
          ordersToday: Math.max(50, prev.ordersToday + Math.floor(Math.random() * 2)),
          revenueToday: Number((prev.revenueToday + Math.random() * 8).toFixed(2)),
          uptime: `${(99.85 + Math.random() * 0.14).toFixed(2)}%`,
          successRate: `${(98.4 + Math.random() * 1.4).toFixed(1)}%`,
          onlineUsers: Math.max(8, prev.onlineUsers + Math.floor(Math.random() * 5 - 2)),
          avgDelivery: nextAvgDelivery,
          lastSync: "justNow",
        };
      });
    }, 3500);

    const progressInterval = setInterval(() => {
      setLiveOrders((prev) =>
        prev.map((order) => {
          if (order.statusKey === "completed") return order;

          const increase = Math.floor(Math.random() * 5) + 3;
          const nextProgress = Math.min(100, order.progress + increase);

          if (nextProgress >= 100) {
            return {
              ...order,
              progress: 100,
              statusKey: "completed",
              eta: "done",
            };
          }

          const etaMinutes = Math.max(1, Math.min(10, Math.ceil((100 - nextProgress) / 12)));

          return {
            ...order,
            progress: nextProgress,
            statusKey: nextProgress > 30 ? "processing" : "pending",
            eta: `${etaMinutes}`,
          };
        })
      );
    }, 25000);

    const newOrderInterval = setInterval(() => {
      const freshOrder = createRandomOrder(nextOrderIdRef.current);
      nextOrderIdRef.current += 1;

      setLiveOrders((prev) => [freshOrder, ...prev].slice(0, 6));

      setLiveStats((prev) => ({
        ...prev,
        activeOrders: prev.activeOrders + 1,
        ordersToday: prev.ordersToday + 1,
      }));
    }, 120000);

    const newUsersInterval = setInterval(() => {
      setLiveStats((prev) => ({
        ...prev,
        newUsersToday: prev.newUsersToday + 1,
        onlineUsers: prev.onlineUsers + 1,
      }));
    }, 300000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(progressInterval);
      clearInterval(newOrderInterval);
      clearInterval(newUsersInterval);
    };
  }, []);

  const formatEta = (order) => {
    if (order.eta === "done") return t.done;
    return `${order.eta} ${t.min}`;
  };

  return (
    <main className="homeMainPro">
      <section className="homeHero fullGifHero">
        <div className="homeOverlay"></div>

        <div className="galaxyBurstLayer" aria-hidden="true">
          <div className="galaxyCoreGlow"></div>

          {galaxyBurstItems.map((item) => (
            <div
              key={item.id}
              className={`galaxyBurstItem tone-${item.tone}`}
              style={{
                "--drift-x": item.driftX,
                "--drift-y": item.driftY,
                "--delay": item.delay,
                "--duration": item.duration,
                "--rotate": item.rotate,
              }}
            >
              <span className="burstIcon">{item.icon}</span>
              <span className="burstText">{item.text}</span>
            </div>
          ))}
        </div>

        <div className="homeHeroContent centeredHeroContent">
          <div className="heroBadge">{t.heroBadge}</div>

          <h1>{t.heroTitle}</h1>

          <p>{t.heroText}</p>

          <div className="heroButtons">
            <Link to={isLoggedIn ? "/services" : "/login"}>{t.getStarted}</Link>
            <Link to="/services" className="secondaryButton">
              {t.viewServices}
            </Link>
          </div>

          <div className="heroTrust">
            <span>{t.noPasswords}</span>
            <span>{t.walletBalanceSystem}</span>
            <span>{t.supportTickets}</span>
          </div>
        </div>
      </section>

      <section className="homeSection premiumHomeSection">
        <div className="sectionHeader centeredSectionHeader">
          <span className="sectionEyebrow">{t.sectionEyebrow}</span>
          <h2>{t.sectionTitle}</h2>
          <p>{t.sectionText}</p>
        </div>

        <div className="premiumFeatureGrid">
          <div className="premiumFeatureCard">
            <div className="featureIcon">01</div>
            <h3>{t.fastOrders}</h3>
            <p>{t.fastOrdersText}</p>
          </div>

          <div className="premiumFeatureCard">
            <div className="featureIcon">02</div>
            <h3>{t.walletSystem}</h3>
            <p>{t.walletSystemText}</p>
          </div>

          <div className="premiumFeatureCard">
            <div className="featureIcon">03</div>
            <h3>{t.supportTicketsTitle}</h3>
            <p>{t.supportTicketsText}</p>
          </div>
        </div>
      </section>

      <section className="controlRoomSection">
        <div className="controlRoomInner">
          <div className="controlRoomContent">
            <span className="sectionEyebrow">{t.controlRoomEyebrow}</span>

            <h2>{t.controlRoomTitle}</h2>

            <p>{t.controlRoomText}</p>

            <div className="processList">
              <div>
                <strong>1</strong>
                <span>{t.processOne}</span>
              </div>

              <div>
                <strong>2</strong>
                <span>{t.processTwo}</span>
              </div>

              <div>
                <strong>3</strong>
                <span>{t.processThree}</span>
              </div>

              <div>
                <strong>4</strong>
                <span>{t.processFour}</span>
              </div>
            </div>

            <div className="leftInfoBadges">
              <span>{t.fastDelivery}</span>
              <span>{t.liveTracking}</span>
              <span>{t.premiumFlow}</span>
              <span>{t.cleanControl}</span>
            </div>

            <Link to="/services" className="buttonLink">
              {t.exploreServices}
            </Link>
          </div>

          <div className="dashboardMockup liveDashboardCard">
            <div className="dashboardGlow"></div>
            <div className="dashboardElectricGrid"></div>

            <div className="mockupTopBar">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="mockupHeader">
              <div>
                <small>{t.panelSmall}</small>
                <h3>{t.liveDashboard}</h3>
              </div>

              <div className="liveStatusWrap">
                <span className="liveDot"></span>
                <span className="liveBadge">{t.live}</span>
              </div>
            </div>

            <div className="liveMiniStats">
              <div className="liveStatMiniCard">
                <span>{t.lastSync}</span>
                <strong>{t[liveStats.lastSync] || liveStats.lastSync}</strong>
              </div>

              <div className="liveStatMiniCard">
                <span>{t.uptime}</span>
                <strong>
                  <AnimatedStatValue value={liveStats.uptime} />
                </strong>
              </div>

              <div className="liveStatMiniCard">
                <span>{t.newUsersToday}</span>
                <strong>
                  <AnimatedStatValue value={liveStats.newUsersToday} prefix="+" />
                </strong>
              </div>
            </div>

            <div className="mockupStats strongMockupStats">
              <div className="liveStatBox">
                <small>{t.walletVolume}</small>
                <strong>
                  <AnimatedStatValue
                    value={liveStats.walletBalance}
                    prefix="€"
                    decimals={2}
                  />
                </strong>
              </div>

              <div className="liveStatBox">
                <small>{t.activeOrders}</small>
                <strong>
                  <AnimatedStatValue value={liveStats.activeOrders} />
                </strong>
              </div>

              <div className="liveStatBox">
                <small>{t.tickets}</small>
                <strong>
                  <AnimatedStatValue value={liveStats.tickets} />
                </strong>
              </div>

              <div className="liveStatBox">
                <small>{t.completedToday}</small>
                <strong>
                  <AnimatedStatValue value={liveStats.completedToday} />
                </strong>
              </div>

              <div className="liveStatBox">
                <small>{t.ordersToday}</small>
                <strong>
                  <AnimatedStatValue value={liveStats.ordersToday} />
                </strong>
              </div>

              <div className="liveStatBox">
                <small>{t.revenueToday}</small>
                <strong>
                  <AnimatedStatValue
                    value={liveStats.revenueToday}
                    prefix="€"
                    decimals={2}
                  />
                </strong>
              </div>

              <div className="liveStatBox">
                <small>{t.avgDelivery}</small>
                <strong>
                  <AnimatedStatValue
                    value={liveStats.avgDelivery}
                    suffix={` ${t.min}`}
                  />
                </strong>
              </div>

              <div className="liveStatBox">
                <small>{t.successRate}</small>
                <strong>
                  <AnimatedStatValue value={liveStats.successRate} />
                </strong>
              </div>
            </div>

            <div className="dashboardBottomMiniCards">
              <div className="dashboardMiniCard">
                <span>{t.onlineUsers}</span>
                <strong>
                  <AnimatedStatValue value={liveStats.onlineUsers} />
                </strong>
              </div>

              <div className="dashboardMiniCard">
                <span>{t.bestService}</span>
                <strong>{t.bestServiceValue}</strong>
              </div>

              <div className="dashboardMiniCard">
                <span>{t.mostUsedPayment}</span>
                <strong>{t.mostUsedPaymentValue}</strong>
              </div>
            </div>

            <div className="liveOrdersBoard">
              {liveOrders.map((order) => (
                <div className="liveOrderRow" key={order.id}>
                  <div className="liveOrderTop">
                    <div className="liveOrderMain">
                      <span>{order.service}</span>
                      <small>
                        {order.amount} {t.quantity}
                      </small>
                    </div>

                    <div className="liveOrderRight">
                      <small className="etaText">{formatEta(order)}</small>
                      <strong
                        className={
                          order.statusKey === "completed"
                            ? "statusCompleted"
                            : order.statusKey === "processing"
                              ? "statusProcessing"
                              : "statusPending"
                        }
                      >
                        {t[order.statusKey]}
                      </strong>
                    </div>
                  </div>

                  <div className="progressTrack">
                    <div
                      className="progressFill"
                      style={{ width: `${order.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;