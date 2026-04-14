import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  phone: string;
  email?: string;
  password?: string;
  role: "ADMIN" | "DRIVER";
  active: boolean;
  dailyAllowanceValue: number;
  cnhType?: string;
  cnhExpiry?: Date;
  notificationPreferences: {
    maintenanceAlert: boolean;
    newLogAlert: boolean;
    weeklyReport: boolean;
  };
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true }, 
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["ADMIN", "DRIVER"], default: "DRIVER" },
    active: { type: Boolean, default: true },
    dailyAllowanceValue: { type: Number, default: 0 },
    cnhType: { type: String },
    cnhExpiry: { type: Date },
    notificationPreferences: {
      maintenanceAlert: { type: Boolean, default: true },
      newLogAlert: { type: Boolean, default: true },
      weeklyReport: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

UserSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return;

  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

export const User = model<IUser>("User", UserSchema);
