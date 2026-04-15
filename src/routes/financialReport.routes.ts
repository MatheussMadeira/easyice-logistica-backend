import { Router } from "express";
import { FinancialReportController } from "../controllers/FinancialReportController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const financialReportRoutes = Router();
const financialReportController = new FinancialReportController();

financialReportRoutes.use(authMiddleware);
financialReportRoutes.get(
  "/",
  roleMiddleware(["ADMIN"]),
  financialReportController.index
);

export { financialReportRoutes };
