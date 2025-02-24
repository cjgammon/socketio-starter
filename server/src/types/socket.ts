import { Server, Socket } from "socket.io";

export interface ServerToClientEvents {
  "chat message": (message: string) => void;
  "player count": (count: number) => void;
}

export interface ClientToServerEvents {
  "join room": (room: string) => void;
  "leave room": (room: string) => void;
  "chat message": (data: { room: string; message: string }) => void;
}

export type SocketServer = Server<ClientToServerEvents, ServerToClientEvents>;
export type SocketClient = Socket<ClientToServerEvents, ServerToClientEvents>;
