import type { RankedParticipant } from "../types/game";
import { ParticipantPhoto } from "./ParticipantPhoto";

interface Props {
  ranking: RankedParticipant[];
  /** Id del participante que está respondiendo (se resalta). */
  activeId?: string;
  title?: string;
}

/** Marcador visible durante la partida con los puntos de cada jugador. */
export function Scoreboard({ ranking, activeId, title = "MARCADOR" }: Props) {
  return (
    <section className="scoreboard" aria-label={title}>
      <h3 className="scoreboard-title">{title}</h3>
      <ol className="scoreboard-list">
        {ranking.map((row) => (
          <li
            key={row.participant.id}
            className={`scoreboard-row${row.participant.id === activeId ? " is-active" : ""}`}
          >
            <span className="scoreboard-pos" aria-label={`Posición ${row.position}`}>
              {row.position}
            </span>
            <ParticipantPhoto participant={row.participant} size={34} />
            <span className="scoreboard-name">
              {row.participant.name}
              {row.participant.isProtagonist && (
                <span className="scoreboard-star" title="Protagonista" aria-label="Protagonista">
                  {" "}★
                </span>
              )}
            </span>
            <span className="scoreboard-points">
              <strong>{row.points}</strong>
              <small> pts</small>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
