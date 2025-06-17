import { Queue } from "bullmq";
import Redis from "ioredis";

const connection = new Redis();
const redisClient = new Redis();
const jobQueue = new Queue("jobs", { connection });

const JobService = {
  async createJob(id, title) {
    const job = {
      id,
      title,
      status: "Pending",
    };

    await redisClient.hmset(`job:${id}`, job);

    await redisClient.sadd("jobs", id);

    return job;
  },

  async getAllJobs() {
    const jobIds = await redisClient.smembers("jobs");
    if (!jobIds || jobIds.length === 0) return [];

    const pipeline = redisClient.pipeline();
    jobIds.forEach((id) => {
      pipeline.hgetall(`job:${id}`);
    });

    const jobs = await pipeline.exec();
    return jobs.map((result) => result[1] || null).filter(Boolean);
  },

  async updateJobStatus(id, status) {
    await redisClient.hset(`job:${id}`, "status", status);
    return this.getJob(id);
  },
};

export { jobQueue, connection, redisClient, JobService };
