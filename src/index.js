import express from "express";
import { matchesRouter } from "./routes/matches.js";
import morgan from "morgan";

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Live sports dashboard API is running.");
});

app.use("/matches", matchesRouter);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
