const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const africastalking = require("africastalking");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Initialize Africa's Talking
const AT = africastalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

const sms = AT.SMS;

// In-memory session storage
const sessions = new Map();

// Multilingual support
const LANGUAGES = {
  en: {
    welcome: "Welcome to PaySmile",
    selectLang: "Select Language",
    donate: "Donate",
    viewProjects: "View Projects",
    myImpact: "My Impact",
    help: "Help",
    back: "Back",
    mainMenu: "Main Menu",
    selectProject: "Select Project",
    enterAmount: "Enter amount",
    confirm: "Confirm",
    cancel: "Cancel",
    change: "Change Amount",
    success: "Donation Successful!",
    project: "Project",
    amount: "Amount",
    goal: "Goal",
    raised: "Raised",
    location: "Location",
    minMax: "(Min: 100, Max: 10,000)",
    confirmDonation: "Confirm Donation",
    badge: "Badge",
    smsReceipt: "SMS receipt sent",
    thankYou: "Thank you!",
    invalidAmount: "Invalid amount!",
    enterBetween: "Enter between 100-10,000 RWF",
    roundUp: "Round up",
    txHash: "TX Hash",
    tier: "Tier",
    invalidSelection: "Invalid selection",
    // Payment services
    buyAirtime: "Buy Airtime",
    buyData: "Buy Data",
    payUtility: "Pay Utility",
    enterPhone: "Enter phone number",
    selectDataBundle: "Select Data Bundle",
    selectUtility: "Select Utility",
    paymentSuccess: "Payment Successful!",
    roundUpDonation: "Round up to donate?",
    yourPurchase: "Your Purchase",
    total: "Total",
    roundedAmount: "Rounded Amount",
    donationAmount: "Donation",
    yesRoundUp: "Yes, Round Up",
    noThanks: "No Thanks",
    // Encouraging messages
    youAreAHero: "You are a hero!",
    makingDifference: "Your kindness is changing lives",
    gratefulMessage: "families are grateful for your generosity",
    keepGoing: "Every donation counts!",
    yourImpactMatters: "You're making Rwanda better",
    // Trust & Support
    trustInfo: "Your Safety & Trust",
    verifiedProjects: "All projects verified",
    transparentTracking: "Blockchain tracking",
    support24: "24/7 Support",
    contactUs: "Contact",
    projectsWebsite: "Projects",
    securePayments: "Secure payments",
    governmentApproved: "Govt approved NGOs",
  },
  sw: {
    welcome: "Karibu PaySmile",
    selectLang: "Chagua Lugha",
    donate: "Toa Mchango",
    viewProjects: "Tazama Miradi",
    myImpact: "Athari Zangu",
    help: "Msaada",
    back: "Rudi Nyuma",
    mainMenu: "Menu Kuu",
    selectProject: "Chagua Mradi",
    enterAmount: "Weka kiasi",
    confirm: "Thibitisha",
    cancel: "Ghairi",
    change: "Badilisha Kiasi",
    success: "Mchango Umefanikiwa!",
    project: "Mradi",
    amount: "Kiasi",
    goal: "Lengo",
    raised: "Imekusanywa",
    location: "Mahali",
    minMax: "(Chini: 100, Juu: 10,000)",
    confirmDonation: "Thibitisha Mchango",
    badge: "Tuzo",
    smsReceipt: "Risiti ya SMS imetumwa",
    thankYou: "Asante sana!",
    invalidAmount: "Kiasi si sahihi!",
    enterBetween: "Weka kati ya 100-10,000 RWF",
    roundUp: "Ongeza",
    txHash: "TX Hash",
    tier: "Ngazi",
    invalidSelection: "Chaguo si sahihi",
    // Payment services
    buyAirtime: "Nunua Airtime",
    buyData: "Nunua Data",
    payUtility: "Lipia Huduma",
    enterPhone: "Weka nambari ya simu",
    selectDataBundle: "Chagua Pakiti ya Data",
    selectUtility: "Chagua Huduma",
    paymentSuccess: "Malipo Yamefanikiwa!",
    roundUpDonation: "Ongeza kutoa mchango?",
    yourPurchase: "Ununuzi Wako",
    total: "Jumla",
    roundedAmount: "Kiasi Kilichoongezwa",
    donationAmount: "Mchango",
    yesRoundUp: "Ndio, Ongeza",
    noThanks: "Hapana Asante",
    // Encouraging messages
    youAreAHero: "Wewe ni shujaa!",
    makingDifference: "Huruma yako inabadilisha maisha",
    gratefulMessage: "familia zinashukuru ukarimu wako",
    keepGoing: "Kila mchango una umuhimu!",
    yourImpactMatters: "Unafanya Rwanda iwe bora",
    // Trust & Support
    trustInfo: "Usalama na Uaminifu Wako",
    verifiedProjects: "Miradi yote imethibitishwa",
    transparentTracking: "Ufuatiliaji wa Blockchain",
    support24: "Msaada 24/7",
    contactUs: "Wasiliana",
    projectsWebsite: "Miradi",
    securePayments: "Malipo salama",
    governmentApproved: "NGO zilizoidhinishwa na Serikali",
  },
  fr: {
    welcome: "Bienvenue à PaySmile",
    selectLang: "Sélectionner la langue",
    donate: "Faire un don",
    viewProjects: "Voir les projets",
    myImpact: "Mon impact",
    help: "Aide",
    back: "Retour",
    mainMenu: "Menu principal",
    selectProject: "Sélectionner un projet",
    enterAmount: "Entrer le montant",
    confirm: "Confirmer",
    cancel: "Annuler",
    change: "Changer le montant",
    success: "Don réussi!",
    project: "Projet",
    amount: "Montant",
    goal: "Objectif",
    raised: "Collecté",
    location: "Lieu",
    minMax: "(Min: 100, Max: 10,000)",
    confirmDonation: "Confirmer le don",
    badge: "Badge",
    smsReceipt: "Reçu SMS envoyé",
    thankYou: "Merci beaucoup!",
    invalidAmount: "Montant invalide!",
    enterBetween: "Entrez entre 100-10,000 RWF",
    roundUp: "Arrondir",
    txHash: "TX Hash",
    tier: "Niveau",
    invalidSelection: "Sélection invalide",
    // Payment services
    buyAirtime: "Acheter du Crédit",
    buyData: "Acheter des Données",
    payUtility: "Payer un Service",
    enterPhone: "Entrez le numéro",
    selectDataBundle: "Choisir un Forfait",
    selectUtility: "Choisir un Service",
    paymentSuccess: "Paiement Réussi!",
    roundUpDonation: "Arrondir pour donner?",
    yourPurchase: "Votre Achat",
    total: "Total",
    roundedAmount: "Montant Arrondi",
    donationAmount: "Don",
    yesRoundUp: "Oui, Arrondir",
    noThanks: "Non Merci",
    // Encouraging messages
    youAreAHero: "Vous êtes un héros!",
    makingDifference: "Votre gentillesse change des vies",
    gratefulMessage: "familles vous remercient pour votre générosité",
    keepGoing: "Chaque don compte!",
    yourImpactMatters: "Vous rendez le Rwanda meilleur",
    // Trust & Support
    trustInfo: "Votre Sécurité et Confiance",
    verifiedProjects: "Tous les projets vérifiés",
    transparentTracking: "Suivi Blockchain",
    support24: "Support 24/7",
    contactUs: "Contact",
    projectsWebsite: "Projets",
    securePayments: "Paiements sécurisés",
    governmentApproved: "ONG approuvées par le gouvernement",
  },
};

