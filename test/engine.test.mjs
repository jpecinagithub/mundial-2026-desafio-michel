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
// 11. El sorteo del rebote es válido (nunca Michel).
// 12. Flujo de presentación del rebote (suspense → vídeo → pregunta).
// 13. Guardas de fase (transiciones inválidas no cambian el estado).
// 14. Sorteo sin repetición: el bombo no repite hasta agotarse, se
//     reinicia tras 6 sorteos y con partida nueva.
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const engine = require(join(root, "test", ".engine.bundle.cjs"));

const IDS = ["michel", "anselmo", "juampi", "alfonso", "mariano", "gabi", "pablo"];
const CANDIDATES = IDS.filter((id) => id !== "michel");
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
// rng determinista que elige el candidato i-ésimo del bombo actual.
const pick = (i) => () => (i + 0.5) / CANDIDATES.length;

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

// --- Escenario 11: el sorteo del rebote es válido -----------------------------
{
  let s = engine.startGame(engine.createInitialState(IDS), now);
  s = engine.answerMichel(s, 0, false);
  s = engine.drawRebounder(s, pick(1));
  check(s.phase === "reboundSuspense", "11a. el sorteo entra en suspense");
  check(s.activeParticipantId === "juampi", "11b. con rng fijo sale el candidato esperado");
  check(
    s.usedRebounders.length === 1 && s.usedRebounders[0] === "juampi",
    "11c. el sorteado queda registrado en el bombo",
  );
  check(s.deadline === null, "11d. durante el suspense no corre el cronómetro de respuesta");
  s = engine.startReboundQuestion(s, now + 5000);
  check(s.phase === "reboundQuestion", "11e. tras el suspense arranca la pregunta del rebote");
  check(s.deadline === now + 5000 + 30_000, "11f. el cronómetro del rebote son 30 s reales desde la pregunta");
  // Guardas del sorteo.
  const g0 = engine.createInitialState(IDS);
  check(engine.drawRebounder(g0) === g0, "11g. no hay sorteo en 'welcome'");
}

// --- Escenario 12: flujo completo de presentación del rebote ------------------
{
  let s = engine.startGame(engine.createInitialState(IDS), now);
  s = engine.answerMichel(s, 2, false); // Michel falla la opción C
  s = engine.drawRebounder(s, pick(0));
  check(s.phase === "reboundSuspense", "12a. tras el sorteo se entra en suspense");
  check(s.activeParticipantId === "anselmo", "12b. el sorteado es el participante activo");
  check(s.michelFailedOption === 2, "12c. la opción fallida se conserva en el suspense");
  s = engine.startReboundVideo(s);
  check(s.phase === "reboundVideo", "12d. con vídeo asignado se presenta al participante");
  s = engine.startReboundQuestion(s, now + 15000);
  check(s.phase === "reboundQuestion", "12e. tras el vídeo arranca la pregunta");
  check(s.michelFailedOption === 2, "12f. la opción fallida sigue marcada como descartada");
  check(s.deadline === now + 15000 + 30_000, "12g. los 30 s cuentan desde la pregunta, no desde el sorteo");
  // Sin vídeo asignado: del suspense directo a la pregunta.
  let s2 = engine.startGame(engine.createInitialState(IDS), now);
  s2 = engine.answerMichel(s2, 0, false);
  s2 = engine.drawRebounder(s2, pick(3));
  s2 = engine.startReboundQuestion(s2, now + 5000);
  check(s2.phase === "reboundQuestion", "12h. sin vídeo se salta la presentación");
  check(s2.activeParticipantId === "mariano", "12i. el participante del rebote se mantiene");
  // Guardas de las nuevas transiciones.
  let g = engine.startGame(engine.createInitialState(IDS), now);
  check(engine.startReboundVideo(g) === g, "12j. no hay vídeo sin pasar por el suspense");
  check(engine.startReboundQuestion(g, now) === g, "12k. no hay pregunta sin suspense ni vídeo");
  check(engine.answerRebound(g, 0, true) === g, "12l. no se responde en 'welcome'");
  g = engine.answerMichel(g, 0, false);
  const gSel = engine.drawRebounder(g, pick(4));
  check(engine.answerRebound(gSel, 0, true) === gSel, "12m. no se responde durante el suspense");
  check(engine.expireReboundTimer(gSel) === gSel, "12n. el temporizador no expira en el suspense");
}

// --- Escenario 4: el reboteado acierta ----------------------------------------
{
  let s = engine.startGame(engine.createInitialState(IDS), now);
  s = engine.answerMichel(s, 1, false);
  s = engine.drawRebounder(s, pick(4));
  s = engine.startReboundQuestion(s, now);
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
  s = engine.drawRebounder(s, pick(5));
  s = engine.startReboundQuestion(s, now);
  s = engine.answerRebound(s, 2, false);
  check(s.phase === "reveal", "5a. tras el fallo del rebote se revela");
  check(pts(s, "pablo") === 0, "5b. el participante del rebote no gana puntos");
  check(s.wasCorrect === false, "5c. wasCorrect = false");
}

