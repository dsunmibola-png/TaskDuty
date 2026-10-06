import "dotenv/config";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

if (!secret || secret.length < 64) {
  throw new Error(
    "Set JWT_SECRET in server/.env using the generated 64-character value.",
  );
}

export const JWT_SECRET = secret;

export function createToken(userId: string) {
  return jwt.sign({}, JWT_SECRET, {
    subject: userId,
    algorithm: "HS256",
    expiresIn: "1h",
    issuer: "taskduty-api",
    audience: "taskduty",
  });
}