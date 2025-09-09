import express from "express";
import { randomBytes, createHmac } from "node:crypto";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

import db from "../db.js";
import { authorsTable } from "../models/authors.js";
import { authorLoginSchema, authorSignUpSchema } from "../lib/validation.js";
import { getTransformedZodErrors } from "../lib/utils.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { body } = req;
    const parsedData = authorSignUpSchema.safeParse(body);

    if (parsedData.error) {
      const errors = getTransformedZodErrors(parsedData.error);
      return res.status(400).json({ errors });
    }

    const { firstName, lastName, email, password } = parsedData.data;

    const [existingUser] = await db
      .select()
      .from(authorsTable)
      .where(eq(email, authorsTable.email));
    if (existingUser) {
      return res
        .status(400)
        .json({ message: `User with ${email} already exists.` });
    }

    const salt = randomBytes(256).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    const [newAuthor] = await db
      .insert(authorsTable)
      .values({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        salt,
      })
      .returning({ id: authorsTable.id });

    const token = jwt.sign(
      { firstName, lastName, email, id: newAuthor.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      id: newAuthor.id,
      firstName,
      lastName,
      email,
      token,
    });
  } catch (error) {
    res.status(500).end();
  }
});

router.post("/login", async (req, res) => {
  try {
    const { body } = req;
    const parsedLoginSchema = authorLoginSchema.safeParse(body);
    if (parsedLoginSchema.error) {
      const errors = getTransformedZodErrors(parsedLoginSchema.error);
      return res.status(400).json({ errors });
    }

    const { email, password } = parsedLoginSchema.data;

    const [author] = await db
      .select()
      .from(authorsTable)
      .where(eq(email, authorsTable.email));
    if (!author) {
      return res
        .status(404)
        .json({ message: `User with ${email} don't exist.` });
    }

    const newHashedPassword = createHmac("sha256", author.salt)
      .update(password)
      .digest("hex");
    if (newHashedPassword !== author.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: author.id,
      firstName: author.firstName,
      lastName: author.lastName,
      email: author.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      ...payload,
      token,
    });
  } catch (error) {
    res.status(500).end();
  }
});

export default router;
