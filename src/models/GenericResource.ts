import { Schema, model } from "mongoose";

const BaseResourceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Driver = model("Driver", BaseResourceSchema);
export const Route = model("Route", BaseResourceSchema);
