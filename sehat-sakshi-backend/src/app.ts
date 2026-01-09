import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173","http://localhost:5000","http://localhost:8080"],
    credentials: true
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Sehat Saathi backend running"
  });
});

export default app;
