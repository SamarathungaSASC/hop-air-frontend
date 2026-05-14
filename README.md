# HOP Air Frontend

React + Tailwind CSS frontend for the HOP Air platform.

## Prerequisites

- Node.js 18+
- npm 9+

---

## Environment Variables

Edit `.env` with your values:

---

## 3. Install & Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## 4. How Role Routing Works

After login, the frontend calls `GET /api/auth/me`. The backend resolves the user from the JWT token and returns their role. The frontend then renders the correct dashboard:

| Role | Dashboard |
|------|-----------|
| SUPERADMIN | Agency + Branch + User management |
| EDUCATOR | Course + Lesson management |
| CLINICIAN | Filtered course viewer (their branch + role) |
| TRAINEE | Filtered course viewer (their branch + role) |

---

## 5. Video Delivery

The `VideoPlayer` component handles two modes automatically:
- **YouTube URL** → renders an embedded `<iframe>` with no external redirects
- **Direct file URL** → renders an HTML5 `<video>` player

No external redirects occur in either case.

---

## 6. Project Structure

```
src/
├── api/client.js         # All API calls + token injection
├── components/
│   ├── LoadingScreen.jsx
│   ├── Modal.jsx
│   ├── Navbar.jsx
│   └── VideoPlayer.jsx
├── context/AuthContext.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── StaffDashboard.jsx  (Clinician + Trainee)
│   ├── superadmin/Dashboard.jsx
│   └── educator/Dashboard.jsx
├── App.jsx
├── main.jsx
└── index.css
```

---

## 3. Install & Run

```bash
npm install
npm run dev
```
