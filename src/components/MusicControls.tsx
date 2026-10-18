interface Props {
  volume: number;
  muted: boolean;
  onVolume: (v: number) => void;
  onToggleMute: () => void;
}

/** Control de volumen + silencio. Visible en todo momento. */
export function MusicControls({ volume, muted, onVolume, onToggleMute }: Props) {
  return (
    <div className="music-controls" role="group" aria-label="Control de música">
      <button
        type="button"
        className="music-mute-btn"
        onClick={onToggleMute}
        aria-label={muted ? "Activar música" : "Silenciar música"}
        aria-pressed={muted}
        title={muted ? "Activar música" : "Silenciar música"}
      >
        {muted ? (
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              fill="currentColor"
              d="M3 9v6h4l5 5V4L7 9H3zm13.6 3 2.5-2.5-1.4-1.4-2.5 2.5-2.5-2.5-1.4 1.4L13.8 12l-2.5 2.5 1.4 1.4 2.5-2.5 2.5 2.5 1.4-1.4-2.5-2.5z"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              fill="currentColor"
              d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"
            />
          </svg>
        )}
      </button>
      <input
        type="range"
        min={0}
        max={100}
        value={muted ? 0 : volume}
        onChange={(e) => onVolume(Number(e.target.value))}
        className="music-volume"
        aria-label="Volumen de la música"
      />
    </div>
  );
}
