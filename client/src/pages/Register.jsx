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
import "./Register.css";

const floatingRegisterItems = [
  { icon: "🚀", labelKey: "floatCreateAccount" },
  { icon: "💎", labelKey: "floatEmpireBoost" },
  { icon: "💳", labelKey: "floatWallet" },
  { icon: "📦", labelKey: "floatOrders" },
  { icon: "📸", labelKey: "floatInstagram" },
  { icon: "🎵", labelKey: "floatTikTok" },
  { icon: "▶️", labelKey: "floatYouTube" },
  { icon: "✈️", labelKey: "floatTelegram" },
  { icon: "📈", labelKey: "floatGrowth" },
  { icon: "🛡️", labelKey: "floatSecure" },
  { icon: "⚡", labelKey: "floatFastSetup" },
  { icon: "📊", labelKey: "floatDashboard" },
  { icon: "🔥", labelKey: "floatBoostMode" },
  { icon: "✅", labelKey: "floatVerified" },
  { icon: "🌍", labelKey: "floatCreators" },
  { icon: "🧠", labelKey: "floatSmartPanel" },
];

const REGISTER_TRANSLATIONS = {
  en: {
    languageLabel: "Language",
    memberAccess: "EmpireBoost member access",
    heroTitleOne: "Create your",
    heroTitleTwo: "EmpireBoost account.",
    heroText:
      "Start your social media growth dashboard, manage your wallet, place orders and contact support from one premium control room.",
    smartDashboardTitle: "Smart dashboard",
    smartDashboardText:
      "Track orders, wallet balance and support tickets from one clean control room.",
    walletSystemTitle: "Wallet system",
    walletSystemText:
      "Add balance once and use it for Instagram, TikTok, YouTube, Telegram and more.",
    noPasswordsTitle: "No passwords",
    noPasswordsText:
      "EmpireBoost never asks for your social media passwords. Only public links.",
    statPanelValue: "24/7",
    statPanelText: "Panel access",
    statPasswordsValue: "0",
    statPasswordsText: "Passwords needed",
    statGrowthValue: "∞",
    statGrowthText: "Growth options",
    setupStatus: "Account setup status",
    ready: "Ready",
    almostReady: "Almost ready",
    everythingClean: "Everything looks clean.",
    finishChecks: "Finish the checks to create your account.",
    newAccount: "New account",
    joinTitle: "Join EmpireBoost",
    joinSubtitle: "Create your account and open your dashboard in seconds.",
    termsTextOne: "I agree to the",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    refund: "Refund Policy",
    and: "and",
    securityCheck: "Security check",
    verifyHuman: "Verify you are human",
    securityText: "This helps protect registration from automated bot accounts.",
    missingTurnstile: "Missing VITE_TURNSTILE_SITE_KEY in client/.env",
    fastRegistration: "Fast registration",
    continueGoogle: "Continue with Google",
    googleText: "One click account setup after the security check is completed.",
    creatingGoogle: "Creating Google account...",
    acceptTermsGoogle: "Accept the terms first to enable Google registration.",
    completeSecurityGoogle:
      "Complete the security check above to enable Google registration.",
    orCreateEmail: "or create with email",
    emailAddress: "Email address",
    emailPlaceholder: "you@example.com",
    password: "Password",
    passwordPlaceholder: "Password, min 6 characters",
    show: "Show",
    hide: "Hide",
    passwordStrength: "Password strength",
    repeatPassword: "Repeat password",
    repeatPasswordPlaceholder: "Repeat your password",
    creatingAccount: "Creating account...",
    createAccount: "Create Account",
    bottomHint:
      "Complete terms, security check and password confirmation to enable registration.",
    alreadyRegistered: "Already registered?",
    loginExisting: "Login to existing account",
    trustNoSocialPasswords: "No social passwords",
    trustNoSocialPasswordsText:
      "Use only public profile, post, video or channel links.",
    botProtection: "Bot protection active",
    botProtectionText: "Security checks protect the platform from fake accounts.",
    strengthWaiting: "Waiting",
    strengthWaitingHint: "Use at least 6 characters.",
    strengthWeak: "Weak",
    strengthWeakHint: "Add more characters, numbers or symbols.",
    strengthGood: "Good",
    strengthGoodHint:
      "Nice. Add symbols or uppercase letters for more protection.",
    strengthStrong: "Strong",
    strengthStrongHint: "Strong password. Your account setup looks clean.",
    matchWaiting: "Waiting",
    matchWaitingText: "Repeat your password to confirm it.",
    matchSuccess: "Match",
    matchSuccessText: "Passwords match perfectly.",
    matchError: "No match",
    matchErrorText: "Passwords are not the same.",
    emailRequired: "Email is required.",
    emailInvalid: "Please enter a valid email address.",
    passwordMin: "Password must be at least 6 characters.",
    repeatRequired: "Please repeat your password.",
    passwordsNoMatch: "Passwords do not match.",
    termsRequired:
      "Please accept the Terms and Privacy Policy before creating an account.",
    googleTermsRequired:
      "Please accept the Terms and Privacy Policy before continuing with Google.",
    securityMissing:
      "Security check is not configured. Missing Turnstile site key.",
    securityRequired: "Please complete the security check before continuing.",
    securityFailed: "Security check failed. Please refresh and try again.",
    googleCredentialInvalid:
      "Google register did not return a valid credential.",
    googleFailed: "Google register failed",
    googleCancelled: "Google register was cancelled or failed.",
    registerFailed: "Register failed",
    floatCreateAccount: "Create Account",
    floatEmpireBoost: "EmpireBoost",
    floatWallet: "Wallet",
    floatOrders: "Orders",
    floatInstagram: "Instagram",
    floatTikTok: "TikTok",
    floatYouTube: "YouTube",
    floatTelegram: "Telegram",
    floatGrowth: "Growth",
    floatSecure: "Secure",
    floatFastSetup: "Fast Setup",
    floatDashboard: "Dashboard",
    floatBoostMode: "Boost Mode",
    floatVerified: "Verified",
    floatCreators: "Creators",
    floatSmartPanel: "Smart Panel",
  },

  de: {
    languageLabel: "Sprache",
    memberAccess: "EmpireBoost Member Zugang",
    heroTitleOne: "Erstelle dein",
    heroTitleTwo: "EmpireBoost Konto.",
    heroText:
      "Starte dein Social-Media-Growth-Dashboard, verwalte dein Wallet, erstelle Bestellungen und kontaktiere Support aus einem Premium-Control-Room.",
    smartDashboardTitle: "Smartes Dashboard",
    smartDashboardText:
      "Verfolge Bestellungen, Wallet-Guthaben und Support-Tickets in einem sauberen Control Room.",
    walletSystemTitle: "Wallet System",
    walletSystemText:
      "Lade Guthaben einmal auf und nutze es für Instagram, TikTok, YouTube, Telegram und mehr.",
    noPasswordsTitle: "Keine Passwörter",
    noPasswordsText:
      "EmpireBoost fragt niemals nach deinen Social-Media-Passwörtern. Nur öffentliche Links.",
    statPanelValue: "24/7",
    statPanelText: "Panel Zugang",
    statPasswordsValue: "0",
    statPasswordsText: "Passwörter nötig",
    statGrowthValue: "∞",
    statGrowthText: "Growth Optionen",
    setupStatus: "Account Setup Status",
    ready: "Bereit",
    almostReady: "Fast bereit",
    everythingClean: "Alles sieht sauber aus.",
    finishChecks: "Beende die Checks, um dein Konto zu erstellen.",
    newAccount: "Neuer Account",
    joinTitle: "EmpireBoost beitreten",
    joinSubtitle: "Erstelle dein Konto und öffne dein Dashboard in Sekunden.",
    termsTextOne: "Ich akzeptiere die",
    terms: "Nutzungsbedingungen",
    privacy: "Datenschutzerklärung",
    refund: "Rückerstattungsrichtlinie",
    and: "und",
    securityCheck: "Sicherheitscheck",
    verifyHuman: "Bestätige, dass du menschlich bist",
    securityText:
      "Das schützt die Registrierung vor automatisierten Bot-Accounts.",
    missingTurnstile: "VITE_TURNSTILE_SITE_KEY fehlt in client/.env",
    fastRegistration: "Schnelle Registrierung",
    continueGoogle: "Mit Google fortfahren",
    googleText:
      "Ein-Klick Kontoerstellung, nachdem der Sicherheitscheck abgeschlossen ist.",
    creatingGoogle: "Google Konto wird erstellt...",
    acceptTermsGoogle:
      "Akzeptiere zuerst die Bedingungen, um Google Registrierung zu aktivieren.",
    completeSecurityGoogle:
      "Schließe oben den Sicherheitscheck ab, um Google Registrierung zu aktivieren.",
    orCreateEmail: "oder mit E-Mail erstellen",
    emailAddress: "E-Mail-Adresse",
    emailPlaceholder: "du@example.com",
    password: "Passwort",
    passwordPlaceholder: "Passwort, mindestens 6 Zeichen",
    show: "Zeigen",
    hide: "Verbergen",
    passwordStrength: "Passwortstärke",
    repeatPassword: "Passwort wiederholen",
    repeatPasswordPlaceholder: "Wiederhole dein Passwort",
    creatingAccount: "Account wird erstellt...",
    createAccount: "Account erstellen",
    bottomHint:
      "Akzeptiere Bedingungen, Sicherheitscheck und Passwortbestätigung, um Registrierung zu aktivieren.",
    alreadyRegistered: "Schon registriert?",
    loginExisting: "In bestehenden Account einloggen",
    trustNoSocialPasswords: "Keine Social-Passwörter",
    trustNoSocialPasswordsText:
      "Nutze nur öffentliche Profil-, Post-, Video- oder Channel-Links.",
    botProtection: "Bot-Schutz aktiv",
    botProtectionText:
      "Sicherheitschecks schützen die Plattform vor Fake-Accounts.",
    strengthWaiting: "Wartet",
    strengthWaitingHint: "Nutze mindestens 6 Zeichen.",
    strengthWeak: "Schwach",
    strengthWeakHint: "Füge mehr Zeichen, Zahlen oder Symbole hinzu.",
    strengthGood: "Gut",
    strengthGoodHint:
      "Gut. Füge Symbole oder Großbuchstaben für mehr Schutz hinzu.",
    strengthStrong: "Stark",
    strengthStrongHint: "Starkes Passwort. Dein Account Setup sieht sauber aus.",
    matchWaiting: "Wartet",
    matchWaitingText: "Wiederhole dein Passwort zur Bestätigung.",
    matchSuccess: "Passt",
    matchSuccessText: "Passwörter stimmen perfekt überein.",
    matchError: "Passt nicht",
    matchErrorText: "Passwörter sind nicht gleich.",
    emailRequired: "E-Mail ist erforderlich.",
    emailInvalid: "Bitte gib eine gültige E-Mail-Adresse ein.",
    passwordMin: "Passwort muss mindestens 6 Zeichen haben.",
    repeatRequired: "Bitte wiederhole dein Passwort.",
    passwordsNoMatch: "Passwörter stimmen nicht überein.",
    termsRequired:
      "Bitte akzeptiere die Bedingungen und Datenschutzerklärung, bevor du ein Konto erstellst.",
    googleTermsRequired:
      "Bitte akzeptiere die Bedingungen und Datenschutzerklärung, bevor du mit Google fortfährst.",
    securityMissing:
      "Sicherheitscheck ist nicht konfiguriert. Turnstile Site Key fehlt.",
    securityRequired:
      "Bitte schließe den Sicherheitscheck ab, bevor du fortfährst.",
    securityFailed:
      "Sicherheitscheck fehlgeschlagen. Bitte aktualisieren und erneut versuchen.",
    googleCredentialInvalid:
      "Google Registrierung hat keine gültigen Zugangsdaten zurückgegeben.",
    googleFailed: "Google Registrierung fehlgeschlagen",
    googleCancelled:
      "Google Registrierung wurde abgebrochen oder ist fehlgeschlagen.",
    registerFailed: "Registrierung fehlgeschlagen",
    floatCreateAccount: "Account erstellen",
    floatEmpireBoost: "EmpireBoost",
    floatWallet: "Wallet",
    floatOrders: "Bestellungen",
    floatInstagram: "Instagram",
    floatTikTok: "TikTok",
    floatYouTube: "YouTube",
    floatTelegram: "Telegram",
    floatGrowth: "Growth",
    floatSecure: "Sicher",
    floatFastSetup: "Schnelles Setup",
    floatDashboard: "Dashboard",
    floatBoostMode: "Boost Modus",
    floatVerified: "Verifiziert",
    floatCreators: "Creator",
    floatSmartPanel: "Smart Panel",
  },

  es: {
    languageLabel: "Idioma",
    memberAccess: "Acceso miembro EmpireBoost",
    heroTitleOne: "Crea tu",
    heroTitleTwo: "cuenta EmpireBoost.",
    heroText:
      "Inicia tu dashboard de crecimiento social, gestiona tu wallet, realiza pedidos y contacta soporte desde una sala de control premium.",
    smartDashboardTitle: "Dashboard inteligente",
    smartDashboardText:
      "Sigue pedidos, saldo wallet y tickets de soporte desde un control room limpio.",
    walletSystemTitle: "Sistema wallet",
    walletSystemText:
      "Añade saldo una vez y úsalo para Instagram, TikTok, YouTube, Telegram y más.",
    noPasswordsTitle: "Sin contraseñas",
    noPasswordsText:
      "EmpireBoost nunca pide tus contraseñas de redes sociales. Solo enlaces públicos.",
    statPanelValue: "24/7",
    statPanelText: "Acceso panel",
    statPasswordsValue: "0",
    statPasswordsText: "Contraseñas necesarias",
    statGrowthValue: "∞",
    statGrowthText: "Opciones growth",
    setupStatus: "Estado de creación de cuenta",
    ready: "Listo",
    almostReady: "Casi listo",
    everythingClean: "Todo se ve limpio.",
    finishChecks: "Termina las verificaciones para crear tu cuenta.",
    newAccount: "Nueva cuenta",
    joinTitle: "Únete a EmpireBoost",
    joinSubtitle: "Crea tu cuenta y abre tu dashboard en segundos.",
    termsTextOne: "Acepto los",
    terms: "Términos de Servicio",
    privacy: "Política de Privacidad",
    refund: "Política de Reembolso",
    and: "y",
    securityCheck: "Verificación seguridad",
    verifyHuman: "Verifica que eres humano",
    securityText:
      "Esto ayuda a proteger el registro contra cuentas bot automatizadas.",
    missingTurnstile: "Falta VITE_TURNSTILE_SITE_KEY en client/.env",
    fastRegistration: "Registro rápido",
    continueGoogle: "Continuar con Google",
    googleText:
      "Creación de cuenta en un clic después de la verificación de seguridad.",
    creatingGoogle: "Creando cuenta Google...",
    acceptTermsGoogle:
      "Acepta los términos primero para activar registro con Google.",
    completeSecurityGoogle:
      "Completa la verificación de seguridad para activar Google registration.",
    orCreateEmail: "o crea con email",
    emailAddress: "Dirección email",
    emailPlaceholder: "tu@example.com",
    password: "Contraseña",
    passwordPlaceholder: "Contraseña, mínimo 6 caracteres",
    show: "Mostrar",
    hide: "Ocultar",
    passwordStrength: "Fuerza de contraseña",
    repeatPassword: "Repetir contraseña",
    repeatPasswordPlaceholder: "Repite tu contraseña",
    creatingAccount: "Creando cuenta...",
    createAccount: "Crear cuenta",
    bottomHint:
      "Completa términos, verificación y confirmación de contraseña para activar el registro.",
    alreadyRegistered: "¿Ya registrado?",
    loginExisting: "Entrar a cuenta existente",
    trustNoSocialPasswords: "Sin contraseñas sociales",
    trustNoSocialPasswordsText:
      "Usa solo enlaces públicos de perfil, post, video o canal.",
    botProtection: "Protección bot activa",
    botProtectionText:
      "Las verificaciones protegen la plataforma de cuentas falsas.",
    strengthWaiting: "Esperando",
    strengthWaitingHint: "Usa al menos 6 caracteres.",
    strengthWeak: "Débil",
    strengthWeakHint: "Añade más caracteres, números o símbolos.",
    strengthGood: "Buena",
    strengthGoodHint:
      "Bien. Añade símbolos o mayúsculas para más protección.",
    strengthStrong: "Fuerte",
    strengthStrongHint: "Contraseña fuerte. Tu cuenta se ve limpia.",
    matchWaiting: "Esperando",
    matchWaitingText: "Repite tu contraseña para confirmarla.",
    matchSuccess: "Coincide",
    matchSuccessText: "Las contraseñas coinciden perfectamente.",
    matchError: "No coincide",
    matchErrorText: "Las contraseñas no son iguales.",
    emailRequired: "El email es obligatorio.",
    emailInvalid: "Introduce un email válido.",
    passwordMin: "La contraseña debe tener mínimo 6 caracteres.",
    repeatRequired: "Repite tu contraseña.",
    passwordsNoMatch: "Las contraseñas no coinciden.",
    termsRequired:
      "Acepta los términos y la política de privacidad antes de crear cuenta.",
    googleTermsRequired:
      "Acepta los términos y la política de privacidad antes de continuar con Google.",
    securityMissing:
      "La verificación no está configurada. Falta Turnstile site key.",
    securityRequired: "Completa la verificación antes de continuar.",
    securityFailed: "Verificación fallida. Actualiza e inténtalo de nuevo.",
    googleCredentialInvalid:
      "Google registration no devolvió credenciales válidas.",
    googleFailed: "Registro con Google falló",
    googleCancelled: "Registro con Google cancelado o fallido.",
    registerFailed: "Registro fallido",
    floatCreateAccount: "Crear cuenta",
    floatEmpireBoost: "EmpireBoost",
    floatWallet: "Wallet",
    floatOrders: "Pedidos",
    floatInstagram: "Instagram",
    floatTikTok: "TikTok",
    floatYouTube: "YouTube",
    floatTelegram: "Telegram",
    floatGrowth: "Growth",
    floatSecure: "Seguro",
    floatFastSetup: "Setup rápido",
    floatDashboard: "Panel",
    floatBoostMode: "Boost Mode",
    floatVerified: "Verificado",
    floatCreators: "Creadores",
    floatSmartPanel: "Smart Panel",
  },

  fr: {
    languageLabel: "Langue",
    memberAccess: "Accès membre EmpireBoost",
    heroTitleOne: "Créez votre",
    heroTitleTwo: "compte EmpireBoost.",
    heroText:
      "Lancez votre dashboard de croissance social media, gérez votre wallet, passez des commandes et contactez le support depuis un control room premium.",
    smartDashboardTitle: "Dashboard intelligent",
    smartDashboardText:
      "Suivez commandes, solde wallet et tickets support depuis un espace propre.",
    walletSystemTitle: "Système wallet",
    walletSystemText:
      "Ajoutez du solde une fois et utilisez-le pour Instagram, TikTok, YouTube, Telegram et plus.",
    noPasswordsTitle: "Aucun mot de passe",
    noPasswordsText:
      "EmpireBoost ne demande jamais vos mots de passe sociaux. Seulement des liens publics.",
    statPanelValue: "24/7",
    statPanelText: "Accès panel",
    statPasswordsValue: "0",
    statPasswordsText: "Mots de passe requis",
    statGrowthValue: "∞",
    statGrowthText: "Options growth",
    setupStatus: "Statut création compte",
    ready: "Prêt",
    almostReady: "Presque prêt",
    everythingClean: "Tout semble propre.",
    finishChecks: "Terminez les vérifications pour créer votre compte.",
    newAccount: "Nouveau compte",
    joinTitle: "Rejoindre EmpireBoost",
    joinSubtitle: "Créez votre compte et ouvrez votre dashboard en secondes.",
    termsTextOne: "J’accepte les",
    terms: "Conditions d’utilisation",
    privacy: "Politique de confidentialité",
    refund: "Politique de remboursement",
    and: "et",
    securityCheck: "Vérification sécurité",
    verifyHuman: "Vérifiez que vous êtes humain",
    securityText:
      "Cela protège l’inscription contre les comptes bots automatisés.",
    missingTurnstile: "VITE_TURNSTILE_SITE_KEY manque dans client/.env",
    fastRegistration: "Inscription rapide",
    continueGoogle: "Continuer avec Google",
    googleText:
      "Création de compte en un clic après la vérification sécurité.",
    creatingGoogle: "Création du compte Google...",
    acceptTermsGoogle:
      "Acceptez d’abord les conditions pour activer l’inscription Google.",
    completeSecurityGoogle:
      "Complétez la vérification sécurité pour activer Google registration.",
    orCreateEmail: "ou créer avec email",
    emailAddress: "Adresse email",
    emailPlaceholder: "vous@example.com",
    password: "Mot de passe",
    passwordPlaceholder: "Mot de passe, min 6 caractères",
    show: "Afficher",
    hide: "Masquer",
    passwordStrength: "Force du mot de passe",
    repeatPassword: "Répéter le mot de passe",
    repeatPasswordPlaceholder: "Répétez votre mot de passe",
    creatingAccount: "Création du compte...",
    createAccount: "Créer un compte",
    bottomHint:
      "Complétez conditions, vérification sécurité et confirmation du mot de passe pour activer l’inscription.",
    alreadyRegistered: "Déjà inscrit ?",
    loginExisting: "Se connecter au compte existant",
    trustNoSocialPasswords: "Aucun mot de passe social",
    trustNoSocialPasswordsText:
      "Utilisez uniquement des liens publics de profil, post, vidéo ou chaîne.",
    botProtection: "Protection bot active",
    botProtectionText:
      "Les vérifications protègent la plateforme contre les faux comptes.",
    strengthWaiting: "En attente",
    strengthWaitingHint: "Utilisez au moins 6 caractères.",
    strengthWeak: "Faible",
    strengthWeakHint: "Ajoutez plus de caractères, chiffres ou symboles.",
    strengthGood: "Bon",
    strengthGoodHint:
      "Bien. Ajoutez symboles ou majuscules pour plus de protection.",
    strengthStrong: "Fort",
    strengthStrongHint: "Mot de passe fort. Votre setup est propre.",
    matchWaiting: "En attente",
    matchWaitingText: "Répétez votre mot de passe pour confirmer.",
    matchSuccess: "Correspond",
    matchSuccessText: "Les mots de passe correspondent parfaitement.",
    matchError: "Ne correspond pas",
    matchErrorText: "Les mots de passe ne sont pas identiques.",
    emailRequired: "L’email est requis.",
    emailInvalid: "Veuillez entrer une adresse email valide.",
    passwordMin: "Le mot de passe doit avoir au moins 6 caractères.",
    repeatRequired: "Veuillez répéter votre mot de passe.",
    passwordsNoMatch: "Les mots de passe ne correspondent pas.",
    termsRequired:
      "Veuillez accepter les conditions et la politique de confidentialité avant de créer un compte.",
    googleTermsRequired:
      "Veuillez accepter les conditions et la politique de confidentialité avant de continuer avec Google.",
    securityMissing:
      "La vérification sécurité n’est pas configurée. Turnstile site key manquant.",
    securityRequired:
      "Veuillez compléter la vérification sécurité avant de continuer.",
    securityFailed:
      "Vérification sécurité échouée. Actualisez et réessayez.",
    googleCredentialInvalid:
      "Google registration n’a pas retourné d’identifiant valide.",
    googleFailed: "Inscription Google échouée",
    googleCancelled: "Inscription Google annulée ou échouée.",
    registerFailed: "Inscription échouée",
    floatCreateAccount: "Créer compte",
    floatEmpireBoost: "EmpireBoost",
    floatWallet: "Wallet",
    floatOrders: "Commandes",
    floatInstagram: "Instagram",
    floatTikTok: "TikTok",
    floatYouTube: "YouTube",
    floatTelegram: "Telegram",
    floatGrowth: "Growth",
    floatSecure: "Sécurisé",
    floatFastSetup: "Setup rapide",
    floatDashboard: "Dashboard",
    floatBoostMode: "Boost Mode",
    floatVerified: "Vérifié",
    floatCreators: "Créateurs",
    floatSmartPanel: "Smart Panel",
  },

  ru: {
    languageLabel: "Язык",
    memberAccess: "Доступ участника EmpireBoost",
    heroTitleOne: "Создай свой",
    heroTitleTwo: "аккаунт EmpireBoost.",
    heroText:
      "Запусти dashboard роста соцсетей, управляй кошельком, создавай заказы и связывайся с поддержкой из премиум control room.",
    smartDashboardTitle: "Умный dashboard",
    smartDashboardText:
      "Отслеживай заказы, баланс кошелька и тикеты поддержки в одной чистой панели.",
    walletSystemTitle: "Wallet система",
    walletSystemText:
      "Пополняй баланс один раз и используй его для Instagram, TikTok, YouTube, Telegram и других платформ.",
    noPasswordsTitle: "Без паролей",
    noPasswordsText:
      "EmpireBoost никогда не просит пароли от соцсетей. Только публичные ссылки.",
    statPanelValue: "24/7",
    statPanelText: "Доступ к панели",
    statPasswordsValue: "0",
    statPasswordsText: "Паролей нужно",
    statGrowthValue: "∞",
    statGrowthText: "Growth опции",
    setupStatus: "Статус создания аккаунта",
    ready: "Готово",
    almostReady: "Почти готово",
    everythingClean: "Всё выглядит чисто.",
    finishChecks: "Заверши проверки, чтобы создать аккаунт.",
    newAccount: "Новый аккаунт",
    joinTitle: "Присоединиться к EmpireBoost",
    joinSubtitle: "Создай аккаунт и открой dashboard за секунды.",
    termsTextOne: "Я принимаю",
    terms: "Условия сервиса",
    privacy: "Политику конфиденциальности",
    refund: "Политику возврата",
    and: "и",
    securityCheck: "Проверка безопасности",
    verifyHuman: "Подтверди, что ты человек",
    securityText:
      "Это помогает защитить регистрацию от автоматических bot-аккаунтов.",
    missingTurnstile: "Отсутствует VITE_TURNSTILE_SITE_KEY в client/.env",
    fastRegistration: "Быстрая регистрация",
    continueGoogle: "Продолжить с Google",
    googleText:
      "Создание аккаунта в один клик после проверки безопасности.",
    creatingGoogle: "Создание Google аккаунта...",
    acceptTermsGoogle:
      "Сначала прими условия, чтобы включить регистрацию через Google.",
    completeSecurityGoogle:
      "Сначала пройди проверку безопасности, чтобы включить Google registration.",
    orCreateEmail: "или создать через email",
    emailAddress: "Email адрес",
    emailPlaceholder: "you@example.com",
    password: "Пароль",
    passwordPlaceholder: "Пароль, минимум 6 символов",
    show: "Показать",
    hide: "Скрыть",
    passwordStrength: "Надёжность пароля",
    repeatPassword: "Повтори пароль",
    repeatPasswordPlaceholder: "Повтори свой пароль",
    creatingAccount: "Создание аккаунта...",
    createAccount: "Создать аккаунт",
    bottomHint:
      "Заверши условия, проверку безопасности и подтверждение пароля, чтобы включить регистрацию.",
    alreadyRegistered: "Уже зарегистрирован?",
    loginExisting: "Войти в существующий аккаунт",
    trustNoSocialPasswords: "Без паролей соцсетей",
    trustNoSocialPasswordsText:
      "Используй только публичные ссылки профиля, поста, видео или канала.",
    botProtection: "Bot-защита активна",
    botProtectionText:
      "Проверки безопасности защищают платформу от фейковых аккаунтов.",
    strengthWaiting: "Ожидание",
    strengthWaitingHint: "Используй минимум 6 символов.",
    strengthWeak: "Слабый",
    strengthWeakHint: "Добавь больше символов, цифр или знаков.",
    strengthGood: "Хороший",
    strengthGoodHint:
      "Хорошо. Добавь символы или заглавные буквы для защиты.",
    strengthStrong: "Сильный",
    strengthStrongHint: "Сильный пароль. Setup аккаунта выглядит чисто.",
    matchWaiting: "Ожидание",
    matchWaitingText: "Повтори пароль для подтверждения.",
    matchSuccess: "Совпадает",
    matchSuccessText: "Пароли полностью совпадают.",
    matchError: "Не совпадает",
    matchErrorText: "Пароли не одинаковые.",
    emailRequired: "Email обязателен.",
    emailInvalid: "Введите корректный email.",
    passwordMin: "Пароль должен быть минимум 6 символов.",
    repeatRequired: "Повтори пароль.",
    passwordsNoMatch: "Пароли не совпадают.",
    termsRequired:
      "Прими условия и политику конфиденциальности перед созданием аккаунта.",
    googleTermsRequired:
      "Прими условия и политику конфиденциальности перед продолжением с Google.",
    securityMissing:
      "Проверка безопасности не настроена. Нет Turnstile site key.",
    securityRequired: "Сначала пройди проверку безопасности.",
    securityFailed: "Проверка безопасности не удалась. Обнови страницу.",
    googleCredentialInvalid:
      "Google registration не вернул корректные данные.",
    googleFailed: "Регистрация Google не удалась",
    googleCancelled: "Регистрация Google отменена или не удалась.",
    registerFailed: "Регистрация не удалась",
    floatCreateAccount: "Создать аккаунт",
    floatEmpireBoost: "EmpireBoost",
    floatWallet: "Кошелёк",
    floatOrders: "Заказы",
    floatInstagram: "Instagram",
    floatTikTok: "TikTok",
    floatYouTube: "YouTube",
    floatTelegram: "Telegram",
    floatGrowth: "Growth",
    floatSecure: "Безопасно",
    floatFastSetup: "Быстрый setup",
    floatDashboard: "Dashboard",
    floatBoostMode: "Boost Mode",
    floatVerified: "Проверено",
    floatCreators: "Создатели",
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

function getRegisterTranslations(languageCode) {
  return REGISTER_TRANSLATIONS[languageCode] || REGISTER_TRANSLATIONS.en;
}

function getPasswordStrength(password, t) {
  let score = 0;

  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (!password) {
    return {
      label: t.strengthWaiting,
      className: "registerStrengthEmpty",
      width: "0%",
      hint: t.strengthWaitingHint,
    };
  }

  if (score <= 1) {
    return {
      label: t.strengthWeak,
      className: "registerStrengthWeak",
      width: "34%",
      hint: t.strengthWeakHint,
    };
  }

  if (score <= 3) {
    return {
      label: t.strengthGood,
      className: "registerStrengthGood",
      width: "68%",
      hint: t.strengthGoodHint,
    };
  }

  return {
    label: t.strengthStrong,
    className: "registerStrengthStrong",
    width: "100%",
    hint: t.strengthStrongHint,
  };
}

function getPasswordMatch(password, confirmPassword, t) {
  if (!confirmPassword) {
    return {
      label: t.matchWaiting,
      className: "registerMatchWaiting",
      text: t.matchWaitingText,
    };
  }

  if (password === confirmPassword) {
    return {
      label: t.matchSuccess,
      className: "registerMatchSuccess",
      text: t.matchSuccessText,
    };
  }

  return {
    label: t.matchError,
    className: "registerMatchError",
    text: t.matchErrorText,
  };
}

function Register() {
  const navigate = useNavigate();
  const turnstileRef = useRef(null);

  const [selectedLanguage, setSelectedLanguage] = useState(getStoredLanguage());
  const selectedLanguageMeta = getLanguageMeta(selectedLanguage);
  const t = getRegisterTranslations(selectedLanguage);

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

  const benefits = useMemo(
    () => [
      {
        icon: "📊",
        title: t.smartDashboardTitle,
        text: t.smartDashboardText,
      },
      {
        icon: "💳",
        title: t.walletSystemTitle,
        text: t.walletSystemText,
      },
      {
        icon: "🛡️",
        title: t.noPasswordsTitle,
        text: t.noPasswordsText,
      },
    ],
    [t]
  );

  const passwordStrength = useMemo(
    () => getPasswordStrength(password, t),
    [password, t]
  );

  const passwordMatch = useMemo(
    () => getPasswordMatch(password, confirmPassword, t),
    [password, confirmPassword, t]
  );

  const canSubmit =
    Boolean(captchaToken) &&
    acceptedTerms &&
    email.trim().includes("@") &&
    password.length >= 6 &&
    confirmPassword.length >= 6 &&
    password === confirmPassword &&
    !isLoading;

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

    if (password.length < 6) {
      setError(t.passwordMin);
      return;
    }

    if (confirmPassword.length < 6) {
      setError(t.repeatRequired);
      return;
    }

    if (password !== confirmPassword) {
      setError(t.passwordsNoMatch);
      return;
    }

    if (!acceptedTerms) {
      setError(t.termsRequired);
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
      setError(err.response?.data?.message || t.registerFailed);
      resetCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");

    if (!acceptedTerms) {
      setError(t.googleTermsRequired);
      return;
    }

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
            key={`${item.labelKey}-${index}`}
          >
            <b>{item.icon}</b>
            <em>{t[item.labelKey] || item.labelKey}</em>
          </span>
        ))}
      </div>

      <section className="registerShell">
        <aside className="registerBrandPanel">
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

          <div className="registerBrandInner">
            <div className="registerBadge">
              <span />
              {t.memberAccess}
            </div>

            <h1 className="registerHeroTitle">
              <span>{t.heroTitleOne}</span>
              <strong>{t.heroTitleTwo}</strong>
            </h1>

            <p>{t.heroText}</p>

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
                <strong>{t.statPanelValue}</strong>
                <span>{t.statPanelText}</span>
              </div>

              <div>
                <strong>{t.statPasswordsValue}</strong>
                <span>{t.statPasswordsText}</span>
              </div>

              <div>
                <strong>{t.statGrowthValue}</strong>
                <span>{t.statGrowthText}</span>
              </div>
            </div>
          </div>

          <div className="registerLivePanel" aria-hidden="true">
            <div className="registerLiveTop">
              <span />
              {t.setupStatus}
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
              <b>{canSubmit ? t.ready : t.almostReady}</b>
              <em>{canSubmit ? t.everythingClean : t.finishChecks}</em>
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
                {t.newAccount}
              </span>

              <h2
                style={{
                  width: "100%",
                  textAlign: "center",
                  margin: "0 0 8px",
                }}
              >
                {t.joinTitle}
              </h2>

              <p
                style={{
                  width: "100%",
                  maxWidth: "360px",
                  margin: "0 auto",
                  textAlign: "center",
                }}
              >
                {t.joinSubtitle}
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
                {t.termsTextOne} <Link to="/terms">{t.terms}</Link>,{" "}
                <Link to="/privacy">{t.privacy}</Link> {t.and}{" "}
                <Link to="/refund-policy">{t.refund}</Link>.
              </p>
            </label>

            <div className="registerActionCard">
              <div className="registerCardTitleRow">
                <div className="registerCardIcon">🛡️</div>

                <div>
                  <span>{t.securityCheck}</span>
                  <strong>{t.verifyHuman}</strong>
                  <p>{t.securityText}</p>
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
                      setError(t.securityFailed);
                    }}
                  />
                ) : (
                  <p className="registerMissingKey">{t.missingTurnstile}</p>
                )}
              </div>
            </div>

            <div className="registerActionCard">
              <div className="registerCardTitleRow">
                <div className="registerCardIcon googleIcon">G</div>

                <div>
                  <span>{t.fastRegistration}</span>
                  <strong>{t.continueGoogle}</strong>
                  <p>{t.googleText}</p>
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
                <p className="registerHelperText">{t.creatingGoogle}</p>
              )}

              {!acceptedTerms && (
                <p className="registerHelperText">{t.acceptTermsGoogle}</p>
              )}

              {acceptedTerms && !captchaToken && (
                <p className="registerHelperText">{t.completeSecurityGoogle}</p>
              )}
            </div>

            <div className="registerDivider">
              <span />
              <p>{t.orCreateEmail}</p>
              <span />
            </div>

            <label className="registerInputGroup">
              <span>{t.emailAddress}</span>

              <div className="registerInputShell">
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

            <label className="registerInputGroup">
              <span>{t.password}</span>

              <div className="registerPasswordWrap">
                <b>🔒</b>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="registerShowPasswordBtn"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? t.hide : t.show}
                </button>
              </div>
            </label>

            <div className={`registerStrengthBox ${passwordStrength.className}`}>
              <div className="registerStrengthTop">
                <span>{t.passwordStrength}</span>
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
              <span>{t.repeatPassword}</span>

              <div className="registerPasswordWrap">
                <b>🔁</b>

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t.repeatPasswordPlaceholder}
                  value={confirmPassword}
                  autoComplete="new-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="registerShowPasswordBtn"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                >
                  {showConfirmPassword ? t.hide : t.show}
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
              <span>{isLoading ? t.creatingAccount : t.createAccount}</span>
              <b>{isLoading ? "⏳" : "→"}</b>
            </button>

            {!canSubmit && (
              <p className="registerBottomHint">{t.bottomHint}</p>
            )}

            <div className="registerDivider">
              <span />
              <p>{t.alreadyRegistered}</p>
              <span />
            </div>

            <Link className="registerLoginLink" to="/login">
              <span>{t.loginExisting}</span>
              <b>→</b>
            </Link>
          </form>

          <div className="registerTrustBox">
            <div>
              <strong>{t.trustNoSocialPasswords}</strong>
              <span>{t.trustNoSocialPasswordsText}</span>
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

export default Register;