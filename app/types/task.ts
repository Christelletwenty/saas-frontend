import { ApiSuccess } from "../lib/api";
import { User } from "./auth";
import { Project } from "./project";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
export type StatusFilter = "ALL" | TaskStatus;

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  creatorId: string;
  creator?: User;
  project?: Project;
  comments?: Comment[];
  assignees?: {
    id: string;
    assignedAt: Date;
    user: User;
  }[];
};

export type TaskComment = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    email: string;
    name: string | null;
  };
};

export type GetCommentsResponse = ApiSuccess<{ comments: TaskComment[] }>;
export type CreateTaskResponse = ApiSuccess<{ task: Task }>;
export type CreateCommentResponse = ApiSuccess<{ comment: TaskComment }>;
export type AssignedTasksResponse = ApiSuccess<{ tasks: Task[] }>;
