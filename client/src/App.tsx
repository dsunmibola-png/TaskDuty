import { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import MyTasks from "./Pages/MyTasks";
import TaskForm from "./Pages/TaskForm";
import EditTask from "./Pages/EditTask";
import Auth from "./Pages/Auth";

import {
  createTask,
  fetchTasks,
  patchTask,
  removeTask,
} from "./lib/api";

import type { Task, TaskInput } from "./types/task";

const TOKEN_KEY = "taskduty-token";

function readToken(): string {
  try {
    return sessionStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}

function App() {
  const [token, setToken] = useState(readToken);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();

    setIsLoading(true);
    setLoadError("");

    fetchTasks(token, "", controller.signal)
      .then((loadedTasks) => {
        if (!controller.signal.aborted) {
          setTasks(loadedTasks);
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load tasks.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [token, retryCount]);

  function handleAuthenticated(newToken: string) {
    try {
      sessionStorage.setItem(TOKEN_KEY, newToken);
    } catch {
      // Login still works for this page session.
    }

    setTasks([]);
    setLoadError("");
    setIsLoading(true);
    setToken(newToken);
  }

  function logout() {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      // Clear the in-memory session even if storage is unavailable.
    }

    setToken("");
    setTasks([]);
    setLoadError("");
  }

  const searchTasks = useCallback(
    (search: string, signal: AbortSignal) =>
      fetchTasks(token, search, signal),
    [token],
  );

  async function addTask(input: TaskInput): Promise<void> {
    const savedTask = await createTask(token, input);
    setTasks((previous) => [savedTask, ...previous]);
  }

  async function updateTask(
    id: string,
    changes: TaskInput,
  ): Promise<void> {
    const savedTask = await patchTask(token, id, changes);

    setTasks((previous) =>
      previous.map((task) => (task.id === id ? savedTask : task)),
    );
  }

  async function deleteTask(id: string): Promise<void> {
    await removeTask(token, id);

    setTasks((previous) => previous.filter((task) => task.id !== id));
  }

  async function toggleTask(id: string): Promise<void> {
    const currentTask = tasks.find((task) => task.id === id);

    if (!currentTask) {
      throw new Error("Task not found.");
    }

    const savedTask = await patchTask(token, id, {
      completed: !currentTask.completed,
    });

    setTasks((previous) =>
      previous.map((task) => (task.id === id ? savedTask : task)),
    );
  }

  return (
    <BrowserRouter>
      <Navbar />

      {token && (
        <div className="mx-auto flex max-w-5xl justify-end px-5 pt-4 sm:px-8">
          <button
            type="button"
            onClick={logout}
            className="text-sm text-[#974fd0] underline"
          >
            Log out
          </button>
        </div>
      )}

      {!token ? (
        <Auth onAuthenticated={handleAuthenticated} />
      ) : isLoading ? (
        <p role="status" className="px-5 py-12 text-center">
          Loading your tasks...
        </p>
      ) : loadError ? (
        <div className="px-5 py-12 text-center">
          <p role="alert" className="text-red-600">
            {loadError}
          </p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="mt-4 text-[#974fd0] underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/tasks"
            element={
              <MyTasks
                tasks={tasks}
                onSearchTasks={searchTasks}
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
      )}
    </BrowserRouter>
  );
}

export default App;