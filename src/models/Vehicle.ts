import { Schema, model } from "mongoose";

const VehicleSchema = new Schema(
  {
    plate: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    model: { type: String, required: true },
    name: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Vehicle = model("Vehicle", VehicleSchema);
