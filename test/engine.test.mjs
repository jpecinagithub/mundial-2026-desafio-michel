// Test del motor del concurso (máquina de estados pura de src/game/engine.ts).
// Cubre los escenarios de validación del spec que dependen del motor:
//  1. Michel acierta → exactamente +50.
//  2. Michel falla → rebote sin revelar la respuesta.
//  3. Michel agota sus 60 s → rebote.
//  4. El reboteado acierta en sus 30 s → +50.
//  5. El reboteado falla → +0 y se revela.
//  6. Se agotan los 30 s del rebote → +0 y se revela.
//  7. Todas las rondas empiezan con Michel.
//  8. Sin puntos duplicados (doble pulsación; respuesta tras fin de tiempo).
//  9. Exactamente 10 preguntas.
// 10. Clasificación ordenada con empates en la misma posición.
// 11. Guardas de fase (transiciones inválidas no cambian el estado).
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const engine = require(join(root, "test", ".engine.bundle.cjs"));

const IDS = ["michel", "anselmo", "juampi", "alfonso", "mariano", "gabi", "pablo"];
let passed = 0;
let failed = 0;

function check(cond, msg) {
  if (!cond) {
    failed++;
    console.error("✗ FALLO: " + msg);
    process.exitCode = 1;
  } else {
    passed++;
    console.log("✓ " + msg);
  }
}

const pts = (s, id) => s.scores[id].points;
const now = 1_000_000;

// --- Escenario 1: Michel acierta → +50 exactos --------------------------------
{
  let s = engine.startGame(engine.createInitialState(IDS), now);
  check(s.phase === "michel", "1a. startGame deja la fase en 'michel'");
  check(s.deadline === now + 60_000, "1b. el cronómetro de Michel son 60 s reales");
  s = engine.answerMichel(s, 2, true);
  check(s.phase === "reveal", "1c. tras acertar se pasa a 'reveal'");
  check(pts(s, "michel") === 50, "1d. Michel recibe exactamente 50 puntos");
  check(s.michelCorrect === 1, "1e. contador de aciertos de Michel = 1");
  check(s.deadline === null, "1f. el cronómetro se detiene al responder");
}

// --- Escenario 8 (doble pulsación): la 2ª respuesta se ignora ---------------
{
  let s = engine.startGame(engine.createInitialState(IDS), now);
  s = engine.answerMichel(s, 0, true);
  const s2 = engine.answerMichel(s, 1, true);
  check(s2 === s, "8a. responder dos veces: la segunda se ignora (mismo objeto)");
  check(pts(s2, "michel") === 50, "8b. sin puntos duplicados: sigue en 50");
}

// --- Escenario 2: Michel falla → rebote sin revelar ---------------------------
{
  let s = engine.startGame(engine.createInitialState(IDS), now);
  s = engine.answerMichel(s, 2, false);
  check(s.phase === "reboundSelect", "2a. al fallar se abre la selección de rebote");
  check(s.michelFailedOption === 2, "2b. la opción fallida queda marcada como descartada");
  check(pts(s, "michel") === 0, "2c. Michel no gana puntos");
  check(s.reboundsOffered === 1, "2d. contador de rebotes ofrecidos = 1");
  check(s.deadline === null, "2e. el cronómetro se detiene al fallar");
}

// --- Escenario 3: Michel agota los 60 s --------------------------------------
{
  let s = engine.startGame(engine.createInitialState(IDS), now);
  s = engine.expireMichelTimer(s);
  check(s.phase === "reboundSelect", "3a. al agotarse el tiempo se abre el rebote");
  check(s.michelFailedOption === null, "3b. sin opción descartada (no respondió)");
  check(s.reboundsOffered === 1, "3c. el tiempo agotado también cuenta como rebote ofrecido");
}

// --- Escenario 11: la selección de rebote es manual y validada ----------------
{
  let s = engine.startGame(engine.createInitialState(IDS), now);
  s = engine.answerMichel(s, 0, false);
  const bad1 = engine.selectRebounder(s, "michel", now);
  check(bad1 === s, "11a. no se puede elegir a Michel para el rebote");
  const bad2 = engine.selectRebounder(s, "inexistente", now);
  check(bad2 === s, "11b. no se puede elegir un participante inexistente");
  s = engine.selectRebounder(s, "juampi", now + 5000);
  check(s.phase === "rebound", "11c. el organizador elige manualmente al participante");
  check(s.activeParticipantId === "juampi", "11d. el participante activo es el elegido");
  check(s.deadline === now + 5000 + 30_000, "11e. el cronómetro del rebote son 30 s reales");
}

// --- Escenario 4: el reboteado acierta ----------------------------------------
{
  let s = engine.startGame(engine.createInitialState(IDS), now);
  s = engine.answerMichel(s, 1, false);
  s = engine.selectRebounder(s, "gabi", now);
  s = engine.answerRebound(s, 3, true);
  check(s.phase === "reveal", "4a. tras el acierto del rebote se revela");
  check(pts(s, "gabi") === 50, "4b. el participante del rebote gana 50 puntos");
  check(pts(s, "michel") === 0, "4c. Michel sigue a 0");
  check(s.reboundStolen === true, "4d. los puntos constan como arrebatados a Michel");
  check(s.reboundsWon === 1, "4e. contador de rebotes acertados = 1");
}

