import {
  AssignedTasksResponse,
  DashboardStatsResponse,
} from "../types/dashborad";
import { apiFetch } from "./api";

export function getDashboardStats(): Promise<DashboardStatsResponse> {
  return apiFetch<DashboardStatsResponse>("/dashboard/stats", {
    method: "GET",
    auth: true,
  });
}

export function getAssignedTasks(): Promise<AssignedTasksResponse> {
  return apiFetch<AssignedTasksResponse>("/dashboard/assigned-tasks", {
    method: "GET",
    auth: true,
  });
}
