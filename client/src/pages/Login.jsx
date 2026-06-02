import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Turnstile } from "@marsidev/react-turnstile";
import api from "../lib/api.js";
import {
  SUPPORTED_LANGUAGES,
  getLanguageMeta,
  getStoredLanguage,
  saveStoredLanguage,
} from "../lib/language.js";
import "./Login.css";

const floatingLoginItems = [
  { icon: "🔐", labelKey: "floatSecureLogin" },
  { icon: "⚡", labelKey: "floatFastAccess" },
  { icon: "📊", labelKey: "floatDashboard" },
  { icon: "💳", labelKey: "floatWallet" },
  { icon: "📦", labelKey: "floatOrders" },
  { icon: "💬", labelKey: "floatSupport" },
  { icon: "📸", labelKey: "floatInstagram" },
  { icon: "🎵", labelKey: "floatTikTok" },
  { icon: "▶️", labelKey: "floatYouTube" },
  { icon: "✈️", labelKey: "floatTelegram" },
  { icon: "🛡️", labelKey: "floatProtected" },
  { icon: "🚀", labelKey: "floatGrowthRoom" },
  { icon: "✅", labelKey: "floatVerified" },
  { icon: "🌍", labelKey: "floatCreators" },
  { icon: "💎", labelKey: "floatPremium" },
  { icon: "📈", labelKey: "floatLiveStats" },
  { icon: "🔥", labelKey: "floatBoostMode" },
  { icon: "🧠", labelKey: "floatSmartPanel" },
];

