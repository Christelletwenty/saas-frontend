import Link from "next/link";
import Image from "next/image";
import styles from "./AppHeader.module.css";

function IconGrid() {
  return (
    <Image
      src="/dashboard-icon.svg"
      alt="Dashboard"
      width={20}
      height={20}
      priority
    ></Image>
  );
}

function IconFolder() {
  return (
    <Image
      src="/folder-icon.svg"
      alt="Folder"
      width={20}
      height={20}
      priority
    ></Image>
  );
}

function Account() {
  return (
    <div className={styles.profileLogo}>
      <p>moi</p>
    </div>
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

        <Link href="/profile" className={styles.navItem}>
          <Account />
        </Link>
      </div>
    </header>
  );
}
