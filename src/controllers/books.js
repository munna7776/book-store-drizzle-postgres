import { count, eq, sql } from "drizzle-orm";
import db from "../db.js";
import { booksTable } from "../models/books.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getAllBooks = async (req, res) => {
  try {
    const { query } = req;
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const searchQuery = query.search || "";

    const queryWhereClause = searchQuery
      ? sql`to_tsvector('english', ${booksTable.title}) @@ plainto_tsquery('english', ${searchQuery})`
      : sql`true`;

    const [booksCount] = await db
      .select({ count: count() })
      .from(booksTable)
      .where(queryWhereClause);

    const totalPages = Math.ceil(booksCount.count / pageSize);

    if (page > totalPages) {
      return res.status(200).json({
        books: [],
        totalBooks: booksCount.count,
        currentPage: page,
        totalPages: totalPages,
      });
    }

    const books = await db
      .select()
      .from(booksTable)
      .where(queryWhereClause)
      .offset(pageSize * (page - 1))
      .limit(pageSize);

    return res.status(200).json({
      books: books,
      totalBooks: booksCount.count,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    res.status(500).end();
  }
};

export const createBook = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(422).json({ message: "Title is required." });
    }

    const authorId = req.user.id;

    const newBook = await db
      .insert(booksTable)
      .values({
        title,
        description,
        authorId,
      })
      .returning({
        id: booksTable.id,
        title: booksTable.title,
        description: booksTable.description,
        authorId: booksTable.authorId,
      });

    res.status(201).json({
      message: "New book created",
      book: newBook,
    });
  } catch (error) {
    res.status(500).end();
  }
};

export const getBookById = async (req, res) => {
  try {
    const id = req.params.id;
    const books = await db
      .select()
      .from(booksTable)
      .where((table) => eq(table.id, id))
      .limit(1);
    if (books.length === 0) {
      return res.status(404).json({ message: "Book not found." });
    }
    res.status(200).json({ book: books[0] });
  } catch (error) {
    res.status(500).json();
  }
};

export const updateBookById = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description } = req.body;
    if (!title) {
      return res.status(422).json({ message: "Title is required." });
    }
    const updatedBook = await db
      .update(booksTable)
      .set({
        title: title,
        description: description,
      })
      .where(eq(booksTable.id, id))
      .returning();

    if (updatedBook.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res
      .status(200)
      .json({ message: "Book updated successfully", book: updatedBook[0] });
  } catch (error) {
    res.status(500).json();
  }
};

export const deleteBookById = async (req, res) => {
  try {
    const id = req.params.id;

    const results = await db
      .delete(booksTable)
      .where(eq(booksTable.id, id))
      .returning();
    if (results.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json();
  }
};
