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
  const { category, completed } = req.query;

  const filter: {
    owner: string;
    category?: string;
    completed?: boolean;
  } = {
    owner: res.locals.userId,
  };

  if (category !== undefined) {
    if (
      typeof category !== "string" ||
      !categories.includes(category)
    ) {
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