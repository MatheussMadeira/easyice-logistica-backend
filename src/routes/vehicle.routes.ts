import { Router } from "express";
import { VehicleController } from "../controllers/VehicleController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware"; 

const vehicleRoutes = Router();
const vehicleController = new VehicleController();

vehicleRoutes.use(authMiddleware);

vehicleRoutes.get("/", vehicleController.index);

vehicleRoutes.post("/", roleMiddleware(["ADMIN"]), vehicleController.create);
vehicleRoutes.put("/:id", roleMiddleware(["ADMIN"]), vehicleController.update);
vehicleRoutes.patch(
  "/:id/disable",
  roleMiddleware(["ADMIN"]),
  vehicleController.disable
);

export { vehicleRoutes };
