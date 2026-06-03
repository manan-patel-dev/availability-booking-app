# Availability Booking App

A MERN-style interview assignment for creating availability slots and sharing a public booking link. The app uses React on the frontend, Express on the backend, JWT authentication, and local JSON files for storage.

## Features

- User registration and login with JWT authentication
- Protected availability dashboard
- Add availability by date, start time, and end time
- Generate a public booking link
- Public users can select an available date and 30-minute slot
- Booked slots are removed from the public availability list
- Basic responsive UI for login, register, dashboard, public booking, and 404 pages

## Tech Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express, JWT, bcryptjs
- Storage: JSON files inside `server/storage`

## Project Structure

```text
client/
  src/
    api/
    components/
    context/
    pages/
    routes/
server/
  src/
    controllers/
    middleware/
    routes/
    storage/
```

## Setup

Install dependencies in both folders:

```bash
cd server
npm install

cd ../client
npm install
```

Create environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Update `server/.env` with your JWT secret.

## Run Locally

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

Default URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Environment Variables

Server:

```env
PORT=5000
JWT_SECRET=replace_with_a_secure_secret
```

Client:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Main Routes

Frontend:

- `/` - Login
- `/register` - Register
- `/availability` - Protected availability dashboard
- `/booking/:slug` - Public booking page

Backend API:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/availability`
- `POST /api/booking-links/generate`
- `GET /api/bookings/:slug/slots`
- `POST /api/bookings/:slug/book`

## Usage Flow

1. Register a user.
2. Login with the user credentials.
3. Add one or more availability ranges.
4. Generate a public booking link.
5. Open the public link and book an available slot.

## Notes for Interviewer

- This assignment uses local JSON files instead of MongoDB to keep setup simple.
- Authentication is handled through JWT and protected routes.
- Availability ranges are converted into 30-minute slots on the backend.
- Basic frontend validation is included for auth forms and availability time ranges.
- The frontend is intentionally simple and interview-assignment friendly rather than heavily styled.

## Build Check

```bash
cd client
npm run build
```
