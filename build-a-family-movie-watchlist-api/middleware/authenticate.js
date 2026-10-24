import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided." });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }

  try {
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET || "family-movie-watchlist-secret"
    );
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}