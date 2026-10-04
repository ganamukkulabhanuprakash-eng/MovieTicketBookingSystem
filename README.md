# CineVault — Movie Ticket Booking System

A full-stack movie ticket booking application built for Hyderabad, Telangana.

- **Frontend**: React 19 + Vite + Tailwind CSS  
- **Backend**: Spring Boot 3.4 + Spring Data JPA  
- **Database**: MySQL 8+

---

## Project Structure

```
MovieTicketBookingSystem/
├── frontend/          # React application (Vite)
├── backend/           # Spring Boot application (Maven)
├── database/          # SQL initialization scripts
└── README.md
```

---

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Java JDK | 17+ | https://adoptium.net |
| Apache Maven | 3.9+ | https://maven.apache.org/download.cgi |
| MySQL Server | 8.0+ | https://dev.mysql.com/downloads/mysql/ |
| Node.js | 18+ | https://nodejs.org |

> **Note**: Maven was installed to `C:\tools\apache-maven-3.9.6` during setup.  
> Add `C:\tools\apache-maven-3.9.6\bin` to your system PATH permanently.

---

## Step 1 — Set Up MySQL

1. Install MySQL 8 and start the MySQL service.
2. Open MySQL Workbench or the MySQL command-line client.
3. Run the initialization script:

```sql
-- In MySQL client:
source database/init.sql
```

Or manually:
```sql
CREATE DATABASE IF NOT EXISTS cinevault_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Step 2 — Configure Database Credentials

The backend reads credentials from **environment variables**, not hardcoded values.

Set these before running the backend:

**Windows (PowerShell):**
```powershell
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "your_mysql_password"
```

**Windows (permanently, via System Properties → Environment Variables):**
```
DB_USERNAME = root
DB_PASSWORD = your_mysql_password
```

> See `backend/.env.example` for the list of variables.

---

## Step 3 — Start the Backend

```powershell
cd backend

# Windows (with Maven in PATH)
mvn spring-boot:run

# OR run the JAR directly after building:
mvn package -DskipTests
java -jar target/cinevault-backend-1.0.0.jar
```

The backend starts on **http://localhost:8080**

On first start, Hibernate automatically creates all database tables.  
The `DataSeeder` then seeds:
- 3 users (1 admin, 2 regular)
- 12 movies (matching the frontend mock data)
- 20 Hyderabad theatres
- 45+ screens
- 2700+ seats
- Hundreds of shows for the next 5 days

---

## Step 4 — Start the Frontend

```powershell
cd frontend
npm install      # only needed once
npm run dev
```

The frontend starts on **http://localhost:5173**

---

## Verify the Backend is Running

```powershell
# Health check
curl http://localhost:8080/api/health

# Get all movies
curl http://localhost:8080/api/movies

# Get featured movies
curl http://localhost:8080/api/movies/featured

# Get all theatres
curl http://localhost:8080/api/theatres

# Get shows for movie ID 1
curl http://localhost:8080/api/shows/movie/1

# Get seat layout for show ID 1
curl http://localhost:8080/api/shows/1/seats
```

---

## API Endpoints (Phase 1 — Foundation)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Backend health check |
| GET | `/api/movies` | All active movies |
| GET | `/api/movies/{id}` | Movie by ID |
| GET | `/api/movies/featured` | Featured movies (for carousel) |
| GET | `/api/movies/search?query=...` | Search movies by title |
| GET | `/api/theatres` | All active theatres |
| GET | `/api/theatres/{id}` | Theatre by ID |
| GET | `/api/shows/movie/{movieId}` | Shows for a movie (today onwards) |
| GET | `/api/shows/{id}` | Show by ID |
| GET | `/api/shows/{id}/seats` | Seat layout with availability |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with email + password |

---

## Test Accounts (after seeding)

| Email | Password | Role |
|-------|----------|------|
| `admin@cinevault.com` | `admin123` | ADMIN |
| `bhanu@gmail.com` | `user123` | USER |
| `ravi@gmail.com` | `user123` | USER |

---

## Backend Architecture

```
com.cinevault/
├── CineVaultApplication.java     ← Spring Boot entry point
├── config/
│   ├── CorsConfig.java           ← CORS for React frontend
│   ├── SecurityConfig.java       ← BCrypt, open endpoints (Phase 1)
│   └── DataSeeder.java           ← Dev seed data
├── controller/
│   ├── AuthController.java
│   ├── MovieController.java
│   ├── ShowController.java
│   ├── TheatreController.java
│   └── HealthController.java
├── service/
│   ├── AuthService.java          ← Interface
│   ├── MovieService.java         ← Interface
│   ├── ShowService.java          ← Interface
│   ├── TheatreService.java       ← Interface
│   └── impl/
│       ├── AuthServiceImpl.java
│       ├── MovieServiceImpl.java
│       ├── ShowServiceImpl.java
│       └── TheatreServiceImpl.java
├── repository/                   ← Spring Data JPA repositories
├── entity/
│   ├── BaseEntity.java           ← Abstract superclass
│   ├── User.java
│   ├── Movie.java
│   ├── Theatre.java
│   ├── Screen.java
│   ├── Seat.java
│   ├── Show.java
│   ├── Booking.java
│   ├── BookingSeat.java          ← Show-specific seat occupancy
│   └── enums/
│       ├── UserRole.java
│       ├── SeatCategory.java
│       ├── BookingStatus.java
│       └── PaymentStatus.java
├── dto/                          ← API request/response objects
└── exception/                    ← Custom exceptions + global handler
```

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts with BCrypt-hashed passwords |
| `movies` | Movie catalogue with soft-delete (`active` flag) |
| `theatres` | Hyderabad theatres with facilities |
| `screens` | Screens within theatres |
| `seats` | Physical seats per screen with category |
| `shows` | A movie on a specific screen at a specific date+time |
| `bookings` | A user's ticket purchase for a show |
| `booking_seats` | Individual seats within a booking (show-specific) |

**Key constraint**: `booking_seats(show_id, seat_id)` is UNIQUE — this is what prevents double-booking at the database level.

---

## Important Notes

- Passwords are **never** stored in plain text — BCrypt hashing is used.
- Public registration **cannot** set `ADMIN` role — it always defaults to `USER`.
- The admin account is created via the `DataSeeder` only.
- Movies/theatres/shows use `active = true/false` (soft delete) to preserve historical booking records.
- Seat availability is **show-specific** — booking seat A1 for the 7 PM show does NOT affect the 10 PM show.

---

## What's Coming Next

- Full frontend ↔ backend API integration (replace mock data with real API calls)
- Admin Dashboard (CRUD for movies, theatres, shows, pricing)
- Session-based or JWT authentication
- Full booking engine with seat locking
- Booking history on profile page
