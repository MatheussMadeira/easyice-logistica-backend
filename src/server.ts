import "dotenv/config";

import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/database";
import { routes } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

connectDatabase();

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
