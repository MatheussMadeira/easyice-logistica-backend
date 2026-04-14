import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const userRoutes = Router();
const userController = new UserController();

userRoutes.use(authMiddleware);
userRoutes.use(roleMiddleware(["ADMIN"]));

userRoutes.post("/", userController.create);
userRoutes.get("/", userController.index);
userRoutes.put("/:id", userController.update);
userRoutes.patch("/:id/toggle", userController.toggle);

export { userRoutes };
