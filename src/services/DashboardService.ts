import { Expense, ExpenseType } from "../models/Expense";
import { Vehicle } from "../models/Vehicle";
import { User } from "../models/User";
import { DiaryExpense } from "../models/Expense";

export class DashboardService {
  async getStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // ── Queries em paralelo ──────────────────────────
    const [vehicles, drivers, openDiaries, monthlyDiaries, recentExpenses] =
      await Promise.all([
        Vehicle.find({ active: true }),
        User.find({ role: "DRIVER", active: true }),
        Expense.find({ type: ExpenseType.DIARIO, status: "ABERTO" }),

        DiaryExpense.find({
          status: "FECHADO",
          createdAt: { $gte: startOfMonth },
        }),

        Expense.find({
          type: { $ne: ExpenseType.DIARIO },
          parentDiaryId: { $ne: null },
          createdAt: { $gte: startOfMonth },
        }),
      ]);

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const cnhAlerts = drivers
      .filter((d) => d.cnhExpiry && new Date(d.cnhExpiry) <= thirtyDaysFromNow)
      .map((d) => ({
        name: d.name,
        cnhExpiry: d.cnhExpiry,
        daysLeft: Math.ceil(
          (new Date(d.cnhExpiry!).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        ),
      }));
    // ── KPIs ─────────────────────────────────────────

    const kpis = {
      driversOnTrip: openDiaries.length,
      totalDrivers: drivers.length,
      availableVehicles: vehicles.filter((v) => v.status === "DISPONIVEL")
        .length,
      vehiclesInMaintenance: vehicles.filter((v) => v.status === "MANUTENCAO")
        .length,
      monthlyOperationalCost: monthlyDiaries.reduce(
        (acc, d) => acc + (d.totalToPay || 0),
        0
      ),
    };

    // ── Alertas de manutenção ────────────────────────
    const maintenanceAlerts = vehicles
      .filter((v) => v.status === "MANUTENCAO")
      .map((v) => ({
        plate: v.plate,
        currentKm: v.currentKm,
        nextMaintenanceKm: v.nextMaintenanceKm,
      }));

    const recentDiaries = await Expense.find({
      type: ExpenseType.DIARIO,
      status: "FECHADO",
      createdAt: { $gte: last7Days },
    });

    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const costEvolution = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(last7Days.getTime() + i * 24 * 60 * 60 * 1000);
      const total = recentDiaries
        .filter(
          (d) => new Date(d.createdAt).toDateString() === day.toDateString()
        )
        .reduce((acc, d) => acc + (d.amount || 0), 0);
      return { dia: days[day.getDay()], custo: total };
    });

    const sum = (type: string, category?: string) =>
      recentExpenses
        .filter(
          (e) =>
            e.type === type && (!category || (e as any).category === category)
        )
        .reduce((acc, e) => acc + e.amount, 0);

    const expensesByCategory = [
      { categoria: "Combustível", valor: sum(ExpenseType.COMBUSTIVEL) },
      { categoria: "Manutenção", valor: sum(ExpenseType.MANUTENCAO) },
      {
        categoria: "Alimentação",
        valor: sum("DESPESA_GENERICA", "ALIMENTACAO"),
      },
      { categoria: "Hospedagem", valor: sum("DESPESA_GENERICA", "HOSPEDAGEM") },
      { categoria: "Outros", valor: sum("DESPESA_GENERICA", "OUTROS") },
    ].filter((e) => e.valor > 0);

    return {
      kpis,
      maintenanceAlerts,
      cnhAlerts,
      costEvolution,
      expensesByCategory,
    };
  }
}
