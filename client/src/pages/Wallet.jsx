import { useEffect, useMemo, useState } from "react";
import api from "../lib/api.js";
import useCurrency from "../lib/useCurrency.js";
import { getStoredLanguage } from "../lib/language.js";
import "./Wallet.css";

const WALLET_TRANSLATIONS = {
  en: {
    paypal: "PayPal",
    crypto: "Crypto",
    revolut: "Revolut",
    bank: "Bank",
    automatic: "Automatic",
    manual: "Manual",
    instant: "Instant",
    backup: "Backup",
    fast: "Fast",
    classic: "Classic",

    paypalDescription: "Real checkout with automatic wallet credit.",
    cryptoDescription: "USDT, BTC or ETH request for manual verification.",
    revolutDescription: "Quick Revolut top-up request with payment note.",
    bankDescription: "Bank transfer request with reference check.",

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

    paypalCancelled: "PayPal payment was cancelled.",
    paypalConfirming: "Confirming PayPal payment...",
    paypalCompleted: "Payment completed. New wallet balance:",
    paypalConfirmationFailed: "PayPal payment confirmation failed.",
    requestCreated: "request created successfully.",
    enterMinimum: "Please enter at least 1.00 EUR.",
    couldNotCreatePayment: "Could not create payment.",

    heroBadge: "Premium wallet checkout",
    heroTitle: "Fund your wallet with trusted payment options.",
    heroText:
      "PayPal runs as automatic checkout. Crypto, Revolut and bank transfer are clean backup methods for customers who prefer alternative payments.",
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
    completedPaymentsOnly: "Completed payments only",
    pendingPayments: "Pending payments",
    waitingNotCaptured: "Waiting or not captured yet",
    totalPayments: "Total payments",
    allAttempts: "All payment attempts",

    addFundsPanel: "Add funds",
    payWithPaypal: "Pay with PayPal",
    payWithCrypto: "Pay with Crypto",
    payWithRevolut: "Pay with Revolut",
    bankTransfer: "Bank transfer",

    paypalLong:
      "You will be redirected to PayPal. After payment, your wallet balance updates automatically.",
    cryptoLong:
      "Submit a crypto payment request. Add your transaction hash or wallet note so admin can verify it.",
    revolutLong:
      "Submit a Revolut payment request. Add your Revolut name or transfer note for faster approval.",
    bankLong:
      "Submit a bank transfer request. Add your sender name or bank reference in the note.",

    topupAmount: "Top-up amount",
    exampleAmount: "Example: 25.00",
    paymentCurrency: "Payment currency",
    promoOptional: "Promo code optional",
    promoPlaceholder: "Example: BOOST10",
    noteOptional: "Payment note optional",
    notePlaceholder: "Tx hash, Revolut name or bank note",
    automaticCheckout: "Automatic checkout",
    backupMethod: "Backup method",
    paymentPreview: "Payment preview",
    paypalPreview: "You pay in EUR. Display preview is shown in",
    manualPreview: "Request is created in EUR. Display preview is shown in",
    redirectingPaypal: "Redirecting to PayPal...",
    creatingRequest: "Creating request...",
    confirmingPayment: "Confirming payment...",
    createRequest: "Create",
    request: "Request",
    currencyInfo:
      "Real wallet and payment calculations stay in EUR. The selected currency is only a display conversion so pricing stays safe and clear.",

    paymentGuide: "Payment guide",
    howItWorks: "How it works",
    stepOneTitle: "Choose method",
    stepOneText: "Select PayPal, Crypto, Revolut or bank transfer.",
    stepTwoTitle: "Enter amount",
    stepTwoText: "Payment amount is entered in EUR to keep checkout accurate.",
    stepThreeTitle: "Pay or submit",
    stepThreeText:
      "PayPal redirects instantly. Other methods create a backup request.",
    stepFourTitle: "Balance updates",
    stepFourText:
      "Wallet updates in EUR, while your selected currency controls display.",

    myPayments: "My payments",
    noPaymentsYet: "No payments yet",
    noPaymentsText:
      "Your PayPal, Crypto, Revolut and bank payments will appear here.",
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
    paypal: "PayPal",
    crypto: "Crypto",
    revolut: "Revolut",
    bank: "Bank",
    automatic: "Automatisch",
    manual: "Manuell",
    instant: "Sofort",
    backup: "Backup",
    fast: "Schnell",
    classic: "Klassisch",

    paypalDescription: "Echter Checkout mit automatischer Wallet-Gutschrift.",
    cryptoDescription: "USDT, BTC oder ETH Anfrage zur manuellen Prüfung.",
    revolutDescription: "Schnelle Revolut-Aufladung mit Zahlungsnotiz.",
    bankDescription: "Banküberweisung mit Referenzprüfung.",

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

    paypalCancelled: "PayPal-Zahlung wurde abgebrochen.",
    paypalConfirming: "PayPal-Zahlung wird bestätigt...",
    paypalCompleted: "Zahlung abgeschlossen. Neues Wallet-Guthaben:",
    paypalConfirmationFailed: "PayPal-Zahlung konnte nicht bestätigt werden.",
    requestCreated: "Anfrage erfolgreich erstellt.",
    enterMinimum: "Bitte gib mindestens 1.00 EUR ein.",
    couldNotCreatePayment: "Zahlung konnte nicht erstellt werden.",

    heroBadge: "Premium Wallet Checkout",
    heroTitle: "Lade dein Wallet mit sicheren Zahlungsmethoden auf.",
    heroText:
      "PayPal läuft als automatischer Checkout. Crypto, Revolut und Banküberweisung sind saubere Backup-Methoden für Kunden, die alternative Zahlungen bevorzugen.",
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
    completedPaymentsOnly: "Nur abgeschlossene Zahlungen",
    pendingPayments: "Ausstehende Zahlungen",
    waitingNotCaptured: "Wartend oder noch nicht bestätigt",
    totalPayments: "Zahlungen gesamt",
    allAttempts: "Alle Zahlungsversuche",

    addFundsPanel: "Guthaben aufladen",
    payWithPaypal: "Mit PayPal zahlen",
    payWithCrypto: "Mit Crypto zahlen",
    payWithRevolut: "Mit Revolut zahlen",
    bankTransfer: "Banküberweisung",

    paypalLong:
      "Du wirst zu PayPal weitergeleitet. Nach der Zahlung wird dein Wallet automatisch aktualisiert.",
    cryptoLong:
      "Erstelle eine Crypto-Zahlungsanfrage. Füge Tx-Hash oder Wallet-Notiz hinzu, damit Admin es prüfen kann.",
    revolutLong:
      "Erstelle eine Revolut-Zahlungsanfrage. Füge deinen Revolut-Namen oder Transferhinweis für schnellere Prüfung hinzu.",
    bankLong:
      "Erstelle eine Banküberweisungsanfrage. Füge Absendername oder Bankreferenz in die Notiz ein.",

    topupAmount: "Aufladebetrag",
    exampleAmount: "Beispiel: 25.00",
    paymentCurrency: "Zahlungswährung",
    promoOptional: "Promo-Code optional",
    promoPlaceholder: "Beispiel: BOOST10",
    noteOptional: "Zahlungsnotiz optional",
    notePlaceholder: "Tx-Hash, Revolut-Name oder Banknotiz",
    automaticCheckout: "Automatischer Checkout",
    backupMethod: "Backup-Methode",
    paymentPreview: "Zahlungsvorschau",
    paypalPreview: "Du zahlst in EUR. Vorschau wird angezeigt in",
    manualPreview: "Anfrage wird in EUR erstellt. Vorschau wird angezeigt in",
    redirectingPaypal: "Weiterleitung zu PayPal...",
    creatingRequest: "Anfrage wird erstellt...",
    confirmingPayment: "Zahlung wird bestätigt...",
    createRequest: "Erstelle",
    request: "Anfrage",
    currencyInfo:
      "Wallet- und Zahlungsberechnungen bleiben in EUR. Die ausgewählte Währung ist nur eine Anzeigeumrechnung, damit Preise sicher und klar bleiben.",

    paymentGuide: "Zahlungsanleitung",
    howItWorks: "So funktioniert es",
    stepOneTitle: "Methode wählen",
    stepOneText: "Wähle PayPal, Crypto, Revolut oder Banküberweisung.",
    stepTwoTitle: "Betrag eingeben",
    stepTwoText: "Der Zahlungsbetrag wird in EUR eingegeben, damit der Checkout korrekt bleibt.",
    stepThreeTitle: "Zahlen oder senden",
    stepThreeText:
      "PayPal leitet sofort weiter. Andere Methoden erstellen eine Backup-Anfrage.",
    stepFourTitle: "Guthaben aktualisiert",
    stepFourText:
      "Wallet wird in EUR aktualisiert, während deine ausgewählte Währung nur die Anzeige steuert.",

    myPayments: "Meine Zahlungen",
    noPaymentsYet: "Noch keine Zahlungen",
    noPaymentsText:
      "Deine PayPal-, Crypto-, Revolut- und Bankzahlungen erscheinen hier.",
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
    paypal: "PayPal",
    crypto: "Crypto",
    revolut: "Revolut",
    bank: "Banco",
    automatic: "Automático",
    manual: "Manual",
    instant: "Instantáneo",
    backup: "Backup",
    fast: "Rápido",
    classic: "Clásico",

    paypalDescription: "Checkout real con crédito automático en wallet.",
    cryptoDescription: "Solicitud USDT, BTC o ETH para verificación manual.",
    revolutDescription: "Solicitud rápida de Revolut con nota de pago.",
    bankDescription: "Transferencia bancaria con revisión de referencia.",

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

    paypalCancelled: "El pago de PayPal fue cancelado.",
    paypalConfirming: "Confirmando pago de PayPal...",
    paypalCompleted: "Pago completado. Nuevo saldo wallet:",
    paypalConfirmationFailed: "La confirmación de PayPal falló.",
    requestCreated: "solicitud creada correctamente.",
    enterMinimum: "Introduce al menos 1.00 EUR.",
    couldNotCreatePayment: "No se pudo crear el pago.",

    heroBadge: "Checkout wallet premium",
    heroTitle: "Añade fondos a tu wallet con métodos de pago confiables.",
    heroText:
      "PayPal funciona como checkout automático. Crypto, Revolut y banco son métodos backup limpios para clientes que prefieren pagos alternativos.",
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
    completedPaymentsOnly: "Solo pagos completados",
    pendingPayments: "Pagos pendientes",
    waitingNotCaptured: "Esperando o no capturado",
    totalPayments: "Pagos totales",
    allAttempts: "Todos los intentos",

    addFundsPanel: "Añadir fondos",
    payWithPaypal: "Pagar con PayPal",
    payWithCrypto: "Pagar con Crypto",
    payWithRevolut: "Pagar con Revolut",
    bankTransfer: "Transferencia bancaria",

    paypalLong:
      "Serás redirigido a PayPal. Después del pago, tu wallet se actualiza automáticamente.",
    cryptoLong:
      "Envía una solicitud de pago crypto. Añade tu hash o nota para que admin pueda verificarlo.",
    revolutLong:
      "Envía una solicitud Revolut. Añade tu nombre Revolut o nota de transferencia para aprobación rápida.",
    bankLong:
      "Envía una solicitud de transferencia bancaria. Añade el nombre del remitente o referencia bancaria.",

    topupAmount: "Cantidad de recarga",
    exampleAmount: "Ejemplo: 25.00",
    paymentCurrency: "Moneda de pago",
    promoOptional: "Código promo opcional",
    promoPlaceholder: "Ejemplo: BOOST10",
    noteOptional: "Nota de pago opcional",
    notePlaceholder: "Tx hash, nombre Revolut o nota bancaria",
    automaticCheckout: "Checkout automático",
    backupMethod: "Método backup",
    paymentPreview: "Vista previa del pago",
    paypalPreview: "Pagas en EUR. Vista previa mostrada en",
    manualPreview: "La solicitud se crea en EUR. Vista previa mostrada en",
    redirectingPaypal: "Redirigiendo a PayPal...",
    creatingRequest: "Creando solicitud...",
    confirmingPayment: "Confirmando pago...",
    createRequest: "Crear",
    request: "Solicitud",
    currencyInfo:
      "Los cálculos reales de wallet y pagos se mantienen en EUR. La moneda seleccionada es solo una conversión visual para mantener precios claros.",

    paymentGuide: "Guía de pago",
    howItWorks: "Cómo funciona",
    stepOneTitle: "Elige método",
    stepOneText: "Selecciona PayPal, Crypto, Revolut o transferencia bancaria.",
    stepTwoTitle: "Introduce cantidad",
    stepTwoText: "La cantidad se introduce en EUR para mantener el checkout correcto.",
    stepThreeTitle: "Paga o envía",
    stepThreeText:
      "PayPal redirige al instante. Otros métodos crean una solicitud backup.",
    stepFourTitle: "Saldo actualizado",
    stepFourText:
      "Wallet se actualiza en EUR, mientras la moneda seleccionada controla la visualización.",

    myPayments: "Mis pagos",
    noPaymentsYet: "Aún no hay pagos",
    noPaymentsText:
      "Tus pagos de PayPal, Crypto, Revolut y banco aparecerán aquí.",
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
    paypal: "PayPal",
    crypto: "Crypto",
    revolut: "Revolut",
    bank: "Banque",
    automatic: "Automatique",
    manual: "Manuel",
    instant: "Instant",
    backup: "Backup",
    fast: "Rapide",
    classic: "Classique",

    paypalDescription: "Checkout réel avec crédit wallet automatique.",
    cryptoDescription: "Demande USDT, BTC ou ETH pour vérification manuelle.",
    revolutDescription: "Demande Revolut rapide avec note de paiement.",
    bankDescription: "Virement bancaire avec vérification de référence.",

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

    paypalCancelled: "Le paiement PayPal a été annulé.",
    paypalConfirming: "Confirmation du paiement PayPal...",
    paypalCompleted: "Paiement terminé. Nouveau solde wallet :",
    paypalConfirmationFailed: "La confirmation PayPal a échoué.",
    requestCreated: "demande créée avec succès.",
    enterMinimum: "Veuillez entrer au moins 1.00 EUR.",
    couldNotCreatePayment: "Impossible de créer le paiement.",

    heroBadge: "Checkout wallet premium",
    heroTitle: "Rechargez votre wallet avec des options de paiement fiables.",
    heroText:
      "PayPal fonctionne en checkout automatique. Crypto, Revolut et virement bancaire sont des méthodes backup propres pour les clients qui préfèrent les paiements alternatifs.",
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
    completedPaymentsOnly: "Paiements terminés uniquement",
    pendingPayments: "Paiements en attente",
    waitingNotCaptured: "En attente ou non capturé",
    totalPayments: "Paiements total",
    allAttempts: "Toutes les tentatives",

    addFundsPanel: "Ajouter des fonds",
    payWithPaypal: "Payer avec PayPal",
    payWithCrypto: "Payer avec Crypto",
    payWithRevolut: "Payer avec Revolut",
    bankTransfer: "Virement bancaire",

    paypalLong:
      "Vous serez redirigé vers PayPal. Après le paiement, votre wallet se met à jour automatiquement.",
    cryptoLong:
      "Envoyez une demande crypto. Ajoutez le hash ou une note wallet pour vérification admin.",
    revolutLong:
      "Envoyez une demande Revolut. Ajoutez votre nom Revolut ou note de transfert pour approbation rapide.",
    bankLong:
      "Envoyez une demande de virement bancaire. Ajoutez le nom expéditeur ou référence bancaire.",

    topupAmount: "Montant recharge",
    exampleAmount: "Exemple : 25.00",
    paymentCurrency: "Devise paiement",
    promoOptional: "Code promo optionnel",
    promoPlaceholder: "Exemple : BOOST10",
    noteOptional: "Note paiement optionnelle",
    notePlaceholder: "Tx hash, nom Revolut ou note bancaire",
    automaticCheckout: "Checkout automatique",
    backupMethod: "Méthode backup",
    paymentPreview: "Aperçu paiement",
    paypalPreview: "Vous payez en EUR. Aperçu affiché en",
    manualPreview: "La demande est créée en EUR. Aperçu affiché en",
    redirectingPaypal: "Redirection vers PayPal...",
    creatingRequest: "Création demande...",
    confirmingPayment: "Confirmation paiement...",
    createRequest: "Créer",
    request: "Demande",
    currencyInfo:
      "Les calculs réels wallet et paiements restent en EUR. La devise sélectionnée est seulement une conversion d’affichage.",

    paymentGuide: "Guide paiement",
    howItWorks: "Comment ça marche",
    stepOneTitle: "Choisir méthode",
    stepOneText: "Sélectionnez PayPal, Crypto, Revolut ou virement bancaire.",
    stepTwoTitle: "Entrer montant",
    stepTwoText: "Le montant est entré en EUR pour garder le checkout correct.",
    stepThreeTitle: "Payer ou envoyer",
    stepThreeText:
      "PayPal redirige instantanément. Les autres méthodes créent une demande backup.",
    stepFourTitle: "Solde mis à jour",
    stepFourText:
      "Wallet se met à jour en EUR, pendant que la devise choisie contrôle l’affichage.",

    myPayments: "Mes paiements",
    noPaymentsYet: "Aucun paiement",
    noPaymentsText:
      "Vos paiements PayPal, Crypto, Revolut et banque apparaîtront ici.",
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
    paypal: "PayPal",
    crypto: "Crypto",
    revolut: "Revolut",
    bank: "Банк",
    automatic: "Автоматически",
    manual: "Вручную",
    instant: "Мгновенно",
    backup: "Backup",
    fast: "Быстро",
    classic: "Классика",

    paypalDescription: "Реальный checkout с автоматическим пополнением wallet.",
    cryptoDescription: "USDT, BTC или ETH запрос для ручной проверки.",
    revolutDescription: "Быстрый Revolut top-up запрос с платежной заметкой.",
    bankDescription: "Банковский перевод с проверкой reference.",

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

    paypalCancelled: "PayPal платеж был отменён.",
    paypalConfirming: "Подтверждение PayPal платежа...",
    paypalCompleted: "Платёж завершён. Новый wallet баланс:",
    paypalConfirmationFailed: "Подтверждение PayPal платежа не удалось.",
    requestCreated: "запрос успешно создан.",
    enterMinimum: "Введите минимум 1.00 EUR.",
    couldNotCreatePayment: "Не удалось создать платёж.",

    heroBadge: "Premium wallet checkout",
    heroTitle: "Пополняй wallet надёжными способами оплаты.",
    heroText:
      "PayPal работает как автоматический checkout. Crypto, Revolut и bank transfer — чистые backup-методы для клиентов, которые предпочитают альтернативные платежи.",
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
    completedPaymentsOnly: "Только завершённые платежи",
    pendingPayments: "Ожидающие платежи",
    waitingNotCaptured: "Ожидает или не подтверждено",
    totalPayments: "Всего платежей",
    allAttempts: "Все попытки платежей",

    addFundsPanel: "Пополнить wallet",
    payWithPaypal: "Оплатить PayPal",
    payWithCrypto: "Оплатить Crypto",
    payWithRevolut: "Оплатить Revolut",
    bankTransfer: "Банковский перевод",

    paypalLong:
      "Вы будете перенаправлены в PayPal. После оплаты wallet обновится автоматически.",
    cryptoLong:
      "Создай crypto payment request. Добавь transaction hash или wallet note для проверки админом.",
    revolutLong:
      "Создай Revolut payment request. Добавь Revolut имя или transfer note для быстрой проверки.",
    bankLong:
      "Создай bank transfer request. Добавь sender name или bank reference в заметку.",

    topupAmount: "Сумма пополнения",
    exampleAmount: "Пример: 25.00",
    paymentCurrency: "Валюта оплаты",
    promoOptional: "Promo code optional",
    promoPlaceholder: "Пример: BOOST10",
    noteOptional: "Payment note optional",
    notePlaceholder: "Tx hash, Revolut name или bank note",
    automaticCheckout: "Automatic checkout",
    backupMethod: "Backup method",
    paymentPreview: "Payment preview",
    paypalPreview: "Ты платишь в EUR. Preview показан в",
    manualPreview: "Запрос создаётся в EUR. Preview показан в",
    redirectingPaypal: "Переход в PayPal...",
    creatingRequest: "Создание запроса...",
    confirmingPayment: "Подтверждение платежа...",
    createRequest: "Создать",
    request: "Запрос",
    currencyInfo:
      "Реальные wallet и payment расчёты остаются в EUR. Выбранная валюта — только display conversion.",

    paymentGuide: "Payment guide",
    howItWorks: "Как это работает",
    stepOneTitle: "Выбери метод",
    stepOneText: "Выбери PayPal, Crypto, Revolut или bank transfer.",
    stepTwoTitle: "Введи сумму",
    stepTwoText: "Сумма вводится в EUR, чтобы checkout был точным.",
    stepThreeTitle: "Оплати или отправь",
    stepThreeText:
      "PayPal redirect делает сразу. Другие методы создают backup request.",
    stepFourTitle: "Баланс обновляется",
    stepFourText:
      "Wallet обновляется в EUR, а выбранная валюта управляет только отображением.",

    myPayments: "Мои платежи",
    noPaymentsYet: "Платежей ещё нет",
    noPaymentsText:
      "PayPal, Crypto, Revolut и bank платежи будут появляться здесь.",
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
  if (method.value === "paypal") {
    return (
      <div className="walletRealLogo walletPaypalLogo" aria-hidden="true">
        <span className="walletPaypalP">P</span>
        <span className="walletPaypalText">PayPal</span>
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
      <span className="walletBankMark">▰</span>
      <span className="walletBankText">Bank</span>
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
        value: "paypal",
        label: t.paypal,
        short: "PP",
        mode: t.automatic,
        modeKey: "automatic",
        tag: t.instant,
        description: t.paypalDescription,
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
        value: "bank",
        label: t.bank,
        short: "BK",
        mode: t.manual,
        modeKey: "manual",
        tag: t.classic,
        description: t.bankDescription,
        brandClass: "walletBrandBank",
      },
    ],
    [t]
  );

  const floatingWalletItems = useMemo(
    () => [
      t.floatingWallet,
      t.floatingBalance,
      "PayPal",
      "Crypto",
      "Revolut",
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
  const [payments, setPayments] = useState([]);
  const [manualDeposits, setManualDeposits] = useState([]);

  const [selectedMethod, setSelectedMethod] = useState("paypal");
  const [amount, setAmount] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [userNote, setUserNote] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

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

  const loadPayments = async () => {
    try {
      const res = await api.get("/payments/paypal/my");
      setPayments(res.data.payments || []);
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
    await Promise.allSettled([loadUser(), loadPayments(), loadManualDeposits()]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadWalletData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paypalStatus = params.get("paypal");
    const paypalOrderId = params.get("token");

    if (paypalStatus === "cancelled") {
      setMessageType("error");
      setMessage(t.paypalCancelled);
      window.history.replaceState({}, "", "/wallet");
      return;
    }

    if (paypalStatus === "success" && paypalOrderId) {
      capturePaypalPayment(paypalOrderId);
    }
  }, [t.paypalCancelled]);

  const walletStats = useMemo(() => {
    const completedPaypalPayments = payments.filter(
      (payment) => String(payment.status || "").toLowerCase() === "completed"
    );

    const completedManualDeposits = manualDeposits.filter((deposit) =>
      ["approved", "completed", "paid"].includes(String(deposit.status || "").toLowerCase())
    );

    const totalPaypalDeposited = completedPaypalPayments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );

    const totalManualDeposited = completedManualDeposits.reduce(
      (sum, deposit) => sum + Number(deposit.finalAmount || deposit.amount || 0),
      0
    );

    const pendingPaypalPayments = payments.filter(
      (payment) => String(payment.status || "").toLowerCase() === "created"
    ).length;

    const pendingManualDeposits = manualDeposits.filter((deposit) =>
      ["pending", "waiting", "review"].includes(String(deposit.status || "").toLowerCase())
    ).length;

    return {
      totalDeposited: totalPaypalDeposited + totalManualDeposited,
      pendingPayments: pendingPaypalPayments + pendingManualDeposits,
      requests: payments.length + manualDeposits.length,
    };
  }, [payments, manualDeposits]);

  const previewAmount = Number(amount || 0);

  const historyItems = useMemo(() => {
    const paypalItems = payments.map((payment) => ({
      id: payment._id,
      provider: "PayPal",
      reference: payment.paypalOrderId,
      amount: payment.amount,
      originalCurrency: payment.currency || "EUR",
      status: payment.status || "created",
      info: payment.paypalCaptureId || "-",
      createdAt: payment.createdAt,
    }));

    const manualItems = manualDeposits.map((deposit) => ({
      id: deposit._id,
      provider: deposit.method || "Manual",
      reference: deposit.paymentReference || "-",
      amount: deposit.finalAmount || deposit.amount,
      originalCurrency: "EUR",
      status: deposit.status || "pending",
      info: deposit.userNote || "-",
      createdAt: deposit.createdAt,
    }));

    return [...paypalItems, ...manualItems]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 8);
  }, [payments, manualDeposits]);

  const createPaypalPayment = async () => {
    const res = await api.post("/payments/paypal/create", {
      amount: Number(amount),
    });

    window.location.href = res.data.approveUrl;
  };

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
      if (selectedMethod === "paypal") {
        await createPaypalPayment();
        return;
      }

      await createManualDeposit();
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || t.couldNotCreatePayment);
    } finally {
      setIsCreating(false);
    }
  };

  const capturePaypalPayment = async (paypalOrderId) => {
    setIsCapturing(true);
    setMessageType("info");
    setMessage(t.paypalConfirming);

    try {
      const res = await api.post("/payments/paypal/capture", {
        paypalOrderId,
      });

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

      setMessageType("success");
      setMessage(`${t.paypalCompleted} ${formatMoney(res.data.newBalance)}`);

      await loadPayments();
      window.history.replaceState({}, "", "/wallet");
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || t.paypalConfirmationFailed);
      window.history.replaceState({}, "", "/wallet");
    } finally {
      setIsCapturing(false);
    }
  };

  const getMethodTitle = () => {
    if (selectedMethod === "paypal") return t.payWithPaypal;
    if (selectedMethod === "crypto") return t.payWithCrypto;
    if (selectedMethod === "revolut") return t.payWithRevolut;
    return t.bankTransfer;
  };

  const getMethodDescription = () => {
    if (selectedMethod === "paypal") return t.paypalLong;
    if (selectedMethod === "crypto") return t.cryptoLong;
    if (selectedMethod === "revolut") return t.revolutLong;
    return t.bankLong;
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
                disabled={isCreating || isCapturing}
              />
            </label>

            <label>
              <span>{t.paymentCurrency}</span>
              <input type="text" value="EUR" disabled />
            </label>

            {selectedMethod !== "paypal" && (
              <>
                <label>
                  <span>{t.promoOptional}</span>
                  <input
                    type="text"
                    placeholder={t.promoPlaceholder}
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    disabled={isCreating || isCapturing}
                  />
                </label>

                <label>
                  <span>{t.noteOptional}</span>
                  <input
                    type="text"
                    placeholder={t.notePlaceholder}
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    disabled={isCreating || isCapturing}
                  />
                </label>
              </>
            )}
          </div>

          <div className="walletMethodPreview">
            <div className={`walletMethodBadge ${activeMethod.brandClass}`}>
              <PaymentLogo method={activeMethod} />
            </div>

            <div>
              <span>
                {activeMethod.modeKey === "automatic" ? t.automaticCheckout : t.backupMethod}
              </span>
              <strong>{activeMethod.description}</strong>
              <p>{getMethodDescription()}</p>
            </div>
          </div>

          <div className="walletDepositPreview" title={currencyRateText}>
            <div>
              <span>{t.paymentPreview}</span>
              <small>
                {selectedMethod === "paypal"
                  ? `${t.paypalPreview} ${selectedCurrency}.`
                  : `${t.manualPreview} ${selectedCurrency}.`}
              </small>
            </div>

            <strong>{formatMoney(previewAmount)}</strong>
          </div>

          <button className="walletCreateBtn" type="submit" disabled={isCreating || isCapturing}>
            {isCreating
              ? selectedMethod === "paypal"
                ? t.redirectingPaypal
                : t.creatingRequest
              : isCapturing
                ? t.confirmingPayment
                : selectedMethod === "paypal"
                  ? t.payWithPaypal
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
                        {item.status || "created"}
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