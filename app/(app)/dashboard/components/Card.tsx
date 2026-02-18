"use client";

import { DashboardTask } from "@/app/types/dashborad";
import styles from "../dashboard.module.css";

type TaskProps = {
  task: DashboardTask;
};

function formatDate(date: string | null): string {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function viweDetail(taskId: string): void {
  alert("Vous avez sélectionné la tache " + taskId);
}

export default function Card({ task }: TaskProps) {
  return (
    <article key={task.id} className={styles.taskRow}>
      <div className={styles.taskMain}>
        <div className={styles.taskTop}>
          <div>
            <h3 className={styles.taskName}>{task.title}</h3>
            <p className={styles.taskDesc}>
              {task.description ?? "Description de la tâche"}
            </p>
          </div>

          <span
            className={`${styles.status} ${
              task.status === "TODO"
                ? styles.todo
                : task.status === "IN_PROGRESS"
                  ? styles.inProgress
                  : styles.done
            }`}
          >
            {task.status === "TODO" && "À faire"}
            {task.status === "IN_PROGRESS" && "En cours"}
            {task.status === "DONE" && "Terminé"}
            {task.status === "CANCELLED" && "Annulé"}
          </span>
        </div>
        <div className={styles.meta}>
          <div>
            <span>
              <img src="/folder-dashboard.svg" alt="Folder dashboard icon" />{" "}
              {task.project?.name}
            </span>
            <span>
              <img src="/calendar.svg" alt="Calendar icon" />{" "}
              {formatDate(task.dueDate)}
            </span>
            <span>
              {" "}
              <img src="/comments.svg" alt="Comments icon" />
              {task.comments?.length ?? 0}
            </span>
          </div>

          <button
            className={styles.viewButton}
            onClick={() => viweDetail(task.id)}
          >
            Voir
          </button>
        </div>
      </div>
    </article>
  );
}
