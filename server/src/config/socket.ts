import { Server } from "socket.io";
import { createServer } from "http";
import { Express } from "express";
import { setupRoomEvents } from "../events/roomEvents";
import { setupChatEvents } from "../events/chatEvents";
import { RoomService } from "../services/RoomService";
import { SocketServer } from "../types/socket";

export function setupSocket(app: Express): SocketServer {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: /http:\/\/localhost:[0-9]+/,
      methods: ["GET", "POST"],
    },
  });

  const roomService = new RoomService();

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    setupRoomEvents(io, socket, roomService);
    setupChatEvents(io, socket);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      const room = roomService.getCurrentRoom(socket.id);
      if (room) {
        const newCount = roomService.leaveRoom(socket.id, room);
        io.to(room).emit("player count", newCount);
      }
    });
  });

  return io;
}
