interface RoomInfoProps {
  isConnected: boolean;
  room: string;
  playerCount: number;
}

export function RoomInfo({ isConnected, room, playerCount }: RoomInfoProps) {
  return (
    <div>
      <p>Socket Status: {isConnected ? "✅ Connected" : "❌ Disconnected"}</p>
      <p>Current Room: {room}</p>
      <p>Players Online: {playerCount}</p>
    </div>
  );
}
