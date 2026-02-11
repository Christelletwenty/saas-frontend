import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import styles from "./AppShell.module.css";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <AppHeader />
      <main className={styles.main}>{children}</main>
      <AppFooter />
    </div>
  );
}
