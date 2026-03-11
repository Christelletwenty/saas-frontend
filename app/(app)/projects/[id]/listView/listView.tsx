"use client";
import { Task, TaskComment } from "@/app/types/task";
import styles from "../projectDetail.module.css";
import { useEffect, useState } from "react";
import { createComment, getCommentsByTaskId } from "@/app/lib/task-api";

type TaskProps = {
  projectId: string;
  tasks: Task[];
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
};

export default function ListView({
  projectId,
  tasks,
  onDelete,
  onEdit,
}: TaskProps) {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [commentsOpen, setCommentsOpen] = useState<string | null>(null);
  const [commentsByTaskId, setCommentsByTaskId] = useState<
    Record<string, TaskComment[]>
  >({});
  const [countsByTaskId, setCountsByTaskId] = useState<Record<string, number>>(
    {},
  );
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    let cancelled = false;

    const loadComments = async () => {
      await Promise.all(
        tasks.map(async (task) => {
          try {
            const commentsResponse = await getCommentsByTaskId(
              projectId,
              task.id,
            );
            const comments = commentsResponse.data.comments;

            if (cancelled) return;

            setCountsByTaskId((prev) => ({
              ...prev,
              [task.id]: comments.length,
            }));

            setCommentsByTaskId((prev) => ({
              ...prev,
              [task.id]: comments,
            }));
          } catch (error) {
            console.error("Erreur chargement commentaires :", error);

            if (cancelled) return;

            setCountsByTaskId((prev) => ({
              ...prev,
              [task.id]: 0,
            }));
          }
        }),
      );
    };

    void loadComments();

    return () => {
      cancelled = true;
    };
  }, [projectId, tasks]);

  const handleCreateComment = async (taskId: string) => {
    if (!content.trim()) return;

    try {
      const response = await createComment(projectId, taskId, content);

      const newComment = response.data.comment;

      setCommentsByTaskId((prev) => ({
        ...prev,
        [taskId]: [...(prev[taskId] ?? []), newComment],
      }));

      setCountsByTaskId((prev) => ({
        ...prev,
        [taskId]: (prev[taskId] ?? 0) + 1,
      }));

      setContent("");
    } catch (error) {
      console.error("Erreur création commentaire :", error);
    }
  };

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
                  Commentaires ({countsByTaskId[task.id] ?? 0})
                </span>
                <button
                  className={styles.chevronBtn}
                  type="button"
                  aria-label="Ouvrir"
                  onClick={() =>
                    setCommentsOpen(commentsOpen === task.id ? null : task.id)
                  }
                >
                  {commentsOpen === task.id ? "˅" : "˄"}
                </button>
              </div>
              {commentsOpen === task.id && (
                <div className={styles.commentsSection}>
                  <div className={styles.commentsHeader}></div>

                  <div className={styles.commentsContainer}>
                    {(commentsByTaskId[task.id]?.length ?? 0) > 0 ? (
                      commentsByTaskId[task.id]!.map((comment) => (
                        <div key={comment.id} className={styles.commentRow}>
                          <div className={styles.avatar}>
                            {getUserInitials(comment.author?.name ?? "")}
                          </div>

                          <div className={styles.commentCard}>
                            <div className={styles.commentTop}>
                              <span className={styles.commentAuthor}>
                                {comment.author?.name ?? "Utilisateur inconnu"}
                              </span>
                            </div>

                            <p className={styles.commentContent}>
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className={styles.emptyState}>Aucun commentaire</p>
                    )}

                    <div className={styles.commentRow}>
                      <div
                        className={`${styles.avatar} ${styles.currentUserAvatar}`}
                      >
                        AD
                      </div>

                      <div className={styles.inputCard}>
                        <textarea
                          className={styles.commentTextarea}
                          placeholder="Ajouter un commentaire..."
                          rows={4}
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className={styles.actions}>
                      <button
                        className={styles.sendButton}
                        type="button"
                        onClick={() => void handleCreateComment(task.id)}
                      >
                        Envoyer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
