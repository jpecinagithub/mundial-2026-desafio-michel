import { useEffect, useRef, useState } from "react";
import { sfxTick } from "./useAudio";

/**
 * Cuenta atrás basada en TIEMPO REAL (timestamp absoluto), no en el número
 * de renderizados de React. El `deadline` es un instante absoluto en ms, así
 * que recargar la página o pasar la pestaña a segundo plano no concede
 * tiempo adicional.
 *
 * En los últimos 10 segundos emite un tic sonoro discreto cada segundo
 * (si `tickSound` es true).
 */
export function useCountdown(
  deadline: number | null,
  onExpire: () => void,
  tickSound: boolean,
): number {
  const [remainingMs, setRemainingMs] = useState<number>(() =>
    deadline == null ? 0 : Math.max(0, deadline - Date.now()),
  );
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;
  const tickRef = useRef(tickSound);
  tickRef.current = tickSound;

  useEffect(() => {
    if (deadline == null) {
      setRemainingMs(0);
      return;
    }
    let raf = 0;
    let fired = false;
    let lastWhole = -1;
    const loop = () => {
      const rem = deadline - Date.now();
      if (rem <= 0) {
        setRemainingMs(0);
        // Disparar una sola vez aunque el rAF siga vivo un frame más.
        if (!fired) {
          fired = true;
          onExpireRef.current();
        }
        return;
      }
      setRemainingMs(rem);
      const whole = Math.ceil(rem / 1000);
      if (whole !== lastWhole) {
        lastWhole = whole;
        if (whole <= 10 && tickRef.current) sfxTick();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [deadline]);

  return remainingMs;
}
