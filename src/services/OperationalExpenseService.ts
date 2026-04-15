import { OperationalExpense } from "../models/OperationalExpense";
import { Vehicle } from "../models/Vehicle";

export class OperationalExpenseService {
  async createOperationalExpense(data: {
    name: string;
    vehicleId: string;
    category: string;
    amount: number;
    date: string;
  }) {
    const vehicle = await Vehicle.findById(data.vehicleId);
    if (!vehicle) throw new Error("Veículo não encontrado.");

    return await OperationalExpense.create({
      name: data.name,
      vehicle: data.vehicleId,
      category: data.category,
      amount: data.amount,
      date: new Date(data.date),
    });
  }

  async listByVehicle(vehicleId: string) {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) throw new Error("Veículo não encontrado.");

    return await OperationalExpense.find({ vehicle: vehicleId, active: true })
      .populate("vehicle", "plate vehicleModel")
      .sort({ date: -1 });
  }

  async listAll() {
    return await OperationalExpense.find({ active: true })
      .populate("vehicle", "plate vehicleModel")
      .sort({ date: -1 });
  }

  async updateOperationalExpense(
    id: string,
    data: {
      name?: string;
      vehicleId?: string;
      category?: string;
      amount?: number;
      date?: string;
    }
  ) {
    if (data.vehicleId) {
      const vehicle = await Vehicle.findById(data.vehicleId);
      if (!vehicle) throw new Error("Veículo não encontrado.");
    }

    const updated = await OperationalExpense.findByIdAndUpdate(
      id,
      {
        ...(data.name && { name: data.name }),
        ...(data.vehicleId && { vehicle: data.vehicleId }),
        ...(data.category && { category: data.category }),
        ...(data.amount && { amount: data.amount }),
        ...(data.date && { date: new Date(data.date) }),
      },
      { new: true }
    ).populate("vehicle", "plate vehicleModel");

    if (!updated) throw new Error("Despesa operacional não encontrada.");
    return updated;
  }

  async disableOperationalExpense(id: string) {
    const expense = await OperationalExpense.findById(id);
    if (!expense) throw new Error("Despesa operacional não encontrada.");
    expense.active = false;
    await expense.save();
    return { message: "Despesa operacional desativada com sucesso." };
  }
}
