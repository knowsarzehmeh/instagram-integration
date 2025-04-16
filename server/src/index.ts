import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// Load environment variables
dotenv.config();

import authRoutes from "./routes/authRoutes";
import mediaRoutes from "./routes/mediaRoutes";
import { connectToDb } from "./db/connection";
import { serverConfig } from "./utils/config";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToDb().catch((error) => {
  console.error("Failed to connect to MongoDB:", error);
  process.exit(1);
});

// Routes
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Instagram Integration API" });
});

// Start server
const PORT = serverConfig.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
