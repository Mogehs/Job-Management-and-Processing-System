import express from "express";
import cors from "cors";
import { jobQueue } from "./jobQueue.js";
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

const jobs = new Map();

app.post("/jobs", async (req, res) => {
  const { title } = req.body;
  const job = await jobQueue.add("new-job", { title });
  jobs.set(job.id, { id: job.id, title, status: "Pending" });
  res.status(201).json(jobs.get(job.id));
});

app.get("/jobs", (req, res) => {
  res.json(Array.from(jobs.values()));
});

app.post("/jobs/:id/complete", (req, res) => {
  const { id } = req.params;
  if (jobs.has(id)) {
    const job = jobs.get(id);
    job.status = "Completed";
    jobs.set(id, job);
    return res.json({ message: "Marked as completed" });
  }
  res.status(404).json({ error: "Job not found" });
});

// Mount Bull Board UI
app.use("/admin/queues", serverAdapter.getRouter());

app.listen(3001, () => {
  console.log("API Service running at http://localhost:3001");
  console.log("Bull Board UI available at http://localhost:3001/admin/queues");
});
