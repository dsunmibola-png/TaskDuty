import { Schema, model } from "mongoose";

export const categories = [
  "Work",
  "Personal",
  "Urgent",
  "Important",
];

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    dueDate: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: categories,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
      index: true,
    },
  },
  { timestamps: true },
);

const Task = model("Task", taskSchema);

export default Task;