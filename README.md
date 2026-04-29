# 🏫 Smart Campus Operations Hub  
**IT3030 – PAF Assignment 2026**  
Group 168  

---

## 📌 Project Overview

The Smart Campus Operations Hub is a full-stack web application designed to streamline university facility management. It enables students and staff to:

- Browse campus resources
- Make bookings with conflict validation
- Report incidents through ticketing
- Receive notifications
- Authenticate securely via local login and Google OAuth

---

## 🎯 Key Features

### 👤 User Module
- Register / Login
- Google OAuth Login
- Profile Management

### 🏫 Resource Management
- Admin create/update/delete resources
- Search & filter resources
- Image upload support

### 📅 Booking System
- Create bookings
- Conflict detection
- Approval workflow
- Booking timeline UI

### 🛠 Ticketing System
- Create incident tickets
- Attach images
- Technician assignment
- Status tracking

### 🔔 Notifications
- Real-time notifications
- Unread count tracking

---

## 🔐 Authentication & RBAC

### Authentication
- Local login (Basic Auth)
- Google OAuth 2.0

### RBAC
- USER → bookings + tickets
- ADMIN → resource + booking control
- TECHNICIAN → ticket updates

---

## 🧪 API Endpoints (Sample)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Resources
- `GET /api/resources`
- `POST /api/resources` (ADMIN)

### Bookings
- `POST /api/bookings`
- `GET /api/bookings/user/{id}`
- `PATCH /api/bookings/{id}/approve`

### Tickets
- `POST /api/tickets`
- `PATCH /api/tickets/{id}/assign`

---

## 🎨 Frontend

- React + Vite
- Tailwind CSS
- Framer Motion animations

Features:
- Role-based dashboards
- Calendar booking UI
- Ticket management UI

---

## 👥 Work Allocation

| Member | Responsibility |
|------|----------------|
| Member 1 | Resource Management |
| Member 2 | Booking Workflow |
| Member 3 | Ticket System |
| Member 4 | Notifications + OAuth |

---

## 🧪 Testing

- Postman API testing
- UI validation
- Role-based access testing
- OAuth login validation

---

## 🔄 Git Workflow

- Branching: feature → dev → main
- Meaningful commits
- Pull request reviews

---

## 🚀 Setup Instructions

### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
