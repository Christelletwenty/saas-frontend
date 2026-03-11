import {
  CreateCommentResponse,
  CreateTaskResponse,
  GetCommentsResponse,
  Task,
  TaskComment,
} from "../types/task";
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

export function getCommentsByTaskId(
  projectId: string,
  taskId: string,
): Promise<GetCommentsResponse> {
  return apiFetch<GetCommentsResponse>(
    `/projects/${projectId}/tasks/${taskId}/comments`,
    {
      method: "GET",
      auth: true,
    },
  );
}

export function createComment(
  projectId: string,
  taskId: string,
  content: string,
): Promise<CreateCommentResponse> {
  return apiFetch<CreateCommentResponse>(
    `/projects/${projectId}/tasks/${taskId}/comments`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify({ content }),
    },
  );
}
