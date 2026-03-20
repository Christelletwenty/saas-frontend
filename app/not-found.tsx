import Link from "next/link";

export default function NotFound() {
  return (
    <main className={"notfoundContainer"}>
      <h1 className={"notfoundTitle"}>404</h1>

      <p className={"notfoundText"}>Oups… Cette page n’existe pas.</p>

      <div className={"notfoundImage"}>
        <img src="/not-found.svg" alt="Page not found" loading="lazy" />
      </div>

      <Link href="/" className={"notfoundButton"}>
        Retour à l’accueil
      </Link>
    </main>
  );
}
