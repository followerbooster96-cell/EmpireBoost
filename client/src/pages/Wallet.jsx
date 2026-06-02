import { useEffect, useMemo, useState } from "react";
import api from "../lib/api.js";
import useCurrency from "../lib/useCurrency.js";
import { getStoredLanguage } from "../lib/language.js";
import "./Wallet.css";

const WALLET_TRANSLATIONS = {
  en: {
    payeer: "Payeer",
    crypto: "Crypto",
    revolut: "Revolut",
    skrill: "Skrill",
    manual: "Manual",
    instant: "Fast",
    backup: "Backup",
    fast: "Fast",
    classic: "Classic",

    payeerDescription: "Payeer top-up request with payment reference.",
    cryptoDescription: "USDT, BTC or ETH request for manual verification.",
    revolutDescription: "Quick Revolut top-up request with payment note.",
    skrillDescription: "Skrill top-up request with email or payment note.",

    floatingWallet: "Wallet",
    floatingBalance: "Balance",
    floatingCheckout: "Checkout",
    floatingTopUp: "Top Up",
    floatingFunds: "Funds",
    floatingSecure: "Secure",
    floatingCompleted: "Completed",
    floatingPending: "Pending",
    floatingOrders: "Orders",
    floatingGrowth: "Growth",
    floatingCreator: "Creator",
    floatingRevenue: "Revenue",
    floatingPayments: "Payments",
    floatingTracking: "Tracking",

    requestCreated: "request created successfully.",
    enterMinimum: "Please enter at least 1.00 EUR.",
    couldNotCreatePayment: "Could not create payment.",

    heroBadge: "Premium wallet top-up",
    heroTitle: "Fund your wallet with flexible payment options.",
    heroText:
      "Choose Payeer, Crypto, Revolut or Skrill. All top-ups are created as secure deposit requests and reviewed before the balance is credited.",
    addFunds: "Add Funds",
    paymentHistory: "Payment History",

    currentBalance: "Current balance",
    availableOrders: "Available for new orders",
    shownIn: "shown in",
    payments: "Payments",
    pending: "Pending",

    walletBalance: "Wallet balance",
    readyToSpend: "Ready to spend on services",
    totalDeposited: "Total deposited",
    completedPaymentsOnly: "Approved deposits only",
    pendingPayments: "Pending deposits",
    waitingNotCaptured: "Waiting for admin review",
    totalPayments: "Total deposits",
    allAttempts: "All deposit requests",

    addFundsPanel: "Add funds",
    payWithPayeer: "Top up with Payeer",
    payWithCrypto: "Top up with Crypto",
    payWithRevolut: "Top up with Revolut",
    payWithSkrill: "Top up with Skrill",

    payeerLong:
      "Create a Payeer deposit request. Add your Payeer account, transaction ID or payment note so admin can verify it.",
    cryptoLong:
      "Create a crypto deposit request. Add your transaction hash, wallet note, network and coin so admin can verify it.",
    revolutLong:
      "Create a Revolut deposit request. Add your Revolut name or transfer note for faster approval.",
    skrillLong:
      "Create a Skrill deposit request. Add your Skrill email, transaction ID or payment note for faster approval.",

    topupAmount: "Top-up amount",
    exampleAmount: "Example: 25.00",
    paymentCurrency: "Payment currency",
    promoOptional: "Promo code optional",
    promoPlaceholder: "Example: BOOST10",
    noteOptional: "Payment note required",
    notePlaceholder: "Transaction ID, email, wallet hash, Revolut name...",
    backupMethod: "Manual verification",
    paymentPreview: "Payment preview",
    manualPreview: "Request is created in EUR. Display preview is shown in",
    creatingRequest: "Creating request...",
    createRequest: "Create",
    request: "Request",
    currencyInfo:
      "Wallet and payment calculations stay in EUR. The selected currency is only a display conversion so pricing stays safe and clear.",

    paymentGuide: "Payment guide",
    howItWorks: "How it works",
    stepOneTitle: "Choose method",
    stepOneText: "Select Payeer, Crypto, Revolut or Skrill.",
    stepTwoTitle: "Enter amount",
    stepTwoText: "Payment amount is entered in EUR to keep wallet accounting accurate.",
    stepThreeTitle: "Submit proof",
    stepThreeText:
      "Add your transaction ID, payment note, crypto hash or account reference.",
    stepFourTitle: "Balance updates",
    stepFourText:
      "Admin reviews the request and credits your wallet after confirmation.",

    myPayments: "My deposits",
    noPaymentsYet: "No deposits yet",
    noPaymentsText:
      "Your Payeer, Crypto, Revolut and Skrill deposit requests will appear here.",
    provider: "Provider",
    reference: "Reference",
    amount: "Amount",
    display: "Display",
    status: "Status",
    info: "Info",
    date: "Date",
    originalCurrency: "Original payment currency",
  },

  de: {
    payeer: "Payeer",
    crypto: "Crypto",
    revolut: "Revolut",
    skrill: "Skrill",
    manual: "Manuell",
    instant: "Schnell",
    backup: "Backup",
    fast: "Schnell",
    classic: "Klassisch",

    payeerDescription: "Payeer-Aufladung mit Zahlungsreferenz.",
    cryptoDescription: "USDT, BTC oder ETH Anfrage zur manuellen Prüfung.",
    revolutDescription: "Schnelle Revolut-Aufladung mit Zahlungsnotiz.",
    skrillDescription: "Skrill-Aufladung mit E-Mail oder Zahlungsnotiz.",

    floatingWallet: "Wallet",
    floatingBalance: "Guthaben",
    floatingCheckout: "Checkout",
    floatingTopUp: "Aufladen",
    floatingFunds: "Funds",
    floatingSecure: "Sicher",
    floatingCompleted: "Abgeschlossen",
    floatingPending: "Ausstehend",
    floatingOrders: "Bestellungen",
    floatingGrowth: "Growth",
    floatingCreator: "Creator",
    floatingRevenue: "Umsatz",
    floatingPayments: "Zahlungen",
    floatingTracking: "Tracking",

    requestCreated: "Anfrage erfolgreich erstellt.",
    enterMinimum: "Bitte gib mindestens 1.00 EUR ein.",
    couldNotCreatePayment: "Zahlung konnte nicht erstellt werden.",

    heroBadge: "Premium Wallet Aufladung",
    heroTitle: "Lade dein Wallet mit flexiblen Zahlungsmethoden auf.",
    heroText:
      "Wähle Payeer, Crypto, Revolut oder Skrill. Alle Aufladungen werden als sichere Deposit-Anfragen erstellt und vor der Gutschrift geprüft.",
    addFunds: "Guthaben aufladen",
    paymentHistory: "Zahlungsverlauf",

    currentBalance: "Aktuelles Guthaben",
    availableOrders: "Verfügbar für neue Bestellungen",
    shownIn: "angezeigt in",
    payments: "Zahlungen",
    pending: "Ausstehend",

    walletBalance: "Wallet-Guthaben",
    readyToSpend: "Bereit für Services",
    totalDeposited: "Gesamt eingezahlt",
    completedPaymentsOnly: "Nur genehmigte Deposits",
    pendingPayments: "Ausstehende Deposits",
    waitingNotCaptured: "Wartet auf Admin-Prüfung",
    totalPayments: "Deposits gesamt",
    allAttempts: "Alle Deposit-Anfragen",

    addFundsPanel: "Guthaben aufladen",
    payWithPayeer: "Mit Payeer aufladen",
    payWithCrypto: "Mit Crypto aufladen",
    payWithRevolut: "Mit Revolut aufladen",
    payWithSkrill: "Mit Skrill aufladen",

    payeerLong:
      "Erstelle eine Payeer-Deposit-Anfrage. Füge Payeer-Konto, Transaction-ID oder Zahlungsnotiz hinzu, damit Admin es prüfen kann.",
    cryptoLong:
      "Erstelle eine Crypto-Deposit-Anfrage. Füge Tx-Hash, Wallet-Notiz, Netzwerk und Coin hinzu, damit Admin es prüfen kann.",
    revolutLong:
      "Erstelle eine Revolut-Deposit-Anfrage. Füge deinen Revolut-Namen oder Transferhinweis für schnellere Prüfung hinzu.",
    skrillLong:
      "Erstelle eine Skrill-Deposit-Anfrage. Füge deine Skrill-E-Mail, Transaction-ID oder Zahlungsnotiz hinzu.",

    topupAmount: "Aufladebetrag",
    exampleAmount: "Beispiel: 25.00",
    paymentCurrency: "Zahlungswährung",
    promoOptional: "Promo-Code optional",
    promoPlaceholder: "Beispiel: BOOST10",
    noteOptional: "Zahlungsnotiz erforderlich",
    notePlaceholder: "Transaction-ID, E-Mail, Wallet-Hash, Revolut-Name...",
    backupMethod: "Manuelle Prüfung",
    paymentPreview: "Zahlungsvorschau",
    manualPreview: "Anfrage wird in EUR erstellt. Vorschau wird angezeigt in",
    creatingRequest: "Anfrage wird erstellt...",
    createRequest: "Erstelle",
    request: "Anfrage",
    currencyInfo:
      "Wallet- und Zahlungsberechnungen bleiben in EUR. Die ausgewählte Währung ist nur eine Anzeigeumrechnung.",

    paymentGuide: "Zahlungsanleitung",
    howItWorks: "So funktioniert es",
    stepOneTitle: "Methode wählen",
    stepOneText: "Wähle Payeer, Crypto, Revolut oder Skrill.",
    stepTwoTitle: "Betrag eingeben",
    stepTwoText: "Der Zahlungsbetrag wird in EUR eingegeben, damit die Wallet korrekt bleibt.",
    stepThreeTitle: "Nachweis senden",
    stepThreeText:
      "Füge Transaction-ID, Zahlungsnotiz, Crypto-Hash oder Account-Referenz hinzu.",
    stepFourTitle: "Guthaben aktualisiert",
    stepFourText:
      "Admin prüft die Anfrage und schreibt dein Wallet nach Bestätigung gut.",

    myPayments: "Meine Deposits",
    noPaymentsYet: "Noch keine Deposits",
    noPaymentsText:
      "Deine Payeer-, Crypto-, Revolut- und Skrill-Deposit-Anfragen erscheinen hier.",
    provider: "Anbieter",
    reference: "Referenz",
    amount: "Betrag",
    display: "Anzeige",
    status: "Status",
    info: "Info",
    date: "Datum",
    originalCurrency: "Originale Zahlungswährung",
  },

  es: {
    payeer: "Payeer",
    crypto: "Crypto",
    revolut: "Revolut",
    skrill: "Skrill",
    manual: "Manual",
    instant: "Rápido",
    backup: "Backup",
    fast: "Rápido",
    classic: "Clásico",

    payeerDescription: "Solicitud Payeer con referencia de pago.",
    cryptoDescription: "Solicitud USDT, BTC o ETH para verificación manual.",
    revolutDescription: "Solicitud rápida de Revolut con nota de pago.",
    skrillDescription: "Solicitud Skrill con email o nota de pago.",

    floatingWallet: "Wallet",
    floatingBalance: "Saldo",
    floatingCheckout: "Checkout",
    floatingTopUp: "Recarga",
    floatingFunds: "Fondos",
    floatingSecure: "Seguro",
    floatingCompleted: "Completado",
    floatingPending: "Pendiente",
    floatingOrders: "Pedidos",
    floatingGrowth: "Growth",
    floatingCreator: "Creator",
    floatingRevenue: "Ingresos",
    floatingPayments: "Pagos",
    floatingTracking: "Tracking",

    requestCreated: "solicitud creada correctamente.",
    enterMinimum: "Introduce al menos 1.00 EUR.",
    couldNotCreatePayment: "No se pudo crear el pago.",

    heroBadge: "Recarga wallet premium",
    heroTitle: "Añade fondos a tu wallet con métodos flexibles.",
    heroText:
      "Elige Payeer, Crypto, Revolut o Skrill. Todas las recargas se crean como solicitudes seguras y se revisan antes de acreditar el saldo.",
    addFunds: "Añadir fondos",
    paymentHistory: "Historial de pagos",

    currentBalance: "Saldo actual",
    availableOrders: "Disponible para nuevos pedidos",
    shownIn: "mostrado en",
    payments: "Pagos",
    pending: "Pendientes",

    walletBalance: "Saldo wallet",
    readyToSpend: "Listo para usar en servicios",
    totalDeposited: "Total depositado",
    completedPaymentsOnly: "Solo depósitos aprobados",
    pendingPayments: "Depósitos pendientes",
    waitingNotCaptured: "Esperando revisión admin",
    totalPayments: "Depósitos totales",
    allAttempts: "Todas las solicitudes",

    addFundsPanel: "Añadir fondos",
    payWithPayeer: "Recargar con Payeer",
    payWithCrypto: "Recargar con Crypto",
    payWithRevolut: "Recargar con Revolut",
    payWithSkrill: "Recargar con Skrill",

    payeerLong:
      "Crea una solicitud Payeer. Añade tu cuenta Payeer, ID de transacción o nota de pago.",
    cryptoLong:
      "Crea una solicitud crypto. Añade hash, nota wallet, red y moneda para verificación.",
    revolutLong:
      "Crea una solicitud Revolut. Añade tu nombre Revolut o nota de transferencia.",
    skrillLong:
      "Crea una solicitud Skrill. Añade tu email Skrill, ID de transacción o nota de pago.",

    topupAmount: "Cantidad de recarga",
    exampleAmount: "Ejemplo: 25.00",
    paymentCurrency: "Moneda de pago",
    promoOptional: "Código promo opcional",
    promoPlaceholder: "Ejemplo: BOOST10",
    noteOptional: "Nota de pago requerida",
    notePlaceholder: "ID transacción, email, wallet hash, nombre Revolut...",
    backupMethod: "Verificación manual",
    paymentPreview: "Vista previa del pago",
    manualPreview: "La solicitud se crea en EUR. Vista previa mostrada en",
    creatingRequest: "Creando solicitud...",
    createRequest: "Crear",
    request: "Solicitud",
    currencyInfo:
      "Los cálculos reales de wallet y pagos se mantienen en EUR. La moneda seleccionada es solo una conversión visual.",

    paymentGuide: "Guía de pago",
    howItWorks: "Cómo funciona",
    stepOneTitle: "Elige método",
    stepOneText: "Selecciona Payeer, Crypto, Revolut o Skrill.",
    stepTwoTitle: "Introduce cantidad",
    stepTwoText: "La cantidad se introduce en EUR para mantener el wallet correcto.",
    stepThreeTitle: "Envía prueba",
    stepThreeText:
      "Añade ID de transacción, nota de pago, crypto hash o referencia.",
    stepFourTitle: "Saldo actualizado",
    stepFourText:
      "Admin revisa la solicitud y acredita el wallet tras confirmación.",

    myPayments: "Mis depósitos",
    noPaymentsYet: "Aún no hay depósitos",
    noPaymentsText:
      "Tus solicitudes de Payeer, Crypto, Revolut y Skrill aparecerán aquí.",
    provider: "Proveedor",
    reference: "Referencia",
    amount: "Cantidad",
    display: "Vista",
    status: "Estado",
    info: "Info",
    date: "Fecha",
    originalCurrency: "Moneda original del pago",
  },

  fr: {
    payeer: "Payeer",
    crypto: "Crypto",
    revolut: "Revolut",
    skrill: "Skrill",
    manual: "Manuel",
    instant: "Rapide",
    backup: "Backup",
    fast: "Rapide",
    classic: "Classique",

    payeerDescription: "Demande Payeer avec référence de paiement.",
    cryptoDescription: "Demande USDT, BTC ou ETH pour vérification manuelle.",
    revolutDescription: "Demande Revolut rapide avec note de paiement.",
    skrillDescription: "Demande Skrill avec email ou note de paiement.",

    floatingWallet: "Wallet",
    floatingBalance: "Solde",
    floatingCheckout: "Checkout",
    floatingTopUp: "Recharge",
    floatingFunds: "Fonds",
    floatingSecure: "Sécurisé",
    floatingCompleted: "Terminé",
    floatingPending: "En attente",
    floatingOrders: "Commandes",
    floatingGrowth: "Growth",
    floatingCreator: "Creator",
    floatingRevenue: "Revenu",
    floatingPayments: "Paiements",
    floatingTracking: "Tracking",

    requestCreated: "demande créée avec succès.",
    enterMinimum: "Veuillez entrer au moins 1.00 EUR.",
    couldNotCreatePayment: "Impossible de créer le paiement.",

    heroBadge: "Recharge wallet premium",
    heroTitle: "Rechargez votre wallet avec des méthodes flexibles.",
    heroText:
      "Choisissez Payeer, Crypto, Revolut ou Skrill. Toutes les recharges sont créées comme demandes sécurisées et vérifiées avant crédit.",
    addFunds: "Ajouter des fonds",
    paymentHistory: "Historique paiements",

    currentBalance: "Solde actuel",
    availableOrders: "Disponible pour nouvelles commandes",
    shownIn: "affiché en",
    payments: "Paiements",
    pending: "En attente",

    walletBalance: "Solde wallet",
    readyToSpend: "Prêt pour les services",
    totalDeposited: "Total déposé",
    completedPaymentsOnly: "Dépôts approuvés uniquement",
    pendingPayments: "Dépôts en attente",
    waitingNotCaptured: "En attente de vérification admin",
    totalPayments: "Dépôts total",
    allAttempts: "Toutes les demandes",

    addFundsPanel: "Ajouter des fonds",
    payWithPayeer: "Recharger avec Payeer",
    payWithCrypto: "Recharger avec Crypto",
    payWithRevolut: "Recharger avec Revolut",
    payWithSkrill: "Recharger avec Skrill",

    payeerLong:
      "Créez une demande Payeer. Ajoutez votre compte Payeer, ID transaction ou note de paiement.",
    cryptoLong:
      "Créez une demande crypto. Ajoutez hash, note wallet, réseau et coin pour vérification.",
    revolutLong:
      "Créez une demande Revolut. Ajoutez votre nom Revolut ou note de transfert.",
    skrillLong:
      "Créez une demande Skrill. Ajoutez votre email Skrill, ID transaction ou note de paiement.",

    topupAmount: "Montant recharge",
    exampleAmount: "Exemple : 25.00",
    paymentCurrency: "Devise paiement",
    promoOptional: "Code promo optionnel",
    promoPlaceholder: "Exemple : BOOST10",
    noteOptional: "Note paiement requise",
    notePlaceholder: "ID transaction, email, wallet hash, nom Revolut...",
    backupMethod: "Vérification manuelle",
    paymentPreview: "Aperçu paiement",
    manualPreview: "La demande est créée en EUR. Aperçu affiché en",
    creatingRequest: "Création demande...",
    createRequest: "Créer",
    request: "Demande",
    currencyInfo:
      "Les calculs réels wallet et paiements restent en EUR. La devise sélectionnée est seulement une conversion d’affichage.",

    paymentGuide: "Guide paiement",
    howItWorks: "Comment ça marche",
    stepOneTitle: "Choisir méthode",
    stepOneText: "Sélectionnez Payeer, Crypto, Revolut ou Skrill.",
    stepTwoTitle: "Entrer montant",
    stepTwoText: "Le montant est entré en EUR pour garder le wallet correct.",
    stepThreeTitle: "Envoyer preuve",
    stepThreeText:
      "Ajoutez ID transaction, note paiement, crypto hash ou référence.",
    stepFourTitle: "Solde mis à jour",
    stepFourText:
      "Admin vérifie la demande et crédite le wallet après confirmation.",

    myPayments: "Mes dépôts",
    noPaymentsYet: "Aucun dépôt",
    noPaymentsText:
      "Vos demandes Payeer, Crypto, Revolut et Skrill apparaîtront ici.",
    provider: "Fournisseur",
    reference: "Référence",
    amount: "Montant",
    display: "Affichage",
    status: "Statut",
    info: "Info",
    date: "Date",
    originalCurrency: "Devise originale du paiement",
  },

  ru: {
    payeer: "Payeer",
    crypto: "Crypto",
    revolut: "Revolut",
    skrill: "Skrill",
    manual: "Вручную",
    instant: "Быстро",
    backup: "Backup",
    fast: "Быстро",
    classic: "Классика",

    payeerDescription: "Payeer top-up запрос с payment reference.",
    cryptoDescription: "USDT, BTC или ETH запрос для ручной проверки.",
    revolutDescription: "Быстрый Revolut top-up запрос с платежной заметкой.",
    skrillDescription: "Skrill top-up запрос с email или payment note.",

    floatingWallet: "Wallet",
    floatingBalance: "Баланс",
    floatingCheckout: "Checkout",
    floatingTopUp: "Пополнить",
    floatingFunds: "Funds",
    floatingSecure: "Secure",
    floatingCompleted: "Completed",
    floatingPending: "Pending",
    floatingOrders: "Orders",
    floatingGrowth: "Growth",
    floatingCreator: "Creator",
    floatingRevenue: "Revenue",
    floatingPayments: "Payments",
    floatingTracking: "Tracking",

    requestCreated: "запрос успешно создан.",
    enterMinimum: "Введите минимум 1.00 EUR.",
    couldNotCreatePayment: "Не удалось создать платёж.",

    heroBadge: "Premium wallet top-up",
    heroTitle: "Пополняй wallet гибкими способами оплаты.",
    heroText:
      "Выбери Payeer, Crypto, Revolut или Skrill. Все пополнения создаются как deposit requests и проверяются перед зачислением.",
    addFunds: "Пополнить",
    paymentHistory: "История платежей",

    currentBalance: "Текущий баланс",
    availableOrders: "Доступно для новых заказов",
    shownIn: "показано в",
    payments: "Платежи",
    pending: "Ожидает",

    walletBalance: "Wallet баланс",
    readyToSpend: "Готово для services",
    totalDeposited: "Всего пополнено",
    completedPaymentsOnly: "Только approved deposits",
    pendingPayments: "Ожидающие deposits",
    waitingNotCaptured: "Ждет admin review",
    totalPayments: "Всего deposits",
    allAttempts: "Все deposit requests",

    addFundsPanel: "Пополнить wallet",
    payWithPayeer: "Пополнить Payeer",
    payWithCrypto: "Пополнить Crypto",
    payWithRevolut: "Пополнить Revolut",
    payWithSkrill: "Пополнить Skrill",

    payeerLong:
      "Создай Payeer deposit request. Добавь Payeer account, transaction ID или payment note.",
    cryptoLong:
      "Создай crypto deposit request. Добавь transaction hash, wallet note, network и coin.",
    revolutLong:
      "Создай Revolut deposit request. Добавь Revolut name или transfer note.",
    skrillLong:
      "Создай Skrill deposit request. Добавь Skrill email, transaction ID или payment note.",

    topupAmount: "Сумма пополнения",
    exampleAmount: "Пример: 25.00",
    paymentCurrency: "Валюта оплаты",
    promoOptional: "Promo code optional",
    promoPlaceholder: "Пример: BOOST10",
    noteOptional: "Payment note required",
    notePlaceholder: "Transaction ID, email, wallet hash, Revolut name...",
    backupMethod: "Manual verification",
    paymentPreview: "Payment preview",
    manualPreview: "Запрос создаётся в EUR. Preview показан в",
    creatingRequest: "Создание запроса...",
    createRequest: "Создать",
    request: "Запрос",
    currencyInfo:
      "Реальные wallet и payment расчёты остаются в EUR. Выбранная валюта — только display conversion.",

    paymentGuide: "Payment guide",
    howItWorks: "Как это работает",
    stepOneTitle: "Выбери метод",
    stepOneText: "Выбери Payeer, Crypto, Revolut или Skrill.",
    stepTwoTitle: "Введи сумму",
    stepTwoText: "Сумма вводится в EUR, чтобы wallet accounting был точным.",
    stepThreeTitle: "Отправь proof",
    stepThreeText:
      "Добавь transaction ID, payment note, crypto hash или account reference.",
    stepFourTitle: "Баланс обновляется",
    stepFourText:
      "Admin проверяет request и зачисляет balance после confirmation.",

    myPayments: "Мои deposits",
    noPaymentsYet: "Deposits ещё нет",
    noPaymentsText:
      "Payeer, Crypto, Revolut и Skrill deposit requests будут появляться здесь.",
    provider: "Provider",
    reference: "Reference",
    amount: "Amount",
    display: "Display",
    status: "Status",
    info: "Info",
    date: "Date",
    originalCurrency: "Original payment currency",
  },
};

