import express from "express";
import { getMe, login, logout, signup } from "../controllers/authController.js";
import upload from "../middleware/multer.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", upload.single("avatar"), signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
