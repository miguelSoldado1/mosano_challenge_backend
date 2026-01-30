import express from "express";
import connectDB from "./config/database";
import countryRoutes from "./routes/countryRoutes";

const app = express();
const port = process.env.PORT || 5050;

app.use(express.json());

// Routes
app.use("/countries", countryRoutes);

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
