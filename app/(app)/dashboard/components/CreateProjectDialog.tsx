"use client";

import { createProject, updateProject } from "@/app/lib/project-api";
import { useEffect, useRef, useState } from "react";
import { Project } from "@/app/types/project";

import styles from "./Dialog.module.css";

export default function CreateProjectDialog({
  openDialog,
  closeDialog,
  project,
}: {
  openDialog: boolean;
  closeDialog: (project?: Project) => void;
  project?: Project;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contributors, setContributors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (openDialog) {
      ref.current?.showModal();
      if (project) {
        setName(project.name);
        setDescription(project.description ?? "");
        setContributors(project.members.map((m) => m.id));
      }
    } else {
      ref.current?.close();
    }
  }, [openDialog]);

  async function createProjectHandler(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (project) {
        const updated = await updateProject({
          ...project,
          ...{
            name,
            description,
            contributors,
          },
        });

        if (updated.success) {
          closeDialog(updated.data.project);
        } else {
          setError(updated.message || "Erreur la mise à jour du projet");
        }
      } else {
        const created = await createProject({
          name,
          description,
          contributors,
        });

        if (created.success) {
          closeDialog(created.data.project);
        } else {
          setError(created.message || "Erreur lors de la création du projet");
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

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
            {project ? "Modifier" : "Créer un projet"}
          </h1>

          <form className={styles.form}>
            <label className={styles.label}>Titre*</label>
            <input
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            w<label className={styles.label}>Description*</label>
            <input
              className={styles.input}
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <label className={styles.label}>Contributeurs</label>
            <select
              className={styles.select}
              name="contributors"
              id="contributors"
              multiple
            >
              <option value="">Choisir un ou plusieurs collaborateurs</option>
            </select>
            <button
              type="button"
              className={styles.submitButton}
              disabled={!name || !description || loading}
              onClick={createProjectHandler}
            >
              {project ? "Enregistrer" : "Ajouter un projet"}
            </button>
            {error && <span className={styles.error}>{error}</span>}
            {loading && <span className={styles.loading}>Chargement...</span>}
          </form>
        </div>
      </dialog>
    );
  }
}
