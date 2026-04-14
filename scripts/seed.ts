import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "../src/models/User";
import { Vehicle } from "../src/models/Vehicle";
import { Route } from "../src/models/Route";

dotenv.config();

// ── Rotas ────────────────────────────────────────────
const ROUTES = [
  "CORDEIRO NORTE MG",
  "CORDEIRO DIAM",
  "KELSER",
  "MAMBO - SP",
  "MAMBO TERC",
  "DU BLÉ - SP",
  "TRIMAIS - SP",
  "BIG MAIS - GV",
  "SUPER BH - MG",
  "SUPER BH - ES",
  "DONA - BSB",
  "DU BLÉ - GO",
  "FRUITITUS - SP",
  "MOV INTERNA",
  "JSL",
  "SMART",
];

// ── Veículos ─────────────────────────────────────────
const VEHICLES = [
  { plate: "HBZ0787", vehicleModel: "Hyundai Hr Hdb 2009" },
  { plate: "HIV9D53", vehicleModel: "VW 26.320 2023" },
  { plate: "MOS6D31", vehicleModel: "Kia K2500 Ld 2012" },
  { plate: "OQK1C93", vehicleModel: "VW 8.160 Drc 4x2 2013" },
  { plate: "PVN2E88", vehicleModel: "Fiat Strada Working 2015" },
  { plate: "QQL9106", vehicleModel: "VW 11.180 Drc 4x2 2020" },
  { plate: "RUF5D27", vehicleModel: "Iveco Daily Chassi 2021" },
  { plate: "SHW9B96", vehicleModel: "VW 26.320 Termoking 2023" },
  { plate: "TDQ2B82", vehicleModel: "VW Delivery Express 2024" },
  { plate: "TDQ9H22", vehicleModel: "Iveco Daily Chassi 2025" },
  { plate: "TWZ8J38", vehicleModel: "Scania P320 B8x2 2025" },
  { plate: "TXE9D02", vehicleModel: "VW 13.180" },
  { plate: "TCI3E30", vehicleModel: "Fiat Strada EasyIce" },
];

const DRIVERS = [
  {
    name: "Mateus Terceirizado",
    phone: "31997264740",
    cnhType: "B",
    cnhExpiry: new Date("2033-08-22"),
    dailyAllowanceValue: 0,
  },
  {
    name: "Jose Alceu",
    phone: "31982065709",
    cnhType: null,
    cnhExpiry: null,
    dailyAllowanceValue: 0,
  },
  {
    name: "Adiel da Silva Maia",
    phone: "31986089926",
    cnhType: "AD",
    cnhExpiry: new Date("2035-01-06"),
    dailyAllowanceValue: 0,
  },
  {
    name: "Fabio Fernando de Abreu",
    phone: "31984832870",
    cnhType: "D",
    cnhExpiry: new Date("2034-09-19"),
    dailyAllowanceValue: 0,
  },
  {
    name: "Julio Cesar de Araujo",
    phone: "31971838229",
    cnhType: "E",
    cnhExpiry: new Date("2034-07-08"),
    dailyAllowanceValue: 0,
  },
  {
    name: "Rubens Vinicius Teixeira",
    phone: "31992657489",
    cnhType: "D",
    cnhExpiry: new Date("2028-10-27"),
    dailyAllowanceValue: 0,
  },
  {
    name: "Carlos Joao Gualberto",
    phone: "31997032030",
    cnhType: "D",
    cnhExpiry: new Date("2030-09-25"),
    dailyAllowanceValue: 0,
  },
  {
    name: "Wellinton Terceirizado",
    phone: "31999671661",
    cnhType: "AD",
    cnhExpiry: new Date("2034-10-12"),
    dailyAllowanceValue: 0,
  },
  {
    name: "Everton Geraldo de Oliveira",
    phone: "31973607064",
    cnhType: "E",
    cnhExpiry: new Date("2033-08-21"),
    dailyAllowanceValue: 0,
  },
  {
    name: "Breno Luis da Silva",
    phone: "31971783218",
    cnhType: "B",
    cnhExpiry: new Date("2035-12-30"),
    dailyAllowanceValue: 0,
  },
  {
    name: "Wellington Terceirizado",
    phone: "31991965261",
    cnhType: null,
    cnhExpiry: null,
    dailyAllowanceValue: 0,
  },
  {
    name: "Jose Alceu Chico",
    phone: "00000000000", // ⚠️ Mesmo tel que Jose Alceu — ajuste manualmente
    cnhType: null,
    cnhExpiry: null,
    dailyAllowanceValue: 0,
  },
];

const DEFAULT_PASSWORD = "123";

// ── Seed ─────────────────────────────────────────────
async function seed() {
  const uri = process.env.MONGO_URL;

  if (!uri)
    throw new Error("❌ Variável de conexão MongoDB não encontrada no .env");

  await mongoose.connect(uri);
  console.log("✅ MongoDB conectado\n");
  try {
    await User.collection.dropIndex("email_1");
    console.log("✅ Índice email_1 removido");
  } catch (e) {
    console.log("ℹ️  Índice email_1 não existia — ok");
  }
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  // ── Rotas (upsert por nome) ──
  let routesInserted = 0,
    routesUpdated = 0;
  for (const name of ROUTES) {
    const result = await Route.updateOne(
      { name },
      { $setOnInsert: { name, active: true } },
      { upsert: true }
    );
    if (result.upsertedCount) routesInserted++;
    else routesUpdated++;
  }
  console.log(
    `✅ Rotas — ${routesInserted} inseridas, ${routesUpdated} já existiam`
  );

  // ── Veículos (upsert por placa) ──
  let vehiclesInserted = 0,
    vehiclesUpdated = 0;
  for (const v of VEHICLES) {
    const result = await Vehicle.updateOne(
      { plate: v.plate },
      {
        $setOnInsert: {
          plate: v.plate,
          vehicleModel: v.vehicleModel,
          currentKm: 0,
          status: "DISPONIVEL",
          active: true,
        },
      },
      { upsert: true }
    );
    if (result.upsertedCount) vehiclesInserted++;
    else vehiclesUpdated++;
  }
  console.log(
    `✅ Veículos — ${vehiclesInserted} inseridos, ${vehiclesUpdated} já existiam`
  );

  // ── Motoristas (upsert por phone) ──
  let driversInserted = 0,
    driversUpdated = 0;
  for (const driver of DRIVERS) {
    const result = await User.updateOne(
      { phone: driver.phone },
      {
        $setOnInsert: {
          name: driver.name,
          phone: driver.phone,
          password: hashedPassword,
          role: "DRIVER",
          active: true,
          dailyAllowanceValue: driver.dailyAllowanceValue,
          ...(driver.cnhType && { cnhType: driver.cnhType }),
          ...(driver.cnhExpiry && { cnhExpiry: driver.cnhExpiry }),
        },
      },
      { upsert: true }
    );
    if (result.upsertedCount) driversInserted++;
    else driversUpdated++;
  }
  console.log(
    `✅ Motoristas — ${driversInserted} inseridos, ${driversUpdated} já existiam`
  );

  console.log(`
🎉 Seed concluído!
🔑 Senha padrão: ${DEFAULT_PASSWORD}
⚠️  Jose Alceu CHICO está com telefone placeholder (00000000000) — ajuste manualmente.
⚠️  Oriente os motoristas a alterarem a senha no primeiro acesso.
`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
});
