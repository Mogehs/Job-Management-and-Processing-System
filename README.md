# Simple Job Queue App (MERN + Redis + BullMQ)

## Structure

- API: Express (ES6) for creating/fetching/updating jobs with Bull Board integration
- Worker: BullMQ worker that processes jobs instantly
- Dashboard: React app that visualizes job list and Bull Board UI for queue monitoring
- Redis: Backend queue (via BullMQ)

## Setup Instructions

1. **Run Redis**: `docker run -p 6379:6379 redis`
2. **Start API Service**: `cd backend/api-service && npm run start`
3. **Start Worker Service**: `cd backend/worker-service && npm run start`
4. **Start Frontend**: `cd frontend && npm run dev`
5. **Access Bull Board**: Open `http://localhost:3001/admin/queues` to view the Bull Board dashboard

## Flow

- Dashboard adds job → API queues to Redis → Worker picks → Worker notifies API → Dashboard updates
- Bull Board provides real-time monitoring and management of all queues and jobs

## Technologies Used

- [BullMQ](https://docs.bullmq.io/) - Redis-based queue for handling background jobs
- [Bull Board](https://github.com/felixmosh/bull-board) - UI dashboard for monitoring BullMQ queues
- Redis - In-memory data structure store for queue backend
- React - Frontend framework for user interface
- Express - Backend API server
