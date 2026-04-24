import { Request, Response } from "express";
import { OrdemServicoService } from "../services/OrdemServicoService";
import { handleApiError } from "../utils/errorHandler";

const osService = new OrdemServicoService();

export class OrdemServicoController {
  async create(req: Request, res: Response) {
    try {
      const os = await osService.create({
        ...req.body,
        userId: req.userId as string,
        periodicidadeHorimetro: req.body.periodicidadeHorimetro || 0,
      });
      return res.status(201).json(os) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async index(req: Request, res: Response) {
    try {
      const os = await osService.list({
        situacao: req.query.situacao as string,
        tipo: req.query.tipo as string,
        veiculoId: req.query.veiculoId as string,
        userId: req.userId as string,
        userRole: req.userRole as string,
      });
      return res.json(os) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async show(req: Request, res: Response) {
    try {
      const os = await osService.findById(req.params.id as string);
      return res.json(os) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const os = await osService.update(req.params.id as string, req.body);
      return res.json(os) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async conclude(req: Request, res: Response) {
    try {
      if (req.userRole !== "ADMIN")
        return res.status(403).json({
          error: "Apenas administradores podem concluir OS.",
        }) as any;

      const os = await osService.conclude(req.params.id as string, req.body);
      return res.json(os) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }
  async delete(req: Request, res: Response) {
    try {
      const result = await osService.delete(req.params.id as string);
      return res.json(result) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }
}
