import express from "express";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes); // si ya lo tenés

export default app;

