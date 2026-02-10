"use client";

import { useRouter } from "next/navigation";
import { RegisterPayload } from "../types/auth";
import { useState } from "react";
import { setToken } from "../lib/auth";
import { login, register } from "../lib/auth-api";

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

    //Validation
    if (form.password !== form.confirmPassword) {
      setError("Le mot de passe ne correspond pas.");
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...payload } = form;
      //On register
      const regRes = await register(payload);

      //Le backend renvoie un token = on est register
      if (regRes.token) {
        setToken(regRes.token);
        router.replace("/");
        router.refresh();
        return;
      }
      //Je comprend pas
      const loginResp = await login({
        email: payload.email,
        password: payload.password,
      });
      if (loginResp.token) {
        setError("Compte créé, mais connexion impossible (token manquant).");
        return;
      }

      setToken(loginResp.token);
      router.replace("/");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
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
          <h1 className="login__title">Inscription</h1>

          <form onSubmit={onSubmit} className="login__form">
            <label className="login__label">
              Email
              <input
                className="login__input"
                type="email"
                value={form.email ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                required
              />
            </label>
            <label className="login__label">
              Nom
              <input
                className="login__input"
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </label>
            <label className="login__label">
              Mot de passe
              <input
                className="login__input"
                type="password"
                value={form.password ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                required
                minLength={6}
              />
            </label>
            <label className="login__label">
              Confirmez le mot de passe
              <input
                className="login__input"
                type="password"
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
