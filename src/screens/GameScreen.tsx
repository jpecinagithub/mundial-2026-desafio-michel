import { useCallback, useEffect, useRef, useState } from "react";
import { PARTICIPANTS, getProtagonist, getReboundCandidates } from "../data/participants";
import { useCountdown } from "../hooks/useCountdown";
import { sfxCorrect, sfxRebound, sfxTimeout, sfxWrong, useAudioEngine } from "../hooks/useAudio";
import type { GameApi } from "../hooks/useGame";
import { AnswerOptions } from "../components/AnswerOptions";
import { CountdownTimer } from "../components/CountdownTimer";
import { Footer } from "../components/Footer";
import { ParticipantPhoto } from "../components/ParticipantPhoto";
import { ReboundSelection } from "../components/ReboundSelection";
import { RevealCard } from "../components/RevealCard";
import { Scoreboard } from "../components/Scoreboard";
import { TopBar } from "../components/TopBar";
import { TOTAL_QUESTIONS } from "../game/engine";

type AudioEngine = ReturnType<typeof useAudioEngine>;

interface Props {
  game: GameApi;
  audio: AudioEngine;
}

function ReboundSelectWrap({ game }: { game: GameApi }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <ReboundSelection
      candidates={getReboundCandidates()}
      selectedId={selectedId}
      onSelect={setSelectedId}
      onConfirm={() => {
        if (selectedId) game.selectRebounder(selectedId);
      }}
    />
  );
}

export function GameScreen({ game, audio }: Props) {
  const { state, question, ranking } = game;
  const { expireMichel, expireRebound } = game;
  const phase = state.phase;

  // El fin del tiempo se gestiona con el timestamp absoluto: suena el aviso
  // y el motor aplica la regla (rebote o revelado). Si la respuesta llegó
  // justo antes, el motor ignora el evento expirado (sin puntos duplicados).
  const phaseRef = useRef(phase);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase ]);
  const handleExpire = useCallback(() => {
    const p = phaseRef.current;
    if (p === "michel") {
      sfxTimeout();
      expireMichel();
    } else if (p === "rebound") {
      sfxTimeout();
      expireRebound();
    }
  }, [expireMichel, expireRebound]);

  const remainingMs = useCountdown(
    phase === "michel" || phase === "rebound" ? state.deadline : null,
    handleExpire,
    true,
  );

  // Efectos de sonido en las transiciones de fase.
  const prevPhaseRef = useRef(phase);
  useEffect(() => {
    const prev = prevPhaseRef.current;
    if (phase !== prev) {
      if (phase === "reboundSelect") sfxRebound();
      if (phase === "reveal") {
        if (state.wasCorrect) sfxCorrect();
        else sfxWrong();
      }
    }
    prevPhaseRef.current = phase;
  });

  const handleRestart = useCallback(() => {
    if (window.confirm("¿Reiniciar la partida? Se perderán las puntuaciones actuales.")) {
      game.reset();
    }
  }, [game]);

  const isAnswering = phase === "michel" || phase === "rebound";
  const isRebound = phase === "rebound";
  const activeParticipant =
    PARTICIPANTS.find((p) => p.id === state.activeParticipantId) ?? getProtagonist();
  const rebounderName =
    state.activeParticipantId !== "michel" ? activeParticipant.name : null;

  return (
    <div className="app">
      <TopBar
        volume={audio.volume}
        muted={audio.muted}
        onVolume={audio.setVolume}
        onToggleMute={audio.toggleMute}
        onRestart={handleRestart}
      />

      <main className="container">
        {isAnswering && question && (
          <div className="game-layout" key={state.questionIndex}>
            <section
              className="game-main card-anim"
              aria-label={isRebound ? "Pregunta del rebote" : "Pregunta para Michel"}
            >
              <div className="round-badge">
                PREGUNTA {state.questionIndex + 1} DE {TOTAL_QUESTIONS}
              </div>
              <div className={`turn-label ${isRebound ? "turn-rebound" : "turn-michel"}`}>
                {isRebound
                  ? `¡REBOTE! · RESPONDE ${activeParticipant.name.toUpperCase()}`
                  : "TURNO DE MICHEL"}
              </div>
              <h2 className="question-text">{question.question}</h2>
              {question.image && (
                <figure className="question-figure">
                  <img src={question.image} alt="Imagen relacionada con la pregunta" />
                  {question.imageCredit && <figcaption>{question.imageCredit}</figcaption>}
                </figure>
              )}
              <AnswerOptions
                question={question}
                mode="answer"
                selectedOption={null}
                discardedIndex={isRebound ? state.michelFailedOption : null}
                onSelect={isRebound ? game.answerRebound : game.answerMichel}
              />
            </section>

            <aside className="game-aside">
              <div className="player-card">
                <ParticipantPhoto
                  participant={activeParticipant}
                  size={120}
                  ring={activeParticipant.isProtagonist ? "gold" : "none"}
                />
                <div className="player-name">{activeParticipant.name}</div>
                {activeParticipant.isProtagonist ? (
                  <div className="player-badge">★ PROTAGONISTA</div>
                ) : (
                  <div className="player-badge player-badge-rival">⚡ REBOTE</div>
                )}
              </div>
              <CountdownTimer remainingMs={remainingMs} totalMs={state.timerSeconds * 1000} />
              <Scoreboard ranking={ranking} activeId={state.activeParticipantId} />
            </aside>
          </div>
        )}

        {phase === "reboundSelect" && (
          <ReboundSelectWrap key={state.questionIndex} game={game} />
        )}

        {phase === "reveal" && question && (
          <RevealCard
            question={question}
            selectedOption={state.selectedOption}
            wasCorrect={state.wasCorrect}
            reboundStolen={state.reboundStolen}
            rebounderName={rebounderName}
            isLast={state.questionIndex === TOTAL_QUESTIONS - 1}
            onNext={game.next}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
