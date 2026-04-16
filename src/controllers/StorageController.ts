import { Request, Response } from "express";
import { handleApiError } from "../utils/errorHandler";

export class StorageController {
  async upload(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ error: "Nenhum arquivo enviado." }) as any;
      }

      const file = req.file as any;

      return res.json({
        url: file.path,
        resourceType: file.mimetype.startsWith("video/") ? "video" : "image",
        format: file.mimetype.split("/")[1],
      }) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }
}
