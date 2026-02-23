import { ApiSuccess } from "../lib/api";

export type Project = {
  id: string;
  name: string;
  description: string | null;
};

export type CreateProjectBody = {
  name: string;
  description: string;
  contributors?: string[];
};

export type createProjectResponse = ApiSuccess<{ project: Project }>;
