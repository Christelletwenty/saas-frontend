"use client";

import { useAuthGuard } from "../hooks/useAuthGuard";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthGuard();

  if (isLoading) {
    return (
      <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
        <h1>Chargement...</h1>
      </main>
    );
  }

  // Si pas de user, le hook a déjà déclenché router.replace("/login")
  if (!user) return null;

  return <>{children}</>;
}
