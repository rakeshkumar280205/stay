import express from "express";
import {
    registerUser,
    loginUser,
    registerHost,
    loginHost,
    logout,
    getSession,
} from "../controllers/authController.js";

const router = express.Router();

// User authentication
router.post("/user/register", registerUser);
router.post("/user/login", loginUser);

// Host authentication
router.post("/host/register", registerHost);
router.post("/host/login", loginHost);

// Common
router.post("/logout", logout);
router.get("/session", getSession);

export default router;
