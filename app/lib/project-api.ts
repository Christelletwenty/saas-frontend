import {
  CreateProjectBody,
  CreateProjectResponse,
  createProjectResponse,
  GetProjectResponse,
  GetProjectsResponse,
  Project,
} from "../types/project";
import { apiFetch, ApiSuccess } from "./api";

export function createProject(
  payload: CreateProjectBody,
): Promise<createProjectResponse> {
  return apiFetch<createProjectResponse>("/projects", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export function updateProject(
  payload: Project,
): Promise<CreateProjectResponse> {
  return apiFetch<createProjectResponse>(`/projects/${payload.id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export function getProjects(): Promise<GetProjectsResponse> {
  return apiFetch<GetProjectsResponse>("/projects", {
    method: "GET",
    auth: true,
  });
}

export function getProjectById(id: string): Promise<GetProjectResponse> {
  return apiFetch<GetProjectResponse>(`/projects/${id}`, {
    method: "GET",
    auth: true,
  });
}

export function deleteProject(id: string): Promise<ApiSuccess<void>> {
  return apiFetch<ApiSuccess<void>>(`/projects/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
