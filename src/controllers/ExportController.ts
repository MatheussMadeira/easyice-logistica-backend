import { Request, Response } from "express";
import { ExportService } from "../services/ExportService";
import { handleApiError } from "../utils/errorHandler";
import { format } from "date-fns";

const exportService = new ExportService();

export class ExportController {
  async getCounts(req: Request, res: Response) {
    try {
      const counts = await exportService.getPendingCounts();
      return res.json(counts) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async combustivel(req: Request, res: Response) {
    try {
      const buffer = await exportService.exportCombustivel();
      const filename = `cobli-combustivel-${format(
        new Date(),
        "yyyy-MM-dd"
      )}.xlsx`;
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      return res.send(buffer) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async despesas(req: Request, res: Response) {
    try {
      const buffer = await exportService.exportDespesas();
      const filename = `cobli-despesas-${format(
        new Date(),
        "yyyy-MM-dd"
      )}.xlsx`;
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      return res.send(buffer) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }
}
