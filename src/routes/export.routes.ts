import { Router } from "express";
import { ExportController } from "../controllers/ExportController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const exportRoutes = Router();
const exportController = new ExportController();

exportRoutes.use(authMiddleware);
exportRoutes.use(roleMiddleware(["ADMIN"]));

exportRoutes.get("/counts", exportController.getCounts);
exportRoutes.get("/combustivel", exportController.combustivel);
exportRoutes.get("/despesas", exportController.despesas);

export { exportRoutes };
