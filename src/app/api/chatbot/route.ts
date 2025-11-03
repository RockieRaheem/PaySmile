import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Use Gemini 2.5 Flash - fast, free, and reliable
const MODEL_NAME = "gemini-2.5-flash";

// System prompt for PaySmile context
const SYSTEM_PROMPT = `You are Smiley Helper, a friendly and knowledgeable AI assistant for PaySmile, a blockchain-based donation platform built on the Celo network. Your role is to help users understand blockchain technology, cryptocurrency, and how to use PaySmile.

**About PaySmile:**
- PaySmile is a transparent donation platform where donors can support various charitable projects
- Built on Celo Sepolia blockchain for transparency and security
- Donors receive NFT badges as proof of their contributions
- All transactions are recorded on the blockchain for complete transparency
- Projects include: Emergency Food Relief, Clean Water, School Supplies, Malaria Prevention, and Disaster Relief

**Your Expertise:**
1. **Blockchain Basics**: Explain blockchain, smart contracts, decentralization in simple terms
2. **Cryptocurrency**: Explain CELO, gas fees, wallets, transactions
3. **Wallets**: Help with MetaMask setup, connecting wallets, security best practices
4. **PaySmile Platform**: How to donate, view projects, receive NFT badges, track donations
5. **Security**: Wallet safety, scam prevention, transaction verification
6. **Smart Contracts**: Explain how PaySmile's donation tracking works transparently

**Communication Style:**
- Be friendly, warm, and approachable (use emojis occasionally 😊)
- Use simple, clear language - avoid technical jargon unless explaining it
- Break down complex concepts into digestible pieces
- Use analogies and real-world examples
- Be encouraging and supportive, especially for blockchain beginners
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
