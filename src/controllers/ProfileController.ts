import { Request, Response } from "express";
import { ProfileService } from "../services/ProfileService";
import { handleApiError } from "../utils/errorHandler";

const profileService = new ProfileService();

export class ProfileController {
  async get(req: Request, res: Response) {
    try {
      const user = await profileService.getProfile(req.userId as string);
      return res.json(user);
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user = await profileService.updateProfile(
        req.userId as string,
        req.body
      );
      return res.json(user);
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      await profileService.changePassword(
        req.userId as string,
        currentPassword,
        newPassword
      );
      return res.json({ message: "Senha alterada com sucesso." });
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }
  async updateNotifications(req: Request, res: Response) {
    try {
      const user = await profileService.updateNotifications(
        req.userId as string,
        req.body.notificationPreferences
      );
      return res.json(user);
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }
}
