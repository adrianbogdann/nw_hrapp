# 🏢 Newwork HR App

A full-stack HR management system built with **NestJS**, **PostgreSQL**, **Adminer** and **React + Vite**.  
It includes role-based access, feedback management and absence requests.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Docker** and **Docker Compose**
- (optional) Node 20+ and npm 10+ for local dev without Docker

---

### 2. Start the app

```bash
docker-compose up --build
```


## URLs:
🖥️ Frontend → http://localhost:5001

⚙️ Backend (API) → http://localhost:3000/api

⚙️ Adminer (DB) -> http://localhost:8080 (postgres - postgres)



### 3. Database setup
Inside the backend container, run: 
```bash
# Run migrations
docker-compose run backend npx knex migrate:latest --knexfile dist/db/knexfile.js

# Seed initial data (users, profiles, roles)
docker-compose run backend npx knex seed:run --knexfile dist/db/knexfile.js
```

### 4. Default test users
| Role          | Email                                         | Password     |
| ------------- | --------------------------------------------- | ------------ |
| 🧑‍💼 Manager    | [manager@org.test](mailto:manager@org.test)   | Password123! |
| 👷 Employee   | [employee@org.test](mailto:employee@org.test) | Password123! |
| 🤝 Co-worker  | [coworker@org.test](mailto:coworker@org.test) | Password123! |


## 🏗️ Architecture Overview
### 🔹 Backend

Framework: NestJS (TypeScript)

Database: PostgreSQL (via Knex.js)

ORM-like Layer: Knex query builder

Auth: JWT-based authentication & authorization guard

#### Features:

    Role-based access (Manager / Employee / Co-worker)

    Feedback creation / edition / deletion

    Profile management

    Absence request handling

    AI-powered text polishing (via Hugging Face API)

### 🔹 Frontend

Framework: React 18 + Vite + TypeScript

Styling: Tailwind CSS + shadcn/ui components

Routing: React Router v6

State/Auth: Context API (AuthContext)

#### Features:

    Toasts via sonner

    Modal for absence requests

    Role badges on feedback cards

    Inline editing for feedback

    Global header with logout + role-based navigation

### 🔹 Containers

    frontend → builds and serves the React app on 5001

    backend → serves NestJS API on 3000

    db → PostgreSQL instance (data persisted via Docker volume)

    adminer -> DB viewer

## 🧠 Future Improvements

### 🔧 Backend:
 - Forgot password
 - POSTMAN collection
 - Use models in services instead of doing the DB work in services to separate logic
 - use DTOs + 'class-validator' for validation and keep controllers clean
 - Eslint config

### 🎨 Frontend:
 - Dark mode theme toggle.
 - Forgot password
 - Absence modal in new component instead of ProfilePage


## 💡 Local Dev Tips
Run individual services:

```bash
# Run only the backend (dev mode)
docker-compose up backend

# Run only the frontend (dev mode)
docker-compose up frontend
```

Check logs:
```bash
docker-compose logs -f backend
```

Drop DB and re-seed:
```bash
docker-compose down -v
docker-compose up db -d
docker-compose run backend npx knex migrate:latest --knexfile dist/db/knexfile.js
docker-compose run backend npx knex seed:run --knexfile dist/db/knexfile.js
```