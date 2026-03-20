"use client";

import { useEffect, useRef, useState } from "react";
import { deleteProject } from "@/app/lib/project-api";

import styles from "./Dialog.module.css";
import { Project } from "@/app/types/project";

export default function DeleteProjectDialog({
  openDialog,
  closeDialog,
  project,
}: {
  openDialog: boolean;
  closeDialog: (deleted?: boolean) => void;
  project?: Project;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (openDialog) {
      ref.current?.showModal();
      if (project) {
        // réinitialise la confirmation de suppression lorsque le projet change ou que la fenêtre s'ouvre
        setConfirmDelete(false);
      }
    } else {
      ref.current?.close();
    }
  }, [openDialog, project]);

  async function deleteProjectHandler() {
    if (!project) {
      // sécurité : si aucun projet n'est fourni
      setError("Projet introuvable");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const deleted = await deleteProject(project.id);

      if (deleted.success) {
        closeDialog(true);
      } else {
        setError(deleted.message || "Erreur lors de la suppression du projet");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <dialog ref={ref} onCancel={() => closeDialog()} className={styles.dialog}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Etes-vous sûr de vouloir supprimer ce projet ?
        </h1>
        <button
          disabled={loading}
          onClick={deleteProjectHandler}
          className={styles.submitButton}
          type="button"
        >
          Supprimer
        </button>
        <button
          onClick={() => closeDialog()}
          className={styles.submitButton}
          type="button"
        >
          Annuler
        </button>
        {error && <span className={styles.error}>{error}</span>}
        {loading && <span className={styles.loading}>Chargement...</span>}
      </div>
    </dialog>
  );
}
