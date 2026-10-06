import { setServers } from "node:dns";
import mongoose from "mongoose";

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing from server/.env");
  }

  const dnsServers = process.env.DNS_SERVERS
    ?.split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers?.length) {
    setServers(dnsServers);
  }

  await mongoose.connect(uri, {
    dbName: "taskduty",
  });

  console.log("MongoDB connected successfully");
}

export default connectDB;