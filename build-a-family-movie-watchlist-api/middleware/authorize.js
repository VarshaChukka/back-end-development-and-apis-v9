export function authorizeModification(req, res, next) {
  const user = req.user;

  if (
    !user ||
    (
      user.role !== "parent" &&
      (
        user.role !== "child" ||
        String(req.params.userId) !== String(user.id)
      )
    )
  ) {
    return res.status(403).json({ error: "Access denied" });
  }

  next();
}