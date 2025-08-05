# University attendance app

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/dannys-projects-a3df3454/v0-university-attendance-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/4J4UobEB5GY)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/dannys-projects-a3df3454/v0-university-attendance-app](https://vercel.com/dannys-projects-a3df3454/v0-university-attendance-app)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/4J4UobEB5GY](https://v0.dev/chat/projects/4J4UobEB5GY)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Environment

Configure the API base URL through the `NEXT_PUBLIC_API_URL` environment
variable so the dashboard can display live data from the backend:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:80
```

## API Endpoints

The project consumes a REST API whose endpoints are documented in
[`docs/postman-collection.json`](docs/postman-collection.json). The table
below shows how each endpoint is used inside the application:

| Endpoint | Function in `apiService` | Used in |
| --- | --- | --- |
| `/api/usuarios/login` | `login` | `contexts/auth-context.tsx` via `<LoginForm />` |
| `/api/eventos/crear` | `createEvent` | `hooks/use-events.ts` → `<EventsManagement />` |
| `/api/eventos/listar` | `getEvents` | `hooks/use-events.ts` → `<EventsManagement />` |
| `/api/eventos/finalizar` | `finalizeEvent` | `hooks/use-events.ts` → `<EventsManagement />` |
| `/api/asistencia/registrar` | `registerAttendance` | _Attendance registration (future pages)_ |
| `/api/dashboard/overview` | `getDashboardData` | `hooks/use-dashboard-data.ts` → `<EnhancedDashboard />` |
| `/api/justificaciones/crear` | `createJustification` | _Justification creation (future pages)_ |

These mappings make it easier to locate where each API call is triggered in
the user interface.
