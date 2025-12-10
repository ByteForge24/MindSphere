# 🧠 MindSphere — AI-Powered Mental Wellness Platform

> A full-stack mental wellness application featuring AI-driven mood analysis, real-time community support, gamified self-care, and structured journaling — built with production-grade architecture.

[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions)](https://github.com/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js)](https://nodejs.org/)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB?logo=react)](https://react.dev/)
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)](https://www.mongodb.com/)
[![AI](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=google)](https://ai.google.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Docker Deployment](#docker-deployment)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Security](#security)
- [Screenshots](#screenshots)
- [Future Roadmap](#future-roadmap)

---

## Overview

MindSphere is a **production-grade mental wellness platform** that combines mood tracking, AI-powered insights, real-time community chat, and gamification to help users build healthy mental health habits. It demonstrates:

- **Full-Stack Architecture** — React SPA + Node.js REST API + MongoDB + Socket.IO
- **AI Integration** — Google Gemini 1.5 Flash for mood analysis and personalized suggestions
- **Real-Time Communication** — Socket.IO with JWT-authenticated WebSocket connections
- **Production Patterns** — Centralized error handling, structured logging (Winston), RBAC, rate limiting, security headers
- **DevOps** — Docker containerization, CI/CD pipelines, automated testing (136+ tests)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  React 18 · TypeScript · Vite · TanStack Query · Tailwind  │
│  Radix UI · Recharts · Socket.IO Client · Zod              │
└────────────────────────────┬────────────────────────────────┘
                             │  REST API + WebSocket
┌────────────────────────────┼────────────────────────────────┐
│                        BACKEND                              │
│  Express.js · JWT Auth · RBAC · Helmet · Rate Limiting      │
│  Winston Logger · Express-Validator · Sentry                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ REST API │  │Socket.IO │  │ Cron Jobs│                  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                  │
└───────┼──────────────┼─────────────┼────────────────────────┘
        │              │             │
┌───────┼──────────────┼─────────────┼────────────────────────┐
│       ▼              ▼             ▼                         │
│              MongoDB Atlas                                   │
│  Users · CheckIns · Journals · Communities · Messages        │
│  Tokens · Rewards                                            │
└─────────────────────────────────────────────────────────────┘
        │
┌───────┼─────────────────────────────────────────────────────┐
│       ▼         EXTERNAL SERVICES                            │
│  Google Gemini API · Sentry Error Tracking                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Features

### 🎯 Mood Tracking & Check-In System
- Daily mood and energy level check-ins with streak tracking
- Voice and text input support
- Historical mood visualization with interactive Recharts graphs
- Paginated mood history with filtering

### 🤖 AI-Powered Insights (Google Gemini)
- Personalized wellness suggestions based on mood input
- AI mood analysis for journal entries
- Dashboard AI insights summarizing weekly trends
- Rate-limited to prevent abuse (20 req/15min per user)

### 📔 Journaling System
- Full CRUD journal with tagging and privacy controls
- AI-powered mood detection on journal entries
- Paginated entries with server-side filtering
- Input validation with express-validator

### 💬 Real-Time Community Chat
- Socket.IO WebSocket with JWT authentication handshake
- Community groups with join/leave and member management
- Persistent message storage with cursor-based pagination
- REST API fallback for message history

### 🌱 Gamification — Plant Growth & Tokens
- Streak-based plant evolution (sprout → leaf → flower → tree)
- Token economy — earn tokens for activities, spend on rewards
- Visual progress tracking on dashboard

### 🔐 Authentication & Authorization
- JWT-based auth with 7-day token expiry
- Role-Based Access Control (RBAC) — student, professional, admin, moderator
- Protected routes on both frontend and backend
- Secure password hashing with bcryptjs

### 📊 Dashboard & Analytics
- Aggregated user statistics (streaks, check-ins, journals, tokens)
- AI-generated weekly insights
- Real-time data with TanStack React Query caching

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, TanStack React Query, React Router v6 |
| **UI** | Tailwind CSS, Radix UI (20+ accessible components), Lucide Icons, Recharts |
| **State/Forms** | React Context, React Hook Form, Zod validation |
| **Backend** | Node.js, Express 4, Socket.IO 4, JWT |
| **Security** | Helmet, CORS, Rate Limiting, bcryptjs, RBAC middleware |
| **Validation** | express-validator (server), Zod (client) |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **AI** | Google Gemini 1.5 Flash via @google/genai |
| **Logging** | Winston (structured, file + console transports) |
| **Error Tracking** | Sentry (conditional integration) |
| **Testing** | Jest + Supertest (backend), Vitest + Testing Library (frontend), Playwright (E2E) |
| **CI/CD** | GitHub Actions (5-job pipeline), secret scanning |
| **Deployment** | Docker + Docker Compose, Netlify (FE), Render (BE) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas connection string)
- Google Gemini API key ([Get one here](https://ai.google.dev/))

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/mindsphere.git
cd mindsphere

# Install all dependencies (root + backend + frontend)
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### Environment Setup

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mindsphere
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key
SENTRY_DSN=               # optional
LOG_LEVEL=info             # debug | info | warn | error
NODE_ENV=development
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
```

### Run Development Servers

```bash
# From project root — starts both frontend and backend concurrently
npm run dev
```

The frontend runs at `http://localhost:8080` and the backend API at `http://localhost:5000`.

---

## Docker Deployment

```bash
# Copy environment template
cp .env.example .env
# Edit .env with your secrets

# Build and start all services
docker compose up -d --build

# View logs
docker compose logs -f backend

# Stop
docker compose down
```

Services:
- **Frontend** → `http://localhost:80`
- **Backend API** → `http://localhost:5000`
- **MongoDB** → `localhost:27017`

---

## API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Mood Tracking
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/mood/check-in` | Submit mood check-in |
| GET | `/api/mood/history` | Get paginated mood history |
| POST | `/api/mood/suggestions` | Get AI suggestions (rate-limited) |

### Journal
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/journal` | List journal entries (paginated) |
| POST | `/api/journal` | Create journal entry |
| PUT | `/api/journal/:id` | Update journal entry |
| DELETE | `/api/journal/:id` | Delete journal entry |

### Community
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/community` | List community groups |
| POST | `/api/community` | Create group |
| POST | `/api/community/:id/join` | Join group |
| POST | `/api/community/:id/leave` | Leave group |

### Messages (REST + WebSocket)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/:communityId` | Get messages (cursor pagination) |
| POST | `/api/messages` | Send message |
| WS | `socket.io` | Real-time messaging |

### Dashboard & Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/dashboard/ai-insight` | AI-generated weekly insight |
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update profile |

### Tokens & Plants
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tokens` | Token transaction history |
| POST | `/api/tokens` | Add/spend tokens |
| GET | `/api/plants/growth` | Plant growth status |

---

## Project Structure

```
mindsphere/
├── docker-compose.yml          # Full-stack Docker orchestration
├── .env.example                # Environment template
├── .github/workflows/          # CI/CD pipelines
│
├── backend/
│   ├── server.js               # Express app entry point
│   ├── Dockerfile              # Backend container
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication
│   │   ├── rbac.js             # Role-Based Access Control
│   │   └── errorHandler.js     # Centralized error handling
│   ├── models/                 # Mongoose schemas (8 models)
│   ├── routes/                 # Express route handlers (11 routes)
│   ├── services/               # Business logic (Gemini AI, events)
│   ├── utils/
│   │   ├── apiResponse.js      # Standardized API responses
│   │   ├── appError.js         # Custom error class
│   │   └── logger.js           # Winston logging configuration
│   ├── socket/                 # Socket.IO real-time handlers
│   ├── jobs/                   # Background jobs (analytics)
│   └── tests/                  # Jest + Supertest test suites
│
├── frontend/
│   ├── Dockerfile              # Multi-stage frontend container
│   ├── nginx.conf              # Production Nginx config
│   └── src/
│       ├── components/         # React components (15+)
│       ├── pages/              # Route pages (10 pages)
│       ├── context/            # Auth context + Socket provider
│       ├── hooks/              # Custom hooks (theme, toast, AI)
│       ├── services/           # API service layer
│       └── lib/                # Axios config, utilities
│
└── test_extract/               # Test fixtures
```

---

## Testing

```bash
# Backend tests (50 tests across 6 suites)
cd backend && npm test

# Frontend tests (86 tests)
cd frontend && npx vitest run

# E2E tests (Playwright)
cd frontend && npx playwright test
```

**Test coverage includes:**
- Authentication flow (register, login, JWT validation)
- Mood check-in with streak logic
- Journal CRUD with pagination
- Community group operations
- Token transactions with balance checks
- Dashboard statistics aggregation

---

## Security

- **Helmet** — HTTP security headers (CSP, HSTS, XSS protection)
- **CORS** — Strict origin allowlist
- **Rate Limiting** — AI endpoints limited to 20 req/15min
- **JWT Authentication** — Stateless token-based auth
- **RBAC Middleware** — Role-based route protection
- **express-validator** — Server-side input validation
- **bcryptjs** — Password hashing with salt rounds
- **Secret Scanning** — CI pipeline scans for leaked credentials
- **Sentry** — Error tracking and monitoring (optional)

See [SECURITY.md](SECURITY.md) for the security policy and incident response procedures.

---

## Screenshots

<img width="1920" height="1080" alt="MindSphere Dashboard" src="https://github.com/user-attachments/assets/52ce7831-0134-4ecb-9f84-60ac51ce0554" />
<img width="1920" height="1080" alt="MindSphere Mood Tracking" src="https://github.com/user-attachments/assets/7ccef797-3dfe-40dd-993d-6d1e81391494" />
<img width="1920" height="1080" alt="MindSphere Community" src="https://github.com/user-attachments/assets/b498ae25-12a3-4a08-ae62-4bc6b3b35182" />

---

## Future Roadmap

- [ ] Redis caching layer for high-traffic endpoints
- [ ] Swagger/OpenAPI auto-generated documentation
- [ ] Password reset flow with email verification
- [ ] Push notifications for streaks and community activity
- [ ] Full-text search across journals and communities
- [ ] Data export (GDPR compliance)
- [ ] AI chatbot for guided wellness conversations
- [ ] Mobile-responsive PWA with offline support

---

## 👨‍💻 Resume-Level Project Description

> **MindSphere** — Engineered a full-stack AI-powered mental wellness platform serving mood tracking, journaling, and real-time community features. Built with React/TypeScript, Node.js/Express, MongoDB, and Socket.IO. Integrated Google Gemini AI for personalized wellness recommendations. Implemented JWT authentication with RBAC, centralized error handling, structured Winston logging, and comprehensive input validation. Containerized with Docker Compose. Achieved 136+ automated tests across unit, integration, and E2E suites with CI/CD via GitHub Actions. Deployed on Netlify + Render with Sentry monitoring.

---

## License

MIT
