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

// In-memory session storage (use Redis in production)
const sessions = new Map();

// Rwanda projects for USSD
const RWANDA_PROJECTS = [
  {
    id: 1,
    name: "Clean Water - Kigali",
    location: "Nyarugenge District",
    goal: 2500,
    raised: 450,
    description: "Water filtration systems",
  },
  {
    id: 2,
    name: "School Desks - Musanze",
    location: "Northern Province",
    goal: 1500,
    raised: 320,
    description: "200 wooden desks",
  },
  {
    id: 3,
    name: "Solar Lights - Rubavu",
    location: "Lake Kivu",
    goal: 1000,
    raised: 180,
    description: "Solar lanterns for 100 homes",
  },
];

// Helper function to get or create session
function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      stage: "initial",
      selectedProject: null,
      amount: null,
      phoneNumber: null,
    });
  }
  return sessions.get(sessionId);
}

// Helper function to format currency
function formatRWF(amount) {
  return `${amount.toLocaleString()} RWF`;
}

// Helper function to calculate project progress
function getProgress(project) {
  return Math.round((project.raised / project.goal) * 100);
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
    const inputArray = text.split("*");

    // Main Menu (Initial State)
    if (text === "") {
      session.stage = "menu";
      response = `CON Murakaza neza kuri PaySmile 🇷🇼
1. Tanga Impano (Donate)
2. Reba Imishinga (View Projects)
3. Ingaruka Zanjye (My Impact)
4. Ubufasha (Help)`;
    }

    // Main Menu Selection
    else if (session.stage === "menu" || inputArray.length === 1) {
      switch (userInput) {
        case "1": // Donate
          session.stage = "select_project";
          response = `CON Hitamo Umushinga (Select Project):
1. ${RWANDA_PROJECTS[0].name}
   ${getProgress(RWANDA_PROJECTS[0])}% - ${RWANDA_PROJECTS[0].location}
2. ${RWANDA_PROJECTS[1].name}
   ${getProgress(RWANDA_PROJECTS[1])}% - ${RWANDA_PROJECTS[1].location}
3. ${RWANDA_PROJECTS[2].name}
   ${getProgress(RWANDA_PROJECTS[2])}% - ${RWANDA_PROJECTS[2].location}
0. Gusubira (Back)`;
          break;

        case "2": // View Projects
          response = `END Imishinga ya PaySmile:

1. ${RWANDA_PROJECTS[0].name}
   Intego: ${formatRWF(RWANDA_PROJECTS[0].goal)}
   Byakusanyijwe: ${formatRWF(RWANDA_PROJECTS[0].raised)}
   Aho iherereye: ${RWANDA_PROJECTS[0].location}

2. ${RWANDA_PROJECTS[1].name}
   Intego: ${formatRWF(RWANDA_PROJECTS[1].goal)}
   Byakusanyijwe: ${formatRWF(RWANDA_PROJECTS[1].raised)}
   Aho iherereye: ${RWANDA_PROJECTS[1].location}

3. ${RWANDA_PROJECTS[2].name}
   Intego: ${formatRWF(RWANDA_PROJECTS[2].goal)}
   Byakusanyijwe: ${formatRWF(RWANDA_PROJECTS[2].raised)}
   Aho iherereye: ${RWANDA_PROJECTS[2].location}

Kanda *384*123# gutanga impano`;
          break;

        case "3": // My Impact
          response = `END Ingaruka Zawe:

Impano Zawe: 3
Amafaranga Yose: 1,500 RWF
Imishinga Wafashije: 2

Icyiciro: 🥉 Bronze Badge

Murakoze kubera impinduka yawe!
Kanda *384*123# gukomeza.`;
          break;

        case "4": // Help
          response = `END PaySmile - Ubufasha

📱 Gukoresha:
1. Hitamo "1" gutanga impano
2. Hitamo umushinga
3. Injiza amafaranga (RWF)
4. Emeza impano yawe

💰 Uburyo bwo Kwishyura:
- Mobile Money (MTN/Airtel)
- Min: 100 RWF
- Max: 10,000 RWF

🎁 Ibihembo:
- Bronze: 100+ RWF
- Silver: 1,000+ RWF
- Gold: 10,000+ RWF

📞 Ikibazo? Hamagara: 0788-123-456
📧 Email: support@paysmile.rw`;
          break;

        default:
          response = `END Ihitamo ridakwiye. Kanda *384*123# gusubira.`;
      }
    }

    // Project Selection
    else if (session.stage === "select_project") {
      if (userInput === "0") {
        session.stage = "menu";
        response = `CON Murakaza neza kuri PaySmile 🇷🇼
1. Tanga Impano (Donate)
2. Reba Imishinga (View Projects)
3. Ingaruka Zanjye (My Impact)
4. Ubufasha (Help)`;
      } else {
        const projectIndex = parseInt(userInput) - 1;
        if (projectIndex >= 0 && projectIndex < RWANDA_PROJECTS.length) {
          session.selectedProject = RWANDA_PROJECTS[projectIndex];
          session.stage = "enter_amount";
          response = `CON ${session.selectedProject.name}
${session.selectedProject.description}

Intego: ${formatRWF(session.selectedProject.goal)}
Byakusanyijwe: ${formatRWF(session.selectedProject.raised)}
Aho: ${session.selectedProject.location}

Injiza amafaranga (RWF):
(Min: 100, Max: 10,000)`;
        } else {
          response = `END Ihitamo ridakwiye. Kanda *384*123# gusubira.`;
        }
      }
    }

    // Amount Entry
    else if (session.stage === "enter_amount") {
      const amount = parseInt(userInput);

      if (isNaN(amount) || amount < 100 || amount > 10000) {
        response = `CON Amafaranga adakwiye!
Injiza hagati ya 100-10,000 RWF:`;
      } else {
        session.amount = amount;
        session.stage = "confirm";

        // Calculate round-up
        const roundUpAmount = Math.ceil(amount / 100) * 100;
        const spareChange = roundUpAmount - amount;

        response = `CON Emeza Impano:

Umushinga: ${session.selectedProject.name}
Amafaranga: ${formatRWF(amount)}
${
  spareChange > 0
    ? `Kuzuza: ${formatRWF(roundUpAmount)} (+${formatRWF(spareChange)})`
    : ""
}

1. Emeza Impano (Confirm)
2. Hindura Amafaranga (Change)
0. Hagarika (Cancel)`;
      }
    }

    // Confirmation
    else if (session.stage === "confirm") {
      switch (userInput) {
        case "1": // Confirm
          session.stage = "processing";

          // Send SMS receipt
          await sendSMSReceipt(session);

          // Process donation (simulate blockchain transaction)
          const txHash = `0x${Math.random().toString(36).substring(2, 15)}`;

          response = `END ✅ Impano Yatanzwe Neza!

Umushinga: ${session.selectedProject.name}
Amafaranga: ${formatRWF(session.amount)}

TX Hash: ${txHash.substring(0, 10)}...

🏆 Icyiciro: Bronze Badge
📱 SMS receipt yoherejwe

Murakoze cyane! 💚
Kanda *384*123# gukomeza.`;

          // Clear session
          sessions.delete(sessionId);
          break;

        case "2": // Change amount
          session.stage = "enter_amount";
          response = `CON Injiza amafaranga gishya (RWF):
(Min: 100, Max: 10,000)`;
          break;

        case "0": // Cancel
          response = `END Impano yahagaritswe.
Murakoze! Kanda *384*123# kugerageza.`;
          sessions.delete(sessionId);
          break;

        default:
          response = `END Ihitamo ridakwiye. Kanda *384*123# gusubira.`;
          sessions.delete(sessionId);
      }
    }

    // Unknown stage
    else {
      response = `END Ikosa ryabaye. Kanda *384*123# gutangira.`;
      sessions.delete(sessionId);
    }

    // Log response
    console.log(`USSD Response: ${response}`);

    // Send response
    res.set("Content-Type", "text/plain");
    res.send(response);
  } catch (error) {
    console.error("USSD Error:", error);
    res.set("Content-Type", "text/plain");
    res.send("END Ikosa ryabaye. Gerageza nyuma.");
  }
});

