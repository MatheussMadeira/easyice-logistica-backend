import { Router } from "express";
import { OperationalExpenseController } from "../controllers/OperationalExpenseController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const operationalExpenseRoutes = Router();
const operationalExpenseController = new OperationalExpenseController();

operationalExpenseRoutes.use(authMiddleware);

operationalExpenseRoutes.get("/", operationalExpenseController.index);

operationalExpenseRoutes.post(
  "/",
  roleMiddleware(["ADMIN"]),
  operationalExpenseController.create
);
operationalExpenseRoutes.put(
  "/:id",
  roleMiddleware(["ADMIN"]),
  operationalExpenseController.update
);
operationalExpenseRoutes.patch(
  "/:id/disable",
  roleMiddleware(["ADMIN"]),
  operationalExpenseController.disable
);

export { operationalExpenseRoutes };
