/**
 * Motor del concurso: máquina de estados PURA (sin React, sin DOM).
 * Todas las funciones reciben el estado y devuelven un estado nuevo.
 * Cada transición valida la fase actual: si no corresponde, devuelve el
 * estado intacto. Esto protege contra puntos duplicados (doble pulsación,
 * respuesta coincidiendo con el fin del tiempo, etc.).
 */
import type { GameState, Participant, RankedParticipant, ScoreEntry } from "../types/game";

export const MICHEL_ID = "michel";
export const MICHEL_SECONDS = 60;
export const REBOUND_SECONDS = 30;
export const POINTS_PER_CORRECT = 50;
export const TOTAL_QUESTIONS = 10;

function emptyScores(ids: string[]): Record<string, ScoreEntry> {
  const scores: Record<string, ScoreEntry> = {};
  for (const id of ids) scores[id] = { points: 0, correct: 0 };
  return scores;
}

function addPoints(state: GameState, participantId: string): GameState {
  const prev = state.scores[participantId] ?? { points: 0, correct: 0 };
  return {
    ...state,
    scores: {
      ...state.scores,
      [participantId]: {
        points: prev.points + POINTS_PER_CORRECT,
        correct: prev.correct + 1,
      },
    },
  };
}

/** Prepara los campos de una ronda con su cronómetro (deadline absoluto). */
function freshRound(
  state: GameState,
  activeParticipantId: string,
  timerSeconds: number,
  now: number,
): GameState {
  return {
    ...state,
    activeParticipantId,
    michelFailedOption: null,
    selectedOption: null,
    wasCorrect: null,
    reboundStolen: false,
    deadline: now + timerSeconds * 1000,
    timerSeconds,
  };
}

export function createInitialState(participantIds: string[]): GameState {
  return {
    phase: "welcome",
    questionIndex: 0,
    scores: emptyScores(participantIds),
    activeParticipantId: MICHEL_ID,
    michelFailedOption: null,
    selectedOption: null,
    wasCorrect: null,
    reboundStolen: false,
    michelCorrect: 0,
    reboundsOffered: 0,
    reboundsWon: 0,
    deadline: null,
    timerSeconds: MICHEL_SECONDS,
    startedAt: null,
    finishedAt: null,
  };
}

export function startGame(state: GameState, now: number): GameState {
  const base: GameState = {
    ...createInitialState(Object.keys(state.scores)),
    phase: "michel",
    startedAt: now,
  };
  return freshRound(base, MICHEL_ID, MICHEL_SECONDS, now);
}

export function answerMichel(
  state: GameState,
  optionIndex: number,
  isCorrect: boolean,
): GameState {
  if (state.phase !== "michel" || state.selectedOption !== null) return state;
  if (isCorrect) {
    return {
      ...addPoints(state, MICHEL_ID),
      phase: "reveal",
      selectedOption: optionIndex,
      wasCorrect: true,
      reboundStolen: false,
      michelCorrect: state.michelCorrect + 1,
      deadline: null,
    };
  }
  return {
    ...state,
    phase: "reboundSelect",
    selectedOption: optionIndex,
    wasCorrect: false,
    michelFailedOption: optionIndex,
    reboundsOffered: state.reboundsOffered + 1,
    deadline: null,
  };
}

/** Se agotaron los 60 s de Michel sin responder. */
export function expireMichelTimer(state: GameState): GameState {
  if (state.phase !== "michel" || state.selectedOption !== null) return state;
  return {
    ...state,
    phase: "reboundSelect",
    selectedOption: null,
    wasCorrect: false,
    michelFailedOption: null,
    reboundsOffered: state.reboundsOffered + 1,
    deadline: null,
  };
}

/**
 * El organizador elige MANUALMENTE al participante del rebote.
 * Pasa a la fase de suspense (animación de 5 s); el cronómetro de 30 s
 * no arranca hasta que aparece la pregunta del rebote.
 */
export function selectRebounder(state: GameState, participantId: string): GameState {
  if (state.phase !== "reboundSelect") return state;
  if (participantId === MICHEL_ID) return state;
  if (!state.scores[participantId]) return state;
  return {
    ...state,
    phase: "reboundSuspense",
    activeParticipantId: participantId,
    selectedOption: null,
    wasCorrect: null,
    reboundStolen: false,
    deadline: null,
  };
}

