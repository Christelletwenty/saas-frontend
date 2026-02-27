import { ApiSuccess } from "../lib/api";
import { User } from "./auth";
import { Task } from "./task";

export type UserProjectRole = "OWNER" | "ADMIN" | "CONTRIBUTOR";

export type ProjectMember = {
  id: string;
  role: UserProjectRole;
  joinedAt: string;
  userId: string;
  projectId: string;
  user: User;
};

export type ProjectCount = {
  tasks: number;
};

export type Project = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner: User;
  members: ProjectMember[];
  _count: ProjectCount;
  userRole?: UserProjectRole;
  tasks?: Task[];
};

export type CreateProjectBody = {
  name: string;
  description?: string;
  contributors?: string[];
};

export type createProjectResponse = ApiSuccess<{ project: Project }>;

export type UpdateProjectBody = {
  name?: string;
  description?: string | null;
};

export type AddContributorBody = {
  email: string;
  role?: UserProjectRole;
};

export type CreateProjectResponse = ApiSuccess<{ project: Project }>;
export type GetProjectsResponse = ApiSuccess<{ projects: Project[] }>;
export type GetProjectResponse = ApiSuccess<{ project: Project }>;
