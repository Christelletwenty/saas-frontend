import { useState } from "react";

type LoginProps = {
  onSubmit: (date: { email: string; password: string }) => void;
  error?: string;
};

function LoginProfileForm({ onSubmit, error }: LoginProps) {
  //state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //comportements
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ email, password });
  };
  //render
  return (
    <section>
      <div className="login-logo">
        <img
          className="logo-abricot"
          src="/logo-abricot.png"
          alt="Logo Abricot"
        />
      </div>

      <div className="login-profile-form">
        <h1>Connexion</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Se connecter</button>
          <p>Mot de passe oublié ?</p>
        </form>

        <div>
          <p>Pas encore de compte ? Créer un compte</p>
        </div>
      </div>
    </section>
  );
}

export default LoginProfileForm;
