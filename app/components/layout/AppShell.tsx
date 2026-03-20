import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import styles from "./AppShell.module.css";

// Déclaration du composant AppShell.
// Composant React fonctionnel.
//
// Reçoit une prop "children" qui contient le contenu que les autres pages vont injecter dans ce layout.
//
// React.ReactNode = tout ce que React peut afficher
// (texte, JSX, composants, etc.)
export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <AppHeader />
      <main className={styles.main}>{children}</main>
      <AppFooter />
    </div>
  );
}
