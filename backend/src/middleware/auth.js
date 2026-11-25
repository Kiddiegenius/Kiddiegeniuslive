import jwt from "jsonwebtoken";

export function requireParent(req, res, next) {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null;
  if (!token) return res.status(401).json({ error: "Sign in required" });

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "local-development-only-secret-change-me",
      { issuer: "kiddie-genius-world", audience: "kgw-parent" }
    );
    if (payload.role !== "parent" || typeof payload.sub !== "string") {
      return res.status(403).json({ error: "Parent access required" });
    }
    req.parentId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: "Session is invalid or expired" });
  }
}
