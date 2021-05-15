import { WebSocket, isWebSocketCloseEvent } from 'https://deno.land/std/ws/mod.ts';

const rooms = new Map<string, WebSocket[]>();

function broadcast(message: string, room: string): void {
  console.log('🚀 ~ file: room.ts ~ line 6 ~ broadcast ~ message', room,message)
  if (!message || !room) return;
  for (const ws of rooms.get(room) ?? []) {
    ws.send(message);
  }
}

export async function room(ws: WebSocket, room: string): Promise<void> {
  console.log('🚀 ~ file: room.ts ~ line 14 ~ room ~ room', room)
  const already = rooms.get(room);
  const arr = already ? [...already, ws] : [ws];
  rooms.set(room, arr);
  console.log('🚀 ~ file: room.ts ~ line 20 ~ room ~ rooms', rooms)

  for await (const event of ws) {
    const message = typeof event === 'string' ? event : '';

    broadcast(message, room);

    if (!message && isWebSocketCloseEvent(event)) {
      const arr = rooms.get(room)?.filter((w) => w !== ws) ?? [];
      if (arr.length) {
        rooms.set(room, arr);
      } else {
        rooms.delete(room);
      }
      break;
    }
  }
}
