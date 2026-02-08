# SocialX

SocialX is a full-stack social feed application where users can sign up, create posts, interact with a live feed, and manage their profile. The UI is responsive and optimized for both desktop and mobile.

Links:
- Live Frontend: https://socialx-seven.vercel.app/
- Backend API: https://socialx-vm8q.onrender.com/api

## Features

- Authentication: signup, login, logout
- Create posts with text, images, and polls
- Public feed with username, content, timestamps, and media
- Feed filters: All Posts, For You, Most Liked, Most Commented, Most Shared
- Search across users and post content
- Likes, comments, and shares with live counts
- Like usernames stored on posts
- Comment usernames stored on posts
- Poll voting (one vote per user)
- Auto-refresh feed every 30 seconds
- Pagination with “Load more”
- Follow and unfollow users (persisted)
- Profile drawer with stats, followers list, and post management
- Delete your own posts from profile
- About page with product overview
- Responsive UI optimized for desktop and mobile

## Tech Stack

Frontend:
- React
- Material UI
- Axios

Backend:
- Node.js
- Express
- MongoDB
- JWT authentication

## Project Structure

SocialX/
├── backend/
└── frontend/

## Environment Variables

Frontend:

Create [frontend/.env](frontend/.env) for local development:

```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

Production (Vercel):

```
REACT_APP_API_BASE_URL=https://socialx-vm8q.onrender.com/api
```

Backend:

Configure [backend/.env](backend/.env):

```
PORT=5000
JWT_SECRET=your_secret
MONGO_URI=your_mongodb_uri
```

## Local Development

1) Start backend

```
cd backend
npm install
npm run dev
```

2) Start frontend

```
cd frontend
npm install
npm start
```

Frontend runs at http://localhost:3000
Backend runs at http://localhost:5000

## Deployment

Backend (Render):
- Base URL: https://socialx-vm8q.onrender.com/api

Frontend (Vercel):
- Live URL: https://socialx-seven.vercel.app/
- Set env var `REACT_APP_API_BASE_URL` to the Render URL above.

## System Architecture

SocialX follows a simple client-server architecture:

- React frontend served on Vercel
- Node/Express API on Render
- MongoDB database for persistence
- JWT-based auth for protected routes

Flow (high level):

1) Client requests data via Axios
2) API validates JWT and performs business logic
3) MongoDB stores users, posts, and relationships
4) API returns JSON responses for the UI to render

## API Overview

Auth:
- POST /api/auth/signup
- POST /api/auth/login

Posts:
- GET /api/posts
- POST /api/posts
- POST /api/posts/:id/like
- POST /api/posts/:id/comment
- POST /api/posts/:id/share
- POST /api/posts/:id/vote
- DELETE /api/posts/:id

Users:
- GET /api/users/me
- GET /api/users/me/posts
- POST /api/users/:id/follow

## Notes

- JSON body limit is set to 10MB to support image uploads.
- JWT-protected endpoints require `Authorization: Bearer <token>`.

## Author

Jayanth Midde
