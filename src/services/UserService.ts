import { User } from "../models/User";
import bcrypt from "bcrypt";

export class UserService {
  async createUser(data: any) {
    const { phone } = data;

    const userExists = await User.findOne({ phone });
    if (userExists) throw new Error("Este telefone já está em uso.");

    return await User.create(data);
  }

  async listAll(role?: string) {
    const query: any = {};
    if (role) query.role = role;

    return await User.find(query).select("-password").sort({ name: 1 });
  }

  async updateUser(id: string, data: any) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, data, { new: true }).select(
      "-password"
    );
    if (!user) throw new Error("Usuário não encontrado.");

    return user;
  }

  async toggleActive(id: string) {
    const user = await User.findById(id);
    if (!user) throw new Error("Usuário não encontrado.");

    user.active = !user.active;
    await user.save();
    return user;
  }
}
