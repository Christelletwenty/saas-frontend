"use client";
import { useRouter } from "next/navigation";
import { LoginPayload } from "../types/auth";
import { useState } from "react";
import { login } from "../lib/auth-api";
import { setToken } from "../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginPayload>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await login(form);
      if (!data.token) {
        setError("Répons invalide du server");
        return;
      }

      setToken(data.token);
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
        <img className="login__logo" src="abricot-logo.svg" alt="Abricot" />

        <div className="login__form__container">
          <h1 className="login__title">Connexion</h1>

          <form onSubmit={onSubmit} className="login__form">
            <label className="login__label">
              Email
              <input
                className="login__input"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                required
              />
            </label>

            <label className="login__label">
              Mot de passe
              <input
                className="login__input"
                type="password"
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
          <a className="login__link" href="#">
            Créer un compte
          </a>
        </p>
      </div>

      <div className="login__right">
        <img className="login__sideImage" src="login-side.jpg" alt="" />
      </div>
    </div>
  );
}
