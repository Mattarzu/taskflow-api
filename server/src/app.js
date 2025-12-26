import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Seguridad y observabilidad básicas
app.use(helmet());
app.use(
	cors({
		origin: process.env.CORS_ORIGIN || "*",
		methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
	})
);
app.use(express.json({ limit: "1mb" }));
if (process.env.NODE_ENV !== "test") {
	app.use(morgan("dev"));
}

// Healthcheck
app.get("/health", (_req, res) => {
	res.status(200).json({ status: "ok" });
});

// Rutas
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Manejo centralizado de errores
app.use(errorHandler);

export default app;

