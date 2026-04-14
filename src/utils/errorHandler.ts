import { Response } from "express";

export const handleApiError = (error: any, res: Response) => {
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((err: any) => err.message);
    return res.status(400).json({ error: messages.join(", ") }) as any;
  }

  if (error.name === "CastError") {
    return res
      .status(400)
      .json({ error: "Formato de dado inválido (ex: ID incorreto)." }) as any;
  }

  if (error.message) {
    return res.status(400).json({ error: error.message }) as any;
  }

  console.error("Erro interno:", error);
  return res.status(500).json({
    error: "Erro interno no servidor. Tente novamente mais tarde.",
  }) as any;
};
