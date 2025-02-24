import { SocketServer, SocketClient } from "../types/socket";
import { RoomService } from "../services/RoomService";

export function setupRoomEvents(
  io: SocketServer,
  socket: SocketClient,
  roomService: RoomService
) {
  socket.on("join room", (room) => {
    const previousRoom = roomService.getCurrentRoom(socket.id);
    if (previousRoom) {
      socket.leave(previousRoom);
      const prevCount = roomService.leaveRoom(socket.id, previousRoom);
      io.to(previousRoom).emit("player count", prevCount);
    }

    socket.join(room);
    const newCount = roomService.joinRoom(socket.id, room);
    io.to(room).emit("player count", newCount);
    console.log(`Client ${socket.id} joined room ${room}`);
  });

  socket.on("leave room", (room) => {
    socket.leave(room);
    const newCount = roomService.leaveRoom(socket.id, room);
    io.to(room).emit("player count", newCount);
    console.log(`Client ${socket.id} left room ${room}`);
  });
}
