import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { authMiddleware } from "../middlewares/authMiddleware";

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

dashboardRoutes.get("/", authMiddleware, dashboardController.getStats);
dashboardRoutes.get("/stream", authMiddleware, dashboardController.stream);

export { dashboardRoutes };
