import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [playerCount, setPlayerCount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState("");
  const [currentRoom, setCurrentRoom] = useState(
    window.location.hash.slice(1) || Math.random().toString(36).substring(7)
  );

  useEffect(() => {
    // Update URL if needed
    if (!window.location.hash) {
      window.location.hash = currentRoom;
    }

    // Create socket connection
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    // Connection event handlers
    newSocket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
      // Join the room
      newSocket.emit("join room", currentRoom);
    });

    // Handle room changes
    const handleHashChange = () => {
      const newRoom = window.location.hash.slice(1);
      newSocket.emit("leave room", currentRoom);
      newSocket.emit("join room", newRoom);
      setCurrentRoom(newRoom);
      setRoom(newRoom);
      setReceivedMessages([]);
    };

    window.addEventListener("hashchange", handleHashChange);

    // Cleanup on component unmount or before refresh
    const handleBeforeUnload = () => {
      newSocket.emit("leave room", currentRoom);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Add player count handler
    newSocket.on("player count", (count: number) => {
      setPlayerCount(count);
    });

    // Add message receiver
    newSocket.on("chat message", (msg: string) => {
      setReceivedMessages((prev) => [...prev, msg]);
    });

    return () => {
      newSocket.emit("leave room", currentRoom);
      newSocket.disconnect();
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentRoom]);

  const sendMessage = () => {
    if (socket && message) {
      socket.emit("chat message", { room, message });
      setMessage("");
    }
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>Socket Status: {isConnected ? "✅ Connected" : "❌ Disconnected"}</p>
        <p>Current Room: {room}</p>
        <p>Players Online: {playerCount}</p>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send Message</button>
        <div>
          <h3>Received Messages:</h3>
          {receivedMessages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
