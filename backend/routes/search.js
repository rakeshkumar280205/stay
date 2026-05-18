import express from "express";
import { getSearchSuggestions } from "../controllers/searchController.js";

const router = express.Router();

// Public route - no authentication required
router.get("/suggestions", getSearchSuggestions);

export default router;
