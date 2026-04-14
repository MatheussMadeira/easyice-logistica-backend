import { Request, Response } from "express";
import { MaintenanceItemService } from "../services/MaintenanceItemService";
import { handleApiError } from "../utils/errorHandler";

const service = new MaintenanceItemService();

export class MaintenanceItemController {
  async create(req: Request, res: Response) {
    try {
      const item = await service.create(req.body);
      return res.status(201).json(item) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async index(req: Request, res: Response) {
    try {
      const items =
        req.userRole === "ADMIN"
          ? await service.listAll()
          : await service.listActive();

      return res.json(items) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const item = await service.update(id, req.body);
      return res.json(item) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async toggle(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const item = await service.toggleActive(id);
      return res.json(item) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }
}
