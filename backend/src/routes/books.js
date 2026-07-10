import express from "express";
import { addBook, getBooks } from "../controllers/booksController.js";

const router = express.Router();

router.post("/", addBook);

router.get("/:user_id", getBooks);

export default router;