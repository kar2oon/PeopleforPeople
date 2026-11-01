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

Demo login: demo@peopleforpeople.org / demo1234

## Structure
    src/App.jsx              state + routing
    src/hooks/useHash.js     hash router
    src/components/          Header, CampaignCard
    src/pages/               Home, Login, Register
    src/data/campaigns.js    mock campaigns
