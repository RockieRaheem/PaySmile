import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Use Gemini 2.5 Flash - fast, free, and reliable
const MODEL_NAME = "gemini-2.5-flash";

// System prompt for PaySmile context
const SYSTEM_PROMPT = `You are Smiley Helper, a friendly and knowledgeable AI assistant for PaySmile, a hybrid donation platform that combines blockchain transparency with traditional payment methods.

**About PaySmile:**
- PaySmile accepts BOTH traditional money (Mobile Money, Cards) AND cryptocurrency
- Built on Celo Sepolia blockchain for transparency and security
- **NO WALLET NEEDED**: Users can donate with Rwandan Francs, USD, or other local currencies via Mobile Money (MTN, Airtel) or credit cards
- For crypto users: Can also donate directly with CELO using MetaMask wallet
- All donations (fiat and crypto) are recorded on blockchain for transparency
- Donors receive NFT badges as proof of their contributions
- Projects include: Emergency Food Relief, Clean Water, School Supplies, Malaria Prevention, and Disaster Relief

**Payment Methods Supported:**
1. **Mobile Money** (MTN, Airtel, Orange) - NO wallet needed
2. **Credit/Debit Cards** (Visa, Mastercard) - NO wallet needed
3. **Cryptocurrency** (CELO) - Requires MetaMask wallet
4. **Bank Transfer** - NO wallet needed

**How Fiat Donations Work:**
- User donates in local currency (RWF, UGX, USD, etc.)
- Payment processed via Flutterwave (secure African payment gateway)
- PaySmile converts to CELO cryptocurrency behind the scenes
- Donation goes to specific project's smart contract
- User receives email receipt and can track on blockchain
- **No blockchain knowledge required!**

**Your Expertise:**
1. **Easy Payment Options**: Emphasize that users DON'T need wallets or crypto knowledge to donate
2. **Mobile Money**: Explain how to donate with MTN Mobile Money, Airtel Money, etc.
3. **Card Payments**: Guide users through credit/debit card donations
4. **Blockchain Benefits**: Explain how blockchain provides transparency even for fiat donations
5. **For Crypto Users**: Still explain CELO, wallets, MetaMask for advanced users
6. **Security**: Payment safety, receipt verification, tracking donations

**Communication Style:**
- Be friendly, warm, and approachable (use emojis occasionally 😊)
- ALWAYS mention that wallets/crypto knowledge are NOT required
- Use simple, clear language - avoid technical jargon unless explaining it
- Break down complex concepts into digestible pieces
- Use analogies and real-world examples
- Be encouraging and supportive
- Keep responses concise (2-3 paragraphs max)
- Ask follow-up questions to help users better

**Important:**
- If you don't know something specific about PaySmile's implementation, acknowledge it
- Always prioritize user safety and security
- Never ask for or handle private keys or sensitive information
- Direct users to official documentation when needed`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured");
      return NextResponse.json(
        {
          response:
            "I apologize, but I'm not properly configured yet. Please add your GEMINI_API_KEY to the .env.local file. You can get a free API key from https://makersuite.google.com/app/apikey",
        },
        { status: 200 }
      );
    }

    // Initialize the model with the updated model name
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Build conversation history
    const history: Message[] = conversationHistory || [];

    // Create chat with history
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [
            {
              text: "Hello! I'm Smiley Helper, your friendly blockchain guide for PaySmile. I'm here to help you understand blockchain, cryptocurrency, and how to use our donation platform. What would you like to know? 😊",
            },
          ],
        },
        ...history
          .filter((msg) => msg.role !== "assistant" || msg.content !== "")
          .map((msg) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          })),
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 500,
      },
    });

    // Send message and get response
    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({
      response: text,
      suggestions: generateSuggestions(message, text),
    });
  } catch (error: any) {
    console.error("Chatbot API error:", error);

    // Handle specific Gemini errors
    if (
      error?.message?.includes("API key") ||
      error?.message?.includes("API_KEY_INVALID")
    ) {
      return NextResponse.json(
        {
          response:
            "I'm having trouble connecting to my AI brain. Please make sure you have a valid GEMINI_API_KEY in your .env.local file. Get one free at https://makersuite.google.com/app/apikey 😅",
        },
        { status: 200 }
      );
    }

    if (
      error?.message?.includes("quota") ||
      error?.message?.includes("limit")
    ) {
      return NextResponse.json(
        {
          response:
            "I'm getting a lot of questions right now! Please try again in a moment. In the meantime, feel free to explore our projects. 🌟",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        response:
          "Oops! Something went wrong on my end. Please try asking your question again. 🔧",
      },
      { status: 200 }
    );
  }
}

// Generate contextual suggestions based on the conversation
function generateSuggestions(
  userMessage: string,
  aiResponse: string
): string[] {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("blockchain")) {
    return [
      "How does PaySmile use blockchain?",
      "What are smart contracts?",
      "Is blockchain secure?",
    ];
  }

  if (lowerMessage.includes("donate") || lowerMessage.includes("donation")) {
    return [
      "How do I make my first donation?",
      "What payment methods do you accept?",
      "Can I see where my donation goes?",
    ];
  }

  if (lowerMessage.includes("nft") || lowerMessage.includes("badge")) {
    return [
      "How do I view my badges?",
      "What are the different badge tiers?",
      "Can I share my badges?",
    ];
  }

  if (lowerMessage.includes("wallet") || lowerMessage.includes("metamask")) {
    return [
      "How do I install MetaMask?",
      "Is my wallet secure?",
      "How do I connect my wallet?",
    ];
  }

  if (lowerMessage.includes("celo") || lowerMessage.includes("crypto")) {
    return ["What is CELO?", "How do I get CELO tokens?", "What are gas fees?"];
  }

  // Default suggestions
  return [
    "Tell me more about PaySmile",
    "How do donations work?",
    "What are the benefits of blockchain donations?",
  ];
}
