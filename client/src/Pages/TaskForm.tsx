import { useState } from "react";
import type { FormEvent } from "react";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { categories } from "../types/task";
import type { Category, TaskInput } from "../types/task";

interface TaskFormProps {
  initialTask?: TaskInput;
  onSave: (task: TaskInput) => void;
}

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function TaskForm({ initialTask, onSave }: TaskFormProps) {
  const navigate = useNavigate();
  const isEditing = Boolean(initialTask);

  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(
    initialTask?.description ?? "",
  );
  const [dueDate, setDueDate] = useState(initialTask?.dueDate ?? "");
  const [category, setCategory] = useState<Category | "">(
    initialTask?.category ?? "",
  );
  const [error, setError] = useState("");

  const inputClass =
    "w-full rounded-md border border-gray-300 bg-transparent px-4 py-3 outline-none focus:border-[#974fd0] focus:ring-2 focus:ring-purple-100";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !description.trim() || !dueDate || !category) {
      setError("Please complete all fields.");
      return;
    }

    if (dueDate < getToday()) {
      setError("The due date cannot be in the past.");
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      category,
    });

    navigate("/tasks");
  }

  return (
    <main
      id="form-top"
      className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-12"
    >
      <div className="flex items-center gap-2">
        <Link
          to="/tasks"
          aria-label="Back to my tasks"
          className="rounded p-1 hover:bg-purple-100"
        >
          <ChevronLeft size={30} aria-hidden="true" />
        </Link>

        <h1 className="text-3xl font-semibold">
          {isEditing ? "Edit Task" : "New Task"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-7">
        <div>
          <label
            htmlFor="title"
            className="mb-2 block font-medium text-gray-600"
          >
            Task Title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="E.g. Complete internship project"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block font-medium text-gray-600"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Briefly describe your task..."
            rows={6}
            className={`${inputClass} resize-y`}
            required
          />
        </div>

        <div className="grid gap-7 sm:grid-cols-2">
          <div>
            <label
              htmlFor="category"
              className="mb-2 block font-medium text-gray-600"
            >
              Category
            </label>

            <select
              id="category"
              name="category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as Category | "")
              }
              className={inputClass}
              required
            >
              <option value="" disabled>
                Select a category
              </option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="mb-2 block font-medium text-gray-600"
            >
              Due Date
            </label>

            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={dueDate}
              min={getToday()}
              onChange={(event) => setDueDate(event.target.value)}
              className={`${inputClass} min-w-0`}
              required
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full cursor-pointer rounded-md bg-[#974fd0] px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-[#803db7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-600"
        >
          {isEditing ? "Save Changes" : "Done"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <a href="#form-top" className="text-[#974fd0] underline">
          Back to Top
        </a>
      </div>
    </main>
  );
}

export default TaskForm;