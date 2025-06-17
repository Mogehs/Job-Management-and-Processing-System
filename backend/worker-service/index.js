import { Worker } from "bullmq";
import Redis from "ioredis";

const connection = new Redis({
  maxRetriesPerRequest: null,
});

const redisClient = new Redis();

const worker = new Worker(
  "jobs",
  async (job) => {
    console.log("Processing job:", job.id);

    try {
      const { title } = job.data;
      console.log(`Processing job ${job.id}: ${title}`);

      // Update job status directly in Redis
      await redisClient.hset(`job:${job.id}`, "status", "Completed");

      return { success: true };
    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error);
      throw error;
    }
  },
  { connection }
);

console.log("Worker is listening for jobs...");
