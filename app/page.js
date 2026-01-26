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

        .nav-link:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          transform: translateX(4px);
        }

        /* Main Content */
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
        }

        .quick-start-btn:hover {
          background: rgba(102, 126, 234, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        /* AI Chat Interface */
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

        /* Mobile Menu */
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
          {/* Welcome Section */}
          <div
            className={`content-section ${
              activeSection === "welcome" ? "active" : ""
            }`}
          >
            <h2>Lifespace Education</h2>
            <p>
              Welcome to Lifespace Education—a comprehensive approach to
              personalized learning that prepares students for uncertain futures
              by developing adaptable skills over fixed knowledge.
            </p>

            <div className="quick-start">
              <button
                className="quick-start-btn"
                onClick={() => navigateToSection("what-is-lifespace")}
              >
                What is Lifespace?
              </button>
              <button
                className="quick-start-btn"
                onClick={() => navigateToSection("six-pillars")}
              >
                Six Pillars
              </button>
              <button
                className="quick-start-btn"
                onClick={() => navigateToSection("three-paths")}
              >
                Implementation Paths
              </button>
              <button
                className="quick-start-btn"
                onClick={() => navigateToSection("starting")}
              >
                Get Started
              </button>
            </div>

            <h3>Quick Navigation</h3>
            <p>Use the sidebar to explore:</p>
            <ul>
              <li>
                <strong>Getting Started:</strong> Core concepts and
                implementation paths
              </li>
              <li>
                <strong>Daily Structure:</strong> Learning Maps and daily
                rhythms
              </li>
              <li>
                <strong>Core Competencies:</strong> Reading, writing, math
                essentials
              </li>
              <li>
                <strong>Key Approaches:</strong> Projects, play, and
                relationships
              </li>
              <li>
                <strong>Six Pillars & Principles:</strong> Framework foundations
              </li>
            </ul>

            <p>
              Have questions? Click the AI assistant button in the bottom right
              to get personalized guidance based on your specific situation!
            </p>
          </div>

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

          <div
            className={`content-section ${
              activeSection === "how-learning-works" ? "active" : ""
            }`}
          >
            <h2>How Learning Works in Lifespace Education</h2>

            <h3>The Six Pillars (What Students Develop)</h3>
            <ul>
              <li>
                <strong>Critical Thinking:</strong> Analysis, synthesis,
                inference, evaluation
              </li>
              <li>
                <strong>Problem Solving:</strong> Identifying challenges,
                generating solutions, iterating
              </li>
              <li>
                <strong>Core Competencies:</strong> Reading, writing, math,
                science, social studies
              </li>
              <li>
                <strong>Expression:</strong> Making ideas perceivable through
                any modality
              </li>
              <li>
                <strong>Social-Emotional Learning:</strong> Self-awareness,
                relationships, decision-making
              </li>
              <li>
                <strong>Project Work:</strong> Extended investigations of
                meaningful questions
              </li>
            </ul>

            <h3>Adaptive Learning</h3>
            <p>
              Rather than rigid curricula, Lifespace uses{" "}
              <strong>just-in-time instruction</strong>—teaching what students
              need NOW for the work they are doing. Mini-lessons (10-20
              minutes) are immediately applied in authentic contexts.
            </p>

            <h3>Assessment FOR Learning</h3>
            <p>
              Assessment informs instruction rather than judging students.
              Methods include academic discussions, project presentations,
              portfolios, observation, and self-assessment. Students are
              compared to their own previous performance, not to others.
            </p>
          </div>

          <div
            className={`content-section ${
              activeSection === "three-paths" ? "active" : ""
            }`}
          >
            <h2>Three Implementation Paths</h2>

            <h3>1. Full Homeschool</h3>
            <p>
              <strong>Setup:</strong> Parent is primary teacher
            </p>
            <p>
              <strong>Time:</strong> 2-4 hours active teaching daily
            </p>
            <p>
              <strong>Cost:</strong> $0-500/month (curriculum, materials,
              activities)
            </p>
            <p>
              <strong>Best For:</strong> Families with flexible schedules; one
              parent available during school hours
            </p>

            <h3>2. Microschool</h3>
            <p>
              <strong>Setup:</strong> 3-5 families pool resources and hire a
              teacher
            </p>
            <p>
              <strong>Schedule:</strong> Meets 3-5 days/week, 4-6 hours/day
            </p>
            <p>
              <strong>Cost:</strong> $300-800/month per family (teacher salary +
              materials)
            </p>
            <p>
              <strong>Location:</strong> Rotates between homes or rented space
            </p>
            <p>
              <strong>Best For:</strong> Families seeking community; shared
              financial/time resources
            </p>

            <h3>3. Supplementing Traditional School</h3>
            <p>
              <strong>Setup:</strong> Use Lifespace principles for afternoons,
              weekends, summers
            </p>
            <p>
              <strong>Time:</strong> 1-3 hours daily after school; full days on
              weekends/breaks
            </p>
            <p>
              <strong>Cost:</strong> $0-100/month (activities, materials)
            </p>
            <p>
              <strong>Best For:</strong> Families committed to traditional
              school but wanting enrichment
            </p>
          </div>

          <div
            className={`content-section ${
              activeSection === "learning-maps" ? "active" : ""
            }`}
          >
            <h2>Learning Maps</h2>

            <h3>What Are Learning Maps?</h3>
            <p>
              Learning Maps are interactive visual representations of a
              student's daily learning journey. They are NOT rigid
              schedules—they are menus where students choose the ORDER of
              tasks, building executive function, planning skills, and
              ownership.
            </p>

            <h3>How They Work</h3>
            <p>
              <strong>Adults identify core responsibilities</strong> (e.g., 30
              min reading, 20 min math, complete science observation, 1 hour
              project work).
            </p>
            <p>
              <strong>Students create their own path</strong> through these
              tasks, deciding sequence based on energy, interest, and needs.
            </p>

            <h3>Implementation</h3>
            <ul>
              <li>
                <strong>Visual/Tactile (younger students):</strong> Physical
                maps with activity cards they move around
              </li>
              <li>
                <strong>List-Based (older students):</strong> Whiteboard, paper
                planner, or digital tool
              </li>
              <li>
                <strong>Flexibility Spectrum:</strong> Full agency → guided
                choice → reduced choice (based on student needs)
              </li>
            </ul>

            <h3>Screen Time Integration</h3>
            <p>
              Learning Maps distinguish between screen and hands-on activities.
              A brain break is required after EVERY screen session (20-25
              minutes maximum). Brain break = feet touch earth, sun goes in
              eyes, analog art, or physical activity.
            </p>

            <h3>Developmental Progression</h3>
            <p>
              <strong>Elementary:</strong> Highly visual maps with physical
              manipulation
            </p>
            <p>
              <strong>Middle School:</strong> Transition to list-based planning
              with some visual supports
            </p>
            <p>
              <strong>High School:</strong> Adult-style time management tools
            </p>
          </div>

          <div
            className={`content-section ${
              activeSection === "daily-structure" ? "active" : ""
            }`}
          >
            <h2>Daily Structure</h2>

            <h3>Core Time Blocks</h3>
            <ul>
              <li>
                <strong>Core Competencies:</strong> ~2 hours total (reading
                30-40min, writing varies, math 15-20min, science integrated)
              </li>
              <li>
                <strong>Project Work:</strong> 1-2+ hours
              </li>
              <li>
                <strong>Free Play:</strong> 1-2+ hours (non-negotiable!)
              </li>
              <li>
                <strong>Meals/Transitions:</strong> 1-2 hours
              </li>
            </ul>

            <h3>Screen Time Rules</h3>
            <ul>
              <li>
                <strong>Educational screens:</strong> 20-25 minute blocks
                maximum
              </li>
              <li>
                <strong>Brain break required</strong> after EVERY screen
                session
              </li>
              <li>
                <strong>Brain break =</strong> feet touch earth, sun goes in
                eyes, analog art, physical activity
              </li>
              <li>
                <strong>Non-educational screens:</strong> ~1 hour daily limit
              </li>
            </ul>

            <h3>Sample Day (Homeschool)</h3>
            <p>
              <strong>8:00-9:30:</strong> Morning routine, breakfast, free play
            </p>
            <p>
              <strong>9:30-11:30:</strong> Core competencies block (using
              Learning Map)
            </p>
            <p>
              <strong>11:30-12:30:</strong> Lunch, outdoor time
            </p>
            <p>
              <strong>12:30-2:00:</strong> Project work
            </p>
            <p>
              <strong>2:00-4:00:</strong> Free play, community activities
            </p>
            <p>
              <strong>4:00-6:00:</strong> Family time, dinner prep, evening
              routine
            </p>
          </div>

          <div
            className={`content-section ${
              activeSection === "core-skills" ? "active" : ""
            }`}
          >
            <h2>Core Competencies: Reading, Writing, Math</h2>

            <h3>Why ~2 Hours Daily?</h3>
            <p>
              Focused instruction in foundational skills builds strong
              competencies efficiently, freeing time for projects, play, and
              exploration. These are not isolated—they are immediately applied
              in authentic contexts.
            </p>

            <h3>Reading (30-40 minutes)</h3>
            <ul>
              <li>
                <strong>Phonics:</strong> Systematic instruction for emerging
                readers
              </li>
              <li>
                <strong>Fluency:</strong> Daily reading practice (aloud and
                silent)
              </li>
              <li>
                <strong>Vocabulary:</strong> Explicit teaching + exposure
                through rich texts
              </li>
              <li>
                <strong>Comprehension:</strong> Strategies (summarizing,
                inferring, questioning)
              </li>
            </ul>

            <h3>Writing (varies by age/project)</h3>
            <ul>
              <li>
                <strong>Mechanics:</strong> Explicit instruction in grammar,
                spelling, conventions
              </li>
              <li>
                <strong>Process:</strong> Brainstorming, drafting, revising,
                editing
              </li>
              <li>
                <strong>Authentic purposes:</strong> Project documentation,
                letters, stories, explanations
              </li>
            </ul>

            <h3>Math (15-20 minutes focused + applied)</h3>
            <ul>
              <li>
                <strong>Procedural fluency:</strong> Facts, algorithms,
                efficiency
              </li>
              <li>
                <strong>Conceptual understanding:</strong> Why methods work
              </li>
              <li>
                <strong>Application:</strong> Real problems in projects
                (measuring, budgeting, analyzing data)
              </li>
            </ul>

            <h3>Science & Social Studies</h3>
            <p>
              Integrated throughout—primarily through project work and community
              engagement rather than isolated lessons.
            </p>
          </div>

          <div
            className={`content-section ${
              activeSection === "project-work" ? "active" : ""
            }`}
          >
            <h2>Project Work</h2>

            <h3>What is Project Work?</h3>
            <p>
              Extended investigations of meaningful questions that integrate
              multiple disciplines. Projects are both:
            </p>
            <ul>
              <li>
                <strong>A competency students develop</strong> (planning,
                sustained inquiry, managing setbacks)
              </li>
              <li>
                <strong>The vehicle for learning</strong> (authentic context
                where skills integrate)
              </li>
            </ul>

            <h3>Key Elements</h3>
            <ul>
              <li>
                <strong>Student-driven:</strong> Questions emerge from student
                interests/curiosities
              </li>
              <li>
                <strong>Sustained inquiry:</strong> Weeks or months, not days
              </li>
              <li>
                <strong>Real-world relevance:</strong> Authentic problems,
                audiences, contexts
              </li>
              <li>
                <strong>Integration:</strong> Naturally pulls in multiple
                disciplines
              </li>
              <li>
                <strong>Creation:</strong> Produces something tangible
                (performance, product, presentation)
              </li>
            </ul>

            <h3>Examples</h3>
            <ul>
              <li>
                <strong>Elementary:</strong> Building a chicken coop (math,
                engineering, biology, writing documentation)
              </li>
              <li>
                <strong>Middle School:</strong> Investigating local water
                quality (chemistry, ecology, data analysis, advocacy)
              </li>
              <li>
                <strong>High School:</strong> Creating a social enterprise
                (economics, marketing, ethics, accounting)
              </li>
            </ul>

            <h3>Adult Role</h3>
            <p>
              Adults help students identify viable projects, connect to
              resources/mentors, provide just-in-time instruction for needed
              skills, and support through inevitable challenges.
            </p>
          </div>

          <div
            className={`content-section ${
              activeSection === "free-play" ? "active" : ""
            }`}
          >
            <h2>Free Play: Non-Negotiable Time</h2>

            <h3>Why 1-2+ Hours Daily?</h3>
            <p>Free play is essential, not supplemental. It develops:</p>
            <ul>
              <li>
                <strong>Internal locus of control:</strong> "I shape my world"
              </li>
              <li>
                <strong>Emotional self-regulation:</strong> Managing
                frustration, disappointment
              </li>
              <li>
                <strong>Social skills:</strong> Negotiation, cooperation,
                conflict resolution
              </li>
              <li>
                <strong>Creativity & problem-solving:</strong> Open-ended
                challenges
              </li>
              <li>
                <strong>Intrinsic motivation:</strong> Doing things for inherent
                satisfaction
              </li>
            </ul>

            <h3>What Counts as Free Play?</h3>
            <ul>
              <li>
                <strong>Self-directed:</strong> Child chooses the activity
              </li>
              <li>
                <strong>Unstructured:</strong> No adult-imposed goals
              </li>
              <li>
                <strong>Intrinsically motivating:</strong> Done for its own sake
              </li>
            </ul>

            <h3>Examples</h3>
            <p>
              Building with blocks, imaginative play, climbing trees, drawing,
              making up games, reading for pleasure, tinkering with objects,
              playing with friends.
            </p>

            <h3>What Doesn't Count</h3>
            <p>
              Adult-directed activities (even if fun), structured sports/lessons,
              educational games with explicit learning goals.
            </p>

            <h3>Screen Time During Free Play</h3>
            <p>
              Limited (~1 hour daily for non-educational screens). Prioritize
              physical, social, and creative play.
            </p>
          </div>

          <div
            className={`content-section ${
              activeSection === "relationships" ? "active" : ""
            }`}
          >
            <h2>Relationship-Based Learning</h2>

            <h3>Foundation of Everything</h3>
            <p>
              Positive relationships between adults and students are the
              foundation for all learning. Without trust and connection, even
              the best curriculum falls flat.
            </p>

            <h3>Moving Beyond Rewards & Punishments</h3>
            <p>
              Instead of external control systems (sticker charts, timeouts,
              loss of privileges), Lifespace builds relationships based on:
            </p>
            <ul>
              <li>
                <strong>Mutual respect:</strong> Adults and students treat each
                other with dignity
              </li>
              <li>
                <strong>Trust:</strong> Students are believed and given agency
              </li>
              <li>
                <strong>Authentic care:</strong> Adults genuinely invest in
                student wellbeing
              </li>
              <li>
                <strong>Collaborative agreements:</strong> Expectations
                co-created, not imposed
              </li>
            </ul>

            <h3>Restorative Practices</h3>
            <p>
              When conflicts arise (and they will!), the focus is on{" "}
              <strong>repairing relationships</strong> rather than punishment:
            </p>
            <ul>
              <li>What happened?</li>
              <li>Who was affected?</li>
              <li>How can we repair the harm?</li>
              <li>What do we need to prevent this in the future?</li>
            </ul>

            <h3>Natural & Logical Consequences</h3>
            <p>Consequences should be about repair and learning, not suffering:</p>
            <ul>
              <li>
                <strong>Natural:</strong> Direct result of actions (you do not
                water plant → it wilts)
              </li>
              <li>
                <strong>Logical:</strong> Related to the problem (you break
                something → you help fix/replace it)
              </li>
            </ul>
          </div>

          <div
            className={`content-section ${
              activeSection === "starting" ? "active" : ""
            }`}
          >
            <h2>Getting Started with Lifespace Education</h2>

            <h3>Step 1: Choose Your Path</h3>
            <p>
              Decide whether you are implementing full homeschool, starting a
              microschool, or supplementing traditional school. Each path has
              different time/resource requirements.
            </p>

            <h3>Step 2: Set Up Learning Maps</h3>
            <p>
              Create a system for students to visualize and sequence their daily
              learning. Start simple—a whiteboard with sticky notes works fine.
              Involve students in the creation process.
            </p>

            <h3>Step 3: Establish Core Routines</h3>
            <ul>
              <li>
                <strong>Reading time:</strong> 30-40 minutes daily
              </li>
              <li>
                <strong>Math practice:</strong> 15-20 minutes focused work
              </li>
              <li>
                <strong>Free play:</strong> Protect 1-2 hours NO MATTER WHAT
              </li>
              <li>
                <strong>Screen breaks:</strong> After every 20-25 minute screen
                session
              </li>
            </ul>

            <h3>Step 4: Identify First Project</h3>
            <p>
              What is your student genuinely curious about? Start there. The
              project can be short (2-3 weeks) to build confidence.
            </p>

            <h3>Step 5: Connect with Community</h3>
            <p>
              Identify local resources: libraries, makerspaces, nature centers,
              mentors, other Lifespace families. Learning does not happen in
              isolation.
            </p>

            <h3>Most Important</h3>
            <p>
              <strong>Start messy. Iterate. Adjust.</strong> Lifespace Education
              is adaptive by design—you will figure out what works for your
              student through practice, not perfect planning.
            </p>
          </div>

          <div
            className={`content-section ${
              activeSection === "troubleshooting" ? "active" : ""
            }`}
          >
            <h2>Troubleshooting Common Challenges</h2>

            <h3>"My child isn't motivated to do anything!"</h3>
            <p>
              <strong>Cause:</strong> Often coming from a system that killed
              intrinsic motivation through external rewards/punishments.
            </p>
            <p>
              <strong>Solution:</strong> Give time. Protect free play. Follow
              genuine interests, even if they seem "unproductive." Connection
              before correction.
            </p>

            <h3>"We are not getting through all the work!"</h3>
            <p>
              <strong>Cause:</strong> Expectations too high, tasks taking longer
              than anticipated.
            </p>
            <p>
              <strong>Solution:</strong> Cut the list. Quality over quantity.
              Remember: the goal is developing skills and agency, not checking
              boxes.
            </p>

            <h3>"I do not know how to teach [subject]!"</h3>
            <p>
              <strong>Cause:</strong> Expecting yourself to be an expert teacher
              in all areas.
            </p>
            <p>
              <strong>Solution:</strong> You are a facilitator, not a walking
              encyclopedia. Use curricula, online resources, community experts,
              library. Model learning alongside your child.
            </p>

            <h3>"My child only wants screen time during free play!"</h3>
            <p>
              <strong>Cause:</strong> Screens are highly engaging; other options
              may not be readily available.
            </p>
            <p>
              <strong>Solution:</strong> Enforce limits (1 hour non-educational
              screens). Make other options more accessible (art supplies out,
              friends available, nature nearby). Brain breaks after every screen
              session.
            </p>

            <h3>"I feel like I am doing it wrong!"</h3>
            <p>
              <strong>Cause:</strong> Comparing to an idealized version or
              traditional school model.
            </p>
            <p>
              <strong>Solution:</strong> There is no "right" way. If your child
              is engaged, learning, and maintaining positive relationships, you
              are doing it right. Adjust based on your child's needs, not a
              checklist.
            </p>
          </div>

          <div
            className={`content-section ${
              activeSection === "six-pillars" ? "active" : ""
            }`}
          >
            <h2>The Six Pillars (What Students Develop)</h2>

            <h3>1. Critical Thinking</h3>
            <p>
              Analysis, synthesis, inference, evaluation. Information
              literacy—evaluating source credibility, identifying bias,
              distinguishing fact from opinion, navigating digital information
              safely.
            </p>
            <p>
              <strong>Develops through:</strong> Academic discussions,
              project-based investigations, real-world contexts, explicit
              instruction in thinking strategies.
            </p>

            <h3>2. Problem Solving</h3>
            <p>
              Identifying challenges, generating solutions, implementing
              strategies, iterating based on results. Moving from understanding
              to doing.
            </p>
            <p>
              <strong>Develops through:</strong> Project-based learning, design
              challenges, investigations/experiments, real-world application.
            </p>

            <h3>3. Core Competencies</h3>
            <p>
              Reading, writing, math, science, social studies. Strong
              foundations in essential skills.
            </p>
            <p>
              <strong>Develops through:</strong> ~2 hours daily focused
              instruction + immediate application in authentic contexts.
            </p>

            <h3>4. Expression</h3>
            <p>
              Taking ideas from mind and making them perceivable to others.
              Synthesis + transmission. Measured by clarity and effectiveness,
              not technical perfection.
            </p>
            <p>
              <strong>Any modality works:</strong> Written, spoken, visual,
              performed, built, coded.
            </p>

            <h3>5. Social-Emotional Learning (SEL)</h3>
            <p>
              Foundation for all other learning. Five competencies:
              self-awareness, self-management, social awareness, relationship
              skills, responsible decision-making.
            </p>
            <p>
              <strong>Develops through:</strong> Explicit lessons,
              relationship-based culture, restorative practices, growth mindset,
              mindfulness, collaborative work.
            </p>

            <h3>6. Project Work</h3>
            <p>
              Both a competency students develop and the vehicle through which
              all other learning happens.
            </p>
            <p>
              <strong>As competency:</strong> Planning, sustained inquiry,
              integrating disciplines, managing setbacks, collaborating,
              documenting/reflecting, completion.
            </p>
            <p>
              <strong>As vehicle:</strong> Authentic context where all other
              pillars integrate meaningfully.
            </p>
          </div>

          <div
            className={`content-section ${
              activeSection === "principles" ? "active" : ""
            }`}
          >
            <h2>Five Core Principles (How Learning Happens)</h2>

            <h3>1. Student Agency</h3>
            <p>
              Students make meaningful decisions about learning within
              supportive structure. Learning Maps operationalize this—students
              choose sequence of daily activities within adult-identified core
              responsibilities.
            </p>
            <p>
              <strong>Flexibility spectrum:</strong> Full agency → guided choice
              → reduced choice (based on student needs).
            </p>

            <h3>2. Real-World Relevance</h3>
            <p>
              Learning connects to authentic contexts, problems, and audiences.
            </p>
            <p>
              <strong>Examples:</strong> Community engagement (visiting local
              resources, connecting with community members), service learning,
              apprenticeships/mentorships, real problems without answer keys.
            </p>

            <h3>3. Integration Across Disciplines</h3>
            <p>
              Knowledge does not exist in subject silos. Projects naturally
              integrate reading, writing, math, science, social studies.
            </p>
            <p>
              <strong>Balance:</strong> Daily focused time on core skills +
              authentic application in projects.
            </p>

            <h3>4. Play & Exploration</h3>
            <p>
              Play is essential, not supplemental. 1-2+ hours daily of free play
              is non-negotiable.
            </p>
            <p>
              <strong>Develops:</strong> Internal locus of control, emotional
              regulation, social skills, creativity, problem-solving, intrinsic
              motivation.
            </p>

            <h3>5. Relationship-Based Learning</h3>
            <p>
              Positive relationships are the foundation for all learning. Moving
              beyond rewards/punishments to relationships built on mutual
              respect, trust, authentic care.
            </p>
            <p>
              <strong>When conflicts arise:</strong> Restorative practices
              (repair relationships) rather than punishment.
            </p>
          </div>

          <div
            className={`content-section ${
              activeSection === "assessment" ? "active" : ""
            }`}
          >
            <h2>Assessment Approach</h2>

            <h3>Assessment FOR Learning, Not OF Learning</h3>
            <p>
              Assessment informs instruction and supports growth—it does not
              judge or rank students.
            </p>

            <h3>Methods</h3>
            <ul>
              <li>
                <strong>Academic discussions:</strong> Conversations reveal
                thinking
              </li>
              <li>
                <strong>Project presentations:</strong> Students explain their
                work
              </li>
              <li>
                <strong>Portfolios:</strong> Collections showing growth over
                time
              </li>
              <li>
                <strong>Observation/documentation:</strong> Notes on student
                engagement, strategies, challenges
              </li>
              <li>
                <strong>Student self-assessment:</strong> Reflection on own
                learning
              </li>
            </ul>

            <h3>Comparing to Self, Not Others</h3>
            <p>
              Students are measured against their own previous performance, not
              against other students or grade-level standards.
            </p>

            <h3>Low Stakes—Feedback Not Judgment</h3>
            <p>
              The goal is helping students improve, not proving what they do not
              know.
            </p>

            <h3>Standardized Tests?</h3>
            <p>
              Optional. Can be useful as one data point but do not define
              student worth or capability.
            </p>
          </div>

          <div
            className={`content-section ${
              activeSection === "differentiation" ? "active" : ""
            }`}
          >
            <h2>Differentiation: Supporting All Learners</h2>

            <h3>Universal Design for Learning (UDL)</h3>
            <p>Framework for creating flexible learning environments:</p>
            <ul>
              <li>
                <strong>Multiple means of engagement:</strong> Different ways to
                spark interest and motivation
              </li>
              <li>
                <strong>Multiple means of representation:</strong> Presenting
                information in varied formats (text, visuals, audio, hands-on)
              </li>
              <li>
                <strong>Multiple means of action & expression:</strong> Allowing
                students to show what they know in different ways
              </li>
            </ul>

            <h3>Adjusting Support Levels</h3>
            <p>
              Lifespace allows dynamic shifting along a support spectrum based
              on student needs and context.
            </p>
            <ul>
              <li>
                <strong>High support:</strong> More structure, modeling, and
                scaffolds for students who need it
              </li>
              <li>
                <strong>Moderate support:</strong> Guided choice, shared
                planning, check-ins
