import { User } from "../types/auth";

const users: Partial<User>[] = [
  {
    email: "alice@example.com",
    name: "Alice Martin",
  },
  {
    email: "bob@example.com",
    name: "Bob Dupont",
  },
  {
    email: "caroline@example.com",
    name: "Caroline Leroy",
  },
  {
    email: "david@example.com",
    name: "David Moreau",
  },
  {
    email: "emma@example.com",
    name: "Emma Rousseau",
  },
  {
    email: "francois@example.com",
    name: "François Dubois",
  },
  {
    email: "gabrielle@example.com",
    name: "Gabrielle Simon",
  },
  {
    email: "henri@example.com",
    name: "Henri Laurent",
  },
  {
    email: "isabelle@example.com",
    name: "Isabelle Petit",
  },
  {
    email: "jacques@example.com",
    name: "Jacques Durand",
  },
];

export function getUsers(): Promise<Partial<User>[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(users);
    }, 500);
  });
}
