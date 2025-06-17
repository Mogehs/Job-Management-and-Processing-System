import { Queue } from "bullmq";
import Redis from "ioredis";

const connection = new Redis();
const jobQueue = new Queue("jobs", { connection });

export { jobQueue, connection };
