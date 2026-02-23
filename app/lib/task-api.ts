import { createDashboardTaskResponse, DashboardTask } from "../types/dashborad";
import { apiFetch } from "./api";

export function createOrUpdateTask(
  payload: Partial<DashboardTask> & { assigneesIds?: string[] },
): Promise<createDashboardTaskResponse> {
  const method = payload.id ? "PUT" : "POST";
  const url = payload.id ? `/tasks/${payload.id}` : "/tasks";

  return apiFetch<createDashboardTaskResponse>(url, {
    method: method,
    auth: true,
    body: JSON.stringify(payload),
  });
}
