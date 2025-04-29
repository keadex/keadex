import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.ctas}>
          <a className={styles.primary} href="/mina-live">
            Open Mina Live Example
          </a>
        </div>
      </main>
    </div>
  );
}
