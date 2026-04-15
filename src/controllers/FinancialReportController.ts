import { Request, Response } from "express";
import { FinancialReportService } from "../services/FinancialReportService";
import { handleApiError } from "../utils/errorHandler";

const financialReportService = new FinancialReportService();

export class FinancialReportController {
  async index(req: Request, res: Response) {
    try {
      const { dateFrom, dateTo, status } = req.query;

      const report = await financialReportService.getReport({
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
        status: status as string,
      });

      return res.json(report) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }
}
