import { Route } from "../models/Route";

export class RouteService {
  async createRoute(data: any) {
    const existing = await Route.findOne({ name: data.name });
    if (existing)
      throw new Error("Já existe uma rota cadastrada com este nome.");

    return await Route.create(data);
  }

  async listActiveRoutes() {
    return await Route.find({ active: true }).sort({ name: 1 });
  }

  async updateRoute(id: string, data: any) {
    const updated = await Route.findByIdAndUpdate(id, data, { new: true });
    if (!updated) throw new Error("Rota não encontrada.");
    return updated;
  }

  async toggleActive(id: string) {
    const route = await Route.findById(id);
    if (!route) throw new Error("Rota não encontrada.");

    route.active = !route.active;
    await route.save();
    return route;
  }
}
