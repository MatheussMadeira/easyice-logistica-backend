import { Router } from "express";
import { RouteController } from "../controllers/RouteController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const routesPath = Router();
const routeController = new RouteController();

routesPath.use(authMiddleware);

routesPath.get("/", routeController.index);

routesPath.post("/", roleMiddleware(["ADMIN"]), routeController.create);
routesPath.put("/:id", roleMiddleware(["ADMIN"]), routeController.update);
routesPath.patch(
  "/:id/toggle",
  roleMiddleware(["ADMIN"]),
  routeController.toggle
);

export { routesPath };
