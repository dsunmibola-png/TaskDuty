import { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import MyTasks from "./Pages/MyTasks";
import TaskForm from "./Pages/TaskForm";
import EditTask from "./Pages/EditTask";

import { categories } from "./types/task";
import type { Task, TaskInput } from "./types/task";

const STORAGE_KEY = "taskduty-tasks";

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const task = value as Record<string, unknown>;

  return (
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.description === "string" &&
    typeof task.dueDate === "string" &&
    categories.some((category) => category === task.category) &&
    typeof task.completed === "boolean"
  );
}

function loadTasks(): Task[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed: unknown = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed.filter(isTask) : [];
  } catch {
    return [];
  }
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      setStorageError("");
    } catch {
      setStorageError(
        "Your tasks could not be saved in this browser. Changes may be lost after refreshing.",
      );
    }
  }, [tasks]);

  function addTask(input: TaskInput) {
    const newTask: Task = {
      ...input,
      id: crypto.randomUUID(),
      completed: false,
    };

    setTasks((previousTasks) => [newTask, ...previousTasks]);
  }

  function updateTask(id: string, changes: TaskInput) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id ? { ...task, ...changes } : task,
      ),
    );
  }

  function deleteTask(id: string) {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id),
    );
  }

  function toggleTask(id: string) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task,
      ),
    );
  }

  return (
    <BrowserRouter>
      <Navbar />

      {storageError && (
        <p
          role="alert"
          className="mx-auto max-w-5xl px-5 pt-4 text-sm text-red-600 sm:px-8"
        >
          {storageError}
        </p>
      )}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/tasks"
          element={
            <MyTasks
              tasks={tasks}
              onDeleteTask={deleteTask}
              onToggleTask={toggleTask}
            />
          }
        />

        <Route
          path="/tasks/new"
          element={<TaskForm key="new-task" onSave={addTask} />}
        />

        <Route
          path="/tasks/:id/edit"
          element={
            <EditTask tasks={tasks} onUpdateTask={updateTask} />
          }
        />

        <Route
          path="*"
          element={
            <main className="px-5 py-16 text-center">
              <h1 className="text-3xl font-semibold">
                Page not found
              </h1>

              <p className="mt-3 text-gray-500">
                The page you are looking for does not exist.
              </p>

              <Link
                to="/"
                className="mt-5 inline-block text-[#974fd0] underline"
              >
                Back to home
              </Link>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;