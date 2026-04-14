import { Request, Response } from "express";
import { handleApiError } from "../utils/errorHandler";

export class StorageController {
  async upload(req: Request, res: Response) {
    try {
      if (!req.file) {
        throw new Error("Nenhum arquivo foi enviado.");
      }
      const fileUrl = req.file.path;
      return res.json({ url: fileUrl, public_id: req.file.filename }) as any;
    } catch (error: any) {
      console.error("Erro no upload:", JSON.stringify(error, null, 2));
      return handleApiError(error, res);
    }
  }
}
