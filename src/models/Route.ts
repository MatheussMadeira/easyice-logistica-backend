import { Schema, model } from "mongoose";

const RouteSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    origin: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    estimatedKm: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Route = model("Route", RouteSchema);