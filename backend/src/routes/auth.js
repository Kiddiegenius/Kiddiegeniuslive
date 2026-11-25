import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { pool } from "../db.js";

const router = Router();
const registerSchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(12).max(128),
  adultConfirmation: z.literal(true)
});
const loginSchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(128)
});

function issueToken(parent) {
  return jwt.sign(
    { role: "parent", email: parent.email },
    process.env.JWT_SECRET || "local-development-only-secret-change-me",
    { subject: parent.id, expiresIn: "2h", issuer: "kiddie-genius-world", audience: "kgw-parent" }
  );
}

router.post("/register", async (req, res, next) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Enter a valid email, a password of at least 12 characters, and confirm you are an adult." });

  try {
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const result = await pool.query(
      "INSERT INTO parents (email, password_hash, adult_confirmed_at) VALUES ($1, $2, NOW()) RETURNING id, email",
      [parsed.data.email, passwordHash]
    );
    const parent = result.rows[0];
    return res.status(201).json({ parent: { id: parent.id, email: parent.email }, token: issueToken(parent), tokenType: "Bearer", expiresIn: 7200 });
  } catch (error) {
    if (error.code === "23505") return res.status(409).json({ error: "An account with this email already exists" });
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Enter a valid email and password." });

  try {
    const result = await pool.query("SELECT id, email, password_hash FROM parents WHERE email = $1", [parsed.data.email]);
    const parent = result.rows[0];
    const valid = parent ? await bcrypt.compare(parsed.data.password, parent.password_hash) : false;
    if (!valid) return res.status(401).json({ error: "Email or password is incorrect" });
    return res.json({ parent: { id: parent.id, email: parent.email }, token: issueToken(parent), tokenType: "Bearer", expiresIn: 7200 });
  } catch (error) {
    return next(error);
  }
});

export default router;
