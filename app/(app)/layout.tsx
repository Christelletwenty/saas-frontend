// Import AppShell qui sert de "coquille" de l'application
import AppShell from "../components/layout/AppShell";
// Impport AuthGate qui vérifie si l'utilisateur est authentifié
import AuthGate from "./AuthGate";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <AppShell>{children}</AppShell>
    </AuthGate>
  );
}
