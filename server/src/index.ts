import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: /http:\/\/localhost:[0-9]+/, // Allow any localhost port
    methods: ["GET", "POST"],
  },
});

// Track players per room
const roomPlayers = new Map<string, number>();
// Track which room each socket is in
const socketRooms = new Map<string, string>();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join room", (room) => {
    // Remove from previous room if any
    const previousRoom = socketRooms.get(socket.id);
    if (previousRoom) {
      socket.leave(previousRoom);
      const prevCount = roomPlayers.get(previousRoom) || 1;
      if (prevCount > 0) {
        roomPlayers.set(previousRoom, prevCount - 1);
        io.to(previousRoom).emit("player count", roomPlayers.get(previousRoom));
      }
    }

    // Join new room
    socket.join(room);
    socketRooms.set(socket.id, room);
    const currentCount = roomPlayers.get(room) || 0;
    roomPlayers.set(room, currentCount + 1);

    // Broadcast player count to room
    io.to(room).emit("player count", roomPlayers.get(room));
    console.log(`Client ${socket.id} joined room ${room}`);
  });

  socket.on("leave room", (room) => {
    socket.leave(room);
    socketRooms.delete(socket.id);
    const currentCount = roomPlayers.get(room) || 0;
    if (currentCount > 0) {
      roomPlayers.set(room, currentCount - 1);
    }

    // Broadcast player count to room
    io.to(room).emit("player count", roomPlayers.get(room));
    console.log(`Client ${socket.id} left room ${room}`);
  });

  socket.on("chat message", ({ room, message }) => {
    console.log(`Message in room ${room}:`, message);
    io.to(room).emit("chat message", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    // Clean up the room this socket was in
    const room = socketRooms.get(socket.id);
    if (room) {
      const currentCount = roomPlayers.get(room) || 0;
      if (currentCount > 0) {
        roomPlayers.set(room, currentCount - 1);
        io.to(room).emit("player count", roomPlayers.get(room));
      }
      socketRooms.delete(socket.id);
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
