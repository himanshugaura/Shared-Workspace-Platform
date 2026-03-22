import type { Express } from "express";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { globalErrorHandler } from "./utils/globalErrorHandler.js";
import { connectDB } from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/auth" , authRoutes);
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

app.use(globalErrorHandler);