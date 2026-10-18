import type { RankedParticipant } from "../types/game";
import { ParticipantPhoto } from "./ParticipantPhoto";

export interface FinalStats {
  michelCorrect: number;
  reboundsOffered: number;
  reboundsWon: number;
  totalPoints: number;
}

interface Props {
  ranking: RankedParticipant[];
  stats: FinalStats;
  onRestart: () => void;
}

const MEDALS = ["🥇", "🥈", "🥉"];

/** Clasificación final con podio oro/plata/bronce y tarjeta resumen. */
export function FinalPodium({ ranking, stats, onRestart }: Props) {
  const podium = ranking.slice(0, 3);
  const rest = ranking.slice(3);
  // Orden visual clásico de podio: 2º - 1º - 3º
  const podiumOrder = [podium[1], podium[0], podium[2]].filter(
    (r): r is RankedParticipant => !!r,
  );

  return (
    <div className="final-wrap">
      <div className="podium" aria-label="Podio">
        {podiumOrder.map((row) => (
          <div
            key={row.participant.id}
            className={`podium-place podium-${row.position}`}
            style={{ order: row.position === 1 ? 2 : row.position === 2 ? 1 : 3 }}
          >
            <span className="podium-medal" aria-hidden="true">
              {MEDALS[row.position - 1] ?? "🏅"}
            </span>
            <ParticipantPhoto
              participant={row.participant}
              size={row.position === 1 ? 110 : 88}
              ring="gold"
            />
            <span className="podium-name">{row.participant.name}</span>
            <span className="podium-points">{row.points} pts</span>
            <span className="podium-hits">
              {row.correct} acierto{row.correct === 1 ? "" : "s"}
            </span>
            <div className="podium-bar" aria-hidden="true">
              <span className="podium-posnum">{row.position}</span>
            </div>
          </div>
        ))}
      </div>

      {rest.length > 0 && (
        <ol className="final-rest">
          {rest.map((row) => (
            <li key={row.participant.id} className="final-rest-row">
              <span className="scoreboard-pos">{row.position}</span>
              <ParticipantPhoto participant={row.participant} size={44} />
              <span className="scoreboard-name">{row.participant.name}</span>
              <span className="scoreboard-points">
                <strong>{row.points}</strong>
                <small> pts · {row.correct} aciertos</small>
              </span>
            </li>
          ))}
        </ol>
      )}

      <section className="final-summary" aria-label="Resumen de la partida">
        <h3>RESUMEN DEL DESAFÍO</h3>
        <dl>
          <div>
            <dt>Preguntas acertadas por Michel</dt>
            <dd>{stats.michelCorrect} / 10</dd>
          </div>
          <div>
            <dt>Rebotes ofrecidos</dt>
            <dd>{stats.reboundsOffered}</dd>
          </div>
          <div>
            <dt>Rebotes acertados</dt>
            <dd>{stats.reboundsWon}</dd>
          </div>
          <div>
            <dt>Puntos totales repartidos</dt>
            <dd>{stats.totalPoints}</dd>
          </div>
        </dl>
      </section>

      <button type="button" className="btn-primary btn-big" onClick={onRestart}>
        🔁 JUGAR DE NUEVO
      </button>
    </div>
  );
}
