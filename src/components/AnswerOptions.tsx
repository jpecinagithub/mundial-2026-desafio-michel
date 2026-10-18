import type { Question } from "../types/game";

export const LETTERS = ["A", "B", "C", "D"] as const;

interface Props {
  question: Question;
  mode: "answer" | "reveal";
  selectedOption: number | null;
  /** En el rebote: opción que falló Michel (descartada, no seleccionable). */
  discardedIndex?: number | null;
  disabled?: boolean;
  onSelect?: (index: number) => void;
}

/** Las cuatro alternativas como tarjetas grandes y fáciles de pulsar. */
export function AnswerOptions({
  question,
  mode,
  selectedOption,
  discardedIndex = null,
  disabled = false,
  onSelect,
}: Props) {
  return (
    <div className="options" role={mode === "answer" ? "group" : undefined} aria-label="Respuestas">
      {question.options.map((text, i) => {
        const letter = LETTERS[i] ?? "";
        const isCorrect = mode === "reveal" && i === question.correctIndex;
        const isWrongPick =
          mode === "reveal" && i === selectedOption && selectedOption !== question.correctIndex;
        const isDiscarded = mode === "answer" && i === discardedIndex;
        const cls = [
          "option",
          isCorrect ? "is-correct" : "",
          isWrongPick ? "is-wrong" : "",
          isDiscarded ? "is-discarded" : "",
          mode === "reveal" && !isCorrect && !isWrongPick ? "is-dimmed" : "",
        ]
          .join(" ")
          .trim();

        if (mode === "reveal") {
          return (
            <div key={letter} className={cls} aria-label={`Opción ${letter}${isCorrect ? " (correcta)" : ""}`}>
              <span className="option-letter" aria-hidden="true">
                {letter}
              </span>
              <span className="option-text">{text}</span>
              {isCorrect && (
                <span className="option-mark" aria-hidden="true">
                  ✓
                </span>
              )}
              {isWrongPick && (
                <span className="option-mark" aria-hidden="true">
                  ✗
                </span>
              )}
            </div>
          );
        }

        return (
          <button
            key={letter}
            type="button"
            className={cls}
            disabled={disabled || isDiscarded}
            onClick={() => onSelect?.(i)}
            aria-label={`Opción ${letter}: ${text}${isDiscarded ? " (descartada)" : ""}`}
          >
            <span className="option-letter" aria-hidden="true">
              {letter}
            </span>
            <span className="option-text">{text}</span>
            {isDiscarded && <span className="option-discarded-tag">Descartada</span>}
          </button>
        );
      })}
    </div>
  );
}
