export class RoomService {
  private roomPlayers: Map<string, number>;
  private socketRooms: Map<string, string>;

  constructor() {
    this.roomPlayers = new Map();
    this.socketRooms = new Map();
  }

  joinRoom(socketId: string, room: string): number {
    this.socketRooms.set(socketId, room);
    const currentCount = this.roomPlayers.get(room) || 0;
    this.roomPlayers.set(room, currentCount + 1);
    return this.roomPlayers.get(room) || 0;
  }

  leaveRoom(socketId: string, room: string): number {
    this.socketRooms.delete(socketId);
    const currentCount = this.roomPlayers.get(room) || 0;
    if (currentCount > 0) {
      this.roomPlayers.set(room, currentCount - 1);
    }
    return this.roomPlayers.get(room) || 0;
  }

  getCurrentRoom(socketId: string): string | undefined {
    return this.socketRooms.get(socketId);
  }

  getPlayerCount(room: string): number {
    return this.roomPlayers.get(room) || 0;
  }
}
