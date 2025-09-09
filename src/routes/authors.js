import express from "express";
import {
  // createAuthor,
  deleteAuthorById,
  getAllAuthors,
  getAuthorBooks,
  getAuthorById,
  updateAuthorById,
} from "../controllers/authors.js";
import { authenticatedMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getAllAuthors);
router.get("/:id", authenticatedMiddleware, getAuthorById);
// router.post("/", authenticatedMiddleware, createAuthor);
router.patch("/:id", authenticatedMiddleware, updateAuthorById);
router.delete("/:id", authenticatedMiddleware, deleteAuthorById);
router.get("/:id/books", authenticatedMiddleware, getAuthorBooks);

export default router;
