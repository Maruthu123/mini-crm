# Mini CRM — MERN Stack

A full-stack CRM application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Tech Stack

**Frontend:** React 18, React Router v6, MUI v5, TanStack Query v5, Axios  
**Backend:** Node.js, Express.js, MongoDB with Mongoose  
**Auth:** JWT (Access Token) + bcrypt  

---

## Project Structure

```
mini-crm/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route handlers
│   ├── middleware/      # JWT auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── seed.js          # Sample data seeder
│   └── server.js        # Entry point
│
└── frontend/
    └── src/
        ├── components/
        │   ├── common/  # Reusable UI (PageHeader, StatusChip, ConfirmDialog)
        │   └── layout/  # MainLayout (Sidebar + Topbar)
        ├── context/     # AuthContext (JWT login/logout)
        ├── pages/       # auth / dashboard / leads / companies / tasks
        ├── services/    # Axios instance with interceptors
        └── utils/       # Theme, helpers
```

---

## Getting Started

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd mini-crm
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT_SECRET
npm run dev
```

### 3. Seed Sample Data (optional)
```bash
cd backend
npm run seed
# Creates: admin@minicrm.com / admin123 and agent@minicrm.com / agent123
```

### 4. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:5000/api
npm start
```

---

## Features

### Authentication
- JWT-based login with bcrypt password hashing
- Token stored in localStorage
- Axios interceptor attaches token to all requests
- Auto-redirect to login on 401

### Leads Module
- Create, Edit, List leads
- Pagination (10 per page), Search (name/email), Status filter
- **Soft Delete** — `isDeleted: true` flag, excluded via Mongoose pre-query hook
- Status: New → Contacted → Qualified → Won / Lost

### Companies Module
- Create and list companies
- Company detail page with associated leads list

### Tasks Module
- Create tasks linked to leads, assign to users
- **Authorization:** Only the assigned user or admin can update task status
- Admin-only delete
- Quick "Mark Complete" button

### Dashboard
- Aggregation API returns: total leads, qualified leads, tasks due today, completed tasks
- Lead breakdown by status with progress bars

---

## Authorization Logic

```
Public routes:   POST /api/auth/login, POST /api/auth/register

Protected routes (JWT required):
  - All /api/leads, /api/companies, /api/dashboard, /api/users

Task update (PUT /api/tasks/:id):
  - Checks: task.assignedTo === req.user._id  OR  req.user.role === 'admin'
  - Returns 403 if neither condition met

Task delete (DELETE /api/tasks/:id):
  - Admin only (adminOnly middleware)

Soft Delete (leads):
  - DELETE sets isDeleted: true, deletedAt: Date
  - Mongoose pre(/^find/) hook adds { isDeleted: false } to all queries automatically
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Leads
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/leads | List (pagination, search, filter) |
| POST | /api/leads | Create lead |
| GET | /api/leads/:id | Get one lead |
| PUT | /api/leads/:id | Update lead |
| DELETE | /api/leads/:id | Soft delete |

### Companies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/companies | List companies |
| POST | /api/companies | Create company |
| GET | /api/companies/:id | Detail + associated leads |
| PUT | /api/companies/:id | Update company |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | List (agents see only their tasks) |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update (assigned user or admin) |
| DELETE | /api/tasks/:id | Delete (admin only) |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboard/stats | Aggregated CRM stats |

---

## Deployment

### Backend → Render
1. Push to GitHub
2. Create new Web Service on [render.com](https://render.com)
3. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`
4. Build command: `npm install` | Start command: `node server.js`

### Frontend → Netlify
1. Build: `cd frontend && npm run build`
2. Deploy the `build/` folder on [netlify.com](https://netlify.com)
3. Set environment variable: `REACT_APP_API_URL=https://your-backend.onrender.com/api`
4. Add `_redirects` file in `public/`:
   ```
   /*    /index.html   200
   ```

---

## Demo Credentials
```
Admin:  admin@minicrm.com / admin123
Agent:  agent@minicrm.com / agent123
```