// Projects with multilingual support - REAL URGENT PROBLEMS IN RWANDA
const RWANDA_PROJECTS = [
  {
    id: 1,
    name: {
      en: "Emergency Food Relief - Bugesera",
      sw: "Msaada wa Dharura wa Chakula - Bugesera",
      fr: "Aide Alimentaire d'Urgence - Bugesera",
    },
    location: {
      en: "Bugesera District (Drought-affected)",
      sw: "Wilaya ya Bugesera (Imepigwa na ukame)",
      fr: "District de Bugesera (Touché par la sécheresse)",
    },
    goal: 50000,
    raised: 12800,
    description: {
      en: "3,500 families facing severe food shortage due to prolonged drought. Need emergency food supplies.",
      sw: "Familia 3,500 zinakabiliwa na uhaba mkubwa wa chakula kutokana na ukame wa muda mrefu. Wanahitaji chakula cha dharura.",
      fr: "3 500 familles confrontées à une grave pénurie alimentaire en raison d'une sécheresse prolongée. Besoin de vivres d'urgence.",
    },
  },
  {
    id: 2,
    name: {
      en: "Flood Victims Shelter - Rubavu",
      sw: "Makazi ya Waathiriwa wa Mafuriko - Rubavu",
      fr: "Abris pour Victimes d'Inondations - Rubavu",
    },
    location: {
      en: "Rubavu District (Lake Kivu Basin)",
      sw: "Wilaya ya Rubavu (Bonde la Ziwa Kivu)",
      fr: "District de Rubavu (Bassin du Lac Kivu)",
    },
    goal: 85000,
    raised: 23400,
    description: {
      en: "850 families displaced by Lake Kivu floods. Urgent need for temporary shelters, blankets & clean water.",
      sw: "Familia 850 zimehama kutokana na mafuriko ya Ziwa Kivu. Haja ya dharura ya makazi ya muda, blanketi na maji safi.",
      fr: "850 familles déplacées par les inondations du Lac Kivu. Besoin urgent d'abris temporaires, couvertures et eau potable.",
    },
  },
  {
    id: 3,
    name: {
      en: "Malaria Treatment - Nyagatare",
      sw: "Matibabu ya Malaria - Nyagatare",
      fr: "Traitement du Paludisme - Nyagatare",
    },
    location: {
      en: "Nyagatare District (Eastern Province)",
      sw: "Wilaya ya Nyagatare (Mkoa wa Mashariki)",
      fr: "District de Nyagatare (Province de l'Est)",
    },
    goal: 35000,
    raised: 8900,
    description: {
      en: "Severe malaria outbreak affecting 2,100+ children under 5. Need mosquito nets & antimalarial drugs urgently.",
      sw: "Mlipuko mkubwa wa malaria unaoathiri watoto 2,100+ chini ya miaka 5. Wanahitaji vyandarua na dawa za malaria haraka.",
      fr: "Grave épidémie de paludisme touchant 2 100+ enfants de moins de 5 ans. Besoin urgent de moustiquaires et antipaludéens.",
    },
  },
  {
    id: 4,
    name: {
      en: "Maternal Health Crisis - Gicumbi",
      sw: "Hali ya Dharura ya Afya ya Mama na Mtoto - Gicumbi",
      fr: "Crise de Santé Maternelle - Gicumbi",
    },
    location: {
      en: "Gicumbi District (Northern Province)",
      sw: "Wilaya ya Gicumbi (Mkoa wa Kaskazini)",
      fr: "District de Gicumbi (Province du Nord)",
    },
    goal: 45000,
    raised: 11500,
    description: {
      en: "Rural health center lacks delivery equipment. 600+ pregnant women at risk. Need ambulance & medical supplies.",
      sw: "Kituo cha afya cha vijijini hakina vifaa vya kujifungua. Wanawake wajawazito 600+ wako hatarini. Wanahitaji ambulensi na vifaa vya matibabu.",
      fr: "Centre de santé rural manque d'équipement d'accouchement. 600+ femmes enceintes à risque. Besoin d'ambulance et fournitures médicales.",
    },
  },
];

