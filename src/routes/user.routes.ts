import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const userRoutes = Router();
const userController = new UserController();

userRoutes.use(authMiddleware);
userRoutes.get("/executors", authMiddleware, userController.listExecutors);
userRoutes.post("/", roleMiddleware(["ADMIN"]), userController.create);
userRoutes.get("/", roleMiddleware(["ADMIN"]), userController.index);
userRoutes.put("/:id", roleMiddleware(["ADMIN"]), userController.update);
userRoutes.patch(
  "/:id/toggle",
  roleMiddleware(["ADMIN"]),
  userController.toggle
);

export { userRoutes };
