import { useCallback, useEffect, useMemo, useState } from "react";
import { PARTICIPANTS } from "../data/participants";
import { QUESTIONS } from "../data/questions";
import * as engine from "../game/engine";
import type { GameState, Phase } from "../types/game";

const STORAGE_KEY = "desafio-michel:game:v1";

function freshState(): GameState {
  return engine.createInitialState(PARTICIPANTS.map((p) => p.id));
}

const PHASES: Phase[] = ["welcome", "michel", "reboundSelect", "rebound", "reveal", "final"];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

/** Valida y normaliza el estado guardado; devuelve null si está corrupto. */
function sanitize(raw: unknown): GameState | null {
  if (!isRecord(raw)) return null;
  if (!PHASES.includes(raw.phase as Phase)) return null;
  if (typeof raw.questionIndex !== "number" || raw.questionIndex < 0 || raw.questionIndex > 9) {
    return null;
  }
  if (!isRecord(raw.scores)) return null;
  const ids = PARTICIPANTS.map((p) => p.id);
  for (const id of ids) {
    const e = (raw.scores as Record<string, unknown>)[id];
    if (!isRecord(e) || typeof e.points !== "number" || typeof e.correct !== "number") return null;
  }
  const num = (v: unknown, fallback: number): number =>
    typeof v === "number" && Number.isFinite(v) ? v : fallback;
  const base = engine.createInitialState(ids);
  return {
    ...base,
    phase: raw.phase as Phase,
    questionIndex: Math.floor(raw.questionIndex as number),
    scores: raw.scores as GameState["scores"],
    activeParticipantId:
      typeof raw.activeParticipantId === "string" && ids.includes(raw.activeParticipantId)
        ? raw.activeParticipantId
        : engine.MICHEL_ID,
    michelFailedOption:
      typeof raw.michelFailedOption === "number" ? raw.michelFailedOption : null,
    selectedOption: typeof raw.selectedOption === "number" ? raw.selectedOption : null,
    wasCorrect: typeof raw.wasCorrect === "boolean" ? raw.wasCorrect : null,
    reboundStolen: raw.reboundStolen === true,
    michelCorrect: num(raw.michelCorrect, 0),
    reboundsOffered: num(raw.reboundsOffered, 0),
    reboundsWon: num(raw.reboundsWon, 0),
    deadline: typeof raw.deadline === "number" ? raw.deadline : null,
    timerSeconds: num(raw.timerSeconds, engine.MICHEL_SECONDS),
    startedAt: typeof raw.startedAt === "number" ? raw.startedAt : null,
    finishedAt: typeof raw.finishedAt === "number" ? raw.finishedAt : null,
  };
}

function loadInitial(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = sanitize(JSON.parse(raw));
      if (parsed) {
        // Sin tiempo adicional por recargar: si el cronómetro ya expiró
        // mientras la página estaba cerrada, se aplica la regla que toque.
        const now = Date.now();
        if (
          (parsed.phase === "michel" || parsed.phase === "rebound") &&
          parsed.deadline != null &&
          now >= parsed.deadline
        ) {
          return parsed.phase === "michel"
            ? engine.expireMichelTimer(parsed)
            : engine.expireReboundTimer(parsed);
        }
        return parsed;
      }
    }
  } catch {
    /* almacenamiento no disponible o corrupto: partida nueva */
  }
  return freshState();
}

export function useGame() {
  const [state, setState] = useState<GameState>(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* noop */
    }
  }, [state]);

  const start = useCallback(() => {
    setState((s) => engine.startGame(s, Date.now()));
  }, []);

  const answerMichel = useCallback((optionIndex: number) => {
    setState((s) => {
      const q = QUESTIONS[s.questionIndex];
      if (!q) return s;
      return engine.answerMichel(s, optionIndex, q.correctIndex === optionIndex);
    });
  }, []);

  const expireMichel = useCallback(() => {
    setState((s) => engine.expireMichelTimer(s));
  }, []);

  const selectRebounder = useCallback((participantId: string) => {
    setState((s) => engine.selectRebounder(s, participantId, Date.now()));
  }, []);

  const answerRebound = useCallback((optionIndex: number) => {
    setState((s) => {
      const q = QUESTIONS[s.questionIndex];
      if (!q) return s;
      return engine.answerRebound(s, optionIndex, q.correctIndex === optionIndex);
    });
  }, []);

  const expireRebound = useCallback(() => {
    setState((s) => engine.expireReboundTimer(s));
  }, []);

  const next = useCallback(() => {
    setState((s) => engine.nextQuestion(s, Date.now()));
  }, []);

  const reset = useCallback(() => {
    setState((s) => engine.resetGame(s));
  }, []);

  const ranking = useMemo(
    () => engine.rankParticipants(PARTICIPANTS, state.scores),
    [state.scores],
  );

  const question = QUESTIONS[state.questionIndex];
  if (QUESTIONS.length !== engine.TOTAL_QUESTIONS) {
    console.warn(
      `[desafío-michel] Se esperaban ${engine.TOTAL_QUESTIONS} preguntas y hay ${QUESTIONS.length}.`,
    );
  }

  return {
    state,
    ranking,
    question,
    totalPoints: engine.totalPointsAwarded(state.scores),
    start,
    answerMichel,
    expireMichel,
    selectRebounder,
    answerRebound,
    expireRebound,
    next,
    reset,
  };
}

export type GameApi = ReturnType<typeof useGame>;