const LOGIN_TRANSLATIONS = {
  en: {
    languageLabel: "Language",
    secureAccess: "EmpireBoost secure access",
    heroTitleOne: "Welcome back.",
    heroTitleTwo: "Your growth control room is ready.",
    heroText:
      "Login to manage your wallet, track orders, open support tickets and control your EmpireBoost account from one premium dashboard.",
    benefitOrdersTitle: "Control your orders",
    benefitOrdersText:
      "Check order status, delivery progress and your full order history.",
    benefitWalletTitle: "Manage wallet balance",
    benefitWalletText:
      "View wallet activity, deposits, payments and transaction history.",
    benefitSupportTitle: "Open support tickets",
    benefitSupportText:
      "Contact EmpireBoost support directly from your account dashboard.",
    statAccessValue: "24/7",
    statAccessText: "Account access",
    statTrackingValue: "Live",
    statTrackingText: "Order tracking",
    statSupportValue: "Fast",
    statSupportText: "Support flow",
    liveSecurityStatus: "Live security status",
    protected: "Protected",
    encryptedSessionReady: "Encrypted session ready",
    memberLogin: "Member login",
    loginTitle: "Login",
    loginSubtitle: "Enter your email and password to open your dashboard.",
    securityCheck: "Security check",
    verifyHuman: "Verify you are human",
    securityText: "This protects EmpireBoost from automated login attacks.",
    missingTurnstile: "Missing VITE_TURNSTILE_SITE_KEY in client/.env",
    fastAccess: "Fast access",
    continueGoogle: "Continue with Google",
    googleText: "One click login after the security check is completed.",
    checkingGoogle: "Checking Google account...",
    completeSecurityGoogle:
      "Complete the security check above to enable Google login.",
    orUseEmail: "or use email",
    emailAddress: "Email address",
    emailPlaceholder: "you@example.com",
    password: "Password",
    passwordPlaceholder: "Your password",
    show: "Show",
    hide: "Hide",
    loginPreview: "Login preview",
    rememberEmail: "Remember email",
    forgotPassword: "Forgot password?",
    loggingIn: "Logging in...",
    loginButton: "Login",
    completeSecurityLogin: "Complete the security check to enable login.",
    newHere: "New here?",
    createAccount: "Create new account",
    noSocialPasswords: "No social passwords",
    noSocialPasswordsText: "EmpireBoost only needs public links for orders.",
    botProtection: "Bot protection active",
    botProtectionText:
      "Security checks protect the platform from automated abuse.",
    waitingEmail: "Waiting for email",
    emailNotComplete: "Email not complete",
    emailRequired: "Email is required.",
    emailInvalid: "Please enter a valid email address.",
    passwordRequired: "Password is required.",
    securityMissing:
      "Security check is not configured. Missing Turnstile site key.",
    securityRequired: "Please complete the security check before continuing.",
    securityFailed: "Security check failed. Please refresh and try again.",
    googleCredentialInvalid: "Google login did not return a valid credential.",
    googleFailed: "Google login failed",
    googleCancelled: "Google login was cancelled or failed.",
    loginFailed: "Login failed",
    floatSecureLogin: "Secure Login",
    floatFastAccess: "Fast Access",
    floatDashboard: "Dashboard",
    floatWallet: "Wallet",
    floatOrders: "Orders",
    floatSupport: "Support",
    floatInstagram: "Instagram",
    floatTikTok: "TikTok",
    floatYouTube: "YouTube",
    floatTelegram: "Telegram",
    floatProtected: "Protected",
    floatGrowthRoom: "Growth Room",
    floatVerified: "Verified",
    floatCreators: "Creators",
    floatPremium: "Premium",
    floatLiveStats: "Live Stats",
    floatBoostMode: "Boost Mode",
    floatSmartPanel: "Smart Panel",
  },

  de: {
    languageLabel: "Sprache",
    secureAccess: "EmpireBoost sicherer Zugang",
    heroTitleOne: "Willkommen zurück.",
    heroTitleTwo: "Dein Growth Control Room ist bereit.",
    heroText:
      "Logge dich ein, um dein Wallet zu verwalten, Bestellungen zu verfolgen, Support-Tickets zu öffnen und dein EmpireBoost Konto in einem Premium-Dashboard zu steuern.",
    benefitOrdersTitle: "Bestellungen kontrollieren",
    benefitOrdersText:
      "Prüfe Bestellstatus, Lieferfortschritt und deine komplette Bestellhistorie.",
    benefitWalletTitle: "Wallet-Guthaben verwalten",
    benefitWalletText:
      "Sieh Wallet-Aktivität, Einzahlungen, Zahlungen und Transaktionen.",
    benefitSupportTitle: "Support-Tickets öffnen",
    benefitSupportText:
      "Kontaktiere EmpireBoost Support direkt aus deinem Account-Dashboard.",
    statAccessValue: "24/7",
    statAccessText: "Account-Zugang",
    statTrackingValue: "Live",
    statTrackingText: "Bestelltracking",
    statSupportValue: "Schnell",
    statSupportText: "Support-Ablauf",
    liveSecurityStatus: "Live Sicherheitsstatus",
    protected: "Geschützt",
    encryptedSessionReady: "Verschlüsselte Session bereit",
    memberLogin: "Member Login",
    loginTitle: "Login",
    loginSubtitle:
      "Gib deine E-Mail und dein Passwort ein, um dein Dashboard zu öffnen.",
    securityCheck: "Sicherheitscheck",
    verifyHuman: "Bestätige, dass du menschlich bist",
    securityText:
      "Das schützt EmpireBoost vor automatisierten Login-Angriffen.",
    missingTurnstile: "VITE_TURNSTILE_SITE_KEY fehlt in client/.env",
    fastAccess: "Schneller Zugang",
    continueGoogle: "Mit Google fortfahren",
    googleText:
      "Ein-Klick-Login, nachdem der Sicherheitscheck abgeschlossen ist.",
    checkingGoogle: "Google Account wird geprüft...",
    completeSecurityGoogle:
      "Schließe oben den Sicherheitscheck ab, um Google Login zu aktivieren.",
    orUseEmail: "oder E-Mail verwenden",
    emailAddress: "E-Mail-Adresse",
    emailPlaceholder: "du@example.com",
    password: "Passwort",
    passwordPlaceholder: "Dein Passwort",
    show: "Zeigen",
    hide: "Verbergen",
    loginPreview: "Login Vorschau",
    rememberEmail: "E-Mail merken",
    forgotPassword: "Passwort vergessen?",
    loggingIn: "Login läuft...",
    loginButton: "Login",
    completeSecurityLogin:
      "Schließe den Sicherheitscheck ab, um Login zu aktivieren.",
    newHere: "Neu hier?",
    createAccount: "Neuen Account erstellen",
    noSocialPasswords: "Keine Social-Passwörter",
    noSocialPasswordsText:
      "EmpireBoost braucht nur öffentliche Links für Bestellungen.",
    botProtection: "Bot-Schutz aktiv",
    botProtectionText:
      "Sicherheitschecks schützen die Plattform vor automatisiertem Missbrauch.",
    waitingEmail: "Warte auf E-Mail",
    emailNotComplete: "E-Mail nicht vollständig",
    emailRequired: "E-Mail ist erforderlich.",
    emailInvalid: "Bitte gib eine gültige E-Mail-Adresse ein.",
    passwordRequired: "Passwort ist erforderlich.",
    securityMissing:
      "Sicherheitscheck ist nicht konfiguriert. Turnstile Site Key fehlt.",
    securityRequired:
      "Bitte schließe den Sicherheitscheck ab, bevor du fortfährst.",
    securityFailed:
      "Sicherheitscheck fehlgeschlagen. Bitte aktualisieren und erneut versuchen.",
    googleCredentialInvalid:
      "Google Login hat keine gültigen Zugangsdaten zurückgegeben.",
    googleFailed: "Google Login fehlgeschlagen",
    googleCancelled: "Google Login wurde abgebrochen oder ist fehlgeschlagen.",
    loginFailed: "Login fehlgeschlagen",
    floatSecureLogin: "Sicherer Login",
    floatFastAccess: "Schneller Zugang",
    floatDashboard: "Dashboard",
    floatWallet: "Wallet",
    floatOrders: "Bestellungen",
    floatSupport: "Support",
    floatInstagram: "Instagram",
    floatTikTok: "TikTok",
    floatYouTube: "YouTube",
    floatTelegram: "Telegram",
    floatProtected: "Geschützt",
    floatGrowthRoom: "Growth Room",
    floatVerified: "Verifiziert",
    floatCreators: "Creator",
    floatPremium: "Premium",
    floatLiveStats: "Live Stats",
    floatBoostMode: "Boost Modus",
    floatSmartPanel: "Smart Panel",
  },

  ru: {
    languageLabel: "Язык",
    secureAccess: "Безопасный доступ EmpireBoost",
    heroTitleOne: "С возвращением.",
    heroTitleTwo: "Твоя growth-панель готова.",
    heroText:
      "Войди, чтобы управлять кошельком, отслеживать заказы, открывать тикеты поддержки и контролировать аккаунт EmpireBoost из премиум-панели.",
    benefitOrdersTitle: "Контроль заказов",
    benefitOrdersText:
      "Проверяй статус заказа, прогресс доставки и полную историю заказов.",
    benefitWalletTitle: "Управление балансом",
    benefitWalletText:
      "Смотри активность кошелька, депозиты, платежи и историю транзакций.",
    benefitSupportTitle: "Тикеты поддержки",
    benefitSupportText:
      "Связывайся с поддержкой EmpireBoost прямо из панели аккаунта.",
    statAccessValue: "24/7",
    statAccessText: "Доступ к аккаунту",
    statTrackingValue: "Live",
    statTrackingText: "Отслеживание заказов",
    statSupportValue: "Быстро",
    statSupportText: "Поддержка",
    liveSecurityStatus: "Статус безопасности",
    protected: "Защищено",
    encryptedSessionReady: "Зашифрованная сессия готова",
    memberLogin: "Вход участника",
    loginTitle: "Войти",
    loginSubtitle: "Введи email и пароль, чтобы открыть панель.",
    securityCheck: "Проверка безопасности",
    verifyHuman: "Подтверди, что ты человек",
    securityText:
      "Это защищает EmpireBoost от автоматических атак на вход.",
    missingTurnstile: "Отсутствует VITE_TURNSTILE_SITE_KEY в client/.env",
    fastAccess: "Быстрый доступ",
    continueGoogle: "Продолжить с Google",
    googleText: "Вход в один клик после прохождения проверки безопасности.",
    checkingGoogle: "Проверка Google аккаунта...",
    completeSecurityGoogle:
      "Сначала пройди проверку безопасности, чтобы включить Google вход.",
    orUseEmail: "или используй email",
    emailAddress: "Email адрес",
    emailPlaceholder: "you@example.com",
    password: "Пароль",
    passwordPlaceholder: "Твой пароль",
    show: "Показать",
    hide: "Скрыть",
    loginPreview: "Превью входа",
    rememberEmail: "Запомнить email",
    forgotPassword: "Забыли пароль?",
    loggingIn: "Вход...",
    loginButton: "Войти",
    completeSecurityLogin: "Пройди проверку безопасности, чтобы включить вход.",
    newHere: "Новый пользователь?",
    createAccount: "Создать аккаунт",
    noSocialPasswords: "Без паролей соцсетей",
    noSocialPasswordsText:
      "EmpireBoost нужны только публичные ссылки для заказов.",
    botProtection: "Bot-защита активна",
    botProtectionText:
      "Проверки безопасности защищают платформу от автоматического злоупотребления.",
    waitingEmail: "Ожидание email",
    emailNotComplete: "Email не завершён",
    emailRequired: "Email обязателен.",
    emailInvalid: "Введите корректный email.",
    passwordRequired: "Пароль обязателен.",
    securityMissing:
      "Проверка безопасности не настроена. Нет Turnstile site key.",
    securityRequired: "Сначала пройди проверку безопасности.",
    securityFailed: "Проверка безопасности не удалась. Обнови страницу.",
    googleCredentialInvalid: "Google Login не вернул корректные данные.",
    googleFailed: "Google вход не удался",
    googleCancelled: "Google вход отменён или не удался.",
    loginFailed: "Вход не удался",
    floatSecureLogin: "Безопасный вход",
    floatFastAccess: "Быстрый доступ",
    floatDashboard: "Панель",
    floatWallet: "Кошелёк",
    floatOrders: "Заказы",
    floatSupport: "Поддержка",
    floatInstagram: "Instagram",
    floatTikTok: "TikTok",
    floatYouTube: "YouTube",
    floatTelegram: "Telegram",
    floatProtected: "Защищено",
    floatGrowthRoom: "Growth Room",
    floatVerified: "Проверено",
    floatCreators: "Создатели",
    floatPremium: "Premium",
    floatLiveStats: "Live Stats",
    floatBoostMode: "Boost Mode",
    floatSmartPanel: "Smart Panel",
  },

  fr: {
    languageLabel: "Langue",
    secureAccess: "Accès sécurisé EmpireBoost",
    heroTitleOne: "Bon retour.",
    heroTitleTwo: "Votre espace de croissance est prêt.",
    heroText:
      "Connectez-vous pour gérer votre wallet, suivre vos commandes, ouvrir des tickets support et contrôler votre compte EmpireBoost depuis un dashboard premium.",
    benefitOrdersTitle: "Contrôler vos commandes",
    benefitOrdersText:
      "Consultez le statut, la progression et l’historique complet de vos commandes.",
    benefitWalletTitle: "Gérer le solde wallet",
    benefitWalletText:
      "Voir l’activité du wallet, les dépôts, paiements et transactions.",
    benefitSupportTitle: "Ouvrir des tickets support",
    benefitSupportText:
      "Contactez le support EmpireBoost directement depuis votre dashboard.",
    statAccessValue: "24/7",
    statAccessText: "Accès compte",
    statTrackingValue: "Live",
    statTrackingText: "Suivi commandes",
    statSupportValue: "Rapide",
    statSupportText: "Flux support",
    liveSecurityStatus: "Statut sécurité live",
    protected: "Protégé",
    encryptedSessionReady: "Session chiffrée prête",
    memberLogin: "Connexion membre",
    loginTitle: "Connexion",
    loginSubtitle:
      "Entrez votre email et mot de passe pour ouvrir votre dashboard.",
    securityCheck: "Vérification sécurité",
    verifyHuman: "Vérifiez que vous êtes humain",
    securityText: "Cela protège EmpireBoost contre les attaques automatisées.",
    missingTurnstile: "VITE_TURNSTILE_SITE_KEY manque dans client/.env",
    fastAccess: "Accès rapide",
    continueGoogle: "Continuer avec Google",
    googleText: "Connexion en un clic après la vérification sécurité.",
    checkingGoogle: "Vérification du compte Google...",
    completeSecurityGoogle:
      "Complétez la vérification sécurité pour activer Google Login.",
    orUseEmail: "ou utiliser email",
    emailAddress: "Adresse email",
    emailPlaceholder: "vous@example.com",
    password: "Mot de passe",
    passwordPlaceholder: "Votre mot de passe",
    show: "Afficher",
    hide: "Masquer",
    loginPreview: "Aperçu login",
    rememberEmail: "Mémoriser email",
    forgotPassword: "Mot de passe oublié ?",
    loggingIn: "Connexion...",
    loginButton: "Connexion",
    completeSecurityLogin:
      "Complétez la vérification sécurité pour activer la connexion.",
    newHere: "Nouveau ici ?",
    createAccount: "Créer un compte",
    noSocialPasswords: "Aucun mot de passe social",
    noSocialPasswordsText:
      "EmpireBoost utilise uniquement des liens publics pour les commandes.",
    botProtection: "Protection bot active",
    botProtectionText:
      "Les vérifications protègent la plateforme contre les abus automatisés.",
    waitingEmail: "Email en attente",
    emailNotComplete: "Email incomplet",
    emailRequired: "L’email est requis.",
    emailInvalid: "Veuillez entrer une adresse email valide.",
    passwordRequired: "Le mot de passe est requis.",
    securityMissing:
      "La vérification sécurité n’est pas configurée. Turnstile site key manquant.",
    securityRequired:
      "Veuillez compléter la vérification sécurité avant de continuer.",
    securityFailed: "Vérification sécurité échouée. Actualisez et réessayez.",
    googleCredentialInvalid:
      "Google Login n’a pas retourné d’identifiant valide.",
    googleFailed: "Google Login échoué",
    googleCancelled: "Google Login annulé ou échoué.",
    loginFailed: "Connexion échouée",
    floatSecureLogin: "Login sécurisé",
    floatFastAccess: "Accès rapide",
    floatDashboard: "Dashboard",
    floatWallet: "Wallet",
    floatOrders: "Commandes",
    floatSupport: "Support",
    floatInstagram: "Instagram",
    floatTikTok: "TikTok",
    floatYouTube: "YouTube",
    floatTelegram: "Telegram",
    floatProtected: "Protégé",
    floatGrowthRoom: "Growth Room",
    floatVerified: "Vérifié",
    floatCreators: "Créateurs",
    floatPremium: "Premium",
    floatLiveStats: "Live Stats",
    floatBoostMode: "Boost Mode",
    floatSmartPanel: "Smart Panel",
  },

  es: {
    languageLabel: "Idioma",
    secureAccess: "Acceso seguro EmpireBoost",
    heroTitleOne: "Bienvenido de nuevo.",
    heroTitleTwo: "Tu sala de control de crecimiento está lista.",
    heroText:
      "Inicia sesión para gestionar tu wallet, seguir pedidos, abrir tickets de soporte y controlar tu cuenta EmpireBoost desde un dashboard premium.",
    benefitOrdersTitle: "Controla tus pedidos",
    benefitOrdersText: "Revisa el estado del pedido, el progreso y todo tu historial.",
    benefitWalletTitle: "Gestiona tu saldo wallet",
    benefitWalletText:
      "Consulta actividad, depósitos, pagos e historial de transacciones.",
    benefitSupportTitle: "Abre tickets de soporte",
    benefitSupportText:
      "Contacta con soporte EmpireBoost directamente desde tu dashboard.",
    statAccessValue: "24/7",
    statAccessText: "Acceso cuenta",
    statTrackingValue: "Live",
    statTrackingText: "Seguimiento pedidos",
    statSupportValue: "Rápido",
    statSupportText: "Flujo soporte",
    liveSecurityStatus: "Estado de seguridad live",
    protected: "Protegido",
    encryptedSessionReady: "Sesión cifrada lista",
    memberLogin: "Login miembro",
    loginTitle: "Login",
    loginSubtitle: "Introduce tu email y contraseña para abrir tu dashboard.",
    securityCheck: "Verificación seguridad",
    verifyHuman: "Verifica que eres humano",
    securityText:
      "Esto protege EmpireBoost contra ataques automáticos de login.",
    missingTurnstile: "Falta VITE_TURNSTILE_SITE_KEY en client/.env",
    fastAccess: "Acceso rápido",
    continueGoogle: "Continuar con Google",
    googleText: "Login en un clic después de completar la verificación.",
    checkingGoogle: "Verificando cuenta Google...",
    completeSecurityGoogle:
      "Completa la verificación para activar Google login.",
    orUseEmail: "o usa email",
    emailAddress: "Dirección email",
    emailPlaceholder: "tu@example.com",
    password: "Contraseña",
    passwordPlaceholder: "Tu contraseña",
    show: "Mostrar",
    hide: "Ocultar",
    loginPreview: "Vista login",
    rememberEmail: "Recordar email",
    forgotPassword: "¿Olvidaste la contraseña?",
    loggingIn: "Iniciando sesión...",
    loginButton: "Login",
    completeSecurityLogin: "Completa la verificación para activar el login.",
    newHere: "¿Nuevo aquí?",
    createAccount: "Crear cuenta nueva",
    noSocialPasswords: "Sin contraseñas sociales",
    noSocialPasswordsText:
      "EmpireBoost solo necesita enlaces públicos para los pedidos.",
    botProtection: "Protección bot activa",
    botProtectionText:
      "Las verificaciones protegen la plataforma de abuso automático.",
    waitingEmail: "Esperando email",
    emailNotComplete: "Email incompleto",
    emailRequired: "El email es obligatorio.",
    emailInvalid: "Introduce un email válido.",
    passwordRequired: "La contraseña es obligatoria.",
    securityMissing:
      "La verificación no está configurada. Falta Turnstile site key.",
    securityRequired: "Completa la verificación antes de continuar.",
    securityFailed: "Verificación fallida. Actualiza e inténtalo de nuevo.",
    googleCredentialInvalid: "Google Login no devolvió credenciales válidas.",
    googleFailed: "Google login falló",
    googleCancelled: "Google login cancelado o fallido.",
    loginFailed: "Login fallido",
    floatSecureLogin: "Login seguro",
    floatFastAccess: "Acceso rápido",
    floatDashboard: "Panel",
    floatWallet: "Wallet",
    floatOrders: "Pedidos",
    floatSupport: "Soporte",
    floatInstagram: "Instagram",
    floatTikTok: "TikTok",
    floatYouTube: "YouTube",
    floatTelegram: "Telegram",
    floatProtected: "Protegido",
    floatGrowthRoom: "Growth Room",
    floatVerified: "Verificado",
    floatCreators: "Creadores",
    floatPremium: "Premium",
    floatLiveStats: "Live Stats",
    floatBoostMode: "Boost Mode",
    floatSmartPanel: "Smart Panel",
  },
};

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

