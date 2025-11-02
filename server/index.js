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

// Projects with multilingual support
const RWANDA_PROJECTS = [
  {
    id: 1,
    name: {
      en: "Clean Water - Kigali",
      sw: "Maji Safi - Kigali",
      fr: "Eau Propre - Kigali",
    },
    location: {
      en: "Nyarugenge District",
      sw: "Wilaya ya Nyarugenge",
      fr: "District de Nyarugenge",
    },
    goal: 2500,
    raised: 450,
    description: {
      en: "Water filtration systems",
      sw: "Mifumo ya kuchuja maji",
      fr: "Systèmes de filtration d'eau",
    },
  },
  {
    id: 2,
    name: {
      en: "School Desks - Musanze",
      sw: "Madawati ya Shule - Musanze",
      fr: "Bureaux d'école - Musanze",
    },
    location: {
      en: "Northern Province",
      sw: "Mkoa wa Kaskazini",
      fr: "Province du Nord",
    },
    goal: 1500,
    raised: 320,
    description: {
      en: "200 wooden desks for students",
      sw: "Madawati 200 ya mbao kwa wanafunzi",
      fr: "200 bureaux en bois pour étudiants",
    },
  },
  {
    id: 3,
    name: {
      en: "Solar Lights - Rubavu",
      sw: "Taa za Jua - Rubavu",
      fr: "Lumières Solaires - Rubavu",
    },
    location: {
      en: "Lake Kivu",
      sw: "Ziwa Kivu",
      fr: "Lac Kivu",
    },
    goal: 1000,
    raised: 180,
    description: {
      en: "Solar lanterns for 100 homes",
      sw: "Taa za jua kwa nyumba 100",
      fr: "Lanternes solaires pour 100 maisons",
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
      response = `CON ${LANGUAGES.en.welcome} 🌍\n${LANGUAGES.en.selectLang}:\n\n1. English\n2. Kiswahili\n3. Français`;
    }

    // Language Selection Handler
    else if (session.stage === "language" && !session.language) {
      const langMap = { 1: "en", 2: "sw", 3: "fr" };
      session.language = langMap[userInput] || "en";
      session.stage = "menu";

      response = `CON ${t(session, "welcome")} 🇷🇼\n\n1. ${t(
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
          response = `CON ${LANGUAGES.en.welcome} 🌍\n${LANGUAGES.en.selectLang}:\n\n1. English\n2. Kiswahili\n3. Français`;
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
          )}\n   ${getProgress(RWANDA_PROJECTS[0])}% - ${getProjectLocation(
            RWANDA_PROJECTS[0],
            lang
          )}\n\n2. ${getProjectName(
            RWANDA_PROJECTS[1],
            lang
          )}\n   ${getProgress(RWANDA_PROJECTS[1])}% - ${getProjectLocation(
            RWANDA_PROJECTS[1],
            lang
          )}\n\n3. ${getProjectName(
            RWANDA_PROJECTS[2],
            lang
          )}\n   ${getProgress(RWANDA_PROJECTS[2])}% - ${getProjectLocation(
            RWANDA_PROJECTS[2],
            lang
          )}\n\n00. ${t(session, "mainMenu")}\n0. ${t(session, "back")}`;
          break;

        case "2": // View Projects
          session.stage = "view_projects";
          const lang2 = session.language;
          let projectsList = "";
          RWANDA_PROJECTS.forEach((proj, idx) => {
            projectsList += `\n${idx + 1}. ${getProjectName(
              proj,
              lang2
            )}\n   ${t(session, "goal")}: ${formatRWF(proj.goal)}\n   ${t(
              session,
              "raised"
            )}: ${formatRWF(proj.raised)}\n   ${t(
              session,
              "location"
            )}: ${getProjectLocation(proj, lang2)}\n`;
          });
          response = `CON ${t(
            session,
            "viewProjects"
          )}:${projectsList}\n\n00. ${t(session, "mainMenu")}\n0. ${t(
            session,
            "back"
          )}`;
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
        response = `CON ${t(session, "welcome")} 🇷🇼\n\n1. ${t(
          session,
          "donate"
        )}\n2. ${t(session, "viewProjects")}\n3. ${t(
          session,
          "myImpact"
        )}\n4. ${t(session, "help")}\n\n0. ${t(session, "selectLang")}`;
      } else if (userInput === "0") {
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 🇷🇼\n\n1. ${t(
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

    // View Impact Handler
    else if (session.stage === "view_impact") {
      if (userInput === "00") {
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 🇷🇼\n\n1. ${t(
          session,
          "donate"
        )}\n2. ${t(session, "viewProjects")}\n3. ${t(
          session,
          "myImpact"
        )}\n4. ${t(session, "help")}\n\n0. ${t(session, "selectLang")}`;
      } else if (userInput === "0") {
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 🇷🇼\n\n1. ${t(
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
        response = `CON ${t(session, "welcome")} 🇷🇼\n\n1. ${t(
          session,
          "donate"
        )}\n2. ${t(session, "viewProjects")}\n3. ${t(
          session,
          "myImpact"
        )}\n4. ${t(session, "help")}\n\n0. ${t(session, "selectLang")}`;
      } else if (userInput === "0") {
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 🇷🇼\n\n1. ${t(
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
        response = `CON ${t(session, "welcome")} 🇷🇼\n\n1. ${t(
          session,
          "donate"
        )}\n2. ${t(session, "viewProjects")}\n3. ${t(
          session,
          "myImpact"
        )}\n4. ${t(session, "help")}\n\n0. ${t(session, "selectLang")}`;
      } else if (userInput === "0") {
        session.stage = "menu";
        response = `CON ${t(session, "welcome")} 🇷🇼\n\n1. ${t(
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
        response = `CON ${t(session, "welcome")} 🇷🇼\n\n1. ${t(
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
        response = `CON ${t(session, "welcome")} 🇷🇼\n\n1. ${t(
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
