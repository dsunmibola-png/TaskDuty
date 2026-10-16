import type { Task, TaskInput } from "../types/task";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL?.trim() || "/api"
).replace(/\/+$/, "");

interface ServerTask extends Omit<Task, "id"> {
  _id: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface TaskResponse {
  task: ServerTask;
}

interface TasksResponse {
  tasks: ServerTask[];
}

async function request<T>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error(
      `The server returned an unexpected response (${response.status}). Please try again.`,
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed (${response.status}).`,
    );
  }

  return data as T;
}

function toTask(task: ServerTask): Task {
  return {
    id: task._id,
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    category: task.category,
    completed: task.completed,
  };
}

export async function authenticate(
  mode: "login" | "register",
  input: {
    name?: string;
    email: string;
    password: string;
  },
): Promise<AuthResponse> {
  return request<AuthResponse>(`/auth/${mode}`, "", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchTasks(
  token: string,
  search = "",
  signal?: AbortSignal,
): Promise<Task[]> {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set("search", search.trim());
  }

  const query = params.toString();

  const data = await request<TasksResponse>(
    `/tasks${query ? `?${query}` : ""}`,
    token,
    { signal },
  );

  return data.tasks.map(toTask);
}

export async function createTask(
  token: string,
  input: TaskInput,
): Promise<Task> {
  const data = await request<TaskResponse>("/tasks", token, {
    method: "POST",
    body: JSON.stringify(input),
  });

  return toTask(data.task);
}

export async function patchTask(
  token: string,
  id: string,
  changes: Partial<TaskInput> & { completed?: boolean },
): Promise<Task> {
  const data = await request<TaskResponse>(
    `/tasks/${id}`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify(changes),
    },
  );

  return toTask(data.task);
}

export async function removeTask(
  token: string,
  id: string,
): Promise<void> {
  await request(`/tasks/${id}`, token, {
    method: "DELETE",
  });
}