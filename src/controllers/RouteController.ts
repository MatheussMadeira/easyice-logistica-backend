import { Request, Response } from "express";
import { RouteService } from "../services/RouteService";
import { handleApiError } from "../utils/errorHandler";

const routeService = new RouteService();

export class RouteController {
  async create(req: Request, res: Response) {
    try {
      if (req.userRole !== "ADMIN") {
        return res
          .status(403)
          .json({ error: "Apenas admins podem criar rotas." }) as any;
      }
      const route = await routeService.createRoute(req.body);
      return res.status(201).json(route) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async index(req: Request, res: Response) {
    try {
      const routes = await routeService.listActiveRoutes();
      return res.json(routes) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async update(req: Request, res: Response) {
    try {
      if (req.userRole !== "ADMIN") {
        return res
          .status(403)
          .json({ error: "Apenas admins podem editar rotas." }) as any;
      }
      const id = req.params.id as string;
      const route = await routeService.updateRoute(id, req.body);
      return res.json(route) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async toggle(req: Request, res: Response) {
    try {
      if (req.userRole !== "ADMIN") {
        return res
          .status(403)
          .json({
            error: "Apenas admins podem ativar/desativar rotas.",
          }) as any;
      }
      const id = req.params.id as string;
      const route = await routeService.toggleActive(id);
      return res.json(route) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }
}
