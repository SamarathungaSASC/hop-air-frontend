# HOP Air Frontend

Frontend application for the HOP Air learning and clinical training platform.

Built with React, Vite, Tailwind CSS, React Router, and Auth0 authentication.

## Key Features

- Role-based routing for Superadmin, Educator, Clinician, and Trainee users
- Auth0 login flow with token-based API authentication
- Dynamic dashboard rendering based on the authenticated user's role
- Axios-powered backend integration for agencies, branches, users, courses, and lessons
- Tailwind CSS design with responsive page layout and loading state handling

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Auth0 React SDK
- Axios

## Project Structure

- `src/App.jsx` — app routing and role-based entry point
- `src/main.jsx` — Auth0 provider and app bootstrap
- `src/context/AuthContext.jsx` — current user loading and auth token management
- `src/api/client.js` — API client and resource helpers
- `src/pages/LoginPage.jsx` — Auth0 sign-in page
- `src/pages/StaffDashboard.jsx` — staff dashboard entry point
- `src/pages/educator/Dashboard.jsx` — educator dashboard
- `src/pages/superadmin/Dashboard.jsx` — superadmin dashboard
- `src/components/LoadingScreen.jsx` — loading state UI

## Prerequisites

- Node.js 18+
- npm 9+

## Environment Variables

Create a `.env` file at the project root with these values:

```env
VITE_AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN
VITE_AUTH0_CLIENT_ID=YOUR_AUTH0_CLIENT_ID
VITE_AUTH0_AUDIENCE=YOUR_AUTH0_AUDIENCE
VITE_API_BASE_URL=http://localhost:8080
```

- `VITE_AUTH0_DOMAIN` — Auth0 domain
- `VITE_AUTH0_CLIENT_ID` — Auth0 client ID
- `VITE_AUTH0_AUDIENCE` — Auth0 API audience
- `VITE_API_BASE_URL` — backend API base URL (defaults to `http://localhost:8080`)

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

Open the local URL shown in the console (usually `http://localhost:5173`).

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Auth Flow

1. User opens the app and is redirected to `LoginPage` if not authenticated.
2. Auth0 handles sign-in and returns a session token.
3. `AuthContext` silently retrieves an access token and sets it on the Axios client.
4. The app calls `/api/auth/me` to load the current user and determine the role.
5. The app renders the appropriate dashboard for `SUPERADMIN`, `EDUCATOR`, `CLINICIAN`, or `TRAINEE`.

## API Requirements

The frontend expects the backend API to expose:

- `GET /api/auth/me` — returns current authenticated user data
- `GET /api/agencies`
- `POST /api/agencies`
- `GET /api/agencies/:agencyId/branches`
- `POST /api/agencies/:agencyId/branches`
- `GET /api/agencies/:agencyId/users`
- `POST /api/agencies/:agencyId/users`
- `GET /api/courses`
- `POST /api/courses`
- `GET /api/courses/:id`
- `GET /api/courses/:courseId/lessons`
- `POST /api/courses/:courseId/lessons`

## Notes

- The app uses Auth0 for authentication and requires a proper Auth0 application setup.
- Role-based rendering is controlled by `currentUser.role`.
- Unrecognized roles display an error message in the app.

## License

This repository currently does not specify a license.

