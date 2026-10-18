import type { Participant } from "../types/game";
import { ParticipantPhoto } from "./ParticipantPhoto";

interface Props {
  candidates: Participant[];
  /** Ids ya sorteados en esta partida: aparecen atenuados (no repiten). */
  usedIds: string[];
  onDraw: () => void;
}

/**
 * Pantalla «¡REBOTE!» con SORTEO del participante: nadie elige a mano.
 * El sorteo es sin repetición dentro de la partida: quien ya ha salido
 * aparece atenuado y no puede volver a salir hasta agotar el bombo.
 */
export function ReboundDraw({ candidates, usedIds, onDraw }: Props) {
  return (
    <section className="rebound-select card-anim" aria-label="Sorteo del rebote">
      <div className="rebound-banner">
        <span className="rebound-flash" aria-hidden="true">
          ⚡
        </span>
        <h2 className="rebound-title">¡REBOTE!</h2>
      </div>
      <p className="rebound-message">
        Michel no ha conseguido los 50 puntos. <strong>¿Quién acepta el desafío?</strong>
      </p>
      <p className="rebound-hint">
        Sorteo sin repetición: cada participante solo puede salir una vez por
        partida (30 segundos para responder).
      </p>

      <div className="rebound-grid">
        {candidates.map((p) => {
          const used = usedIds.includes(p.id);
          return (
            <div
              key={p.id}
              className={`rebound-card${used ? " is-used" : ""}`}
              aria-label={used ? `${p.name} (ya ha salido)` : p.name}
            >
              <ParticipantPhoto participant={p} size={84} ring="none" />
              <span className="rebound-name">{p.name}</span>
              {used && (
                <span className="rebound-check" aria-hidden="true">
                  ✓
                </span>
              )}
            </div>
          );
        })}
      </div>

      <button type="button" className="btn-primary btn-big" onClick={onDraw}>
        🎲 SORTEAR
      </button>
    </section>
  );
}
