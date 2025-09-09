import express from "express";
import {
  createBook,
  deleteBookById,
  getAllBooks,
  getBookById,
  updateBookById,
} from "../controllers/books.js";
import { authenticatedMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getAllBooks);

router.post("/", authenticatedMiddleware, createBook);

router.get("/:id", getBookById);

router.patch("/:id", authenticatedMiddleware, updateBookById);

router.delete("/:id", authenticatedMiddleware, deleteBookById);

export default router;
