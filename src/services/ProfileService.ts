import { User } from "../models/User";
import bcrypt from "bcryptjs";

export class ProfileService {
  async getProfile(userId: string) {
    const user = await User.findById(userId).select("-password");
    if (!user) throw new Error("Usuário não encontrado.");
    return user;
  }

  async updateProfile(userId: string, data: { name?: string; phone?: string }) {
    if (data.phone) {
      const existing = await User.findOne({
        phone: data.phone,
        _id: { $ne: userId },
      });
      if (existing) throw new Error("Este telefone já está em uso.");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
    }).select("-password");
    if (!user) throw new Error("Usuário não encontrado.");
    return user;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await User.findById(userId).select("+password");
    if (!user) throw new Error("Usuário não encontrado.");

    const isValid = await bcrypt.compare(currentPassword, user.password || "");
    if (!isValid) throw new Error("Senha atual incorreta.");

    if (newPassword.length < 6)
      throw new Error("A nova senha deve ter pelo menos 6 caracteres.");

    user.password = newPassword;
    await user.save();

    return { message: "Senha alterada com sucesso." };
  }
  async updateNotifications(userId: string, prefs: object) {
    const user = await User.findByIdAndUpdate(
      userId,
      { notificationPreferences: prefs },
      { new: true }
    ).select("-password");
    if (!user) throw new Error("Usuário não encontrado.");
  }
}
