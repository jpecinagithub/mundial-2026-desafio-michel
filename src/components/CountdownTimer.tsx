interface Props {
  remainingMs: number;
  totalMs: number;
}

/**
 * Cronómetro circular espectacular. En los últimos 10 segundos se vuelve
 * rojo y pulsante (la señal sonora la emite el hook useCountdown).
 */
export function CountdownTimer({ remainingMs, totalMs }: Props) {
  const R = 54;
  const C = 2 * Math.PI * R;
  const frac = totalMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0;
  const seconds = Math.ceil(remainingMs / 1000);
  const danger = seconds <= 10;

  return (
    <div
      className={`timer${danger ? " timer-danger" : ""}`}
      role="timer"
      aria-label={`${seconds} segundos restantes`}
      aria-live="off"
    >
      <svg viewBox="0 0 128 128" className="timer-svg" aria-hidden="true">
        <circle cx="64" cy="64" r={R} className="timer-track" />
        <circle
          cx="64"
          cy="64"
          r={R}
          className="timer-progress"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - frac)}
          transform="rotate(-90 64 64)"
        />
      </svg>
      <div className="timer-label">
        <span className="timer-seconds">{seconds}</span>
        <span className="timer-unit">SEG</span>
      </div>
    </div>
  );
}
