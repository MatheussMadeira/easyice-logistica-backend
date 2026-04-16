import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  role: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1] ?? (req.query.token as string);

  if (!token) {
    return res
      .status(401)
      .json({ error: "Acesso negado. Token não fornecido." }) as any;
  }

  try {
    const secret = process.env.JWT_SECRET || "easyice_secret_key_2026";
    const decoded = jwt.verify(token, secret) as TokenPayload;

    req.userId = decoded.id;
    req.userRole = decoded.role;

    return next();
  } catch {
    return res
      .status(401)
      .json({ error: "Token inválido ou expirado." }) as any;
  }
};
