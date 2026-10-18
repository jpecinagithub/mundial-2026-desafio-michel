import { useEffect, useRef } from "react";
import { sfxFanfare, useAudioEngine } from "../hooks/useAudio";
import type { GameApi } from "../hooks/useGame";
import { Confetti } from "../components/Confetti";
import { FinalPodium } from "../components/FinalPodium";
import { Footer } from "../components/Footer";
import { TopBar } from "../components/TopBar";

type AudioEngine = ReturnType<typeof useAudioEngine>;

interface Props {
  game: GameApi;
  audio: AudioEngine;
}

export function FinalScreen({ game, audio }: Props) {
  const { state, ranking, totalPoints } = game;

  // Fanfarria original al llegar a la clasificación (una sola vez).
  const fanfareRef = useRef(false);
  useEffect(() => {
    if (!fanfareRef.current) {
      fanfareRef.current = true;
      sfxFanfare();
    }
  }, []);

  const handleRestart = () => {
    if (window.confirm("¿Jugar de nuevo? Se reiniciarán todas las puntuaciones.")) {
      game.reset();
    }
  };

  return (
    <div className="app">
      <Confetti />
      <TopBar
        volume={audio.volume}
        muted={audio.muted}
        onVolume={audio.setVolume}
        onToggleMute={audio.toggleMute}
      />

      <main className="container">
        <h1 className="final-title card-anim">🏆 CLASIFICACIÓN FINAL — MUNDIAL 2026</h1>
        <FinalPodium
          ranking={ranking}
          stats={{
            michelCorrect: state.michelCorrect,
            reboundsOffered: state.reboundsOffered,
            reboundsWon: state.reboundsWon,
            totalPoints,
          }}
          onRestart={handleRestart}
        />
      </main>

      <Footer />
    </div>
  );
}
