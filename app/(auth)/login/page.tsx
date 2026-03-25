"use client";
import { useRouter } from "next/navigation";
import { LoginPayload } from "../../types/auth";
import { useState } from "react";
import { login } from "../../lib/auth-api";
import { setToken } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginPayload>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Empêche le rechargement complet de la page lors du submit HTML
    setError(null); // Réinitialise l'erreur précédente avant une nouvelle tentative
    setIsLoading(true); // Active l'état de chargement

    try {
      // Appelle l'API avec les données du formulaire
      const loginResponse = await login(form);

      // Si l'API indique un échec, on affiche le message d'erreur
      if (!loginResponse.success) {
        setError(loginResponse.message ?? "Une erreur est survenue !");
        return;
      }

      const data = loginResponse.data;

      setToken(data.token);
      // Force le rafraîchissement de la route pour mettre à jour
      // l'affichage avec le nouvel état d'authentification
      router.replace("/");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Une erreur est survenue";
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
          <h1 className="login__title">Connexion</h1>

          <form onSubmit={onSubmit} className="login__form">
            <label className="login__label" htmlFor="email">
              Email
              <input
                className="login__input"
                type="email"
                id="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
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
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                required
              />
            </label>

            {error ? <p className="login__error">{error}</p> : null}

            <button
              className="login__button"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>

            <a className="login__link" href="#">
              Mot de passe oublié ?
            </a>
          </form>
        </div>

        <p className="login__footer">
          Pas encore de compte ?{" "}
          <a className="login__link" href="/register">
            Créer un compte
          </a>
        </p>
      </div>

      <div className="login__right">
        <img
          className="login__sideImage"
          src="login-side.jpg"
          alt="login-logo"
        />
      </div>
    </div>
  );
}
