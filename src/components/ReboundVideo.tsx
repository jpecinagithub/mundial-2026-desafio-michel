import { useEffect, useRef, useState } from "react";
import { startMusic, stopMusic } from "../hooks/useAudio";
import type { Participant } from "../types/game";

interface Props {
  participant: Participant;
  onDone: () => void;
}

/**
 * Presenta al participante del rebote con su vídeo personal.
 * Al terminar el vídeo se avanza automáticamente; hay botón discreto
 * para saltarlo. Si el participante no tiene vídeo asignado, no se
 * rompe el flujo: se avanza de inmediato a la pregunta.
 *
 * Autoplay con sonido: los navegadores lo bloquean sin gesto del usuario.
 * Se intenta con sonido y, si la promesa se rechaza, se reproduce
 * silenciado mostrando un botón «Activar sonido».
 */
export function ReboundVideo({ participant, onDone }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mutedFallback, setMutedFallback] = useState(false);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDoneRef.current();
  };

  const hasVideo = !!participant.reboundVideo;

  useEffect(() => {
    if (!hasVideo) {
      // Sin vídeo asignado: no bloquear el concurso.
      finish();
      return;
    }
    // La música de fondo choca con el audio del vídeo: se pausa aquí y
    // se reanuda al salir de la fase.
    stopMusic();
    const v = videoRef.current;
    if (!v) return;
    let cancelled = false;
    const tryWithSound = v.play();
    if (tryWithSound) {
      tryWithSound.catch(() => {
        if (cancelled) return;
        v.muted = true;
        setMutedFallback(true);
        v.play().catch(() => {
          /* ni silenciado arranca: el organizador puede saltar el vídeo */
        });
      });
    }
    const onEnded = () => finish();
    v.addEventListener("ended", onEnded);
    return () => {
      cancelled = true;
      v.removeEventListener("ended", onEnded);
      v.pause();
      startMusic();
    };
    // Se monta una sola vez por fase.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enableSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    setMutedFallback(false);
    v.play().catch(() => {
      v.muted = true;
      setMutedFallback(true);
    });
  };

  if (!hasVideo) return null;

  return (
    <section
      className="rebound-video card-anim"
      aria-label={`Presentación de ${participant.name}`}
    >
      <h2 className="rebound-video-title">¡{participant.name} acepta el desafío!</h2>
      <div className="rebound-video-frame">
        <video
          ref={videoRef}
          src={participant.reboundVideo}
          className="rebound-video-el"
          playsInline
          preload="auto"
          onError={finish}
        />
        {mutedFallback && (
          <button
            type="button"
            className="btn-primary rebound-video-unmute"
            onClick={enableSound}
          >
            🔊 Activar sonido
          </button>
        )}
      </div>
      <button type="button" className="rebound-video-skip" onClick={finish}>
        Saltar vídeo →
      </button>
    </section>
  );
}
