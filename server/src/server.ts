import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = Number(process.env.PORT) || 5001;

async function startServer() {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`TaskDuty API running on http://localhost:${PORT}`);
    });

    server.on("error", (error) => {
      console.error("Server failed to start:", error.message);
      process.exit(1);
    });
  } catch (error) {
    console.error(
      "Database connection failed:",
      error instanceof Error ? error.message : "Unknown error",
    );

    process.exit(1);
  }
}

startServer();