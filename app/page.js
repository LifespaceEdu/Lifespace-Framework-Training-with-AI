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
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationHistory.current }),
      });

      if (!response.ok) throw new Error("API request failed");

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

        .nav-link:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
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
          color: #667eea;
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
          background: rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(102, 126, 234, 0.3);
          border-radius: 8px;
          color: #667eea;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.95rem;
          text-align: left;
        }

        .quick-start-btn:hover {
          background: rgba(102, 126, 234, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .chat-fab {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
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
          background: rgba(26, 26, 46, 0.98);
          border: 1px solid rgba(255, 255, 255, 0.1);
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          background: rgba(102, 126, 234, 0.2);
          margin-left: auto;
          text-align: right;
        }

        .message.assistant {
          background: rgba(255, 255, 255, 0.05);
        }

        .chat-input {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          gap: 10px;
        }

        .chat-input input {
          flex: 1;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: white;
          font-size: 0.95rem;
        }

        .chat-input input:focus {
          outline: none;
          border-color: #667eea;
        }

        .chat-input button {
          padding: 12px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          background: rgba(102, 126, 234, 0.9);
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
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(102, 126, 234, 0.5);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(102, 126, 234, 0.7);
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

        <nav className={`sidebar ${navOpen ? "open" : ""}`}>
          <h1>Lifespace Education</h1>
          <h2>Lifespace Guide</h2>

          <div className="nav-section">
            <div className="nav-section-title">Getting Started</div>
            <a className="nav-link" onClick={() => navigateToSection("welcome")}>
              Welcome
            </a>
            <a
              className="nav-link"
              onClick={() => navigateToSection("what-is-lifespace")}
            >
              What is Lifespace?
            </a>
            <a
              className="nav-link"
              onClick={() => navigateToSection("how-learning-works")}
            >
              How Learning Works
            </a>
            <a
              className="nav-link"
              onClick={() => navigateToSection("three-paths")}
            >
              Three Paths
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">
              Daily Structure & Learning Maps
            </div>
            <a
              className="nav-link"
              onClick={() => navigateToSection("learning-maps")}
            >
              Learning Maps
            </a>
            <a
              className="nav-link"
              onClick={() => navigateToSection("daily-structure")}
            >
              Daily Structure
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Core Competencies</div>
            <a
              className="nav-link"
              onClick={() => navigateToSection("core-skills")}
            >
              Reading, Writing, Math
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Key Learning Approaches</div>
            <a
              className="nav-link"
              onClick={() => navigateToSection("project-work")}
            >
              Project Work
            </a>
            <a
              className="nav-link"
              onClick={() => navigateToSection("free-play")}
            >
              Free Play
            </a>
            <a
              className="nav-link"
              onClick={() => navigateToSection("relationships")}
            >
              Relationships
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Making It Work</div>
            <a
              className="nav-link"
              onClick={() => navigateToSection("starting")}
            >
              Getting Started
            </a>
            <a
              className="nav-link"
              onClick={() => navigateToSection("troubleshooting")}
            >
              Troubleshooting
            </a>
          </div>

          <div
            className="nav-section"
            style={{
              marginTop: "20px",
              paddingTop: "20px",
              borderTop: "1px solid #333",
            }}
          >
            <div className="nav-section-title">Six Pillars</div>
            <a
              className="nav-link"
              onClick={() => navigateToSection("six-pillars")}
            >
              All Six Pillars
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Principles & Methods</div>
            <a
              className="nav-link"
              onClick={() => navigateToSection("principles")}
            >
              Five Principles
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Assessment</div>
            <a
              className="nav-link"
              onClick={() => navigateToSection("assessment")}
            >
              Assessment Approach
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Differentiation</div>
            <a
              className="nav-link"
              onClick={() => navigateToSection("differentiation")}
            >
              Supporting All Learners
            </a>
          </div>
        </nav>

        <main className="main-content">
          {/* UPDATED WELCOME SECTION */}
          <div
            className={`content-section ${
              activeSection === "welcome" ? "active" : ""
            }`}
          >
            <h2>Lifespace Education</h2>

            <p>Choose a category to explore:</p>

            <h3>Primary Categories</h3>
            <div className="quick-start">
              <button
                className="quick-start-btn"
                onClick={() => navigateToSection("starting")}
              >
                Getting Started
              </button>
              <button
                className="quick-start-btn"
                onClick={() => navigateToSection("daily-structure")}
              >
                Daily Structure &amp; Learning Maps
              </button>
              <button
                className="quick-start-btn"
                onClick={() => navigateToSection("core-skills")}
              >
                Core Competencies
              </button>
              <button
                className="quick-start-btn"
                onClick={() => navigateToSection("project-work")}
              >
                Key Learning Approaches
              </button>
              <button
                className="quick-start-btn"
                onClick={() => navigateToSection("starting")}
              >
                Making It Work
              </button>
            </div>

            <h3>Framework Categories</h3>
            <div className="quick-start">
              <button
                className="quick-start-btn"
                onClick={() => navigateToSection("six-pillars")}
              >
                Six Pillars
              </button>
              <button
                className="quick-start-btn"
                onClick={() => navigateToSection("principles")}
              >
                Principles &amp; Methods
              </button>
              <button
                className="quick-start-btn"
                onClick={() => navigateToSection("assessment")}
              >
                Assessment
              </button>
              <button
                className="quick-start-btn"
                onClick={() => navigateToSection("differentiation")}
              >
                Differentiation
              </button>
            </div>

            <p>
              Have questions? Click the chat button in the bottom right to ask
              the Lifespace AI about implementing this approach for your
              specific situation.
            </p>
          </div>

          {/* ALL OTHER SECTIONS BELOW ARE UNCHANGED */}

          <div
            className={`content-section ${
              activeSection === "what-is-lifespace" ? "active" : ""
            }`}
          >
            <h2>What is Lifespace Education?</h2>
            <p>
              <strong>Lifespace Education</strong> prepares students for
              thriving in uncertain futures by developing adaptable skills over
              fixed knowledge.
            </p>

            <h3>Core Philosophy</h3>
            <p>
              Learning happens everywhere—in projects, play, conversation, and
              daily life. The "lifespace" is the entirety of a student's lived
              experience—all environments, activities, and interactions that
              shape learning.
            </p>

            <p>
              <strong>Students are their own primary teachers.</strong> Adults
              are facilitators who provide structure, resources, and
              guidance—not the sole source of knowledge.
            </p>

            <h3>Key Principles</h3>
            <ul>
              <li>
                <strong>Student Agency:</strong> Meaningful decisions about
                learning within supportive structure
              </li>
              <li>
                <strong>Real-World Relevance:</strong> Authentic contexts,
                problems, and audiences
              </li>
              <li>
                <strong>Integration:</strong> No subject silos—skills applied
                across disciplines
              </li>
              <li>
                <strong>Play & Exploration:</strong> Essential for development
                (1-2 hours daily)
              </li>
              <li>
                <strong>Relationship-Based:</strong> Positive relationships are
                the foundation
              </li>
            </ul>
          </div>

          {/* ... keep all your remaining content-section blocks exactly
              as they currently are in your file ... */}
        </main>
      </div>

      <div
        className={`chat-window ${chatOpen ? "open" : ""}`}
        aria-label="Chat window"
      >
        <div className="chat-header">
          <h3>Lifespace AI Assistant</h3>
          <button
            className="chat-close"
            onClick={() => setChatOpen(false)}
            aria-label="Close chat"
          >
            &times;
          </button>
        </div>

        <div className="chat-messages" ref={chatMessagesRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask a question about Lifespace Education..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} disabled={isLoading}>
            {isLoading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>

      <button
        className="chat-fab"
        onClick={() => setChatOpen((open) => !open)}
        aria-label="Toggle chat"
      >
        <svg viewBox="0 0 24 24">
          <path d="M12 3C7.03 3 3 6.58 3 11c0 1.94.73 3.73 2 5.19V21l3.07-1.64C9.06 19.78 10.48 20 12 20c4.97 0 9-3.58 9-8s-4.03-9-9-9zm-1 10H9v-2h2v2zm4 0h-2v-2h2v2z" />
        </svg>
      </button>
    </>
  );
}
```

Sources
[1] image.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/8c8d5daa-1da1-4b87-8a0f-6b8130167df9/image.jpeg?AWSAccessKeyId=ASIA2F3EMEYE7AY34AVV&Signature=L04czQE4gCaZUlWvEEGmrKACEI0%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJIMEYCIQDkIb6kKcnjRCglGtC6XkNVIBeJ4sbets%2Flpc8wYe9s7gIhAM75j3VMc4%2FCQkrljqEGA20k26DhWqmsYCrTQZFWvTd5KvMECDgQARoMNjk5NzUzMzA5NzA1IgzuHRtugH6%2BfO0kLAUq0ASknIV8kPZEC30P9hPyhJbUgEhQ464GKH1%2Be2p07BvydrQf0VYfAuxjJGtXyUdHHqdb7mJoGv8ZBK5eUGhAts%2B5qG5SLMnBnjj8e80SLMNnf6fTvtXOOMFue6jFqI2%2BRC%2FWdKzrANEFcWIF6vQzmdP126cnBjmIG%2F9%2Fu11P7Dl1CeiDSGfCqjH8gAd1fMWshO0OPOQ1PAjH1gqVeaut97HQMiqiM7r2lPYDM2vttyrAhcewyI%2BkRz4OWr4MoVUilHF8oV%2Bu9qC9A7OILiA89QQgBfU2enmyO5uU6zmlluYmF7cEm7KVTTuMZiZXyeYBgZT0koHbRWrw3SPkkyIEY7vnTvEb1sDDkkpPiZdw%2Fn%2FwXS6h%2FGjDmE5MNc24PsyeDJUeuAYuJ7iGOPw6ihR%2BO6Mx6Xigkpd299EXZnpudu5ruqKQFx6SIyQkTp1VotyiHkzRN7Y%2BB%2Bn6s9za8hys7nC%2FkRp%2BRrEvEp8qyWuBTUFiwvJjM1CstPrHqlxilzEbWJ%2FisNogKhQOKsb5zItiwy%2BQahqJyM1u50OPf%2BkDA56GzPn2fqJCb7i514%2BuWRH9jXJoR6YJmTZDw4HXIjntId9YQvsqwtPXBVcPd23CP0Q87coBLx27XWRiyHm%2BxQzHzJeryh3HMnU3S%2BKICKGwO5Z0TbPqS403XBc6OSVDhWtjmeYKwPC9zWmLrjzwtAtEJZ8CH0RXtBhna1rd7y7NKf1bK6extNqZUPbsY%2BM9FYprXj5p8h1GuAxhC3Rhl482Malx5UGG%2BaqJ%2BUYS59FaEIpQMLun3MsGOpcBH9apDEms6CtzpZ9S5K31b0lFOWZNkNZz2jiFK2%2FmrOKtSLro9lyYKLMk0q3bwA2n21dJLAfX24UItU0ohZOUO4hDqbX%2FmEYzsAQEtecJwzX5UeB3%2F5jiPOPkMQjPLuu5v8ndGsSHgYx%2B9sGE87D53QyV1IVIum4%2FYVKwCwgDnZagemXbHqwTxRvVNi3z%2BTzbq1hkW2nCUQ%3D%3D&Expires=1769414026
[2] image.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/00a8593a-d86d-4230-ac79-1d73b98fa5fd/image.jpeg?AWSAccessKeyId=ASIA2F3EMEYES3NOV2MK&Signature=klLRGensI8M7i1bxgVvqmI50zLc%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJHMEUCIQDxa3uPTizsZ%2BvE3zY4pJH0ncBL5KRid0LhYw4MQbEemQIgI7hA58w2l6Nvkk3vfw7NWbm%2B3cxJotQjRtOLQkvu4OMq8wQIORABGgw2OTk3NTMzMDk3MDUiDL5ik5kxGtu02jLo5SrQBL7FmQRiqnNmqxORO9QCUmYrRan%2F4pvCp8BCEfxE%2FCGG3Yff8b90S3VUYiywY1T2ZWXgUIYDifwTSBHp6FgB4rr7A4%2BWa%2FRXk562Af5HWCmdvrJ0JQQXYwc2BeXs1lnwZqUWTw%2FblLU450F7rUIep%2BakNsvAME37XqrtIb8KroHJGYGzmI8W3CIGrOvB1F5TneiLW6XX%2BxokMtuuxNxdD4i3YnA%2FibQMKI3vRxsiPoq%2BQ4rzv1oy%2FJAHKvK7IiFPehfVLx%2FBujnP%2B3OEaI%2Fids4eYF%2B0mk%2FnpBJ07UgM55WgPE8ajCOfk8FOFp0fc%2BeOCNna1JiIVv2K0lQ77mo566bKWxGec6monBc1FHLSuMnYQZJd8DJJGb%2B99YryF4zsbJcYGjaJbJS3Qciyy9q%2FB7ABHYaZljqiRtklVaYtKVYbEliw61CPXGU8%2F68JZCNmFVe4pZQpTFkBs8ZGHabHxce2i%2FCFM17F9fNgZs9dO2A6gKw2TC1g9sZSc008GRI4xrCIJW%2FTg7mQLbstrk2qwfIky1FnXCOLvshg8y8%2BOWcIc%2BGEPTSBgbUzF5zdsKziiP9wBbeAgc64ioC59uzKa5b9jJlUoO0OmkzvNMrgA56HM2NLOH742g2kQZeH4VQSeveOl5VKmuZ3oo7XoYly%2Fp3pNHr8Au9VCjpX%2B8tZsS4%2Bf9sWBW2Y3KmoF%2FzC5oLvFdY3fVlJDac9oD%2Bnku9eJnNgEPNfIvENZysPWkauBnC9ixQ8iGlsh5HMink8Y5Wqfa1SYemCPgbY9XpDmBWBXscwzq7cywY6mAGi6D1K2FGbn1tEmSrgg0UXF1engDtCmj7hdksKtLZi4MRuhh14%2Fga5bfFuXKWqHpwfQZv6y3s1vJamJQ4iBT3pBUtP4BDtnCdXkTZLORalzB9zUGwkKUJuN4GWt7BBRo7R4y6EGfCdQNcHSXoFCsn9W63bByjf6GptUrBQ35fTncRcGush2JQB9PJKUecxqJT3g3k7AxaAOA%3D%3D&Expires=1769414024
[3] image.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/694dd8ab-55ae-4b26-a4de-ebbb19dade38/image.jpeg?AWSAccessKeyId=ASIA2F3EMEYEVDMO7VWW&Signature=wfLkEhh%2F4QyE0YfprGqHnxpOEEs%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJHMEUCIH8hJxfs70ZtatNlHPSaWvlXtApEw8%2F4HNBZTZUG4sJgAiEAhBVBzewN6GqFUDu2fcL6LNxZ1ozkwpycMo%2FsJzdoiJMq8wQIORABGgw2OTk3NTMzMDk3MDUiDH4H9bvrLyLWLqmz4CrQBOnZ7r2wdQlShfSGaAgXYJcTtfFnOILRIhaH2OQDdDBJ2jnUhFyd8IFgnrSV5f2ypo9YlmkbAocJl8A8XH0QRvBOeM1%2BpGS2Bwz1kCgsKNHU9kDjJUxPaCEl6qGHAjlPR0sbemd1%2B7c6sma9JvM9exz4u0x4dvJHfjAaz%2Fad6u1oMSC%2Fu2tdp7sYUVslWAAt4GVXxkJHvYlFVNViQo6%2FX0PindyCg1Oe8JNeAgb0jrstzT6GOKLwWJIwaisk6KJ0RZC0YdVUrcKkqKUWXo5M1fGMS1scx7hPu9AqELXRwExmH5cR63JMvWM%2FoSoXAY%2BdzqObw2XmBLWBmmrqosCRVUD%2BM1nF26Oi4sFO8vul%2Ba9aD0gF7yqDShKbQqOqwlyvtcJL%2BVumkKSM%2FfMnmW2bMEIMK5IrYLwbEMI68lLlbnbO4HXErXzYBciIfTMENymK7IsCotrX2tkIKGZWVz8sPRmi2eEBgeoFX0M1BL3u42uTLoISATDYC6cPzxaP81tzw9LXW39UVZHsIHcBERN7SVN4WEW%2FVpcyAL1JFMoKy8waBRjJaplVggwY7o9L0Xoksyaca0eHDz77ITS1dRfJY8pxtbNciqZ1qVqRBBQa3xPLSq2xrNSWNWY%2BUeFFWGK2Ka3XwTeMHOR%2F3%2Fe8vM1XxsAg9i%2FhTyV%2BfgwSxQkZJCoL1A3JF5w08NzvIBUk0HzScAdRu45XveFKvEcSOpcLK%2FWXZdhi6IXeqbrJwhRyPe1d%2BCiDPS1J1leAfiNcLRaWKdkF0qI01Jbs3Dlj5OaXlYow6bDcywY6mAGkTgjsDfvzq9uZc6zYXU5ETVL6tQ1%2B2hrk4gXzwY1HkdpRP0h%2FK6FD77cSiK5rjlyB9ZeJYiq68ElahNE8XQNkF8QFAsUhHgMQxi%2BsTXGbvzw1sK%2B56kRVmZPuM8lWog4qfH8ZEuMBo4NssCwhkggTmCWSOnVDlSlcej49R4z16QTSbpF%2FvEZ%2FoL9P0HQG8y%2FnHJFyghGJ5g%3D%3D&Expires=1769414024
[4] image.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/805af9e1-8d11-445a-84d0-201b8562ebb0/image.jpeg?AWSAccessKeyId=ASIA2F3EMEYEWZ3AAVVS&Signature=SIat0jZxthNSL1PAb36IsvCTJ8Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJHMEUCIQCpwuMMlHF41YhgD5ADJjZTAZ4e0nQOVXQNM0jnfZ5kuQIgGiCpbdo%2Ff2b%2BMfCFBHm9lQu9kgRolOXm8DMfT9oUz78q8wQIORABGgw2OTk3NTMzMDk3MDUiDDenDy6qewGKmIQ3EirQBDozRiO5xegtjv78DSwrPbSm%2Fw%2BynJcM6BemJLXrtvbgT9G1%2FeocmUEgkEShZlixocoW0qReMDfWr0AsPbx7p2Pb4ex90YhemvnISXuAspCI1DV4cA1y6eV4f%2F7ECG%2FrprzjGbgen7wubuLbldt5G5IkGADzX08mX5T9%2F%2B7owAJCAKd4mIn0mbWExNTpVym4fTqH1S3edroqdBGV1uIA%2B66QNwQQYO%2FHLXEO4bvHoLiI6rTSZ1cd1L7A%2Bk20nqVL1hrbvrG%2BYmTcBVgraeGvNCxl1Y29bGtBzCz6LnrPElyipMfDEElKfGjSrHE%2BtNbSrCzFa8W7WhAY95ERjcwTkrxYhvEiypJ2MpiH%2FsrelN%2BJLqHQwHKW8DZrH51ZoaKLYlHfRBG2wgO1cLRkn0MUd%2F0hNDv9QK2qVH5d0xWRxF5Vdb44XHRVD%2FBZA0%2BMosgs0wLLPDv5QYHgGr3xqpWeBmL7%2FVbsX0Nms9KXS9%2FCOxJAo%2B7UgHXc0RxExP%2FW1ffbEHAX8Me5fRLnfn1qtGfuqWzJnACvxCHdIrhS3r0Hfs6elvO8%2FYPx41As9ourrrClgXbxOA1YVEpF9o0dS0cB76T8cDufiO2CkD5aSHPcQLij02hljUhdqK0C%2Bx7Fv%2FZ9asYBiR8%2ByVHmmIWIUWJ9rS%2FHpUiv8Ob2dry3y6%2BsRBeaUWPmLvxwGKIfgANDIOf1r%2FOGHzhsHfBwtaRe%2FHuOz%2BaQecZahvD%2FBd%2Fc37vl%2FBEuEFOb7EnWhQXO9cCxheDSBz4wwAnhSgmj0LgSvPVdGk0wvLLcywY6mAHi7PKEDYkpkdrhqAcB%2B38H%2FxnMi27qVMRZIJJDRif4DG9EgDfQm4k1NAOjD%2F3EA0ASnhghF%2Bj0oUXTeW8GQ6SmaPfGmeZc5ladz3jl9Lg2WTxrqaq%2FB%2BILXQ9liZ5llAzBdZYXL8oiumgNzETTEKfW4pEw4sfx5yDWOJ%2FWxcZeHg%2Bn%2B4BKdFPb2%2FnT7V5lMOxPLdAj8SmpnQ%3D%3D&Expires=1769414024
[5] image.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/e40b7e5b-87f3-4b5b-ac2b-5597252c5f2b/image.jpeg?AWSAccessKeyId=ASIA2F3EMEYEVZK5OOSJ&Signature=7U7MGL%2FBBFkRkUuGycl7qKBNzdc%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJHMEUCIAUt5vinvotSEuN%2F%2FAs9Mtx%2FAWUS3ibs0gYswRgie5zwAiEA9tGHv9a0HQbULcGedMZ6LIJV285l7oS7QFGGLZ1TVB0q8wQIORABGgw2OTk3NTMzMDk3MDUiDM2pGLXYrcJL6PMttyrQBDT6l7q54FszHgd%2FV4TOTs4gtp4RRVzWhtU5YebhJhbbWvK8LADA%2Bs6kgc4Z2xEGYfvygQF3Bgxe6rx9vcNqn%2BU3RhIJWxa8iFtWHjV4LQS15ysKqIvwSx%2Fxyf29H2HtDxNnfanTGAuXE8Y9tQ0BmD75Gg29Rw%2BSQHrMWS3%2FkE9zp4U3BPVfB64wqaKBoZrxTJtM5JLzzl%2Bs69eUiaenjc7CVETiDJNIRXQ6Lw5veMbfWVAoOWKL7gNziX3m3birz50tzCHUuU0Rgbi0Xh31Hgkj8dlxFQCsZO1mDokYTOpMWyC8WrdVw21YpS6z%2FjUmkCGBz%2Bq%2F8a%2B6Ufmvj%2BqHdG4JiPN%2Bu1qcAdLpyW56mlN03YzvecNA3Ir5MJcTjZnoxc0oamiLGbwhTPEd8NncxU3kJEEd331JxtNhCFRcduAaEqORrPXWe3soqyqmJw6TAlIwBpTASrZ%2F9Ro9zCyQCyHuz9RPg2Agae1OUAjThLRRl1nHVNJu5SDtIZMX6L0ajKfMkV6QLaweSgcogbXGIfRiGbTEgrrbZQYXWTARIFDgZWpbXU6A1YqSHtXphoqFD1Jk1QarnvQOF1vaAO4OF6KKi2PFziMxOuF2PlVJ%2FBHFTGoiQo5E70ZVJorNgLjLlEQM%2Fg3BZscJQaopE3w%2BgKpgw4RjUYgIEVtztnEDd6yxRubRh75pzat0hkAe7b9coIANoAmX%2FRu9iyWNb32isrEbT%2Ft%2BIwMH%2FYAT%2FqUZbxMNy3Vs4lasdx9X2qhr4MI9fIAk711tflYd3fClbs2XE7Mw367cywY6mAHX%2FHPir1EQ21AFXfQLz6aGZsss%2BceB1c%2FTT0jrn2nnYs2r7oQCWsFQdG2dP8je7StvULgLHXH3PnCG2ELLXVAO45ZIo4sTHI%2Fj6LuaKR5bkQViiMH0p0HJ13uwKkvMWxCRwfj8Ost7aiuMi7OhmKawneF7G9Fi%2FNdtZwNp4%2BMT8xYO8z0Bh3TWXop96GneDdEdVXUMSQSh7w%3D%3D&Expires=1769414024
[6] image.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/506c1e9a-e4f4-415a-97e9-6de06be597f2/image.jpeg?AWSAccessKeyId=ASIA2F3EMEYEXPSQ4KOR&Signature=yEZDWcf4yZuwg%2BxjHpMmWKdvDC0%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJHMEUCIFsHF%2FkAm%2BVECUBJWKRMvBZODtCaVhy%2FV1unZ%2BOIkuO%2FAiEA3Z11VKzVsBJj%2FQFme22HCY9FbHr9Z1JN0m%2Btq2IQVoQq8wQIOBABGgw2OTk3NTMzMDk3MDUiDMyrvnHh5Z8MqxI4iirQBAjxN6cm6xjy1qkv9%2BoZIjY1kkTcFYzYbEM8rWEMMrgv2Wu0Vd%2BHsfdk%2BQ7yJ%2BIKl8KuAdiZ2bNrerDCUEifXUTWahji%2BcigopU14RF3eKf8pW1zvnCEgIpSbwhU3xxjm41M9QEPsbaxq0Z9odCM7L3PCkqgHVxVXdxB%2BJvAnA278UdROQ%2B0wUJvoZAUZCV%2FN2Ck7ISbc9LaRwSE40gf7rO6yxHtijAOyvYTi2Za1YNGkUwUEY4b%2BoX79Ud7OxkN%2BCYFwtKScfu0sxM4yFHI5xLTr3w5T9%2FV4RN02%2FW6MJJkc%2BB9myWGD6INe3rKAU2PuAdPgMlIv0CFNC25rEEF%2BmkVIO1N%2BNvoxNwWCW71WhfAFpBeH9Y2jAjc8TE4DrUgSdjX4lX0XDy9YTMR7I88hOQHCPLJS0Dd3WU5xLvyWpZmsR%2B8b4YxET6dsjleMj1xAvkyO1XSI9%2FXqB11YEuMIMJcQCkLyipnZKaaYoE4i%2BIXvQCJYbCi0tZSU0pGopz%2BKxpx5tFDEbV0baVifctOoo7JIfjYs51kmtxODoAj8rm%2B3RQMFeE4YtiqSBIDmwDE917Y%2BoI7WFcsnnGuJGhBVQx%2BCBQoPbYaQfa%2FfblpnQzaqdpJRk3S4vEtSzlSv3ISzcSKuN3%2BdNI7GLUDixP7zp%2BgCXZyCuevVmLy5aIvcpOrWe0ulBfAsLLqvtb22KSiFGmaqnEYtGEqOGgDuwU5T%2FGEp%2BNZvVEkoolc29Va0xOXxvRrHwRXiJ7mFCluS77xQ0sErOizuUWgiO%2BEZJIFBpUwiqncywY6mAFmown%2FseOJCQgIf1R3KHs63a7q4hngXvq%2BNnxGM8ZZR2Hr1J9rPTMlOepgcFyQonJ5reCyGR4TCkELgTZ1hJJmLDXAo4AfKNrpVmP0KV%2BfDtWt77NDicLRhTjkEq9JIa7xKezg0i0noTBpPTWJV%2BcfwSaetPEcLWrTcsFQt7T2vhGKtNBJNyzxv0XbqNP4%2FH6hZMtS%2F%2BLf3g%3D%3D&Expires=1769414024
[7] image.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/d023df92-33a2-4a91-b5ce-95339bb5ce9f/image.jpeg?AWSAccessKeyId=ASIA2F3EMEYE3HO7KIE5&Signature=ghxr%2Bv88r90DdnfWE8%2FRRx6yjjU%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJGMEQCIAouo%2Fsk1x8%2Fk8BAbYM4leuqidxwi6AD%2FpOlHJtwWncbAiBa08%2FhkHqTLYUBj8faKpg3XWMmPLwUD0XHN61uNd%2F5YyrzBAg5EAEaDDY5OTc1MzMwOTcwNSIMR%2F7kkjhH9oUqP%2Be4KtAE546AmMYwjCBl1hb6wk3JhzDXZ1GV73jd7QIms7evSa6%2BoBh3ZJEXNB2KjFtB9zEGILXqs3I9m6RX%2FlaqBPKg8Oi42YWZi4%2BUtbb3awgswMg9Etv219k9T1qB%2Fb7KF8hTpo9WreM51gRwnzqb0KiExI%2Be9sdcoMu5em9T%2FiNn4W%2B4J5OxIGRE0KuZbRTuMelgyThL5t%2BQy59USV94DvKjpGMEsw9%2BP4J8Q%2B2ThdPgMbSYQhvr4vaIOlEnSnnqosUONaTHovdbVCseFoJgpJRJ9gHAQovrHpgYZdG6xzSnMFI6tLogF%2BEWlsRR%2FOMIZeN%2B1%2FM1lXIcwgcqiPK9bPMGH4nKuKcNWd483c%2Fde0u%2FZmQyXRP0egAYsv94ZU8gnP8sZbrvN%2FDTO50kfaWjdxM69OwYArpofU%2BTCwHdx5Lv6JXba%2FkopGOfdSqPckXUZQG%2FI9PzVyyNIsEqBMZSnk2J44EDp%2FefkLF%2B8q25TIpeh7K%2BbC03aNNfR%2BXBxE3GmIzZeOQgltrdQmTBw6J3JHeQwQacOAnyE1xiUioKdlfop3FBxEAjSEBtQxR5GMTqBwdoic3aKtd6mn7hNR9r0XU%2BgHVwlU8C4gH2ktFsljzXzZ8pRvU0tJCp%2FDsGKZf10oLXADWSdFXEvHj8uKvKAbJ4hvuhmFxACJMfYf1x%2Fvb60GlNOo8ACGlXsbS0Ly%2FMV0YhXzaNkoZLlS%2F37oTt2xaBcRqi7gBv94P2JQseazG25Gt%2F7QPdpLAZEUvK1JC%2FtuhwzXuYOvUEitQk2qPv1rUeVDCnsdzLBjqZAZmJrFnmtV8VnltEedZGhF48fvQc7mm9HzPueT37IRUX6%2FYCpYLpZMILBYFash26BNPWSXjp8yw0eMzH2T03NfK%2F70ILG21Rwb3Skj72wxGUebfxzzuOHXT4xlG7jYCgN%2Bpx%2F5AKq%2Fv8TvAfNRAzodekcCGoXlNj497phauyyaPmdHp%2BHO%2BWronm7HiMC31YM%2FNL0xKX2pXbsw%3D%3D&Expires=1769414024
[8] image.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/fe230f0f-1721-4e85-b033-545785089ac6/image.jpeg?AWSAccessKeyId=ASIA2F3EMEYEZFVUW4XP&Signature=l14Gia1hfKnGwOazvZUE5gvic4k%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJHMEUCIQCtipsgqh1NQIs3s%2BxaCKtCaWWdch9cYFfGAdtUrVNj8wIgEGEOVU7tEYxCqRjxN39gQDeeC58IFdfaGHOzySgi%2FC4q8wQIORABGgw2OTk3NTMzMDk3MDUiDKYShg8LmYPm7NC%2BayrQBMqddAA1ceXAYxs%2FRQIkctcPwyWv0QKRxsrk%2Fny9LFNiQ%2BFmrMwggnLp1gpenisY7ufvP25bBNrCdyioHij5EjP2PHiML7lq4ctBCHVkggGZqP4wxwU%2FvgwUxCYnpE0X53KVMakJE6A19apzT9hgIjkICTs32fPZ%2FzTSTJOHu91eOFv014IqPteO8yThqlFHQqt8LOcb2eKb%2BL2JS81RFsKatmJ8RJ2rTSF2UpC9BeomihpctBsWvdEPPGfbE2xLotSD9RgUf6P5oqdiIPc6mtdpWvHH003iihmEMqthoQXXG1iM6bcw4nqIysnHIP%2FZRjJvX3lfKQaZQ3Or4wAD1vMUP%2FTkuyMXcw29jAp0dUBlJoPfgPzwWC4w5rL57Sy%2BjdXHj3Fkl8hHCb8ph2tHSsAnnAAjYUF%2Bgw%2FB4XVuHK7NExdzZ0CghmvYJ9DfyLCd1ywriqMgHYlv0YnP8n4i438HGKFrtQnPC%2BEB2Ir38DQXBQMATHnKdSWxrGkLXN%2F3etx05pADAQ7nVYvia%2BDBvpDhnBIRsmf9pdveKKub0kscgcMYuWVwq6rHX%2F3Dpk5WixPpa%2BEBu5v7cWHdWd3n1F%2BTlzXINM%2FOsPPu7IQDkZvLovC0hmttPt%2FyDYvTK7aH0R%2FI%2BDF5m8Ryqo3DW%2FhkUU29waMZxer3U1ZSJBM8VMxpHQ9zStD4kMKC7k0mbukACF1zdoiZZ%2FvJYpu9Qu6DzR0MizN%2BTCuIdGefzVjTCwD5AUwc9Os5RXbG8QXQIcDeyjbb%2BbkBemAbW%2F%2FOZ8KgcdIwxLDcywY6mAHsHnR88HPPTKeHnBgopet07zCa0MW705Oe7JV3IcQQ6K3WesA9M9lCSE3N4fwRqKEtPWbSklaVTDfN0sgOBSGqlc0BmbKJZc7qOV1L46qeitUr%2FI4vAPT5JCEAV7eMnLDdFdvPaajMoqPpf1j8WiKyfUskK4w1u4daOvGqVykoe0Lj0Gt9u4VQl7m9E4CUX63fFnxf91v%2FKA%3D%3D&Expires=1769414024
[9] image.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/0b55672f-375e-4332-a28c-62390e396582/image.jpeg?AWSAccessKeyId=ASIA2F3EMEYEUSSXXQAY&Signature=2a%2FWNli9gclItyVlowhcsCd73mk%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJHMEUCIAZ2vtaqXyw08R02mW7DwfgYpzqMRr5Pd8NsDmSaOTxYAiEAlNRaYI0XbRg2tyMf1TGz3u7Y4NSerFmjTD8Iq6rYsZIq8wQIORABGgw2OTk3NTMzMDk3MDUiDL0i0KQ8yXAG4GnMkSrQBLy9QA6ForE5WEhkMOfJapd87vNiZZhAZ8wFUjSS6w25HSHpQatA005DlxqKMYPttWZNsLQbGs3V79LVsKj2CcWr3Q89d1tZ5O8SF9lWAyqSVfdi416MQNz8mrxEAxNLrPEtJAIxAzTW85Xn2sEg9a8OAxeEIAuB802qhqqJG2lpQDVcOvnidYxeFOGDDIpz%2BffrLyuoTNNKbAM0PW1bAtWGcVX6jvJX5o5czocAbIXLNj%2B8g7zjGrYuOwuY2aBUgOGUqwv1EEFr8hAxGFpNDEmNWIvzXTwFs8Y3%2F48NXPJOkXxkC3FF2YGBue%2B5tB4jeL0HGE7Uc%2BFYa6O8ns9I3FLQm6ZizL8iTtt4EnJCggAQmkFcKLA0jfkjv5rihqJhdNFWxvwGSwpYAov89A5RCNOeqAf3od%2FGF1BjmOswaangVtJdYs2ue1jiLHGi5%2BDf9r4LIZrSE28c9k1CkY9dhbO6jbIu7ETs72FL8SU51a3e8dq6JT9HP03Z93vBx8l9k2ANyEVF3uDTFf%2FZ4lG4pAav8xKB1Q3QsxtzUjouSSgK%2B0ygvhrnOvOYUZkz%2BH6a3FVjst3gVd55c8QmngnZ98TuoOuWhCWVQsvMi4l3CE6%2Fq%2FrvEbSbL8xw4KKlPqhbt3JDgdHhFjjpgOtJtWejLavHQELLZkVrdxpgYcTeVe75UljFy9uCgcezaZo4w0kD0V5JvfwUhe3Gm5ZsMGPF4aeFgB6FJtkk2r%2BCxFRGBVRlUJCJhllpAbB2Dy%2F%2B9vGX%2Bw4%2BSJx4vKRKXdM09AYR42kw6K%2FcywY6mAGIoeIP32VoyXXFtn30Zjaj6JOh%2FXzH6hqj7A3P%2BJYzkmEcrm%2F0NPSSzvapAiFoLUM5THt1qmUkwnFCwiIOtRbRLC9Q3fZQMyJXmeKf5T%2BnJNXyl%2FHnnFct%2Fiou2ljG%2Blm%2FhvbISaWFftl%2B%2FeqPiip69KS%2FG493VqnUK9kv54yikYBzwEk%2FabFB0w7K86ePdVNaz63i5%2BFmtg%3D%3D&Expires=1769414024
[10] image.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/698cc76e-43d4-4377-a45e-b41d7e2cc1fb/image.jpeg?AWSAccessKeyId=ASIA2F3EMEYEXLJCYKRM&Signature=ySN7HZzav7YmhF3jG5Z4uE8NGfU%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJIMEYCIQDDTCXD66Cae%2Fk0O%2B2gmLn6gKSk7jheBAqTUQxgcC4KzAIhAMt%2Bh8A4ER5wLOvMhyUqdKbk4wfKhKpJY6HZ%2F3QCXZ1CKvMECDkQARoMNjk5NzUzMzA5NzA1IgxPuodj%2BKYi4dBg1Ckq0AQDJgZBeKStiXHfjxpK9sG4RbIDlYGcCPTKPUV%2FhM4kQyHgvE9akClG4nSOZilb8sikHDBVkVdCWrtKHohaYqiHUcRlbAdn7y2vA5S%2Fp4djNklTi2SjvGeknxzYEtYZU71qY1Wh3nDKzIiZAgvvcuuCxkqQy5fR%2BPTCNaJAhI7G3ab2HM%2FQPMWqnL5caJoH6gc471nqIH%2BNNImlWmfBXkY2PMqJtjCQLZw84ecQQMIJm%2FI2NyWqOk5ueBk92QU4SQmHp3hF%2BX47o4JZih95uuTk2kP3RWcr6tw%2Bq9WV7EzcY3dMSf0B7DNoTKg2alKY7c8m6jkixC1K8U2rzW%2BIJqkPs0CYQOyI5%2BPR8tMOi9ueOhf0h3dYrjuX8OvHGT1dt20zAl4ShrUDovRi8zo7hKpG9apHb2MaIEWyxCVbsWKKg05N1mun9hwPa4yhvj9SUqWLYO0uDMfA5O73ujXoHJsXH5MH%2FJrnc3m3X8Uq%2BPDCeGl1BBFCAoPCC3fpDbU2hGPgvBQKjIeQ%2BHdzKtYYK3rKnbQj4ImAS3lJDw7tcYqrkurMWwDIxxB5zWOhAqTMuW%2Fx%2BLOjvPM%2FfODOwNTzF02jr%2B0RTHSiIUKNlL3eW5pH56UZBC2a0pQ4qwYspsBEW2InI2PlurmaW3izydMjr%2Bd4R%2BHmxw%2FGmFbDQyKCd9QdEuvI0xnKcClnRxu8lAuhH51oQBC1nY7tnq2G6gBPnNrGDd%2FjnnfOOsM%2BPo%2BV%2FGajce7AtzvzNQEwQWpUajZuhoRswH%2BF7sVnsKVZjHokhZabMLmx3MsGOpcB6KJKAz2%2B%2F%2FWvZESDpsbZz3Jb5WXLnyUtyrPf%2FMmbe4hIWw9VxGnDnEGtOeRnoR98a%2B3rUZmHpNfbVD6Kl0834siDIw5rS9GPZ6AMYSORB8eKUp430Lgagm8BMGLgID%2FWEgya4Y9Hkrrv3T9jFzl5blWEFkA9mZqvWjNifXE66rCSKAnQ3IIxCzSXfMcFINcYTYtIKTkJ%2Bw%3D%3D&Expires=1769414025
[11] IMG_9009.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/a1533531-901e-40e5-a3b7-ba64bef2226b/IMG_9009.jpeg?AWSAccessKeyId=ASIA2F3EMEYEXG3CADVL&Signature=9EchlL7w1p6lGsfFAsOowcerICg%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJIMEYCIQDMucG%2BXn5VR%2B0V9H1oiPHXuBhlMx33HWJRbVT9q2Ti3AIhAJU%2B%2FP61vMmvnFcpbjIHO%2BOyfZwxztyiNwckes2TvSOEKvMECDkQARoMNjk5NzUzMzA5NzA1Igwx9cUSlFsOEWZrlY0q0AQZ1KZ7RGV0FW1LgWWh7%2FDhFru0ntms%2BRL6rq%2BfyEQwIhky9Qs4vLmLGWYogxigCxFKyhBPRhum%2FNYZQKjE52pQzWVOQzAn5oHN8SSW4ecvPUqTK9QCI6%2F4oYJBeI7HDPKyiprDCkl%2FttseBr5f53CGoufhLJn2wDZvk0usx1ahJxtafgvTIy4SC1OFFHU82Xp5KjO5NIGgIEaDlZZf%2BJk1zfz8hoDcZYq06qaeh2ZTxDqrBJ4D9JTh3Xqrr7vExtRTmBFEgK2E2G2GlOVUhtkFfwbOpUjaUzEdgTR3uJ5RMdlkWP6hq3TFviTHQrk0v967d%2F%2FCG%2FafyYldvaBzlogcJdoX7cFO%2Fjs5VVMB4fh4Z9%2F54hsuMZelcUk45oEa2tsxuqNnwAR5SUjrzoJRtu6OBbK%2BWmLnZxKRzfQDMoA7aTtLUPvkGgscYbOLMKHLIGJZhZGljRgvuUpwUsjQRhPWH3q0TyA2et%2BI%2FmbdSLUEopFlW8GtpS%2BVJke0kgGwHg3Bg5nFaU7mBuDFjGvHgPuunoMCuWmEk8g4HVUCm2m1cJ66%2B4iJ%2FEcwLy3JNiNNNCi4OYQHKl3egPDp42lBYJ%2FSN5lkVmVB1E6iCU3aojZJxfL3EMi%2FditT21B%2BjNOcD779FSg%2FJVdjSxmvlKZRUMxQt1Yp%2FURYi%2B%2FNOD5ux%2FqrA071UxGl8ssFPulG31tkkIn4ghzGTWJCziDlr6VSuN70yid3kkKAbsOpxn%2Bp28nj7mFuhbaj49NkyAznvHlkqmTHSCmr5XN7P%2F7gzxSXLR73MIqz3MsGOpcBwNEzwj5l3wL1evaYoyPG6OQeN8a6S9sgtEihlP5yJcqEv93VG9WX8eX36iGui1GC8KN2mmpnZtd92hq%2BWY8O3GOw9tQsPulx%2FEHhnxenY7y3MPESqnyQAQVjqw21P0NrmNfIx3i89bXKbQPRf%2F62AFYnyvarR9A5fsJi7h8%2B2WVMm37lfGVVEKO%2FdeemXZmDEhI4tpft5A%3D%3D&Expires=1769414026
[12] image.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/6941b139-3075-4cf5-a861-6ba31222f903/image.jpeg?AWSAccessKeyId=ASIA2F3EMEYE73OMKHLE&Signature=jHHiSEOQf2mOu5A%2Fc0luBgk1dxk%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJGMEQCID4MMnMCnkzNKDirk%2FnPVZR1eh19vpQaRa7NcLOcjqLPAiBymAUNnuw76X4JA%2B4aenjmMG6SK9R%2BS75ZCCOEN64RJyrzBAg5EAEaDDY5OTc1MzMwOTcwNSIM22nud6FyXYy%2FclK4KtAE4NEIXJughlbEmE38lE22AtEgcw8J86fclOwVY6XbRkrLEQjKJoI3UhTrc1yqu%2FVeIf5Hw2mjRi1l1djwxoNeUwdIeTPnVAxr8GDEQO%2FajS1P8eR7x2sLGQVnlUrBwAgw66Sw%2BbmUegvjBqufx8HRwffRb3%2BE90jwsDoJI5quGuVOqPBUYlIzzPxK2OLyORPZXS6yrQAuFpAIAC55OqxbjrIYX82420cbENMUIguV3lFXfKYcgpBO0gwninFm9sYvODLgWQsX06fr37JBweV5qvxeyS3ntWn145IoLfMt1aE9he4%2B5EHv%2FHLA8EkH9n0f3SyuVYFbDbiZIhghJplvzei8jl5Kcwpz1jZyQCyQgv51AEz8NtXiK5OPdqdqsSsb2Mpq9Ia5wsZe9McFwcX0IMGHeLwWVctVLma7bU14RQXlsoTYI%2BFULC96PTICwgc%2BQ9iuyfqAhbV06WrYelh023fm5%2F7LI3oaws6jrdzgf6L%2FGCizzQOIK1xnwXiVyTHWIQvtWqLHkeTKIZK%2FtMCBmrlZ0RGYtEuovIdvUfjLycQXPZwe17AabpCkNHMBv8kZkRDLUJvy27MviSdoK5XhC8M9JhZK3LS9Tsen3tzsnZ7gdrRofYjG7G3%2BphId7yFEq%2FZHkghkTMsB03G5%2F6AwFB8YxQL%2BxytLpd5G6rw%2BENStz9F0ykm7BI4MXQO324p8W4vP94fREbJyTofxbK8cgXg719yy%2FEJeHk1whbMzIy%2Fh6x8g%2Fm7bazREDhxP%2BiZCrRhaJB6PURs7n%2BEtVDxOTzDKrtzLBjqZAazAjpxkgSMY02YjXNDjrt9OvEEJb64zoRltdg06sW%2F3PsZZ%2Fqo%2FxcJboO8811TGSuePnDPn9ak7MANbbA4bF2NIagOCISfeOlLO0zIGOdj8Nf6fM%2ByItCBVpJ3JgwsZf4ngZ3TL3wkD3VkanFTcAgr7qStTB8PLxwgJIdruu2QZ6T34atFJ8wX3WX64jcFBed64yU8GG4CAEg%3D%3D&Expires=1769414026
[13] IMG_9010.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/3face873-6381-4f97-9ec4-1b907e5808ac/IMG_9010.jpeg?AWSAccessKeyId=ASIA2F3EMEYE6CMMASEX&Signature=pQ%2FVRlknpAjS0QcDG4rPm6QzC4c%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJHMEUCIHa0FrNwPf0aySm%2BiQRyE%2FI9uqbcbO8YFL5hwECW3fY5AiEA7Uar1PbkhFxcxPryBG19LjFlTZc6pICvqk5UqG0cKvQq8wQIORABGgw2OTk3NTMzMDk3MDUiDIXCRBg1KnKo23I3eSrQBFxQcTfZfiAEZpyT0Tr6%2BG2A7RDSkVJkb52gP6k3RJGUH4xENoK2qWamH%2Bo6%2BFFBwJUZRwxd75OkCWSxIQidGoaDrn1%2Bwe%2FdUgmgwk9cLjurvPXRZCndTu%2Bi3M22wQkFPRxcrNUfl%2B4fBldmr%2BVHPTBtIuzjJCM0aL14pxb%2FnWUoCAd8Zm5%2FcWczVDV6RSfvKXZksX6UhUAg0%2F0%2BG8s31AVNDp%2BG%2FdysNes3wGTYV%2F2diSe5VxHuvsxOlT8DSfLodSegoFc0VPeTn6Z%2FffOsnmdzjK8hnGuVw2Y46ELqvS%2BuRlkOG49aNmIJ64s5RNUjQ9NGfNsAO1rNPIPimaazaEAcZDbSkPxN7VzB8noJG%2FgkxFqcwu350xzrbb5WWxXsIGFcwh9WzKXzF2mXrhY2MYN6BFE2kfGRoJrCSV1y0Z03D91mfO6AiPLjnYSoC9N2SBR65VExyf28y1PV1IQw%2ByiAcD5I1W0LE%2BsIgGONvmn1k%2F5CGP%2FBlirhj4Z7qqVzI1iIwyn%2BGgqnQ2ANwsS06XiA6y6x%2FcfK6ZZeHte0ZxlCgz4Ym%2B4%2Beva86S7CLWB6lXzOWjdEVIc%2BZ53lhws756ZX7EAqxM5EACBRzvxn6iOnyeDNCvxs7lowEpj64nO7m68FvpCt2A%2B5eKOyTDVYtQlxkFbQtEXkFHI3HySPrxHJBJ31lbUssNztf%2Bpg5gEucitctlYJoTqVY3gES3QlHR2Ap%2Fkcrb6gckaY92VuoTg3l8StoLekCOUlP%2BJtMLDylTLfvItit%2FV3dH30vU0VbIkwya7cywY6mAHf3EsmGEG5voKCmZW5AYrH9O5r3DThSusKc9ei8dBDWQQafCKVn8nKekfxp4t6CfMZnmZmisaus70a6%2F4srKC6%2Fg0akESSJbclCCqQKmU0%2B8WwPTQXcuG7yB6A8EFJeb9BIjNZ7F5WAGaaBgRViM8KYuh6nsBoZk3%2F1RQdRRJHQInSMEYFvhWEvQF6hDB72QWF5ITI%2FenZ1Q%3D%3D&Expires=1769414026


import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [activeSection, setActiveSection] = useState("welcome");
  const [navOpen, setNavOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant"
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
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationHistory.current }),
      });

      if (!response.ok) throw new Error("API request failed");

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
      '}</style>
    
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

        .nav-link:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
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
          color: #667eea;
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
          background: rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(102, 126, 234, 0.3);
          border-radius: 8px;
          color: #667eea;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.95rem;
          text-align: left;
        }

        .quick-start-btn:hover {
          background: rgba(102, 126, 234, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .chat-fab {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
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
          background: rgba(26, 26, 46, 0.98);
          border: 1px solid rgba(255, 255, 255, 0.1);
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          background: rgba(102, 126, 234, 0.2);
          margin-left: auto;
          text-align: right;
        }

        .message.assistant {
          background: rgba(255, 255, 255, 0.05);
        }

        .chat-input {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          gap: 10px;
        }

        .chat-input input {
          flex: 1;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: white;
          font-size: 0.95rem;
        }

        .chat-input input:focus {
          outline: none;
          border-color: #667eea;
        }

        .chat-input button {
          padding: 12px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          background: rgba(102, 126, 234, 0.9);
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
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(102, 126, 234, 0.5);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(102, 126, 234, 0.7);
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

        <nav className={`sidebar ${navOpen ? "open" : ""}`}>
          <h1>Lifespace Education</h1>
          <h2>Lifespace Guide</h2>

          <div className="nav-section">
            <div className="nav-section-title">Getting Started</div>
            <a className="nav-link" onClick={() => navigateToSection("welcome")}>
              Welcome
            </a>
            <a
              className="nav-link"
              onClick={() => navigateToSection("what-is-lifespace")}
            >
              What is Lifespace?
            </a>
            <a
              className="nav-link"
              onClick={() => navigateToSection("how-learning-works")}
            >
              How Learning Works
            </a>
            <a
              className="nav-link"
              onClick={() => navigateToSection("three-paths")}
            >
              Three Paths
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">
              Daily Structure & Learning Maps
            </div>
            <a
              className="nav-link"
              onClick={() => navigateToSection("learning-maps")}
            >
              Learning Maps
            </a>
            <a
              className="nav-link"
              onClick={() => navigateToSection("daily-structure")}
            >
              Daily Structure
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Core Competencies</div>
            <a
              className="nav-link"
              onClick={() => navigateToSection("core-skills")}
            >
              Reading, Writing, Math
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Key Learning Approaches</div>
            <a
              className="nav-link"
              onClick={() => navigateToSection("project-work")}
            >
              Project Work
            </a>
            <a
              className="nav-link"
              onClick={() => navigateToSection("free-play")}
            >
              Free Play
            </a>
            <a
              className="nav-link"
              onClick={() => navigateToSection("relationships")}
            >
              Relationships
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Making It Work</div>
            <a
              className="nav-link"
              onClick={() => navigateToSection("starting")}
            >
              Getting Started
            </a>
            <a
              className="nav-link"
              onClick={() => navigateToSection("troubleshooting")}
            >
              Troubleshooting
            </a>
          </div>

          <div
            className="nav-section"
            style={{
              marginTop: "20px",
              paddingTop: "20px",
              borderTop: "1px solid #333",
            }}
          >
            <div className="nav-section-title">Six Pillars</div>
            <a
              className="nav-link"
              onClick={() => navigateToSection("six-pillars")}
            >
              All Six Pillars
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Principles & Methods</div>
            <a
              className="nav-link"
              onClick={() => navigateToSection("principles")}
            >
              Five Principles
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Assessment</div>
            <a
              className="nav-link"
              onClick={() => navigateToSection("assessment")}
            >
              Assessment Approach
            </a>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Differentiation</div>
            <a
              className="nav-link"
              onClick={() => navigateToSection("differentiation")}
            >
              Supporting All Learners
            </a>
          </div>
        </nav>

        <main className="main-content">
          {/* UPDATED WELCOME SECTION */}
          <div
            className={`content-section ${
              activeSection === "welcome" ? "active" : ""
            }`}
          >
            <h2>Lifespace Education</h2>

            <p>Choose a category to explore:</p>

            <h3>Primary Categories</h3>
            <div className="quick-start">
              <button
                className="quick-start-btn"
                onClick={() => navigateToSection("starting")}
              >
                Getting Started
              </button>
              <button
                className="quick-start-btn"
                onClick={() => navigateToSection("daily-structure")}
              >
                Daily Structure &amp; Learning Maps
              </button>
              <button
                className="quick-start-btn"
                onClick={() => navigateToSection("core-skills")}
              >
                Core Competencies
              </button>
              <button
                className="quick-start-btn"
                onClick={() => navigateToSection("project-work")}
              >
                Key Learning Approaches
              </button>
              <button
                className="quick-start-btn"
                onClick={() => navigateToSection("starting")}
              >
                Making It Work
              </button>
            </div>

            <h3>Framework Categories</h3>
            <div className="quick-start">
              <button
                className="quick-start-btn"
                onClick={() => navigateToSection("six-pillars")}
              >
                Six Pillars
              </button>
              <button
                className="quick-start-btn"
                onClick={() => navigateToSection("principles")}
              >
                Principles &amp; Methods
              </button>
              <button
                className="quick-start-btn"
                onClick={() => navigateToSection("assessment")}
              >
                Assessment
              </button>
              <button
                className="quick-start-btn"
                onClick={() => navigateToSection("differentiation")}
              >
                Differentiation
              </button>
            </div>

            <p>
              Have questions? Click the chat button in the bottom right to ask
              the Lifespace AI about implementing this approach for your
              specific situation.
            </p>
          </div>

          {/* ALL OTHER SECTIONS BELOW ARE UNCHANGED */}

          <div
            className={`content-section ${
              activeSection === "what-is-lifespace" ? "active" : ""
            }`}
          >
            <h2>What is Lifespace Education?</h2>
            <p>
              <strong>Lifespace Education</strong> prepares students for
              thriving in uncertain futures by developing adaptable skills over
              fixed knowledge.
            </p>

            <h3>Core Philosophy</h3>
            <p>
              Learning happens everywhere—in projects, play, conversation, and
              daily life. The "lifespace" is the entirety of a student's lived
              experience—all environments, activities, and interactions that
              shape learning.
            </p>

            <p>
              <strong>Students are their own primary teachers.</strong> Adults
              are facilitators who provide structure, resources, and
              guidance—not the sole source of knowledge.
            </p>

            <h3>Key Principles</h3>
            <ul>
              <li>
                <strong>Student Agency:</strong> Meaningful decisions about
                learning within supportive structure
              </li>
              <li>
                <strong>Real-World Relevance:</strong> Authentic contexts,
                problems, and audiences
              </li>
              <li>
                <strong>Integration:</strong> No subject silos—skills applied
                across disciplines
              </li>
              <li>
                <strong>Play & Exploration:</strong> Essential for development
                (1-2 hours daily)
              </li>
              <li>
                <strong>Relationship-Based:</strong> Positive relationships are
                the foundation
              </li>
            </ul>
          </div>

          {/* ... keep all your remaining content-section blocks exactly
              as they currently are in your file ... */}
        </main>
      </div>

      <div
        className={`chat-window ${chatOpen ? "open" : ""}`}
        aria-label="Chat window"
      >
        <div className="chat-header">
          <h3>Lifespace AI Assistant</h3>
          <button
            className="chat-close"
            onClick={() => setChatOpen(false)}
            aria-label="Close chat"
          >
            &times;
          </button>
        </div>

        <div className="chat-messages" ref={chatMessagesRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask a question about Lifespace Education..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} disabled={isLoading}>
            {isLoading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>

      <button
        className="chat-fab"
        onClick={() => setChatOpen((open) => !open)}
        aria-label="Toggle chat"
      >
        <svg viewBox="0 0 24 24">
          <path d="M12 3C7.03 3 3 6.58 3 11c0 1.94.73 3.73 2 5.19V21l3.07-1.64C9.06 19.78 10.48 20 12 20c4.97 0 9-3.58 9-8s-4.03-9-9-9zm-1 10H9v-2h2v2zm4 0h-2v-2h2v2z" />
        </svg>
      </button>
    </>
  );
}
```

Sources
[1] image.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/8c8d5daa-1da1-4b87-8a0f-6b8130167df9/image.jpeg?AWSAccessKeyId=ASIA2F3EMEYE7AY34AVV&Signature=L04czQE4gCaZUlWvEEGmrKACEI0%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJIMEYCIQDkIb6kKcnjRCglGtC6XkNVIBeJ4sbets%2Flpc8wYe9s7gIhAM75j3VMc4%2FCQkrljqEGA20k26DhWqmsYCrTQZFWvTd5KvMECDgQARoMNjk5NzUzMzA5NzA1IgzuHRtugH6%2BfO0kLAUq0ASknIV8kPZEC30P9hPyhJbUgEhQ464GKH1%2Be2p07BvydrQf0VYfAuxjJGtXyUdHHqdb7mJoGv8ZBK5eUGhAts%2B5qG5SLMnBnjj8e80SLMNnf6fTvtXOOMFue6jFqI2%2BRC%2FWdKzrANEFcWIF6vQzmdP126cnBjmIG%2F9%2Fu11P7Dl1CeiDSGfCqjH8gAd1fMWshO0OPOQ1PAjH1gqVeaut97HQMiqiM7r2lPYDM2vttyrAhcewyI%2BkRz4OWr4MoVUilHF8oV%2Bu9qC9A7OILiA89QQgBfU2enmyO5uU6zmlluYmF7cEm7KVTTuMZiZXyeYBgZT0koHbRWrw3SPkkyIEY7vnTvEb1sDDkkpPiZdw%2Fn%2FwXS6h%2FGjDmE5MNc24PsyeDJUeuAYuJ7iGOPw6ihR%2BO6Mx6Xigkpd299EXZnpudu5ruqKQFx6SIyQkTp1VotyiHkzRN7Y%2BB%2Bn6s9za8hys7nC%2FkRp%2BRrEvEp8qyWuBTUFiwvJjM1CstPrHqlxilzEbWJ%2FisNogKhQOKsb5zItiwy%2BQahqJyM1u50OPf%2BkDA56GzPn2fqJCb7i514%2BuWRH9jXJoR6YJmTZDw4HXIjntId9YQvsqwtPXBVcPd23CP0Q87coBLx27XWRiyHm%2BxQzHzJeryh3HMnU3S%2BKICKGwO5Z0TbPqS403XBc6OSVDhWtjmeYKwPC9zWmLrjzwtAtEJZ8CH0RXtBhna1rd7y7NKf1bK6extNqZUPbsY%2BM9FYprXj5p8h1GuAxhC3Rhl482Malx5UGG%2BaqJ%2BUYS59FaEIpQMLun3MsGOpcBH9apDEms6CtzpZ9S5K31b0lFOWZNkNZz2jiFK2%2FmrOKtSLro9lyYKLMk0q3bwA2n21dJLAfX24UItU0ohZOUO4hDqbX%2FmEYzsAQEtecJwzX5UeB3%2F5jiPOPkMQjPLuu5v8ndGsSHgYx%2B9sGE87D53QyV1IVIum4%2FYVKwCwgDnZagemXbHqwTxRvVNi3z%2BTzbq1hkW2nCUQ%3D%3D&Expires=1769414026
[2] image.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/00a8593a-d86d-4230-ac79-1d73b98fa5fd/image.jpeg?AWSAccessKeyId=ASIA2F3EMEYES3NOV2MK&Signature=klLRGensI8M7i1bxgVvqmI50zLc%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJHMEUCIQDxa3uPTizsZ%2BvE3zY4pJH0ncBL5KRid0LhYw4MQbEemQIgI7hA58w2l6Nvkk3vfw7NWbm%2B3cxJotQjRtOLQkvu4OMq8wQIORABGgw2OTk3NTMzMDk3MDUiDL5ik5kxGtu02jLo5SrQBL7FmQRiqnNmqxORO9QCUmYrRan%2F4pvCp8BCEfxE%2FCGG3Yff8b90S3VUYiywY1T2ZWXgUIYDifwTSBHp6FgB4rr7A4%2BWa%2FRXk562Af5HWCmdvrJ0JQQXYwc2BeXs1lnwZqUWTw%2FblLU450F7rUIep%2BakNsvAME37XqrtIb8KroHJGYGzmI8W3CIGrOvB1F5TneiLW6XX%2BxokMtuuxNxdD4i3YnA%2FibQMKI3vRxsiPoq%2BQ4rzv1oy%2FJAHKvK7IiFPehfVLx%2FBujnP%2B3OEaI%2Fids4eYF%2B0mk%2FnpBJ07UgM55WgPE8ajCOfk8FOFp0fc%2BeOCNna1JiIVv2K0lQ77mo566bKWxGec6monBc1FHLSuMnYQZJd8DJJGb%2B99YryF4zsbJcYGjaJbJS3Qciyy9q%2FB7ABHYaZljqiRtklVaYtKVYbEliw61CPXGU8%2F68JZCNmFVe4pZQpTFkBs8ZGHabHxce2i%2FCFM17F9fNgZs9dO2A6gKw2TC1g9sZSc008GRI4xrCIJW%2FTg7mQLbstrk2qwfIky1FnXCOLvshg8y8%2BOWcIc%2BGEPTSBgbUzF5zdsKziiP9wBbeAgc64ioC59uzKa5b9jJlUoO0OmkzvNMrgA56HM2NLOH742g2kQZeH4VQSeveOl5VKmuZ3oo7XoYly%2Fp3pNHr8Au9VCjpX%2B8tZsS4%2Bf9sWBW2Y3KmoF%2FzC5oLvFdY3fVlJDac9oD%2Bnku9eJnNgEPNfIvENZysPWkauBnC9ixQ8iGlsh5HMink8Y5Wqfa1SYemCPgbY9XpDmBWBXscwzq7cywY6mAGi6D1K2FGbn1tEmSrgg0UXF1engDtCmj7hdksKtLZi4MRuhh14%2Fga5bfFuXKWqHpwfQZv6y3s1vJamJQ4iBT3pBUtP4BDtnCdXkTZLORalzB9zUGwkKUJuN4GWt7BBRo7R4y6EGfCdQNcHSXoFCsn9W63bByjf6GptUrBQ35fTncRcGush2JQB9PJKUecxqJT3g3k7AxaAOA%3D%3D&Expires=1769414024
[3] image.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/694dd8ab-55ae-4b26-a4de-ebbb19dade38/image.jpeg?AWSAccessKeyId=ASIA2F3EMEYEVDMO7VWW&Signature=wfLkEhh%2F4QyE0YfprGqHnxpOEEs%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJHMEUCIH8hJxfs70ZtatNlHPSaWvlXtApEw8%2F4HNBZTZUG4sJgAiEAhBVBzewN6GqFUDu2fcL6LNxZ1ozkwpycMo%2FsJzdoiJMq8wQIORABGgw2OTk3NTMzMDk3MDUiDH4H9bvrLyLWLqmz4CrQBOnZ7r2wdQlShfSGaAgXYJcTtfFnOILRIhaH2OQDdDBJ2jnUhFyd8IFgnrSV5f2ypo9YlmkbAocJl8A8XH0QRvBOeM1%2BpGS2Bwz1kCgsKNHU9kDjJUxPaCEl6qGHAjlPR0sbemd1%2B7c6sma9JvM9exz4u0x4dvJHfjAaz%2Fad6u1oMSC%2Fu2tdp7sYUVslWAAt4GVXxkJHvYlFVNViQo6%2FX0PindyCg1Oe8JNeAgb0jrstzT6GOKLwWJIwaisk6KJ0RZC0YdVUrcKkqKUWXo5M1fGMS1scx7hPu9AqELXRwExmH5cR63JMvWM%2FoSoXAY%2BdzqObw2XmBLWBmmrqosCRVUD%2BM1nF26Oi4sFO8vul%2Ba9aD0gF7yqDShKbQqOqwlyvtcJL%2BVumkKSM%2FfMnmW2bMEIMK5IrYLwbEMI68lLlbnbO4HXErXzYBciIfTMENymK7IsCotrX2tkIKGZWVz8sPRmi2eEBgeoFX0M1BL3u42uTLoISATDYC6cPzxaP81tzw9LXW39UVZHsIHcBERN7SVN4WEW%2FVpcyAL1JFMoKy8waBRjJaplVggwY7o9L0Xoksyaca0eHDz77ITS1dRfJY8pxtbNciqZ1qVqRBBQa3xPLSq2xrNSWNWY%2BUeFFWGK2Ka3XwTeMHOR%2F3%2Fe8vM1XxsAg9i%2FhTyV%2BfgwSxQkZJCoL1A3JF5w08NzvIBUk0HzScAdRu45XveFKvEcSOpcLK%2FWXZdhi6IXeqbrJwhRyPe1d%2BCiDPS1J1leAfiNcLRaWKdkF0qI01Jbs3Dlj5OaXlYow6bDcywY6mAGkTgjsDfvzq9uZc6zYXU5ETVL6tQ1%2B2hrk4gXzwY1HkdpRP0h%2FK6FD77cSiK5rjlyB9ZeJYiq68ElahNE8XQNkF8QFAsUhHgMQxi%2BsTXGbvzw1sK%2B56kRVmZPuM8lWog4qfH8ZEuMBo4NssCwhkggTmCWSOnVDlSlcej49R4z16QTSbpF%2FvEZ%2FoL9P0HQG8y%2FnHJFyghGJ5g%3D%3D&Expires=1769414024
[4] image.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/805af9e1-8d11-445a-84d0-201b8562ebb0/image.jpeg?AWSAccessKeyId=ASIA2F3EMEYEWZ3AAVVS&Signature=SIat0jZxthNSL1PAb36IsvCTJ8Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJHMEUCIQCpwuMMlHF41YhgD5ADJjZTAZ4e0nQOVXQNM0jnfZ5kuQIgGiCpbdo%2Ff2b%2BMfCFBHm9lQu9kgRolOXm8DMfT9oUz78q8wQIORABGgw2OTk3NTMzMDk3MDUiDDenDy6qewGKmIQ3EirQBDozRiO5xegtjv78DSwrPbSm%2Fw%2BynJcM6BemJLXrtvbgT9G1%2FeocmUEgkEShZlixocoW0qReMDfWr0AsPbx7p2Pb4ex90YhemvnISXuAspCI1DV4cA1y6eV4f%2F7ECG%2FrprzjGbgen7wubuLbldt5G5IkGADzX08mX5T9%2F%2B7owAJCAKd4mIn0mbWExNTpVym4fTqH1S3edroqdBGV1uIA%2B66QNwQQYO%2FHLXEO4bvHoLiI6rTSZ1cd1L7A%2Bk20nqVL1hrbvrG%2BYmTcBVgraeGvNCxl1Y29bGtBzCz6LnrPElyipMfDEElKfGjSrHE%2BtNbSrCzFa8W7WhAY95ERjcwTkrxYhvEiypJ2MpiH%2FsrelN%2BJLqHQwHKW8DZrH51ZoaKLYlHfRBG2wgO1cLRkn0MUd%2F0hNDv9QK2qVH5d0xWRxF5Vdb44XHRVD%2FBZA0%2BMosgs0wLLPDv5QYHgGr3xqpWeBmL7%2FVbsX0Nms9KXS9%2FCOxJAo%2B7UgHXc0RxExP%2FW1ffbEHAX8Me5fRLnfn1qtGfuqWzJnACvxCHdIrhS3r0Hfs6elvO8%2FYPx41As9ourrrClgXbxOA1YVEpF9o0dS0cB76T8cDufiO2CkD5aSHPcQLij02hljUhdqK0C%2Bx7Fv%2FZ9asYBiR8%2ByVHmmIWIUWJ9rS%2FHpUiv8Ob2dry3y6%2BsRBeaUWPmLvxwGKIfgANDIOf1r%2FOGHzhsHfBwtaRe%2FHuOz%2BaQecZahvD%2FBd%2Fc37vl%2FBEuEFOb7EnWhQXO9cCxheDSBz4wwAnhSgmj0LgSvPVdGk0wvLLcywY6mAHi7PKEDYkpkdrhqAcB%2B38H%2FxnMi27qVMRZIJJDRif4DG9EgDfQm4k1NAOjD%2F3EA0ASnhghF%2Bj0oUXTeW8GQ6SmaPfGmeZc5ladz3jl9Lg2WTxrqaq%2FB%2BILXQ9liZ5llAzBdZYXL8oiumgNzETTEKfW4pEw4sfx5yDWOJ%2FWxcZeHg%2Bn%2B4BKdFPb2%2FnT7V5lMOxPLdAj8SmpnQ%3D%3D&Expires=1769414024
[5] image.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/e40b7e5b-87f3-4b5b-ac2b-5597252c5f2b/image.jpeg?AWSAccessKeyId=ASIA2F3EMEYEVZK5OOSJ&Signature=7U7MGL%2FBBFkRkUuGycl7qKBNzdc%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJHMEUCIAUt5vinvotSEuN%2F%2FAs9Mtx%2FAWUS3ibs0gYswRgie5zwAiEA9tGHv9a0HQbULcGedMZ6LIJV285l7oS7QFGGLZ1TVB0q8wQIORABGgw2OTk3NTMzMDk3MDUiDM2pGLXYrcJL6PMttyrQBDT6l7q54FszHgd%2FV4TOTs4gtp4RRVzWhtU5YebhJhbbWvK8LADA%2Bs6kgc4Z2xEGYfvygQF3Bgxe6rx9vcNqn%2BU3RhIJWxa8iFtWHjV4LQS15ysKqIvwSx%2Fxyf29H2HtDxNnfanTGAuXE8Y9tQ0BmD75Gg29Rw%2BSQHrMWS3%2FkE9zp4U3BPVfB64wqaKBoZrxTJtM5JLzzl%2Bs69eUiaenjc7CVETiDJNIRXQ6Lw5veMbfWVAoOWKL7gNziX3m3birz50tzCHUuU0Rgbi0Xh31Hgkj8dlxFQCsZO1mDokYTOpMWyC8WrdVw21YpS6z%2FjUmkCGBz%2Bq%2F8a%2B6Ufmvj%2BqHdG4JiPN%2Bu1qcAdLpyW56mlN03YzvecNA3Ir5MJcTjZnoxc0oamiLGbwhTPEd8NncxU3kJEEd331JxtNhCFRcduAaEqORrPXWe3soqyqmJw6TAlIwBpTASrZ%2F9Ro9zCyQCyHuz9RPg2Agae1OUAjThLRRl1nHVNJu5SDtIZMX6L0ajKfMkV6QLaweSgcogbXGIfRiGbTEgrrbZQYXWTARIFDgZWpbXU6A1YqSHtXphoqFD1Jk1QarnvQOF1vaAO4OF6KKi2PFziMxOuF2PlVJ%2FBHFTGoiQo5E70ZVJorNgLjLlEQM%2Fg3BZscJQaopE3w%2BgKpgw4RjUYgIEVtztnEDd6yxRubRh75pzat0hkAe7b9coIANoAmX%2FRu9iyWNb32isrEbT%2Ft%2BIwMH%2FYAT%2FqUZbxMNy3Vs4lasdx9X2qhr4MI9fIAk711tflYd3fClbs2XE7Mw367cywY6mAHX%2FHPir1EQ21AFXfQLz6aGZsss%2BceB1c%2FTT0jrn2nnYs2r7oQCWsFQdG2dP8je7StvULgLHXH3PnCG2ELLXVAO45ZIo4sTHI%2Fj6LuaKR5bkQViiMH0p0HJ13uwKkvMWxCRwfj8Ost7aiuMi7OhmKawneF7G9Fi%2FNdtZwNp4%2BMT8xYO8z0Bh3TWXop96GneDdEdVXUMSQSh7w%3D%3D&Expires=1769414024
[6] image.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/506c1e9a-e4f4-415a-97e9-6de06be597f2/image.jpeg?AWSAccessKeyId=ASIA2F3EMEYEXPSQ4KOR&Signature=yEZDWcf4yZuwg%2BxjHpMmWKdvDC0%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJHMEUCIFsHF%2FkAm%2BVECUBJWKRMvBZODtCaVhy%2FV1unZ%2BOIkuO%2FAiEA3Z11VKzVsBJj%2FQFme22HCY9FbHr9Z1JN0m%2Btq2IQVoQq8wQIOBABGgw2OTk3NTMzMDk3MDUiDMyrvnHh5Z8MqxI4iirQBAjxN6cm6xjy1qkv9%2BoZIjY1kkTcFYzYbEM8rWEMMrgv2Wu0Vd%2BHsfdk%2BQ7yJ%2BIKl8KuAdiZ2bNrerDCUEifXUTWahji%2BcigopU14RF3eKf8pW1zvnCEgIpSbwhU3xxjm41M9QEPsbaxq0Z9odCM7L3PCkqgHVxVXdxB%2BJvAnA278UdROQ%2B0wUJvoZAUZCV%2FN2Ck7ISbc9LaRwSE40gf7rO6yxHtijAOyvYTi2Za1YNGkUwUEY4b%2BoX79Ud7OxkN%2BCYFwtKScfu0sxM4yFHI5xLTr3w5T9%2FV4RN02%2FW6MJJkc%2BB9myWGD6INe3rKAU2PuAdPgMlIv0CFNC25rEEF%2BmkVIO1N%2BNvoxNwWCW71WhfAFpBeH9Y2jAjc8TE4DrUgSdjX4lX0XDy9YTMR7I88hOQHCPLJS0Dd3WU5xLvyWpZmsR%2B8b4YxET6dsjleMj1xAvkyO1XSI9%2FXqB11YEuMIMJcQCkLyipnZKaaYoE4i%2BIXvQCJYbCi0tZSU0pGopz%2BKxpx5tFDEbV0baVifctOoo7JIfjYs51kmtxODoAj8rm%2B3RQMFeE4YtiqSBIDmwDE917Y%2BoI7WFcsnnGuJGhBVQx%2BCBQoPbYaQfa%2FfblpnQzaqdpJRk3S4vEtSzlSv3ISzcSKuN3%2BdNI7GLUDixP7zp%2BgCXZyCuevVmLy5aIvcpOrWe0ulBfAsLLqvtb22KSiFGmaqnEYtGEqOGgDuwU5T%2FGEp%2BNZvVEkoolc29Va0xOXxvRrHwRXiJ7mFCluS77xQ0sErOizuUWgiO%2BEZJIFBpUwiqncywY6mAFmown%2FseOJCQgIf1R3KHs63a7q4hngXvq%2BNnxGM8ZZR2Hr1J9rPTMlOepgcFyQonJ5reCyGR4TCkELgTZ1hJJmLDXAo4AfKNrpVmP0KV%2BfDtWt77NDicLRhTjkEq9JIa7xKezg0i0noTBpPTWJV%2BcfwSaetPEcLWrTcsFQt7T2vhGKtNBJNyzxv0XbqNP4%2FH6hZMtS%2F%2BLf3g%3D%3D&Expires=1769414024
[7] image.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/d023df92-33a2-4a91-b5ce-95339bb5ce9f/image.jpeg?AWSAccessKeyId=ASIA2F3EMEYE3HO7KIE5&Signature=ghxr%2Bv88r90DdnfWE8%2FRRx6yjjU%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJGMEQCIAouo%2Fsk1x8%2Fk8BAbYM4leuqidxwi6AD%2FpOlHJtwWncbAiBa08%2FhkHqTLYUBj8faKpg3XWMmPLwUD0XHN61uNd%2F5YyrzBAg5EAEaDDY5OTc1MzMwOTcwNSIMR%2F7kkjhH9oUqP%2Be4KtAE546AmMYwjCBl1hb6wk3JhzDXZ1GV73jd7QIms7evSa6%2BoBh3ZJEXNB2KjFtB9zEGILXqs3I9m6RX%2FlaqBPKg8Oi42YWZi4%2BUtbb3awgswMg9Etv219k9T1qB%2Fb7KF8hTpo9WreM51gRwnzqb0KiExI%2Be9sdcoMu5em9T%2FiNn4W%2B4J5OxIGRE0KuZbRTuMelgyThL5t%2BQy59USV94DvKjpGMEsw9%2BP4J8Q%2B2ThdPgMbSYQhvr4vaIOlEnSnnqosUONaTHovdbVCseFoJgpJRJ9gHAQovrHpgYZdG6xzSnMFI6tLogF%2BEWlsRR%2FOMIZeN%2B1%2FM1lXIcwgcqiPK9bPMGH4nKuKcNWd483c%2Fde0u%2FZmQyXRP0egAYsv94ZU8gnP8sZbrvN%2FDTO50kfaWjdxM69OwYArpofU%2BTCwHdx5Lv6JXba%2FkopGOfdSqPckXUZQG%2FI9PzVyyNIsEqBMZSnk2J44EDp%2FefkLF%2B8q25TIpeh7K%2BbC03aNNfR%2BXBxE3GmIzZeOQgltrdQmTBw6J3JHeQwQacOAnyE1xiUioKdlfop3FBxEAjSEBtQxR5GMTqBwdoic3aKtd6mn7hNR9r0XU%2BgHVwlU8C4gH2ktFsljzXzZ8pRvU0tJCp%2FDsGKZf10oLXADWSdFXEvHj8uKvKAbJ4hvuhmFxACJMfYf1x%2Fvb60GlNOo8ACGlXsbS0Ly%2FMV0YhXzaNkoZLlS%2F37oTt2xaBcRqi7gBv94P2JQseazG25Gt%2F7QPdpLAZEUvK1JC%2FtuhwzXuYOvUEitQk2qPv1rUeVDCnsdzLBjqZAZmJrFnmtV8VnltEedZGhF48fvQc7mm9HzPueT37IRUX6%2FYCpYLpZMILBYFash26BNPWSXjp8yw0eMzH2T03NfK%2F70ILG21Rwb3Skj72wxGUebfxzzuOHXT4xlG7jYCgN%2Bpx%2F5AKq%2Fv8TvAfNRAzodekcCGoXlNj497phauyyaPmdHp%2BHO%2BWronm7HiMC31YM%2FNL0xKX2pXbsw%3D%3D&Expires=1769414024
[8] image.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/fe230f0f-1721-4e85-b033-545785089ac6/image.jpeg?AWSAccessKeyId=ASIA2F3EMEYEZFVUW4XP&Signature=l14Gia1hfKnGwOazvZUE5gvic4k%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJHMEUCIQCtipsgqh1NQIs3s%2BxaCKtCaWWdch9cYFfGAdtUrVNj8wIgEGEOVU7tEYxCqRjxN39gQDeeC58IFdfaGHOzySgi%2FC4q8wQIORABGgw2OTk3NTMzMDk3MDUiDKYShg8LmYPm7NC%2BayrQBMqddAA1ceXAYxs%2FRQIkctcPwyWv0QKRxsrk%2Fny9LFNiQ%2BFmrMwggnLp1gpenisY7ufvP25bBNrCdyioHij5EjP2PHiML7lq4ctBCHVkggGZqP4wxwU%2FvgwUxCYnpE0X53KVMakJE6A19apzT9hgIjkICTs32fPZ%2FzTSTJOHu91eOFv014IqPteO8yThqlFHQqt8LOcb2eKb%2BL2JS81RFsKatmJ8RJ2rTSF2UpC9BeomihpctBsWvdEPPGfbE2xLotSD9RgUf6P5oqdiIPc6mtdpWvHH003iihmEMqthoQXXG1iM6bcw4nqIysnHIP%2FZRjJvX3lfKQaZQ3Or4wAD1vMUP%2FTkuyMXcw29jAp0dUBlJoPfgPzwWC4w5rL57Sy%2BjdXHj3Fkl8hHCb8ph2tHSsAnnAAjYUF%2Bgw%2FB4XVuHK7NExdzZ0CghmvYJ9DfyLCd1ywriqMgHYlv0YnP8n4i438HGKFrtQnPC%2BEB2Ir38DQXBQMATHnKdSWxrGkLXN%2F3etx05pADAQ7nVYvia%2BDBvpDhnBIRsmf9pdveKKub0kscgcMYuWVwq6rHX%2F3Dpk5WixPpa%2BEBu5v7cWHdWd3n1F%2BTlzXINM%2FOsPPu7IQDkZvLovC0hmttPt%2FyDYvTK7aH0R%2FI%2BDF5m8Ryqo3DW%2FhkUU29waMZxer3U1ZSJBM8VMxpHQ9zStD4kMKC7k0mbukACF1zdoiZZ%2FvJYpu9Qu6DzR0MizN%2BTCuIdGefzVjTCwD5AUwc9Os5RXbG8QXQIcDeyjbb%2BbkBemAbW%2F%2FOZ8KgcdIwxLDcywY6mAHsHnR88HPPTKeHnBgopet07zCa0MW705Oe7JV3IcQQ6K3WesA9M9lCSE3N4fwRqKEtPWbSklaVTDfN0sgOBSGqlc0BmbKJZc7qOV1L46qeitUr%2FI4vAPT5JCEAV7eMnLDdFdvPaajMoqPpf1j8WiKyfUskK4w1u4daOvGqVykoe0Lj0Gt9u4VQl7m9E4CUX63fFnxf91v%2FKA%3D%3D&Expires=1769414024
[9] image.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/0b55672f-375e-4332-a28c-62390e396582/image.jpeg?AWSAccessKeyId=ASIA2F3EMEYEUSSXXQAY&Signature=2a%2FWNli9gclItyVlowhcsCd73mk%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJHMEUCIAZ2vtaqXyw08R02mW7DwfgYpzqMRr5Pd8NsDmSaOTxYAiEAlNRaYI0XbRg2tyMf1TGz3u7Y4NSerFmjTD8Iq6rYsZIq8wQIORABGgw2OTk3NTMzMDk3MDUiDL0i0KQ8yXAG4GnMkSrQBLy9QA6ForE5WEhkMOfJapd87vNiZZhAZ8wFUjSS6w25HSHpQatA005DlxqKMYPttWZNsLQbGs3V79LVsKj2CcWr3Q89d1tZ5O8SF9lWAyqSVfdi416MQNz8mrxEAxNLrPEtJAIxAzTW85Xn2sEg9a8OAxeEIAuB802qhqqJG2lpQDVcOvnidYxeFOGDDIpz%2BffrLyuoTNNKbAM0PW1bAtWGcVX6jvJX5o5czocAbIXLNj%2B8g7zjGrYuOwuY2aBUgOGUqwv1EEFr8hAxGFpNDEmNWIvzXTwFs8Y3%2F48NXPJOkXxkC3FF2YGBue%2B5tB4jeL0HGE7Uc%2BFYa6O8ns9I3FLQm6ZizL8iTtt4EnJCggAQmkFcKLA0jfkjv5rihqJhdNFWxvwGSwpYAov89A5RCNOeqAf3od%2FGF1BjmOswaangVtJdYs2ue1jiLHGi5%2BDf9r4LIZrSE28c9k1CkY9dhbO6jbIu7ETs72FL8SU51a3e8dq6JT9HP03Z93vBx8l9k2ANyEVF3uDTFf%2FZ4lG4pAav8xKB1Q3QsxtzUjouSSgK%2B0ygvhrnOvOYUZkz%2BH6a3FVjst3gVd55c8QmngnZ98TuoOuWhCWVQsvMi4l3CE6%2Fq%2FrvEbSbL8xw4KKlPqhbt3JDgdHhFjjpgOtJtWejLavHQELLZkVrdxpgYcTeVe75UljFy9uCgcezaZo4w0kD0V5JvfwUhe3Gm5ZsMGPF4aeFgB6FJtkk2r%2BCxFRGBVRlUJCJhllpAbB2Dy%2F%2B9vGX%2Bw4%2BSJx4vKRKXdM09AYR42kw6K%2FcywY6mAGIoeIP32VoyXXFtn30Zjaj6JOh%2FXzH6hqj7A3P%2BJYzkmEcrm%2F0NPSSzvapAiFoLUM5THt1qmUkwnFCwiIOtRbRLC9Q3fZQMyJXmeKf5T%2BnJNXyl%2FHnnFct%2Fiou2ljG%2Blm%2FhvbISaWFftl%2B%2FeqPiip69KS%2FG493VqnUK9kv54yikYBzwEk%2FabFB0w7K86ePdVNaz63i5%2BFmtg%3D%3D&Expires=1769414024
[10] image.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/698cc76e-43d4-4377-a45e-b41d7e2cc1fb/image.jpeg?AWSAccessKeyId=ASIA2F3EMEYEXLJCYKRM&Signature=ySN7HZzav7YmhF3jG5Z4uE8NGfU%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJIMEYCIQDDTCXD66Cae%2Fk0O%2B2gmLn6gKSk7jheBAqTUQxgcC4KzAIhAMt%2Bh8A4ER5wLOvMhyUqdKbk4wfKhKpJY6HZ%2F3QCXZ1CKvMECDkQARoMNjk5NzUzMzA5NzA1IgxPuodj%2BKYi4dBg1Ckq0AQDJgZBeKStiXHfjxpK9sG4RbIDlYGcCPTKPUV%2FhM4kQyHgvE9akClG4nSOZilb8sikHDBVkVdCWrtKHohaYqiHUcRlbAdn7y2vA5S%2Fp4djNklTi2SjvGeknxzYEtYZU71qY1Wh3nDKzIiZAgvvcuuCxkqQy5fR%2BPTCNaJAhI7G3ab2HM%2FQPMWqnL5caJoH6gc471nqIH%2BNNImlWmfBXkY2PMqJtjCQLZw84ecQQMIJm%2FI2NyWqOk5ueBk92QU4SQmHp3hF%2BX47o4JZih95uuTk2kP3RWcr6tw%2Bq9WV7EzcY3dMSf0B7DNoTKg2alKY7c8m6jkixC1K8U2rzW%2BIJqkPs0CYQOyI5%2BPR8tMOi9ueOhf0h3dYrjuX8OvHGT1dt20zAl4ShrUDovRi8zo7hKpG9apHb2MaIEWyxCVbsWKKg05N1mun9hwPa4yhvj9SUqWLYO0uDMfA5O73ujXoHJsXH5MH%2FJrnc3m3X8Uq%2BPDCeGl1BBFCAoPCC3fpDbU2hGPgvBQKjIeQ%2BHdzKtYYK3rKnbQj4ImAS3lJDw7tcYqrkurMWwDIxxB5zWOhAqTMuW%2Fx%2BLOjvPM%2FfODOwNTzF02jr%2B0RTHSiIUKNlL3eW5pH56UZBC2a0pQ4qwYspsBEW2InI2PlurmaW3izydMjr%2Bd4R%2BHmxw%2FGmFbDQyKCd9QdEuvI0xnKcClnRxu8lAuhH51oQBC1nY7tnq2G6gBPnNrGDd%2FjnnfOOsM%2BPo%2BV%2FGajce7AtzvzNQEwQWpUajZuhoRswH%2BF7sVnsKVZjHokhZabMLmx3MsGOpcB6KJKAz2%2B%2F%2FWvZESDpsbZz3Jb5WXLnyUtyrPf%2FMmbe4hIWw9VxGnDnEGtOeRnoR98a%2B3rUZmHpNfbVD6Kl0834siDIw5rS9GPZ6AMYSORB8eKUp430Lgagm8BMGLgID%2FWEgya4Y9Hkrrv3T9jFzl5blWEFkA9mZqvWjNifXE66rCSKAnQ3IIxCzSXfMcFINcYTYtIKTkJ%2Bw%3D%3D&Expires=1769414025
[11] IMG_9009.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/a1533531-901e-40e5-a3b7-ba64bef2226b/IMG_9009.jpeg?AWSAccessKeyId=ASIA2F3EMEYEXG3CADVL&Signature=9EchlL7w1p6lGsfFAsOowcerICg%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJIMEYCIQDMucG%2BXn5VR%2B0V9H1oiPHXuBhlMx33HWJRbVT9q2Ti3AIhAJU%2B%2FP61vMmvnFcpbjIHO%2BOyfZwxztyiNwckes2TvSOEKvMECDkQARoMNjk5NzUzMzA5NzA1Igwx9cUSlFsOEWZrlY0q0AQZ1KZ7RGV0FW1LgWWh7%2FDhFru0ntms%2BRL6rq%2BfyEQwIhky9Qs4vLmLGWYogxigCxFKyhBPRhum%2FNYZQKjE52pQzWVOQzAn5oHN8SSW4ecvPUqTK9QCI6%2F4oYJBeI7HDPKyiprDCkl%2FttseBr5f53CGoufhLJn2wDZvk0usx1ahJxtafgvTIy4SC1OFFHU82Xp5KjO5NIGgIEaDlZZf%2BJk1zfz8hoDcZYq06qaeh2ZTxDqrBJ4D9JTh3Xqrr7vExtRTmBFEgK2E2G2GlOVUhtkFfwbOpUjaUzEdgTR3uJ5RMdlkWP6hq3TFviTHQrk0v967d%2F%2FCG%2FafyYldvaBzlogcJdoX7cFO%2Fjs5VVMB4fh4Z9%2F54hsuMZelcUk45oEa2tsxuqNnwAR5SUjrzoJRtu6OBbK%2BWmLnZxKRzfQDMoA7aTtLUPvkGgscYbOLMKHLIGJZhZGljRgvuUpwUsjQRhPWH3q0TyA2et%2BI%2FmbdSLUEopFlW8GtpS%2BVJke0kgGwHg3Bg5nFaU7mBuDFjGvHgPuunoMCuWmEk8g4HVUCm2m1cJ66%2B4iJ%2FEcwLy3JNiNNNCi4OYQHKl3egPDp42lBYJ%2FSN5lkVmVB1E6iCU3aojZJxfL3EMi%2FditT21B%2BjNOcD779FSg%2FJVdjSxmvlKZRUMxQt1Yp%2FURYi%2B%2FNOD5ux%2FqrA071UxGl8ssFPulG31tkkIn4ghzGTWJCziDlr6VSuN70yid3kkKAbsOpxn%2Bp28nj7mFuhbaj49NkyAznvHlkqmTHSCmr5XN7P%2F7gzxSXLR73MIqz3MsGOpcBwNEzwj5l3wL1evaYoyPG6OQeN8a6S9sgtEihlP5yJcqEv93VG9WX8eX36iGui1GC8KN2mmpnZtd92hq%2BWY8O3GOw9tQsPulx%2FEHhnxenY7y3MPESqnyQAQVjqw21P0NrmNfIx3i89bXKbQPRf%2F62AFYnyvarR9A5fsJi7h8%2B2WVMm37lfGVVEKO%2FdeemXZmDEhI4tpft5A%3D%3D&Expires=1769414026
[12] image.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/6941b139-3075-4cf5-a861-6ba31222f903/image.jpeg?AWSAccessKeyId=ASIA2F3EMEYE73OMKHLE&Signature=jHHiSEOQf2mOu5A%2Fc0luBgk1dxk%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJGMEQCID4MMnMCnkzNKDirk%2FnPVZR1eh19vpQaRa7NcLOcjqLPAiBymAUNnuw76X4JA%2B4aenjmMG6SK9R%2BS75ZCCOEN64RJyrzBAg5EAEaDDY5OTc1MzMwOTcwNSIM22nud6FyXYy%2FclK4KtAE4NEIXJughlbEmE38lE22AtEgcw8J86fclOwVY6XbRkrLEQjKJoI3UhTrc1yqu%2FVeIf5Hw2mjRi1l1djwxoNeUwdIeTPnVAxr8GDEQO%2FajS1P8eR7x2sLGQVnlUrBwAgw66Sw%2BbmUegvjBqufx8HRwffRb3%2BE90jwsDoJI5quGuVOqPBUYlIzzPxK2OLyORPZXS6yrQAuFpAIAC55OqxbjrIYX82420cbENMUIguV3lFXfKYcgpBO0gwninFm9sYvODLgWQsX06fr37JBweV5qvxeyS3ntWn145IoLfMt1aE9he4%2B5EHv%2FHLA8EkH9n0f3SyuVYFbDbiZIhghJplvzei8jl5Kcwpz1jZyQCyQgv51AEz8NtXiK5OPdqdqsSsb2Mpq9Ia5wsZe9McFwcX0IMGHeLwWVctVLma7bU14RQXlsoTYI%2BFULC96PTICwgc%2BQ9iuyfqAhbV06WrYelh023fm5%2F7LI3oaws6jrdzgf6L%2FGCizzQOIK1xnwXiVyTHWIQvtWqLHkeTKIZK%2FtMCBmrlZ0RGYtEuovIdvUfjLycQXPZwe17AabpCkNHMBv8kZkRDLUJvy27MviSdoK5XhC8M9JhZK3LS9Tsen3tzsnZ7gdrRofYjG7G3%2BphId7yFEq%2FZHkghkTMsB03G5%2F6AwFB8YxQL%2BxytLpd5G6rw%2BENStz9F0ykm7BI4MXQO324p8W4vP94fREbJyTofxbK8cgXg719yy%2FEJeHk1whbMzIy%2Fh6x8g%2Fm7bazREDhxP%2BiZCrRhaJB6PURs7n%2BEtVDxOTzDKrtzLBjqZAazAjpxkgSMY02YjXNDjrt9OvEEJb64zoRltdg06sW%2F3PsZZ%2Fqo%2FxcJboO8811TGSuePnDPn9ak7MANbbA4bF2NIagOCISfeOlLO0zIGOdj8Nf6fM%2ByItCBVpJ3JgwsZf4ngZ3TL3wkD3VkanFTcAgr7qStTB8PLxwgJIdruu2QZ6T34atFJ8wX3WX64jcFBed64yU8GG4CAEg%3D%3D&Expires=1769414026
[13] IMG_9010.jpeg https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/19019763/3face873-6381-4f97-9ec4-1b907e5808ac/IMG_9010.jpeg?AWSAccessKeyId=ASIA2F3EMEYE6CMMASEX&Signature=pQ%2FVRlknpAjS0QcDG4rPm6QzC4c%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEHAaCXVzLWVhc3QtMSJHMEUCIHa0FrNwPf0aySm%2BiQRyE%2FI9uqbcbO8YFL5hwECW3fY5AiEA7Uar1PbkhFxcxPryBG19LjFlTZc6pICvqk5UqG0cKvQq8wQIORABGgw2OTk3NTMzMDk3MDUiDIXCRBg1KnKo23I3eSrQBFxQcTfZfiAEZpyT0Tr6%2BG2A7RDSkVJkb52gP6k3RJGUH4xENoK2qWamH%2Bo6%2BFFBwJUZRwxd75OkCWSxIQidGoaDrn1%2Bwe%2FdUgmgwk9cLjurvPXRZCndTu%2Bi3M22wQkFPRxcrNUfl%2B4fBldmr%2BVHPTBtIuzjJCM0aL14pxb%2FnWUoCAd8Zm5%2FcWczVDV6RSfvKXZksX6UhUAg0%2F0%2BG8s31AVNDp%2BG%2FdysNes3wGTYV%2F2diSe5VxHuvsxOlT8DSfLodSegoFc0VPeTn6Z%2FffOsnmdzjK8hnGuVw2Y46ELqvS%2BuRlkOG49aNmIJ64s5RNUjQ9NGfNsAO1rNPIPimaazaEAcZDbSkPxN7VzB8noJG%2FgkxFqcwu350xzrbb5WWxXsIGFcwh9WzKXzF2mXrhY2MYN6BFE2kfGRoJrCSV1y0Z03D91mfO6AiPLjnYSoC9N2SBR65VExyf28y1PV1IQw%2ByiAcD5I1W0LE%2BsIgGONvmn1k%2F5CGP%2FBlirhj4Z7qqVzI1iIwyn%2BGgqnQ2ANwsS06XiA6y6x%2FcfK6ZZeHte0ZxlCgz4Ym%2B4%2Beva86S7CLWB6lXzOWjdEVIc%2BZ53lhws756ZX7EAqxM5EACBRzvxn6iOnyeDNCvxs7lowEpj64nO7m68FvpCt2A%2B5eKOyTDVYtQlxkFbQtEXkFHI3HySPrxHJBJ31lbUssNztf%2Bpg5gEucitctlYJoTqVY3gES3QlHR2Ap%2Fkcrb6gckaY92VuoTg3l8StoLekCOUlP%2BJtMLDylTLfvItit%2FV3dH30vU0VbIkwya7cywY6mAHf3EsmGEG5voKCmZW5AYrH9O5r3DThSusKc9ei8dBDWQQafCKVn8nKekfxp4t6CfMZnmZmisaus70a6%2F4srKC6%2Fg0akESSJbclCCqQKmU0%2B8WwPTQXcuG7yB6A8EFJeb9BIjNZ7F5WAGaaBgRViM8KYuh6nsBoZk3%2F1RQdRRJHQInSMEYFvhWEvQF6hDB72QWF5ITI%2FenZ1Q%3D%3D&Expires=1769414026
