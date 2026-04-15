import { Expense } from "../models/Expense";

export interface FinancialReportRow {
  _id: string;
  date: string;
  driverName: string;
  vehiclePlate: string;
  vehicleModel: string;
  routeName: string;
  kmStart: number;
  kmEnd: number;
  totalKm: number;
  despesaMotorista: number;
  despesaOperacional: number;
  combustivelTotal: number;
  gasStationTypes: string[];
  manutencaoTotal: number;
  manutencaoItems: string[];
  genericaTotal: number;
  genericaCategories: string[];
  total: number;
  status: "ABERTO" | "FECHADO" | "CANCELADO";
}

export class FinancialReportService {
  async getReport(filters: any): Promise<FinancialReportRow[]> {
    const query: any = { type: "DIARIO" };
    if (filters.status) query.status = filters.status;
    if (filters.dateFrom || filters.dateTo) {
      query.date = {};
      if (filters.dateFrom) query.date.$gte = new Date(filters.dateFrom);
      if (filters.dateTo) query.date.$lte = new Date(filters.dateTo);
    }

    const diaries = await Expense.find(query)
      .populate("userId", "name")
      .populate("vehicleId", "plate vehicleModel")
      .populate("routeId", "name")
      .sort({ date: -1 })
      .lean();

    const allDiaryIds = diaries.map((d) => d._id);
    const allSubExpenses = (await Expense.find({
      parentDiaryId: { $in: allDiaryIds },
    }).lean()) as any[];

    const expensesByDiary = allSubExpenses.reduce((acc, exp) => {
      const id = String(exp.parentDiaryId);
      if (!acc[id]) acc[id] = [];
      acc[id].push(exp);
      return acc;
    }, {} as Record<string, any[]>);

    return diaries.map((diary: any) => {
      const subs = expensesByDiary[String(diary._id)] ?? [];

      const combustivel = subs.filter((e: any) => e.type === "COMBUSTIVEL");
      const manutencao = subs.filter((e: any) => e.type === "MANUTENCAO");
      const generica = subs.filter((e: any) => e.type === "DESPESA_GENERICA");

      const combustivelTotal = combustivel.reduce(
        (a: number, e: any) => a + (e.liters * e.value || e.amount || 0),
        0
      );
      const gasStationTypes = [
        ...new Set(
          combustivel.map((e: any) => e.gasStationName).filter(Boolean)
        ),
      ] as string[];

      const manutencaoTotal = manutencao.reduce(
        (a: number, e: any) => a + (e.unitCost ?? 0) * (e.quantity ?? 1),
        0
      );
      const manutencaoItems = manutencao
        .map((e: any) => e.itemName)
        .filter(Boolean) as string[];

      const genericaTotal = generica.reduce(
        (a: number, e: any) => a + (e.amount || 0),
        0
      );
      const genericaCategories = [
        ...new Set(generica.map((e: any) => e.category).filter(Boolean)),
      ] as string[];

      const despesaOperacional = manutencao
        .filter((e: any) => e.maintenanceType === "PREVENTIVA")
        .reduce(
          (a: number, e: any) => a + (e.unitCost ?? 0) * (e.quantity ?? 1),
          0
        );

      const despesaMotorista =
        (diary.totalToPay ?? 0) + (diary.dailyAllowance ?? 0);

      return {
        _id: String(diary._id),
        date: diary.date,
        driverName: diary.userId?.name ?? "—",
        vehiclePlate: diary.vehicleId?.plate ?? "—",
        vehicleModel: diary.vehicleId?.vehicleModel ?? "—",
        routeName: diary.routeId?.name ?? "—",
        kmStart: diary.kmStart ?? 0,
        kmEnd: diary.kmEnd ?? 0,
        totalKm: diary.kmEnd ? diary.kmEnd - (diary.kmStart ?? 0) : 0,
        despesaMotorista,
        despesaOperacional,
        combustivelTotal,
        gasStationTypes,
        manutencaoTotal,
        manutencaoItems,
        genericaTotal,
        genericaCategories,
        total: despesaMotorista + despesaOperacional,
        status: diary.status,
      };
    });
  }
}
