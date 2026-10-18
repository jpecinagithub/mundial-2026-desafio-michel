import type { Participant } from "../types/game";

/**
 * Plantilla de participantes.
 *
 * El usuario proporcionará las fotografías DESPUÉS de construir la app.
 * Convención: el NOMBRE DEL ARCHIVO identifica al participante y los
 * archivos viven en /public/participants/ (p. ej. "michel.jpg" → Michel).
 *
 * Para añadir un participante nuevo (si llegan más fotos):
 *  1. Copia el archivo a public/participants/<id>.jpg
 *  2. Añade una entrada a este array con ese mismo id y nombre.
 *
 * Si falta la foto de alguien, la app muestra automáticamente un avatar
 * con sus iniciales: NUNCA se inventan fotografías ni se usan genéricas.
 */
export const PARTICIPANTS: Participant[] = [
  { id: "michel", name: "Michel", photo: "/participants/michel.jpg", isProtagonist: true },
  { id: "anselmo", name: "Anselmo", photo: "/participants/anselmo.jpg" },
  { id: "juampi", name: "Juampi", photo: "/participants/juampi.jpg" },
  { id: "alfonso", name: "Alfonso", photo: "/participants/alfonso.jpg" },
  { id: "mariano", name: "Mariano", photo: "/participants/mariano.jpg" },
  { id: "gabi", name: "Gabi", photo: "/participants/gabi.jpg" },
  { id: "pablo", name: "Pablo", photo: "/participants/pablo.jpg" },
];

export function getParticipant(id: string): Participant | undefined {
  return PARTICIPANTS.find((p) => p.id === id);
}

export function getProtagonist(): Participant {
  const michel = PARTICIPANTS.find((p) => p.isProtagonist) ?? PARTICIPANTS[0];
  if (!michel) throw new Error("La lista de participantes está vacía");
  return michel;
}

/** Rivales disponibles para el rebote (todos menos Michel). */
export function getReboundCandidates(): Participant[] {
  return PARTICIPANTS.filter((p) => !p.isProtagonist);
}
