import { Schema, model, Document } from "mongoose";

export interface IVehicle extends Document {
  plate: string;
  vehicleModel: string;
  currentKm: number;
  nextMaintenanceKm: number;
  maintenanceIntervalKm: number;
  status: "DISPONIVEL" | "EM_ROTA" | "MANUTENCAO";
  active: boolean;
  maintenanceOverride: boolean;
  hasHorimetro: boolean;
  currentHorimetro: number;
  nextMaintenanceHorimetro: number;
}

const VehicleSchema = new Schema(
  {
    plate: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    vehicleModel: { type: String, required: true },
    currentKm: { type: Number, required: true, default: 0 },
    nextMaintenanceKm: { type: Number, default: 0 },
    maintenanceIntervalKm: { type: Number, default: 0 },
    maintenanceOverride: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["DISPONIVEL", "EM_ROTA", "MANUTENCAO"],
      default: "DISPONIVEL",
    },
    active: { type: Boolean, default: true },
    hasHorimetro: { type: Boolean, default: false },
    currentHorimetro: { type: Number, default: 0 },
    nextMaintenanceHorimetro: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Vehicle = model<IVehicle>("Vehicle", VehicleSchema);
