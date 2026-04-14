import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { User } from "../models/User";
import { handleApiError } from "../utils/errorHandler";
const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { phone, password } = req.body;

      if (!phone || !password) {
        return res
          .status(400)
          .json({ error: "Telefone e senha são obrigatórios." });
      }

      const result = await authService.login(phone, password);
      return res.json(result);
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: "E-mail já cadastrado." });
      }

      const user = await User.create({ name, email, password, role });

      return res.status(201).json({
        message: "Usuário criado com sucesso!",
        id: user._id,
      });
    } catch (error: any) {
      return res.status(400).json({ error: "Erro ao criar usuário." });
    }
  }
}
