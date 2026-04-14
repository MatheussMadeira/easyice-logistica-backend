import { Vehicle } from "../models/Vehicle";

export class VehicleService {
  async createVehicle(vehicleData: any) {
    const existingVehicle = await Vehicle.findOne({ plate: vehicleData.plate });
    if (existingVehicle) {
      throw new Error("Já existe um veículo cadastrado com esta placa.");
    }

    return await Vehicle.create(vehicleData);
  }

  async listVehicles(status?: string) {
    const query: any = { active: true };
    if (status) {
      query.status = status;
    }

    return await Vehicle.find(query).sort({ name: 1 });
  }

  async updateVehicle(vehicleId: string, updateData: any) {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      vehicleId,
      { ...updateData },
      { new: true }
    );

    if (!updatedVehicle) {
      throw new Error("Veículo não encontrado.");
    }

    return updatedVehicle;
  }

  async disableVehicle(vehicleId: string) {
    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) throw new Error("Veículo não encontrado.");
    if (vehicle.status === "EM_ROTA")
      throw new Error("Não é possível desativar um veículo que está em rota.");

    vehicle.active = false;
    await vehicle.save();

    return { message: "Veículo desativado com sucesso da frota." };
  }
}
