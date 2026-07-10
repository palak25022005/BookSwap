import express from "express";
import {
    addWishlistBook,
    getWishlist
} from "../controllers/wishlistController.js";

const router = express.Router();

router.post("/", addWishlistBook);
router.get("/:user_id", getWishlist);

export default router;