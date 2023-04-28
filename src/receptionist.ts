import { Sendable, WebSocketService } from "./websocket"

export type Guest = {
  id: number
}

export interface Receptionist {
  setGuestToRoom: (room: string, guest: Guest) => void
  sendToRoom: (room: string, sendable: Sendable) => void
  removeGuestFromRoom: (room: string, guest: Guest) => void
}

export function create(webSocket: WebSocketService): Receptionist {
  return new InMemoryReceptionist(webSocket)
}

class InMemoryReceptionist implements Receptionist {
  rooms: Record<string, Array<Guest>> = {}
  webSocket: WebSocketService

  constructor(webSocket: WebSocketService) {
    this.webSocket = webSocket
  }

  setGuestToRoom(room: string, guest: Guest) {
    if (!(room in this.rooms)) {
      this.rooms[room] = [guest]
    } else {
      this.rooms[room].push(guest)
    }
  }

  sendToRoom(room: string, sendable: Sendable) {
    const targetRooms = this.rooms[room]
    this.webSocket.broadcastWhen(client => {
      return targetRooms.map(room => room.id).includes(client.id)
    }, sendable)
  }

  removeGuestFromRoom(room: string, guest: Guest) {
    this.rooms[room] = this.rooms[room].filter(currentGuest => currentGuest !== guest)
  }
}
