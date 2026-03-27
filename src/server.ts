import express from "express";
import { connectDatabase } from "./config/database";

const app = express();

app.use(express.json());

connectDatabase();

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
