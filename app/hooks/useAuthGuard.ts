"use client";
// Indique à Next.js que ce fichier doit être exécuté côté client.
// Obligatoire car on utilise des hooks React (useState, useEffect, useRouter).

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearToken, getToken } from "../lib/auth";
import { getProfile } from "../lib/auth-api";
import type { User } from "../types/auth";

// Type de retour du hook
// On retourne l'utilisateur connecté et un état de chargement
type UseAuthGuardResult = {
  user: User | null;
  isLoading: boolean;
};

export function useAuthGuard(): UseAuthGuardResult {
  const router = useRouter();
  // Permet de rediriger l'utilisateur (ex: vers /login)

  const [user, setUser] = useState<User | null>(null);
  // Stocke les informations de l'utilisateur connecté
  const [isLoading, setIsLoading] = useState(true);
  // Indique si la vérification d'authentification est en cours

  useEffect(() => {
    const token = getToken();
    // On récupère le token stocké côté client

    // Pas de token => l'utilisateur n'est pas connecté
    if (!token) {
      setIsLoading(false);
      router.replace("/login");
      return;
    }

    // Si un token existe, on vérifie qu'il est valide en appelant le backend
    (async () => {
      try {
        setIsLoading(true);
        const res = await getProfile(); // Appel API qui retourne les infos de l'utilisateur connecté
        setUser(res.data.user);
      } catch {
        // Token invalide / expiré => on clean + redirect
        clearToken();
        setUser(null);
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [router]);
  // useEffect s'exécute au montage du composant

  return { user, isLoading };
  // Le hook retourne l'utilisateur et l'état de chargement
}
