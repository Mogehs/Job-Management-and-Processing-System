import express from "express";
import cors from "cors";
import { jobQueue, JobService } from "./jobQueue.js";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js";
import { ExpressAdapter } from "@bull-board/express";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullMQAdapter(jobQueue)],
  serverAdapter: serverAdapter,
});

app.post("/jobs", async (req, res) => {
  try {
    const { title } = req.body;
    const job = await jobQueue.add("new-job", { title });

    const jobData = await JobService.createJob(job.id, title);

    res.status(201).json(jobData);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ error: "Failed to create job" });
  }
});

app.get("/jobs", async (req, res) => {
  try {
    const jobs = await JobService.getAllJobs();
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

app.use("/admin/queues", serverAdapter.getRouter());

app.listen(3001, () => {
  console.log("API Service running at http://localhost:3001");
  console.log("Bull Board UI available at http://localhost:3001/admin/queues");
});
