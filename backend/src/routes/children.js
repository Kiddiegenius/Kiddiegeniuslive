import { Router } from "express";
import { z } from "zod";
import { pool } from "../db.js";
import { requireParent } from "../middleware/auth.js";

const router = Router();
router.use(requireParent);

const createSchema = z.object({
  nickname: z.string().trim().min(1).max(24),
  grade: z.enum(["K", "1", "2", "3", "4", "5"])
});
const progressSchema = z.object({
  lessonId: z.string().uuid(),
  status: z.enum(["started", "completed"]),
  score: z.number().int().min(0).max(100).optional(),
  timeSpentSeconds: z.number().int().min(0).max(7200).optional()
});

router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT c.id, c.nickname, c.grade, c.created_at, COUNT(p.id) FILTER (WHERE p.status = 'completed')::int AS completed_lessons FROM children c LEFT JOIN lesson_progress p ON p.child_id = c.id WHERE c.parent_id = $1 GROUP BY c.id ORDER BY c.created_at",
      [req.parentId]
    );
    res.json({ children: result.rows });
  } catch (error) { next(error); }
});

router.post("/", async (req, res, next) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Provide a nickname and grade K–5." });
  try {
    const result = await pool.query(
      "INSERT INTO children (parent_id, nickname, grade) VALUES ($1, $2, $3) RETURNING id, nickname, grade, created_at",
      [req.parentId, parsed.data.nickname, parsed.data.grade]
    );
    res.status(201).json({ child: result.rows[0] });
  } catch (error) { next(error); }
});

router.post("/:childId/progress", async (req, res, next) => {
  const childId = z.string().uuid().safeParse(req.params.childId);
  const parsed = progressSchema.safeParse(req.body);
  if (!childId.success || !parsed.success) return res.status(400).json({ error: "Invalid child or progress data." });

  try {
    const owned = await pool.query("SELECT id, grade FROM children WHERE id = $1 AND parent_id = $2", [childId.data, req.parentId]);
    if (!owned.rowCount) return res.status(404).json({ error: "Child profile not found" });

    const lesson = await pool.query(
      "SELECT id FROM lessons WHERE id = $1 AND grade = $2 AND published = TRUE",
      [parsed.data.lessonId, owned.rows[0].grade]
    );
    if (!lesson.rowCount) return res.status(404).json({ error: "Published lesson not found for this grade" });

    const result = await pool.query(
      `INSERT INTO lesson_progress (child_id, lesson_id, status, score, time_spent_seconds, completed_at)
       VALUES ($1, $2, $3, $4, $5, CASE WHEN $3 = 'completed' THEN NOW() ELSE NULL END)
       ON CONFLICT (child_id, lesson_id) DO UPDATE SET
         status = CASE WHEN lesson_progress.status = 'completed' THEN 'completed' ELSE EXCLUDED.status END,
         score = GREATEST(COALESCE(lesson_progress.score, 0), COALESCE(EXCLUDED.score, 0)),
         time_spent_seconds = GREATEST(lesson_progress.time_spent_seconds, EXCLUDED.time_spent_seconds),
         completed_at = COALESCE(lesson_progress.completed_at, EXCLUDED.completed_at),
         updated_at = NOW()
       RETURNING lesson_id, status, score, time_spent_seconds, completed_at`,
      [childId.data, parsed.data.lessonId, parsed.data.status, parsed.data.score ?? null, parsed.data.timeSpentSeconds ?? 0]
    );
    res.json({ progress: result.rows[0] });
  } catch (error) { next(error); }
});

router.get("/:childId/progress", async (req, res, next) => {
  const childId = z.string().uuid().safeParse(req.params.childId);
  if (!childId.success) return res.status(400).json({ error: "Invalid child profile." });
  try {
    const owned = await pool.query("SELECT id, nickname, grade FROM children WHERE id = $1 AND parent_id = $2", [childId.data, req.parentId]);
    if (!owned.rowCount) return res.status(404).json({ error: "Child profile not found" });
    const progress = await pool.query(
      "SELECT lp.lesson_id, l.title, l.subject, l.grade, l.benchmark_code, lp.status, lp.score, lp.time_spent_seconds, lp.completed_at FROM lesson_progress lp JOIN lessons l ON l.id = lp.lesson_id WHERE lp.child_id = $1 ORDER BY lp.updated_at DESC",
      [childId.data]
    );
    res.json({ child: owned.rows[0], progress: progress.rows });
  } catch (error) { next(error); }
});

export default router;
