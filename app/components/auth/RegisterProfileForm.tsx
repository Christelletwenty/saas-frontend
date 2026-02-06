import { useState } from "react";

type RegisterProps = {
  onSubmit: (data: { email: string; password: string; name: string }) => void;
};

function RegisterProfileForm({ onSubmit }: RegisterProps) {
  //state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  //comportements
  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ email, password, name });
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
        <h1>Inscription</h1>
        <form onSubmit={handleRegister}>
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
          <button type="submit">Sinscrire</button>
        </form>

        <div>
          <p>Déjà inscrit ? Se connecter</p>
        </div>
      </div>
    </section>
  );
}

export default RegisterProfileForm;
