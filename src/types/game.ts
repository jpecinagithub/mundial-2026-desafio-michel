export interface Participant {
  id: string;
  name: string;
  /**
   * Ruta del archivo en /public, p. ej. "/participants/michel.jpg".
   * El nombre del archivo identifica al participante. Si el archivo no
   * existe (aún), se muestra un avatar con las iniciales: nunca se inventan
   * fotografías ni se usan imágenes genéricas.
   */
  photo: string;
  isProtagonist?: boolean;
}

export interface QuestionSource {
  label: string;
  url: string;
}

export interface VideoClip {
  /**
   * Estructura RESERVADA para futuros clips de vídeo cortos (~8 s)
   * asociados a preguntas concretas. Funcionalidad NO desarrollada todavía:
   * este campo solo deja preparado el modelo de datos.
   */
  src: string;
  durationSeconds: number;
  poster?: string;
}

export interface Question {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  sources: QuestionSource[];
  /**
   * Solo si la imagen es verdaderamente relevante para el hecho preguntado
   * y su licencia de uso está clara y documentada. En caso contrario la
   * pregunta va sin imagen.
   */
  image?: string;
  imageCredit?: string;
  videoClip?: VideoClip;
}

/**
 * Máquina de estados del concurso:
 * welcome → michel → (reveal | reboundSelect → rebound → reveal) → … → final
 */
export type Phase =
  | "welcome"
  | "michel"
  | "reboundSelect"
  | "rebound"
  | "reveal"
  | "final";

export interface ScoreEntry {
  points: number;
  correct: number;
}

export interface GameState {
  phase: Phase;
  /** Índice de la pregunta actual: 0..9 */
  questionIndex: number;
  scores: Record<string, ScoreEntry>;
  /** Quién responde ahora: "michel" o el id del participante del rebote. */
  activeParticipantId: string;
  /**
   * Opción que falló Michel (se muestra como descartada en el rebote)
   * o null si agotó su tiempo sin responder.
   */
  michelFailedOption: number | null;
  /** Opción elegida por quien responde (para mostrarla), o null. */
  selectedOption: number | null;
  wasCorrect: boolean | null;
  /** true cuando el rebote se acertó arrebatándole los puntos a Michel. */
  reboundStolen: boolean;
  michelCorrect: number;
  reboundsOffered: number;
  reboundsWon: number;
  /** Timestamp absoluto (ms) del fin del cronómetro, o null si no hay. */
  deadline: number | null;
  /** Duración del cronómetro actual en segundos (60 o 30). */
  timerSeconds: number;
  startedAt: number | null;
  finishedAt: number | null;
}

export interface RankedParticipant {
  participant: Participant;
  points: number;
  correct: number;
  /** Posición con empates compartidos (1, 2, 2, 4…). */
  position: number;
}
