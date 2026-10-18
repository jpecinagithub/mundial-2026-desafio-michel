import { useState } from "react";
import type { Participant } from "../types/game";

interface Props {
  participant: Participant;
  size?: number;
  /** Resalta a Michel con un anillo dorado. */
  ring?: "gold" | "none";
  className?: string;
}

/**
 * Foto circular del participante. Si el archivo aún no existe (las fotos
 * las proporciona el usuario después), muestra un avatar con las iniciales.
 * Nunca se inventan fotografías ni se usan imágenes genéricas.
 */
export function ParticipantPhoto({ participant, size = 96, ring = "none", className = "" }: Props) {
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size };

  if (failed) {
    const initials = participant.name
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    return (
      <div
        className={`avatar avatar-fallback avatar-ring-${ring} ${className}`}
        style={style}
        role="img"
        aria-label={participant.name}
      >
        <span aria-hidden="true">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={participant.photo}
      alt={`Fotografía de ${participant.name}`}
      style={style}
      draggable={false}
      className={`avatar avatar-photo avatar-ring-${ring} ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
