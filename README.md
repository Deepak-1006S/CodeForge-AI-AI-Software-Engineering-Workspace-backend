# CodeForge AI — AI-Powered Engineering Workspace

<div align="center">

![CodeForge AI](https://img.shields.io/badge/CodeForge-AI-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTUgOEwyMiA5TDE3IDEzTDE4IDIwTDEyIDE3TDYgMjBMNyAxM0wyIDlMOSA4TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)

**Enterprise-grade SaaS platform for AI-powered software project management, issue tracking, team collaboration, and engineering analytics.**

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Architecture](#architecture) • [Documentation](#documentation)

</div>

---

## 🌟 Overview

CodeForge AI is a production-ready, enterprise SaaS application that combines modern project management, intelligent issue tracking, real-time collaboration, and AI-powered development assistance into a unified platform. Built with scalability, performance, and exceptional UX in mind.

### Why CodeForge AI?

- **🚀 Production-Ready**: Enterprise-grade architecture, not a tutorial project
- **🤖 AI-Powered**: Gemini AI integration for sprint summaries, bug analysis, release notes, and more
- **⚡ Real-Time**: Socket.IO for live notifications, team activity, and presence tracking
- **🎨 Premium UI**: Modern SaaS design (Linear/Notion/GitHub inspired)
- **🔐 Secure**: JWT authentication, RBAC, rate limiting, input validation
- **📊 Analytics**: Comprehensive dashboards with team productivity metrics
- **🔗 GitHub Integration**: Repository tracking, commits, pull requests, contributors
- **📱 Responsive**: Mobile-first design with dark/light mode

---

## ✨ Features

### 🔐 **Authentication & Authorization**
- User registration and login with JWT
- Password hashing with bcrypt
- Access & refresh token rotation
- Role-based access control (Admin, Manager, Developer)
- Password reset flow
- Protected routes and middleware

### 🏢 **Organization Management**
- Create and manage organizations
- Invite team members by email
- Role assignment (Owner, Admin, Manager, Developer)
- Member directory with role badges
- Organization settings and branding

### 📁 **Project Management**
- Full CRUD operations for projects
- 4-stage workflow: Planning → Active → Testing → Completed
- Project dashboard with metrics
- Team assignment and collaboration
- Soft delete and archiving
- Project statistics and progress tracking

### 🎯 **Issue Tracking System**
- Kanban board with drag-and-drop (Todo → In Progress → Review → Done)
- Priority levels: Low, Medium, High, Critical
- Issue assignment and reassignment
- Labels and tagging system
- Due dates with visual indicators
- Activity logs and audit trail
- Advanced search and filtering
- Full-text search across issues
- Comments and mentions

### 📊 **Analytics & Dashboards**
- Organization-wide KPIs
- Project health metrics
- Issue resolution rate trends
- Team productivity charts
- Sprint velocity tracking
- Workload distribution
- Time-to-completion analytics
- Interactive charts with Recharts

### 🔔 **Real-Time Features**
- Live notifications via Socket.IO
- Team activity feed
- Real-time issue updates
- Online presence indicators
- Collaborative editing signals
- Project activity streams

### 🐙 **GitHub Integration**
- Connect repositories
- Commit tracking and visualization
- Contributor analytics
- Pull request statistics
- Repository health dashboard
- Code activity metrics

### 🤖 **AI Workspace (Gemini API)**
- **Sprint Summary Generator**: Auto-generate sprint reports
- **Bug Explainer**: AI-powered root cause analysis
- **Release Notes Generator**: Create professional changelogs
- **Task Description Generator**: Intelligent task breakdowns
- **Standup Report Generator**: Daily standup summaries
- **Engineering Assistant**: AI chat for development questions

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18** with TypeScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **TanStack Query (React Query)** - Data fetching & caching
- **React Hook Form** + **Zod** - Form validation
- **Axios** - HTTP client with interceptors
- **Socket.IO Client** - Real-time communication
- **Framer Motion** - Animation library
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications
- **date-fns** - Date formatting

### **Backend**
- **Node.js** with **Express.js**
- **TypeScript** - Type-safe backend
- **MongoDB** with **Mongoose** - NoSQL database
- **JWT** - JSON Web Tokens for auth
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Express Rate Limit** - API rate limiting
- **Socket.IO** - WebSocket server
- **Morgan** - HTTP request logger
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### **AI & Integrations**
- **Google Gemini API** - Generative AI
- **GitHub REST API** - Repository data

### **DevOps**
- **MongoDB Atlas** - Cloud database
- **Vercel** - Frontend deployment (ready)
- **Render / Railway** - Backend deployment (ready)
- **dotenv** - Environment variables
- **Nodemon** - Development server

---

## 📦 Project Structure

```
CodeForge AI — AI Software Engineering Workspace/
├── client/                          # React Frontend
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/                  # Static assets
│   │   ├── components/              # React components
│   │   │   ├── ui/                  # Primitive UI components (Button, Input, Card, etc.)
│   │   │   ├── common/              # Shared components (ErrorBoundary, PageLoader, etc.)
│   │   │   ├── auth/                # Auth components (LoginForm, RegisterForm, etc.)
│   │   │   ├── dashboard/           # Dashboard widgets (StatsCard, Charts, etc.)
│   │   │   ├── projects/            # Project components (ProjectCard, ProjectForm, etc.)
│   │   │   ├── issues/              # Issue components (KanbanBoard, IssueCard, etc.)
│   │   │   ├── organization/        # Organization components (MemberList, etc.)
│   │   │   ├── notifications/       # Notification components
│   │   │   ├── github/              # GitHub integration components
│   │   │   ├── ai/                  # AI feature components
│   │   │   └── navigation/          # Navigation components (Sidebar, TopNav, etc.)
│   │   ├── config/                  # App configuration
│   │   │   └── queryClient.ts       # TanStack Query setup
│   │   ├── context/                 # React Context providers
│   │   │   ├── AuthContext.tsx      # Authentication context
│   │   │   ├── ThemeContext.tsx     # Dark/light mode
│   │   │   ├── SocketContext.tsx    # Socket.IO context
│   │   │   └── NotificationContext.tsx
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useProjects.ts
│   │   │   ├── useIssues.ts
│   │   │   ├── useOrganization.ts
│   │   │   ├── useDashboard.ts
│   │   │   ├── useDebounce.ts
│   │   │   └── useLocalStorage.ts
│   │   ├── layouts/                 # Page layouts
│   │   │   ├── AuthLayout.tsx       # Auth pages layout
│   │   │   ├── DashboardLayout.tsx  # Main app layout
│   │   │   └── LandingLayout.tsx    # Landing page layout
│   │   ├── pages/                   # Page components
│   │   │   ├── auth/                # Login, Register, Forgot Password
│   │   │   ├── dashboard/           # Dashboard page
│   │   │   ├── projects/            # Projects, Create, Detail pages
│   │   │   ├── issues/              # Issues, Kanban, Detail pages
│   │   │   ├── analytics/           # Analytics dashboard
│   │   │   ├── notifications/       # Notifications page
│   │   │   ├── organization/        # Organization pages
│   │   │   ├── profile/             # User profile
│   │   │   ├── settings/            # App settings
│   │   │   ├── github/              # GitHub integration
│   │   │   └── ai/                  # AI assistant
│   │   ├── services/                # API service layer
│   │   │   ├── api.ts               # Axios instance with interceptors
│   │   │   ├── auth.service.ts      # Auth API calls
│   │   │   ├── user.service.ts      # User API calls
│   │   │   ├── organization.service.ts
│   │   │   ├── project.service.ts
│   │   │   ├── issue.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   ├── github.service.ts
│   │   │   ├── ai.service.ts
│   │   │   ├── notification.service.ts
│   │   │   └── socket.service.ts
│   │   ├── types/                   # TypeScript type definitions
│   │   │   ├── auth.types.ts
│   │   │   ├── organization.types.ts
│   │   │   ├── project.types.ts
│   │   │   ├── issue.types.ts
│   │   │   └── index.ts
│   │   ├── utils/                   # Utility functions
│   │   │   ├── cn.ts                # Class name merger (clsx + tailwind-merge)
│   │   │   ├── constants.ts         # App constants
│   │   │   ├── formatDate.ts        # Date formatting helpers
│   │   │   ├── validators.ts        # Zod validation schemas
│   │   │   └── errorHandler.ts      # API error parser
│   │   ├── App.tsx                  # Main app component with routing
│   │   ├── main.tsx                 # React entry point
│   │   └── index.css                # Global styles with Tailwind
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Example environment file
│   ├── package.json
│   ├── tsconfig.json                # TypeScript config
│   ├── vite.config.ts               # Vite configuration
│   ├── tailwind.config.ts           # Tailwind CSS config
│   └── postcss.config.js            # PostCSS config
│
└── server/                          # Express Backend
    ├── src/
    │   ├── config/                  # Server configuration
    │   │   └── db.ts                # MongoDB connection
    │   ├── controllers/             # Route controllers
    │   │   ├── auth.controller.ts   # Auth endpoints
    │   │   ├── organization.controller.ts
    │   │   ├── project.controller.ts
    │   │   └── issue.controller.ts
    │   ├── middleware/              # Express middleware
    │   │   ├── auth.middleware.ts   # JWT verification
    │   │   ├── rbac.middleware.ts   # Role-based access control
    │   │   ├── error.middleware.ts  # Error handler
    │   │   └── rateLimiter.ts       # Rate limiting
    │   ├── models/                  # Mongoose models
    │   │   ├── User.ts              # User schema
    │   │   ├── Organization.ts      # Organization schema
    │   │   ├── Project.ts           # Project schema
    │   │   ├── Issue.ts             # Issue schema
    │   │   └── IssueActivity.ts     # Activity log schema
    │   ├── routes/                  # API routes
    │   │   ├── auth.routes.ts       # /api/auth
    │   │   ├── organization.routes.ts # /api/organizations
    │   │   ├── project.routes.ts    # /api/projects
    │   │   └── issue.routes.ts      # /api/issues
    │   ├── services/                # Business logic
    │   │   └── auth.service.ts      # JWT generation/validation
    │   ├── types/                   # TypeScript types
    │   │   └── express.d.ts         # Express type extensions
    │   ├── utils/                   # Utility functions
    │   │   └── errorResponse.ts     # Error response formatter
    │   ├── validators/              # Request validators
    │   │   ├── auth.validator.ts
    │   │   ├── organization.validator.ts
    │   │   ├── project.validator.ts
    │   │   └── issue.validator.ts
    │   ├── socket.ts                # Socket.IO server setup
    │   └── index.ts                 # Express server entry point
    ├── .env                         # Environment variables
    ├── .env.example                 # Example environment file
    ├── package.json
    ├── tsconfig.json                # TypeScript config
    └── nodemon.json                 # Nodemon config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm** v9+
- **MongoDB Atlas** account (or local MongoDB)
- **Google Gemini API** key (optional for AI features)
- **GitHub Personal Access Token** (optional for GitHub integration)

### Installation

#### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "CodeForge AI — AI Software Engineering Workspace"
```

#### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file in `server/`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority

# JWT Secrets
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_jwt_key_here_min_32_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional: Email (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

Start the backend:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`

#### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create `.env` file in `client/`:

```env
# API
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Optional: AI Features
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: GitHub Integration
VITE_GITHUB_TOKEN=your_github_personal_access_token
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 🧪 Testing

### Backend Tests

The backend has comprehensive integration tests for all API endpoints.

```bash
cd server
npm run test:auth       # Test auth system
npm run test:phase3     # Test organizations, projects, issues
```

**Test Coverage:**
- ✅ 44/44 Phase 3 integration tests passing
- ✅ 9/9 Auth system tests passing
- ✅ Organizations CRUD + member management
- ✅ Projects CRUD + workflow
- ✅ Issues CRUD + Kanban + search

### Frontend Build

```bash
cd client
npm run build
```

Production build is generated in `client/dist/`.

---

## 📐 Architecture

### Frontend Architecture

- **Component-Based**: Atomic design with reusable UI primitives
- **Context + Hooks**: State management with React Context API
- **Server State**: TanStack Query for data fetching/caching
- **Type Safety**: Full TypeScript coverage
- **Service Layer**: Centralized API calls with Axios interceptors
- **Protected Routes**: Auth guards and role-based routing
- **Real-Time**: Socket.IO integration for live updates

### Backend Architecture

- **MVC Pattern**: Model-View-Controller separation
- **Middleware Pipeline**: Auth → RBAC → Validation → Controller → Error Handler
- **Service Layer**: Business logic extracted from controllers
- **Schema Validation**: Express-validator + Mongoose schemas
- **JWT Strategy**: Access + refresh tokens with automatic rotation
- **Soft Deletes**: Data preservation with `isDeleted` flag
- **Activity Logging**: Audit trail for all issue changes

### Database Schema

**Collections:**
- `users` - User accounts with roles
- `organizations` - Organizations with members array
- `projects` - Projects with status workflow
- `issues` - Issues with priority, status, assignments
- `issueactivities` - Activity log for audit trail

**Relationships:**
- User → Organization (many-to-many via members array)
- Organization → Projects (one-to-many)
- Project → Issues (one-to-many)
- Issue → IssueActivity (one-to-many)

---

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Access + refresh token rotation
- **Role-Based Access Control**: Admin, Manager, Developer roles
- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: Express-validator on all endpoints
- **CORS Protection**: Whitelisted origins
- **Helmet.js**: Security headers
- **MongoDB Injection Prevention**: Mongoose sanitization
- **XSS Protection**: Input sanitization
- **HTTPS Ready**: Production SSL/TLS support

---

## 📈 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| GET | `/auth/me` | Get current user | Yes |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password with token | No |
| PUT | `/auth/password` | Update password | Yes |
| POST | `/auth/refresh-token` | Refresh access token | Yes |

### Organizations

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/organizations` | Get all orgs | Yes | Any |
| GET | `/organizations/:id` | Get org by ID | Yes | Member |
| POST | `/organizations` | Create org | Yes | Any |
| PUT | `/organizations/:id` | Update org | Yes | Owner/Admin |
| DELETE | `/organizations/:id` | Delete org | Yes | Owner |
| POST | `/organizations/:id/members` | Invite member | Yes | Owner/Admin |
| DELETE | `/organizations/:id/members/:userId` | Remove member | Yes | Owner/Admin |

### Projects

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/projects` | Get all projects | Yes | Any |
| GET | `/projects/:id` | Get project by ID | Yes | Any |
| POST | `/projects` | Create project | Yes | Manager+ |
| PUT | `/projects/:id` | Update project | Yes | Manager+ |
| DELETE | `/projects/:id` | Delete project | Yes | Admin+ |
| GET | `/projects/:id/stats` | Get project stats | Yes | Any |

### Issues

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/issues` | Get all issues (filterable) | Yes | Any |
| GET | `/issues/:id` | Get issue by ID | Yes | Any |
| POST | `/issues` | Create issue | Yes | Any |
| PUT | `/issues/:id` | Update issue | Yes | Any |
| DELETE | `/issues/:id` | Delete issue | Yes | Manager+ |
| GET | `/issues/:id/activity` | Get issue activity log | Yes | Any |
| GET | `/issues/search` | Search issues | Yes | Any |
| GET | `/issues/kanban` | Get Kanban board | Yes | Any |

---

## 🎨 UI/UX Features

### Design System
- **Colors**: Primary (blue), Success (green), Warning (yellow), Danger (red)
- **Typography**: Inter font family with hierarchy
- **Spacing**: 4px base unit (Tailwind spacing scale)
- **Radius**: Consistent border radius (lg, xl)
- **Shadows**: Subtle elevation system
- **Animations**: Smooth transitions with Framer Motion

### Dark Mode
- Full dark theme support
- Persists in localStorage
- Toggle in user menu

### Responsive Design
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

### Loading States
- Skeleton loaders for content
- Spinners for actions
- Progress bars for operations

### Empty States
- Helpful messages
- Relevant icons
- Call-to-action buttons

### Error States
- User-friendly error messages
- Retry mechanisms
- Error boundaries

---

## 🚢 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy with one click

### Backend (Render / Railway)

1. Push code to GitHub
2. Create new web service
3. Configure environment variables
4. Set start command: `npm run build && npm start`

### MongoDB Atlas

Already configured! Just update `MONGO_URI` in `.env`.

---

## 📚 Documentation

### Key Files to Explore

- **Frontend Entry**: `client/src/main.tsx` → `client/src/App.tsx`
- **Backend Entry**: `server/src/index.ts`
- **Auth Flow**: `server/src/controllers/auth.controller.ts`
- **API Client**: `client/src/services/api.ts` (Axios interceptors)
- **Auth Context**: `client/src/context/AuthContext.tsx`
- **Socket Setup**: `server/src/socket.ts` + `client/src/context/SocketContext.tsx`

### Environment Variables

See `.env.example` files in both `client/` and `server/` directories for all required and optional environment variables.

---

## 🤝 Contributing

This is a portfolio project demonstrating enterprise SaaS development. Feel free to:

- Fork and customize for your own projects
- Submit issues for bugs or suggestions
- Create pull requests with improvements

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **Design Inspiration**: Linear, Notion, GitHub, Stripe Dashboard
- **Icons**: Lucide React
- **UI Components**: Custom implementation with Tailwind CSS
- **AI**: Google Gemini API
- **Real-Time**: Socket.IO

---

## 📧 Contact

**Project Author**: [Your Name]  
**Email**: your.email@example.com  
**Portfolio**: https://yourportfolio.com  
**LinkedIn**: https://linkedin.com/in/yourprofile

---

<div align="center">

**Built with ❤️ for developers**

⭐ Star this repo if you found it helpful!

</div>
