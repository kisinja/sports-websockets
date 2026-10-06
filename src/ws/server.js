import { WebSocket, WebSocketServer } from "ws";

/*
 * WebSocket server for live match updates.
 *
 * This module attaches a lightweight WS server to an existing HTTP server and
 * exposes a small API for broadcasting match events to connected clients.
 * The connection handshake sends an initial "welcome" message, and the server
 * can fan out payloads such as match creation notifications to all currently
 * connected sockets.
 */

function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify(payload));
}

function broadcast(wss, payload) {
  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) return;

    client.send(JSON.stringify(payload));
  }
}

export function attachWebSocketServer(server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
    maxPayload: 1024 * 1024, // 1 MB
  });

  wss.on("connection", (socket) => {
    sendJson(socket, { type: "welcome" });

    socket.on("error", console.error);
  });

  function broadcastMatchCreated(match) {
    broadcast(wss, { type: "match_created", data: match });
  }

  return { broadcastMatchCreated };
}
