import { Router } from "express";
import { OrdemServicoController } from "../controllers/OrdemServicoController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const osRoutes = Router();
const osController = new OrdemServicoController();

osRoutes.use(authMiddleware);

osRoutes.get("/", osController.index);
osRoutes.post("/", osController.create);
osRoutes.get("/:id", osController.show);
osRoutes.delete("/:id", roleMiddleware(["ADMIN"]), osController.delete);

osRoutes.put("/:id", roleMiddleware(["ADMIN"]), osController.update);
osRoutes.patch(
  "/:id/conclude",
  roleMiddleware(["ADMIN"]),
  osController.conclude
);

export { osRoutes };
