"use client";
import { getProjectById } from "@/app/lib/project-api";
import { Project } from "@/app/types/project";
import Link from "next/link";
import styles from "./projectDetail.module.css";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Task } from "@/app/types/task";
import TaskDialog from "../../dashboard/components/TaskDialog";
import ListView from "./listView/listView";
import CalendarView from "./calendarView/calendarView";
import CreateProjectDialog from "../../dashboard/components/CreateProjectDialog";
import { deleteTaskById } from "@/app/lib/task-api";

export default function projectsDetail() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [query, setQuery] = useState("");
  const [project, setProject] = useState<Project>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modal, setModal] = useState(false);
  const [isListActive, setIsListActive] = useState<boolean>(true);
  const [createProjectModal, setCreateProjectModal] = useState(false);

  const getUserInitials = (userName: string): string => {
    return userName
      .split(" ")
      .map((c) => c[0])
      .join("");
  };

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;

    return tasks?.filter((t) => {
      const name = t.title?.toLowerCase() ?? "";
      const desc = t.description?.toLowerCase() ?? "";
      const projectName = t.project?.name?.toLowerCase() ?? "";
      return name.includes(q) || desc.includes(q) || projectName.includes(q);
    });
  }, [tasks, query]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getProjectById(id);
        const p = res.data.project;

        setProject(p);
        setTasks(p.tasks);
      } catch (err) {
        // si jamais ça arrive (token invalide), AuthGate va aussi redirect
        const msg = err instanceof Error ? err.message : "Erreur inconnue";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function closeDialog(task?: Task) {
    if (task) {
      tasks?.push(task);
    }
    setSelectedTask(null);
    setModal(false);
  }

  function closeCreateProjectDialog(p?: Project) {
    if (p) {
      setProject(p);
    }
    setCreateProjectModal(false);
  }

  async function deleteTask(taskId: string): Promise<void> {
    if (project?.id) {
      try {
        await deleteTaskById(project.id, taskId);

        const prev = tasks ?? [];
        setTasks(prev.filter((t) => t.id !== taskId));
      } catch (err) {
        // setError() // todo
      }
    } else {
      setError("Pas de projet sélectionné ?");
    }
  }

  return (
    <main className={styles.page}>
      {/* Header */}
      {!project ? (
        <div className="empty">
          <img src="/page-not-found.svg" alt="404 not found" />
        </div>
      ) : (
        <>
          <header className={styles.topHeader}>
            <div className={styles.backWrapper}>
              <Link
                className={styles.backButton}
                href="/projects"
                aria-label="Retour à la liste"
              >
                ←
              </Link>
            </div>
            <div className={styles.headerMain}>
              <div className={styles.titleRow}>
                <h1 className={styles.title}>{project?.name}</h1>
                <button
                  onClick={() => setCreateProjectModal(true)}
                  className={styles.editLink}
                  type="button"
                >
                  Modifier
                </button>
                <CreateProjectDialog
                  project={project}
                  openDialog={createProjectModal}
                  closeDialog={(p) => closeCreateProjectDialog(p)}
                />
              </div>

              <p className={styles.description}>{project?.description}</p>
            </div>

            <div className={styles.headerActions}>
              <button
                onClick={() => setModal(true)}
                className={styles.primaryButton}
                type="button"
              >
                Créer une tâche
              </button>
              <TaskDialog
                openDialog={modal}
                closeDialog={closeDialog}
                task={selectedTask ?? null}
                project={project}
              />
              <button className={styles.aiButton} type="button">
                ✦ IA
              </button>
            </div>
          </header>

          <section className={styles.contributorsBar}>
            <div className={styles.contributorsLeft}>
              <span>Contributeurs</span>
              <span className={styles.contributorsTitle}>
                {project?.members.length}
              </span>
              <span className={styles.contributorsCount}>personnes</span>
            </div>

            <div className={styles.contributorsRight}>
              <span className={`${styles.avatar} ${styles.avatarPrimary}`}>
                {getUserInitials(project?.owner.name ?? "")}
              </span>
              <span className={styles.rolePill}>Propriétaire</span>

              {project?.members.map((member) => {
                return (
                  <>
                    <span className={styles.avatar}>
                      {getUserInitials(member.user.name ?? "")}
                    </span>
                    <span className={styles.namePill}>{member.user.name}</span>
                  </>
                );
              })}
            </div>
          </section>

          <section className={styles.tasksPanel}>
            <div className={styles.tasksHeader}>
              <div className={styles.tasksHeaderLeft}>
                <h2 className={styles.tasksTitle}>Tâches</h2>
                <span className={styles.tasksSubtitle}>
                  Par ordre de priorité
                </span>
              </div>

              <div className={styles.tasksControls}>
                <div className={styles.viewTabs}>
                  <button
                    className={`${styles.tabButton} ${isListActive ? styles.tabActive : ""}`}
                    type="button"
                    onClick={() => setIsListActive(true)}
                  >
                    <img src="/list.svg" alt="Liste icon" />
                    Liste
                  </button>

                  <button
                    className={`${styles.tabButton} ${!isListActive ? styles.tabActive : ""}`}
                    type="button"
                    onClick={() => setIsListActive(false)}
                  >
                    <img src="/union.svg" alt="Liste icon" />
                    Calendrier
                  </button>
                </div>

                <select
                  className={styles.select}
                  title="Statut"
                  defaultValue="all"
                >
                  <option value="all">Statut</option>
                  <option value="todo">À faire</option>
                  <option value="doing">En cours</option>
                  <option value="done">Terminée</option>
                </select>

                <div className={styles.search}>
                  <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="Rechercher une tâche"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <span className={styles.searchIcon} aria-hidden="true">
                    🔍
                  </span>
                </div>
              </div>
            </div>

            {!filteredTasks || filteredTasks.length === 0 ? (
              <div className={styles.empty}>
                <p>Aucune tâche trouvée</p>
                <img src="/not-found.svg" alt="Non trouvé" />
              </div>
            ) : (
              <>
                {isListActive ? (
                  <ListView
                    tasks={filteredTasks!}
                    onDelete={(taskId) => deleteTask(taskId)}
                    onEdit={(t) => {
                      setSelectedTask(t);
                      setModal(true);
                    }}
                  />
                ) : (
                  <CalendarView />
                )}
              </>
            )}
          </section>
        </>
      )}
    </main>
  );
}
