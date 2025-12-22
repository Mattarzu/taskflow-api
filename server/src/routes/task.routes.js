import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createTask, getTasks } from "../controllers/task.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getTasks);
router.post("/", createTask);

export default router;

