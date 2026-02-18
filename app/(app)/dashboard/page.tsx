"use client";

import { getProfile } from "@/app/lib/auth-api";
import { getAssignedTasks, getDashboardStats } from "@/app/lib/dashboard-api";
import { User } from "@/app/types/auth";
import { DashboardStats, DashboardTask } from "@/app/types/dashborad";
import { useEffect, useMemo, useState } from "react";
import styles from "./dashboard.module.css";
import ListView from "./components/ListView";
import KanbanView from "./components/KanbanView";

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
  const [isListActive, setIsListActive] = useState<boolean>(true);

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

  if (loading) {
    return (
      <main className={styles.page}>
        <p>Chargement...</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Tableau de bord</h1>
          <p className={styles.subtitle}>
            Bonjour <strong>{user?.name}</strong>, voici un aperçu de vos
            projets et tâches
          </p>
        </div>

        <button className={styles.primaryButton}>+ Créer un projet</button>
      </div>

      {/* VIEW SWITCH */}
      <div className={styles.viewSwitch}>
        <button
          className={`${styles.viewBtn} ${isListActive ? styles.viewBtnActive : ""}`}
          onClick={() => setIsListActive(true)}
        >
          <img src="/list.svg" alt="List icon" /> Liste
        </button>

        <button
          className={`${styles.viewBtn} ${!isListActive ? styles.viewBtnActive : ""}`}
          onClick={() => setIsListActive(false)}
        >
          {" "}
          <img src="/kanban.svg" alt="Kanban icon" /> Kanban
        </button>
      </div>
      {/* LIST */}
      {isListActive ? <ListView tasks={tasks} /> : <KanbanView tasks={tasks} />}
    </main>
  );
}
