"use client";

import { useRouter } from "next/navigation";
import { RegisterPayload } from "../../types/auth";
import { useState } from "react";
import { setToken } from "../../lib/auth";
import { login, register } from "../../lib/auth-api";
import { HttpError } from "../../lib/api";

// On reprend les champs nécessaires à l'inscription
// et on ajoute confirmPassword pour la vérification côté interface.
type RegisterFormState = RegisterPayload & {
  confirmPassword: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterFormState>({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Vérification simple côté client :
    // on s'assure que le mot de passe et sa confirmation correspondent
    if (form.password !== form.confirmPassword) {
      setError("Le mot de passe ne correspond pas.");
      return;
    }

    setIsLoading(true);

    try {
      // On retire confirmPassword avant d'envoyer les données à l'API,
      // car ce champ sert uniquement à la validation côté front.
      const { confirmPassword, ...payload } = form;
      const regResponse = await register(payload);

      // Si la connexion échoue ou que le token manque,
      // on informe l'utilisateur.
      if (!regResponse.success) {
        setError(regResponse.message ?? "Une erreur est survenue");
        return;
      }

      // Données renvoyées après inscription.
      const data = regResponse.data;

      if (data.token) {
        setToken(data.token);
        router.replace("/");
        router.refresh();
        return;
      }
      const loginResp = await login({
        email: payload.email,
        password: payload.password,
      });

      if (!loginResp.success || !loginResp.data.token) {
        setError("Compte créé, mais connexion impossible (token manquant).");
        return;
      }

      setToken(loginResp.data.token);
      // Puis on redirige l'utilisateur.
      router.replace("/");
      router.refresh();
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status === 409) {
          setError("Cet email est déjà utilisé");
          return;
        }
        if (err.status === 400) {
          setError(err.message || "Données invalides");
          return;
        }
        setError(err.message || "Une erreur est survenue");
        return;
      }

      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login">
      <div className="login__left">
        <img
          className="login__logo"
          src="abricot-logo.svg"
          alt="Abricot"
          loading="lazy"
        />

        <div className="login__form__container">
          <h1 className="login__title">Inscription</h1>

          <form onSubmit={onSubmit} className="login__form">
            <label className="login__label" htmlFor="email">
              Email
              <input
                className="login__input"
                type="email"
                id="email"
                value={form.email ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                required
              />
            </label>
            <label className="login__label" htmlFor="name">
              Nom
              <input
                className="login__input"
                type="text"
                id="name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </label>
            <label className="login__label" htmlFor="password">
              Mot de passe
              <input
                className="login__input"
                type="password"
                id="password"
                value={form.password ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                required
                minLength={6}
              />
            </label>
            <label className="login__label" htmlFor="confirmPassword">
              Confirmez le mot de passe
              <input
                className="login__input"
                type="password"
                id="confirmPassword"
                value={form.confirmPassword ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, confirmPassword: e.target.value }))
                }
                required
                minLength={6}
              />
            </label>
            {error ? <p>{error}</p> : null}

            <button
              className="login__button"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "S'inscrire"}
            </button>
          </form>
        </div>
        <p className="login__footer">
          Déjà inscrit ?{" "}
          <a className="login__link" href="/login">
            Se connecter
          </a>
        </p>
      </div>
      <div className="login__right">
        <img
          className="login__sideImage"
          src="register-side.jpg"
          alt="register-logo"
        />
      </div>
    </div>
  );
}
