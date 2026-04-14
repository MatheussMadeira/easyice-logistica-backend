import { Router } from "express";
import { ExpenseController } from "../controllers/ExpenseController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const expenseRoutes = Router();
const expenseController = new ExpenseController();

expenseRoutes.use(authMiddleware);

expenseRoutes.get("/diary", expenseController.index);
expenseRoutes.post("/diary", expenseController.openDiary);
expenseRoutes.get("/diary/:diaryId", expenseController.getDiaryDetails);
expenseRoutes.patch("/diary/:diaryId/close", expenseController.closeDiary);
expenseRoutes.patch("/diary/:diaryId/cancel", expenseController.cancelDiary);

expenseRoutes.post("/diary/:diaryId/expense", expenseController.addExpense);
expenseRoutes.put(
  "/diary/:diaryId/expense/:expenseId",
  expenseController.updateExpense
);
expenseRoutes.delete(
  "/diary/:diaryId/expense/:expenseId",
  expenseController.removeExpense
);

expenseRoutes.get(
  "/maintenance",
  roleMiddleware(["ADMIN"]),
  expenseController.listMaintenances
);

export { expenseRoutes };
