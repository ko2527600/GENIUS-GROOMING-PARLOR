import "dotenv/config";
import express from "express";
import cors from "cors";
import bookingsRouter from "./routes/bookings.js";

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/bookings", bookingsRouter);

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
