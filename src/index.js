import express from "express";

import bookRouter from "./routes/books.js";
import authorRouter from "./routes/authors.js";
import authRouter from "./routes/auth.js";

const PORT = 8000;

const app = express();
app.use(express.json());

app.use("/api/books", bookRouter);
app.use("/api/authors", authorRouter);
app.use("/api", authRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port:${PORT}`);
});
