import { Worker } from "bullmq";
import axios from "axios";
import Redis from "ioredis";

const connection = new Redis({
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "jobs",
  async (job) => {
    console.log("Processing job:", job.id);

    await axios.post(`http://localhost:3001/jobs/${job.id}/complete`);
  },
  { connection }
);

console.log("Worker is listening for jobs...");
