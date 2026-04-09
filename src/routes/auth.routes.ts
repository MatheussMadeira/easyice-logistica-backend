import { AuthController } from "./../controllers/AuthController";
import { Router } from "express";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post("/register", authController.register);

authRoutes.post("/login", authController.login);

export { authRoutes };