const languageBoxStyle = {
  position: "absolute",
  top: "18px",
  right: "18px",
  zIndex: 5,
  minWidth: "138px",
  height: "42px",
  padding: "0 10px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  borderRadius: "999px",
  border: "1px solid rgba(147, 197, 253, 0.2)",
  background:
    "radial-gradient(circle at 20% 0%, rgba(255,255,255,0.14), transparent 42%), linear-gradient(135deg, rgba(15,23,42,0.88), rgba(2,6,23,0.72))",
  boxShadow:
    "0 16px 36px rgba(0,0,0,0.28), 0 0 28px rgba(56,189,248,0.1), inset 0 1px 0 rgba(255,255,255,0.07)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
};

const languageFlagStyle = {
  width: "26px",
  height: "26px",
  minWidth: "26px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "999px",
  fontSize: "14px",
  lineHeight: 1,
  background:
    "radial-gradient(circle at 35% 25%, rgba(255,255,255,0.24), transparent 38%), linear-gradient(135deg, rgba(37,99,235,0.48), rgba(14,165,233,0.18))",
  boxShadow:
    "0 0 18px rgba(56,189,248,0.12), inset 0 1px 0 rgba(255,255,255,0.1)",
};

const languageSelectWrapStyle = {
  position: "relative",
  height: "30px",
  minWidth: "76px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const languageSelectStyle = {
  width: "76px",
  height: "30px",
  lineHeight: "30px",
  border: 0,
  outline: 0,
  borderRadius: "999px",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: 950,
  fontSize: "12px",
  background:
    "linear-gradient(135deg, rgba(37,99,235,0.56), rgba(14,165,233,0.22))",
  padding: "0 28px 0 12px",
  margin: 0,
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  boxSizing: "border-box",
  display: "block",
  textAlign: "left",
  textAlignLast: "left",
  verticalAlign: "middle",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
};

