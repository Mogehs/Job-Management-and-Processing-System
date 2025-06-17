import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");

  const fetchJobs = async () => {
    const res = await axios.get("http://localhost:3001/jobs");
    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 3000);
    return () => clearInterval(interval);
  }, []);

  const createJob = async () => {
    if (!title.trim()) return;
    await axios.post("http://localhost:3001/jobs", { title });
    setTitle("");
    fetchJobs();
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: "1rem", textAlign: "center" }}>
        📋 Job Dashboard
      </h1>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Job title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            flex: 1,
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={createJob}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add Job
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
              Job Title
            </th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                {job.title}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                <strong
                  style={{
                    color: job.status === "Completed" ? "green" : "orange",
                  }}
                >
                  {job.status}
                </strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
