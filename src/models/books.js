import { pgTable, text, uuid, varchar, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { authorsTable } from "./authors.js";

export const booksTable = pgTable(
  "books",
  {
    id: uuid().primaryKey().defaultRandom(),
    title: varchar({ length: 150 }).notNull(),
    description: text(),
    authorId: uuid().references(() => authorsTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("title_search_index").using(
      "gin",
      sql`to_tsvector('english', ${table.title})`
    ),
  ]
);