// --- Escenario 6: se agotan los 30 s del rebote --------------------------------
{
  let s = engine.startGame(engine.createInitialState(IDS), now);
  s = engine.answerMichel(s, 0, false);
  s = engine.drawRebounder(s, pick(2));
  const before = engine.startReboundQuestion(s, now);
  s = engine.expireReboundTimer(before);
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
  s = engine.drawRebounder(s, pick(1));
  s = engine.startReboundQuestion(s, now);
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
      s = engine.drawRebounder(s, pick(1));
      s = engine.startReboundQuestion(s, now + q * 1000);
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
  // Ojo: el bombo no repite; el 2.º sorteo se hace sin Juampi disponible.
  const steps = [
    { ok: true },
    { ok: true },
    // bombo completo (6) → pick(1) = juampi
    { ok: false, reb: "juampi", rng: pick(1) },
    // bombo sin juampi (5) → rng 0.7 → índice 3 = gabi
    { ok: false, reb: "gabi", rng: () => 0.7 },
  ];
  let t = now;
  for (const st of steps) {
    s = engine.answerMichel(s, 0, st.ok);
    if (st.reb) {
      s = engine.drawRebounder(s, st.rng);
      check(
        s.activeParticipantId === st.reb,
        `10x. sorteo ${st.reb}: el bombo entrega al candidato esperado`,
      );
      s = engine.startReboundQuestion(s, t);
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

// --- Escenario 13 (guardas): transiciones inválidas ----------------------------
{
  const s = engine.createInitialState(IDS);
  check(engine.answerMichel(s, 0, true) === s, "13a. no se puede responder en 'welcome'");
  check(engine.expireMichelTimer(s) === s, "13b. no expira ningún cronómetro en 'welcome'");
  check(engine.drawRebounder(s) === s, "13c. no hay sorteo de rebote en 'welcome'");
  check(engine.nextQuestion(s, now) === s, "13d. no se avanza en 'welcome'");
  let s2 = engine.startGame(engine.createInitialState(IDS), now);
  check(engine.answerRebound(s2, 0, true) === s2, "13e. no se puede responder un rebote en el turno de Michel");
  check(engine.expireReboundTimer(s2) === s2, "13f. no expira el rebote en el turno de Michel");
}

// --- Escenario 14: sorteo sin repetición ----------------------------------------
function playReboundRound(s, rng, t) {
  s = engine.answerMichel(s, 0, false);
  s = engine.drawRebounder(s, rng);
  const drawn = s.activeParticipantId;
  s = engine.startReboundQuestion(s, t);
  s = engine.answerRebound(s, 1, false);
  s = engine.nextQuestion(s, t);
  return { s, drawn };
}
{
  // Sin repetición dentro del ciclo: con rng→0 siempre sale el primero disponible.
  let s = engine.startGame(engine.createInitialState(IDS), now);
  s = engine.answerMichel(s, 0, false);
  s = engine.drawRebounder(s, () => 0);
  check(s.activeParticipantId === "anselmo", "14a. el sorteo devuelve un candidato válido");
  check(s.usedRebounders.join(",") === "anselmo", "14b. el bombo registra al sorteado");
  let t = now;
  s = engine.startReboundQuestion(s, t);
  s = engine.answerRebound(s, 1, false);
  s = engine.nextQuestion(s, t);
  s = engine.answerMichel(s, 0, false);
  s = engine.drawRebounder(s, () => 0);
  check(s.activeParticipantId === "juampi", "14c. sin repetición: sale el siguiente del bombo");
  check(s.usedRebounders.join(",") === "anselmo,juampi", "14d. el bombo acumula sin repetir");
}
{
  // Ciclo completo de 6 + reinicio del bombo en el 7.º sorteo.
  let s = engine.startGame(engine.createInitialState(IDS), now);
  const drawn = [];
  let t = now;
  for (let i = 0; i < 6; i++) {
    const r = playReboundRound(s, () => 0, t);
    s = r.s;
    drawn.push(r.drawn);
    t += 1000;
  }
  check(new Set(drawn).size === 6, "14e. 6 sorteos seguidos: 6 participantes distintos");
  check(drawn.every((id) => id !== "michel"), "14f. Michel nunca sale en el sorteo");
  check(
    drawn.slice().sort().join(",") === CANDIDATES.slice().sort().join(","),
    "14g. el ciclo completo cubre a los 6 candidatos",
  );
  check(s.usedRebounders.length === 6, "14h. el bombo queda lleno tras 6 sorteos");
  const r7 = playReboundRound(s, () => 0, t);
  check(r7.s.usedRebounders.length === 1, "14i. con el bombo agotado se reinicia el ciclo");
  check(CANDIDATES.includes(r7.drawn), "14j. el 7.º sorteo devuelve un candidato válido");
}
{
  // El bombo se reinicia con partida nueva.
  let s = engine.startGame(engine.createInitialState(IDS), now);
  s = engine.answerMichel(s, 0, false);
  s = engine.drawRebounder(s, () => 0);
  check(s.usedRebounders.length === 1, "14k. el bombo acumula durante la partida");
  s = engine.startGame(s, now + 999);
  check(s.usedRebounders.length === 0, "14l. partida nueva: el bombo se reinicia");
  check(s.phase === "michel", "14m. la partida nueva empieza con Michel");
}
{
  // Guardas y estado inicial del bombo.
  const g0 = engine.createInitialState(IDS);
  check(
    Array.isArray(g0.usedRebounders) && g0.usedRebounders.length === 0,
    "14n. el estado inicial trae el bombo vacío (serializable a localStorage)",
  );
  check(engine.drawRebounder(g0) === g0, "14o. no hay sorteo fuera de 'reboundSelect'");
  let s = engine.startGame(engine.createInitialState(IDS), now);
  s = engine.answerMichel(s, 0, false);
  s = engine.drawRebounder(s, () => 0.999999);
  check(s.activeParticipantId === "pablo", "14p. rng→1 elige al último candidato (nunca a Michel)");
}

console.log(`\n${passed} comprobaciones superadas, ${failed} fallidas.`);