// Helper function to send SMS receipt
async function sendSMSReceipt(session) {
  try {
    const message = `PaySmile Receipt:
Donated ${session.amount} RWF to ${session.selectedProject.name}
Location: ${session.selectedProject.location}
Badge: Bronze 🥉
Thank you! Murakoze!
www.paysmile.rw`;

    const result = await sms.send({
      to: [session.phoneNumber],
      message: message,
      from: process.env.AT_SENDER_ID || "PaySmile",
    });

    console.log("SMS sent:", result);
    return result;
  } catch (error) {
    console.error("SMS Error:", error);
    return null;
  }
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "online",
    service: "PaySmile USSD Server",
    activeSessions: sessions.size,
    timestamp: new Date().toISOString(),
  });
});

// Test endpoint to simulate USSD
app.post("/test-ussd", (req, res) => {
  const { phoneNumber, text } = req.body;
  const testSessionId = `test_${Date.now()}`;

  req.body.sessionId = testSessionId;
  req.body.serviceCode = "*384*123#";

  // Forward to USSD handler
  req.url = "/ussd";
  app.handle(req, res);
});

// API endpoint to get projects (for web app)
app.get("/api/projects", (req, res) => {
  res.json({
    success: true,
    projects: RWANDA_PROJECTS,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║   PaySmile USSD Server 🇷🇼               ║
║   Running on port ${PORT}                  ║
║   USSD Code: *384*123#                    ║
║   Environment: ${process.env.NODE_ENV}    ║
╚═══════════════════════════════════════════╝
  `);
  console.log(`\nEndpoints:`);
  console.log(`  POST /ussd          - USSD callback`);
  console.log(`  POST /test-ussd     - Test USSD locally`);
  console.log(`  GET  /api/projects  - Get Rwanda projects`);
  console.log(`  GET  /health        - Health check`);
  console.log(
    `\nTest USSD: curl -X POST http://localhost:${PORT}/test-ussd -H "Content-Type: application/json" -d '{"phoneNumber": "+250788123456", "text": ""}'\n`
  );
});

module.exports = app;
