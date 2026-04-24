import { Schema, model, Document, Types } from "mongoose";

export interface IOrdemServico extends Document {
  numeroOS: number;
  tipo: "CORRETIVA" | "PREVENTIVA";
  veiculo: Types.ObjectId;
  solicitante: Types.ObjectId;
  executor: Types.ObjectId | null;
  prioridade: "NORMAL" | "ALTA" | "EMERGENCIA";
  situacao: "EM_ABERTO" | "EM_PROCESSO" | "CONCLUIDO";
  descricao: string;
  arquivo?: string;
  pecasUtilizadas?: string; // 👈
  valorPecas: number;
  valorMaoDeObra: number;
  observacoes?: string;
  dataPrevista?: Date;
  dataAbertura: Date;
  dataFechamento?: Date;
  periodicidadeHorimetro?: number;
}

const OrdemServicoSchema = new Schema(
  {
    numeroOS: { type: Number, unique: true },
    tipo: {
      type: String,
      enum: ["CORRETIVA", "PREVENTIVA"],
      required: true,
    },
    veiculo: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    solicitante: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    executor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    prioridade: {
      type: String,
      enum: ["NORMAL", "ALTA", "EMERGENCIA"],
      default: "NORMAL",
    },
    situacao: {
      type: String,
      enum: ["EM_ABERTO", "EM_PROCESSO", "CONCLUIDO"],
      default: "EM_ABERTO",
    },
    descricao: { type: String, required: true },
    arquivo: { type: String },
    pecasUtilizadas: { type: String },
    valorPecas: { type: Number, default: 0 },
    valorMaoDeObra: { type: Number, default: 0 },
    observacoes: { type: String },
    dataPrevista: { type: Date },
    dataAbertura: { type: Date, default: Date.now },
    dataFechamento: { type: Date },
    periodicidadeHorimetro: { type: Number, default: 0 },
  },
  { timestamps: true }
);

OrdemServicoSchema.pre("save", async function () {
  if (this.isNew) {
    const last = await OrdemServico.findOne()
      .sort({ numeroOS: -1 })
      .select("numeroOS");
    this.numeroOS = (last?.numeroOS ?? 0) + 1;
  }
});

OrdemServicoSchema.index({ numeroOS: -1 });
OrdemServicoSchema.index({ situacao: 1 });
OrdemServicoSchema.index({ veiculo: 1 });
OrdemServicoSchema.index({ solicitante: 1 });
OrdemServicoSchema.index({ executor: 1 });

export const OrdemServico = model<IOrdemServico>(
  "OrdemServico",
  OrdemServicoSchema
);
