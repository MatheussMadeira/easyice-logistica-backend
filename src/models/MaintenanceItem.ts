import { Schema, model, Document } from "mongoose";
import mongoose from "mongoose";

export interface IMaintenanceItem extends Document {
  description: string;
  vehicleId: mongoose.Types.ObjectId;
  periodicityKm?: number;
  periodicityDays?: number;
  periodicityHorimetro?: number;
  active: boolean;
}

const MaintenanceItemSchema = new Schema(
  {
    description: { type: String, required: true, trim: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    periodicityKm: { type: Number, default: 0 },
    periodicityDays: { type: Number, default: 0 },
    periodicityHorimetro: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const MaintenanceItem = model<IMaintenanceItem>(
  "MaintenanceItem",
  MaintenanceItemSchema
);
