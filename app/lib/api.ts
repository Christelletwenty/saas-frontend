import { getToken } from "./auth";
import { BACKEND_URL } from "./config";

type ApiErrorBody = {
  message?: string;
};

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const url = `${BACKEND_URL}${path}`;
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.auth) {
    const token = getToken();
    if (!token) {
      throw new Error("Vous n'êtes pas authentifié");
    }
    headers.set("Authorization", `Bearer ${token}`);
  }
  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    //je récupère le message du backend
    let message = `Une erreur est survenue (${res.status})`;
    try {
      const body = (await res.json()) as ApiErrorBody;
      if (body?.message) {
        message = body.message;
      }
    } catch {
      //backend renvoie du texte ou non
    }
    throw new Error(message);
  }
  return (await res.json()).data as T;
}
