import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(url: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(url);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [url]);

  return { socket, isConnected };
}
