"use client";

import { getProfile } from "@/app/lib/auth-api";
import { getAssignedTasks, getDashboardStats } from "@/app/lib/dashboard-api";
import { User } from "@/app/types/auth";
import { DashboardStats, DashboardTask } from "@/app/types/dashborad";
import { useEffect, useMemo, useState } from "react";

function formatDate(date: string | null): string {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function priorityLabel(p: DashboardTask["priority"]): string {
  if (p === "URGENT") return "Urgent";
  if (p === "HIGH") return "Haute";
  if (p === "MEDIUM") return "Moyenne";
  if (p === "LOW") return "Faible";
  return "Basse";
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [tasksRes, statsRes, userRes] = await Promise.all([
          getAssignedTasks(),
          getDashboardStats(),
          getProfile(),
        ]);

        setTasks(tasksRes.data.tasks);
        setStats(statsRes.data.stats);
        setUser(userRes.data.user);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erreur inconnue";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const previewTasks = useMemo(() => tasks.slice(0.6), [tasks]);

  if (loading) {
    return <div>{user?.name}</div>;
  }
}
