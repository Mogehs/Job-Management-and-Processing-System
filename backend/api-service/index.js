import express from "express";
import cors from "cors";
import { jobQueue } from "./jobQueue.js";

const app = express();
app.use(cors());
app.use(express.json());

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

app.listen(3001, () => {
  console.log("API Service running at http://localhost:3001");
});
