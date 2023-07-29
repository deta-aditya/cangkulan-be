export type Rooms = Record<string, number[]>

export function addClientToRoom(rooms: Rooms, roomId: string, client: number): Rooms {
  const newRooms = { ...rooms }
  if (!(roomId in newRooms)) {
    newRooms[roomId] = [client]
  } else {
    newRooms[roomId].push(client)
  }
  return newRooms
}

export function isClientInRoom(rooms: Rooms, roomId: string, clientId: number) {
  const clientsInTheRoom = rooms[roomId] || []
  return clientsInTheRoom.includes(clientId)
}