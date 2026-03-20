// On récupère l'URL du backend depuis les variables d'environnement.
// NEXT_PUBLIC_ signifie que cette variable est accessible côté client dans une app Next.js.
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Vérification de sécurité : si l'URL du backend n'est pas définie dans le fichier .env.local,
// on arrête immédiatement l'application en lançant une erreur.
// Cela évite de lancer l'app avec une configuration incorrecte.
if (!BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is not set in .env.local");
}

// Clé utilisée pour stocker le token d'authentification dans le navigateur
// (souvent dans localStorage ou sessionStorage).
// Centraliser cette clé évite les fautes de frappe et facilite la maintenance.
export const TOKEN_STORAGE_KEY = "auth_token";