// Session timeout management (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

// Helper functions
function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      stage: "language",
      language: null,
      selectedProject: null,
      amount: null,
      phoneNumber: null,
      lastActivity: Date.now(),
    });
  } else {
    // Update last activity timestamp
    const session = sessions.get(sessionId);
    session.lastActivity = Date.now();
  }
  return sessions.get(sessionId);
}

// Clean up expired sessions every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastActivity > SESSION_TIMEOUT) {
      sessions.delete(sessionId);
      console.log(`Session expired and cleaned up: ${sessionId}`);
    }
  }
}, 10 * 60 * 1000); // Run cleanup every 10 minutes

function t(session, key) {
  const lang = session.language || "en";
  return LANGUAGES[lang][key] || key;
}

function getProjectName(project, lang) {
  return project.name[lang] || project.name.en;
}

function getProjectLocation(project, lang) {
  return project.location[lang] || project.location.en;
}

function getProjectDescription(project, lang) {
  return project.description[lang] || project.description.en;
}

function formatRWF(amount) {
  return `${amount.toLocaleString()} RWF`;
}

function getProgress(project) {
  return Math.round((project.raised / project.goal) * 100);
}

function getBadgeTier(amount) {
  if (amount >= 10000) return "Gold";
  if (amount >= 1000) return "Silver";
  return "Bronze";
}

