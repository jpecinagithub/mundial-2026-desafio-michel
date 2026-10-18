import { useCallback } from "react";
import { sfxClick, useAudioEngine } from "./hooks/useAudio";
import { useGame } from "./hooks/useGame";
import { FinalScreen } from "./screens/FinalScreen";
import { GameScreen } from "./screens/GameScreen";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import "./index.css";

export default function App() {
  const game = useGame();
  const audio = useAudioEngine();

  // El gesto del usuario en "Comenzar" permite arrancar el AudioContext
  // (los navegadores lo exigen) y con él la música en bucle.
  const handleStart = useCallback(() => {
    sfxClick();
    audio.startMusic();
    game.start();
  }, [audio, game]);

  const phase = game.state.phase;

  if (phase === "welcome") {
    return <WelcomeScreen audio={audio} onStart={handleStart} />;
  }
  if (phase === "final") {
    return <FinalScreen game={game} audio={audio} />;
  }
  return <GameScreen game={game} audio={audio} />;
}
