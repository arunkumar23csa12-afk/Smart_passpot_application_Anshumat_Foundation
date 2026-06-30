# Passport Application Experience Redesign

Passport application portal redesign built for the Anshumat Foundation assignment. The project focuses on reducing confusion for first-time applicants through guided onboarding, step-based application flow, clear document guidance, appointment booking, draft saving, and post-submission confidence features.

## Figma Link
- https://www.figma.com/design/qka90ViqrcfFQqihgXmSQM/Internship?node-id=0-1&t=xRmp2qDOvjYAXSKK-1

## Project Structure
```bash
/frontend   # Vite React frontend
/backend    # Express backend
/README.md  # Setup instructions + assignment coverage
```

## Demo Login
- Email: `hire-me@anshumat.org`
- Password: `HireMe@2025!`

The backend seeds this demo user automatically every time `npm run backend` starts, so reviewers can log in immediately without creating an account.

If only the frontend is running, the login page still supports this mandatory demo account through a local fallback so evaluators are not blocked.

## Run Locally
```bash
npm install
npm run backend   # starts Express API on http://localhost:4000
npm run frontend  # starts Vite frontend on http://localhost:5173
npm run start     # runs both together
```

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express, CORS
- Persistence: Local storage for drafts + in-memory backend data for demo flow

## Assignment Coverage
### 1. User Onboarding Flow
Included:
- Welcome / Homepage
- Login / Signup
- Verification screen
- Dedicated onboarding setup screen for `Name`, `DOB`, and `City`
- Application introduction with steps, expected time, and required documents
- Clear first key action: `Start New Passport Application`

Relevant screens:
- `/`
- `/login`
- `/verify`
- `/onboarding-setup`
- `/apply`

### 2. Core Product Screens
Implemented screens:
- Landing / Homepage
- Login / Signup
- Onboarding setup / Application introduction
- Dashboard with status tracking
- Personal information form
- Address form
- Document upload
- Appointment booking
- Confirmation / submission success
- Supporting pages: My Documents, Message Center

### 3. Save / Sync Feature
Implemented:
- Autosave while filling form fields
- Draft save entry that appears on dashboard
- Continue a saved draft from the dashboard
- Visible sync state like `Saving...`
- Last saved time indicators
- Upload success / progress saved feedback

Examples in product:
- `Application draft saved`
- `Progress saved`
- `Documents uploaded successfully`
- `Booking preferences saved`

### 4. Cloud Export / Record Access
Implemented:
- Download application summary as PDF
- Download appointment receipt as PDF
- Share / copy application ID
- View application records in dashboard
- Demo email confirmation record shown in confirmation and message center
- Backend-stored application metadata for email confirmation and export actions

## UX Decisions
- Broke the flow into guided steps to reduce anxiety for first-time users
- Added onboarding setup before the main form so users understand what is needed
- Introduced save-state feedback to reduce fear of losing progress
- Kept appointment and confirmation screens highly structured for clarity
- Added dashboard, message center, and document center for confidence after submission

## Product Thinking Features
- Draft saving
- Resume from dashboard
- Export summary / receipt
- Shareable application reference
- Message center updates
- Metadata tracking for confirmation email and exports

## Backend
The backend is located in:
- [backend/server.js](backend/server.js)

It handles:
- demo user seeding
- login / signup
- profile updates
- application create / update / delete
- application metadata storage for exports and email confirmation

## API Endpoints
- `GET /api/auth/demo-user`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `PATCH /api/users/profile`
- `GET /api/applications?email=<email>`
- `POST /api/applications`
- `PATCH /api/applications/:id`
- `PATCH /api/applications/:id/metadata`
- `DELETE /api/applications/:id`

## Routes
- `/` → Home
- `/login` → Login
- `/verify` → Verification Success
- `/onboarding-setup` → First-time user setup
- `/dashboard` → Dashboard
- `/apply` → Application introduction
- `/form` → Personal Info
- `/address` → Address Information
- `/documents` → Document Upload
- `/my-documents` → My Documents
- `/messages` → Message Center
- `/appointment` → Appointment Booking
- `/success` → Confirmation

## Submission Notes
- Figma contains the UI design deliverables and design exploration.
- GitHub repo contains the working frontend and backend implementation.
- Demo login is seeded as required for evaluation.
- OTP is simulated for assignment/demo purposes and does not use a live OTP provider.
- Email confirmation is represented in-app and stored as application metadata instead of sending real emails.
- Backend data is stored in memory for demo simplicity and is not connected to a database.
