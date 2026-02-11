import Link from "next/link";
import Image from "next/image";
import styles from "./AppHeader.module.css";

function IconGrid() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"
      />
    </svg>
  );
}

function IconFolder() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M10 4l2 2h8a2 2 0 0 1 2 2v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a2 2 0 0 1 2-2h6z"
      />
    </svg>
  );
}

export default function AppHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Abricot - Accueil">
          <Image
            src="/abricot-logo.svg"
            alt="Abricot"
            width={120}
            height={28}
            priority
          />
        </Link>

        <nav className={styles.nav} aria-label="Navigation principale">
          <Link href="/" className={styles.navItem}>
            <span className={styles.navIcon}>
              <IconGrid />
            </span>
            <span>Tableau de bord</span>
          </Link>

          <Link href="/projects" className={styles.navItem}>
            <span className={styles.navIcon}>
              <IconFolder />
            </span>
            <span>Projets</span>
          </Link>
        </nav>

        <Link href="/profile" className={styles.avatar} aria-label="Mon compte">
          AD
        </Link>
      </div>
    </header>
  );
}
