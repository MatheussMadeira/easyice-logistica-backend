// scripts/cleanup.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/User";

dotenv.config();

async function cleanup() {
  const uri = process.env.MONGO_URL;
  if (!uri) throw new Error("❌ MONGO_URI não encontrado");

  await mongoose.connect(uri);
  console.log("✅ MongoDB conectado\n");

  const users = await User.find({ role: "DRIVER" });
  let deleted = 0;

  const byName = users.reduce((acc, user) => {
    const key = user.name.trim().toUpperCase();
    if (!acc[key]) acc[key] = [];
    acc[key].push(user);
    return acc;
  }, {} as Record<string, typeof users>);

  for (const [name, group] of Object.entries(byName)) {
    if (group.length < 2) continue;

    const comPhone = group.filter((u) => u.phone && u.phone !== "00000000000");
    const semPhone = group.filter((u) => !u.phone || u.phone === "00000000000");

    if (comPhone.length > 0 && semPhone.length > 0) {
      const idsParaDeletar = semPhone.map((u) => u._id);
      await User.deleteMany({ _id: { $in: idsParaDeletar } });

      console.log(`🗑️  ${name}`);
      console.log(`   Mantido:  ${comPhone[0].phone}`);
      console.log(
        `   Deletados: ${semPhone.length} registro(s) sem telefone\n`
      );
      deleted += semPhone.length;
    } else if (comPhone.length === 0) {
      const [maisAntigo, ...resto] = group.sort(
        (a, b) =>
          new Date((a as any).createdAt).getTime() -
          new Date((b as any).createdAt).getTime()
      );
      await User.deleteMany({ _id: { $in: resto.map((u) => u._id) } });

      console.log(`🗑️  ${name} — todos sem telefone`);
      console.log(`   Mantido o mais antigo: ${maisAntigo._id}\n`);
      deleted += resto.length;
    } else {
      console.log(
        `⚠️  ${name} — ${group.length} registros, todos com telefone. Revisar manualmente.`
      );
      group.forEach((u) => console.log(`   _id: ${u._id} | phone: ${u.phone}`));
      console.log();
    }
  }

  console.log(
    `\n🎉 Limpeza concluída — ${deleted} usuário(s) duplicado(s) removido(s)`
  );
  await mongoose.disconnect();
}

cleanup().catch((err) => {
  console.error("❌ Erro:", err);
  process.exit(1);
});
