import styles from './CongratulationsDialog.module.css';

export function CongratulationsDialog({ onClose }: { onClose: () => void }) {
  return <div className={styles.overlay} role="presentation"><section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="win-title"><header id="win-title">Minesweeper complete</header><div><span aria-hidden="true">🏆</span><p><strong>You cleared the field.</strong><br />A new file has appeared on your desktop.</p></div><button className="retro-button" type="button" autoFocus onClick={onClose}>Continue</button></section></div>;
}
