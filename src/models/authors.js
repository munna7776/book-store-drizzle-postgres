import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";

export const authorsTable = pgTable("authors", {
  id: uuid().primaryKey().defaultRandom(),
  firstName: varchar({ length: 100 }).notNull(),
  lastName: varchar({ length: 100 }),
  email: varchar({ length: 255 }).notNull().unique(),
  password: text().notNull(),
  salt: text().notNull(),
});