const languageArrowStyle = {
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "rgba(219,234,254,0.9)",
  fontSize: "9px",
  fontWeight: 950,
  pointerEvents: "none",
  lineHeight: 1,
};

function getLoginTranslations(languageCode) {
  return LOGIN_TRANSLATIONS[languageCode] || LOGIN_TRANSLATIONS.en;
}

function getEmailPreview(email, translations) {
  const cleanEmail = email.trim();

  if (!cleanEmail) return translations.waitingEmail;
  if (!cleanEmail.includes("@")) return translations.emailNotComplete;

  return cleanEmail.toLowerCase();
}

function Login() {
  const navigate = useNavigate();
  const turnstileRef = useRef(null);

  const [selectedLanguage, setSelectedLanguage] = useState(getStoredLanguage());
  const selectedLanguageMeta = getLanguageMeta(selectedLanguage);
  const t = getLoginTranslations(selectedLanguage);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberInfo, setRememberInfo] = useState(true);
  const [captchaToken, setCaptchaToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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

  const loginBenefits = useMemo(
    () => [
      {
        icon: "📦",
        title: t.benefitOrdersTitle,
        text: t.benefitOrdersText,
      },
      {
        icon: "💳",
        title: t.benefitWalletTitle,
        text: t.benefitWalletText,
      },
      {
        icon: "💬",
        title: t.benefitSupportTitle,
        text: t.benefitSupportText,
      },
    ],
    [t]
  );

  const emailPreview = useMemo(() => getEmailPreview(email, t), [email, t]);

  const handleLanguageChange = (event) => {
    const nextLanguage = saveStoredLanguage(event.target.value);
    setSelectedLanguage(nextLanguage);
    setError("");
  };

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
      setError(t.securityMissing);
      return false;
    }

    if (!captchaToken) {
      setError(t.securityRequired);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError(t.emailRequired);
      return;
    }

    if (!cleanEmail.includes("@")) {
      setError(t.emailInvalid);
      return;
    }

    if (!password) {
      setError(t.passwordRequired);
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
      setError(err.response?.data?.message || t.loginFailed);
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
      setError(t.googleCredentialInvalid);
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
      setError(err.response?.data?.message || t.googleFailed);
      resetCaptcha();
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError(t.googleCancelled);
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
            key={`${item.labelKey}-${index}`}
          >
            <b>{item.icon}</b>
            <em>{t[item.labelKey] || item.labelKey}</em>
          </span>
        ))}
      </div>

      <section className="loginShell">
        <aside className="loginBrandPanel">
          <div
            style={languageBoxStyle}
            title={`${t.languageLabel}: ${selectedLanguageMeta.label}`}
          >
            <span style={languageFlagStyle}>{selectedLanguageMeta.flag}</span>

            <span style={languageSelectWrapStyle}>
              <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                aria-label={t.languageLabel}
                style={languageSelectStyle}
              >
                {SUPPORTED_LANGUAGES.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.short}
                  </option>
                ))}
              </select>

              <span style={languageArrowStyle}>▼</span>
            </span>
          </div>

          <div className="loginBrandInner">
            <div className="loginBadge">
              <span />
              {t.secureAccess}
            </div>

            <h1 className="loginHeroTitle">
              <span>{t.heroTitleOne}</span>
              <strong>{t.heroTitleTwo}</strong>
            </h1>

            <p>{t.heroText}</p>

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
                <strong>{t.statAccessValue}</strong>
                <span>{t.statAccessText}</span>
              </div>

              <div>
                <strong>{t.statTrackingValue}</strong>
                <span>{t.statTrackingText}</span>
              </div>

              <div>
                <strong>{t.statSupportValue}</strong>
                <span>{t.statSupportText}</span>
              </div>
            </div>
          </div>

          <div className="loginLivePanel" aria-hidden="true">
            <div className="loginLiveTop">
              <span />
              {t.liveSecurityStatus}
            </div>

            <div className="loginLiveBars">
              <i />
              <i />
              <i />
              <i />
            </div>

            <div className="loginLiveBottom">
              <b>{t.protected}</b>
              <em>{t.encryptedSessionReady}</em>
            </div>
          </div>
        </aside>

        <section className="loginFormPanel">
          <form className="loginCard" onSubmit={handleSubmit}>
            <div className="loginCardGlow" aria-hidden="true" />

            <div className="loginFormHeader">
              <span>{t.memberLogin}</span>
              <h2>{t.loginTitle}</h2>
              <p>{t.loginSubtitle}</p>
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
                  <span>{t.securityCheck}</span>
                  <strong>{t.verifyHuman}</strong>
                  <p>{t.securityText}</p>
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
                      setError(t.securityFailed);
                    }}
                  />
                ) : (
                  <p className="loginMissingKey">{t.missingTurnstile}</p>
                )}
              </div>
            </div>

            <div className="loginActionCard">
              <div className="loginCardTitleRow">
                <div className="loginCardIcon googleIcon">G</div>

                <div>
                  <span>{t.fastAccess}</span>
                  <strong>{t.continueGoogle}</strong>
                  <p>{t.googleText}</p>
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
                <p className="loginHelperText">{t.checkingGoogle}</p>
              )}

              {!captchaToken && (
                <p className="loginHelperText">{t.completeSecurityGoogle}</p>
              )}
            </div>

            <div className="loginDivider">
              <span />
              <p>{t.orUseEmail}</p>
              <span />
            </div>

            <label className="loginInputGroup">
              <span>{t.emailAddress}</span>

              <div className="loginInputShell">
                <b>✉️</b>

                <input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </label>

            <label className="loginInputGroup">
              <span>{t.password}</span>

              <div className="loginPasswordWrap">
                <b>🔒</b>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="loginShowPasswordBtn"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? t.hide : t.show}
                </button>
              </div>
            </label>

            <div className="loginSessionBox">
              <div>
                <span>{t.loginPreview}</span>
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

                  <p>{t.rememberEmail}</p>
                </label>

                <Link className="loginForgotLink" to="/forgot-password">
                  {t.forgotPassword}
                </Link>
              </div>
            </div>

            <button
              className="loginSubmitBtn"
              type="submit"
              disabled={isLoading || !captchaToken}
            >
              <span>{isLoading ? t.loggingIn : t.loginButton}</span>
              <b>{isLoading ? "⏳" : "→"}</b>
            </button>

            {!captchaToken && (
              <p className="loginBottomHint">{t.completeSecurityLogin}</p>
            )}

            <div className="loginDivider">
              <span />
              <p>{t.newHere}</p>
              <span />
            </div>

            <Link className="loginRegisterLink" to="/register">
              <span>{t.createAccount}</span>
              <b>+</b>
            </Link>
          </form>

          <div className="loginTrustBox">
            <div>
              <strong>{t.noSocialPasswords}</strong>
              <span>{t.noSocialPasswordsText}</span>
            </div>

            <div>
              <strong>{t.botProtection}</strong>
              <span>{t.botProtectionText}</span>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Login;