‘use client’;

import { useState, useEffect, useRef } from ‘react’;

export default function Home() {
const [activeSection, setActiveSection] = useState(‘welcome’);
const [navOpen, setNavOpen] = useState(false);
const [chatOpen, setChatOpen] = useState(false);
const [messages, setMessages] = useState([
{
role: ‘assistant’,
content: “Hi! I’m your Lifespace Education AI assistant. I have deep knowledge of the framework and can help you with specific questions about implementation, daily structure, handling challenges, and more. What would you like to know?”
}
]);
const [inputValue, setInputValue] = useState(’’);
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

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
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
if (e.key === ‘Enter’ && !e.shiftKey) {
e.preventDefault();
sendMessage();
}
};

return (
<>
<header>
<div className="header-content">
<h1>Lifespace Education</h1>
<button className=“menu-btn” onClick={() => setNavOpen(true)}>Menu</button>
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
      <a className="nav-link" onClick={() => navigateToSection('how-learning-works')}>How Learning Works</a>
      <a className="nav-link" onClick={() => navigateToSection('three-paths')}>Three Paths</a>
    </div>

    <div className="nav-section">
      <div className="nav-section-title">Daily Structure & Learning Maps</div>
      <a className="nav-link" onClick={() => navigateToSection('learning-maps')}>Learning Maps</a>
      <a className="nav-link" onClick={() => navigateToSection('daily-structure')}>Daily Structure</a>
    </div>

    <div className="nav-section">
      <div className="nav-section-title">Core Competencies</div>
      <a className="nav-link" onClick={() => navigateToSection('core-skills')}>Core Skills</a>
    </div>

    <div className="nav-section">
      <div className="nav-section-title">Key Learning Approaches</div>
      <a className="nav-link" onClick={() => navigateToSection('project-work')}>Project Work</a>
      <a className="nav-link" onClick={() => navigateToSection('free-play')}>Free Play</a>
      <a className="nav-link" onClick={() => navigateToSection('relationships')}>Relationships</a>
    </div>

    <div className="nav-section">
      <div className="nav-section-title">Making It Work</div>
      <a className="nav-link" onClick={() => navigateToSection('starting')}>Starting</a>
      <a className="nav-link" onClick={() => navigateToSection('troubleshooting')}>Troubleshooting</a>
    </div>

    <div className="nav-section" style={{marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #333'}}>
      <div className="nav-section-title">Six Pillars</div>
      <a className="nav-link" onClick={() => navigateToSection('six-pillars')}>All Six Pillars</a>
    </div>

    <div className="nav-section">
      <div className="nav-section-title">Principles & Methods</div>
      <a className="nav-link" onClick={() => navigateToSection('principles')}>Core Principles</a>
    </div>

    <div className="nav-section">
      <div className="nav-section-title">Assessment</div>
      <a className="nav-link" onClick={() => navigateToSection('assessment')}>Assessment Approach</a>
    </div>

    <div className="nav-section">
      <div className="nav-section-title">Differentiation</div>
      <a className="nav-link" onClick={() => navigateToSection('differentiation')}>Individual Needs</a>
    </div>
  </nav>

  <main>
    {/* Welcome Section */}
    <div className={`content-section ${activeSection === 'welcome' ? 'active' : ''}`}>
      <div className="welcome-screen">
        <h2>Lifespace Education</h2>
        <p>Choose a category to explore:</p>

        <div style={{margin: '2rem 0'}}>
          <h3 style={{color: 'var(--primary)', marginBottom: '1rem'}}>Primary Categories</h3>
          <button className="quick-start-btn" onClick={() => navigateToSection('what-is-lifespace')}>Getting Started</button>
          <button className="quick-start-btn" onClick={() => navigateToSection('learning-maps')}>Daily Structure & Learning Maps</button>
          <button className="quick-start-btn" onClick={() => navigateToSection('core-skills')}>Core Competencies</button>
          <button className="quick-start-btn" onClick={() => navigateToSection('project-work')}>Key Learning Approaches</button>
          <button className="quick-start-btn" onClick={() => navigateToSection('starting')}>Making It Work</button>
        </div>

        <div style={{margin: '2rem 0'}}>
          <h3 style={{color: 'var(--text-dim)', marginBottom: '1rem'}}>Framework Categories</h3>
          <button className="quick-start-btn" onClick={() => navigateToSection('six-pillars')}>Six Pillars</button>
          <button className="quick-start-btn" onClick={() => navigateToSection('principles')}>Principles & Methods</button>
          <button className="quick-start-btn" onClick={() => navigateToSection('assessment')}>Assessment</button>
          <button className="quick-start-btn" onClick={() => navigateToSection('differentiation')}>Differentiation</button>
        </div>

        <p style={{marginTop: '2rem'}}><strong>Have questions?</strong> Click the chat button in the bottom right to ask the Lifespace AI about implementing this approach for your specific situation.</p>
      </div>
    </div>

    {/* What is Lifespace Section */}
    <div className={`content-section ${activeSection === 'what-is-lifespace' ? 'active' : ''}`}>
      <h2>What is Lifespace Education?</h2>
      <p>Lifespace Education is a way of organizing your child's whole day so that real learning happens in the middle of real life, instead of trying to recreate school at home. It treats your child's "lifespace"—all the places, people, activities, and moments they move through—as the actual classroom, and focuses on giving them strong tools (reading, writing, math, thinking, relationships) they can use anywhere.</p>
      
      <p>Instead of six hours of seatwork, Lifespace uses short, focused practice for core skills and then lets those skills show up in projects, play, and everyday family life.</p>
      
      <p><strong>Right now, as you read this, your child is learning.</strong> They're learning how objects balance, how shadows move, which words get adults to respond, how their body feels when they're bored versus engaged. The question isn't "how do I make my child learn?" Your child cannot stop learning. The real question is: "What are they learning, and is it what they need?"</p>
    </div>

    {/* How Learning Works Section */}
    <div className={`content-section ${activeSection === 'how-learning-works' ? 'active' : ''}`}>
      <h2>How Learning Actually Works</h2>
      
      <p>Traditional schooling has convinced us that learning happens in specific places (classrooms), at specific times (7 AM–3 PM), in specific ways (sitting still, following instructions, completing worksheets). This is a profound misunderstanding that separates children from the actual process of learning and from life itself.</p>

      <p><strong>Learning is happening constantly.</strong> In play. In conversation. In observation. In experimentation. In boredom. In frustration. In success. In failure.</p>

      <p>The Lifespace Education approach doesn't create learning—learning is already happening. Lifespace is about being intentional about what children learn and giving them the tools they need to learn anything they choose for the rest of their lives.</p>

      <h3>The Shift You Need to Make</h3>
      <p>Stop thinking: "How do I fit 6 hours of school into my home?"</p>
      <p>Start thinking: "My child is already learning constantly. I just need to ensure they develop the core tools (reading, math, critical thinking) they need to learn anything they choose."</p>

      <p>This shift moves you from controlling to facilitating, from teaching to guiding, from filling time to protecting time, from delivering curriculum to creating conditions for learning.</p>

      <h3>Core Skills in Short, Focused Blocks</h3>
      <p>Your child does not need six hours of seat-work a day to build strong foundations. They need short, focused blocks of clear practice and feedback, surrounded by a day rich in play, projects, and real life.</p>

      <p>In practical terms:</p>
      <ul>
        <li>A brief daily block for reading skills: phonics or decoding practice, fluency work, and simple comprehension strategies</li>
        <li>A brief block for math: fact practice, a few problems that actually require thinking</li>
        <li>Occasional short mini-lessons in writing, science, or thinking tools tied to current projects</li>
      </ul>

      <p>Each block is small enough that a real child can stay present for it. The goal is not to fill time; the goal is to touch the most important tools with real attention, again and again, over months and years.</p>

      <h3>What About the Rest of the Day?</h3>
      <p>Once core-skill blocks are finished, the bulk of the day can be:</p>
      <ul>
        <li><strong>Free play</strong> that looks "unstructured" from the outside but is where executive function, creativity, problem-solving, emotional regulation, and social negotiation are built</li>
        <li><strong>Project work</strong> where children read to answer real questions, use math to solve real problems, write and speak to communicate what they've discovered</li>
        <li><strong>Family and community life</strong> where they constantly see how knowledge gets used in real situations</li>
      </ul>

      <p>A child who spends a small portion of each day on focused skill practice and generous time in rich play and project work is not "behind" a child who sits in a classroom for six hours. In many cases, that child is learning more deeply, because the learning is internally motivated, immediately applied, and integrated.</p>
    </div>

    {/* Three Paths Section */}
    <div className={`content-section ${activeSection === 'three-paths' ? 'active' : ''}`}>
      <h2>Three Ways to Use This Approach</h2>
      
      <h3>Path 1: Full Homeschool (You're the Primary Teacher)</h3>
      <p><strong>What this looks like:</strong> You design daily structure, teach core skills or hire tutors, facilitate project work. Active teaching/facilitating: 2–4 hours daily in short blocks.</p>
      <p><strong>Cost:</strong> $0–500/month</p>
      <p><strong>Who this works for:</strong> Parents who work from home with flexibility, stay-at-home parents, parents whose children respond well to them as teachers.</p>

      <h3>Path 2: Microschool (Hire a Lifespace-Trained Teacher)</h3>
      <p><strong>What this looks like:</strong> 3–5 families pool resources and hire a teacher trained in Lifespace approach. Meets 3–5 days per week, 4–6 hours per day.</p>
      <p><strong>Cost:</strong> $300–800/month per family</p>
      <p><strong>Who this works for:</strong> Parents who work full-time outside the home, parents who want community but can't do it alone, families who want expertise but not traditional school.</p>

      <h3>Path 3: Supplementing Traditional School</h3>
      <p><strong>What this looks like:</strong> Child attends traditional school; you use Lifespace principles for afternoons, evenings, weekends, and summers.</p>
      <p><strong>Cost:</strong> $0–100/month</p>
      <p><strong>Who this works for:</strong> Parents who can't homeschool, parents who want to counteract traditional school's problems, parents testing out approach before fully committing.</p>
    </div>

    {/* Learning Maps Section */}
    <div className={`content-section ${activeSection === 'learning-maps' ? 'active' : ''}`}>
      <h2>Learning Maps: The Core Tool for Daily Structure</h2>
      
      <p>A Learning Map is an interactive, visual representation of a child's daily learning journey, co-created by parent and child.</p>

      <h3>What it is NOT:</h3>
      <ul>
        <li>A rigid schedule where every minute is dictated</li>
        <li>A list of assignments the child must complete in order</li>
        <li>An adult-controlled timeline the child follows passively</li>
      </ul>

      <h3>What it IS:</h3>
      <ul>
        <li>A menu of activities and responsibilities for the day</li>
        <li>A framework where the child chooses the ORDER they tackle tasks</li>
        <li>A tool that builds executive function, planning, and ownership</li>
        <li>A visual representation that reduces anxiety about "what's next"</li>
      </ul>

      <h3>Two Levels of Individualization</h3>
      <p><strong>The parent structures the map based on:</strong> the child's energy patterns, fixed commitments, core competencies needed, and family needs.</p>
      <p><strong>Within the parent's structure, the student decides:</strong> order of activities, timing, brain break selection, path through the day.</p>

      <h3>Two Main Approaches</h3>
      <p><strong>Visual/Tactile Method (Younger/Visual Learners):</strong> Parent creates a physical map (laminated city, castle interior, island, adventure path). Map has multiple locations where activities can happen. Parent creates activity cards that fit into locations. Student decides their path through the map.</p>

      <p><strong>List/Scheduler Method (Older/Independent Learners):</strong> Parent writes activities on whiteboard or paper with some items having required sequence. Student copies the list, deciding order for choice items and following their written plan.</p>

      <h3>The Choice Flexibility Spectrum</h3>
      <p>Not all children need or want the same level of choice. Learning Maps can be adjusted:</p>
      <ul>
        <li><strong>Full Student Agency:</strong> Parent provides menu; student creates entire plan independently</li>
        <li><strong>Guided Choice:</strong> Parent provides menu with SOME sequential requirements; student makes most decisions</li>
        <li><strong>Reduced Choice:</strong> Parent creates complete schedule based on what they think will work; present to child for input</li>
      </ul>
      <p>This isn't about age. Some 12-year-olds need reduced choice on hard days. Some 7-year-olds thrive with full agency.</p>

      <h3>Screen Time & Brain Break Rules</h3>
      <ul>
        <li>Maximum block length: 15–25 minutes</li>
        <li>No back-to-back screen time (every screen block MUST be followed by a brain break)</li>
        <li>Brain break = feet touch earth, sun goes in eyes, analog art project, or physical activity</li>
      </ul>
    </div>

    {/* Daily Structure Section */}
    <div className={`content-section ${activeSection === 'daily-structure' ? 'active' : ''}`}>
      <h2>Determining Your Child's Daily Structure</h2>
      
      <p>One of the most persistent myths of traditional schooling is that all children learn best on the same schedule. This is absurd. Your child's optimal daily structure is NOT the same as another child's.</p>

      <h3>Finding Your Child's Natural Rhythms</h3>
      <p>Spend 2–4 weeks tracking your child's natural energy and focus patterns:</p>
      <ul>
        <li>When is your child most alert and focused?</li>
        <li>When does focus decline?</li>
        <li>When do they naturally seek movement?</li>
        <li>How does physical wellbeing affect their patterns?</li>
      </ul>
      <p>This data drives your structure decisions.</p>

      <h3>Pattern 1: Morning-Heavy Academic Load</h3>
      <p><strong>Who this fits:</strong> Children who wake alert and focused, children whose energy declines through the day, children managing chronic illness.</p>
      <p><strong>Why this works:</strong> Leverages peak morning energy for demanding tasks; afternoons are lighter (matches declining stamina); parent can focus on work during low-demand afternoon hours.</p>

      <h3>Pattern 2: Afternoon-Heavy Academic Load</h3>
      <p><strong>Who this fits:</strong> Children who wake slowly and build energy, night owls, children who need morning movement to activate.</p>
      <p><strong>Why this works:</strong> Honors slow-to-wake rhythm; uses afternoon peak energy for demanding tasks; parent can work during low-demand morning hours.</p>

      <h3>Pattern 3: Distributed Throughout Day</h3>
      <p><strong>Who this fits:</strong> Children with consistent energy, children who need variety and movement, younger children with shorter attention spans.</p>
      <p><strong>Why this works:</strong> Never asks for sustained focus (matches shorter attention span); constant movement prevents restlessness; parent can work in 30–45 minute chunks throughout day.</p>

      <h3>Your Structure Is Valid</h3>
      <p>Whatever structure emerges from YOUR child's data and YOUR family's needs is the right structure. The structure that works is the one that:</p>
      <ul>
        <li>Leverages your child's natural energy patterns</li>
        <li>Delivers core competencies effectively</li>
        <li>Allows parent to work/function</li>
        <li>Feels sustainable</li>
        <li>Protects free play and project time</li>
      </ul>
    </div>

    {/* Core Skills Section */}
    <div className={`content-section ${activeSection === 'core-skills' ? 'active' : ''}`}>
      <h2>Core Skills in Short, Focused Blocks</h2>
      
      <p>Core competencies—reading, writing, math, and science—receive focused attention daily while remaining integrated with project work and real-world application. The Lifespace approach dedicates approximately two hours per day to explicit skill instruction and practice, building strong foundations efficiently without consuming the entire learning day.</p>

      <h3>Reading (30-40 minutes daily)</h3>
      <p><strong>Reading Skills Practice (15-20 minutes, 3-5 times weekly):</strong></p>
      <ul>
        <li>Explicit, systematic phonics instruction</li>
        <li>Fluency development</li>
        <li>Vocabulary building</li>
        <li>Comprehension strategies</li>
      </ul>

      <p><strong>Independent Reading (15-20 minutes, daily):</strong></p>
      <ul>
        <li>Students choose books at appropriate reading levels</li>
        <li>Reading connects to project themes or personal interests</li>
        <li>Brief summaries to build comprehension</li>
      </ul>

      <h3>Writing (Varies by Age)</h3>
      <p><strong>Writing Instruction (15-20 minutes, 3-5 times weekly for upper elementary+):</strong></p>
      <ul>
        <li>Sentence construction and variety</li>
        <li>Paragraph organization</li>
        <li>Grammar and mechanics in context</li>
        <li>Writing processes (planning, drafting, revising)</li>
      </ul>

      <h3>Mathematics (15-20 minutes, 3-5 times weekly)</h3>
      <p><strong>Skills Practice and Automaticity:</strong></p>
      <ul>
        <li>Math facts (addition, subtraction, multiplication, division)</li>
        <li>Computational procedures</li>
        <li>Online adaptive platforms for personalized practice</li>
      </ul>

      <p><strong>Applied Mathematics (Throughout the day):</strong></p>
      <ul>
        <li>Measuring for building projects</li>
        <li>Calculating costs and budgeting</li>
        <li>Analyzing data from experiments</li>
        <li>Using geometry in design work</li>
      </ul>

      <h3>Science (Integrated throughout)</h3>
      <p>Unlike reading, writing, and math which receive dedicated practice time, science primarily develops through hands-on investigations and project work.</p>

      <h3>The Two-Hour Approach</h3>
      <p>This focused approach is supported by research demonstrating that concentrated, high-quality instruction produces better outcomes than extended periods of low-intensity practice. Skills are better retained when immediately applied in meaningful contexts.</p>
    </div>

    {/* Project Work Section */}
    <div className={`content-section ${activeSection === 'project-work' ? 'active' : ''}`}>
      <h2>Project-Based Learning</h2>
      
      <p>Project-Based Learning (PBL) is when students engage in extended investigation of meaningful questions or challenges.</p>

      <h3>Key Features:</h3>
      <ul>
        <li><strong>Student-directed:</strong> They choose topic or approach within a theme</li>
        <li><strong>Sustained inquiry:</strong> Unfolds over time</li>
        <li><strong>Real-world connection:</strong> Addresses actual questions or problems</li>
        <li><strong>Integration:</strong> Pulls in multiple subjects naturally</li>
        <li><strong>Creates something:</strong> Tangible product, presentation, solution</li>
      </ul>

      <h3>Example: Traditional vs. Project Approach</h3>
      <p><strong>Traditional:</strong> "Read Chapter 4 on ecosystems. Answer questions 1–10. Take quiz Friday."</p>
      <p><strong>Project:</strong> "Choose a local ecosystem. Observe it over 2 weeks. Create a field guide identifying 10 species and explaining how they interact. Present findings to the community center."</p>
      <p>Which approach teaches more? Which will the student remember in 5 years?</p>

      <h3>Why Project Work Is Superior Learning</h3>
      
      <p><strong>Integration Creates Meaning:</strong> When reading serves a purpose (researching for my field guide), it's meaningful. When math solves a problem (measuring the pond for my map), it matters. The real world doesn't work in isolated subject boxes.</p>

      <p><strong>Intrinsic Motivation:</strong> The student chose this ecosystem because it interests them. They're invested in creating a good field guide because it's THEIR creation.</p>

      <p><strong>Transfer of Learning:</strong> When a student investigates a real local ecosystem, they develop thinking skills that transfer. They've become someone who THINKS ecologically, not just someone who memorized ecology facts.</p>

      <p><strong>Development of Real Skills:</strong></p>
      <ul>
        <li>Research skills (finding reliable information, evaluating sources)</li>
        <li>Planning and project management</li>
        <li>Problem-solving (when something doesn't work as planned)</li>
        <li>Communication (explaining findings clearly)</li>
        <li>Collaboration (learning to work with others)</li>
        <li>Persistence (staying engaged over weeks)</li>
      </ul>

      <p><strong>Real Audiences and Accountability:</strong> When your field guide will be given to the community center for families to use, you care about clarity and accuracy. Real audiences raise stakes in ways that develop genuine communication and thinking skills.</p>
    </div>

    {/* Free Play Section */}
    <div className={`content-section ${activeSection === 'free-play' ? 'active' : ''}`}>
      <h2>Free Play & Exploration: Non-Negotiable Learning Time</h2>
      
      <p>Play is not supplemental to learning—it is essential for development, wellbeing, and cognitive growth.</p>

      <h3>The Importance of Free Play</h3>
      <p>Research documents a dramatic decline in children's opportunities for free play. This decline correlates with increased anxiety, depression, and decreased sense of control among children and adolescents.</p>

      <p>Free play, where children structure their own activities, is crucial for developing:</p>
      <ul>
        <li><strong>Internal Locus of Control:</strong> "I can affect what happens"</li>
        <li><strong>Emotional Self-Regulation:</strong> Play provides safe contexts for experiencing and managing emotions</li>
        <li><strong>Social Skills:</strong> Self-organized play requires negotiation, compromise, conflict resolution</li>
        <li><strong>Creativity and Problem-Solving:</strong> Unstructured time allows exploration, experimentation, imagination</li>
        <li><strong>Intrinsic Motivation:</strong> Play is inherently motivated—children do it because they want to</li>
      </ul>

      <h3>Free Play in Lifespace</h3>
      <p>Lifespace dedicates <strong>1–2 hours daily</strong> to free play and exploration. This is not recess as reward for completing work but essential time protected in the daily structure.</p>

      <p>Students choose how to spend this time: outdoor exploration and physical play, building projects, creative arts, reading for pleasure, playing games, tinkering with materials, or simply relaxing.</p>

      <p>Adults are present but not directing. They ensure safety, provide materials, and remain available if students seek assistance, but they don't structure the activity or impose learning objectives.</p>

      <h3>Brain Breaks Throughout the Day</h3>
      <p>Beyond dedicated free play time, Lifespace requires brain breaks throughout the learning day. Any screen-based activity must be followed by a brain break before returning to screens.</p>

      <p>These breaks aren't wasted time—they're essential for processing learning, maintaining focus, regulating energy, and preventing cognitive fatigue.</p>

      <h3>Play as Brain Development</h3>
      <p>Neuroscience research demonstrates that play literally builds brain architecture. The kind of self-directed exploration that happens in play strengthens executive function, emotional regulation, and social cognition in ways that direct instruction cannot replicate.</p>

      <p><strong>Play is not what students do when learning is finished—play is how fundamental learning happens.</strong></p>
    </div>

    {/* Relationships Section */}
    <div className={`content-section ${activeSection === 'relationships' ? 'active' : ''}`}>
      <h2>Relationship-Based Learning</h2>
      
      <p>Learning happens in the context of relationships. Lifespace Education deliberately builds positive relationships between students, adults, peers, and community members as the foundation for all learning.</p>

      <h3>Moving Beyond Traditional Classroom Management</h3>
      <p>Traditional schooling often positions teachers and students in adversarial relationships. Adults use external rewards (praise, privileges, grades) and punishments (loss of recess, detention, poor grades) to manage behavior and motivate compliance.</p>

      <p>This creates problems:</p>
      <ul>
        <li>Students become dependent on external control rather than developing self-regulation</li>
        <li>Punishments damage relationships and increase resistance</li>
        <li>The focus shifts from learning to compliance</li>
        <li>Students who struggle face increasing punishment rather than support</li>
      </ul>

      <h3>Relationship-Building as Foundation</h3>
      <p>Lifespace takes a radically different approach: relationships are not something to manage but the foundation to build upon.</p>

      <p>Learning communities are built on:</p>
      <ul>
        <li><strong>Mutual Respect:</strong> Adults treat students with genuine respect—listening to their perspectives, honoring their feelings, taking their ideas seriously</li>
        <li><strong>Trust:</strong> Adults trust that students want to learn and grow. Students learn they can trust adults to support rather than punish them</li>
        <li><strong>Authentic Care:</strong> Adults genuinely care about students as whole people. Students feel seen, valued, and supported</li>
        <li><strong>Collaborative Agreements:</strong> Rather than imposing rules, learning communities co-create agreements about how to work together</li>
      </ul>

      <h3>Restorative Practices</h3>
      <p>When conflicts arise or agreements are broken—and they will be—Lifespace uses restorative practices rather than punishment.</p>

      <p><strong>The Restorative Circle:</strong> When disruptions occur, the community comes together to understand what happened, how people were affected, what needs to be repaired, and how to move forward. The goal is not punishment but accountability, empathy development, relationship repair, and learning better ways of handling challenging situations.</p>

      <p><strong>Addressing Underlying Needs:</strong> Rather than just stopping the behavior, adults work to address underlying needs. A student who disrupts might be seeking attention, feeling overwhelmed, struggling with material, or experiencing something difficult outside school.</p>

      <h3>Positive Relationships Enable Learning</h3>
      <p>When students feel safe, respected, and supported, they:</p>
      <ul>
        <li>Take intellectual risks necessary for learning</li>
        <li>Ask questions when confused</li>
        <li>Persist through difficult challenges</li>
        <li>Accept feedback and use it to improve</li>
        <li>Collaborate effectively with peers</li>
        <li>Develop empathy and perspective-taking</li>
        <li>Build intrinsic motivation and self-regulation</li>
      </ul>

      <p>Conversely, when students feel controlled, judged, or threatened, their stress responses activate, making complex learning neurologically more difficult. Relationship-based approaches aren't just nice—they're essential for the kind of higher-order thinking Lifespace develops.</p>
    </div>

    {/* Starting Section */}
    <div className={`content-section ${activeSection === 'starting' ? 'active' : ''}`}>
      <h2>Starting Where You Are</h2>
      
      <p>You don't need to overhaul your entire life to start using Lifespace principles. You can begin exactly where you are, with what you have.</p>

      <h3>If you're using Path 1 (Full Homeschool):</h3>
      <ul>
        <li>Start with ONE short core-skill block per day (maybe just 15 minutes of reading practice)</li>
        <li>Protect one dedicated block for free play or projects (even 30 minutes counts)</li>
        <li>Try creating a simple Learning Map or daily rhythm</li>
        <li>Notice what works; adjust what doesn't</li>
        <li>Expand gradually</li>
      </ul>

      <h3>If you're using Path 2 (Microschool):</h3>
      <ul>
        <li>Start conversations with other families about pooling resources</li>
        <li>Think about what a teacher would need to know about your child</li>
        <li>Use the Learning Maps and daily structure ideas to shape what you're looking for</li>
        <li>Remember: the teacher implements while you work; your role is connection and support</li>
      </ul>

      <h3>If you're using Path 3 (Supplementing Traditional School):</h3>
      <ul>
        <li>Protect one afternoon block for real project work or free play (not homework)</li>
        <li>Create a simple weekend or summer project rhythm</li>
        <li>Use the relationship principles at home to offset what school might be doing</li>
        <li>Remember: you're not adding more "school"; you're creating space for real learning</li>
      </ul>

      <h3>The Minimum Viable Week</h3>
      <p>If you're overwhelmed and don't know where to start:</p>
      <p><strong>Monday–Friday:</strong> One 15–20 minute focused core-skill block (reading or math) + at least 30 minutes of free play or project time + normal family life</p>
      <p><strong>Weekend:</strong> One small project (building something, investigating something, making something) + protected free play time</p>
      <p>That's it. If you do that consistently, you're doing Lifespace.</p>
      <p>Everything else—more refined Learning Maps, multiple subjects, elaborate projects—can build from there.</p>
    </div>

    {/* Troubleshooting Section */}
    <div className={`content-section ${activeSection === 'troubleshooting' ? 'active' : ''}`}>
      <h2>What to Do When Things Go Wrong</h2>
      
      <p>Things will go wrong. Days will blow up. Your child will refuse to cooperate. You'll lose your patience. This is not failure. This is Tuesday.</p>

      <h3>When your child shuts down or refuses to engage:</h3>
      <p><strong>Instead of:</strong> "You have to do your work or you'll fall behind," or escalating consequences</p>
      <p><strong>Try:</strong> "I notice you're shutting down. What do you need right now? Do you need a break? Do you need to move? Do you need to talk about something?"</p>
      
      <p>Often the refusal is telling you something: they're overwhelmed, they didn't sleep well, something emotional is happening, they're not ready for that task right now, they need to move more than they need academics.</p>
      <p>Listen. Adjust. Move forward.</p>

      <h3>When you lose your patience:</h3>
      <p>This happens. You're not the problem. Exhaustion and frustration are real.</p>
      <p>When it happens:</p>
      <ul>
        <li>Take a break (even 5 minutes in another room)</li>
        <li>Return and be honest: "I got frustrated. I'm sorry. Let's try again."</li>
        <li>Model what you want: taking breaks when overwhelmed, managing your own emotions, trying again</li>
      </ul>
      <p>Your child will learn more from seeing you handle your own dysregulation than from anything else.</p>

      <h3>When plans completely fall apart:</h3>
      <p>Some days (or weeks) will derail. Illness. Appointments. Family stress. Emotional overwhelm. Medical flares.</p>
      <p>On these days:</p>
      <ul>
        <li>Forget the plan</li>
        <li>Focus on: Is everyone safe? Is everyone fed? Is everyone managing?</li>
        <li>That's the whole day. You're done.</li>
        <li>Tomorrow you can try again</li>
      </ul>
      <p>That's okay. That's legitimate. That's real life.</p>

      <h3>What If I Can't Do Full Homeschool Right Now?</h3>
      <p>You may be working full-time with no flexibility, a single parent with zero margin, managing a child with complex needs, in a situation where your family simply needs school, or trying this and realizing it's not working for you.</p>

      <p>If full homeschool isn't viable right now, remember:</p>
      <ul>
        <li>Path 3 (supplementing) is a legitimate way to use these principles</li>
        <li>Even one hour a week of real project-based learning is better than zero</li>
        <li>Using these ideas on weekends and summers makes a difference</li>
        <li>Teaching your child to think, question, and learn independently happens in small moments, not just in formal school</li>
      </ul>

      <h3>The Long View</h3>
      <p>This isn't about creating the perfect homeschool or the perfect educational system. It's about raising children who:</p>
      <ul>
        <li>Believe they can learn anything</li>
        <li>Know how to ask good questions and find answers</li>
        <li>Value relationships over compliance</li>
        <li>Can think independently</li>
        <li>Understand that learning is a lifelong process that happens everywhere</li>
        <li>See themselves as agents of their own learning rather than passive recipients</li>
      </ul>
      <p>You don't need to be a perfect educator to give your child this. You just need to make sure they're touching the core tools, give them lots of time to explore and play, be present and relationship-oriented, and trust their capacity to learn.</p>
      <p>The rest will unfold.</p>
    </div>

    {/* Six Pillars Section */}
    <div className={`content-section ${activeSection === 'six-pillars' ? 'active' : ''}`}>
      <h2>The Six Pillars</h2>
      
      <p>Lifespace Education develops students across six essential pillars that work together to create capable, confident learners.</p>

      <h3>Pillar 1: Critical Thinking</h3>
      <p>Critical thinking encompasses analysis, synthesis, inference, and evaluation—the skills that enable students to navigate complexity, question assumptions, and form well-reasoned perspectives. In an era of unprecedented information access and misinformation, critical thinking is essential for survival in modern society.</p>
      
      <p><strong>Information literacy sits at the heart of critical thinking.</strong> Students explicitly learn to evaluate source credibility, identify bias, distinguish fact from opinion, navigate digital information landscapes safely, and use information responsibly.</p>

      <h3>Pillar 2: Problem Solving</h3>
      <p>Problem solving is the process of identifying challenges, generating potential solutions, implementing strategies, and iterating based on results. Students face challenges we cannot predict, using technologies that don't yet exist. They must develop the capacity to tackle novel problems independently.</p>

      <p>Problem solving develops through project-based learning, design challenges, investigations and experiments, and real-world application. Students learn to break complex problems into manageable parts, brainstorm without judgment, evaluate trade-offs, and manage setbacks constructively.</p>

      <h3>Pillar 3: Core Competencies</h3>
      <p>Core competencies are the foundational academic skills: reading, writing, mathematics, science, and social studies. These aren't separate subjects to master in isolation but interconnected literacies that provide students access to knowledge and tools for thinking.</p>

      <p>Lifespace dedicates approximately two hours per day to explicit skill instruction and practice, building strong foundations efficiently. Skills develop through both focused practice and authentic application in meaningful contexts.</p>

      <h3>Pillar 4: Expression</h3>
      <p>Expression is the ability to take a powerful idea from your mind and make it real for others to perceive. It encompasses synthesis (bringing complex concepts together into coherent vision) and transmission (communicating that vision clearly).</p>

      <p>Expression is measured by the clarity and quality of the idea itself, and the effectiveness of its transmission to others. The modality doesn't matter—written, spoken, visual, performed, built, coded, or any other form. What matters is whether the idea successfully moved from one person's understanding into another's.</p>

      <h3>Pillar 5: Social-Emotional Learning (SEL)</h3>
      <p>SEL is the foundation upon which all other learning rests. It encompasses the processes through which students develop and apply knowledge, attitudes, and skills necessary to understand and manage emotions, set and achieve positive goals, feel and show empathy, establish and maintain healthy relationships, and make responsible decisions.</p>

      <p>The five core SEL competencies are: self-awareness, self-management, social awareness, relationship skills, and responsible decision-making. SEL develops through both explicit instruction and embedded practice throughout the learning day.</p>

      <h3>Pillar 6: Project Work</h3>
      <p>Project Work occupies a unique position: it is both a competency students develop and the primary vehicle through which all other learning happens. As a competency, project work encompasses the abilities to plan and manage extended investigations, sustain inquiry over time, integrate multiple disciplines, work independently and collaboratively, iterate through setbacks, and bring complex work to completion.</p>

      <p>As a vehicle, project work provides the authentic context where critical thinking, problem solving, core competencies, expression, and SEL all come together in meaningful application.</p>
    </div>

    {/* Principles Section */}
    <div className={`content-section ${activeSection === 'principles' ? 'active' : ''}`}>
      <h2>Principles & Methods</h2>
      
      <p>The six pillars describe what students develop through Lifespace Education. The principles and methods describe how learning happens—the distinctive approaches that characterize Lifespace.</p>

      <h3>Student Agency</h3>
      <p>Student agency—the capacity to make meaningful decisions about one's own learning—sits at the heart of Lifespace Education. Students are not passive recipients of predetermined curriculum but active agents who shape their learning journeys through choice in project topics, decisions about daily schedules, selection of learning resources, and determination of how to demonstrate understanding.</p>

      <p>Agency is not the same as complete autonomy. Adults provide structure, guidance, resources, and expertise while students make genuine decisions within that supportive framework.</p>

      <h3>Real-World Relevance</h3>
      <p>Learning in Lifespace Education connects to authentic contexts, real problems, and genuine communities. Students don't learn content in isolation to possibly apply it someday—they engage with actual questions, address real challenges, and interact with people beyond their immediate learning community.</p>

      <p>This includes community engagement, service learning, apprenticeships and mentorships, authentic audiences, and real problems without answer keys.</p>

      <h3>Integration Across Disciplines</h3>
      <p>Knowledge and skills don't exist in separate subject silos in the real world, and they shouldn't in learning environments either. Lifespace Education intentionally integrates disciplines through project work, allowing students to see connections, apply knowledge purposefully, and develop holistic understanding.</p>

      <h3>Play and Exploration</h3>
      <p>Play is not supplemental to learning—it is essential for development, wellbeing, and cognitive growth. Free play develops internal locus of control, emotional self-regulation, social skills, creativity and problem-solving, and intrinsic motivation.</p>

      <p>Lifespace dedicates 1-2 hours daily to free play and exploration as non-negotiable, essential time protected in the daily structure.</p>

      <h3>Relationship-Based Learning</h3>
      <p>Learning happens in the context of relationships. Lifespace Education deliberately builds positive relationships between students, adults, peers, and community members as the foundation for all learning. This represents a fundamental departure from traditional classroom management approaches that rely on rewards, punishments, and coercion.</p>

      <p>Learning communities are built on mutual respect, trust, authentic care, and collaborative agreements. When conflicts arise, restorative practices repair relationships rather than imposing consequences.</p>
    </div>

    {/* Assessment Section */}
    <div className={`content-section ${activeSection === 'assessment' ? 'active' : ''}`}>
      <h2>Assessment</h2>
      
      <p>Assessment in Lifespace Education serves fundamentally different purposes than in traditional schooling. Rather than sorting, ranking, or gatekeeping, assessment serves learning—helping students understand their own growth, identify next steps, and develop metacognitive awareness of their learning processes.</p>

      <h3>Assessment FOR Learning, Not OF Learning</h3>
      <p>Traditional assessment measures what students have learned at a fixed point, compares students to each other or to standardized benchmarks, assigns grades that label students, and creates high-stakes consequences.</p>

      <p>Lifespace assessment provides information that guides instruction and student growth, compares students to their own previous performance, describes what students can do and what they're working toward, maintains low stakes, creates learning opportunities, and focuses on growth and emerging capabilities.</p>

      <h3>Assessment Methods</h3>
      <p><strong>Academic Discussions:</strong> Conversations about learning reveal understanding in ways written tests cannot. One-on-one discussions probe depth of understanding, critical thinking and reasoning, ability to articulate ideas, and connections across concepts.</p>

      <p><strong>Project Presentations:</strong> Students demonstrate learning by presenting projects to authentic audiences, showing understanding of content, expression skills, synthesis, and response to questions.</p>

      <p><strong>Portfolios:</strong> Collections of work over time show growth and development. Portfolios include examples of work from different points in time, project documentation, reflections on learning, and self-assessments.</p>

      <p><strong>Observation and Documentation:</strong> Adults observe student learning throughout daily activities and document what they notice about application of skills, work habits and learning strategies, social-emotional development, and areas of strength and needed support.</p>

      <p><strong>Student Self-Assessment:</strong> Students develop metacognitive awareness by assessing their own learning, recognizing strengths and challenges, setting goals, and reflecting on their learning processes.</p>

      <h3>Stance on Standardized Testing</h3>
      <p>Lifespace Education does not require standardized testing but recognizes that families and students may choose to use it for specific purposes. Standardized tests can be used formatively as one data point among many to identify specific skill gaps, provide external validation, or prepare for contexts where tests are required.</p>

      <p>When used, standardized tests are treated as information, not judgment. They provide snapshot data about specific skills at a specific moment, but don't define student worth, intelligence, or potential.</p>
    </div>

    {/* Differentiation Section */}
    <div className={`content-section ${activeSection === 'differentiation' ? 'active' : ''}`}>
      <h2>Differentiation</h2>
      
      <p>Every student is unique—different strengths, challenges, interests, learning styles, developmental timelines, and needs. Lifespace Education is inherently differentiated because it responds to individual students rather than delivering standardized content to groups.</p>

      <h3>Universal Design for Learning Framework</h3>
      <p>Lifespace Education aligns with the Universal Design for Learning (UDL) framework, which recognizes that learning environments should be designed from the outset to accommodate diverse learners rather than requiring "accommodations" as afterthoughts.</p>

      <p>UDL provides three core principles:</p>
      <ul>
        <li><strong>Multiple Means of Representation:</strong> Students access information through varied modalities</li>
        <li><strong>Multiple Means of Action and Expression:</strong> Students demonstrate understanding through varied modes</li>
        <li><strong>Multiple Means of Engagement:</strong> Students engage with learning through different motivations and interests</li>
      </ul>

      <h3>Individual and Small Group Instruction</h3>
      <p>Lifespace structures naturally support individualized and small group instruction. Most instruction happens one-on-one or in very small groups, which allows instruction paced to individual readiness, immediate identification and addressing of misconceptions, teaching matched to learning style, and flexibility to follow student questions.</p>

      <h3>Supporting Students with Specific Needs</h3>
      
      <p><strong>Students with Learning Differences:</strong> Students with dyslexia, dyscalculia, dysgraphia, or processing challenges benefit from specialized curricula and approaches, strength-based focus, and the Expression pillar allowing demonstration of sophisticated thinking without being limited by specific skill deficits.</p>

      <p><strong>Neurodivergent Students:</strong> Students with autism, ADHD, sensory processing differences, or other neurodivergence benefit from structure matched to needs (some need highly consistent routines, some need frequent movement breaks), interest-based learning allowing deep dives into passionate interests, and explicit teaching of social skills.</p>

      <p><strong>Gifted and Advanced Learners:</strong> Students who learn quickly benefit from acceleration and depth—moving through skills quickly when mastered, going deeper into topics of interest rather than broader superficial coverage, and access to advanced materials when ready.</p>

      <p><strong>Students with Physical or Health Challenges:</strong> Students managing chronic illness, physical disabilities, or medical needs benefit from flexible pacing, accessible learning with materials adapted for physical accessibility, and focus on what students CAN do.</p>
    </div>

  </main>

  {/* Chat Interface */}
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

  {/* Chat Toggle Button */}
  <button 
    className={`chat-toggle ${chatOpen ? 'hidden' : ''}`}
    onClick={() => setChatOpen(true)}
  >
    💬
  </button>
</>

);
}