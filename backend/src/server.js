import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { pool } from "./db.js";
import authRoutes from "./routes/auth.js";
import childRoutes from "./routes/children.js";
import curriculumRoutes from "./routes/curriculum.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:4173")
  .split(",").map((origin) => origin.trim()).filter(Boolean);

if (process.env.NODE_ENV === "production") {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters");
  }
}

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "32kb" }));

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", service: "kiddie-genius-world-api" });
  } catch {
    res.status(503).json({ status: "unavailable", service: "kiddie-genius-world-api" });
  }
});

app.use("/api/v1/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: "draft-8", legacyHeaders: false }), authRoutes);
app.use("/api/v1/children", childRoutes);
app.use("/api/v1/curriculum", curriculumRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, _req, res, _next) => {
  if (err.message === "Origin is not allowed by CORS") {
    return res.status(403).json({ error: "Origin not allowed" });
  }
  console.error("API request failed:", err.message);
  return res.status(500).json({ error: "Internal server error" });
});

const serverInstance = app.listen(port, () => {
  console.log(`Kiddie Genius World API listening on port ${port}`);
});

async function shutdown(signal) {
  console.log(`${signal} received; shutting down API`);
  serverInstance.close(async () => {
    await pool.end();
    process.exit(0);
  });
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
