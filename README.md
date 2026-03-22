# 🎓 Atlas AI Command Center - Campus Event Manager

An **AI-powered event management system** built on the ATLAS template for managing campus events with intelligent approval workflows, clash detection, and AI-enhanced event descriptions using Google Gemini.

---

## 🚨 Project Overview

This project extends the Atlas AI Command Center template with a **fully functional Campus Event Manager** module. It features intelligent event request handling, automated conflict detection, and AI-powered text enhancement.

### ✨ What's Built

| Component | Description |
|-----------|-------------|
| **Event Submission** | Students and staff submit event requests via `/events` |
| **Clash Detection** | Automatic detection of date/time/venue conflicts |
| **AI Polish** | One-click Gemini enhancement for event descriptions |
| **Event Approvals** | Admin review and approval workflow at `/events/approvals` |
| **Audit Logging** | Complete audit trail of all events and approvals |
| **Real-time Dashboard** | Live event stats, pending approvals, and recent events |

### ✅ What's Real (Production-Ready)

| Feature | Status | Description |
|---------|--------|-------------|
| **Event Submission Form** | ✅ Real | Full event creation with date, time, venue, attendees |
| **Approval Workflow** | ✅ Real | Admin review and reject/approve functionality |
| **Clash Detection** | ✅ Real | Prevents double-booking of venues and times |
| **AI Polish** | ✅ Real | Gemini integration for description enhancement |
| **Audit Logging** | ✅ Real | Automatic tracking of all event operations |
| **Authentication** | ✅ Real | JWT + optional Keycloak |

---

## ✨ Core Features

- **Smart Campus Event Manager**: End-to-end event requesting, approval, and clash detection
- **AI-Powered Enhancement**: "AI Polish" refines event descriptions using Gemini  
- **Role-Based Access**: Students submit, admins approve/manage all events
- **Audit Logging**: Comprehensive tracking of all event operations
- **Real-time Dashboard**: Live event stats and pending approvals
- **Fully Containerized**: Docker and Docker Compose setup
- **Production-Ready Stack**: FastAPI, Next.js, PostgreSQL

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events` | Submit new event |
| GET | `/api/events` | Get all events |
| GET | `/api/events/{id}` | Get event details |
| POST | `/api/events/{id}/polish-description` | AI enhance description |
| GET | `/api/events/pending-approvals` | Get unapproved events (admin) |
| PATCH | `/api/events/{id}/approve` | Approve event (admin) |
| PATCH | `/api/events/{id}/reject` | Reject event (admin) |

---

## 📂 Project Structure

```
.
├── backend/
│   └── app/
│       ├── api/
│       │   └── events.py                # Event endpoints
│       ├── models/
│       │   └── event.py                 # Event database model
│       ├── schemas/
│       │   └── event_schema.py          # Data validation
│       └── services/
│           └── ai/
│               ├── gemini.py            # Gemini API client
│               └── tools.py             # AI helper functions
│
├── frontend/
│   └── src/
│       ├── app/(dashboard)/
│       │   └── events/
│       │       ├── page.tsx             # Event submission form
│       │       └── approvals/page.tsx  # Admin approval dashboard
│       └── components/layout/
│           └── Sidebar.tsx              # Navigation
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 💻 Technology Stack

| Area | Technology | Purpose |
|------|------------|---------|
| Backend | Python 3.11 + FastAPI | High-performance event API |
| Frontend | Next.js 14+ + React + TypeScript | Modern event management UI |
| AI | Gemini API | AI Polish for event descriptions |
| Database | PostgreSQL 15 | Event storage and audit logs |
| Auth | JWT + Keycloak (optional) | Secure authentication |
| DevOps | Docker + Docker Compose | Full containerization |

---

## 🚀 Quick Start

### Prerequisites

| Tool | Required | Purpose |
|------|----------|---------|
| Docker Desktop | ✅ Yes | Runs all services |
| Gemini API Key | ✅ Yes | AI Polish feature |
| Git | ✅ Yes | Clone repository |

Get your free Gemini API key: https://aistudio.google.com/apikey

### Step 1: Clone & Setup

```bash
git clone https://github.com/Rhythm-029/Atlas.git
cd Atlas
cp .env.example .env
```

### Step 2: Configure Environment

