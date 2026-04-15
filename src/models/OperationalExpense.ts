import { Schema, model, Document, Types } from "mongoose";

export interface IOperationalExpense extends Document {
  name: string;
  vehicle: Types.ObjectId;
  category: string;
  amount: number;
  date: Date;
  exportedAt: Date | null;
  active: boolean;
}

const OperationalExpenseSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true, default: 0 },
    date: { type: Date, required: true },
    exportedAt: { type: Date, default: null },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const OperationalExpense = model<IOperationalExpense>(
  "OperationalExpense",
  OperationalExpenseSchema
);
