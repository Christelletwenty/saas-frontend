import { User } from "./auth";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";

export type DashboardComment = {
  id: string;
  content: string;
  createdAt: string;
  author: User;
};

export type DashboardProject = {
  id: string;
  name: string;
  description: string | null;
};

export type DashboardTask = {
  id: string;
  name: string;
  description: string;
  dueDate: string | null;
  priority: Priority;
  status: TaskStatus;
  project: DashboardProject;
  comments: DashboardComment[];
};

export type ApiSuccess<TData> = {
  succes?: boolean;
  message?: string;
  data: TData;
};

export type AssignedTasksResponse = ApiSuccess<{ tasks: DashboardTask[] }>;

export type DashboardStats = {
  tasks: {
    total: number;
    urgent: number;
    overdue: number;
    byStatus: Record<string, number>;
  };
  projects: {
    total: number;
  };
};

export type DashboardStatsResponse = ApiSuccess<{ stats: DashboardStats }>;
