# Smart Campus Operations Hub

## IT3030 – PAF Assignment 2026 (Semester 1)

A comprehensive web-based system for managing university facility and asset bookings, along with maintenance/incident handling. Built with Spring Boot REST API and React frontend.

---

## Project Overview

| Attribute | Details |
|-----------|---------|
| **Project Name** | Smart Campus Operations Hub |
| **Technology Stack** | Spring Boot 3.3.2 + React + TypeScript |
| **Database** | H2 (Dev) / PostgreSQL (Production) |
| **Authentication** | OAuth 2.0 (Google) + JWT |
| **Roles** | USER, ADMIN, TECHNICIAN |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │Dashboard │  │Bookings  │  │Resources │  │Notifications │  │
│  │  Page    │  │  Module  │  │  Module  │  │    Panel     │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP/REST
┌─────────────────────────────────────────────────────────────────┐
│                       Backend (Spring Boot)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    REST Controllers                      │  │
│  │  Resources │ Bookings │ Tickets │ Notifications │ Auth   │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      Services Layer                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Repository  │  │   Security  │  │       DTO        │   │
│  │    Layer     │  │    Config   │  │      Layer       │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────��───────────────────────────────────────┐
│                    Database (H2 / PostgreSQL)                 │
│  Tables: users, roles, resources, bookings, tickets, comments │
└─────────────────────────────────────────────────────────────────┘
```

---

## Module Features

### Module A - Facilities & Assets Catalogue
- CRUD operations for resources (Lecture Halls, Labs, Meeting Rooms, Equipment)
- Search and filtering by type, capacity, location
- Availability status management (ACTIVE / OUT_OF_SERVICE)

### Module B - Booking Management
- Booking workflow: PENDING → APPROVED/REJECTED → CANCELLED
- Conflict detection for overlapping time ranges
- Admin approval/rejection with reason tracking

### Module C - Maintenance & Incident Ticketing
- Ticket workflow: OPEN → IN_PROGRESS → RESOLVED → CLOSED
- Image attachments (up to 3 per ticket)
- Technician assignment and status updates
- Comment system with ownership rules

### Module D - Notifications
- Booking status change notifications
- Ticket status change notifications
- New comment notifications

### Module E - Authentication & Authorization
- OAuth 2.0 Google Sign-In
- JWT token-based security
- Role-based access control (RBAC)

---

## API Endpoints

### Resources (Module A)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/admin/resources` | Create resource | ADMIN/TECHNICIAN |
| GET | `/api/admin/resources` | List all resources | ADMIN/TECHNICIAN |
| GET | `/api/admin/resources/{id}` | Get resource by ID | PUBLIC |
| GET | `/api/admin/resources/search` | Search resources | PUBLIC |
| PUT | `/api/admin/resources/{id}` | Update resource | ADMIN/TECHNICIAN |
| PATCH | `/api/admin/resources/{id}/status` | Update status | ADMIN/TECHNICIAN |
| DELETE | `/api/admin/resources/{id}` | Delete resource | ADMIN |

### Bookings (Module B)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/admin/bookings` | Create booking | USER |
| GET | `/api/admin/bookings` | List bookings | ADMIN |
| GET | `/api/admin/bookings/{id}` | Get booking by ID | USER |
| PUT | `/api/admin/bookings/{id}/approve` | Approve booking | ADMIN |
| PUT | `/api/admin/bookings/{id}/reject` | Reject booking | ADMIN |
| PUT | `/api/admin/bookings/{id}/cancel` | Cancel booking | USER |
| DELETE | `/api/admin/bookings/{id}` | Delete booking | ADMIN |

### Tickets (Module C)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/tickets` | Create ticket | USER |
| GET | `/api/tickets` | List tickets | USER |
| GET | `/api/tickets/{id}` | Get ticket by ID | USER |
| PUT | `/api/tickets/{id}/status` | Update status | ADMIN/TECHNICIAN |
| PUT | `/api/tickets/{id}/assign` | Assign ticket | ADMIN/TECHNICIAN |
| PUT | `/api/tickets/{id}/resolve` | Resolve ticket | ADMIN/TECHNICIAN |
| POST | `/api/tickets/{id}/comments` | Add comment | USER |
| DELETE | `/api/tickets/{id}` | Delete ticket | ADMIN |

### Notifications (Module D)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/notifications?userId={id}` | Get user notifications | USER |
| PUT | `/api/notifications/{id}/read` | Mark as read | USER |

---

## Team Contributions

| Module | Team Member | Implementation |
|--------|------------|----------------|
| Module A | Member 1 | Resources CRUD + Search + Status Management |
| Module B | Member 2 | Booking Workflow + Conflict Detection + Approval |
| Module C | Member 3 | Tickets + Attachments + Comments |
| Module D | Member 4 | Notifications + OAuth + RBAC |

---

## Setup Instructions

### Prerequisites
- Java 17+
- Node.js 20+
- Maven 3.8+

### Backend Setup
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Running Tests
```bash
# Backend tests
cd backend
./mvnw test

# Frontend tests
cd frontend
npm run test
```

---

## CI/CD Pipeline

The project includes GitHub Actions workflows for continuous integration:

- ✅ Maven build and test
- ✅ Frontend build and type check
- ✅ Security dependency check
- ✅ Test report generation

To view the CI pipeline:
1. Go to repository GitHub page
2. Navigate to **Actions** tab
3. View workflow run history

---

## Testing

### Unit Tests Location
- `backend/src/test/java/com/smartcampus/api/service/ResourceServiceTest.java`
- `backend/src/test/java/com/smartcampus/api/service/BookingServiceTest.java`
- `backend/src/test/java/com/smartcampus/api/service/TicketServiceTest.java`
- `backend/src/test/java/com/smartcampus/api/service/NotificationServiceTest.java`

### Integration Tests
- `backend/src/test/java/com/smartcampus/api/SmartCampusApiIntegrationTest.java`

### Postman Collection
- Import `backend/postman-collection.json` to test all endpoints

---

## Key Features Implemented

1. **Resource Management** - Full CRUD with availability windows and status tracking
2. **Smart Booking** - Conflict detection and approval workflow with rejection reasons
3. **Incident Ticketing** - Complete ticket lifecycle with technician assignment
4. **Notifications** - Real-time notification system for status changes
5. **OAuth 2.0** - Google sign-in integration
6. **Role-Based Access** - ADMIN, TECHNICIAN, USER roles with proper authorization

---

## License

This project is developed for IT3030 - Programming Applications and Frameworks assignment 2026.

---

## Additional Documentation

- **Postman Collection**: `backend/postman-collection.json`
- **Test Reports**: Generated in `backend/target/surefire-reports/`
- **Frontend Build**: Generated in `frontend/dist/`