import { Request, Response } from "express";
import { DashboardService } from "../services/DashboardService";
import { handleApiError } from "../utils/errorHandler";
import { notificationBroadcast } from "../services/NotificationBroadcastService";

const dashboardService = new DashboardService();

export class DashboardController {
  async getStats(req: Request, res: Response) {
    try {
      const stats = await dashboardService.getStats();
      return res.json(stats);
    } catch (error: any) {
      return handleApiError(error, res);
    }
  }

  async stream(req: Request, res: Response) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.flushHeaders();

    try {
      const stats = await dashboardService.getStats();
      res.write(`data: ${JSON.stringify(stats)}\n\n`);
    } catch {}

    notificationBroadcast.addClient(res);
    console.log(
      `📡 SSE client conectado. Total: ${notificationBroadcast.count}`
    );

    req.on("close", () => {
      notificationBroadcast.removeClient(res);
      console.log(
        `📡 SSE client desconectado. Total: ${notificationBroadcast.count}`
      );
    });
  }
}
