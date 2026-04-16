import { Vehicle } from "../models/Vehicle";
import type { IVehicle } from "../models/Vehicle";
import { notificationBroadcast } from "./NotificationBroadcastService";
import { DashboardService } from "./DashboardService";

export class VehicleService {
  private dashboardService = new DashboardService();
  private broadcastStats = async () => {
    if (notificationBroadcast.count === 0) return;
    try {
      const stats = this.dashboardService.getStats();
      notificationBroadcast.broadcast(stats);
    } catch {}
  };
  private shouldTriggerMaintenance(vehicle: IVehicle): boolean {
    if (!vehicle.maintenanceIntervalKm || !vehicle.nextMaintenanceKm)
      return false;

    const margin = vehicle.maintenanceIntervalKm * 0.1;
    const triggerKm = vehicle.nextMaintenanceKm - margin;

    return vehicle.currentKm >= triggerKm;
  }

  async createVehicle(vehicleData: any) {
    const existingVehicle = await Vehicle.findOne({ plate: vehicleData.plate });
    if (existingVehicle) {
      throw new Error("Já existe um veículo cadastrado com esta placa.");
    }
    return await Vehicle.create(vehicleData);
  }

  async listVehicles(status?: string) {
    const query: any = { active: true };
    if (status) query.status = status;
    return await Vehicle.find(query).sort({ vehicleModel: 1 });
  }

  async updateVehicle(vehicleId: string, updateData: any) {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) throw new Error("Veículo não encontrado.");

    if (
      updateData.concludeMaintenance === true ||
      updateData.concludeMaintenance === "true"
    ) {
      vehicle.status = "DISPONIVEL";
      vehicle.nextMaintenanceKm =
        vehicle.currentKm + (vehicle.maintenanceIntervalKm || 0);
      delete updateData.concludeMaintenance;
    }

    const { concludeMaintenance: _, ...rest } = updateData;
    Object.assign(vehicle, rest);

    if (updateData.currentKm !== undefined && vehicle.status === "DISPONIVEL") {
      if (this.shouldTriggerMaintenance(vehicle)) {
        vehicle.status = "MANUTENCAO";
      }
    }
    await vehicle.save();
    if (vehicle.status === "MANUTENCAO") {
      this.broadcastStats();
    }
    return vehicle;
  }

  async updateKmAndCheckMaintenance(vehicleId: string, newKm: number) {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return;

    vehicle.currentKm = newKm;

    const wasDisponivel = vehicle.status === "DISPONIVEL";

    if (wasDisponivel && this.shouldTriggerMaintenance(vehicle)) {
      vehicle.status = "MANUTENCAO";
    }

    vehicle.maintenanceOverride = false;
    await vehicle.save();

    if (vehicle.status === "MANUTENCAO" && wasDisponivel) {
      this.broadcastStats();
    }

    return vehicle;
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
