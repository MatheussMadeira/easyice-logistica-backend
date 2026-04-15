import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { expenseRoutes } from "./expense.routes";
import { userRoutes } from "./user.routes";
import { vehicleRoutes } from "./vehicle.routes";
import { routesPath as routeManagementRoutes } from "./route.routes";
import { storageRoutes } from "./storage.routes";
import { maintenanceItemRoutes } from "./maintenanceItem.routes";
import { dashboardRoutes } from "./dashboard.routes";
import { financialReportRoutes } from "./financialReport.routes";
import { profileRoutes } from "./profile.routes";
import { exportRoutes } from "./export.routes";
import { operationalExpenseRoutes } from "./operationalExpense.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);

routes.use("/expenses", expenseRoutes);
routes.use("/vehicles", vehicleRoutes);
routes.use("/routes", routeManagementRoutes);
routes.use("/maintenance-items", maintenanceItemRoutes);
routes.use("/operational-expenses", operationalExpenseRoutes);
routes.use("/storage", storageRoutes);
routes.use("/dashboard", dashboardRoutes);
routes.use("/financial-report", financialReportRoutes);
routes.use("/export", exportRoutes);
routes.use("/profile", profileRoutes);

export { routes };
