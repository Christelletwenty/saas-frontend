"use client";

import { useRouter } from "next/navigation";
import { User } from "../../types/auth";
import { useEffect, useMemo, useState } from "react";
import { clearToken, getToken } from "../../lib/auth";
import { getProfile, updatePassword, updateProfile } from "../../lib/auth-api";
import styles from "./profile.module.css";

type FormState = {
  name: string;
  email: string;

  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const profileChanged = useMemo(() => {
    if (!user) return false;
    const nameChanged = (form.name ?? "") !== (user.name ?? "");
    const emailChanged = form.email !== user.email;
    return nameChanged || emailChanged;
  }, [form.name, form.email, user]);

  const passwordSectionTouched = useMemo(() => {
    return Boolean(
      form.currentPassword || form.newPassword || form.confirmNewPassword,
    );
  }, [form.currentPassword, form.newPassword, form.confirmNewPassword]);

  // Guard + load profile
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const res = await getProfile();
        const u = res.data.user;

        setUser(u);
        setForm((f) => ({
          ...f,
          name: u.name ?? "",
          email: u.email,
        }));
      } catch {
        clearToken();
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!user) return;

    // Validation password (si section utilisée)
    if (passwordSectionTouched) {
      if (
        !form.currentPassword ||
        !form.newPassword ||
        !form.confirmNewPassword
      ) {
        setError("Pour changer le mot de passe, remplis tous les champs.");
        return;
      }
      if (form.newPassword !== form.confirmNewPassword) {
        setError("Les nouveaux mots de passe ne correspondent pas.");
        return;
      }
    }

    // Si rien à sauver, on ne spam pas l’API
    if (!profileChanged && !passwordSectionTouched) {
      setMessage("Aucune modification à enregistrer.");
      return;
    }

    setSaving(true);
    try {
      // On exécute 1 ou 2 requêtes selon ce qui a changé
      let profileMsg: string | null = null;
      let passwordMsg: string | null = null;

      if (profileChanged) {
        const res = await updateProfile({
          name: form.name,
          email: form.email,
        });

        const updated = res.data.user;
        setUser(updated);

        // on resynchronise le form avec ce que renvoie le backend
        setForm((f) => ({
          ...f,
          name: updated.name ?? "",
          email: updated.email,
        }));

        profileMsg = res.message ?? "Profil mis à jour.";
      }

      if (passwordSectionTouched) {
        const res = await updatePassword({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        });

        // reset champs password après succès
        setForm((f) => ({
          ...f,
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        }));

        passwordMsg = res.message ?? "Mot de passe mis à jour.";
      }

      // Message final propre
      const finalMsg = [profileMsg, passwordMsg].filter(Boolean).join(" • ");
      setMessage(finalMsg || "Modifications enregistrées.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    clearToken();
    router.replace("/login");
  }

  if (loading) {
    return (
      <main>
        <h1>Mon compte</h1>
        <p>{user?.name}</p>
      </main>
    );
  }

  if (!user) return null;

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>Mon compte</h1>
        <p className={styles.subtitle}>{user?.name ?? "—"}</p>
        <button onClick={logout}>Se déconnecter</button>

        <form onSubmit={onSubmit} className={styles.form}>
          <label className={styles.label}>
            Nom
            <input
              className={styles.input}
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>

          <label className={styles.label}>
            Email
            <input
              className={styles.input}
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />
          </label>

          <label className={styles.label}>
            Mot de passe actuel
            <input
              className={styles.input}
              type="password"
              value={form.currentPassword}
              onChange={(e) =>
                setForm((f) => ({ ...f, currentPassword: e.target.value }))
              }
            />
          </label>

          <label className={styles.label}>
            Nouveau mot de passe
            <input
              className={styles.input}
              type="password"
              value={form.newPassword}
              onChange={(e) =>
                setForm((f) => ({ ...f, newPassword: e.target.value }))
              }
            />
          </label>

          <label className={styles.label}>
            Confirmer le nouveau mot de passe
            <input
              className={styles.input}
              type="password"
              value={form.confirmNewPassword}
              onChange={(e) =>
                setForm((f) => ({ ...f, confirmNewPassword: e.target.value }))
              }
            />
          </label>

          <div className={styles.actions}>
            <button className={styles.button} type="submit" disabled={saving}>
              {saving ? "Enregistrement..." : "Modifier les informations"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
