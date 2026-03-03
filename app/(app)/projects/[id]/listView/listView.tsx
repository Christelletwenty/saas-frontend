"use client";
import { Task } from "@/app/types/task";
import styles from "../projectDetail.module.css";
import { useState } from "react";

type TaskProps = {
  tasks: Task[];
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
};

export default function ListView({ tasks, onDelete, onEdit }: TaskProps) {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const deleteTaskById = (taskId: string) => {
    onDelete(taskId);
    setMenuOpenId(null);
  };

  const createOrUpdateTask = (task: Task) => {
    onEdit(task);
    setMenuOpenId(null);
  };

  const getUserInitials = (userName: string): string => {
    return userName
      .split(" ")
      .map((c) => c[0])
      .join("");
  };

  return (
    <div className={styles.tasksList}>
      {/* TODO : Si sucune tache, afficher un div "aucune tache dans ce projet */}
      {tasks?.map((task) => {
        return (
          <article className={styles.taskCard}>
            <div className={styles.taskTop}>
              <div className={styles.taskTitleRow}>
                <h3 className={styles.taskTitle}>
                  {task.title}
                  <span className={`${styles.statusPill} ${styles.statusTodo}`}>
                    {task.status}
                  </span>
                </h3>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <button
                    type="button"
                    className={styles.moreBtn}
                    onClick={() => setMenuOpenId(menuOpenId ? null : task.id)}
                  >
                    ...
                  </button>
                  {menuOpenId === task.id && (
                    <div className={styles.dropdownStyle}>
                      <button
                        onClick={() => createOrUpdateTask(task)}
                        className={styles.menuItem}
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => deleteTaskById(task.id)}
                        className={styles.menuItem}
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p className={styles.taskDesc}>{task.description}</p>
            </div>

            <div className={styles.taskMeta}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Échéance :</span>
                <span className={styles.metaValue}>📅 9 mars</span>
              </div>

              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Assigné à :</span>
                {task?.assignees?.map((assignee) => {
                  const assigneeName = assignee.user.name;
                  return (
                    <div className={styles.assignees}>
                      <span className={styles.avatar}>
                        {getUserInitials(assigneeName ?? "")}
                      </span>
                      <span className={styles.namePill}>{assigneeName}</span>
                    </div>
                  );
                })}
              </div>
              <div className={styles.taskFooter}>
                <span className={styles.comments}>
                  Commentaires ({task.comments?.length ?? 0})
                </span>
                <button
                  className={styles.chevronBtn}
                  type="button"
                  aria-label="Ouvrir"
                >
                  ˄
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
