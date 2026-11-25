import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/grades", (_req, res) => {
  res.json({ grades: [
    { id: "K", label: "Kindergarten" },
    { id: "1", label: "1st Grade" },
    { id: "2", label: "2nd Grade" },
    { id: "3", label: "3rd Grade" },
    { id: "4", label: "4th Grade" },
    { id: "5", label: "5th Grade" }
  ]});
});

router.get("/lessons", async (req, res, next) => {
  const grade = req.query.grade;
  const subject = req.query.subject;
  if (grade && !["K", "1", "2", "3", "4", "5"].includes(String(grade))) {
    return res.status(400).json({ error: "Grade must be K through 5." });
  }
  if (subject && !["math", "ela", "science", "social-studies", "arts"].includes(String(subject))) {
    return res.status(400).json({ error: "Unsupported subject." });
  }
  try {
    const clauses = [];
    const values = [];
    if (grade) { values.push(String(grade)); clauses.push(`grade = $${values.length}`); }
    if (subject) { values.push(String(subject)); clauses.push(`subject = $${values.length}`); }
    const where = clauses.length ? "WHERE " + clauses.join(" AND ") : "";
    const result = await pool.query(
      `SELECT id, slug, title, description, grade, subject, strand, benchmark_code, learning_objective, estimated_minutes
       FROM lessons ${where} ORDER BY grade, subject, sort_order, title LIMIT 200`,
      values
    );
    res.json({ lessons: result.rows });
  } catch (error) { next(error); }
});

export default router;
