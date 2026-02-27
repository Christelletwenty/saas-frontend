"use client";

import { createProject } from "@/app/lib/project-api";
import { useEffect, useRef, useState } from "react";
import { Project } from "@/app/types/project";

import styles from "./Dialog.module.css";

export default function CreateProjectDialog({
  openDialog,
  closeDialog,
}: {
  openDialog: boolean;
  closeDialog: (project?: Project) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contributors, setContributors] = useState<string[]>([]);
  const [save, setSave] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (openDialog) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openDialog]);

  async function createProjectHandler(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
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
      setLoading(false);
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

          <h1 className={styles.title}>Créer un projet</h1>

          <form className={styles.form}>
            <label className={styles.label}>Titre*</label>
            <input
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className={styles.label}>Description*</label>
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
            >
              <option value="">Choisir un ou plusieurs collaborateurs</option>
            </select>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={!name || !description || loading}
              onSubmit={createProjectHandler}
            >
              Ajouter un projet
            </button>
            {error && <span className={styles.error}>{error}</span>}
            {loading && <span className={styles.loading}>Chargement...</span>}
          </form>
        </div>
      </dialog>
    );
  }
}
