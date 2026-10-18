import type { Participant } from "../types/game";
import { ParticipantPhoto } from "./ParticipantPhoto";

interface Props {
  candidates: Participant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onConfirm: () => void;
}

/**
 * Selección MANUAL del participante del rebote por parte del organizador.
 * Nunca se elige automáticamente.
 */
export function ReboundSelection({ candidates, selectedId, onSelect, onConfirm }: Props) {
  return (
    <section className="rebound-select card-anim" aria-label="Selección del rebote">
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
        El organizador elige al participante (30 segundos para responder).
      </p>

      <div className="rebound-grid">
        {candidates.map((p) => {
          const selected = p.id === selectedId;
          return (
            <button
              key={p.id}
              type="button"
              className={`rebound-card${selected ? " is-selected" : ""}`}
              onClick={() => onSelect(p.id)}
              aria-pressed={selected}
              aria-label={`Elegir a ${p.name} para el rebote`}
            >
              <ParticipantPhoto participant={p} size={84} ring={selected ? "gold" : "none"} />
              <span className="rebound-name">{p.name}</span>
              {selected && (
                <span className="rebound-check" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="btn-primary btn-big"
        disabled={!selectedId}
        onClick={onConfirm}
      >
        ¡AL DESAFÍO! · 30 SEGUNDOS
      </button>
    </section>
  );
}
