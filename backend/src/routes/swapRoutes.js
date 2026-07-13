import express from "express";

import {
  getMatches,
  sendRequest,
} from "../controllers/swapController.js";

const router = express.Router();

router.get("/matches/:firebase_uid", getMatches);

router.post("/request", sendRequest);

export default router;