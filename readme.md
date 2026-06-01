# TaskFlow — Project Management SaaS

A multi-tenant project management application inspired by Jira and Asana.

## Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Auth:** JWT

## Features
- JWT Authentication
- Multi-tenant Workspace System
- Role-based access (Owner, Admin, Member)
- Project & Task Management
- Kanban Board + List View
- Filter by Status

## Live Demo
https://taskflow-saas-snowy.vercel.app

## Setup

### Backend
cd into root folder
npm install
add .env file with MONGO_URI, JWT_SECRET, PORT
npm run dev

### Frontend
cd frontend
npm install
npm run dev