import { ChatInput } from "./components/ChatInput/ChatInput";
import { ChatMessages } from "./components/ChatMessages/ChatMessages";
import { RoomInfo } from "./components/RoomInfo/RoomInfo";
import { useSocket } from "./hooks/useSocket";
import { useRoom } from "./hooks/useRoom";
import { SocketProvider } from "./contexts/SocketContext";
import "./App.css";

function App() {
  const { socket, isConnected } = useSocket("http://localhost:3001");
  const { room, playerCount, messages } = useRoom(socket);

  const handleSendMessage = (message: string) => {
    if (socket && message) {
      socket.emit("chat message", { room, message });
    }
  };

  return (
    <SocketProvider value={{ socket, isConnected, room, playerCount }}>
      <RoomInfo
        isConnected={isConnected}
        room={room}
        playerCount={playerCount}
      />
      <div className="card">
        <ChatInput onSendMessage={handleSendMessage} />
        <ChatMessages messages={messages} />
      </div>
    </SocketProvider>
  );
}

export default App;
