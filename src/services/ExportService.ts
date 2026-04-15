import * as XLSX from "xlsx";
import { Expense, ExpenseType } from "../models/Expense";
import { OperationalExpense } from "../models/OperationalExpense";

const FUEL_TYPE_MAP: Record<string, string> = {
  DIESEL: "Diesel",
  GASOLINA: "Gasolina",
  FLEX: "Outros",
  GNV: "GNV",
};

const GAS_STATION_MAP: Record<string, string> = {
  CONVENIADO: "Conveniado",
  ESTRADA: "Estrada",
};

export class ExportService {
  async exportCombustivel(): Promise<Buffer> {
    const expenses = (await Expense.find({
      type: ExpenseType.COMBUSTIVEL,
      exportedAt: null,
      fuelType: { $ne: "ARLA" },
    })
      .populate("vehicleId", "plate")
      .lean()) as any[];

    const rows = expenses.map((e) => ({
      Placa: e.vehicleId?.plate ?? "",
      "Data e hora": new Date(e.date).toLocaleString("pt-BR"),
      Odômetro: e.km ?? "",
      "Tipo de Combustível": FUEL_TYPE_MAP[e.fuelType] ?? "Outros",
      "Quantidade abastecida": e.liters ?? "",
      "Custo total": e.amount ?? 0,
      "Nome do posto": GAS_STATION_MAP[e.gasStationName] ?? "",
      CNPJ: "",
      Cidade: "",
      Estado: "",
    }));

    const ids = expenses.map((e) => e._id);
    await Expense.updateMany({ _id: { $in: ids } }, { exportedAt: new Date() });

    const wb = XLSX.utils.book_new();

    const wsData = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, wsData, "Combustível");

    const wsTipos = XLSX.utils.aoa_to_sheet([
      ["Combustível"],
      ["Diesel"],
      ["Etanol"],
      ["Gasolina"],
      ["GNV"],
      ["Outros"],
    ]);
    XLSX.utils.book_append_sheet(wb, wsTipos, "Tipos de combustível");

    return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  }

  async exportDespesas(): Promise<Buffer> {
    const rows: any[] = [];
    const expenseIds: any[] = [];
    const operationalIds: any[] = [];

    const manutencao = (await Expense.find({
      type: ExpenseType.MANUTENCAO,
      exportedAt: null,
    })
      .populate("vehicleId", "plate")
      .lean()) as any[];

    manutencao.forEach((e) => {
      rows.push({
        Data: new Date(e.date).toLocaleDateString("pt-BR"),
        Placa: e.vehicleId?.plate ?? "",
        Categoria: "Serviços",
        "Tipo de despesa": e.itemName ?? "Manutenção",
        "Custo total": (e.unitCost ?? 0) * (e.quantity ?? 1),
        Fornecedor: "",
        Observações: e.description ?? "",
      });
      expenseIds.push(e._id);
    });

    const CATEGORY_MAP: Record<string, string> = {
      ALIMENTACAO: "Despesas administrativas",
      HOSPEDAGEM: "Despesas administrativas",
      OUTROS: "Outros",
    };

    const generica = (await Expense.find({
      type: ExpenseType.DESPESA_GENERICA,
      exportedAt: null,
    })
      .populate("vehicleId", "plate")
      .lean()) as any[];

    generica.forEach((e) => {
      rows.push({
        Data: new Date(e.date).toLocaleDateString("pt-BR"),
        Placa: e.vehicleId?.plate ?? "",
        Categoria: CATEGORY_MAP[e.category] ?? "Outros",
        "Tipo de despesa": e.description ?? e.category ?? "",
        "Custo total": e.amount ?? 0,
        Fornecedor: "",
        Observações: e.description ?? "",
      });
      expenseIds.push(e._id);
    });

    const arla = (await Expense.find({
      type: ExpenseType.COMBUSTIVEL,
      fuelType: "ARLA",
      exportedAt: null,
    })
      .populate("vehicleId", "plate")
      .lean()) as any[];

    arla.forEach((e) => {
      rows.push({
        Data: new Date(e.date).toLocaleDateString("pt-BR"),
        Placa: e.vehicleId?.plate ?? "",
        Categoria: "Arla",
        "Tipo de despesa": "Arla",
        "Custo total": e.amount ?? 0,
        Fornecedor: GAS_STATION_MAP[e.gasStationName] ?? "",
        Observações: `${e.liters ?? 0}L`,
      });
      expenseIds.push(e._id);
    });

    const operacional = (await OperationalExpense.find({
      exportedAt: null,
      active: true,
    })
      .populate("vehicle", "plate")
      .lean()) as any[];

    operacional.forEach((e) => {
      rows.push({
        Data: new Date(e.date).toLocaleDateString("pt-BR"),
        Placa: e.vehicle?.plate ?? "",
        Categoria: e.category,
        "Tipo de despesa": e.name,
        "Custo total": e.amount ?? 0,
        Fornecedor: "",
        Observações: "",
      });
      operationalIds.push(e._id);
    });

    if (expenseIds.length)
      await Expense.updateMany(
        { _id: { $in: expenseIds } },
        { exportedAt: new Date() }
      );
    if (operationalIds.length)
      await OperationalExpense.updateMany(
        { _id: { $in: operationalIds } },
        { exportedAt: new Date() }
      );

    const wb = XLSX.utils.book_new();

    const wsData = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, wsData, "Despesas");

    const categorias = [
      ["Categoria"],
      ["Aluguel"],
      ["Aquisição"],
      ["Seguro"],
      ["DPVAT"],
      ["IPVA, taxas e impostos"],
      ["Depreciação"],
      ["Documentação"],
      ["Ferramentas de gestão"],
      ["Despesas administrativas"],
      ["Sinistro"],
      ["Multas e infrações"],
      ["Pedágio"],
      ["Desmobilização"],
      ["Estacionamento"],
      ["Pneus"],
      ["Ferramentas e acessórios"],
      ["Lavagem"],
      ["Arla"],
      ["Serviços"],
      ["Outros"],
    ];
    const wsCat = XLSX.utils.aoa_to_sheet(categorias);
    XLSX.utils.book_append_sheet(wb, wsCat, "Categorias aceitas");

    return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  }

  async getPendingCounts() {
    const [combustivel, manutencao, generica, arla, operacional] =
      await Promise.all([
        Expense.countDocuments({
          type: ExpenseType.COMBUSTIVEL,
          fuelType: { $ne: "ARLA" },
          exportedAt: null,
        }),
        Expense.countDocuments({
          type: ExpenseType.MANUTENCAO,
          exportedAt: null,
        }),
        Expense.countDocuments({
          type: ExpenseType.DESPESA_GENERICA,
          exportedAt: null,
        }),
        Expense.countDocuments({
          type: ExpenseType.COMBUSTIVEL,
          fuelType: "ARLA",
          exportedAt: null,
        }),
        OperationalExpense.countDocuments({ exportedAt: null, active: true }),
      ]);

    return {
      combustivel,
      despesas: manutencao + generica + arla + operacional,
    };
  }
}
