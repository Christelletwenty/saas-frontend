"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearToken, getToken } from "../lib/auth";
import { getProfile } from "../lib/auth-api";
import type { User } from "../types/auth";

type UseAuthGuardResult = {
  user: User | null;
  isLoading: boolean;
};

export function useAuthGuard(): UseAuthGuardResult {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    // 1) Pas de token => pas loggué
    if (!token) {
      setIsLoading(false);
      router.replace("/login");
      return;
    }

    // 2) Token présent => on valide en appelant le backend
    (async () => {
      try {
        setIsLoading(true);
        const res = await getProfile();
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

  return { user, isLoading };
}
