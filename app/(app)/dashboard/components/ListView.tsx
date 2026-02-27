"use client";
import { useMemo, useState } from "react";
import styles from "../dashboard.module.css";
import Card from "./Card";
import { Task } from "@/app/types/task";

type TaskProps = {
  tasks: Task[];
};

export default function ListView({ tasks }: TaskProps) {
  const [query, setQuery] = useState("");

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;

    return tasks.filter((t) => {
      const name = t.title?.toLowerCase() ?? "";
      const desc = t.description?.toLowerCase() ?? "";
      const projectName = t.project?.name?.toLowerCase() ?? "";
      return name.includes(q) || desc.includes(q) || projectName.includes(q);
    });
  }, [tasks, query]);

  const previewTasks = useMemo(
    () => filteredTasks, //.slice(0, 6),
    [filteredTasks],
  );

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <h2 className={styles.panelTitle}>Mes tâches assignées</h2>
          <p className={styles.panelSubtitle}>Par ordre de priorité</p>
        </div>

        <div className={styles.search}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Rechercher une tâche"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
      </div>

      {/* TODO : A PARTIR DE LA ON MET DANS UN COMPOSANT  */}
      {/* TODO : AVEC UN PROPS DE LA LISTE DES TACHES  */}
      {/* TODO : ET ON CREERA UN AUTRE COMPOSANT POUR LE KANBAN  */}
      {previewTasks.length === 0 ? (
        <p className={styles.empty}>Aucune tâche trouvée.</p>
      ) : (
        <div className={styles.list}>
          {previewTasks.map((task) => (
            <Card task={task} />
          ))}
        </div>
      )}
    </section>
  );
}