// --- Escenario 5: el reboteado falla ------------------------------------------
{
  let s = engine.startGame(engine.createInitialState(IDS), now);
  s = engine.answerMichel(s, 0, false);
  s = engine.selectRebounder(s, "pablo", now);
  s = engine.answerRebound(s, 2, false);
  check(s.phase === "reveal", "5a. tras el fallo del rebote se revela");
  check(pts(s, "pablo") === 0, "5b. el participante del rebote no gana puntos");
  check(s.wasCorrect === false, "5c. wasCorrect = false");
}

// --- Escenario 6: se agotan los 30 s del rebote --------------------------------
{
  let s = engine.startGame(engine.createInitialState(IDS), now);
  s = engine.answerMichel(s, 0, false);
  s = engine.selectRebounder(s, "alfonso", now);
  const before = s;
  s = engine.expireReboundTimer(s);
  check(s.phase === "reveal", "6a. al agotarse los 30 s se revela la respuesta");
  check(pts(s, "alfonso") === 0, "6b. sin puntos por tiempo agotado");
  check(s.selectedOption === null, "6c. no hay opción seleccionada");
  // Carrera respuesta vs. fin de tiempo: si ya respondió, expirar no hace nada
  let s2 = engine.answerRebound(before, 0, true);
  const s3 = engine.expireReboundTimer(s2);
  check(s3 === s2 && pts(s3, "alfonso") === 50, "6d. expirar tras responder no quita ni duplica puntos");
}

// --- Escenario 7: todas las rondas empiezan con Michel --------------------------
{
  let s = engine.startGame(engine.createInitialState(IDS), now);
  s = engine.answerMichel(s, 0, false);
  s = engine.selectRebounder(s, "juampi", now);
  s = engine.answerRebound(s, 1, true); // Juampi arrebata los puntos…
  s = engine.nextQuestion(s, now + 1000);
  check(s.phase === "michel", "7a. la siguiente ronda vuelve a la fase 'michel'");
  check(s.activeParticipantId === "michel", "7b. …y la empieza Michel aunque otro acertara el rebote");
  check(s.questionIndex === 1, "7c. se avanza a la pregunta 2");
}

// --- Escenario 9: exactamente 10 preguntas --------------------------------------
{
  let s = engine.startGame(engine.createInitialState(IDS), now);
  for (let q = 0; q < 10; q++) {
    check(s.questionIndex === q, `9a. ronda ${q + 1}: índice de pregunta = ${q}`);
    const michelOk = q % 2 === 0;
    s = engine.answerMichel(s, 0, michelOk);
    if (!michelOk) {
      // Al fallar hay que completar el rebote antes de poder avanzar.
      s = engine.selectRebounder(s, "juampi", now + q * 1000);
      s = engine.answerRebound(s, 1, false);
    }
    s = engine.nextQuestion(s, now + q * 1000);
  }
  check(s.phase === "final", "9b. tras la 10ª pregunta se llega a la clasificación final");
  check(s.finishedAt !== null, "9c. queda registrada la hora de fin");
  const s2 = engine.nextQuestion(s, now);
  check(s2 === s, "9d. en 'final' no se puede avanzar más");
}

// --- Escenario 10: clasificación ordenada con empates ---------------------------
{
  let s = engine.startGame(engine.createInitialState(IDS), now);
  // Michel: 2 aciertos (100). Juampi: 1 rebote (50). Gabi: 1 rebote (50). Resto: 0.
  const steps = [
    ["michel", 0, true, null],
    ["michel", 0, true, null],
    ["michel", 0, false, "juampi"],
    ["michel", 0, false, "gabi"],
  ];
  let t = now;
  for (const [who, opt, ok, reb] of steps) {
    if (who === "michel") s = engine.answerMichel(s, opt, ok);
    if (reb) {
      s = engine.selectRebounder(s, reb, t);
      s = engine.answerRebound(s, 1, true);
    }
    s = engine.nextQuestion(s, t);
    t += 1000;
  }
  const ranking = engine.rankParticipants(
    IDS.map((id) => ({ id, name: id, photo: "" })),
    s.scores,
  );
  check(ranking[0].participant.id === "michel" && ranking[0].points === 100, "10a. primero: Michel con 100");
  check(ranking[0].position === 1, "10b. posición 1 para el líder");
  const tied = ranking.filter((r) => r.points === 50);
  check(tied.length === 2, "10c. dos participantes empatados con 50 puntos");
  check(tied[0].position === 2 && tied[1].position === 2, "10d. los empatados comparten la posición 2");
  check(ranking[3].position === 4, "10e. tras el empate se salta a la posición 4");
  check(engine.totalPointsAwarded(s.scores) === 200, "10f. total repartido = 200 puntos");
}

// --- Escenario 11 (guardas): transiciones inválidas ----------------------------
{
  const s = engine.createInitialState(IDS);
  check(engine.answerMichel(s, 0, true) === s, "11c. no se puede responder en 'welcome'");
  check(engine.expireMichelTimer(s) === s, "11d. no expira ningún cronómetro en 'welcome'");
  check(engine.selectRebounder(s, "juampi", now) === s, "11e. no hay selección de rebote en 'welcome'");
  check(engine.nextQuestion(s, now) === s, "11f. no se avanza en 'welcome'");
  let s2 = engine.startGame(engine.createInitialState(IDS), now);
  check(engine.answerRebound(s2, 0, true) === s2, "11g. no se puede responder un rebote en el turno de Michel");
  check(engine.expireReboundTimer(s2) === s2, "11h. no expira el rebote en el turno de Michel");
}

console.log(`\n${passed} comprobaciones superadas, ${failed} fallidas.`);
