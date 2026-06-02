import { useEffect, useMemo, useState } from "react";
import { getStoredLanguage } from "../lib/language.js";
import "./FAQ.css";

const telegramLink = "https://t.me/EmpireBooster";
const supportEmail = "followerbooster96@gmail.com";

const FAQ_TRANSLATIONS = {
  en: {
    all: "All",
    orders: "Orders",
    wallet: "Wallet",
    services: "Services",
    support: "Support",
    transactions: "Transactions",
    security: "Security",

    heroBadge: "EmpireBoost help center",
    heroTitle: "Answers, support and real contact in one place.",
    heroText:
      "Everything important about orders, deposits, delivery, refunds and support — with direct Telegram, email and website ticket options when you need human help.",
    browseFAQ: "Browse FAQ",
    messageTelegram: "Message on Telegram",

    helpCenter: "Help center",
    helpfulAnswers: "Helpful answers available",
    categories: "Categories",
    showing: "Showing",

    telegram: "Telegram",
    telegramValue: "@EmpireBooster",
    telegramDescription: "Fast direct message for urgent questions.",
    email: "Email",
    emailDescription: "Send details, screenshots or payment questions.",
    websiteSupport: "Website Support",
    websiteSupportValue: "Open a ticket",
    websiteSupportDescription:
      "Best option when your message should stay inside your account.",

    quickAnswers: "Quick answers",
    commonQuestions: "Common questions covered",
    telegramContact: "Telegram contact",
    live: "Live",
    directMessage: "Direct message to @EmpireBooster",
    emailSupport: "Email support",
    mail: "Mail",
    websiteTickets: "Website tickets",
    fast: "Fast",
    websiteTicketSmall: "Send messages through Support page",

    knowledgeBase: "Knowledge base",
    faqTitle: "Frequently Asked Questions",
    searchFAQ: "Search FAQ",
    searchPlaceholder:
      "Search orders, wallet, refunds, delivery, telegram...",

    noAnswerFound: "No answer found",
    noAnswerText:
      "Try another keyword, message @EmpireBooster on Telegram, send an email or open a support ticket.",

    contactSupport: "Contact support",
    needHumanHelp: "Need human help?",
    bestNextStep: "Best next step",
    bestNextText: "Choose the fastest contact option for your situation.",
    supportCardText:
      "Telegram is good for fast direct messages. Email is better for longer details and screenshots. Website support is best when your issue should stay connected to your account.",
    supportTicket: "Support Ticket",

    stepOneTitle: "Check your Orders page",
    stepOneText: "Look at the current order status first.",
    stepTwoTitle: "Check your Wallet",
    stepTwoText: "For deposits, payment status and balance updates.",
    stepThreeTitle: "Open Transactions",
    stepThreeText: "See every balance movement in one place.",
    stepFourTitle: "Contact support",
    stepFourText:
      "Telegram, email or website ticket — all options are available.",

    q1: "How fast is delivery?",
    a1:
      "Delivery depends on the selected service, quantity and platform. Some services can start very fast, while bigger or more sensitive orders may need more time to process safely.",
    q2: "What happens after I create an order?",
    a2:
      "Your order appears in your Orders page. You can track the status there: pending, processing, completed, failed, cancelled or refunded.",
    q3: "Can I cancel an order?",
    a3:
      "If the order has not started yet, contact support as soon as possible. Once the order is already processing, cancellation may not be possible anymore.",
    q4: "What happens if an order fails?",
    a4:
      "If an order fails, admin can review it and issue a refund to your wallet balance when appropriate. You can also open a support ticket for a manual check.",
    q5: "How do deposits work?",
    a5:
      "Go to your Wallet, choose a payment method and enter the amount. PayPal can work automatically, while backup methods may need admin verification.",
    q6: "How do promo codes work?",
    a6:
      "If you have a promo code, enter it during deposit checkout. Valid promo codes can add a bonus to your deposit after approval.",
    q7: "Where can I contact support?",
    a7:
      "You can contact support directly through the Support page, by Telegram @EmpireBooster, or by email at followerbooster96@gmail.com.",
    q8: "What should I write when I need help?",
    a8:
      "Write your username, order details, payment method and a short explanation of the issue. Clear details help support solve your problem much faster.",
    q9: "Do I need a public profile?",
    a9:
      "For most services, the profile or post link should be public while the order is running. Private links can slow down or block delivery.",
    q10: "Can I order multiple services at once?",
    a10:
      "Yes. You can create multiple orders, but for the cleanest delivery it is better not to spam the same link with too many similar services at the same time.",
    q11: "Do you need my password?",
    a11:
      "No. Never send your password. EmpireBoost only needs the correct profile, post, video or channel link for the selected service.",
    q12: "Where can I see my balance history?",
    a12:
      "Your Transactions page shows wallet movements like deposits, order payments, refunds and other balance updates.",
  },

  de: {
    all: "Alle",
    orders: "Bestellungen",
    wallet: "Wallet",
    services: "Services",
    support: "Support",
    transactions: "Transaktionen",
    security: "Sicherheit",

    heroBadge: "EmpireBoost Hilfezentrum",
    heroTitle: "Antworten, Support und echte Kontaktoptionen an einem Ort.",
    heroText:
      "Alles Wichtige zu Bestellungen, Einzahlungen, Lieferung, Rückerstattungen und Support — mit direktem Telegram, E-Mail und Website-Ticket, wenn du menschliche Hilfe brauchst.",
    browseFAQ: "FAQ ansehen",
    messageTelegram: "Auf Telegram schreiben",

    helpCenter: "Hilfezentrum",
    helpfulAnswers: "hilfreiche Antworten verfügbar",
    categories: "Kategorien",
    showing: "Angezeigt",

    telegram: "Telegram",
    telegramValue: "@EmpireBooster",
    telegramDescription: "Schnelle Direktnachricht für dringende Fragen.",
    email: "E-Mail",
    emailDescription: "Sende Details, Screenshots oder Zahlungsfragen.",
    websiteSupport: "Website Support",
    websiteSupportValue: "Ticket öffnen",
    websiteSupportDescription:
      "Beste Option, wenn deine Nachricht in deinem Account bleiben soll.",

    quickAnswers: "Schnelle Antworten",
    commonQuestions: "häufige Fragen abgedeckt",
    telegramContact: "Telegram Kontakt",
    live: "Live",
    directMessage: "Direktnachricht an @EmpireBooster",
    emailSupport: "E-Mail Support",
    mail: "Mail",
    websiteTickets: "Website Tickets",
    fast: "Schnell",
    websiteTicketSmall: "Nachrichten über die Support-Seite senden",

    knowledgeBase: "Wissensbasis",
    faqTitle: "Häufig gestellte Fragen",
    searchFAQ: "FAQ suchen",
    searchPlaceholder:
      "Suche Bestellungen, Wallet, Rückerstattung, Lieferung, Telegram...",

    noAnswerFound: "Keine Antwort gefunden",
    noAnswerText:
      "Versuche ein anderes Keyword, schreibe @EmpireBooster auf Telegram, sende eine E-Mail oder öffne ein Support-Ticket.",

    contactSupport: "Support kontaktieren",
    needHumanHelp: "Brauchst du menschliche Hilfe?",
    bestNextStep: "Bester nächster Schritt",
    bestNextText: "Wähle die schnellste Kontaktoption für deine Situation.",
    supportCardText:
      "Telegram ist gut für schnelle Direktnachrichten. E-Mail ist besser für längere Details und Screenshots. Website Support ist am besten, wenn dein Problem mit deinem Account verbunden bleiben soll.",
    supportTicket: "Support Ticket",

    stepOneTitle: "Prüfe deine Bestellungen",
    stepOneText: "Schau zuerst den aktuellen Bestellstatus an.",
    stepTwoTitle: "Prüfe dein Wallet",
    stepTwoText: "Für Einzahlungen, Zahlungsstatus und Guthaben-Updates.",
    stepThreeTitle: "Transaktionen öffnen",
    stepThreeText: "Sieh jede Guthabenbewegung an einem Ort.",
    stepFourTitle: "Support kontaktieren",
    stepFourText:
      "Telegram, E-Mail oder Website-Ticket — alle Optionen sind verfügbar.",

    q1: "Wie schnell ist die Lieferung?",
    a1:
      "Die Lieferung hängt vom ausgewählten Service, der Menge und der Plattform ab. Manche Services starten sehr schnell, während größere oder empfindlichere Bestellungen mehr Zeit brauchen können.",
    q2: "Was passiert nach einer Bestellung?",
    a2:
      "Deine Bestellung erscheint auf deiner Orders-Seite. Dort kannst du den Status verfolgen: ausstehend, in Bearbeitung, abgeschlossen, fehlgeschlagen, storniert oder zurückerstattet.",
    q3: "Kann ich eine Bestellung stornieren?",
    a3:
      "Wenn die Bestellung noch nicht gestartet wurde, kontaktiere so schnell wie möglich den Support. Sobald die Bestellung in Bearbeitung ist, ist eine Stornierung eventuell nicht mehr möglich.",
    q4: "Was passiert, wenn eine Bestellung fehlschlägt?",
    a4:
      "Wenn eine Bestellung fehlschlägt, kann ein Admin sie prüfen und bei Bedarf eine Rückerstattung auf dein Wallet-Guthaben ausstellen. Du kannst auch ein Support-Ticket öffnen.",
    q5: "Wie funktionieren Einzahlungen?",
    a5:
      "Gehe zu deinem Wallet, wähle eine Zahlungsmethode und gib den Betrag ein. PayPal kann automatisch funktionieren, während Backup-Methoden eventuell Admin-Prüfung brauchen.",
    q6: "Wie funktionieren Promo-Codes?",
    a6:
      "Wenn du einen Promo-Code hast, gib ihn beim Deposit Checkout ein. Gültige Promo-Codes können nach Freigabe einen Bonus zu deiner Einzahlung hinzufügen.",
    q7: "Wo kann ich Support kontaktieren?",
    a7:
      "Du kannst den Support direkt über die Support-Seite, per Telegram @EmpireBooster oder per E-Mail an followerbooster96@gmail.com kontaktieren.",
    q8: "Was soll ich schreiben, wenn ich Hilfe brauche?",
    a8:
      "Schreibe deinen Benutzernamen, Bestelldetails, Zahlungsmethode und eine kurze Erklärung des Problems. Klare Details helfen dem Support, schneller zu helfen.",
    q9: "Brauche ich ein öffentliches Profil?",
    a9:
      "Für die meisten Services sollte das Profil oder der Post-Link öffentlich sein, während die Bestellung läuft. Private Links können die Lieferung verlangsamen oder blockieren.",
    q10: "Kann ich mehrere Services gleichzeitig bestellen?",
    a10:
      "Ja. Du kannst mehrere Bestellungen erstellen, aber für saubere Lieferung ist es besser, denselben Link nicht zu stark mit ähnlichen Services zu belasten.",
    q11: "Braucht ihr mein Passwort?",
    a11:
      "Nein. Sende niemals dein Passwort. EmpireBoost braucht nur den richtigen Profil-, Post-, Video- oder Channel-Link für den gewählten Service.",
    q12: "Wo sehe ich meine Guthaben-Historie?",
    a12:
      "Deine Transaktionen-Seite zeigt Wallet-Bewegungen wie Einzahlungen, Bestellzahlungen, Rückerstattungen und andere Guthaben-Updates.",
  },

  es: {
    all: "Todo",
    orders: "Pedidos",
    wallet: "Wallet",
    services: "Servicios",
    support: "Soporte",
    transactions: "Transacciones",
    security: "Seguridad",

    heroBadge: "Centro de ayuda EmpireBoost",
    heroTitle: "Respuestas, soporte y contacto real en un solo lugar.",
    heroText:
      "Todo lo importante sobre pedidos, depósitos, entrega, reembolsos y soporte — con Telegram, email y tickets web cuando necesitas ayuda humana.",
    browseFAQ: "Ver FAQ",
    messageTelegram: "Escribir en Telegram",

    helpCenter: "Centro de ayuda",
    helpfulAnswers: "respuestas útiles disponibles",
    categories: "Categorías",
    showing: "Mostrando",

    telegram: "Telegram",
    telegramValue: "@EmpireBooster",
    telegramDescription: "Mensaje directo rápido para preguntas urgentes.",
    email: "Email",
    emailDescription: "Envía detalles, capturas o preguntas de pago.",
    websiteSupport: "Soporte web",
    websiteSupportValue: "Abrir ticket",
    websiteSupportDescription:
      "Mejor opción cuando tu mensaje debe quedarse dentro de tu cuenta.",

    quickAnswers: "Respuestas rápidas",
    commonQuestions: "preguntas comunes cubiertas",
    telegramContact: "Contacto Telegram",
    live: "Live",
    directMessage: "Mensaje directo a @EmpireBooster",
    emailSupport: "Soporte email",
    mail: "Mail",
    websiteTickets: "Tickets web",
    fast: "Rápido",
    websiteTicketSmall: "Envía mensajes desde la página Support",

    knowledgeBase: "Base de conocimiento",
    faqTitle: "Preguntas frecuentes",
    searchFAQ: "Buscar FAQ",
    searchPlaceholder:
      "Buscar pedidos, wallet, reembolsos, entrega, telegram...",

    noAnswerFound: "No se encontró respuesta",
    noAnswerText:
      "Prueba otra palabra, escribe a @EmpireBooster en Telegram, envía un email o abre un ticket.",

    contactSupport: "Contactar soporte",
    needHumanHelp: "¿Necesitas ayuda humana?",
    bestNextStep: "Mejor siguiente paso",
    bestNextText: "Elige la opción de contacto más rápida para tu situación.",
    supportCardText:
      "Telegram es bueno para mensajes rápidos. Email es mejor para detalles largos y capturas. El soporte web es ideal cuando el problema debe quedar conectado a tu cuenta.",
    supportTicket: "Ticket soporte",

    stepOneTitle: "Revisa tus pedidos",
    stepOneText: "Mira primero el estado actual del pedido.",
    stepTwoTitle: "Revisa tu Wallet",
    stepTwoText: "Para depósitos, estado de pago y actualizaciones de saldo.",
    stepThreeTitle: "Abrir Transacciones",
    stepThreeText: "Mira cada movimiento de saldo en un lugar.",
    stepFourTitle: "Contactar soporte",
    stepFourText:
      "Telegram, email o ticket web — todas las opciones están disponibles.",

    q1: "¿Qué tan rápida es la entrega?",
    a1:
      "La entrega depende del servicio, cantidad y plataforma. Algunos servicios pueden iniciar muy rápido, mientras pedidos grandes o sensibles pueden necesitar más tiempo.",
    q2: "¿Qué pasa después de crear un pedido?",
    a2:
      "Tu pedido aparece en la página Orders. Puedes seguir el estado: pendiente, procesando, completado, fallido, cancelado o reembolsado.",
    q3: "¿Puedo cancelar un pedido?",
    a3:
      "Si el pedido aún no ha empezado, contacta soporte lo antes posible. Una vez procesando, puede que ya no sea posible cancelarlo.",
    q4: "¿Qué pasa si un pedido falla?",
    a4:
      "Si un pedido falla, un admin puede revisarlo y emitir un reembolso a tu wallet cuando corresponda. También puedes abrir un ticket.",
    q5: "¿Cómo funcionan los depósitos?",
    a5:
      "Ve a Wallet, elige un método de pago e introduce el monto. PayPal puede funcionar automáticamente, mientras métodos backup pueden necesitar verificación admin.",
    q6: "¿Cómo funcionan los códigos promo?",
    a6:
      "Si tienes un código promo, introdúcelo durante el depósito. Los códigos válidos pueden añadir bonus después de aprobación.",
    q7: "¿Dónde puedo contactar soporte?",
    a7:
      "Puedes contactar soporte desde la página Support, por Telegram @EmpireBooster o por email a followerbooster96@gmail.com.",
    q8: "¿Qué debo escribir si necesito ayuda?",
    a8:
      "Escribe tu username, detalles del pedido, método de pago y una explicación corta. Los detalles claros ayudan a resolver más rápido.",
    q9: "¿Necesito perfil público?",
    a9:
      "Para la mayoría de servicios, el perfil o post debe estar público mientras el pedido está corriendo. Links privados pueden bloquear o ralentizar la entrega.",
    q10: "¿Puedo pedir varios servicios a la vez?",
    a10:
      "Sí. Puedes crear varios pedidos, pero para una entrega limpia es mejor no saturar el mismo link con demasiados servicios similares.",
    q11: "¿Necesitan mi contraseña?",
    a11:
      "No. Nunca envíes tu contraseña. EmpireBoost solo necesita el link correcto de perfil, post, video o canal.",
    q12: "¿Dónde veo mi historial de saldo?",
    a12:
      "La página Transactions muestra movimientos de wallet como depósitos, pagos de pedidos, reembolsos y otros cambios de saldo.",
  },

  fr: {
    all: "Tous",
    orders: "Commandes",
    wallet: "Wallet",
    services: "Services",
    support: "Support",
    transactions: "Transactions",
    security: "Sécurité",

    heroBadge: "Centre d’aide EmpireBoost",
    heroTitle: "Réponses, support et vrai contact au même endroit.",
    heroText:
      "Tout l’essentiel sur commandes, dépôts, livraison, remboursements et support — avec Telegram, email et tickets web si vous avez besoin d’aide humaine.",
    browseFAQ: "Voir FAQ",
    messageTelegram: "Message Telegram",

    helpCenter: "Centre d’aide",
    helpfulAnswers: "réponses utiles disponibles",
    categories: "Catégories",
    showing: "Affichés",

    telegram: "Telegram",
    telegramValue: "@EmpireBooster",
    telegramDescription: "Message direct rapide pour questions urgentes.",
    email: "Email",
    emailDescription: "Envoyez détails, captures ou questions de paiement.",
    websiteSupport: "Support web",
    websiteSupportValue: "Ouvrir un ticket",
    websiteSupportDescription:
      "Meilleure option si votre message doit rester dans votre compte.",

    quickAnswers: "Réponses rapides",
    commonQuestions: "questions courantes couvertes",
    telegramContact: "Contact Telegram",
    live: "Live",
    directMessage: "Message direct à @EmpireBooster",
    emailSupport: "Support email",
    mail: "Mail",
    websiteTickets: "Tickets web",
    fast: "Rapide",
    websiteTicketSmall: "Envoyer via la page Support",

    knowledgeBase: "Base de connaissances",
    faqTitle: "Questions fréquentes",
    searchFAQ: "Chercher FAQ",
    searchPlaceholder:
      "Chercher commandes, wallet, remboursements, livraison, telegram...",

    noAnswerFound: "Aucune réponse trouvée",
    noAnswerText:
      "Essayez un autre mot-clé, écrivez à @EmpireBooster sur Telegram, envoyez un email ou ouvrez un ticket support.",

    contactSupport: "Contacter support",
    needHumanHelp: "Besoin d’aide humaine ?",
    bestNextStep: "Meilleure étape",
    bestNextText: "Choisissez le contact le plus rapide pour votre situation.",
    supportCardText:
      "Telegram est bon pour les messages rapides. Email est meilleur pour les détails longs et captures. Le support web est idéal si le problème doit rester lié au compte.",
    supportTicket: "Ticket support",

    stepOneTitle: "Vérifiez vos commandes",
    stepOneText: "Regardez d’abord le statut actuel de la commande.",
    stepTwoTitle: "Vérifiez votre Wallet",
    stepTwoText: "Pour dépôts, statut paiement et mises à jour du solde.",
    stepThreeTitle: "Ouvrir Transactions",
    stepThreeText: "Voir chaque mouvement de solde au même endroit.",
    stepFourTitle: "Contacter support",
    stepFourText:
      "Telegram, email ou ticket web — toutes les options sont disponibles.",

    q1: "Quelle est la vitesse de livraison ?",
    a1:
      "La livraison dépend du service, de la quantité et de la plateforme. Certains services commencent très vite, tandis que les commandes grandes ou sensibles peuvent prendre plus de temps.",
    q2: "Que se passe-t-il après création d’une commande ?",
    a2:
      "Votre commande apparaît sur la page Orders. Vous pouvez suivre le statut : pending, processing, completed, failed, cancelled ou refunded.",
    q3: "Puis-je annuler une commande ?",
    a3:
      "Si la commande n’a pas encore commencé, contactez le support rapidement. Une fois en cours, l’annulation peut ne plus être possible.",
    q4: "Que se passe-t-il si une commande échoue ?",
    a4:
      "Si une commande échoue, un admin peut la vérifier et rembourser votre wallet si nécessaire. Vous pouvez aussi ouvrir un ticket support.",
    q5: "Comment fonctionnent les dépôts ?",
    a5:
      "Allez dans Wallet, choisissez un moyen de paiement et entrez le montant. PayPal peut fonctionner automatiquement, les méthodes backup peuvent nécessiter une vérification admin.",
    q6: "Comment fonctionnent les codes promo ?",
    a6:
      "Si vous avez un code promo, entrez-le au checkout dépôt. Les codes valides peuvent ajouter un bonus après approbation.",
    q7: "Où contacter le support ?",
    a7:
      "Vous pouvez contacter le support via la page Support, Telegram @EmpireBooster ou email followerbooster96@gmail.com.",
    q8: "Que dois-je écrire si j’ai besoin d’aide ?",
    a8:
      "Écrivez votre username, détails de commande, méthode de paiement et une courte explication. Des détails clairs aident le support à résoudre plus vite.",
    q9: "Ai-je besoin d’un profil public ?",
    a9:
      "Pour la plupart des services, le profil ou post doit être public pendant la commande. Les liens privés peuvent ralentir ou bloquer la livraison.",
    q10: "Puis-je commander plusieurs services à la fois ?",
    a10:
      "Oui. Vous pouvez créer plusieurs commandes, mais pour une livraison propre, évitez de trop charger le même lien avec des services similaires.",
    q11: "Avez-vous besoin de mon mot de passe ?",
    a11:
      "Non. N’envoyez jamais votre mot de passe. EmpireBoost a seulement besoin du bon lien profil, post, vidéo ou chaîne.",
    q12: "Où voir l’historique du solde ?",
    a12:
      "La page Transactions montre les mouvements wallet comme dépôts, paiements de commandes, remboursements et autres changements de solde.",
  },

  ru: {
    all: "Все",
    orders: "Заказы",
    wallet: "Кошелёк",
    services: "Услуги",
    support: "Поддержка",
    transactions: "Транзакции",
    security: "Безопасность",

    heroBadge: "Центр помощи EmpireBoost",
    heroTitle: "Ответы, поддержка и реальный контакт в одном месте.",
    heroText:
      "Всё важное о заказах, депозитах, доставке, возвратах и поддержке — с прямым Telegram, email и website ticket, когда нужна помощь человека.",
    browseFAQ: "Открыть FAQ",
    messageTelegram: "Написать в Telegram",

    helpCenter: "Центр помощи",
    helpfulAnswers: "полезных ответов доступно",
    categories: "Категории",
    showing: "Показано",

    telegram: "Telegram",
    telegramValue: "@EmpireBooster",
    telegramDescription: "Быстрое прямое сообщение для срочных вопросов.",
    email: "Email",
    emailDescription: "Отправь детали, скриншоты или вопросы по оплате.",
    websiteSupport: "Website Support",
    websiteSupportValue: "Открыть ticket",
    websiteSupportDescription:
      "Лучший вариант, если сообщение должно остаться внутри аккаунта.",

    quickAnswers: "Быстрые ответы",
    commonQuestions: "частые вопросы покрыты",
    telegramContact: "Telegram контакт",
    live: "Live",
    directMessage: "Прямое сообщение @EmpireBooster",
    emailSupport: "Email support",
    mail: "Mail",
    websiteTickets: "Website tickets",
    fast: "Быстро",
    websiteTicketSmall: "Отправка сообщений через страницу Support",

    knowledgeBase: "База знаний",
    faqTitle: "Частые вопросы",
    searchFAQ: "Поиск FAQ",
    searchPlaceholder:
      "Поиск orders, wallet, refunds, delivery, telegram...",

    noAnswerFound: "Ответ не найден",
    noAnswerText:
      "Попробуй другое слово, напиши @EmpireBooster в Telegram, отправь email или открой support ticket.",

    contactSupport: "Связаться с поддержкой",
    needHumanHelp: "Нужна помощь человека?",
    bestNextStep: "Лучший следующий шаг",
    bestNextText: "Выбери самый быстрый контакт для твоей ситуации.",
    supportCardText:
      "Telegram подходит для быстрых сообщений. Email лучше для длинных деталей и скриншотов. Website support лучше, если вопрос должен быть связан с аккаунтом.",
    supportTicket: "Support Ticket",

    stepOneTitle: "Проверь страницу Orders",
    stepOneText: "Сначала посмотри текущий статус заказа.",
    stepTwoTitle: "Проверь Wallet",
    stepTwoText: "Для депозитов, статуса оплаты и обновлений баланса.",
    stepThreeTitle: "Открой Transactions",
    stepThreeText: "Смотри каждое движение баланса в одном месте.",
    stepFourTitle: "Связаться с поддержкой",
    stepFourText:
      "Telegram, email или website ticket — все варианты доступны.",

    q1: "Как быстро идёт доставка?",
    a1:
      "Доставка зависит от выбранной услуги, количества и платформы. Некоторые услуги стартуют очень быстро, а большие или чувствительные заказы могут требовать больше времени.",
    q2: "Что происходит после создания заказа?",
    a2:
      "Заказ появляется на странице Orders. Там можно отслеживать статус: pending, processing, completed, failed, cancelled или refunded.",
    q3: "Можно ли отменить заказ?",
    a3:
      "Если заказ ещё не начался, свяжись с поддержкой как можно быстрее. Если заказ уже processing, отмена может быть невозможна.",
    q4: "Что если заказ не выполнится?",
    a4:
      "Если заказ failed, админ может проверить его и при необходимости вернуть средства на wallet. Также можно открыть support ticket.",
    q5: "Как работают депозиты?",
    a5:
      "Перейди в Wallet, выбери способ оплаты и введи сумму. PayPal может работать автоматически, backup-методы могут требовать проверки админа.",
    q6: "Как работают промокоды?",
    a6:
      "Если есть промокод, введи его во время deposit checkout. Валидные промокоды могут добавить бонус после подтверждения.",
    q7: "Где связаться с поддержкой?",
    a7:
      "Можно связаться через страницу Support, Telegram @EmpireBooster или email followerbooster96@gmail.com.",
    q8: "Что писать, если нужна помощь?",
    a8:
      "Напиши username, детали заказа, способ оплаты и короткое объяснение проблемы. Чёткие детали помогают решить быстрее.",
    q9: "Нужен ли публичный профиль?",
    a9:
      "Для большинства услуг профиль или пост должен быть публичным во время выполнения заказа. Приватные ссылки могут замедлить или заблокировать доставку.",
    q10: "Можно ли заказать несколько услуг сразу?",
    a10:
      "Да. Можно создать несколько заказов, но для чистой доставки лучше не спамить один и тот же link слишком многими похожими услугами.",
    q11: "Вам нужен мой пароль?",
    a11:
      "Нет. Никогда не отправляй пароль. EmpireBoost нужен только правильный link профиля, поста, видео или канала.",
    q12: "Где посмотреть историю баланса?",
    a12:
      "Страница Transactions показывает движения wallet: депозиты, оплаты заказов, возвраты и другие изменения баланса.",
  },
};

