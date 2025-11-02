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

// Helper functions
function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      stage: "language",
      language: null,
      selectedProject: null,
      amount: null,
      phoneNumber: null,
    });
  }
  return sessions.get(sessionId);
}

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

      response = `CON ${t(session, "welcome")} �\n\n1. ${t(
        session,
        "donate"
      )}\n2. ${t(session, "viewProjects")}\n3. ${t(
        session,
        "myImpact"
      )}\n4. ${t(session, "help")}\n\n0. ${t(session, "selectLang")}`;
    }

    // Main Menu
    else if (session.stage === "menu") {
      switch (userInput) {
        case "0": // Change Language
          session.stage = "language";
          session.language = null;
          response = `CON ${LANGUAGES.en.welcome} 😊\n${LANGUAGES.en.selectLang}:\n\n1. English\n2. Kiswahili\n3. Français`;
          break;

        case "1": // Donate
          session.stage = "select_project";
          const lang = session.language;
          response = `CON ${t(
            session,
            "selectProject"
          )}:\n\n1. ${getProjectName(
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
          )}\n   ${getProgress(
            RWANDA_PROJECTS[3]
          )}% funded\n\n5. ${getProjectName(
            RWANDA_PROJECTS[4],
            lang
          )}\n   ${getProgress(RWANDA_PROJECTS[4])}% funded\n\n00. ${t(
            session,
            "mainMenu"
          )}\n0. ${t(session, "back")}`;
          break;

        case "2": // View Projects
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

        case "3": // My Impact
          session.stage = "view_impact";
          response = `CON ${t(session, "myImpact")}:\n\n${t(
            session,
            "donate"
          )}: 3\n${t(session, "amount")}: 1,500 RWF\n${t(
            session,
            "project"
          )}: 2\n\n${t(session, "badge")}: 🥉 Bronze\n\n${t(
            session,
            "thankYou"
          )}\n\n00. ${t(session, "mainMenu")}\n0. ${t(session, "back")}`;
          break;

        case "4": // Help
          session.stage = "view_help";
          response = `CON PaySmile - ${t(
            session,
            "help"
          )}\n\n📱 Mobile Money (MTN/Airtel)\n💰 Min: 100 RWF | Max: 10,000 RWF\n\n🎁 ${t(
            session,
            "badge"
          )}:\n- Bronze: 100+ RWF\n- Silver: 1,000+ RWF\n- Gold: 10,000+ RWF\n\n📞 +250788123456\n\n00. ${t(
            session,
            "mainMenu"
          )}\n0. ${t(session, "back")}`;
          break;

        default:
          response = `END ${t(session, "invalidSelection")}`;
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
