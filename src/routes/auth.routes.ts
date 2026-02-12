import { Router } from "express";
import { register, login, getProfile } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user",getProfile);

router.get("/profile", authenticate, (req, res) => {
  res.json({ message: "Welcome! You are authorized." });
});

export default router;
