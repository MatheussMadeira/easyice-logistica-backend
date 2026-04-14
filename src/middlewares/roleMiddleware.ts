import { Request, Response, NextFunction } from "express";

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.userRole;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: "Acesso negado. Você não tem permissão para realizar esta ação.",
      }) as any;
    }

    next();
  };
};
