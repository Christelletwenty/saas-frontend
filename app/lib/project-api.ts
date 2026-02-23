import { CreateProjectBody, createProjectResponse } from "../types/project";
import { apiFetch } from "./api";

export function createProject(
  payload: CreateProjectBody,
): Promise<createProjectResponse> {
  return apiFetch<createProjectResponse>("/projects", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}
