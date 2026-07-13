import express from "express";

import {
    createGroup,
    joinGroup,
    getUserGroups,
    getGroupDetails
} from "../controllers/groupController.js";

const router=express.Router();

router.post("/create",createGroup);

router.post("/join",joinGroup);

router.get("/:firebase_uid", getUserGroups);

router.get("/details/:id", getGroupDetails);

export default router;