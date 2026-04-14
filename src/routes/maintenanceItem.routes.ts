import { Router } from "express";
import { MaintenanceItemController } from "../controllers/MaintenenceItemController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const maintenanceItemRoutes = Router();
const controller = new MaintenanceItemController();

maintenanceItemRoutes.use(authMiddleware);

maintenanceItemRoutes.get("/", controller.index);

maintenanceItemRoutes.post("/", roleMiddleware(["ADMIN"]), controller.create);
maintenanceItemRoutes.put("/:id", roleMiddleware(["ADMIN"]), controller.update);
maintenanceItemRoutes.patch(
  "/:id/toggle",
  roleMiddleware(["ADMIN"]),
  controller.toggle
);

export { maintenanceItemRoutes };