function getFAQTranslations(languageCode) {
  return FAQ_TRANSLATIONS[languageCode] || FAQ_TRANSLATIONS.en;
}

function FAQ() {
  const [selectedLanguage, setSelectedLanguage] = useState(getStoredLanguage());
  const t = getFAQTranslations(selectedLanguage);

  const faqItems = useMemo(
    () => [
      {
        category: t.orders,
        categoryKey: "Orders",
        question: t.q1,
        answer: t.a1,
      },
      {
        category: t.orders,
        categoryKey: "Orders",
        question: t.q2,
        answer: t.a2,
      },
      {
        category: t.orders,
        categoryKey: "Orders",
        question: t.q3,
        answer: t.a3,
      },
      {
        category: t.orders,
        categoryKey: "Orders",
        question: t.q4,
        answer: t.a4,
      },
      {
        category: t.wallet,
        categoryKey: "Wallet",
        question: t.q5,
        answer: t.a5,
      },
      {
        category: t.wallet,
        categoryKey: "Wallet",
        question: t.q6,
        answer: t.a6,
      },
      {
        category: t.support,
        categoryKey: "Support",
        question: t.q7,
        answer: t.a7,
      },
      {
        category: t.support,
        categoryKey: "Support",
        question: t.q8,
        answer: t.a8,
      },
      {
        category: t.services,
        categoryKey: "Services",
        question: t.q9,
        answer: t.a9,
      },
      {
        category: t.services,
        categoryKey: "Services",
        question: t.q10,
        answer: t.a10,
      },
      {
        category: t.security,
        categoryKey: "Security",
        question: t.q11,
        answer: t.a11,
      },
      {
        category: t.transactions,
        categoryKey: "Transactions",
        question: t.q12,
        answer: t.a12,
      },
    ],
    [t]
  );

  const categories = useMemo(
    () => [
      { key: "All", label: t.all },
      { key: "Orders", label: t.orders },
      { key: "Wallet", label: t.wallet },
      { key: "Services", label: t.services },
      { key: "Support", label: t.support },
      { key: "Transactions", label: t.transactions },
      { key: "Security", label: t.security },
    ],
    [t]
  );

  const floatingFAQItems = useMemo(
    () => [
      "FAQ",
      t.support,
      t.telegram,
      t.email,
      t.orders,
      t.wallet,
      "Delivery",
      "Refunds",
      "Secure",
      "Payments",
      "Help Center",
      "Tracking",
      t.services,
      "Creator",
      "Growth",
      "Questions",
      "Answers",
      "EmpireBoost",
    ],
    [t]
  );

  const contactOptions = useMemo(
    () => [
      {
        title: t.telegram,
        value: t.telegramValue,
        description: t.telegramDescription,
        href: telegramLink,
        icon: "✈",
        className: "faqContactTelegram",
      },
      {
        title: t.email,
        value: supportEmail,
        description: t.emailDescription,
        href: `mailto:${supportEmail}`,
        icon: "✉",
        className: "faqContactMail",
      },
      {
        title: t.websiteSupport,
        value: t.websiteSupportValue,
        description: t.websiteSupportDescription,
        href: "/support",
        icon: "◆",
        className: "faqContactTicket",
      },
    ],
    [t]
  );

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState([0, 1]);

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

  const filteredFaqs = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    return faqItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.categoryKey === activeCategory;

      const matchesSearch =
        !cleanSearch ||
        `${item.category} ${item.question} ${item.answer}`
          .toLowerCase()
          .includes(cleanSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search, faqItems]);

  const stats = useMemo(() => {
    return {
      total: faqItems.length,
      categories: categories.length - 1,
      visible: filteredFaqs.length,
    };
  }, [filteredFaqs.length, faqItems.length, categories.length]);

  const toggleItem = (index) => {
    setOpenItems((currentItems) => {
      if (currentItems.includes(index)) {
        return currentItems.filter((item) => item !== index);
      }

      return [...currentItems, index];
    });
  };

  return (
    <main className="faqPagePro">
      <div className="faqAurora" aria-hidden="true">
        <span className="faqAuroraOne" />
        <span className="faqAuroraTwo" />
        <span className="faqAuroraThree" />
        <span className="faqAuroraFour" />
      </div>

      <div className="faqFloatingLayer" aria-hidden="true">
        {floatingFAQItems.map((item, index) => (
          <span className={`faqFloat faqFloat${index + 1}`} key={`${item}-${index}`}>
            {item}
          </span>
        ))}
      </div>

      <section className="faqHeroPro">
        <div className="faqHeroContent">
          <div className="faqBadgePro">
            <span />
            {t.heroBadge}
          </div>

          <h1>{t.heroTitle}</h1>

          <p>{t.heroText}</p>

          <div className="faqHeroActions">
            <a href="#faq-list" className="faqPrimaryBtn">
              {t.browseFAQ}
            </a>

            <a href={telegramLink} target="_blank" rel="noreferrer" className="faqSecondaryBtn">
              {t.messageTelegram}
            </a>
          </div>
        </div>

        <aside className="faqInfoCard">
          <div className="faqInfoGlow" />

          <span>{t.helpCenter}</span>
          <strong>{stats.total}</strong>
          <small>{t.helpfulAnswers}</small>

          <div className="faqInfoMiniGrid">
            <div>
              <span>{t.categories}</span>
              <b>{stats.categories}</b>
            </div>

            <div>
              <span>{t.showing}</span>
              <b>{stats.visible}</b>
            </div>
          </div>
        </aside>
      </section>

      <section className="faqContactGrid">
        {contactOptions.map((option) => (
          <a
            href={option.href}
            target={option.href.startsWith("http") ? "_blank" : undefined}
            rel={option.href.startsWith("http") ? "noreferrer" : undefined}
            className={`faqContactCard ${option.className}`}
            key={option.title}
          >
            <div className="faqContactIcon">{option.icon}</div>

            <div>
              <span>{option.title}</span>
              <strong>{option.value}</strong>
              <p>{option.description}</p>
            </div>
          </a>
        ))}
      </section>

      <section className="faqStatsGrid">
        <article className="faqStatCard faqStatMain">
          <span>{t.quickAnswers}</span>
          <strong>{stats.total}</strong>
          <small>{t.commonQuestions}</small>
        </article>

        <article className="faqStatCard">
          <span>{t.telegramContact}</span>
          <strong>{t.live}</strong>
          <small>{t.directMessage}</small>
        </article>

        <article className="faqStatCard">
          <span>{t.emailSupport}</span>
          <strong>{t.mail}</strong>
          <small>{supportEmail}</small>
        </article>

        <article className="faqStatCard">
          <span>{t.websiteTickets}</span>
          <strong>{t.fast}</strong>
          <small>{t.websiteTicketSmall}</small>
        </article>
      </section>

      <section className="faqMainGrid" id="faq-list">
        <section className="faqPanel faqListPanel">
          <div className="faqPanelHeader">
            <div>
              <span>{t.knowledgeBase}</span>
              <h2>{t.faqTitle}</h2>
            </div>

            <div className="faqPanelIcon">{filteredFaqs.length}</div>
          </div>

          <div className="faqToolbar">
            <label className="faqSearchBox">
              <span>{t.searchFAQ}</span>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>

          <div className="faqCategoryRail">
            {categories.map((category) => (
              <button
                type="button"
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={activeCategory === category.key ? "faqCategoryActive" : ""}
              >
                {category.label}
              </button>
            ))}
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="faqEmptyBox">
              <strong>{t.noAnswerFound}</strong>
              <span>{t.noAnswerText}</span>
            </div>
          ) : (
            <div className="faqAccordionList">
              {filteredFaqs.map((item) => {
                const realIndex = faqItems.indexOf(item);
                const isOpen = openItems.includes(realIndex);

                return (
                  <article
                    className={`faqAccordionItem ${isOpen ? "faqAccordionOpen" : ""}`}
                    key={item.question}
                  >
                    <button type="button" onClick={() => toggleItem(realIndex)}>
                      <div>
                        <span>{item.category}</span>
                        <strong>{item.question}</strong>
                      </div>

                      <b>{isOpen ? "−" : "+"}</b>
                    </button>

                    <div className="faqAccordionAnswer">
                      <p>{item.answer}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside className="faqPanel faqSidePanel">
          <div className="faqPanelHeader">
            <div>
              <span>{t.contactSupport}</span>
              <h2>{t.needHumanHelp}</h2>
            </div>

            <div className="faqPanelIcon">↗</div>
          </div>

          <div className="faqSupportCard">
            <span>{t.bestNextStep}</span>
            <strong>{t.bestNextText}</strong>
            <p>{t.supportCardText}</p>

            <div className="faqSupportButtons">
              <a href={telegramLink} target="_blank" rel="noreferrer" className="faqSupportBtn">
                {t.telegram}
              </a>

              <a href={`mailto:${supportEmail}`} className="faqSupportBtn faqSupportBtnDark">
                {t.email}
              </a>

              <a href="/support" className="faqSupportBtn faqSupportBtnDark">
                {t.supportTicket}
              </a>
            </div>
          </div>

          <div className="faqSteps">
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
    </main>
  );
}

export default FAQ;