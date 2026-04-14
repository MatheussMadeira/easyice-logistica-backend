import { Router } from "express";
import { ProfileController } from "../controllers/ProfileController";
import { authMiddleware } from "../middlewares/authMiddleware";

const profileRoutes = Router();
const profileController = new ProfileController();

profileRoutes.use(authMiddleware);

profileRoutes.get("/", profileController.get);
profileRoutes.put("/", profileController.update);
profileRoutes.patch("/password", profileController.changePassword);
profileRoutes.patch("/notifications", profileController.updateNotifications);

export { profileRoutes };
