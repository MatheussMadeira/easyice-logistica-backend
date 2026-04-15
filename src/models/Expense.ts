import { Schema, model } from "mongoose";

export enum ExpenseType {
  DIARIO = "DIARIO",
  MANUTENCAO = "MANUTENCAO",
  COMBUSTIVEL = "COMBUSTIVEL",
  DESPESA_GENERICA = "DESPESA_GENERICA",
}

const BaseExpenseSchema = new Schema(
  {
    date: { type: Date, required: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    description: { type: String, trim: true },
    amount: { type: Number, required: true, default: 0 },
    type: {
      type: String,
      enum: Object.values(ExpenseType),
      required: true,
    },
    parentDiaryId: {
      type: Schema.Types.ObjectId,
      ref: "Expense",
      default: null,
    },
    status: {
      type: String,
      enum: ["ABERTO", "FECHADO"],
      default: "ABERTO",
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    exportedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    discriminatorKey: "type",
  }
);

export const Expense = model("Expense", BaseExpenseSchema);

export const DiaryExpense = Expense.discriminator(
  ExpenseType.DIARIO,
  new Schema({
    routeId: { type: Schema.Types.ObjectId, ref: "Route", required: true },
    kmStart: { type: Number, required: true },
    kmEnd: { type: Number },
    dailyAllowance: { type: Number, default: 0 },
    totalToPay: { type: Number, default: 0 },
  })
);

Expense.discriminator(
  ExpenseType.COMBUSTIVEL,
  new Schema({
    km: { type: Number, required: true },
    fuelType: {
      type: String,
      enum: ["DIESEL", "ARLA", "FLEX", "GASOLINA"],
      required: true,
    },
    liters: { type: Number, required: true },
    value: { type: Number, required: true, default: 0 },
    gasStationName: { type: String },
    gasStationAdress: { type: String },
    receiptImageUrl: { type: String },
  })
);

Expense.discriminator(
  ExpenseType.MANUTENCAO,
  new Schema({
    km: { type: Number, required: true },
    maintenanceType: {
      type: String,
      enum: ["PREVENTIVA", "CORRETIVA"],
      required: true,
    },
    maintenanceItemId: { type: Schema.Types.ObjectId, ref: "MaintenanceItem" },
    itemName: { type: String, trim: true },
    quantity: { type: Number, default: 1 },
    unitCost: { type: Number, required: true },
    nextRevisionKm: { type: Number },
    nextRevisionDate: { type: Date },
  })
);

Expense.discriminator(
  ExpenseType.DESPESA_GENERICA,
  new Schema({
    category: {
      type: String,
      enum: ["ALIMENTACAO", "HOSPEDAGEM", "OUTROS"],
      required: true,
    },
    receiptImageUrl: { type: String },
  })
);
