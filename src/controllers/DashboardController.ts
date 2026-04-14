import { Request, Response } from "express";
import { DashboardService } from "../services/DashboardService";
import { handleApiError } from "../utils/errorHandler";

const dashboardService = new DashboardService();

export class DashboardController {
  async getStats(req: Request, res: Response) {
    try {
      const stats = await dashboardService.getStats();
      return res.json(stats);
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }
}
