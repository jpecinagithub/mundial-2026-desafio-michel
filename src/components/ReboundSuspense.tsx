import { useEffect, useRef, useState } from "react";
import type { Participant } from "../types/game";
import { ParticipantPhoto } from "./ParticipantPhoto";

/** Duración del suspense en ms (debe coincidir con la animación CSS .suspense-fill). */
export const SUSPENSE_MS = 5000;
const CYCLE_MS = 140;
/** Al final, la ruleta se detiene en el participante elegido. */
const SETTLE_MS = 800;

interface Props {
  /** El participante elegido por el organizador (la ruleta termina en él). */
  participant: Participant;
  candidates: Participant[];
  onDone: () => void;
}

/**
 * Animación de suspense de 5 s tras la elección manual del rebote:
 * las fotos ciclan rápido como una ruleta, con barra de progreso.
 * Avanza automáticamente; un clic la salta.
 */
export function ReboundSuspense({ participant, candidates, onDone }: Props) {
  const [tick, setTick] = useState(0);
  const [settled, setSettled] = useState(false);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDoneRef.current();
  };

  useEffect(() => {
    const cycle = window.setInterval(() => setTick((t) => t + 1), CYCLE_MS);
    const settle = window.setTimeout(() => {
      window.clearInterval(cycle);
      setSettled(true);
    }, SUSPENSE_MS - SETTLE_MS);
    const end = window.setTimeout(finish, SUSPENSE_MS);
    return () => {
      window.clearInterval(cycle);
      window.clearTimeout(settle);
      window.clearTimeout(end);
    };
    // Se monta una sola vez por fase.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shown: Participant =
    settled || candidates.length === 0
      ? participant
      : (candidates[tick % candidates.length] ?? participant);

  return (
    <section
      className="rebound-suspense card-anim"
      aria-label="Sorteo del participante del rebote"
      onClick={finish}
    >
      <h2 className="suspense-label">¿Quién acepta el desafío?…</h2>
      <div className={`suspense-photo${settled ? " settled" : ""}`}>
        <ParticipantPhoto participant={shown} size={168} ring={settled ? "gold" : "none"} />
      </div>
      <div className={`suspense-name${settled ? " settled" : ""}`}>
        {settled ? shown.name : "…"}
      </div>
      <div className="suspense-bar" aria-hidden="true">
        <div className="suspense-fill" />
      </div>
      <div className="suspense-skip">clic para continuar →</div>
    </section>
  );
}
