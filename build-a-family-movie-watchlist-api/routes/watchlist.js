import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../utils/db.js";

const router = Router();

router.use(authenticate);

// View a user's watchlist: any authenticated user may do this.
router.get("/:userId", (req, res) => {
  const userId = Number(req.params.userId);
  const watchlist = getWatchlist(userId);

  if (watchlist === null) {
    return res.status(404).json({ error: "User not found." });
  }

  return res.status(200).json(watchlist);
});

// Add a movie.
router.post("/:userId/movies", authorizeModification, (req, res) => {
  const { title, genre } = req.body ?? {};

  if (!title || !genre) {
    return res.status(400).json({
      error: "Title and genre are required.",
    });
  }

  const movie = addMovie(Number(req.params.userId), { title, genre });

  if (!movie) {
    return res.status(404).json({ error: "User not found." });
  }

  return res.status(201).json(movie);
});

// Update a movie.
router.put(
  "/:userId/movies/:movieId",
  authorizeModification,
  (req, res) => {
    const movie = updateMovie(
      Number(req.params.userId),
      Number(req.params.movieId),
      req.body ?? {}
    );

    if (!movie) {
      return res.status(404).json({ error: "Movie or user not found." });
    }

    return res.status(200).json(movie);
  }
);

// Delete a movie.
router.delete(
  "/:userId/movies/:movieId",
  authorizeModification,
  (req, res) => {
    const deleted = deleteMovie(
      Number(req.params.userId),
      Number(req.params.movieId)
    );

    if (!deleted) {
      return res.status(404).json({ error: "Movie or user not found." });
    }

    return res.status(200).json({ message: "Movie deleted successfully." });
  }
);

export default router;