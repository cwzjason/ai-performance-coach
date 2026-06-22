# AI Performance Review Coach

> Help new managers nail their first performance feedback conversation without a hitch — an interactive web-based simulation training tool.

## Overview

Performance reviews are one of the most critical — and risky — actions for any manager. Too soft and it's ineffective; too harsh and employees may quit; off-target and it becomes personal. **AI Performance Review Coach** lets you practice one-on-one performance conversations with AI-simulated "real employees" in a safe environment, then provides a multi-dimensional evaluation report and improvement suggestions afterward.

### Core Value

- **Zero-risk practice** — Rehearse in a virtual environment without fear of saying the wrong thing or damaging relationships
- **Realistic employee simulation** — AI dynamically generates emotional responses based on employee profiles (High-Potential / Steady / Needs Improvement)
- **Instant feedback** — Automatically generates a performance review quality score report with flagged pitfalls
- **Scenario-based training** — 5 common problem scenarios + custom backgrounds, covering 3×5=15 combinations

## 🌐 Live Demo

👉 **[Open and use](https://cwz-d2glf6xtm409cbb3a-1438121806.tcloudbaseapp.com/ai-performance-coach.html)**

No registration, no installation — just open in your browser.

## ✨ Features

### 🎭 Simulated Conversations

| Feature | Description |
|---------|-------------|
| AI-Driven Employee | Based on LLM, generates emotional and personality-driven responses in real time |
| Employee State Machine | Trust, openness, and mood change dynamically based on your conversation strategy |
| Quick Reply Buttons | Opening, listening, guiding, closing — one-click common phrases |
| Typewriter Animation | Employee replies with character-by-character animation for enhanced immersion |

### 👥 Three Employee Profiles

| Type | Name | Role | Traits | Key Approach |
|------|------|------|--------|--------------|
| High-Potential | Zhang Mingyuan | Senior R&D Engineer | Capable, opinionated, expects promotion, high self-esteem | Show respect, discuss growth, avoid commanding |
| Steady Performer | Li Wen | Senior Operations Specialist | Reliable, experienced, passive communicator, family pressures | Listen more, provide security, take it step by step |
| Needs Improvement | Wang Xiaoming | Junior Product Assistant | Needs growth, lacks direction, easily anxious | Give direction, specific feedback, focus on encouragement |

### 🎯 Five Problem Scenarios

- Delivery Delays — Project behind schedule
- Poor Collaboration — Cross-team communication breakdown
- Lack of Initiative — Complacency and lack of drive
- Quality Issues — Inconsistent output quality
- Attitude Problems — Negative complaints affecting team morale

### 📊 Smart Evaluation Report

Automatic scoring across **5 dimensions** after each session:

```
┌──────────────────┬──────────────────────────────────────────────┐
│ Dimension        │ Detection Logic                              │
├──────────────────┼──────────────────────────────────────────────┤
│ Empathy & Listening │ Did you acknowledge effort & ask about feelings? │
│ Attribution Clarifying │ Did you use open-ended questions to understand their view? │
│ Specific Feedback │ Did you use STAR method with concrete examples? │
│ Improvement Plan  │ Did you co-create actionable next steps?    │
│ Goal Alignment    │ Did you connect personal growth to team direction? │
└──────────────────┴──────────────────────────────────────────────┘
```

**Penalty detection:**
- Personal attacks / labeling → -2.0 points
- Blame ("It's all your fault...") → -0.8 points
- Vague feedback (effort without specifics) → -0.5 points

**Output:**
- Overall score (1–5, star display)
- Dimension completion status (✅ Covered / ❌ Not covered)
- Missing key actions with recommended phrases
- Pitfall alerts (if any)
- Improvement checklist

## 🛠 Tech Stack

```
┌──────────────────────────────────────────────────────┐
│                   Browser (Frontend)                  │
│  ┌────────────────────────────────────────────────┐  │
│  │   Vue 3 (CDN) + Single-file HTML App           │  │
│  │   • Chat UI / Employee State Machine / Rules   │  │
│  │   • Evaluation System (keyword + scoring)      │  │
│  │   • SiliconFlow API (AI conversations)         │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────┬───────────────────────────────┘
                       │ HTTPS (REST API)
                       ▼
           ┌───────────────────────┐
           │   SiliconFlow API     │
           │   Qwen2.5-7B-Instruct │
           │   (Large Language Model) │
           └───────────────────────┘
```

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Vue 3 (CDN Production Build) | Single HTML file, no build tools needed |
| UI Components | TDesign Vue Next + Custom CSS | Gradient style, rounded cards, animated transitions |
| AI Engine | SiliconFlow OpenAI-compatible API | Qwen/Qwen2.5-7B-Instruct model |
| Evaluation Engine | Keyword matching + rule-based scoring (fallback) | 5-dimension scoring + pitfall detection |
| Deployment | CloudBase Static Hosting | CDN-accelerated, globally accessible |

## 📁 Project Structure

```
vibecoding/
├── ai-performance-coach.html    # Main app — Frontend SPA (~1560 lines)
│   ├── HTML (Chat panel / Config area / Evaluation modal)
│   ├── CSS (Gradient theme / Animations / Responsive)
│   └── JavaScript (Vue 3 / State machine / AI calls / Evaluation system)
├── server.py                    # Python local dev server (optional)
├── server.js                    # Node.js local dev server (optional)
├── cloudfunctions/              # Cloud Functions (reserved)
│   ├── index.js
│   └── package.json
├── cloudrun/                    # CloudRun backend services
├── README.md                    # Documentation (Chinese)
└── README_EN.md                 # Documentation (English)
```

## 🚀 How to Use

1. **Choose a scenario** — Select employee type, performance rating, and problem scenario in the left config panel
2. **Start the session** — Click "Start Practice" to begin the conversation
3. **Have the conversation** — Type your coaching phrases and press Enter; or use quick reply buttons
4. **Watch reactions** — Observe changes in employee mood (Tense → Defensive → Cautious → Open → Collaborative)
5. **End the session** — Click "End & Score" or say "end the review" in conversation
6. **Read the report** — Review your evaluation to understand strengths and areas for improvement
7. **Practice again** — Click "New Session" to try a different scenario

## 💡 Coaching Tips at a Glance

> Review = Connect → Present facts → Reach consensus

1. **Start with empathy**: "I've noticed you've been working late a lot lately — thank you. How have things been feeling?"
2. **Ask open-ended questions**: "What's your take?" "What do you think might be causing this?"
3. **Give feedback with specifics**: "For example, the XX requirement last week..."
4. **Co-create the plan**: "Let's set goals for the next two weeks — where do you think we could start?"
5. **Link to personal growth**: "Getting this right will really help your career path"

## 📦 Local Development

```powershell
# Open directly in browser, or start a local server (for CORS):
python server.py
# or
node server.js
```

## 📄 License

MIT
