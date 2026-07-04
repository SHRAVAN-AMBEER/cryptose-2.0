# CRYPTOSE 2.0

CRYPTOSE 2.0 is a next-generation, full‑stack cryptocurrency tracking and AI-driven analysis platform. It pairs a robust Python/Flask backend (powered by LangGraph, MCP, RAG, and WebSockets) with a dynamic Next.js/React frontend to provide real-time market data, intelligent portfolio insights, and enterprise-grade role management.

This README explains what the project does, how it is structured, and how to run it locally for development.

---

## Table of contents
- Features
- Tech stack
- Project structure
- API (summary)
- Frontend routes (summary)
- Setup (development)
  - Prerequisites
  - Backend
  - Frontend
  - Quick Start (Root)
- Environment & configuration
- Security notes & recommendations
- Contributing
- License

---

## Features
- **Retrieval-Augmented Generation (RAG):** Powered by ChromaDB, the AI Engine retrieves historical market context and personalized user data to generate highly accurate, memory-aware responses.
- **MCP Server Integration:** Model Context Protocol (MCP) server securely exposes external market tools directly to the AI agents.
- **LangGraph AI Engine:** Embedded persistent AI chat widget powered by a multi-agent LangGraph architecture and Google Gemini. The chat supports rich markdown rendering (`react-markdown`) for readable tables and analytics.
- **AI Portfolio Analysis:** Generate deep, AI-driven insights into your current asset allocation via dedicated Insight Cards.
- **Real-Time Market Alerts:** Push-based WebSocket notifications (via `framer-motion` toast alerts) for sudden market movements, whale activity, and sentiment shifts.
- **Enterprise-Grade Admin Provisioning:** Secure CLI-based provisioning for Superadmins—public admin registration is physically disabled for maximum security.
- **Role-Based Dashboards:** Distinct portal experiences and data access for Users, Members, and Admins.
- **Market Dashboards & Charts:** Track price history, compare multiple coins, and analyze trending market data without CORS issues (all external APIs proxied via backend).

---

## Tech stack
- **Backend API:** Python, Flask, Flask-SocketIO (WebSockets)
- **AI Core & Memory:** LangGraph, LangChain, Google Gemini API, ChromaDB (Vector Database for RAG), MCP (Model Context Protocol)
- **Database:** MongoDB (via PyMongo)
- **Frontend:** React / Next.js, Framer Motion (animations), Tailwind CSS, React-Markdown
- **HTTP Client:** Axios (with interceptors)

---

## Project structure (high level)
- `backend/`
  - `app.py` — Main Flask application, WebSocket server, and API routing.
  - `ai_engine/` — LangGraph multi-agent logic, RAG retrieval tools, and configuration (`core/config.py`).
  - `chroma_data/` — Local vector embeddings for RAG persistence.
  - `mcp_server/` — Standalone Model Context Protocol tool integrations.
  - `scripts/` — Dedicated folder for secure DB initialization (`init_db.py`) and admin provisioning (`create_superadmin.py`).
  - `requirements.txt` — Python dependencies.
- `frontend/`
  - `package.json` — React app config (proxy set to backend port 5000).
  - `src/` — React source code (components, context, styles, and views).
  - `public/` — Static frontend assets.
- `package.json` (Root) — Workspace setup and `concurrently` scripts to launch the entire stack.

---

## API (summary)
The backend exposes robust endpoints via Flask and WebSockets. See `backend/app.py` for implementation details.

**WebSockets (Socket.IO)**
- `ws://localhost:5000` — Emits `alert` events for real-time toast notifications on the frontend.

**Authentication & Profile**
- `POST /login` — Authenticate and return user payload + role.
- `POST /register/user` — Register a standard User.
- `POST /register/member` — Register a premium Member.
- *(Note: Admin registration is CLI-only via `scripts/create_superadmin.py`)*

**Crypto Data & Visualization**
- `GET /api/market-data` — Proxy for public market data.
- `GET /api/coin/<id>` — Proxies specific coin data to bypass CORS and rate-limiting.
- `GET /api/coin-history/<coin_id>` — Historical price data.
- `GET /api/compare` — Comparison tools.

**AI, RAG, & LangGraph Core**
- Handles complex user queries by mapping intent, searching ChromaDB vectors (RAG), querying the MCP server, and returning markdown-formatted insights.

**User Administration**
- `GET /admins`, `/get/users`, `/get/members` — Data retrieval for admin dashboards.
- `POST /promote/user`, `POST /demote/member` — Role management.

---

## Frontend routes (from `frontend/src/App.js` or Next.js Router)
- `/` — Home (Landing Page)
- `/login` — Login Portal
- `/signup` — Registration Hub (Users / Members)
- `/profile` — Profile Management
- `/markets` — Real-Time Markets Overview
- `/cryptos` — Cryptocurrency Directory
- `/coin/:id` — Deep-Dive Coin Analytics
- `/compare` — Coin Comparison Dashboard
- `/AdminDashboard` — Enterprise Admin Control Panel
- `/MemberDashboard` — Premium Member Portal
- `/UserDashboard` — Standard User Portal

---

## Setup (development)
### Prerequisites
- Node.js and npm
- Python 3.10+
- MongoDB running locally (or a hosted MongoDB Atlas instance)

### Option 1: Quick Start (Root Directory)
Because this repository is configured as a workspace, you can boot the entire application (both frontend and backend) simultaneously with one command:
1. Ensure your `.env` is configured (see below).
2. Install root dependencies: `npm install-deps`
3. Start both servers: `npm run dev`

### Option 2: Manual Start
**Backend**
1. `cd backend`
2. `python -m venv .venv`
3. Activate the virtual environment:
   - Windows: `.\.venv\Scripts\activate`
   - macOS/Linux: `source .venv/bin/activate`
4. `pip install -r requirements.txt`
5. Securely create your first Admin account: `python scripts/create_superadmin.py`
6. `python app.py`

**Frontend**
1. `cd frontend`
2. `npm install`
3. `npm start` (or `npm run dev` if using Next.js dev server)

---

## Environment & configuration
Ensure you create a `.env` file in the root directory (or inside `backend/`). It should contain:
- `MONGODB_URL` — Connection string (e.g., `mongodb://localhost:27017/cryptose`)
- `SECRET_KEY` — Application secret
- `GEMINI_API_KEY` — Required for LangGraph AI integrations

*Do not commit your `.env` file to version control.*

---

## Security notes & recommendations
- **Admin Provisioning:** We have physically removed all web-facing admin registration endpoints. All initial superadmins MUST be created via the terminal (`python scripts/create_superadmin.py`).
- **CORS & Rate Limiting:** All external API requests (e.g., CoinGecko) are proxied through the Flask backend (`/api/coin/<id>`) to prevent frontend CORS blocks and IP bans.
- **Environment Variables:** Pydantic `BaseSettings` is used to strictly validate your `.env` configuration. The app will fail to start if critical keys are missing.
- **RAG Data Privacy:** ChromaDB vector embeddings are stored locally in `backend/chroma_data/` and excluded from version control to protect user conversation memory.

---

## Contributing
Contributions are welcome.
1. Fork the repository
2. Create a branch for your change
3. Open a pull request describing your change

*Please ensure you do not commit any `.env` secrets, `node_modules`, `chroma_data/`, or `__pycache__` directories.*
