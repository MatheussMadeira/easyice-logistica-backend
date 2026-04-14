import { Request, Response } from "express";
import { VehicleService } from "../services/VehicleService";
import { handleApiError } from "../utils/errorHandler";

const vehicleService = new VehicleService();

export class VehicleController {
  async create(req: Request, res: Response) {
    try {
      if (req.userRole !== "ADMIN") {
        return res.status(403).json({
          error: "Apenas administradores podem cadastrar veículos.",
        }) as any;
      }

      const vehicle = await vehicleService.createVehicle(req.body);
      return res.status(201).json(vehicle) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async index(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const vehicles = await vehicleService.listVehicles(status as string);
      return res.json(vehicles) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (req.userRole !== "ADMIN") {
        return res.status(403).json({
          error: "Apenas administradores podem editar veículos.",
        }) as any;
      }

      const id = req.params.id as string;
      const vehicle = await vehicleService.updateVehicle(id, req.body);
      return res.json(vehicle) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async disable(req: Request, res: Response) {
    try {
      if (req.userRole !== "ADMIN") {
        return res.status(403).json({
          error: "Apenas administradores podem desativar veículos.",
        }) as any;
      }

      const id = req.params.id as string;
      const result = await vehicleService.disableVehicle(id);
      return res.json(result) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }
}
