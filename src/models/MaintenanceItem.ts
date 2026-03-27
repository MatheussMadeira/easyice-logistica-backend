import { Schema, model } from "mongoose";

const MaintenanceItemSchema = new Schema(
  {
    name: { type: String, required: true },

    defaultPeriodicityKm: { type: Number },

    defaultPeriodicityMonths: { type: Number },

    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const MaintenanceItem = model("MaintenanceItem", MaintenanceItemSchema);
