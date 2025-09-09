import { eq } from "drizzle-orm";
import db from "../db.js";
import { authorsTable } from "../models/authors.js";
import { booksTable } from "../models/books.js";

export const getAllAuthors = async (_, res) => {
  try {
    const authors = await db.select().from(authorsTable);
    res.status(200).json({ authors: authors });
  } catch (error) {
    res.status(500).end();
  }
};
export const getAuthorById = async (req, res) => {
  try {
    const authorId = req.params.id;
    const results = await db
      .select({
        id: authorsTable.id,
        firstName: authorsTable.firstName,
        lastName: authorsTable.lastName,
        email: authorsTable.email,
      })
      .from(authorsTable)
      .where(eq(authorsTable.id, authorId));
    if (results.length === 0) {
      return res.status(404).json({ message: "No author found" });
    }
    res.status(200).json({ author: results[0] });
  } catch (error) {
    res.status(500).end();
  }
};
// export const createAuthor = async (req, res) => {
//   try {
//     const { firstName, lastName, email } = req.body;
//     if (!firstName || !email) {
//       return res
//         .status(422)
//         .json({ message: "firstName or email fields are missing" });
//     }
//     const results = await db
//       .insert(authorsTable)
//       .values({
//         firstName,
//         lastName,
//         email,
//       })
//       .returning();
//     return res
//       .status(201)
//       .json({ message: "Author created successfully", author: results[0] });
//   } catch (error) {
//     res.status(500).end();
//   }
// };
export const updateAuthorById = async (req, res) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, email } = req.body;
    if (!firstName || !email) {
      return res
        .status(422)
        .json({ message: "firstName or email fields are missing" });
    }
    const results = await db
      .update(authorsTable)
      .set({ firstName, lastName, email })
      .where(eq(authorsTable.id, id))
      .returning({
        id: authorsTable.id,
        firstName: authorsTable.firstName,
        lastName: authorsTable.lastName,
        email: authorsTable.email,
      });
    return res
      .status(200)
      .json({ message: "Author updated successfully", author: results[0] });
  } catch (error) {
    res.status(500).end();
  }
};
export const deleteAuthorById = async (req, res) => {
  try {
    const id = req.params.id;
    const results = await db
      .delete(authorsTable)
      .where(eq(authorsTable.id, id))
      .returning();
    if (results.length === 0) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.status(200).json({ message: "Successfully deleted author" });
  } catch (error) {
    res.status(500).end();
  }
};
export const getAuthorBooks = async (req, res) => {
  try {
    const id = req.params.id;
    const results = await db
      .select()
      .from(booksTable)
      .where(eq(booksTable.authorId, id));
    res.status(200).json({ books: results });
  } catch (error) {
    res.status(500).end();
  }
};
