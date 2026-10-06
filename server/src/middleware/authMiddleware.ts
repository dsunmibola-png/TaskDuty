import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { isValidObjectId } from "mongoose";
import User from "../models/User.js";
import { JWT_SECRET } from "../utils/token.js";

export const requireAuth: RequestHandler = async (req, res, next) => {
  const authorization = req.headers.authorization;
  const parts = authorization?.trim().split(/\s+/);

  if (
    !parts ||
    parts.length !== 2 ||
    parts[0].toLowerCase() !== "bearer"
  ) {
    res.status(401).json({
      success: false,
      message: "Please provide a Bearer token.",
    });
    return;
  }

  let payload: string | JwtPayload;

  try {
    payload = jwt.verify(parts[1], JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "taskduty-api",
      audience: "taskduty",
    });
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
    return;
  }

  if (
    typeof payload === "string" ||
    typeof payload.sub !== "string" ||
    !isValidObjectId(payload.sub)
  ) {
    res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
    return;
  }

  const userExists = await User.exists({ _id: payload.sub });

  if (!userExists) {
    res.status(401).json({
      success: false,
      message: "This account no longer exists.",
    });
    return;
  }

  res.locals.userId = payload.sub;
  next();
};