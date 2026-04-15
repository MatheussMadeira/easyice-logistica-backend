import { Request, Response } from "express";
import { OperationalExpenseService } from "../services/OperationalExpenseService";
import { handleApiError } from "../utils/errorHandler";

const operationalExpenseService = new OperationalExpenseService();

export class OperationalExpenseController {
  async create(req: Request, res: Response) {
    try {
      if (req.userRole !== "ADMIN") {
        return res.status(403).json({
          error:
            "Apenas administradores podem cadastrar despesas operacionais.",
        }) as any;
      }

      const { name, vehicleId } = req.body;
      const expense = await operationalExpenseService.createOperationalExpense({
        name,
        vehicleId,
      });
      return res.status(201).json(expense) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async index(req: Request, res: Response) {
    try {
      const { vehicleId } = req.query;

      const expenses = vehicleId
        ? await operationalExpenseService.listByVehicle(vehicleId as string)
        : await operationalExpenseService.listAll();

      return res.json(expenses) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (req.userRole !== "ADMIN") {
        return res.status(403).json({
          error: "Apenas administradores podem editar despesas operacionais.",
        }) as any;
      }

      const id = req.params.id as string;
      const expense = await operationalExpenseService.updateOperationalExpense(
        id,
        req.body
      );
      return res.json(expense) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async disable(req: Request, res: Response) {
    try {
      if (req.userRole !== "ADMIN") {
        return res.status(403).json({
          error:
            "Apenas administradores podem desativar despesas operacionais.",
        }) as any;
      }

      const id = req.params.id as string;
      const result = await operationalExpenseService.disableOperationalExpense(
        id
      );
      return res.json(result) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }
}
