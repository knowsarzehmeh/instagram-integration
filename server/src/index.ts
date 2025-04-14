import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import { connectToDb } from "./db/connection";

// Load environment variables
dotenv.config();

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

app.get("/", (req, res) => {
  res.json({ message: "Instagram Integration API" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
