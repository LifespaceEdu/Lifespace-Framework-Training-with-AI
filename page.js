'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [activeSection, setActiveSection] = useState('welcome');
  const [navOpen, setNavOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your Lifespace Education AI assistant. I have deep knowledge of the framework and can help you with specific questions about implementation, daily structure, handling challenges, and more. What would you like to know?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
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

    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    conversationHistory.current.push(userMessage);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: conversationHistory.current
        })
      });

      const text = await response.text();

let data;
try {
  data = JSON.parse(text);
} catch {
  setMessages(prev => [
    ...prev,
    {
      role: 'assistant',
      content:
        'Upstream error (not JSON): ' + text,
    },
  ]);
  setIsLoading(false);
  return;
}

   const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error('Raw response was not JSON:', text);
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: 'Upstream error (not JSON): ' + text,
          },
        ]);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.choices && data.choices[0] && data.choices[0].message) {
        const assistantMessage = data.choices[0].message;
        conversationHistory.current.push(assistantMessage);
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error: ' + error.message + '. Please try again.'
      }]);
      conversationHistory.current.pop();
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const ContentSection = ({ id, children }) => (
    <div className={`content-section ${activeSection === id ? 'active' : ''}`}>
      {children}
    </div>
  );

  return (
    <>
      <header>
        <div className="header-content">
          <h1>Lifespace Education</h1>
          <button className="menu-btn" onClick={() => setNavOpen(true)}>Menu</button>
        </div>
      </header>

      <div 
        className={`nav-overlay ${navOpen ? 'show' : ''}`}
        onClick={() => setNavOpen(false)}
      />
      
      <nav className={`nav-drawer ${navOpen ? 'open' : ''}`}>
        <div className="nav-header">
          <h2>Lifespace Guide</h2>
        </div>
        
        <div className="nav-section">
          <div className="nav-section-title">Getting Started</div>
          <a className="nav-link" onClick={() => navigateToSection('welcome')}>Welcome</a>
          <a className="nav-link" onClick={() => navigateToSection('what-is-lifespace')}>What is Lifespace?</a>
        </div>
      </nav>

      <main>
        <ContentSection id="welcome">
          <div className="welcome-screen">
            <h2>Lifespace Education</h2>
            <p>AI Trainer is working! Test the chat below.</p>
            <button className="quick-start-btn" onClick={() => navigateToSection('what-is-lifespace')}>Learn More</button>
          </div>
        </ContentSection>
        
        <ContentSection id="what-is-lifespace">
          <h2>What is Lifespace?</h2>
          <p>Add your content here.</p>
        </ContentSection>
      </main>

      <div className={`chat-container ${chatOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <h3>Ask Lifespace AI</h3>
          <button className="close-chat" onClick={() => setChatOpen(false)}>×</button>
        </div>
        <div className="chat-messages" ref={chatMessagesRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          ))}
        </div>
        {isLoading && (
          <div className="typing-indicator show">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
        <div className="chat-input-area">
          <textarea
            className="chat-input"
            placeholder="Ask about implementing Lifespace..."
            rows="3"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button 
            className="send-btn" 
            onClick={sendMessage}
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </div>

      <button 
        className={`chat-toggle ${chatOpen ? 'hidden' : ''}`}
        onClick={() => setChatOpen(true)}
      >
        💬
      </button>
    </>
  );
}
