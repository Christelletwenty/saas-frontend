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
  closeDialog: (task?: Task) => void;
  task?: Task;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDialogElement>(null);

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

  return (
    <dialog ref={ref} className={styles.dialog}>
      <div className={styles.container}>
        <h1 className={styles.title}>DIALOG IA</h1>
      </div>
    </dialog>
  );
}
