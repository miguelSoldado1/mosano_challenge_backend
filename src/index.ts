import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { auth } from "./auth.js";
import connectDB from "./config/database.js";
import countryRoutes from "./routes/countryRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5050;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

// Routes
app.use("/api/country", countryRoutes);
app.use("/api/user", userRoutes);

await connectDB();
