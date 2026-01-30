import express from "express";
import connectDB from "./config/database";
import countryRoutes from "./routes/countryRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();
const port = process.env.PORT || 5050;

app.use(express.json());

// Routes
app.use("/countries", countryRoutes);
app.use("/users", userRoutes);

async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

void startServer();
