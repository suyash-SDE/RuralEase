# 🗄️ RuralEase — Backend Server API

This is the Express-based REST API and real-time Socket.io server for RuralEase. It manages database connections with MongoDB, serves authentication requests, matches clients with services, and triggers real-time events.

---

## 🛠️ Main Features
- **RESTful Endpoints:** Organized routes for `/api/auth`, `/api/services`, and `/api/bookings`.
- **Mongoose Data Modeling:** Schema models for users, services, and bookings with validation.
- **Socket.io Event Dispatch:** Rooms-based communication to send bookings instantly from clients to specific vendors.
- **Seed Script:** Quick script to populate databases with standard vendor and service templates.

---

## 🚀 Getting Started

### 1. Configure Environments
Create a `.env` file in this directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ruralease
JWT_SECRET=ruralease_secret_key_123
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Seed Database
```bash
node seed.js
```

### 4. Run Server (Dev Mode)
```bash
npm run dev
```
The API and Socket server will start running on port `5000`.

---

## 📡 Key Endpoint API Documentation

### 🔐 Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a new user or vendor.
* `POST /api/auth/login` — Authenticate user and return a JWT access token.
* `GET /api/auth/user` — Retrieve authenticated user profile information (requires JWT Header).

### 🌾 Services (`/api/services`)
* `GET /api/services` — List all services.
* `GET /api/services/category/:categoryId` — Filter services by category.
* `POST /api/services` — Create a new service (requires Vendor role).

### 📅 Bookings (`/api/bookings`)
* `GET /api/bookings` — Fetch bookings for the logged-in User/Vendor.
* `POST /api/bookings` — Create a service booking (triggers `new_booking` socket event).
* `PUT /api/bookings/:id` — Update booking status (triggers `booking_update` socket event).
