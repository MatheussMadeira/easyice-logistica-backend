import { Router } from "express";
import { DashboardController } from "../controllers/DashboardController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

dashboardRoutes.get(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  dashboardController.getStats
);

export { dashboardRoutes };
