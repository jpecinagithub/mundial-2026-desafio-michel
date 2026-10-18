import { MusicControls } from "./MusicControls";

interface Props {
  volume: number;
  muted: boolean;
  onVolume: (v: number) => void;
  onToggleMute: () => void;
  onRestart?: () => void;
}

/** Barra superior: título compacto, controles de música y reinicio. */
export function TopBar({ volume, muted, onVolume, onToggleMute, onRestart }: Props) {
  return (
    <header className="topbar">
      <span className="topbar-title" aria-label="El desafío de Michel">
        🏆 <span>DESAFÍO DE MICHEL</span>
      </span>
      <div className="topbar-actions">
        {onRestart && (
          <button
            type="button"
            className="topbar-restart"
            onClick={onRestart}
            title="Reiniciar la partida"
          >
            ↺ Reiniciar
          </button>
        )}
        <MusicControls
          volume={volume}
          muted={muted}
          onVolume={onVolume}
          onToggleMute={onToggleMute}
        />
      </div>
    </header>
  );
}
