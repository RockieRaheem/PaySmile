"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatHistory } from "@/hooks/use-chat-history";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "Explain blockchain in simple terms",
  "How do I donate to a project?",
  "What are NFT badges?",
  "Is my donation secure?",
  "What is CELO cryptocurrency?",
  "How do smart contracts work?",
];

const AI_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAUpYNH2nHIZjYqbDdEgVDSVkvTUHFSJ6F56WiL8Q6bEO0e2KFCZEUHs1MujLWJ4YY5CMBzLZq1hgsLKDFDKIcvofcuLRek_EDgFH9GO5moBAJNulXzzYNRubBeAO1X9m33iEA4vTtTmo2pF7tu-Gfc0opyXY41vK3iZ6fqdx2rrzm4V0KG3ccJ11qynnv4JQZYYpGDvcvfHox8Cd1Q68_wgMn-XhKj9_OeqbEdKR9jTYVcA_bT0O8zVPUC6zjC1hZtA1bnnnivhkBi";

export function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary shadow-lg hover:scale-110 transition-transform duration-200"
          aria-label="Open AI Helper Chat"
        >
          <Sparkles className="w-6 h-6 text-[#333333]" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && <AIChatWindow onClose={() => setIsOpen(false)} />}
    </>
  );
}

interface AIChatWindowProps {
  onClose: () => void;
}

function AIChatWindow({ onClose }: AIChatWindowProps) {
  const { messages, setMessages, addMessage, clearHistory, isLoaded } =
    useChatHistory();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message if no history exists
  useEffect(() => {
    if (isLoaded && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content:
            "Hi! I'm Smiley Helper. 😊 I can answer your questions about blockchain and how PaySmile works. What would you like to know?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isLoaded, messages.length, setMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput("");
    setIsLoading(true);

    try {
      // Call AI API
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      addMessage(aiMessage);
    } catch (error) {
      console.error("Chat error:", error);

      // Fallback response if API fails
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or check out our documentation in the Learn More section.",
        timestamp: new Date(),
      };

      addMessage(fallbackMessage);
    } finally {
      setIsLoading(false);
    }
  };  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md h-[600px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <img
            src={AI_AVATAR}
            alt="Smiley Helper"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h2 className="text-lg font-bold">Smiley Helper</h2>
            <p className="text-xs text-muted-foreground">
              AI Blockchain Assistant
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (
                confirm(
                  "Are you sure you want to clear the chat history? This cannot be undone."
                )
              ) {
                clearHistory();
                setMessages([
                  {
                    id: "welcome",
                    role: "assistant",
                    content:
                      "Hi! I'm Smiley Helper. 😊 I can answer your questions about blockchain and how PaySmile works. What would you like to know?",
                    timestamp: new Date(),
                  },
                ]);
              }
            }}
            className="hover:bg-muted"
            title="Clear chat history"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div key={message.id}>
              {message.role === "assistant" ? (
                <div className="flex items-start gap-3">
                  <img
                    src={AI_AVATAR}
                    alt="Smiley Helper"
                    className="w-10 h-10 rounded-full shrink-0"
                  />
                  <div className="flex flex-col gap-2 items-start">
                    <p className="text-xs text-muted-foreground">
                      Smiley Helper
                    </p>
                    <div className="p-3 rounded-lg rounded-tl-none bg-muted text-foreground max-w-xs">
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 justify-end">
                  <div className="flex flex-col gap-2 items-end">
                    <p className="text-xs text-muted-foreground">You</p>
                    <div className="p-3 rounded-lg rounded-tr-none bg-primary text-[#333333] max-w-xs">
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Show suggested questions after welcome message */}
              {message.id === "welcome" && messages.length === 1 && (
                <div className="flex flex-wrap gap-2 justify-start pl-12 mt-4">
                  {SUGGESTED_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="px-4 py-2 text-xs font-medium rounded-full bg-muted text-foreground hover:bg-muted/80 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <img
                src={AI_AVATAR}
                alt="Smiley Helper"
                className="w-10 h-10 rounded-full shrink-0"
              />
              <div className="flex flex-col gap-2 items-start">
                <p className="text-xs text-muted-foreground">
                  Smiley Helper is typing...
                </p>
                <div className="p-3 rounded-lg rounded-tl-none bg-muted text-foreground">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse"
                      style={{ animationDelay: "0s" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 bg-card border-t border-border">
        <div className="flex items-center gap-2 p-1 rounded-full bg-muted">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask a question..."
            className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="rounded-full bg-primary hover:bg-primary/90 text-[#333333] shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
