import { SocketServer, SocketClient } from "../types/socket";

export function setupChatEvents(io: SocketServer, socket: SocketClient) {
  socket.on("chat message", ({ room, message }) => {
    console.log(`Message in room ${room}:`, message);
    io.to(room).emit("chat message", message);
  });
}
