import { OrdemServico } from "../models/OrdemServico";
import { Vehicle } from "../models/Vehicle";
import { User } from "../models/User";

export class OrdemServicoService {
  async create(data: {
    tipo: string;
    veiculoId: string;
    userId: string;
    executorId?: string;
    prioridade: string;
    descricao: string;
    arquivo?: string;
    observacoes?: string;
    dataPrevista?: string;
  }) {
    const vehicle = await Vehicle.findById(data.veiculoId);
    if (!vehicle) throw new Error("Veículo não encontrado.");
    if (!vehicle.active) throw new Error("Veículo desativado.");

    const os = await OrdemServico.create({
      tipo: data.tipo,
      veiculo: data.veiculoId,
      solicitante: data.userId,
      prioridade: data.prioridade,
      descricao: data.descricao,
      executor: data.executorId || null,
      arquivo: data.arquivo,
      observacoes: data.observacoes,
      dataPrevista: data.dataPrevista ? new Date(data.dataPrevista) : undefined,
      situacao: "EM_ABERTO",
    });

    vehicle.status = "MANUTENCAO";
    await vehicle.save();

    return os.populate([
      { path: "veiculo", select: "plate vehicleModel" },
      { path: "solicitante", select: "name" },
    ]);
  }

  async list(filters: {
    situacao?: string;
    tipo?: string;
    veiculoId?: string;
    userId?: string;
    userRole?: string;
  }) {
    const query: any = {};

    if (filters.situacao) query.situacao = { $in: filters.situacao.split(",") };
    if (filters.tipo) query.tipo = filters.tipo;
    if (filters.veiculoId) query.veiculo = filters.veiculoId;

    if (filters.userRole !== "ADMIN") {
      query.$or = [
        { solicitante: filters.userId },
        { executor: filters.userId },
      ];
    }

    return await OrdemServico.find(query)
      .sort({ numeroOS: -1 })
      .populate("veiculo", "plate vehicleModel status")
      .populate("solicitante", "name")
      .populate("executor", "name");
  }

  async findById(id: string) {
    const os = await OrdemServico.findById(id)
      .populate("veiculo", "plate vehicleModel currentKm status")
      .populate("solicitante", "name")
      .populate("executor", "name");

    if (!os) throw new Error("Ordem de Serviço não encontrada.");
    return os;
  }

  async update(
    id: string,
    data: {
      situacao?: string;
      executorId?: string;
      prioridade?: string;
      observacoes?: string;
      dataPrevista?: string;
      valorPecas?: number;
      valorMaoDeObra?: number;
    }
  ) {
    const os = await OrdemServico.findById(id);
    if (!os) throw new Error("Ordem de Serviço não encontrada.");
    if (os.situacao === "CONCLUIDO")
      throw new Error("OS já concluída não pode ser alterada.");

    if (data.executorId) os.executor = data.executorId as any;
    if (data.situacao) os.situacao = data.situacao as any;
    if (data.prioridade) os.prioridade = data.prioridade as any;
    if (data.observacoes) os.observacoes = data.observacoes;
    if (data.valorPecas !== undefined) os.valorPecas = data.valorPecas;
    if (data.valorMaoDeObra !== undefined)
      os.valorMaoDeObra = data.valorMaoDeObra;
    if (data.dataPrevista) os.dataPrevista = new Date(data.dataPrevista);

    await os.save();

    return os.populate([
      { path: "veiculo", select: "plate vehicleModel" },
      { path: "solicitante", select: "name" },
      { path: "executor", select: "name" },
    ]);
  }

  async conclude(
    id: string,
    data: {
      valorPecas?: number;
      valorMaoDeObra?: number;
      observacoes?: string;
    }
  ) {
    const os = await OrdemServico.findById(id).populate("veiculo");
    if (!os) throw new Error("Ordem de Serviço não encontrada.");
    if (os.situacao === "CONCLUIDO") throw new Error("OS já está concluída.");

    os.situacao = "CONCLUIDO";
    os.dataFechamento = new Date();
    if (data.valorPecas !== undefined) os.valorPecas = data.valorPecas;
    if (data.valorMaoDeObra !== undefined)
      os.valorMaoDeObra = data.valorMaoDeObra;
    if (data.observacoes) os.observacoes = data.observacoes;

    await os.save();

    const vehicle = await Vehicle.findById(os.veiculo);
    if (vehicle) {
      vehicle.status = "DISPONIVEL";

      if (os.tipo === "PREVENTIVA" && vehicle.maintenanceIntervalKm) {
        vehicle.nextMaintenanceKm =
          vehicle.currentKm + vehicle.maintenanceIntervalKm;
        vehicle.maintenanceOverride = false;
      }

      await vehicle.save();
    }

    return os;
  }
  async delete(id: string) {
    const os = await OrdemServico.findById(id);
    if (!os) throw new Error("OS não encontrada.");

    if (os.situacao !== "CONCLUIDO") {
      await Vehicle.findByIdAndUpdate(os.veiculo, {
        status: "DISPONIVEL",
      });
    }

    await OrdemServico.findByIdAndDelete(id);
    return { message: "OS removida com sucesso." };
  }
}
