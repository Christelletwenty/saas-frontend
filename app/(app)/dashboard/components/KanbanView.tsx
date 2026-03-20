"use client";

import { Task } from "@/app/types/task";
import styles from "../dashboard.module.css";
import Card from "./Card";

type KanbanProps = {
  tasks: Task[];
};

export default function KanbanView({ tasks }: KanbanProps) {
  return (
    <section className={`${styles.panel} ${styles.dashboard}`}>
      {tasks.length === 0 ? (
        <p className={styles.empty}>Aucune tâche trouvée.</p>
      ) : (
        <>
          <div className={styles.list}>
            <div className={styles.count}>
              À faire{" "}
              <div className={styles.totalCount}>
                {tasks.filter((task) => task.status === "TODO").length}
              </div>
            </div>
            {tasks
              .filter((task) => task.status === "TODO")
              .map((task) => (
                <Card key={task.id} task={task} />
              ))}
          </div>
          <div className={styles.list}>
            <div className={styles.count}>
              En cours{" "}
              <div className={styles.totalCount}>
                {tasks.filter((task) => task.status === "IN_PROGRESS").length}
              </div>
            </div>
            {tasks
              .filter((task) => task.status === "IN_PROGRESS")
              .map((task) => (
                <Card key={task.id} task={task} />
              ))}
          </div>
          <div className={styles.list}>
            <div className={styles.count}>
              Terminées
              <div className={styles.totalCount}>
                {tasks.filter((task) => task.status === "DONE").length}
              </div>
            </div>
            {tasks
              .filter((task) => task.status === "DONE")
              .map((task) => (
                <Card key={task.id} task={task} />
              ))}
          </div>
        </>
      )}
    </section>
  );
}
