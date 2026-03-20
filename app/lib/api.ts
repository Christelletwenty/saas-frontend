import { getToken } from "./auth";
import { BACKEND_URL } from "./config";

/**
 * Type représentant la structure d'une erreur renvoyée par le backend.
 */
type ApiErrorBody = {
  message?: string;
};

/**
 * Type générique représentant une réponse réussie de l'API.
 */
export type ApiSuccess<TData> = {
  success?: boolean;
  message?: string;
  data: TData;
};

/**
 * Classe personnalisée pour représenter une erreur HTTP.
 * Elle étend la classe native Error afin d'ajouter le code HTTP (status).
 */
export class HttpError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    (super(message), (this.status = status)); // Stocke le code HTTP (ex: 401, 404, 500)
  }
}

/**
 * Fonction permettant d'effectuer des requêtes HTTP vers le backend.
 * Elle centralise la logique de fetch pour toute l'application.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  // Construction de l'URL complète de l'endpoint
  const url = `${BACKEND_URL}${path}`;
  // Création de l'objet Headers à partir des options existantes
  const headers = new Headers(options.headers);
  // On force le Content-Type en JSON car notre API communique en JSON
  headers.set("Content-Type", "application/json");

  /**
   * Si l'option auth est activée, on ajoute automatiquement le token
   * d'authentification dans les headers.
   */
  if (options.auth) {
    // Récupération du token stocké côté client
    const token = getToken();
    // Si aucun token n'est trouvé, on bloque immédiatement la requête
    if (!token) {
      throw new HttpError(401, "Non authentifié.");
    }
    // Ajout du token dans l'en-tête Authorization au format Bearer
    headers.set("Authorization", `Bearer ${token}`);
  }
  /**
   * Exécution de la requête HTTP via fetch
   */
  const res = await fetch(url, {
    ...options,
    headers,
  });

  /**
   * Gestion des erreurs HTTP
   * res.ok = false si status >= 400
   */
  if (!res.ok) {
    // Message d'erreur générique par défaut
    let message = `Une erreur est survenue (${res.status})`;
    try {
      /**
       * On tente de récupérer le message renvoyé par le backend
       * pour afficher une erreur plus précise.
       */
      const body = (await res.json()) as ApiErrorBody;
      if (body?.message) {
        message = body.message;
      }
    } catch {
      // Si le backend ne renvoie pas du JSON (texte brut par exemple),
      // on ignore simplement l'erreur de parsing.
    }
    // On lance une erreur personnalisée contenant le status HTTP
    throw new HttpError(res.status, message);
  }
  /**
   * Si tout se passe bien, on retourne le JSON de la réponse.
   * Le résultat est typé avec le type générique T.
   */
  return (await res.json()) as T;
}
