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

  // useMemo permet d'éviter de recalculer le filtrage à chaque rendu
  const filteredTasks = useMemo(() => {
    // On nettoie la recherche et on la met en minuscule
    const q = query.trim().toLowerCase();
    // Si la recherche est vide on retourne directement toutes les tâches
    if (!q) return tasks;
    // Sinon on filtre les tâches en vérifiant si le titre, la description ou le nom du projet contiennent la recherche
    // Le "?. " évite les erreurs si une valeur est undefined
    return tasks.filter((t) => {
      const name = t.title?.toLowerCase() ?? "";
      const desc = t.description?.toLowerCase() ?? "";
      const projectName = t.project?.name?.toLowerCase() ?? "";
      return name.includes(q) || desc.includes(q) || projectName.includes(q);
    });
  }, [tasks, query]);

  // Ici useMemo est utilisé simplement pour mémoriser filteredTasks
  const previewTasks = useMemo(() => filteredTasks, [filteredTasks]);

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <h2 className={styles.panelTitle}>Mes tâches assignées</h2>
          <p className={styles.panelSubtitle}>Par ordre de priorité</p>
        </div>

        <div className={styles.search}>
          <label htmlFor="search" className="sr-only">
            Rechercher une tâche
          </label>
          <input
            className={styles.searchInput}
            type="text"
            id="search"
            placeholder="Rechercher une tâche"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
      </div>

      {previewTasks.length === 0 ? (
        <p className={styles.empty}>Aucune tâche trouvée.</p>
      ) : (
        <div className={styles.list}>
          {previewTasks.map((task) => (
            <Card key={task.id} task={task} />
          ))}
        </div>
      )}
    </section>
  );
}
