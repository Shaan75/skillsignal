# ⚡ SkillSignal — AI Resume Intelligence Platform

<div align="center">

![SkillSignal Banner](https://img.shields.io/badge/SkillSignal-AI%20Resume%20Intelligence-7c3aed?style=for-the-badge&logo=zap&logoColor=white)

**9 AI-powered resume tools. One platform. Free.**

[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Groq](https://img.shields.io/badge/Groq-LLaMA%203.3-f55036?style=flat-square)](https://groq.com)

</div>

---

## 🚀 What is SkillSignal?

SkillSignal is a full-stack AI SaaS platform that reads your resume like a senior recruiter and gives you **brutally honest, personalized feedback** — not generic tips.

Upload your PDF. Get your signal in seconds.

---

## ✨ Features (9 AI Tools)

| # | Feature | What it does |
|---|---------|-------------|
| 1 | 🧠 **Resume Analysis** | AI scores your resume 0-100 with skills, strengths & improvements |
| 2 | 📝 **Cover Letter Generator** | Tailored cover letter based on your resume + job description |
| 3 | 🎯 **Interview Prep** | 20 personalized Q&A based on YOUR actual resume projects |
| 4 | 🎯 **Job Matcher** | Matches resume vs job description — shows match%, missing skills |
| 5 | 💼 **LinkedIn Bio Generator** | Professional About section + headline + SEO keywords |
| 6 | ✍️ **Resume Rewriter** | Rewrites weak bullet points into strong, ATS-friendly statements |
| 7 | 🗺️ **Skill Gap Roadmap** | Target job → readiness score + 3-phase personalized learning plan |
| 8 | 🤖 **ATS Bot Simulator** | Simulates how an ATS parses your resume — sections, keywords, issues |
| 9 | 🔥 **Resume Roast** | Brutally savage (but helpful) roast of your resume with actual fixes |

---

## 🔥 Why SkillSignal Stands Out

- **Resume Roast** — No other platform does this. Funny + viral + genuinely useful
- **ATS Bot Simulator** — Shows exactly what the bot sees, not just a generic score
- **Personalized Interview Prep** — Questions about YOUR IoT project, YOUR CINEBOOK app — not "tell me about yourself"
- **Skill Gap Roadmap** — A 3-phase learning plan, not just a list of missing skills
- **All 9 tools free** — No paywalls, no limits (within Groq free tier)
- **Everything is based on YOUR resume** — Zero generic advice

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS v3** — utility-first styling
- **Framer Motion** — animations
- **React Router v6** — client-side routing

### Backend
- **Node.js** + **Express.js** + **TypeScript**
- **MongoDB Atlas** + **Mongoose** — cloud database
- **JWT** — stateless authentication
- **bcryptjs** — password hashing
- **Multer** — PDF file upload
- **pdf-parse** — PDF text extraction

### AI
- **Groq API** — ultra-fast AI inference
- **LLaMA 3.3 70B Versatile** — the model powering all 9 features

---

## 📁 Project Structure

```
skillsignal/
├── client/                          # React + Vite frontend
│   ├── src/
│   │   ├── pages/                   # Feature pages (one per AI tool)
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── CoverLetter.tsx
│   │   │   ├── InterviewPrep.tsx
│   │   │   ├── JobMatcher.tsx
│   │   │   ├── LinkedInBio.tsx
│   │   │   ├── ResumeRewriter.tsx
│   │   │   ├── SkillGap.tsx
│   │   │   ├── ATSScore.tsx
│   │   │   └── ResumeRoast.tsx
│   │   ├── components/ui/
│   │   │   ├── Sidebar.tsx          # Shared mobile-responsive sidebar
│   │   │   └── Navbar.tsx           # Transparent → glass on scroll
│   │   ├── services/
│   │   │   ├── resumeService.ts     # All API calls
│   │   │   └── api.ts               # Axios instance
│   │   ├── context/
│   │   │   └── AuthContext.tsx      # JWT auth context
│   │   └── routes/
│   │       └── AppRoutes.tsx        # Protected routes
│   └── .env                         # VITE_API_URL
│
└── skillsignal-server/              # Node + Express backend
    ├── src/
    │   ├── services/
    │   │   └── geminiService.ts     # All 9 Groq AI functions
    │   ├── controllers/
    │   │   └── resumeController.ts  # All 9 controllers
    │   ├── routes/
    │   │   ├── resumeRoutes.ts      # All resume API routes
    │   │   └── authRoutes.ts        # Auth routes
    │   ├── models/
    │   │   ├── Resume.ts            # Resume MongoDB model
    │   │   └── User.ts              # User MongoDB model
    │   ├── middleware/
    │   │   └── authMiddleware.ts    # JWT protect middleware
    │   ├── config/
    │   │   ├── db.ts                # MongoDB connection
    │   │   └── multer.ts            # File upload config
    │   └── index.ts                 # Express entry point
    └── .env                         # Server environment variables
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Groq API key (free at console.groq.com)

### 1. Clone the repo
```bash
git clone https://github.com/Shaan75/skillsignal.git
cd skillsignal
```

### 2. Setup Backend
```bash
cd skillsignal-server
npm install
```

Create `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd ../client
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/resume/upload` | Upload PDF resume |
| GET | `/api/resume/` | Get all resumes |
| DELETE | `/api/resume/:id` | Delete resume |
| POST | `/api/resume/:id/analyze` | AI resume analysis |
| POST | `/api/resume/:id/cover-letter` | Generate cover letter |
| POST | `/api/resume/:id/interview-questions` | Generate interview Q&A |
| POST | `/api/resume/:id/match-job` | Match against job description |
| POST | `/api/resume/:id/linkedin-bio` | Generate LinkedIn bio |
| POST | `/api/resume/:id/rewrite` | Rewrite bullet points |
| POST | `/api/resume/:id/skill-gap` | Generate skill gap roadmap |
| POST | `/api/resume/:id/ats-score` | Run ATS simulation |
| POST | `/api/resume/:id/roast` | Roast the resume 🔥 |

---

## 🔐 Environment Variables

### Backend (`skillsignal-server/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `GROQ_API_KEY` | Groq API key for AI features |
| `NODE_ENV` | development / production |

### Frontend (`client/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

---

## 🚀 Deployment

- **Frontend** → [Vercel](https://vercel.com) (set root to `client/`)
- **Backend** → [Render](https://render.com) (set root to `skillsignal-server/`)
- **Database** → [MongoDB Atlas](https://mongodb.com/atlas)

---

## 👨‍💻 Developer

**Shaunak Sikdar**

Built with ❤️ and way too much Groq API quota 🚀

---

## 📄 License

MIT License — feel free to use, modify and build on top of this.

---

<div align="center">

**⭐ Star this repo if SkillSignal helped you!**

</div>
