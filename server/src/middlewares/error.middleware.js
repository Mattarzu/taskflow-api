// Centralized error handler to avoid leaking stack traces in production
export const errorHandler = (err, _req, res, _next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal server error";

  if (process.env.NODE_ENV !== "test") {
    console.error("[ERROR]", { status, message, stack: err.stack });
  }

  res.status(status).json({ message });
};
