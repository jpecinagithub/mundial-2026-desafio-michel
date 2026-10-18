import type { Question } from "../types/game";
import { TOTAL_QUESTIONS } from "../game/engine";

/**
 * ⚠️ CONTENIDO PROVISIONAL — PENDIENTE DE LA INVESTIGACIÓN DOCUMENTAL ⚠️
 *
 * Las 10 preguntas finales (hechos reales y verificados del Mundial 2026,
 * con fuentes) sustituirán a estos marcadores. La estructura ya es la
 * definitiva: para corregir, sustituir o añadir preguntas basta con editar
 * este archivo.
 *
 * Formato de cada pregunta:
 *  - id: identificador único ("q1" … "q10")
 *  - question: enunciado
 *  - options: exactamente 4 alternativas (tupla)
 *  - correctIndex: 0=A, 1=B, 2=C, 3=D (repartir sin patrones evidentes)
 *  - explanation: breve explicación del dato
 *  - sources: [{ label, url }] — fuente documental verificable
 *  - image / imageCredit: SOLO si la imagen es verdaderamente relevante
 *    para el hecho preguntado y su licencia está clara y documentada.
 *  - videoClip: estructura reservada para futuros clips de ~8 s
 *    (funcionalidad NO desarrollada todavía).
 */
function placeholder(id: string, n: number): Question {
  return {
    id,
    question: `PREGUNTA ${n} PENDIENTE DE INVESTIGACIÓN — será sustituida por un hecho real verificado del Mundial 2026.`,
    options: ["Opción A pendiente", "Opción B pendiente", "Opción C pendiente", "Opción D pendiente"],
    correctIndex: 0,
    explanation: "Pendiente de investigación documental.",
    sources: [],
  };
}

export const QUESTIONS: Question[] = Array.from(
  { length: TOTAL_QUESTIONS },
  (_, i) => placeholder(`q${i + 1}`, i + 1),
);
