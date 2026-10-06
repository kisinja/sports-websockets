import "dotenv/config";
import express from "express";
import http from "http";
import { matchesRouter } from "./routes/matches.js";
import morgan from "morgan";
import { attachWebSocketServer } from "./ws/server.js";

const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || "0.0.0.0";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.send("Live sports dashboard API is running.");
});

app.use("/matches", matchesRouter);

const { broadcastMatchCreated } = attachWebSocketServer(server);

// Attach the broadcast function to app.locals so that it can be accessed in route handlers. app.locals is a built-in object in Express that provides a way to store variables that are accessible throughout the application. By assigning broadcastMatchCreated to app.locals, we can call this function from any route handler, allowing us to broadcast match creation events to all connected WebSocket clients whenever a new match is created.
app.locals.broadcastMatchCreated = broadcastMatchCreated;

server.listen(PORT, HOST, () => {
  const baseUrl =
    HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
  console.log(`Server running on ${baseUrl}`);
  console.log(
    `WebSocket server running on ${baseUrl.replace("http", "ws")}/ws`,
  );
});
