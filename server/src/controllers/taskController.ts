import type { RequestHandler } from "express";
import Task, { categories } from "../models/Task.js";
import { validateTask } from "../utils/validateTask.js";

export const createTask: RequestHandler = async (req, res) => {
  const error = validateTask(req.body);

  if (error) {
    res.status(400).json({ success: false, message: error });
    return;
  }

  const { title, description, dueDate, category, completed } = req.body;

  const task = await Task.create({
    title,
    description,
    dueDate,
    category,
    completed: completed ?? false,
    owner: res.locals.userId,
  });

  res.status(201).json({
    success: true,
    message: "Task created successfully.",
    task,
  });
};

export const getTasks: RequestHandler = async (req, res) => {
  const { category, completed, search } = req.query;

  const filter: {
    owner: string;
    category?: string;
    completed?: boolean;
    $or?: Array<{ title: RegExp } | { description: RegExp }>;
  } = {
    owner: res.locals.userId,
  };

  if (search !== undefined) {
    if (typeof search !== "string") {
      res.status(400).json({
        success: false,
        message: "Search must be a string.",
      });
      return;
    }

    const trimmedSearch = search.trim();

    if (trimmedSearch.length > 200) {
      res.status(400).json({
        success: false,
        message: "Search must not exceed 200 characters.",
      });
      return;
    }

    if (trimmedSearch) {
      // Treat special characters as ordinary search text.
      const escapedSearch = trimmedSearch.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );

      const pattern = new RegExp(escapedSearch, "i");

      filter.$or = [{ title: pattern }, { description: pattern }];
    }
  }

  if (category !== undefined) {
    if (typeof category !== "string" || !categories.includes(category)) {
      res.status(400).json({
        success: false,
        message: "Invalid category filter.",
      });
      return;
    }

    filter.category = category;
  }

  if (completed !== undefined) {
    if (completed !== "true" && completed !== "false") {
      res.status(400).json({
        success: false,
        message: "Completed filter must be true or false.",
      });
      return;
    }

    filter.completed = completed === "true";
  }

  const tasks = await Task.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    tasks,
  });
};

export const getTask: RequestHandler = async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    owner: res.locals.userId,
  });

  if (!task) {
    res.status(404).json({
      success: false,
      message: "Task not found.",
    });
    return;
  }

  res.status(200).json({ success: true, task });
};

export const updateTask: RequestHandler = async (req, res) => {
  const error = validateTask(req.body, true);

  if (error) {
    res.status(400).json({ success: false, message: error });
    return;
  }

  const task = await Task.findOneAndUpdate(
    {
      _id: req.params.id,
      owner: res.locals.userId,
    },
    { $set: req.body },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!task) {
    res.status(404).json({
      success: false,
      message: "Task not found.",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Task updated successfully.",
    task,
  });
};

export const deleteTask: RequestHandler = async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    owner: res.locals.userId,
  });

  if (!task) {
    res.status(404).json({
      success: false,
      message: "Task not found.",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Task deleted successfully.",
  });
};
