import { User, IUser } from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export class AuthService {
  private readonly JWT_SECRET =
    process.env.JWT_SECRET || "easyice_secret_key_2026";

  async login(email: string, password: string) {
    const user = (await User.findOne({ email }).select(
      "+password",
    )) as IUser | null;

    if (!user) {
      throw new Error("E-mail ou senha incorretos.");
    }
    if (!user.active) {
      throw new Error("Usuário inativo.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || "");

    if (!isPasswordValid) {
      throw new Error("E-mail ou senha incorretos.");
    }
    const token = jwt.sign({ id: user._id, role: user.role }, this.JWT_SECRET, {
      expiresIn: "1d",
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }
}
