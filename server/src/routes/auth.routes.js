import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { authRateLimiter } from "../middlewares/rate-limit.middleware.js";
import { validateAuthPayload } from "../middlewares/validate-auth.middleware.js";

const router = Router();

router.post("/register", authRateLimiter, validateAuthPayload, register);
router.post("/login", authRateLimiter, validateAuthPayload, login);

export default router;


