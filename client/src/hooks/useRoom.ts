import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";

export function useRoom(socket: Socket | null) {
  const [currentRoom, setCurrentRoom] = useState(
    window.location.hash.slice(1) || Math.random().toString(36).substring(7)
  );
  const [room, setRoom] = useState("");
  const [playerCount, setPlayerCount] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!socket) return;

    if (!window.location.hash) {
      window.location.hash = currentRoom;
    }

    socket.emit("join room", currentRoom);
    setRoom(currentRoom);

    socket.on("player count", (count: number) => {
      setPlayerCount(count);
    });

    socket.on("chat message", (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    const handleHashChange = () => {
      const newRoom = window.location.hash.slice(1);
      socket.emit("leave room", currentRoom);
      socket.emit("join room", newRoom);
      setCurrentRoom(newRoom);
      setRoom(newRoom);
      setMessages([]);
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      socket.emit("leave room", currentRoom);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [socket, currentRoom]);

  return { room, playerCount, messages, setMessages };
}
