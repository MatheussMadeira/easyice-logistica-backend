import { Response } from "express";

class NotificationBroadcast {
  private clients = new Set<Response>();

  addClient(res: Response) {
    this.clients.add(res);
  }

  removeClient(res: Response) {
    this.clients.delete(res);
  }

  broadcast(data: object) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    this.clients.forEach((client) => {
      try {
        client.write(payload);
      } catch {
        this.clients.delete(client);
      }
    });
  }

  get count() {
    return this.clients.size;
  }
}

export const notificationBroadcast = new NotificationBroadcast();