function getWalletTranslations(languageCode) {
  return WALLET_TRANSLATIONS[languageCode] || WALLET_TRANSLATIONS.en;
}

function formatDate(value) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return "-";
  }
}

function getStatusClass(status) {
  const cleanStatus = String(status || "").toLowerCase();

  if (["completed", "approved", "paid"].includes(cleanStatus)) {
    return "walletStatusApproved";
  }

  if (["failed", "cancelled", "rejected"].includes(cleanStatus)) {
    return "walletStatusRejected";
  }

  return "walletStatusPending";
}

function PaymentLogo({ method }) {
  if (method.value === "payeer") {
    return (
      <div className="walletRealLogo walletPaypalLogo" aria-hidden="true">
        <span className="walletPaypalP">P</span>
        <span className="walletPaypalText">Payeer</span>
      </div>
    );
  }

  if (method.value === "crypto") {
    return (
      <div className="walletRealLogo walletCryptoLogo" aria-hidden="true">
        <span className="walletCryptoCoin">₿</span>
        <span className="walletCryptoText">Crypto</span>
      </div>
    );
  }

  if (method.value === "revolut") {
    return (
      <div className="walletRealLogo walletRevolutLogo" aria-hidden="true">
        <span className="walletRevolutMark">R</span>
        <span className="walletRevolutText">Revolut</span>
      </div>
    );
  }

  return (
    <div className="walletRealLogo walletBankLogo" aria-hidden="true">
      <span className="walletBankMark">S</span>
      <span className="walletBankText">Skrill</span>
    </div>
  );
}

