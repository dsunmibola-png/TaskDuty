import { categories } from "../models/Task.js";

function getToday() {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

export function validateTask(
  body: unknown,
  partial = false,
): string | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Provide a JSON object containing task fields.";
  }

  const data = body as Record<string, unknown>;

  const allowedFields = [
    "title",
    "description",
    "dueDate",
    "category",
    "completed",
  ];

  if (Object.keys(data).some((key) => !allowedFields.includes(key))) {
    return "Only title, description, dueDate, category and completed are allowed.";
  }

  if (partial && Object.keys(data).length === 0) {
    return "Provide at least one field to update.";
  }

  for (const field of ["title", "description"] as const) {
    if (!partial || field in data) {
      const value = data[field];
      const maximum = field === "title" ? 150 : 2000;

      if (
        typeof value !== "string" ||
        !value.trim() ||
        value.trim().length > maximum
      ) {
        return `${field} is required and must be ${maximum} characters or fewer.`;
      }
    }
  }

  if (!partial || "category" in data) {
    if (
      typeof data.category !== "string" ||
      !categories.includes(data.category)
    ) {
      return "Category must be Work, Personal, Urgent or Important.";
    }
  }

  if (!partial || "dueDate" in data) {
    const value = data.dueDate;

    if (
      typeof value !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
      return "Due date must use YYYY-MM-DD.";
    }

    const parsed = new Date(`${value}T00:00:00.000Z`);

    if (
      Number.isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== value
    ) {
      return "Please provide a valid calendar date.";
    }

    if (value < getToday()) {
      return "Due date cannot be in the past.";
    }
  }

  if ("completed" in data && typeof data.completed !== "boolean") {
    return "Completed must be true or false.";
  }

  return null;
}