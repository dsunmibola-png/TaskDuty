import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { categories } from "../types/task";
import type { Task } from "../types/task";

interface MyTasksProps {
  tasks: Task[];
  onSearchTasks: (
    search: string,
    signal: AbortSignal,
  ) => Promise<Task[]>;
  onDeleteTask: (id: string) => Promise<void>;
  onToggleTask: (id: string) => Promise<void>;
}

const categoryColors = {
  Work: "text-blue-700",
  Personal: "text-green-700",
  Urgent: "text-red-600",
  Important: "text-purple-700",
};

function MyTasks({
  tasks,
  onSearchTasks,
  onDeleteTask,
  onToggleTask,
}: MyTasksProps) {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Task[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [actionError, setActionError] = useState("");
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(
    null,
  );
  const [searchRetry, setSearchRetry] = useState(0);

  useEffect(() => {
    const query = searchQuery.trim();

    setSearchError("");

    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();

    setIsSearching(true);

    const timeout = window.setTimeout(async () => {
      try {
        const results = await onSearchTasks(
          query,
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setSearchResults(results);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setSearchResults([]);
          setSearchError(
            error instanceof Error
              ? error.message
              : "Search failed. Please try again.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [searchQuery, tasks, onSearchTasks, searchRetry]);

  const visibleTasks = searchQuery.trim() ? searchResults : tasks;

  const filteredTasks = visibleTasks.filter((task) => {
    const matchesCategory =
      categoryFilter === "All" || task.category === categoryFilter;

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Completed" && task.completed) ||
      (statusFilter === "Incomplete" && !task.completed);

    return matchesCategory && matchesStatus;
  });

  const selectClass =
    "w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 outline-none focus:border-[#974fd0] focus:ring-2 focus:ring-purple-100";

  function clearFilters() {
    setSearchQuery("");
    setSearchError("");
    setIsSearching(false);
    setCategoryFilter("All");
    setStatusFilter("All");
  }

  async function handleDelete(task: Task) {
    if (pendingTaskId) return;

    const confirmed = window.confirm(
      `Delete "${task.title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setActionError("");
    setPendingTaskId(task.id);

    try {
      await onDeleteTask(task.id);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to delete task.",
      );
    } finally {
      setPendingTaskId(null);
    }
  }

  async function handleToggle(id: string) {
    if (pendingTaskId) return;

    setActionError("");
    setPendingTaskId(id);

    try {
      await onToggleTask(id);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to update task.",
      );
    } finally {
      setPendingTaskId(null);
    }
  }

  return (
    <main
      id="tasks-top"
      className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-12"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">My Tasks</h1>

        <Link
          to="/tasks/new"
          className="inline-flex items-center gap-2 font-medium text-[#974fd0] hover:underline"
        >
          <Plus size={18} aria-hidden="true" />
          Add New Task
        </Link>
      </div>

      <div className="mt-8">
        <label
          htmlFor="task-search"
          className="mb-2 block text-sm font-medium"
        >
          Search tasks
        </label>

        <input
          id="task-search"
          type="search"
          value={searchQuery}
          maxLength={200}
          onChange={(event) => {
            const value = event.target.value;

            setSearchQuery(value);
            setSearchError("");
            setIsSearching(Boolean(value.trim()));
          }}
          placeholder="Search by title or description..."
          className={selectClass}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="category-filter"
            className="mb-2 block text-sm font-medium"
          >
            Filter by category
          </label>

          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            className={selectClass}
          >
            <option value="All">All categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="status-filter"
            className="mb-2 block text-sm font-medium"
          >
            Filter by status
          </label>

          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className={selectClass}
          >
            <option value="All">All statuses</option>
            <option value="Incomplete">Incomplete</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm text-gray-500">
          {isSearching
            ? "Searching..."
            : searchError
              ? "Search unavailable."
              : `Showing ${filteredTasks.length} of ${tasks.length} tasks`}
        </p>

        {(searchQuery ||
          categoryFilter !== "All" ||
          statusFilter !== "All") && (
          <button
            type="button"
            onClick={clearFilters}
            className="cursor-pointer text-sm text-[#974fd0] underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {actionError && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {actionError}
        </p>
      )}

      {isSearching ? (
        <p className="mt-8 text-gray-500">
          Finding matching tasks...
        </p>
      ) : searchError ? (
        <div className="mt-8">
          <p role="alert" className="text-red-600">
            {searchError}
          </p>

          <button
            type="button"
            onClick={() => {
              setSearchError("");
              setIsSearching(true);
              setSearchRetry((count) => count + 1);
            }}
            className="mt-3 cursor-pointer text-[#974fd0] underline"
          >
            Try search again
          </button>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-purple-200 px-6 py-12 text-center">
          <h2 className="text-xl font-medium">
            {tasks.length === 0 ? "No tasks yet" : "No matching tasks"}
          </h2>

          <p className="mt-2 text-gray-500">
            {tasks.length === 0
              ? "Create your first task to get started."
              : "Try a different search, category, or completion status."}
          </p>

          {tasks.length === 0 ? (
            <Link
              to="/tasks/new"
              className="mt-5 inline-block rounded-md bg-[#974fd0] px-5 py-3 text-white hover:bg-[#803db7]"
            >
              Create a Task
            </Link>
          ) : (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 cursor-pointer text-[#974fd0] underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <ul className="mt-6 space-y-6">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              aria-busy={pendingTaskId === task.id}
              className="rounded-lg border border-gray-200 p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
                <span
                  className={`text-sm font-medium ${
                    categoryColors[task.category]
                  }`}
                >
                  {task.category}
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/tasks/${task.id}/edit`}
                    aria-label={`Edit ${task.title}`}
                    className="inline-flex items-center gap-2 rounded-md bg-[#974fd0] px-3 py-2 text-sm text-white hover:bg-[#803db7]"
                  >
                    <Pencil size={15} aria-hidden="true" />
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => void handleDelete(task)}
                    disabled={pendingTaskId !== null}
                    aria-label={`Delete ${task.title}`}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-[#974fd0] px-3 py-2 text-sm text-[#974fd0] hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={15} aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </div>

              <h2
                className={`mt-3 text-xl font-medium wrap-break-word ${
                  task.completed ? "text-gray-500 line-through" : ""
                }`}
              >
                {task.title}
              </h2>

              <p className="mt-2 whitespace-pre-wrap text-gray-500 wrap-break-word">
                {task.description}
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Due:{" "}
                  <time dateTime={task.dueDate}>
                    {new Date(
                      `${task.dueDate}T00:00:00`,
                    ).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </p>

                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => void handleToggle(task.id)}
                    disabled={pendingTaskId !== null}
                    aria-label={`Mark ${task.title} as ${
                      task.completed ? "incomplete" : "completed"
                    }`}
                    className="h-4 w-4 accent-[#974fd0] disabled:cursor-not-allowed"
                  />

                  {pendingTaskId === task.id
                    ? "Updating..."
                    : task.completed
                      ? "Completed"
                      : "Mark complete"}
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 text-center">
        <a href="#tasks-top" className="text-[#974fd0] underline">
          Back to Top
        </a>
      </div>
    </main>
  );
}

export default MyTasks;