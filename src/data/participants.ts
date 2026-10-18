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
 * Para añadir el vídeo personal de rebote de un participante:
 *  1. Copia el archivo a public/videos/rebote-<id>.mp4
 *  2. Añade `reboundVideo: "/videos/rebote-<id>.mp4"` a su entrada.
 * Sin `reboundVideo`, el rebote salta la fase de vídeo y va directo a la
 * pregunta (no se rompe nada).
 */
export const PARTICIPANTS: Participant[] = [
  { id: "michel", name: "Michel", photo: "/participants/michel.png", isProtagonist: true },
  { id: "anselmo", name: "Anselmo", photo: "/participants/anselmo.png", reboundVideo: "/videos/rebote-setas.mp4" },
  { id: "juampi", name: "Juampi", photo: "/participants/juampi.png", reboundVideo: "/videos/rebote-monopoly.mp4" },
  { id: "alfonso", name: "Alfonso", photo: "/participants/alfonso.png", reboundVideo: "/videos/rebote-tenis.mp4" },
  { id: "mariano", name: "Mariano", photo: "/participants/mariano.png", reboundVideo: "/videos/rebote-fumador.mp4" },
  { id: "gabi", name: "Gabi", photo: "/participants/gabi.png", reboundVideo: "/videos/rebote-hacker.mp4" },
  { id: "pablo", name: "Pablo", photo: "/participants/pablo.png", reboundVideo: "/videos/rebote-ciclismo.mp4" },
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
