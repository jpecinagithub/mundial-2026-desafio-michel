import type { Question } from "../types/game";
import { AnswerOptions, LETTERS } from "./AnswerOptions";

interface Props {
  question: Question;
  selectedOption: number | null;
  wasCorrect: boolean | null;
  /** true si el rebote se acertó arrebatándole los puntos a Michel. */
  reboundStolen: boolean;
  /** Nombre del participante del rebote (null si respondió Michel). */
  rebounderName: string | null;
  isLast: boolean;
  onNext: () => void;
}

/**
 * Revelado de la respuesta correcta con explicación y fuente, tras cada
 * ronda. El organizador avanza manualmente: nunca es automático.
 */
export function RevealCard({
  question,
  selectedOption,
  wasCorrect,
  reboundStolen,
  rebounderName,
  isLast,
  onNext,
}: Props) {
  const correctLetter = LETTERS[question.correctIndex] ?? "";

  let headline: string;
  let headlineClass = "reveal-fail";
  if (wasCorrect && reboundStolen && rebounderName) {
    headline = `¡${rebounderName.toUpperCase()} ARREBATA LOS 50 PUNTOS A MICHEL!`;
    headlineClass = "reveal-steal";
  } else if (wasCorrect) {
    headline = "¡CORRECTO! +50 PUNTOS PARA MICHEL";
    headlineClass = "reveal-success";
  } else if (rebounderName) {
    headline = "SIN PUNTOS ESTA VEZ";
  } else {
    headline = "SE ACABÓ EL TIEMPO";
  }

  return (
    <section className="reveal card-anim" aria-label="Resultado de la ronda">
      <h2 className={`reveal-headline ${headlineClass}`}>{headline}</h2>
      <p className="reveal-correct-line">
        La respuesta correcta era <strong>{correctLetter}</strong>
      </p>

      <AnswerOptions
        question={question}
        mode="reveal"
        selectedOption={selectedOption}
      />

      <div className="reveal-explanation">
        <h3>¿Por qué?</h3>
        <p>{question.explanation}</p>
        {question.sources.length > 0 && (
          <p className="reveal-sources">
            Fuente{question.sources.length > 1 ? "s" : ""}:{" "}
            {question.sources.map((s, i) => (
              <span key={s.url}>
                {i > 0 && " · "}
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </span>
            ))}
          </p>
        )}
      </div>

      <button type="button" className="btn-primary btn-big" onClick={onNext}>
        {isLast ? "VER CLASIFICACIÓN FINAL 🏆" : "SIGUIENTE PREGUNTA →"}
      </button>
    </section>
  );
}
