// On importe une constante contenant la clé utilisée dans le sessionStorage.
// Cela évite de répéter une string partout dans le code et centralise la configuration.
import { TOKEN_STORAGE_KEY } from "./config";

// Cette fonction sauvegarde le token d'authentification dans le sessionStorage.
// Le token est généralement reçu après un login réussi.
export function setToken(token: string): void {
  // sessionStorage permet de stocker des données dans le navigateur
  // uniquement pendant la session de navigation (jusqu'à fermeture du navigateur).
  sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
}

// Cette fonction récupère le token stocké dans le sessionStorage.
export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_STORAGE_KEY);
  // Si aucun token n'existe, la fonction retourne null.
}

// Cette fonction supprime le token du sessionStorage.
// Elle est typiquement utilisée lors du logout.
export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
}

// Cette fonction vérifie si l'utilisateur est authentifié.
export function isAuthenticated(): boolean {
  // Si un token existe -> true
  // Si aucun token -> false
  return Boolean(getToken());
}
