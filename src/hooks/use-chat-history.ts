import { useState, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const STORAGE_KEY = "paysmile_chat_history";
const MAX_MESSAGES = 50; // Limit stored messages

export function useChatHistory() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (!isLoaded) return; // Don't save until initial load is complete

    try {
      // Keep only the most recent messages
      const messagesToSave = messages.slice(-MAX_MESSAGES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToSave));
    } catch (error) {
      console.error("Failed to save chat history:", error);
    }
  }, [messages, isLoaded]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    messages,
    setMessages,
    addMessage,
    clearHistory,
    isLoaded,
  };
}
