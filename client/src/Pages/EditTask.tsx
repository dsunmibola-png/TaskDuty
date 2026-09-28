import { Link, useParams } from "react-router-dom";
import TaskForm from "./TaskForm";
import type { Task, TaskInput } from "../types/task";

interface EditTaskProps {
  tasks: Task[];
  onUpdateTask: (id: string, changes: TaskInput) => void;
}

function EditTask({ tasks, onUpdateTask }: EditTaskProps) {
  const { id } = useParams();
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <h1 className="text-3xl font-semibold">Task not found</h1>

        <p className="mt-3 text-gray-500">
          This task may have been deleted.
        </p>

        <Link
          to="/tasks"
          className="mt-5 inline-block text-[#974fd0] underline"
        >
          Back to My Tasks
        </Link>
      </main>
    );
  }

  return (
    <TaskForm
      key={task.id}
      initialTask={task}
      onSave={(changes) => onUpdateTask(task.id, changes)}
    />
  );
}

export default EditTask;