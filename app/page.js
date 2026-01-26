"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [activeSection, setActiveSection] = useState("welcome");
  const [navOpen, setNavOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your Lifespace Education AI assistant. I have deep knowledge of the framework and can help you with specific questions about implementation, daily structure, handling challenges, and more. What would you like to know?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatMessagesRef = useRef(null);
  const conversationHistory = useRef([]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const navigateToSection = (sectionId) => {
    setActiveSection(sectionId);
    setNavOpen(false);
    window.scrollTo(0, 0);
  };

  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    conversationHistory.current.push(userMessage);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationHistory.current,
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      const assistantMessage = {
        role: "assistant",
        content: data.choices[0].message.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      conversationHistory.current.push(assistantMessage);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: #e0e0e0;
          line-height: 1.6;
        }

        .container {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }

        /* Sidebar Navigation */
        .sidebar {
          width: 280px;
          background: rgba(26, 26, 46, 0.95);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          padding: 20px;
          overflow-y: auto;
          transition: transform 0.3s ease;
        }

        .sidebar h1 {
          font-size: 1.5rem;
          margin-bottom: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sidebar h2 {
          font-size: 0.9rem;
          color: #888;
          margin-bottom: 30px;
          font-weight: normal;
        }

        .nav-section {
          margin-bottom: 25px;
        }

        .nav-section-title {
          font-size: 0.75rem;
          color: #667eea;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .nav-link {
          display: block;
          padding: 8px 12px;
          color: #b0b0b0;
          text-decoration: none;
          border-radius: 6px;
          margin-bottom: 4px;
          transition: all 0.2s;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .nav-
