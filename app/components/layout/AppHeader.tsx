"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./AppHeader.module.css";
import { useEffect, useState } from "react";
import { User } from "@/app/types/auth";
import { getProfile } from "@/app/lib/auth-api";

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
