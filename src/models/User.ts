import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "ADMIN" | "DRIVER";
  active: boolean;
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["ADMIN", "DRIVER"], default: "DRIVER" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

UserSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return;

  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

export const User = model<IUser>("User", UserSchema);
