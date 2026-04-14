import { DiaryExpense, Expense, ExpenseType } from "../models/Expense";
import { Vehicle } from "../models/Vehicle";
import { Route } from "../models/Route";
import { User } from "../models/User";

export class ExpenseService {
  async openDiary(userId: string, diaryData: any) {
    const activeDiary = await Expense.findOne({
      userId,
      type: ExpenseType.DIARIO,
      status: "ABERTO",
    });
    if (activeDiary) throw new Error("Você já possui um diário em aberto.");

    const vehicle = await Vehicle.findById(diaryData.vehicleId);
    if (!vehicle) throw new Error("Veículo não encontrado na frota.");
    if (!vehicle.active)
      throw new Error("Este veículo está desativado do sistema.");
    if (vehicle.status !== "DISPONIVEL")
      throw new Error(`Veículo indisponível. Status atual: ${vehicle.status}`);

    const route = await Route.findById(diaryData.routeId);
    if (!route) throw new Error("A rota selecionada não existe.");
    if (!route.active)
      throw new Error("Esta rota foi desativada pelo administrador.");

    const diary = await Expense.create({
      ...diaryData,
      kmStart: diaryData.kmStart || vehicle.currentKm,
      userId,
      type: ExpenseType.DIARIO,
      status: "ABERTO",
    });

    vehicle.status = "EM_ROTA";
    vehicle.currentKm = diaryData.kmStart || vehicle.currentKm;
    await vehicle.save();

    return diary;
  }

  async addExpenseToDiary(userId: string, diaryId: string, expenseData: any) {
    const diary = await Expense.findOne({ _id: diaryId, userId });
    if (!diary)
      throw new Error("Diário não encontrado ou não pertence a você.");
    if (diary.status !== "ABERTO")
      throw new Error(
        "Não é possível adicionar despesas a um diário finalizado."
      );

    return await Expense.create({
      ...expenseData,
      userId,
      parentDiaryId: diaryId,
      vehicleId: diary.vehicleId,
    });
  }

  async closeDiary(
    userId: string,
    diaryId: string,
    closingData: { kmEnd: number; date?: Date }
  ) {
    const diary = await Expense.findOne({
      _id: diaryId,
      userId,
      type: "DIARIO",
    });
    if (!diary) throw new Error("Diário não encontrado.");

    const driver = await User.findById(diary.userId);
    if (!driver)
      throw new Error("Motorista não encontrado para calcular a diária.");

    const startDate = new Date(diary.date);
    const endDate = closingData.date ? new Date(closingData.date) : new Date();

    const startDay = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    const endDay = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );

    const diffInMs = endDay.getTime() - startDay.getTime();
    const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

    const DAILY_VALUE = driver.dailyAllowanceValue || 0;
    const totalDailyAllowance = diffInDays * DAILY_VALUE;

    const expenses = await Expense.find({ parentDiaryId: diaryId });
    const totalExpensesAmount = expenses.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );

    const updated = await DiaryExpense.findByIdAndUpdate(
      diaryId,
      {
        kmEnd: closingData.kmEnd,
        date: endDate,
        status: "FECHADO",
        dailyAllowance: totalDailyAllowance,
        totalToPay: totalDailyAllowance + totalExpensesAmount,
        amount: totalDailyAllowance + totalExpensesAmount,
        description: `Viagem | ${diffInDays} diária(s).`,
      },
      { new: true }
    );

    await Vehicle.findByIdAndUpdate(diary.vehicleId, {
      status: "DISPONIVEL",
      currentKm: closingData.kmEnd,
    });

    return updated;
  }

  async listDiaries(userId: string, userRole: string, status?: string) {
    const query: any = { type: ExpenseType.DIARIO };
    if (userRole !== "ADMIN") {
      query.userId = userId;
    }
    if (status) query.status = status;

    return await Expense.find(query)
      .sort({ createdAt: -1 })
      .populate("vehicleId", "plate vehicleModel")
      .populate("userId", "name")
      .populate("routeId", "name");
  }

  async getDiaryDetails(userId: string, diaryId: string, userRole: string) {
    const query: any = { _id: diaryId, type: ExpenseType.DIARIO };
    if (userRole !== "ADMIN") query.userId = userId;

    const diary = await Expense.findOne(query)
      .populate("vehicleId", "plate vehicleModel")
      .populate("userId", "name")
      .populate("routeId", "name");

    if (!diary) throw new Error("Diário não encontrado.");

    const expenses = await Expense.find({ parentDiaryId: diaryId })
      .populate("maintenanceItemId", "description")
      .sort({ createdAt: 1 });

    return { diary, expenses };
  }

  async updateExpense(
    userId: string,
    diaryId: string,
    expenseId: string,
    updateData: any
  ) {
    const diary = await Expense.findOne({ _id: diaryId, userId });
    if (!diary || diary.status !== "ABERTO")
      throw new Error("Diário inválido ou já fechado.");

    const updated = await Expense.findOneAndUpdate(
      { _id: expenseId, parentDiaryId: diaryId },
      { ...updateData },
      { new: true }
    );
    if (!updated) throw new Error("Despesa não encontrada.");
    return updated;
  }

  async removeExpense(userId: string, diaryId: string, expenseId: string) {
    const diary = await Expense.findOne({ _id: diaryId, userId });
    if (!diary || diary.status !== "ABERTO")
      throw new Error("Diário inválido ou já fechado.");

    const deleted = await Expense.findOneAndDelete({
      _id: expenseId,
      parentDiaryId: diaryId,
    });
    if (!deleted) throw new Error("Despesa não encontrada.");
    return { message: "Despesa removida." };
  }

  async cancelDiary(userId: string, diaryId: string) {
    const diary = await Expense.findOne({ _id: diaryId, userId });
    if (!diary || diary.status !== "ABERTO")
      throw new Error("Apenas diários em andamento podem ser cancelados.");

    const canceledDiary = await Expense.findByIdAndUpdate(
      diaryId,
      {
        status: "CANCELADO",
        description: `${diary.description || ""} [CANCELADO]`,
      },
      { new: true }
    );

    await Vehicle.findByIdAndUpdate(diary.vehicleId, {
      status: "DISPONIVEL",
    });

    return canceledDiary;
  }
  async listMaintenances() {
    return await Expense.find({ type: ExpenseType.MANUTENCAO })
      .sort({ createdAt: -1 })
      .populate("vehicleId", "plate vehicleModel")
      .populate("userId", "name")
      .populate("maintenanceItemId", "description");
  }
}