function Wallet() {
  const { selectedCurrency, selectedCurrencyMeta, currencyRateText, formatMoney } =
    useCurrency();

  const [selectedLanguage, setSelectedLanguage] = useState(getStoredLanguage());
  const t = getWalletTranslations(selectedLanguage);

  const paymentMethods = useMemo(
    () => [
      {
        value: "payeer",
        label: t.payeer,
        short: "PY",
        mode: t.manual,
        modeKey: "manual",
        tag: t.fast,
        description: t.payeerDescription,
        brandClass: "walletBrandPaypal",
      },
      {
        value: "crypto",
        label: t.crypto,
        short: "CR",
        mode: t.manual,
        modeKey: "manual",
        tag: t.backup,
        description: t.cryptoDescription,
        brandClass: "walletBrandCrypto",
      },
      {
        value: "revolut",
        label: t.revolut,
        short: "RV",
        mode: t.manual,
        modeKey: "manual",
        tag: t.fast,
        description: t.revolutDescription,
        brandClass: "walletBrandRevolut",
      },
      {
        value: "skrill",
        label: t.skrill,
        short: "SK",
        mode: t.manual,
        modeKey: "manual",
        tag: t.classic,
        description: t.skrillDescription,
        brandClass: "walletBrandBank",
      },
    ],
    [t]
  );

  const floatingWalletItems = useMemo(
    () => [
      t.floatingWallet,
      t.floatingBalance,
      "Payeer",
      "Crypto",
      "Revolut",
      "Skrill",
      t.floatingCheckout,
      t.floatingTopUp,
      t.floatingFunds,
      t.floatingSecure,
      t.floatingCompleted,
      t.floatingPending,
      t.floatingOrders,
      t.floatingGrowth,
      t.floatingCreator,
      t.fast,
      t.floatingRevenue,
      t.floatingPayments,
      t.floatingTracking,
    ],
    [t]
  );

  const [user, setUser] = useState(null);
  const [manualDeposits, setManualDeposits] = useState([]);

  const [selectedMethod, setSelectedMethod] = useState("payeer");
  const [amount, setAmount] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [userNote, setUserNote] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const activeMethod =
    paymentMethods.find((method) => method.value === selectedMethod) || paymentMethods[0];

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

  const loadUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));

        window.dispatchEvent(
          new CustomEvent("empire-user-updated", {
            detail: {
              user: res.data.user,
            },
          })
        );
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const loadManualDeposits = async () => {
    try {
      const res = await api.get("/deposits/my");
      setManualDeposits(res.data.deposits || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const loadWalletData = async () => {
    setIsLoading(true);
    await Promise.allSettled([loadUser(), loadManualDeposits()]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadWalletData();
  }, []);

  const walletStats = useMemo(() => {
    const completedManualDeposits = manualDeposits.filter((deposit) =>
      ["approved", "completed", "paid"].includes(String(deposit.status || "").toLowerCase())
    );

    const totalManualDeposited = completedManualDeposits.reduce(
      (sum, deposit) => sum + Number(deposit.finalAmount || deposit.amount || 0),
      0
    );

    const pendingManualDeposits = manualDeposits.filter((deposit) =>
      ["pending", "waiting", "review"].includes(String(deposit.status || "").toLowerCase())
    ).length;

    return {
      totalDeposited: totalManualDeposited,
      pendingPayments: pendingManualDeposits,
      requests: manualDeposits.length,
    };
  }, [manualDeposits]);

  const previewAmount = Number(amount || 0);

  const historyItems = useMemo(() => {
    return manualDeposits
      .map((deposit) => ({
        id: deposit._id,
        provider: deposit.method || "Manual",
        reference: deposit.paymentReference || "-",
        amount: deposit.finalAmount || deposit.amount,
        originalCurrency: "EUR",
        status: deposit.status || "pending",
        info: deposit.userNote || "-",
        createdAt: deposit.createdAt,
      }))
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 8);
  }, [manualDeposits]);

  const createManualDeposit = async () => {
    await api.post("/deposits", {
      amount: Number(amount),
      promoCode,
      method: selectedMethod,
      userNote,
    });

    setMessageType("success");
    setMessage(`${activeMethod.label} ${t.requestCreated}`);

    setAmount("");
    setPromoCode("");
    setUserNote("");

    await Promise.allSettled([loadManualDeposits(), loadUser()]);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!amount || Number(amount) < 1) {
      setMessageType("error");
      setMessage(t.enterMinimum);
      return;
    }

    setIsCreating(true);

    try {
      await createManualDeposit();
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || t.couldNotCreatePayment);
    } finally {
      setIsCreating(false);
    }
  };

  const getMethodTitle = () => {
    if (selectedMethod === "payeer") return t.payWithPayeer;
    if (selectedMethod === "crypto") return t.payWithCrypto;
    if (selectedMethod === "revolut") return t.payWithRevolut;
    return t.payWithSkrill;
  };

  const getMethodDescription = () => {
    if (selectedMethod === "payeer") return t.payeerLong;
    if (selectedMethod === "crypto") return t.cryptoLong;
    if (selectedMethod === "revolut") return t.revolutLong;
    return t.skrillLong;
  };

  return (
    <main className="walletPagePro">
      <div className="walletAurora" aria-hidden="true">
        <span className="walletAuroraOne" />
        <span className="walletAuroraTwo" />
        <span className="walletAuroraThree" />
        <span className="walletAuroraFour" />
      </div>

      <div className="walletFloatingLayer" aria-hidden="true">
        {floatingWalletItems.map((item, index) => (
          <span className={`walletFloat walletFloat${index + 1}`} key={`${item}-${index}`}>
            {item}
          </span>
        ))}
      </div>

      <section className="walletHeroPro">
        <div className="walletHeroContent">
          <div className="walletBadgePro">
            <span />
            {t.heroBadge}
          </div>

          <h1>{t.heroTitle}</h1>

          <p>{t.heroText}</p>

          <div className="walletHeroActions">
            <a href="#wallet-add-funds" className="walletPrimaryBtn">
              {t.addFunds}
            </a>

            <a href="#wallet-deposits" className="walletSecondaryBtn">
              {t.paymentHistory}
            </a>
          </div>
        </div>

        <aside className="walletBalanceCard" title={currencyRateText}>
          <div className="walletBalanceGlow" />

          <span>{t.currentBalance}</span>
          <strong>{formatMoney(user?.balance)}</strong>
          <small>
            {t.availableOrders} · {t.shownIn} {selectedCurrency}
          </small>

          <div className="walletBalanceMiniGrid">
            <div>
              <span>{t.payments}</span>
              <b>{walletStats.requests}</b>
            </div>

            <div>
              <span>{t.pending}</span>
              <b>{walletStats.pendingPayments}</b>
            </div>
          </div>
        </aside>
      </section>

      {message && (
        <section className={`walletMessage walletMessage-${messageType}`}>
          <span>{messageType === "success" ? "✓" : messageType === "error" ? "!" : "i"}</span>
          <p>{message}</p>
        </section>
      )}

      <section className="walletStatsGrid">
        <article className="walletStatCard walletStatMain" title={currencyRateText}>
          <span>{t.walletBalance}</span>
          <strong>{formatMoney(user?.balance)}</strong>
          <small>{t.readyToSpend}</small>
        </article>

        <article className="walletStatCard" title={currencyRateText}>
          <span>{t.totalDeposited}</span>
          <strong>{formatMoney(walletStats.totalDeposited)}</strong>
          <small>{t.completedPaymentsOnly}</small>
        </article>

        <article className="walletStatCard">
          <span>{t.pendingPayments}</span>
          <strong>{walletStats.pendingPayments}</strong>
          <small>{t.waitingNotCaptured}</small>
        </article>

        <article className="walletStatCard">
          <span>{t.totalPayments}</span>
          <strong>{walletStats.requests}</strong>
          <small>{t.allAttempts}</small>
        </article>
      </section>

      <section className="walletMainGrid">
        <form
          className="walletPanel walletDepositPanel"
          onSubmit={handlePayment}
          id="wallet-add-funds"
        >
          <div className="walletPanelHeader">
            <div>
              <span>{t.addFundsPanel}</span>
              <h2>{getMethodTitle()}</h2>
            </div>

            <div className={`walletPanelBrandMark ${activeMethod.brandClass}`}>
              <PaymentLogo method={activeMethod} />
            </div>
          </div>

          <div className="walletMethodGrid">
            {paymentMethods.map((method) => (
              <button
                type="button"
                key={method.value}
                onClick={() => setSelectedMethod(method.value)}
                className={`walletMethodOption ${method.brandClass} ${
                  selectedMethod === method.value ? "walletMethodOptionActive" : ""
                }`}
              >
                <div className="walletMethodOptionTop">
                  <PaymentLogo method={method} />
                  <span className="walletMethodOptionTag">{method.tag}</span>
                </div>

                <strong>{method.label}</strong>
                <p>{method.description}</p>

                <small>{method.mode}</small>
              </button>
            ))}
          </div>

          <div className="walletFormGrid">
            <label>
              <span>{t.topupAmount}</span>
              <input
                type="number"
                step="0.01"
                min="1"
                placeholder={t.exampleAmount}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isCreating}
              />
            </label>

            <label>
              <span>{t.paymentCurrency}</span>
              <input type="text" value="EUR" disabled />
            </label>

            <label>
              <span>{t.promoOptional}</span>
              <input
                type="text"
                placeholder={t.promoPlaceholder}
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                disabled={isCreating}
              />
            </label>

            <label>
              <span>{t.noteOptional}</span>
              <input
                type="text"
                placeholder={t.notePlaceholder}
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                disabled={isCreating}
              />
            </label>
          </div>

          <div className="walletMethodPreview">
            <div className={`walletMethodBadge ${activeMethod.brandClass}`}>
              <PaymentLogo method={activeMethod} />
            </div>

            <div>
              <span>{t.backupMethod}</span>
              <strong>{activeMethod.description}</strong>
              <p>{getMethodDescription()}</p>
            </div>
          </div>

          <div className="walletDepositPreview" title={currencyRateText}>
            <div>
              <span>{t.paymentPreview}</span>
              <small>
                {t.manualPreview} {selectedCurrency}.
              </small>
            </div>

            <strong>{formatMoney(previewAmount)}</strong>
          </div>

          <button className="walletCreateBtn" type="submit" disabled={isCreating}>
            {isCreating
              ? t.creatingRequest
              : `${t.createRequest} ${activeMethod.label} ${t.request}`}
          </button>

          <p
            style={{
              margin: "14px 0 0",
              color: "#8fa4c2",
              fontSize: "12px",
              fontWeight: 800,
              lineHeight: 1.5,
            }}
          >
            {t.currencyInfo}
          </p>
        </form>

        <aside className="walletPanel walletGuidePanel">
          <div className="walletPanelHeader">
            <div>
              <span>{t.paymentGuide}</span>
              <h2>{t.howItWorks}</h2>
            </div>

            <div className="walletPanelIcon">↗</div>
          </div>

          <div className="walletSteps">
            <div>
              <b>01</b>
              <strong>{t.stepOneTitle}</strong>
              <span>{t.stepOneText}</span>
            </div>

            <div>
              <b>02</b>
              <strong>{t.stepTwoTitle}</strong>
              <span>{t.stepTwoText}</span>
            </div>

            <div>
              <b>03</b>
              <strong>{t.stepThreeTitle}</strong>
              <span>{t.stepThreeText}</span>
            </div>

            <div>
              <b>04</b>
              <strong>{t.stepFourTitle}</strong>
              <span>{t.stepFourText}</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="walletPanel walletDepositsPanel" id="wallet-deposits">
        <div className="walletPanelHeader">
          <div>
            <span>{t.paymentHistory}</span>
            <h2>{t.myPayments}</h2>
          </div>

          <div className="walletPanelIcon">{historyItems.length}</div>
        </div>

        {isLoading ? (
          <div className="walletSkeletonList">
            <span />
            <span />
            <span />
          </div>
        ) : historyItems.length === 0 ? (
          <div className="walletEmptyBox">
            <strong>{t.noPaymentsYet}</strong>
            <span>{t.noPaymentsText}</span>
          </div>
        ) : (
          <div className="walletDepositsTableWrap">
            <table className="walletDepositsTable">
              <thead>
                <tr>
                  <th>{t.provider}</th>
                  <th>{t.reference}</th>
                  <th>{t.amount}</th>
                  <th>{t.display}</th>
                  <th>{t.status}</th>
                  <th>{t.info}</th>
                  <th>{t.date}</th>
                </tr>
              </thead>

              <tbody>
                {historyItems.map((item) => (
                  <tr key={`${item.provider}-${item.id}`}>
                    <td>{item.provider}</td>
                    <td>
                      <strong>{item.reference}</strong>
                    </td>
                    <td title={`${t.originalCurrency}: ${item.originalCurrency || "EUR"}`}>
                      {formatMoney(item.amount)}
                    </td>
                    <td>
                      {selectedCurrencyMeta.flag} {selectedCurrency}
                    </td>
                    <td>
                      <span className={`walletStatusPill ${getStatusClass(item.status)}`}>
                        {item.status || "pending"}
                      </span>
                    </td>
                    <td>{item.info || "-"}</td>
                    <td>{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Wallet;