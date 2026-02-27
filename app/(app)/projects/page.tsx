"use client";

import { getProjects } from "@/app/lib/project-api";
import { Project } from "@/app/types/project";
import Link from "next/link";
import styles from "./projects.module.css";
import { useEffect, useState } from "react";
import { getProfile } from "@/app/lib/auth-api";
import CreateProjectDialog from "../dashboard/components/CreateProjectDialog";

export default function projectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState<string | null>(null);
  const [modal, setModal] = useState(false);

  function Account() {
    const [userInitials, setUserInitials] = useState<string | null>(null);

    const getUserInitials = (userName: string): string => {
      return userName
        .split(" ")
        .map((c) => c[0])
        .join("");
    };

    useEffect(() => {
      (async () => {
        try {
          const userRes = await getProfile();
          setUserInitials(getUserInitials(userRes.data.user.name ?? ""));
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Erreur inconnue";
          console.error(msg);
          setUserInitials("N/C");
        } finally {
        }
      })();
    }, []);
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getProjects();
        const p = response.data.projects;

        setProjects(p);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erreur inconnue";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function closeDialog(project?: Project) {
    if (project) {
      // TODO: Du coup on fait quoi de ça ?
      // On liste les tâches pas les projets dans cet écran...
      // Un toast peut être ?
      // Ou alors rediriger sur les projets ?
    }
    setModal(false);
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Mes projets</h1>
          <span className={styles.subtitle}>Gérez vos projets</span>
        </div>

        <button onClick={() => setModal(true)} className={styles.primaryButton}>
          + Créer un projet
        </button>
        <CreateProjectDialog
          openDialog={modal}
          closeDialog={(p) => closeDialog(p)}
        />
      </header>

      <section className={styles.content}>
        {projects.length === 0 ? (
          <p className={styles.empty}>Aucun projet trouvé.</p>
        ) : (
          <div className={styles.grid}>
            {projects.map((project) => {
              const totalTasks = project.tasks?.length ?? 0;

              const members = project.members ?? [];

              return (
                <article key={project.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <h2 className={styles.cardTitle}>
                      <Link
                        className={styles.cardLink}
                        href={`/projects/${project.id}`}
                      >
                        {project.name}
                      </Link>
                    </h2>

                    <p className={styles.cardDescription}>
                      {project.description}
                    </p>
                  </div>

                  <div className={styles.progressBlock}>
                    <div className={styles.progressHeader}>
                      <span className={styles.progressLabel}>Progression</span>
                      <span className={styles.progressValue}>
                        Ou c'est la progression?
                      </span>
                    </div>

                    <div
                      className={styles.progressBar}
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>

                  <div className={styles.teamBlock}>
                    <div className={styles.teamHeader}>
                      <span className={styles.teamIcon} aria-hidden="true">
                        👥
                      </span>
                      <span className={styles.teamLabel}>
                        Équipe ({members.length})
                      </span>
                      <span>{userInitials}</span>
                      <span>{project.userRole}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
