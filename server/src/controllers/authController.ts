import type { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { createToken } from "../utils/token.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register: RequestHandler = async (req, res) => {
  const { name, email, password } = req.body ?? {};

  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.trim().length > 100
  ) {
    res.status(400).json({
      success: false,
      message: "Name is required and must be 100 characters or fewer.",
    });
    return;
  }

  if (
    typeof email !== "string" ||
    email.trim().length > 254 ||
    !emailPattern.test(email.trim())
  ) {
    res.status(400).json({
      success: false,
      message: "Please provide a valid email address.",
    });
    return;
  }

  if (
    typeof password !== "string" ||
    password.trim().length < 8 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    res.status(400).json({
      success: false,
      message:
        "Password must contain at least 8 non-padding characters and be no more than 72 bytes.",
    });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Ensure the unique email index exists before accepting registrations.
  await User.init();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    res.status(409).json({
      success: false,
      message: "An account with this email already exists.",
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  res.status(201).json({
    success: true,
    message: "Account created successfully.",
    token: createToken(user.id),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body ?? {};

  if (
    typeof email !== "string" ||
    email.trim().length > 254 ||
    !emailPattern.test(email.trim()) ||
    typeof password !== "string" ||
    !password ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    res.status(400).json({
      success: false,
      message: "Provide a valid email address and password.",
    });
    return;
  }

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Login successful.",
    token: createToken(user.id),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};