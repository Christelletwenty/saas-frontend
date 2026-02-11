import Image from "next/image";
import styles from "./AppFooter.module.css";

export default function AppFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Image src="/abricot-black.svg" alt="Abricot" width={110} height={26} />
        <span className={styles.copy}>Abricot 2025</span>
      </div>
    </footer>
  );
}
