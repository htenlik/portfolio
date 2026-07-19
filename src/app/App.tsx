import styles from './App.module.css';

export function App() {
  return (
    <main className={styles.shell}>
      <section className={styles.placeholder} aria-labelledby="app-title">
        <span className={styles.mark} aria-hidden="true">HT</span>
        <div>
          <h1 id="app-title">htenlikOS</h1>
          <p>Personal Engineering Portfolio</p>
        </div>
      </section>
    </main>
  );
}
