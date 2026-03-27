import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost:27017/gestao_frota";

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("✅ MongoDB conectado com sucesso");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error);
    process.exit(1);
  }
};
