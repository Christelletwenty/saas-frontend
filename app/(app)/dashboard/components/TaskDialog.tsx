"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./Dialog.module.css";
import { createOrUpdateTask, getCommentsByTaskId } from "@/app/lib/task-api";
import { Priority, Task, TaskComment, TaskStatus } from "@/app/types/task";
import { Project } from "@/app/types/project";

type TaskFormState = {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  assigneeIds: string[];
};

export default function TaskDialog({
  project,
  task,
  openDialog,
  closeDialog,
  readonly,
}: {
  project: Project;
  task: Task | null;
  openDialog: boolean;
  closeDialog: (task?: Task) => void;
  readonly?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const ref = useRef<HTMLDialogElement>(null);
  const [commentsByTaskId, setCommentsByTaskId] = useState<
    Record<string, TaskComment[]>
  >({});

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
      setProjectId(project.id);
    } else {
      ref.current?.close();
    }
  }, [openDialog]);

  useEffect(() => {
    if (!openDialog) return;

    setError(null);

    if (task) {
      setForm({
        title: task.title ?? "",
        description: task.description ?? "",
        dueDate: new Intl.DateTimeFormat("fr-CA").format(
          new Date(task.dueDate ?? ""),
        ),
        priority: task.priority,
        status: task.status,
        assigneeIds: task.assignees?.map((a) => a.user.id) ?? [],
      });
    } else {
      setForm({
        title: "",
        description: "",
        dueDate: "",
        priority: "MEDIUM",
        status: "TODO",
        assigneeIds: [],
      });
    }
  }, [task, openDialog]);

  useEffect(() => {
    if (!openDialog || !task || !project.id) return;

    let cancelled = false;

    const loadComments = async () => {
      try {
        const commentsResponse = await getCommentsByTaskId(project.id, task.id);
        const comments = commentsResponse.data.comments;

        if (cancelled) return;

        setCommentsByTaskId((prev) => ({
          ...prev,
          [task.id]: comments,
        }));
      } catch (error) {
        console.error("Erreur chargement commentaires :", error);

        if (cancelled) return;

        setCommentsByTaskId((prev) => ({
          ...prev,
          [task.id]: [],
        }));
      }
    };

    void loadComments();

    return () => {
      cancelled = true;
    };
  }, [openDialog, project.id, task]);

  function handleAssigneesChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const ids = Array.from(e.target.selectedOptions).map((o) => o.value);
    setForm((prev) => ({ ...prev, assigneeIds: ids }));
  }

  async function createTaskHandler(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!projectId) {
      setError("Le projectId ne peut pas être null");
      return;
    }

    const payload = {
      ...form,
      dueDate: new Date(form.dueDate).toISOString(),
    };

    try {
      const created = await createOrUpdateTask(projectId, payload);
      console.log("Tâche créé :", created);

      if (created.success) {
        closeDialog(created.data.task);
      } else {
        setError(created.message || "Erreur lors de la création du projet");
      }
      setLoading(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const canSubmit =
    !!(form as any).title?.trim() &&
    !!(form as any).description?.trim() &&
    !loading;

  const getUserInitials = (userName: string): string => {
    return userName
      .split(" ")
      .map((c) => c[0])
      .join("");
  };

  {
    return (
      <dialog
        ref={ref}
        onCancel={() => closeDialog()}
        className={styles.dialog}
      >
        <div className={styles.container}>
          <button
            onClick={() => closeDialog()}
            className={styles.closeButton}
            type="button"
          >
            ✕
          </button>
          <h1 className={styles.title}>
            {readonly
              ? "Détails de la tâche"
              : task
                ? "Modifier la tâche"
                : "Créer une tâche"}
          </h1>

          <form className={styles.form}>
            <label className={styles.label}>Titre*</label>
            <input
              disabled={readonly}
              className={styles.input}
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
            />

            <label className={styles.label}>Description*</label>
            <input
              disabled={readonly}
              className={styles.input}
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
            />

            <label className={styles.label}>Échéance</label>
            <input
              disabled={readonly}
              className={styles.input}
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                setForm(
                  (p) => ({ ...p, dueDate: e.target.value || null }) as any,
                )
              }
            />
            <div className={styles.commentsContainer}>
              <h2 className={styles.label}>Commentaires</h2>
              {task && (commentsByTaskId[task.id]?.length ?? 0) > 0 ? (
                commentsByTaskId[task.id]!.map((comment) => (
                  <div key={comment.id} className={styles.commentRow}>
                    <div className={styles.avatar}>
                      {getUserInitials(comment.author?.name ?? "")}
                    </div>

                    <div className={styles.commentCard}>
                      <div className={styles.commentTop}>
                        <span className={styles.commentAuthor}>
                          {comment.author.name ?? "Utilisateur inconnu"}
                        </span>
                      </div>

                      <p className={styles.commentContent}>{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.emptyState}>Aucun commentaire</p>
              )}
            </div>

            <label className={styles.label}>Assigné à</label>
            <select
              className={styles.select}
              multiple
              value={((form as any).assigneeIds ?? []) as string[]}
              onChange={handleAssigneesChange}
            >
              {task?.assignees?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.user.name || c.user.email}
                </option>
              ))}
            </select>

            {/* STATUS (RADIOS) */}
            <label className={styles.label}>Statut</label>
            <div
              className={styles.statusGroup}
              role="radiogroup"
              aria-label="Statut"
            >
              <label className={styles.statusPill}>
                <input
                  disabled={readonly}
                  type="radio"
                  name="status"
                  value="TODO"
                  checked={((form as any).status as TaskStatus) === "TODO"}
                  onChange={() =>
                    setForm((p) => ({ ...p, status: "TODO" }) as any)
                  }
                />
                <span>À faire</span>
              </label>

              <label className={styles.statusPill}>
                <input
                  disabled={readonly}
                  type="radio"
                  name="status"
                  value="IN_PROGRESS"
                  checked={
                    ((form as any).status as TaskStatus) === "IN_PROGRESS"
                  }
                  onChange={() =>
                    setForm((p) => ({ ...p, status: "IN_PROGRESS" }) as any)
                  }
                />
                <span>En cours</span>
              </label>

              <label className={styles.statusPill}>
                <input
                  disabled={readonly}
                  type="radio"
                  name="status"
                  value="DONE"
                  checked={((form as any).status as TaskStatus) === "DONE"}
                  onChange={() =>
                    setForm((p) => ({ ...p, status: "DONE" }) as any)
                  }
                />
                <span>Terminée</span>
              </label>
            </div>
            {!readonly && (
              <button
                type="submit"
                className={styles.submitButton}
                disabled={!canSubmit}
                onClick={createTaskHandler}
              >
                {task ? "Enregistrer" : "Créer"}
              </button>
            )}
            {error && <span className={styles.error}>{error}</span>}
            {loading && <span className={styles.loading}>Chargement...</span>}
          </form>
        </div>
      </dialog>
    );
  }
}
