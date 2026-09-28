export const categories = ["Work", "Personal", "Urgent", "Important"] as const;

export type Category = (typeof categories)[number];

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  category: Category;
  completed: boolean;
}

export type TaskInput = Omit<Task, "id" | "completed">;