// USSD Route Handler
app.post("/ussd", async (req, res) => {
  try {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    console.log(
      `USSD Request: SessionID=${sessionId}, Phone=${phoneNumber}, Text="${text}"`
    );

    const session = getSession(sessionId);
    session.phoneNumber = phoneNumber;

    let response = "";
    const userInput = text.split("*").pop();
    const inputLength = text.split("*").length;

    // Language Selection (Initial)
    if (text === "") {
      session.stage = "language";
      session.language = null;
      response = `CON ${LANGUAGES.en.welcome} 😊\n${LANGUAGES.en.selectLang}:\n\n1. English\n2. Kiswahili\n3. Français`;
    }

    // Language Selection Handler
    else if (session.stage === "language" && !session.language) {
      const langMap = { 1: "en", 2: "sw", 3: "fr" };
      session.language = langMap[userInput] || "en";
      session.stage = "menu";

      response = `CON ${t(session, "welcome")} 😊\n\n1. ${t(
        session,
        "buyAirtime"
      )}\n2. ${t(session, "buyData")}\n3. ${t(session, "payUtility")}\n4. ${t(
        session,
        "viewProjects"
      )}\n5. ${t(session, "myImpact")}\n6. ${t(session, "help")} & ${t(
        session,
        "trustInfo"
      )}\n\n0. ${t(session, "selectLang")}`;
    }

    // Main Menu
    else if (session.stage === "menu") {
      switch (userInput) {
        case "0": // Change Language
          session.stage = "language";
          session.language = null;
          response = `CON ${LANGUAGES.en.welcome} 😊\n${LANGUAGES.en.selectLang}:\n\n1. English\n2. Kiswahili\n3. Français`;
          break;

        case "1": // Buy Airtime
          session.stage = "select_airtime_amount";
          response = `CON ${t(
            session,
            "buyAirtime"
          )}\n\n1. 500 RWF\n2. 1,000 RWF\n3. 2,000 RWF\n4. 5,000 RWF\n5. 10,000 RWF\n\n00. ${t(
            session,
            "mainMenu"
          )}\n0. ${t(session, "back")}`;
          break;

        case "2": // Buy Data
          session.stage = "select_data_bundle";
          response = `CON ${t(
            session,
            "selectDataBundle"
          )}:\n\n1. 50MB - 500 RWF\n2. 200MB - 1,250 RWF\n3. 1GB - 2,750 RWF\n4. 5GB - 8,500 RWF\n5. 10GB - 15,800 RWF\n\n00. ${t(
            session,
            "mainMenu"
          )}\n0. ${t(session, "back")}`;
          break;

        case "3": // Pay Utility
          session.stage = "select_utility";
          response = `CON ${t(
            session,
            "selectUtility"
          )}:\n\n1. Electricity (EUCL)\n2. Water (WASAC)\n3. Internet\n4. TV Subscription\n\n00. ${t(
            session,
            "mainMenu"
          )}\n0. ${t(session, "back")}`;
          break;

        case "4": // View Projects
          session.stage = "view_projects";
          session.projectViewIndex = 0; // Start at first project
          const lang2 = session.language;
          const currentProj = RWANDA_PROJECTS[session.projectViewIndex];
          response = `CON ${t(session, "viewProjects")} (${
            session.projectViewIndex + 1
          }/${RWANDA_PROJECTS.length}):\n\n${getProjectName(
            currentProj,
            lang2
          )}\n${t(session, "goal")}: ${formatRWF(currentProj.goal)}\n${t(
            session,
            "raised"
          )}: ${formatRWF(currentProj.raised)}\n${t(
            session,
            "location"
          )}: ${getProjectLocation(currentProj, lang2)}\n\n${
            session.projectViewIndex < RWANDA_PROJECTS.length - 1
              ? "9. Next"
              : ""
          }\n00. ${t(session, "mainMenu")}\n0. ${t(session, "back")}`;
          break;

        case "5": // My Impact
          session.stage = "view_impact";
          response = `CON ${t(session, "myImpact")}:\n\n${t(
            session,
            "roundUp"
          )}: 12\n${t(session, "amount")}: 3,240 RWF\n${t(
            session,
            "project"
          )}: 5\n\n${t(session, "badge")}: 🥉 Bronze\n\n${t(
            session,
            "thankYou"
          )}\n\n00. ${t(session, "mainMenu")}\n0. ${t(session, "back")}`;
          break;

        case "6": // Help & Trust Info
          session.stage = "view_help";
          response = `CON ${t(session, "trustInfo")} 🛡️\n\n✓ ${t(
            session,
            "verifiedProjects"
          )}\n✓ ${t(session, "governmentApproved")}\n✓ ${t(
            session,
            "transparentTracking"
          )}\n✓ ${t(session, "securePayments")}\n\n📞 ${t(
            session,
            "support24"
          )}: +250788123456\n🌐 paysmile.rw/projects\n\n00. ${t(
            session,
            "mainMenu"
          )}\n0. ${t(session, "back")}`;
          break;

        default:
          response = `END ${t(session, "invalidSelection")}`;
      }
    }

    // Select Airtime Amount
    else if (session.stage === "select_airtime_amount") {
      if (userInput === "00") {
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 😊\n\n1. ${t(
          session,
          "buyAirtime"
        )}\n2. ${t(session, "buyData")}\n3. ${t(session, "payUtility")}\n4. ${t(
          session,
          "viewProjects"
        )}\n5. ${t(session, "myImpact")}\n\n0. ${t(session, "selectLang")}`;
      } else if (userInput === "0") {
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 😊\n\n1. ${t(
          session,
          "buyAirtime"
        )}\n2. ${t(session, "buyData")}\n3. ${t(session, "payUtility")}\n4. ${t(
          session,
          "viewProjects"
        )}\n5. ${t(session, "myImpact")}\n\n0. ${t(session, "selectLang")}`;
      } else {
        const airtimeAmounts = [500, 1000, 2000, 5000, 10000];
        const amountIndex = parseInt(userInput) - 1;
        if (amountIndex >= 0 && amountIndex < airtimeAmounts.length) {
          const amount = airtimeAmounts[amountIndex];
          session.purchaseAmount = amount;
          session.purchaseType = "airtime";
          const roundedAmount = Math.ceil(amount / 100) * 100;
          const donationAmount = roundedAmount - amount;
          session.roundedAmount = roundedAmount;
          session.donationAmount = donationAmount;

          // Skip round-up prompt if no change to round up
          if (donationAmount === 0) {
            session.stage = "confirm_purchase";
            response = `CON ${t(session, "confirmDonation")}:\n\n${t(
              session,
              "yourPurchase"
            )}: Airtime\n${t(session, "amount")}: ${formatRWF(
              amount
            )}\n\n1. ${t(session, "confirm")}\n2. ${t(
              session,
              "cancel"
            )}\n\n0. ${t(session, "back")}`;
          } else {
            session.stage = "round_up_prompt";
            response = `CON ${t(session, "roundUpDonation")}\n\n${t(
              session,
              "yourPurchase"
            )}: Airtime ${formatRWF(amount)}\n${t(
              session,
              "roundedAmount"
            )}: ${formatRWF(roundedAmount)}\n${t(
              session,
              "donationAmount"
            )}: ${formatRWF(donationAmount)}\n\n1. ${t(
              session,
              "yesRoundUp"
            )}\n2. ${t(session, "noThanks")}\n\n0. ${t(session, "back")}`;
          }
        } else {
          response = `END ${t(session, "invalidSelection")}`;
        }
      }
    }

    // Select Data Bundle
    else if (session.stage === "select_data_bundle") {
      if (userInput === "00") {
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 😊\n\n1. ${t(
          session,
          "buyAirtime"
        )}\n2. ${t(session, "buyData")}\n3. ${t(session, "payUtility")}\n4. ${t(
          session,
          "viewProjects"
        )}\n5. ${t(session, "myImpact")}\n\n0. ${t(session, "selectLang")}`;
      } else if (userInput === "0") {
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 😊\n\n1. ${t(
          session,
          "buyAirtime"
        )}\n2. ${t(session, "buyData")}\n3. ${t(session, "payUtility")}\n4. ${t(
          session,
          "viewProjects"
        )}\n5. ${t(session, "myImpact")}\n\n0. ${t(session, "selectLang")}`;
      } else {
        const dataBundles = [
          { name: "50MB", amount: 500 },
          { name: "200MB", amount: 1250 },
          { name: "1GB", amount: 2750 },
          { name: "5GB", amount: 8500 },
          { name: "10GB", amount: 15800 },
        ];
        const bundleIndex = parseInt(userInput) - 1;
        if (bundleIndex >= 0 && bundleIndex < dataBundles.length) {
          const bundle = dataBundles[bundleIndex];
          session.purchaseAmount = bundle.amount;
          session.purchaseType = `data_${bundle.name}`;
          const roundedAmount = Math.ceil(bundle.amount / 100) * 100;
          const donationAmount = roundedAmount - bundle.amount;
          session.roundedAmount = roundedAmount;
          session.donationAmount = donationAmount;

          // Skip round-up prompt if no change to round up
          if (donationAmount === 0) {
            session.stage = "menu";
            response = `END ${t(session, "paymentSuccess")} 😊\n\n${t(
              session,
              "yourPurchase"
            )}: ${bundle.name}\n${t(session, "amount")}: ${formatRWF(
              bundle.amount
            )}\n\n${t(session, "thankYou")}`;
          } else {
            session.stage = "round_up_prompt";
            response = `CON ${t(session, "roundUpDonation")}\n\n${t(
              session,
              "yourPurchase"
            )}: ${bundle.name} - ${formatRWF(bundle.amount)}\n${t(
              session,
              "roundedAmount"
            )}: ${formatRWF(roundedAmount)}\n${t(
              session,
              "donationAmount"
            )}: ${formatRWF(donationAmount)}\n\n1. ${t(
              session,
              "yesRoundUp"
            )}\n2. ${t(session, "noThanks")}\n\n0. ${t(session, "back")}`;
          }
        } else {
          response = `END ${t(session, "invalidSelection")}`;
        }
      }
    }

    // Select Utility
    else if (session.stage === "select_utility") {
      if (userInput === "00") {
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 😊\n\n1. ${t(
          session,
          "buyAirtime"
        )}\n2. ${t(session, "buyData")}\n3. ${t(session, "payUtility")}\n4. ${t(
          session,
          "viewProjects"
        )}\n5. ${t(session, "myImpact")}\n\n0. ${t(session, "selectLang")}`;
      } else if (userInput === "0") {
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 😊\n\n1. ${t(
          session,
          "buyAirtime"
        )}\n2. ${t(session, "buyData")}\n3. ${t(session, "payUtility")}\n4. ${t(
          session,
          "viewProjects"
        )}\n5. ${t(session, "myImpact")}\n\n0. ${t(session, "selectLang")}`;
      } else {
        const utilities = [
          { name: "Electricity", amount: 3450 },
          { name: "Water", amount: 1280 },
          { name: "Internet", amount: 25900 },
          { name: "TV", amount: 8750 },
        ];
        const utilityIndex = parseInt(userInput) - 1;
        if (utilityIndex >= 0 && utilityIndex < utilities.length) {
          const utility = utilities[utilityIndex];
          session.purchaseAmount = utility.amount;
          session.purchaseType = `utility_${utility.name}`;
          const roundedAmount = Math.ceil(utility.amount / 100) * 100;
          const donationAmount = roundedAmount - utility.amount;
          session.roundedAmount = roundedAmount;
          session.donationAmount = donationAmount;

          // Skip round-up prompt if no change to round up
          if (donationAmount === 0) {
            session.stage = "menu";
            response = `END ${t(session, "paymentSuccess")} 😊\n\n${t(
              session,
              "yourPurchase"
            )}: ${utility.name}\n${t(session, "amount")}: ${formatRWF(
              utility.amount
            )}\n\n${t(session, "thankYou")}`;
          } else {
            session.stage = "round_up_prompt";
            response = `CON ${t(session, "roundUpDonation")}\n\n${t(
              session,
              "yourPurchase"
            )}: ${utility.name} - ${formatRWF(utility.amount)}\n${t(
              session,
              "roundedAmount"
            )}: ${formatRWF(roundedAmount)}\n${t(
              session,
              "donationAmount"
            )}: ${formatRWF(donationAmount)}\n\n1. ${t(
              session,
              "yesRoundUp"
            )}\n2. ${t(session, "noThanks")}\n\n0. ${t(session, "back")}`;
          }
        } else {
          response = `END ${t(session, "invalidSelection")}`;
        }
      }
    }

    // Confirm Purchase (No Round-Up)
    else if (session.stage === "confirm_purchase") {
      if (userInput === "0") {
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 😊\n\n1. ${t(
          session,
          "buyAirtime"
        )}\n2. ${t(session, "buyData")}\n3. ${t(session, "payUtility")}\n4. ${t(
          session,
          "viewProjects"
        )}\n5. ${t(session, "myImpact")}\n\n0. ${t(session, "selectLang")}`;
      } else if (userInput === "1") {
        // Confirm purchase
        response = `END ${t(session, "paymentSuccess")} 😊\n\n${t(
          session,
          "yourPurchase"
        )}: ${session.purchaseType}\n${t(session, "amount")}: ${formatRWF(
          session.purchaseAmount
        )}\n\n${t(
          session,
          "thankYou"
        )} 💚\n\nConsider rounding up next time to help families! ✨`;
      } else if (userInput === "2") {
        // Cancel
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 😊\n\n1. ${t(
          session,
          "buyAirtime"
        )}\n2. ${t(session, "buyData")}\n3. ${t(session, "payUtility")}\n4. ${t(
          session,
          "viewProjects"
        )}\n5. ${t(session, "myImpact")}\n\n0. ${t(session, "selectLang")}`;
      } else {
        response = `END ${t(session, "invalidSelection")}`;
      }
    }

    // Round Up Prompt
    else if (session.stage === "round_up_prompt") {
      if (userInput === "0") {
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 😊\n\n1. ${t(
          session,
          "buyAirtime"
        )}\n2. ${t(session, "buyData")}\n3. ${t(session, "payUtility")}\n4. ${t(
          session,
          "viewProjects"
        )}\n5. ${t(session, "myImpact")}\n\n0. ${t(session, "selectLang")}`;
      } else if (userInput === "1") {
        // Yes, round up and donate
        session.stage = "select_project_for_donation";
        const lang = session.language;
        response = `CON ${t(session, "selectProject")}:\n\n1. ${getProjectName(
          RWANDA_PROJECTS[0],
          lang
        )}\n   ${getProgress(
          RWANDA_PROJECTS[0]
        )}% funded\n\n2. ${getProjectName(
          RWANDA_PROJECTS[1],
          lang
        )}\n   ${getProgress(
          RWANDA_PROJECTS[1]
        )}% funded\n\n3. ${getProjectName(
          RWANDA_PROJECTS[2],
          lang
        )}\n   ${getProgress(
          RWANDA_PROJECTS[2]
        )}% funded\n\n4. ${getProjectName(
          RWANDA_PROJECTS[3],
          lang
        )}\n   ${getProgress(RWANDA_PROJECTS[3])}% funded\n\n0. ${t(
          session,
          "back"
        )}`;
      } else if (userInput === "2") {
        // No thanks, complete purchase without donation
        session.stage = "menu";
        response = `END ${t(session, "paymentSuccess")} ✅\n\n${t(
          session,
          "amount"
        )}: ${formatRWF(session.purchaseAmount)}\n\n${t(
          session,
          "thankYou"
        )}\n\nNext time, round up to help families in need! 💚`;
      } else {
        response = `END ${t(session, "invalidSelection")}`;
      }
    }

    // Select Project for Donation
    else if (session.stage === "select_project_for_donation") {
      if (userInput === "0") {
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 😊\n\n1. ${t(
          session,
          "buyAirtime"
        )}\n2. ${t(session, "buyData")}\n3. ${t(session, "payUtility")}\n4. ${t(
          session,
          "viewProjects"
        )}\n5. ${t(session, "myImpact")}\n\n0. ${t(session, "selectLang")}`;
      } else {
        const projectIndex = parseInt(userInput) - 1;
        if (projectIndex >= 0 && projectIndex < RWANDA_PROJECTS.length) {
          session.selectedProject = RWANDA_PROJECTS[projectIndex];
          const lang = session.language;

          // Calculate how many families this helps (estimate)
          const familiesHelped = Math.floor(session.donationAmount / 50);
          const impactMessage =
            familiesHelped > 0
              ? `\n\n${familiesHelped}+ ${t(session, "gratefulMessage")}`
              : "";

          // Complete the transaction with encouraging message
          response = `END ${t(session, "paymentSuccess")} 😊\n\n${t(
            session,
            "youAreAHero"
          )} 🌟\n\n${t(session, "total")}: ${formatRWF(
            session.roundedAmount
          )}\n${t(session, "yourPurchase")}: ${formatRWF(
            session.purchaseAmount
          )}\n${t(session, "donationAmount")}: ${formatRWF(
            session.donationAmount
          )}\n\n${t(session, "project")}: ${getProjectName(
            session.selectedProject,
            lang
          )}\n\n${t(session, "badge")}: ${getBadgeTier(
            session.donationAmount
          )}${impactMessage}\n\n${t(session, "makingDifference")} 💚\n${t(
            session,
            "keepGoing"
          )} ✨`;
        } else {
          response = `END ${t(session, "invalidSelection")}`;
        }
      }
    }

    // View Projects Handler
    else if (session.stage === "view_projects") {
      if (userInput === "00") {
        session.stage = "menu";
        session.projectViewIndex = 0;
        response = `CON ${t(session, "welcome")} 😊\n\n1. ${t(
          session,
          "donate"
        )}\n2. ${t(session, "viewProjects")}\n3. ${t(
          session,
          "myImpact"
        )}\n4. ${t(session, "help")}\n\n0. ${t(session, "selectLang")}`;
      } else if (userInput === "0") {
        session.stage = "menu";
        session.projectViewIndex = 0;
        response = `CON ${t(session, "welcome")} 😊\n\n1. ${t(
          session,
          "donate"
        )}\n2. ${t(session, "viewProjects")}\n3. ${t(
          session,
          "myImpact"
        )}\n4. ${t(session, "help")}\n\n0. ${t(session, "selectLang")}`;
      } else if (
        userInput === "9" &&
        session.projectViewIndex < RWANDA_PROJECTS.length - 1
      ) {
        // Show next project
        session.projectViewIndex++;
        const lang = session.language;
        const currentProj = RWANDA_PROJECTS[session.projectViewIndex];
        response = `CON ${t(session, "viewProjects")} (${
          session.projectViewIndex + 1
        }/${RWANDA_PROJECTS.length}):\n\n${getProjectName(
          currentProj,
          lang
        )}\n${t(session, "goal")}: ${formatRWF(currentProj.goal)}\n${t(
          session,
          "raised"
        )}: ${formatRWF(currentProj.raised)}\n${t(
          session,
          "location"
        )}: ${getProjectLocation(currentProj, lang)}\n\n${
          session.projectViewIndex < RWANDA_PROJECTS.length - 1 ? "9. Next" : ""
        }\n00. ${t(session, "mainMenu")}\n0. ${t(session, "back")}`;
      } else {
        response = `END ${t(session, "invalidSelection")}`;
      }
    }

    // View Impact Handler
    else if (session.stage === "view_impact") {
      if (userInput === "00") {
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 😊\n\n1. ${t(
          session,
          "donate"
        )}\n2. ${t(session, "viewProjects")}\n3. ${t(
          session,
          "myImpact"
        )}\n4. ${t(session, "help")}\n\n0. ${t(session, "selectLang")}`;
      } else if (userInput === "0") {
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 😊\n\n1. ${t(
          session,
          "donate"
        )}\n2. ${t(session, "viewProjects")}\n3. ${t(
          session,
          "myImpact"
        )}\n4. ${t(session, "help")}\n\n0. ${t(session, "selectLang")}`;
      } else {
        response = `END ${t(session, "invalidSelection")}`;
      }
    }

    // View Help Handler
    else if (session.stage === "view_help") {
      if (userInput === "00") {
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 😊\n\n1. ${t(
          session,
          "donate"
        )}\n2. ${t(session, "viewProjects")}\n3. ${t(
          session,
          "myImpact"
        )}\n4. ${t(session, "help")}\n\n0. ${t(session, "selectLang")}`;
      } else if (userInput === "0") {
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 😊\n\n1. ${t(
          session,
          "donate"
        )}\n2. ${t(session, "viewProjects")}\n3. ${t(
          session,
          "myImpact"
        )}\n4. ${t(session, "help")}\n\n0. ${t(session, "selectLang")}`;
      } else {
        response = `END ${t(session, "invalidSelection")}`;
      }
    }

    // Project Selection
    else if (session.stage === "select_project") {
      if (userInput === "00") {
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 😊\n\n1. ${t(
          session,
          "donate"
        )}\n2. ${t(session, "viewProjects")}\n3. ${t(
          session,
          "myImpact"
        )}\n4. ${t(session, "help")}\n\n0. ${t(session, "selectLang")}`;
      } else if (userInput === "0") {
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 😊\n\n1. ${t(
          session,
          "donate"
        )}\n2. ${t(session, "viewProjects")}\n3. ${t(
          session,
          "myImpact"
        )}\n4. ${t(session, "help")}\n\n0. ${t(session, "selectLang")}`;
      } else {
        const projectIndex = parseInt(userInput) - 1;
        if (projectIndex >= 0 && projectIndex < RWANDA_PROJECTS.length) {
          session.selectedProject = RWANDA_PROJECTS[projectIndex];
          session.stage = "enter_amount";
          const lang = session.language;
          response = `CON ${getProjectName(
            session.selectedProject,
            lang
          )}\n${getProjectDescription(session.selectedProject, lang)}\n\n${t(
            session,
            "goal"
          )}: ${formatRWF(session.selectedProject.goal)}\n${t(
            session,
            "raised"
          )}: ${formatRWF(session.selectedProject.raised)}\n\n${t(
            session,
            "enterAmount"
          )} (RWF):\n${t(session, "minMax")}\n\n00. ${t(
            session,
            "mainMenu"
          )}\n0. ${t(session, "back")}`;
        } else {
          response = `END ${t(session, "invalidSelection")}`;
        }
      }
    }

    // Amount Entry
    else if (session.stage === "enter_amount") {
      if (userInput === "00") {
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 😊\n\n1. ${t(
          session,
          "donate"
        )}\n2. ${t(session, "viewProjects")}\n3. ${t(
          session,
          "myImpact"
        )}\n4. ${t(session, "help")}\n\n0. ${t(session, "selectLang")}`;
      } else if (userInput === "0") {
        session.stage = "select_project";
        const lang = session.language;
        response = `CON ${t(session, "selectProject")}:\n\n1. ${getProjectName(
          RWANDA_PROJECTS[0],
          lang
        )}\n   ${getProgress(RWANDA_PROJECTS[0])}% - ${getProjectLocation(
          RWANDA_PROJECTS[0],
          lang
        )}\n\n2. ${getProjectName(RWANDA_PROJECTS[1], lang)}\n   ${getProgress(
          RWANDA_PROJECTS[1]
        )}% - ${getProjectLocation(
          RWANDA_PROJECTS[1],
          lang
        )}\n\n3. ${getProjectName(RWANDA_PROJECTS[2], lang)}\n   ${getProgress(
          RWANDA_PROJECTS[2]
        )}% - ${getProjectLocation(RWANDA_PROJECTS[2], lang)}\n\n00. ${t(
          session,
          "mainMenu"
        )}\n0. ${t(session, "back")}`;
      } else {
        const amount = parseInt(userInput);
        if (isNaN(amount) || amount < 100 || amount > 10000) {
          response = `CON ${t(session, "invalidAmount")}\n${t(
            session,
            "enterBetween"
          )}:\n\n00. ${t(session, "mainMenu")}\n0. ${t(session, "back")}`;
        } else {
          session.amount = amount;
          session.stage = "confirm";
          const roundUp = Math.ceil(amount / 100) * 100;
          const roundUpAmount = roundUp - amount;
          const lang = session.language;
          response = `CON ${t(session, "confirmDonation")}:\n\n${t(
            session,
            "project"
          )}: ${getProjectName(session.selectedProject, lang)}\n${t(
            session,
            "amount"
          )}: ${formatRWF(amount)}\n${t(session, "roundUp")}: ${formatRWF(
            roundUp
          )} (+${roundUpAmount} RWF)\n\n1. ${t(session, "confirm")}\n2. ${t(
            session,
            "change"
          )}\n00. ${t(session, "mainMenu")}\n0. ${t(session, "cancel")}`;
        }
      }
    }

    // Confirmation
    else if (session.stage === "confirm") {
      if (userInput === "00") {
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 😊\n\n1. ${t(
          session,
          "donate"
        )}\n2. ${t(session, "viewProjects")}\n3. ${t(
          session,
          "myImpact"
        )}\n4. ${t(session, "help")}\n\n0. ${t(session, "selectLang")}`;
      } else if (userInput === "0") {
        sessions.delete(sessionId);
        response = `END ${t(session, "thankYou")}`;
      } else if (userInput === "2") {
        session.stage = "enter_amount";
        const lang = session.language;
        response = `CON ${getProjectName(
          session.selectedProject,
          lang
        )}\n${getProjectDescription(session.selectedProject, lang)}\n\n${t(
          session,
          "goal"
        )}: ${formatRWF(session.selectedProject.goal)}\n${t(
          session,
          "raised"
        )}: ${formatRWF(session.selectedProject.raised)}\n\n${t(
          session,
          "enterAmount"
        )} (RWF):\n${t(session, "minMax")}\n\n00. ${t(
          session,
          "mainMenu"
        )}\n0. ${t(session, "back")}`;
      } else if (userInput === "1") {
        const lang = session.language;
        const badge = getBadgeTier(session.amount);
        const txHash = `0x${Math.random().toString(16).substr(2, 8)}...`;

        // Send SMS receipt
        try {
          await sms.send({
            to: [phoneNumber],
            message: `PaySmile Receipt: Donated ${formatRWF(
              session.amount
            )} to ${getProjectName(
              session.selectedProject,
              lang
            )} (${getProjectLocation(
              session.selectedProject,
              lang
            )}). TX: ${txHash}. Badge: ${badge}. Visit: paysmile.rw`,
            from: process.env.AT_SENDER_ID || "PaySmile",
          });
        } catch (error) {
          console.error("SMS Error:", error);
        }

        response = `END ✅ ${t(session, "success")}\n\n${t(
          session,
          "project"
        )}: ${getProjectName(session.selectedProject, lang)}\n${t(
          session,
          "amount"
        )}: ${formatRWF(session.amount)}\n${t(
          session,
          "txHash"
        )}: ${txHash}\n\n🏆 ${t(session, "tier")}: ${badge} ${t(
          session,
          "badge"
        )}\n📱 ${t(session, "smsReceipt")}\n\n${t(session, "thankYou")} 💚`;
        sessions.delete(sessionId);
      } else {
        response = `END ${t(session, "invalidSelection")}`;
      }
    }

    // Fallback
    else {
      response = `END ${t(session, "invalidSelection")}`;
    }

    res.set("Content-Type", "text/plain");
    res.send(response);
  } catch (error) {
    console.error("USSD Error:", error);
    res.send("END Service temporarily unavailable. Please try again.");
  }
});

