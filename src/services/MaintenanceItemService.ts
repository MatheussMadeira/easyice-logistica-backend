import { MaintenanceItem } from "../models/MaintenanceItem";

export class MaintenanceItemService {
  async create(data: any) {
    const existing = await MaintenanceItem.findOne({
      description: data.description,
    });
    if (existing) throw new Error("Este item já está cadastrado no catálogo.");
    return await MaintenanceItem.create(data);
  }

  async listAll() {
    return await MaintenanceItem.find()
      .populate("vehicleId", "plate vehicleModel")
      .sort({ description: 1 });
  }

  async listActive() {
    return await MaintenanceItem.find({ active: true })
      .populate("vehicleId", "plate vehicleModel")
      .sort({ description: 1 });
  }

  async update(id: string, data: any) {
    const updated = await MaintenanceItem.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updated) throw new Error("Item de manutenção não encontrado.");
    return updated;
  }

  async toggleActive(id: string) {
    const item = await MaintenanceItem.findById(id);
    if (!item) throw new Error("Item não encontrado.");

    return await MaintenanceItem.findByIdAndUpdate(
      id,
      { active: !item.active },
      { new: true }
    );
  }
}
