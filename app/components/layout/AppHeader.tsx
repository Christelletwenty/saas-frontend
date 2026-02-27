"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./AppHeader.module.css";
import { useEffect, useState } from "react";
import { getProfile } from "@/app/lib/auth-api";

function IconGrid() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.25 0H1.75C0.785 0 0 0.785 0 1.75V6.25C0 7.215 0.785 8 1.75 8H9.25C10.215 8 11 7.215 11 6.25V1.75C11 0.785 10.215 0 9.25 0Z"
        fill="inherit"
      />
      <path
        d="M9.25 10H1.75C0.785 10 0 10.785 0 11.75V22.25C0 23.215 0.785 24 1.75 24H9.25C10.215 24 11 23.215 11 22.25V11.75C11 10.785 10.215 10 9.25 10Z"
        fill="inherit"
      />
      <path
        d="M22.25 16H14.75C13.785 16 13 16.785 13 17.75V22.25C13 23.215 13.785 24 14.75 24H22.25C23.215 24 24 23.215 24 22.25V17.75C24 16.785 23.215 16 22.25 16Z"
        fill="inherit"
      />
      <path
        d="M22.25 0H14.75C13.785 0 13 0.785 13 1.75V12.25C13 13.215 13.785 14 14.75 14H22.25C23.215 14 24 13.215 24 12.25V1.75C24 0.785 23.215 0 22.25 0Z"
        fill="inherit"
      />
    </svg>
  );
}

function IconFolder() {
  return (
    <svg
      width="29"
      height="23"
      viewBox="0 0 29 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M26.5791 9.08691C27.4428 9.08698 28.2214 9.51204 28.6621 10.2227C29.0726 10.8866 29.1117 11.6992 28.7646 12.3965L24.3672 21.209C23.9765 21.9918 23.1766 22.4873 22.3018 22.4873H1.83984C0.970986 22.4873 0.240875 21.9031 0.0488281 21.1221L5.13672 10.4561C5.52599 9.62428 6.3926 9.08699 7.3457 9.08691H26.5791ZM8.66699 0C9.25766 6.22332e-05 9.81079 0.279265 10.1455 0.748047L12.0352 3.39062C12.0391 3.3935 12.05 3.39843 12.0654 3.39844H22.626C23.616 3.39852 24.4219 4.17503 24.4219 5.12988V7.44629H6.31055C5.35695 7.44629 4.48933 7.9845 4.10059 8.81641L0 17.4141V1.73145C2.66478e-05 0.776583 0.805427 6.71615e-05 1.7959 0H8.66699Z"
        fill="inherit"
      />
    </svg>
  );
}

function Account() {
  const [userInitials, setUserInitials] = useState<string | null>(null);

  /**
   * Petit utilitaire pour récupérer des initiales a partir d'un nom
   * @param userName le nom a split en initials
   * @returns les initiales si on avait un nom séparé avec un espace
   */
  const getUserInitials = (userName: string): string => {
    return userName
      .split(" ")
      .map((c) => c[0])
      .join("");
  };

  useEffect(() => {
    (async () => {
      try {
        const userRes = await getProfile();
        setUserInitials(getUserInitials(userRes.data.user.name ?? ""));
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erreur inconnue";
        console.error(msg);
        setUserInitials("N/C");
      } finally {
      }
    })();
  }, []);

  return (
    <div className={styles.profileLogo}>
      <p>{userInitials}</p>
    </div>
  );
}

export default function AppHeader() {
  const pathname = usePathname();
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
          <Link
            href="/"
            className={`${styles.navItem} ${pathname === "/dashboard" ? styles.active : ""}`}
          >
            <span className={styles.navIcon}>
              <IconGrid />
            </span>
            <button>Tableau de bord</button>
          </Link>

          <Link
            href="/projects"
            className={`${styles.navItem} ${pathname.includes("/projects") ? styles.active : ""}`}
          >
            <span className={styles.navIcon}>
              <IconFolder />
            </span>
            <button>Projets</button>
          </Link>
        </nav>

        <Link href="/profile" className={`${styles.navItem} ${styles.account}`}>
          <Account />
        </Link>
      </div>
    </header>
  );
}
