"use client";

import { createProject, updateProject } from "@/app/lib/project-api";
import { useEffect, useId, useRef, useState } from "react";
import { Project } from "@/app/types/project";

import styles from "./Dialog.module.css";
import { User } from "@/app/types/auth";
import { getUsers } from "@/app/lib/user-api";

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
  const [possibleContributors, setPossibleContributors] = useState<
    Partial<User>[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDialogElement>(null);

  const uniqid = useId();
  console.log("uniqid", uniqid);

  useEffect(() => {
    // Fonction auto-exécutée asynchrone car useEffect ne peut pas être async directement.
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const contributors = await getUsers();

        setPossibleContributors(contributors);
        // On stocke ces utilisateurs dans le state pour ensuite les afficher comme contributeurs possibles.
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erreur inconnue";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  useEffect(() => {
    if (openDialog) {
      ref.current?.showModal();
      if (project) {
        // Si un projet est fourni, on pré-remplit le champ nom.
        setName(project.name);
        setDescription(project.description ?? "");
        // On pré-remplit la description. ?? "" permet de mettre une chaîne vide si la description est absente.
        setContributors(project.members.map((m) => m.id));
        // On récupère les IDs des membres du projet existant
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
        // Si project existe, on est en mode modification.
        const updated = await updateProject({
          // On repart de l'objet projet existant
          ...project,
          ...{
            name,
            description,
            contributors,
          },
          // On écrase avec les nouvelles valeurs du formulaire.
        });

        if (updated.success) {
          closeDialog(updated.data.project);
        } else {
          setError(updated.message || "Erreur la mise à jour du projet");
        }
      } else {
        // Mode création
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
            <label
              htmlFor={`createProjectTitle-${uniqid}`}
              className={styles.label}
            >
              Titre*
            </label>
            <input
              className={styles.input}
              type="text"
              id={`createProjectTitle-${uniqid}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label
              htmlFor={`createProjectDescription-${uniqid}`}
              className={styles.label}
            >
              Description*
            </label>
            <input
              className={styles.input}
              type="text"
              id={`createProjectDescription-${uniqid}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <label
              htmlFor={`createProjectContributors-${uniqid}`}
              className={styles.label}
            >
              Contributeurs
            </label>
            <select
              className={styles.select}
              name="contributors"
              id={`createProjectContributors-${uniqid}`}
              onChange={(e) => {
                setContributors([...contributors, e.target.value]);
              }}
            >
              <option value="">Choisir un ou plusieurs collaborateurs</option>
              {possibleContributors
                .filter((c) => !contributors.includes(c.email!))
                .map((c) => (
                  <option value={c.email} key={c.email}>
                    {c.name}
                  </option>
                ))}
            </select>
            <div className={styles.contributors}>
              {contributors.map((c) => (
                <button
                  className={styles.contributor}
                  key={`contrib-${c}`}
                  type="button"
                  onClick={() =>
                    setContributors(contributors.filter((con) => con !== c))
                  }
                >
                  {c} <span>x</span>
                </button>
              ))}
            </div>
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
