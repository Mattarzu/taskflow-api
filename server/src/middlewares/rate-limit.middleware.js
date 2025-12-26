import rateLimit from "express-rate-limit";

// Limita intentos de auth por IP para frenar fuerza bruta.
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // 20 intentos por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Demasiados intentos, intenta más tarde" },
});
