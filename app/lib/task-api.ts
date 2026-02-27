import { CreateTaskResponse, Task } from "../types/task";
import { apiFetch } from "./api";

export function createOrUpdateTask(
  payload: Partial<Task> & { assigneesIds?: string[] },
): Promise<CreateTaskResponse> {
  const method = payload.id ? "PUT" : "POST";
  const url = payload.id ? `/tasks/${payload.id}` : "/tasks";

  return apiFetch<CreateTaskResponse>(url, {
    method: method,
    auth: true,
    body: JSON.stringify(payload),
  });
}

export function deleteTask(id: string) {}
