"use client";

import { DashboardTask } from "@/app/types/dashborad";
import styles from "../dashboard.module.css";
import Card from "./Card";

type KanbanProps = {
  tasks: DashboardTask[];
};

export default function KanbanView({ tasks }: KanbanProps) {
  return (
    <section className={`${styles.panel} ${styles.dashboard}`}>
      {tasks.length === 0 ? (
        <p className={styles.empty}>Aucune tâche trouvée.</p>
      ) : (
        <>
          <div className={styles.list}>
            {tasks
              .filter((task) => task.status === "TODO")
              .map((task) => (
                <Card task={task} />
              ))}
          </div>
          <div className={styles.list}>
            {tasks
              .filter((task) => task.status === "IN_PROGRESS")
              .map((task) => (
                <Card task={task} />
              ))}
          </div>
          <div className={styles.list}>
            {tasks
              .filter((task) => task.status === "DONE")
              .map((task) => (
                <Card task={task} />
              ))}
          </div>
        </>
      )}
    </section>
  );
}
