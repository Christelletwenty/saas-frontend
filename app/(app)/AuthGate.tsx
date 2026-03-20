"use client";

import { useAuthGuard } from "../hooks/useAuthGuard";
// On importe le hook personnalisé chargé de vérifier si l'utilisateur est authentifié ou non.

export default function AuthGate({ children }: { children: React.ReactNode }) {
  // AuthGate est un composant "barrière", il protège ce qu'on place à l'intérieur.
  const { user, isLoading } = useAuthGuard();
  // On appelle le hook de garde d'authentification qui nous renvoie l'utilisateur connecté s'il existe.

  if (isLoading) {
    // Tant que l'application vérifie si l'utilisateur est connecté, on affiche un écran de chargement.
    return (
      <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
        <h1>Chargement...</h1>
      </main>
    );
  }

  // Si aucun utilisateur n'est trouvé, le hook a déjà normalement déclenché une redirection vers /login.
  if (!user) return null;

  // Si l'utilisateur existe bien, on affiche le contenu protégé.
  return <>{children}</>;
}
