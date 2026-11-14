# PeopleforPeople (front-end prototype)

React single-page application (Vite). Mock data only, no backend.

## Run
    npm install
    npm run dev        # http://localhost:5173
    npm run build      # static files in dist/ (host on any static/cloud hosting)

## Features
- Homepage with campaigns (category filter, progress, join/leave)
- Login / Logout / Registration with validation
- Hash routing: #home, #login, #register

## Google sign-in setup
1. Create an OAuth Client ID (type: Web application) in Google Cloud Console.
2. Add `http://localhost:5173` under Authorized JavaScript origins.
3. Copy `.env.example` to `.env.local` and paste your Client ID.
4. Restart `npm run dev`.

Google handles the password and 2-Step Verification code on its own sign-in screen.
A first-time Google sign-in registers the account in the prototype.

Demo login (email/password, still available): demo@peopleforpeople.org / demo1234

## Structure
    src/App.jsx              state + routing
    src/hooks/useHash.js     hash router
    src/components/          Header, CampaignCard
    src/pages/               Home, Login, Register
    src/data/campaigns.js    mock campaigns
