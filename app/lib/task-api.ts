import { CreateTaskResponse, Task } from "../types/task";
import { apiFetch } from "./api";

export function createOrUpdateTask(
  projectId: string,
  payload: Partial<Task> & { assigneesIds?: string[] },
): Promise<CreateTaskResponse> {
  const method = payload.id ? "PUT" : "POST";
  let url = `/projects/${projectId}`;
  url += payload.id ? `/tasks/${payload.id}` : "/tasks";

  return apiFetch<CreateTaskResponse>(url, {
    method: method,
    auth: true,
    body: JSON.stringify(payload),
  });
}

export function deleteTaskById(
  projectId: string,
  taskId: string,
): Promise<void> {
  return apiFetch<void>(`/projects/${projectId}/tasks/${taskId}`, {
    method: "DELETE",
    auth: true,
  });
}
