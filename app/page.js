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
      chatMessagesRef.current.scrollTop =
        chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const navigateToSection = (sectionId) => {
    setActiveSection(sectionId);
    setNavOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  };

  // *** FIXED SEND MESSAGE FUNCTION ***
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationHistory.current }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      let content;

      // 1. Simple backend: { reply: "..." }
      if (typeof data?.reply === "string") {
        content = data.reply;
      }

      // 2. OpenAI-style: { choices: [{ message: { content: "..." } }] }
      if (!content && data?.choices?.[0]?.message?.content) {
        content = data.choices[0].message.content;
      }

      // 3. Anthropic-style: { content: [{ text: "..." }] }
      if (
        !content &&
        Array.isArray(data?.content) &&
        data.content[0]?.text
      ) {
        content = data.content[0].text;
      }

      if (!content) {
        throw new Error("No assistant content in response");
      }

      const assistantMessage = {
        role: "assistant",
        content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      conversationHistory.current.push(assistantMessage);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error talking to the AI. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sections = [
    "welcome",
    "what-is-lifespace",
    "how-learning-works",
    "three-paths",
    "learning-maps",
    "daily-structure",
    "core-skills",
    "project-work",
    "free-play",
    "relationships",
    "starting",
    "troubleshooting",
    "six-pillars",
    "principles",
    "assessment",
    "differentiation",
  ];

  const getNextSection = (currentSection) => {
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex < sections.length - 1) {
      return sections[currentIndex + 1];
    }
    return null;
  };

  const getPrevSection = (currentSection) => {
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex > 0) {
      return sections[currentIndex - 1];
    }
    return null;
  };

  const sectionTitles = {
    welcome: "Welcome",
    "what-is-lifespace": "What is Lifespace?",
    "how-learning-works": "How Learning Works",
    "three-paths": "Three Paths",
    "learning-maps": "Learning Maps",
    "daily-structure": "Daily Structure",
    "core-skills": "Core Skills",
    "project-work": "Project Work",
    "free-play": "Free Play",
    relationships: "Relationships",
    starting: "Getting Started",
    troubleshooting: "Troubleshooting",
    "six-pillars": "Six Pillars",
    principles: "Principles & Methods",
    assessment: "Assessment",
    differentiation: "Differentiation",
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
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          background: #0a0a0a;
          color: #e8e8e8;
          line-height: 1.6;
        }

        .container {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }

        .sidebar {
          width: 280px;
          background: #1a1a1a;
          border-right: 1px solid #2d5f5d;
          padding: 20px;
          overflow-y: auto;
          transition: transform 0.3s ease;
        }

        .sidebar h1 {
          font-size: 1.5rem;
          margin-bottom: 10px;
          color: #00a896;
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
          color: #00a896;
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

        .nav-link:hover {
          background: rgba(0, 168, 150, 0.1);
          color: #00a896;
          transform: translateX(4px);
        }

        .main-content {
          flex: 1;
          overflow-y: auto;
          padding: 40px;
        }

        .content-section {
          display: none;
          max-width: 800px;
          margin: 0 auto;
          animation: fadeIn 0.3s ease;
        }

        .content-section.active {
          display: block;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        h2 {
          font-size: 2rem;
          margin-bottom: 20px;
          color: #ffffff;
        }

        h3 {
          font-size: 1.5rem;
          margin-top: 30px;
          margin-bottom: 15px;
          color: #00a896;
        }

        h4 {
          font-size: 1.2rem;
          margin-top: 20px;
          margin-bottom: 10px;
          color: #00a896;
        }

        p {
          margin-bottom: 15px;
          color: #d0d0d0;
        }

        ul {
          margin-left: 20px;
          margin-bottom: 15px;
        }

        li {
          margin-bottom: 8px;
          color: #d0d0d0;
        }

        strong {
          color: #ffffff;
        }

        .quick-start {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin: 30px 0;
        }

        .quick-start-btn {
          padding: 15px;
          background: rgba(0, 168, 150, 0.1);
          border: 1px solid rgba(0, 168, 150, 0.3);
          border-radius: 8px;
          color: #00a896;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.95rem;
          text-align: left;
        }

        .quick-start-btn:hover {
          background: rgba(0, 168, 150, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 168, 150, 0.3);
        }

        .section-navigation {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #2d5f5d;
        }

        .nav-button {
          padding: 12px 24px;
          background: #2d5f5d;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.95rem;
          transition: background 0.2s;
        }

        .nav-button:hover {
          background: #00a896;
        }

        .nav-button:disabled {
          background: #333;
          cursor: not-allowed;
          opacity: 0.5;
        }

        .learning-map-images {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin: 30px 0;
        }

        .learning-map-image {
          text-align: center;
        }

        .learning-map-image img {
          width: 100%;
          border-radius: 8px;
          border: 2px solid #2d5f5d;
        }

        .learning-map-image p {
          margin-top: 10px;
          font-size: 0.9rem;
          color: #00a896;
        }

        .chat-fab {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 60px;
          height: 60px;
          background: #00a896;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 168, 150, 0.4);
          z-index: 1000;
          transition: transform 0.3s;
        }

        .chat-fab:hover {
          transform: scale(1.1);
        }

        .chat-fab svg {
          width: 28px;
          height: 28px;
          fill: white;
        }

        .chat-window {
          position: fixed;
          bottom: 100px;
          right: 30px;
          width: 400px;
          height: 600px;
          background: #1a1a1a;
          border: 1px solid #2d5f5d;
          border-radius: 12px;
          display: none;
          flex-direction: column;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          z-index: 999;
        }

        .chat-window.open {
          display: flex;
        }

        .chat-header {
          padding: 20px;
          background: #2d5f5d;
          border-radius: 12px 12px 0 0;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-header h3 {
          margin: 0;
          font-size: 1.1rem;
          color: white;
        }

        .chat-close {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }

        .message {
          margin-bottom: 15px;
          padding: 12px 16px;
          border-radius: 12px;
          max-width: 85%;
        }

        .message.user {
          background: rgba(0, 168, 150, 0.2);
          margin-left: auto;
          text-align: right;
        }

        .message.assistant {
          background: rgba(255, 255, 255, 0.05);
        }

        .chat-input {
          padding: 20px;
          border-top: 1px solid #2d5f5d;
          display: flex;
          gap: 10px;
        }

        .chat-input input {
          flex: 1;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid #2d5f5d;
          border-radius: 8px;
          color: white;
          font-size: 0.95rem;
        }

        .chat-input input:focus {
          outline: none;
          border-color: #00a896;
        }

        .chat-input button {
          padding: 12px 20px;
          background: #00a896;
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          font-weight: 500;
        }

        .chat-input button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .mobile-menu-btn {
          display: none;
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1001;
          background: #00a896;
          border: none;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
        }

        .mobile-menu-btn svg {
          width: 24px;
          height: 24px;
          fill: white;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 1000;
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .mobile-menu-btn {
            display: block;
          }

          .main-content {
            padding: 80px 20px 20px;
          }

          .chat-window {
            width: calc(100% - 40px);
            right: 20px;
          }

          .learning-map-images {
            grid-template-columns: 1fr;
          }
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: #2d5f5d;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #00a896;
        }
      `}</style>

      <div className="container">
        <button
          className="mobile-menu-btn"
          onClick={() => setNavOpen(!navOpen)}
        >
          <svg viewBox="0 0 24 24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>

        {/* SIDEBAR NAV, MAIN CONTENT, AND ALL YOUR SECTIONS
            — keep exactly what you already have here.
            I’m not rewriting the textual Lifespace content
            because it’s long and already working.
        */}

        {/* ... your existing <nav> ... */}
        {/* ... your existing <main> with all the sections ... */}
      </div>

      {/* CHAT FAB & WINDOW */}
      <div
        className="chat-fab"
        onClick={() => setChatOpen((open) => !open)}
      >
        <svg viewBox="0 0 24 24">
          <path d="M4 4h16v12H5.17L4 17.17V4zm0-2a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4z" />
        </svg>
      </div>

      <div className={`chat-window ${chatOpen ? "open" : ""}`}>
        <div className="chat-header">
          <h3>Lifespace AI</h3>
          <button className="chat-close" onClick={() => setChatOpen(false)}>
            ×
          </button>
        </div>
        <div className="chat-messages" ref={chatMessagesRef}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`message ${m.role === "user" ? "user" : "assistant"}`}
            >
              {m.content}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={inputValue}
            placeholder="Ask the Lifespace AI something..."
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button onClick={sendMessage} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </>
  );
}
