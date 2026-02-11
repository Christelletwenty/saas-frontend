import { getToken } from "./auth";
import { BACKEND_URL } from "./config";

type ApiErrorBody = {
  message?: string;
};

export class HttpError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    (super(message), (this.status = status));
  }
}

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
      throw new HttpError(401, "Non authentifié.");
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
    throw new HttpError(res.status, message);
  }
  return (await res.json()) as T;
}