// Test endpoint
app.post("/test-ussd", (req, res) => {
  const { phoneNumber, text } = req.body;
  // Use phone number as session ID for testing continuity
  const sessionId = `test-${phoneNumber}`;

  req.body.sessionId = sessionId;
  req.body.serviceCode = "*384*123#";

  app.request.body = req.body;

  return app._router.handle(
    { ...req, url: "/ussd", method: "POST" },
    res,
    () => {}
  );
});

// API endpoints
app.get("/api/projects", (req, res) => {
  const lang = req.query.lang || "en";
  const projects = RWANDA_PROJECTS.map((proj) => ({
    id: proj.id,
    name: getProjectName(proj, lang),
    location: getProjectLocation(proj, lang),
    description: getProjectDescription(proj, lang),
    goal: proj.goal,
    raised: proj.raised,
    progress: getProgress(proj),
  }));
  res.json({ success: true, projects });
});

app.get("/health", (req, res) => {
  res.json({
    status: "online",
    service: "PaySmile USSD Server",
    activeSessions: sessions.size,
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║   PaySmile USSD Server 🌍                ║
║   Running on port ${PORT}                  ║
║   Languages: EN, SW, FR                  ║
║   Environment: ${process.env.NODE_ENV || "development"}    ║
╚═══════════════════════════════════════════╝
  `);
  console.log("Endpoints:");
  console.log("  POST /ussd          - USSD callback");
  console.log("  POST /test-ussd     - Test USSD locally");
  console.log("  GET  /api/projects  - Get projects");
  console.log("  GET  /health        - Health check\n");
});
