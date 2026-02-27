"use client";
import { getProjectById } from "@/app/lib/project-api";
import { Project, ProjectMember } from "@/app/types/project";
import Link from "next/link";
import styles from "./projectDetail.module.css";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Task } from "@/app/types/task";
import { User } from "@/app/types/auth";
import TaskDialog from "../../dashboard/components/TaskDialog";

export default function projectsDetail() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [project, setProject] = useState<Project>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState<Task>();
  const [userId, setUserId] = useState<ProjectMember>();
  const [user, setUser] = useState<User>();
  const [modal, setModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getProjectById(id);
        const p = res.data.project;

        (setProject(p), setTasks(tasks), setUserId(userId));
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
      // TODO: Du coup on fait quoi de ça ?
      // On liste les tâches pas les projets dans cet écran...
      // Un toast peut être ?
      // Ou alors rediriger sur les projets ?
    }
    setModal(false);
  }

  return (
    <main className={styles.page}>
      {/* Header */}
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
            <button className={styles.editLink} type="button">
              Modifier
            </button>
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
            task={null}
          />
          <button className={styles.aiButton} type="button">
            ✦ IA
          </button>
        </div>
      </header>

      {/* Contributors bar */}
      <section className={styles.contributorsBar}>
        <div className={styles.contributorsLeft}>
          <span>Contributeurs</span>
          <span className={styles.contributorsTitle}>
            {project?.members.length}
          </span>
          <span className={styles.contributorsCount}>personnes</span>
        </div>

        <div className={styles.contributorsRight}>
          <span className={`${styles.avatar} ${styles.avatarPrimary}`}>AD</span>
          <span className={styles.rolePill}>Propriétaire</span>

          <span className={styles.avatar}>BD</span>
          <span className={styles.namePill}>Bertrand Dupont</span>

          <span className={styles.avatar}>AD</span>
          <span className={styles.namePill}>Anne Dupont</span>
        </div>
      </section>

      {/* Tasks panel */}
      <section className={styles.tasksPanel}>
        <div className={styles.tasksHeader}>
          <div className={styles.tasksHeaderLeft}>
            <h2 className={styles.tasksTitle}>Tâches</h2>
            <span className={styles.tasksSubtitle}>Par ordre de priorité</span>
          </div>

          <div className={styles.tasksControls}>
            <div className={styles.viewTabs}>
              <button
                className={`${styles.tabButton} ${styles.tabActive}`}
                type="button"
              >
                <img src="/list.svg" alt="Liste icon" />
                Liste
              </button>
              <button className={styles.tabButton} type="button">
                <img src="/union.svg" alt="Liste icon" />
                Calendrier
              </button>
            </div>

            <select className={styles.select} title="Statut" defaultValue="all">
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
              />
              <span className={styles.searchIcon} aria-hidden="true">
                🔍
              </span>
            </div>
          </div>
        </div>

        <div className={styles.tasksList}>
          {/* Tu remplaces ça par ton render de tâches */}
          <article className={styles.taskCard}>
            <div className={styles.taskTop}>
              <div className={styles.taskTitleRow}>
                <h3 className={styles.taskTitle}>Authentification JWT</h3>
                <button
                  type="button"
                  className={styles.moreBtn}
                  onClick={() => setOpen((v) => !v)}
                >
                  ...
                </button>
                <span className={`${styles.statusPill} ${styles.statusTodo}`}>
                  À faire
                </span>
              </div>

              <p className={styles.taskDesc}>
                Implémenter le système d&apos;authentification avec tokens JWT
              </p>
            </div>

            <div className={styles.taskMeta}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Échéance :</span>
                <span className={styles.metaValue}>📅 9 mars</span>
              </div>

              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Assigné à :</span>
                {tasks?.assignees?.map((assignee) => {
                  const assigneeName = assignee.user.name;
                  return (
                    <div className={styles.assignees}>
                      <span className={styles.avatar}>BD</span>
                      <span className={styles.namePill}>{assigneeName}</span>
                    </div>
                  );
                })}
              </div>
              <div className={styles.taskFooter}>
                <span className={styles.comments}>Commentaires (1)</span>
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
        </div>
      </section>
    </main>
  );
}
