import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/books.js";
import wishlistRoutes from "./routes/wishlist.js";
import groupRoutes from "./routes/groupRoutes.js";
import swapRoutes from "./routes/swapRoutes.js";
import requireAuth from "./middleware/requireAuth.js";
import { debugAllSessions } from "./services/sessionStore.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("BookSwap API Running");
});

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/groups",groupRoutes);
app.use("/api/swaps", swapRoutes);

// Protected route example
app.get("/api/dashboard", requireAuth, (req, res) => {
  res.json({
    message: `Welcome back, ${req.user.email}`,
  });
});

// Debug route
if (process.env.NODE_ENV !== "production") {
  app.get("/api/debug/sessions", (req, res) => {
    res.json(debugAllSessions());
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    error: err.message || "Server error",
  });
});

export default app;