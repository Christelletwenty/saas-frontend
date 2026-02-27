import { ApiSuccess } from "../lib/api";

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
