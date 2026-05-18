# Stay - Hotel Booking (Fullstack)

This repository contains a fullstack hotel booking application with a Node.js/Express backend and a Vite + React frontend.

## Features
- User authentication (hosts and guests)
- Hotel, room, booking, and review management
- Image uploads (Cloudinary)
- Admin and host dashboards

## Prerequisites
- Node.js 18+ and npm
- A Cloudinary account (for image uploads)

## Install
Clone the repo and install dependencies for both backend and frontend.

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

## Environment variables
Create a `.env` file for the backend with variables required by `backend/config/*` such as:

- `MONGO_URI` - MongoDB connection string
- `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET` - Cloudinary credentials
- `SESSION_SECRET` - express-session secret

Adjust any other variables referenced in the `backend/config` files.

## Run (development)
There's a helper batch file at the repo root: `run-project.bat` which starts both backend and frontend (Windows). You can also run them separately.

Start backend:

```bash
cd backend
npm run dev
```

Start frontend:

```bash
cd frontend
npm run dev
```

## Useful commands
- `cd backend && npm run dev` - start backend
- `cd frontend && npm run dev` - start frontend (Vite)
- `run-project.bat` - helper to run both on Windows

## Contributing
Contributions welcome. Open issues or PRs, and follow existing code style.

## License
This project is provided as-is. Add your preferred license.
