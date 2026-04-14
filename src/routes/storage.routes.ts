import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import multer from "multer";
import { storage } from "../config/cloudinary";
import { StorageController } from "../controllers/StorageController";
import { authMiddleware } from "../middlewares/authMiddleware";

const storageRoutes = Router();
const storageController = new StorageController();
const upload = multer({ storage });

storageRoutes.post(
  "/upload",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        console.error("Erro no multer/Cloudinary:", err);
        return res
          .status(500)
          .json({ error: err.message || "Erro no upload do arquivo." });
      }
      next();
    });
  },
  storageController.upload
);

export { storageRoutes };
