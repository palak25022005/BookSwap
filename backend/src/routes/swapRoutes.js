import express from "express";

import {
    getMatches,
    sendRequest,
    getRequests,
    acceptRequest,
    rejectRequest
} from "../controllers/swapController.js";

const router = express.Router();

router.get("/matches/:firebase_uid", getMatches);

router.post("/request", sendRequest);

router.get("/requests/:firebase_uid", getRequests);

router.put("/request/:id/accept", acceptRequest);

router.put("/request/:id/reject", rejectRequest);

export default router;