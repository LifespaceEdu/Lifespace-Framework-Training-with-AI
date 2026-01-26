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
                <strong>Multiple means of action &amp; expression:</strong>
                Allowing students to show what they know in different ways
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
              </li>
              <li>
                <strong>Low support:</strong> High autonomy, student-led
                planning, minimal scaffolds
              </li>
            </ul>

            <h3>Individual Needs</h3>
            <p>
              Differentiation in Lifespace includes sensory needs, language
              differences, neurodivergence, and diverse learning profiles. The
              goal is access to meaningful, challenging work for every student,
              not uniform pacing or materials.
            </p>
          </div>
        </main>

        {/* Chat UI */}
        <div
          className="chat-fab"
          onClick={() => setChatOpen(true)}
          aria-label="Open Lifespace AI assistant"
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 3C7.03 3 3 6.58 3 11c0 2.04.86 3.9 2.32 5.33L4 21l4.11-1.87C9 19.7 10.46 20 12 20c4.97 0 9-3.58 9-8s-4.03-9-9-9zm-1 10H8v-2h3V8l4 3-4 3z" />
          </svg>
        </div>

        <div className={`chat-window ${chatOpen ? "open" : ""}`}>
          <div className="chat-header">
            <h3>Lifespace AI Assistant</h3>
            <button
              className="chat-close"
              onClick={() => setChatOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
          <div className="chat-messages" ref={chatMessagesRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.role === "user" ? "user" : "assistant"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={inputValue}
              placeholder="Ask a question about Lifespace..."
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              disabled={isLoading}
            />
            <button onClick={sendMessage} disabled={isLoading}>
              {isLoading ? "Thinking..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
