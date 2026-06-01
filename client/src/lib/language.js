export const LANGUAGE_STORAGE_KEY = "empireboost_selected_language";

export const SUPPORTED_LANGUAGES = [
  {
    code: "en",
    label: "English",
    short: "EN",
    flag: "🇬🇧",
  },
  {
    code: "de",
    label: "Deutsch",
    short: "DE",
    flag: "🇩🇪",
  },
  {
    code: "ru",
    label: "Русский",
    short: "RU",
    flag: "🇷🇺",
  },
  {
    code: "fr",
    label: "Français",
    short: "FR",
    flag: "🇫🇷",
  },
  {
    code: "es",
    label: "Español",
    short: "ES",
    flag: "🇪🇸",
  },
];

export const TRANSLATIONS = {
  en: {
    balance: "Balance",
    services: "Services",
    dashboard: "Dashboard",
    wallet: "Wallet",
    orders: "Orders",
    transactions: "Transactions",
    faq: "FAQ",
    support: "Support",
    admin: "Admin",
    adminServices: "Admin Services",
    adminOrders: "Admin Orders",
    adminUsers: "Admin Users",
    adminDeposits: "Admin Deposits",
    adminTransactions: "Admin Transactions",
    adminSupport: "Admin Support",
    promoCodes: "Promo Codes",
    settings: "Settings",
    login: "Login",
    register: "Register",
    logout: "Logout",
    footerText: "Social media promotion platform for creators and businesses.",
    terms: "Terms",
    privacy: "Privacy",
    refundPolicy: "Refund Policy",
    cookiePolicy: "Cookie Policy",
    imprint: "Imprint",
    disclaimer: "Disclaimer",
    contact: "Contact",
    languageTitle: "Website language",
  },

  de: {
    balance: "Guthaben",
    services: "Services",
    dashboard: "Dashboard",
    wallet: "Wallet",
    orders: "Bestellungen",
    transactions: "Transaktionen",
    faq: "FAQ",
    support: "Support",
    admin: "Admin",
    adminServices: "Admin Services",
    adminOrders: "Admin Bestellungen",
    adminUsers: "Admin Benutzer",
    adminDeposits: "Admin Einzahlungen",
    adminTransactions: "Admin Transaktionen",
    adminSupport: "Admin Support",
    promoCodes: "Promo Codes",
    settings: "Einstellungen",
    login: "Login",
    register: "Registrieren",
    logout: "Logout",
    footerText: "Social-Media-Promotion-Plattform für Creator und Unternehmen.",
    terms: "AGB",
    privacy: "Datenschutz",
    refundPolicy: "Rückerstattung",
    cookiePolicy: "Cookie Policy",
    imprint: "Impressum",
    disclaimer: "Disclaimer",
    contact: "Kontakt",
    languageTitle: "Webseiten-Sprache",
  },

  ru: {
    balance: "Баланс",
    services: "Услуги",
    dashboard: "Панель",
    wallet: "Кошелёк",
    orders: "Заказы",
    transactions: "Транзакции",
    faq: "FAQ",
    support: "Поддержка",
    admin: "Админ",
    adminServices: "Админ услуги",
    adminOrders: "Админ заказы",
    adminUsers: "Пользователи",
    adminDeposits: "Пополнения",
    adminTransactions: "Транзакции",
    adminSupport: "Поддержка",
    promoCodes: "Промокоды",
    settings: "Настройки",
    login: "Войти",
    register: "Регистрация",
    logout: "Выйти",
    footerText: "Платформа продвижения социальных сетей для авторов и бизнеса.",
    terms: "Условия",
    privacy: "Приватность",
    refundPolicy: "Возврат",
    cookiePolicy: "Cookie Policy",
    imprint: "Импрессум",
    disclaimer: "Дисклеймер",
    contact: "Контакт",
    languageTitle: "Язык сайта",
  },

  fr: {
    balance: "Solde",
    services: "Services",
    dashboard: "Tableau",
    wallet: "Wallet",
    orders: "Commandes",
    transactions: "Transactions",
    faq: "FAQ",
    support: "Support",
    admin: "Admin",
    adminServices: "Services Admin",
    adminOrders: "Commandes Admin",
    adminUsers: "Utilisateurs",
    adminDeposits: "Dépôts Admin",
    adminTransactions: "Transactions Admin",
    adminSupport: "Support Admin",
    promoCodes: "Codes Promo",
    settings: "Paramètres",
    login: "Connexion",
    register: "Créer compte",
    logout: "Déconnexion",
    footerText: "Plateforme de promotion social media pour créateurs et entreprises.",
    terms: "Conditions",
    privacy: "Confidentialité",
    refundPolicy: "Remboursement",
    cookiePolicy: "Cookie Policy",
    imprint: "Mentions légales",
    disclaimer: "Disclaimer",
    contact: "Contact",
    languageTitle: "Langue du site",
  },

  es: {
    balance: "Saldo",
    services: "Servicios",
    dashboard: "Panel",
    wallet: "Wallet",
    orders: "Pedidos",
    transactions: "Transacciones",
    faq: "FAQ",
    support: "Soporte",
    admin: "Admin",
    adminServices: "Servicios Admin",
    adminOrders: "Pedidos Admin",
    adminUsers: "Usuarios",
    adminDeposits: "Depósitos Admin",
    adminTransactions: "Transacciones Admin",
    adminSupport: "Soporte Admin",
    promoCodes: "Códigos Promo",
    settings: "Ajustes",
    login: "Login",
    register: "Registro",
    logout: "Logout",
    footerText: "Plataforma de promoción en redes sociales para creadores y empresas.",
    terms: "Términos",
    privacy: "Privacidad",
    refundPolicy: "Reembolso",
    cookiePolicy: "Cookie Policy",
    imprint: "Impressum",
    disclaimer: "Disclaimer",
    contact: "Contacto",
    languageTitle: "Idioma del sitio",
  },
};

export function getLanguageMeta(languageCode) {
  return (
    SUPPORTED_LANGUAGES.find((language) => language.code === languageCode) ||
    SUPPORTED_LANGUAGES[0]
  );
}

export function getStoredLanguage() {
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (
    storedLanguage &&
    SUPPORTED_LANGUAGES.some((language) => language.code === storedLanguage)
  ) {
    return storedLanguage;
  }

  return "en";
}

export function saveStoredLanguage(languageCode) {
  const safeLanguage = SUPPORTED_LANGUAGES.some(
    (language) => language.code === languageCode
  )
    ? languageCode
    : "en";

  localStorage.setItem(LANGUAGE_STORAGE_KEY, safeLanguage);

  window.dispatchEvent(
    new CustomEvent("empire-language-updated", {
      detail: {
        language: safeLanguage,
      },
    })
  );

  return safeLanguage;
}

export function getTranslations(languageCode) {
  return TRANSLATIONS[languageCode] || TRANSLATIONS.en;
}