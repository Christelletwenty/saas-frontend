"use client";

import { Priority, Task, TaskStatus } from "@/app/types/task";
import { useEffect, useRef, useState } from "react";
import styles from "./Dialog.module.css";

type TaskFormState = {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  assigneeIds: string[];
};

export default function IaCreateTaskDialog({
  openDialog,
  closeDialog,
  task,
}: {
  openDialog: boolean;
  closeDialog: (task?: Partial<Task>) => void;
  task?: Task;
}) {
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDialogElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState<TaskFormState>({
    title: "",
    description: "",
    dueDate: "",
    priority: "MEDIUM",
    status: "TODO",
    assigneeIds: [],
  });

  useEffect(() => {
    if (openDialog) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openDialog]);

  function handleLoader() {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      closeDialog({
        title: "Tâche de test avec IA",
        description: "Description générée par l'IA",
        dueDate: new Date().toISOString(),
        priority: "LOW",
        status: "TODO",
      });
    }, 3000);
  }

  return (
    <dialog ref={ref} className={styles.dialog} onCancel={() => closeDialog()}>
      <div className={styles.container}>
        <button
          onClick={() => closeDialog()}
          className={styles.closeButton}
          type="button"
          aria-label="Fermer"
        >
          ✕
        </button>

        <h1 className={styles.title}>
          <span className={styles.titleIcon}>✦</span>
          <span>Créer une tâche</span>
        </h1>

        <div className={styles.loaderWrapper}>
          {isLoading && <span className={styles.loader}></span>}
        </div>
        <div className={styles.inputCard}>
          <textarea
            className={styles.commentTextarea}
            name="task-description"
            rows={4}
            placeholder="Décrivez les tâches que vous souhaitez ajouter..."
          />
          <button
            onClick={(e) => handleLoader()}
            className={styles.aiButton}
            type="button"
            aria-label="Créer avec IA"
          >
            <img src="/IA_button.svg" alt="" />
          </button>
        </div>
      </div>
    </dialog>
  );
}
