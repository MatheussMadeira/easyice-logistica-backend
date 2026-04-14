import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { handleApiError } from "../utils/errorHandler";

const userService = new UserService();

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body);
      return res.status(201).json(user) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async index(req: Request, res: Response) {
    try {
      const { role } = req.query;
      const users = await userService.listAll(role as string | undefined);
      return res.json(users);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const user = await userService.updateUser(id, req.body);
      return res.json(user) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async toggle(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const user = await userService.toggleActive(id);
      return res.json(user) as any;
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }
}
