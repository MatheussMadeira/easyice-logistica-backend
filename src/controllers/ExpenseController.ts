import { Request, Response } from "express";
import { ExpenseService } from "../services/ExpenseService";
import { handleApiError } from "../utils/errorHandler";

const expenseService = new ExpenseService();

export class ExpenseController {
  async openDiary(req: Request, res: Response) {
    try {
      const effectiveUserId =
        req.userRole === "ADMIN" && req.body.driverId
          ? req.body.driverId
          : (req.userId as string);

      const diary = await expenseService.openDiary(effectiveUserId, req.body);
      return res.status(201).json(diary) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async addExpense(req: Request, res: Response) {
    try {
      const userId = req.userRole === "ADMIN" ? null : (req.userId as string);

      const expense = await expenseService.addExpenseToDiary(
        userId,
        req.params.diaryId as string,
        req.body
      );
      return res.status(201).json(expense) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async closeDiary(req: Request, res: Response) {
    try {
      const userId = req.userRole === "ADMIN" ? null : (req.userId as string);

      const closed = await expenseService.closeDiary(
        userId,
        req.params.diaryId as string,
        req.body
      );
      return res.json(closed) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async removeExpense(req: Request, res: Response) {
    try {
      const userId = req.userRole === "ADMIN" ? null : (req.userId as string);

      const result = await expenseService.removeExpense(
        userId,
        req.params.diaryId as string,
        req.params.expenseId as string
      );
      return res.json(result) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async getDiaryDetails(req: Request, res: Response) {
    try {
      const details = await expenseService.getDiaryDetails(
        req.userId as string,
        req.params.diaryId as string,
        req.userRole as string
      );
      return res.json(details) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async updateExpense(req: Request, res: Response) {
    try {
      const updated = await expenseService.updateExpense(
        req.userId as string,
        req.params.diaryId as string,
        req.params.expenseId as string,
        req.body
      );
      return res.json(updated) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async cancelDiary(req: Request, res: Response) {
    try {
      const userId = req.userRole === "ADMIN" ? null : (req.userId as string);

      const canceled = await expenseService.cancelDiary(
        userId,
        req.params.diaryId as string
      );
      return res.json(canceled) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }
  async index(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const diaries = await expenseService.listDiaries(
        req.userId as string,
        req.userRole as string,
        status as string
      );
      return res.json(diaries) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }
  async listMaintenances(req: Request, res: Response) {
    try {
      const maintenances = await expenseService.listMaintenances();
      return res.json(maintenances);
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }
}