/**
 * Tras el suspense: si el participante tiene vídeo personal asignado,
 * se reproduce como presentación antes de la pregunta.
 */
export function startReboundVideo(state: GameState): GameState {
  if (state.phase !== "reboundSuspense") return state;
  return { ...state, phase: "reboundVideo" };
}

/**
 * Arranca la pregunta del rebote (cronómetro de 30 s reales).
 * Se llama al terminar el vídeo, o directamente tras el suspense si el
 * participante aún no tiene vídeo asignado.
 */
export function startReboundQuestion(state: GameState, now: number): GameState {
  if (state.phase !== "reboundSuspense" && state.phase !== "reboundVideo") {
    return state;
  }
  // Se conserva la opción que falló Michel para mostrarla como descartada
  // durante la pregunta del rebote (freshRound la pondría a null).
  const failedOption = state.michelFailedOption;
  const next = freshRound(
    { ...state, phase: "reboundQuestion" },
    state.activeParticipantId,
    REBOUND_SECONDS,
    now,
  );
  return { ...next, michelFailedOption: failedOption };
}

export function answerRebound(
  state: GameState,
  optionIndex: number,
  isCorrect: boolean,
): GameState {
  if (state.phase !== "reboundQuestion" || state.selectedOption !== null) return state;
  if (isCorrect) {
    return {
      ...addPoints(state, state.activeParticipantId),
      phase: "reveal",
      selectedOption: optionIndex,
      wasCorrect: true,
      reboundStolen: true,
      reboundsWon: state.reboundsWon + 1,
      deadline: null,
    };
  }
  return {
    ...state,
    phase: "reveal",
    selectedOption: optionIndex,
    wasCorrect: false,
    reboundStolen: false,
    deadline: null,
  };
}

/** Se agotaron los 30 s del rebote. */
export function expireReboundTimer(state: GameState): GameState {
  if (state.phase !== "reboundQuestion" || state.selectedOption !== null) return state;
  return {
    ...state,
    phase: "reveal",
    selectedOption: null,
    wasCorrect: false,
    reboundStolen: false,
    deadline: null,
  };
}

/**
 * Avance MANUAL del organizador. Tras la pregunta 10 → clasificación final.
 * Regla inalterable: todas las rondas empiezan con Michel.
 */
export function nextQuestion(state: GameState, now: number): GameState {
  if (state.phase !== "reveal") return state;
  if (state.questionIndex + 1 >= TOTAL_QUESTIONS) {
    return {
      ...state,
      phase: "final",
      finishedAt: now,
      deadline: null,
      selectedOption: null,
      wasCorrect: null,
      reboundStolen: false,
    };
  }
  const advanced: GameState = {
    ...state,
    phase: "michel",
    questionIndex: state.questionIndex + 1,
  };
  return freshRound(advanced, MICHEL_ID, MICHEL_SECONDS, now);
}

export function resetGame(state: GameState): GameState {
  return createInitialState(Object.keys(state.scores));
}

/** Clasificación ordenada de mayor a menor; empates comparten posición. */
export function rankParticipants(
  participants: Participant[],
  scores: Record<string, ScoreEntry>,
): RankedParticipant[] {
  const rows: RankedParticipant[] = participants.map((p) => ({
    participant: p,
    points: scores[p.id]?.points ?? 0,
    correct: scores[p.id]?.correct ?? 0,
    position: 0,
  }));
  rows.sort(
    (a, b) =>
      b.points - a.points ||
      b.correct - a.correct ||
      a.participant.name.localeCompare(b.participant.name, "es"),
  );
  let position = 0;
  let lastPoints = -1;
  rows.forEach((row, i) => {
    if (row.points !== lastPoints) {
      position = i + 1;
      lastPoints = row.points;
    }
    row.position = position;
  });
  return rows;
}

export function totalPointsAwarded(scores: Record<string, ScoreEntry>): number {
  return Object.values(scores).reduce((acc, s) => acc + s.points, 0);
}