Edit `.env` and add your Gemini API key:

```bash
GEMINI_API_KEY=your-api-key-here
SECRET_KEY=your-generated-secret-key
NEXTAUTH_SECRET=your-generated-nextauth-secret
```

### Step 3: Start Services

```bash
docker compose up --build
```

### Step 4: Access the App

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API Docs | http://localhost:8000/docs |
| Keycloak (optional) | http://localhost:8080 |

**Default Login**: `admin@atlasuniversity.edu.in` / `admin123`

### Step 5: Try It Out

1. Go to `/events` → Submit an event
2. Click "✨ AI Polish" to enhance description with Gemini
3. Visit `/events/approvals` (admin) to approve/reject events
4. System auto-detects scheduling conflicts

---

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key for AI Polish |
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string |
| `SECRET_KEY` | ✅ Yes | JWT signing key (use `openssl rand -base64 32`) |
| `NEXTAUTH_SECRET` | ✅ Yes | NextAuth.js session secret |

---

## ⚠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000/8000 in use | Change in `.env` or kill process |
| "GEMINI_API_KEY not set" | Verify key in `.env` file |
| Login fails | Clear cookies, check NEXTAUTH_SECRET |
| Database errors | `docker compose down -v && docker compose up --build` |
| Frontend not updating | `docker compose restart frontend` |

---

## 🛠️ Useful Commands

```bash
# View logs
docker compose logs -f backend

# Stop services
docker compose down

# Reset everything
docker compose down -v
docker compose up --build

# Run migrations
docker compose exec backend alembic upgrade head
```

---

## 📖 Documentation

- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **Database Migrations**: `backend/alembic/versions/`
- **Authorization**: `backend/app/authz.map.json`

---

## 🤝 Contributing

To contribute to this project:

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add feature"`
3. Push and create Pull Request

---

## 🏆 Built By

**Rhythm** — Campus Event Manager Implementation  
Developed as part of the Atlas AI Command Center ecosystem  
2026

---

## 📄 License

Built on [Atlas AI Command Center Template](https://github.com/Rhythm-029/Atlas)  
A production-ready full-stack framework for AI-powered applications

---

## 🔐 Authentication & Authorization

### How It Works

1. User clicks "Sign In" → Login page (credentials) or redirect to Keycloak if configured  
2. Backend validates credentials → Returns JWT to frontend  
3. Frontend stores token → NextAuth.js manages session  
4. API calls include token → Backend validates JWT  
5. Authorization engine checks → Rules in `authz.map.json`  

### Adding Protected Endpoints

In `backend/app/authz.map.json`:

```json
{
  "/api/my-endpoint": {
    "GET": ["ADMIN", "USER"],
    "POST": ["ADMIN"]
  }
}
```

In `backend/app/public.map.json` add paths that require no auth (e.g. `/health`, `/api/auth/login`).

### Adding Custom Audit Logs

```python
from app.services.audit import audit

await audit.log_user_action(
    db=db,
    action="user.approve",
    actor=current_user,
    target_user_id=user_id,
    target_user_email="john@example.com",
)
```

---

## ⚠️ Common Issues

| Problem | Solution |
|---------|----------|
| "OAuth error" or 401 when logging in | Clear cookies or use incognito; ensure NEXTAUTH_SECRET is set |
| API returns 401 | Check Authorization header is sent; token may be expired |
| AI features not working | Set GEMINI_API_KEY in `.env`; demo data loads without key |
| Frontend not updating after code changes | If using FRONTEND_TARGET=prod, rebuild: `docker compose build frontend` |
| Port already in use | Change FRONTEND_PORT / BACKEND_PORT in `.env` and restart |

---

## 🏁 Checklist for New Projects

- [ ] Clone template and rename repository  
- [ ] Update `.env` with new secrets (especially NEXTAUTH_SECRET and SECRET_KEY)  
- [ ] Add GEMINI_API_KEY for AI features  
- [ ] Update branding (logo, colors, company name)  
- [ ] Configure APPROVED_EMAIL_DOMAINS  
- [ ] Replace demo pages (Dashboard, Settings) with real data  
- [ ] Customize `authz.map.json` for your roles and endpoints  
- [ ] Change default admin password  
- [ ] Update this README for your project  
