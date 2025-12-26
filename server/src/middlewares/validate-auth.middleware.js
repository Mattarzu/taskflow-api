const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validación básica de payload de auth
export const validateAuthPayload = (req, res, next) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email y password requeridos" });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: "Email inválido" });
  }

  if (typeof password !== "string" || password.length < 6 || password.length > 100) {
    return res
      .status(400)
      .json({ message: "Password debe tener entre 6 y 100 caracteres" });
  }

  next();
};
