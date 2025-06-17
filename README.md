# Simple Job Queue App (MERN + Redis + BullMQ)

## Structure

- API: Express (ES6) for creating/fetching/updating jobs
- Worker: BullMQ worker that processes jobs instantly
- Dashboard: React app that visualizes job list
- Redis: Backend queue (via BullMQ)

## Setup Instructions

1. **Run Redis**: `docker run -p 6379:6379 redis`
2. **Start API Service**: `cd api-service && node index.js`
3. **Start Worker Service**: `cd worker-service && node index.js`
4. **Start Frontend**: `cd dashboard && npm start`

## Flow

- Dashboard adds job → API queues to Redis → Worker picks → Worker notifies API → Dashboard updates

## Queue Used

- [BullMQ](https://docs.bullmq.io/) with Redis
