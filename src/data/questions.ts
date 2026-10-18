import type { Question } from "../types/game";

/**
 * Las 10 preguntas del concurso: hechos REALES y verificados del Mundial
 * de Fútbol 2026 (11 junio – 19 julio 2026), con prioridad en los partidos
 * de España. Dificultad 8-9/10: minutos, tarjetas, goleadores, paradas,
 * sustituciones y secuencias concretas de jugadas.
 *
 * Cada pregunta lleva su fuente documental verificable. PROHIBIDO inventar
 * datos: si un dato no puede verificarse, se sustituye por otro hecho
 * documentado (ver informe de investigación).
 *
 * Para corregir, sustituir o añadir preguntas basta con editar este archivo.
 * Las respuestas correctas están repartidas entre A, B, C y D sin patrones
 * evidentes (A×3, B×3, C×2, D×2).
 *
 * Sin imágenes asociadas: no se localizó ninguna fotografía verdaderamente
 * relevante para estos hechos con licencia de uso clara y documentada; según
 * el criterio del proyecto, es preferible la pregunta sin imagen antes que
 * una imagen genérica de relleno.
 */
export const QUESTIONS: Question[] = [
  {
    id: "q1",
    question:
      "En la final contra Argentina, ¿quién peinó de cabeza el centro de Pedro Porro desde la derecha para dejar a Ferran Torres solo ante Emiliano Martínez en el gol del minuto 106?",
    options: ["Lamine Yamal", "Nico Williams", "Mikel Merino", "Dani Olmo"],
    correctIndex: 1,
    explanation:
      "Torres anticipó la prolongación de cabeza de Nico Williams dentro del área y cruzó el balón a la escuadra: centro de Porro, peinada de Williams y remate del MVP de la final para el 1-0 definitivo en la prórroga.",
    sources: [
      {
        label: "ANSA Latina",
        url: "https://www.ansalatina.com/americalatina/noticia/deportes/2026/07/20/espana-campeon_89793356-46ba-4d35-9210-6c022d60e4fb.html",
      },
      { label: "Lado.mx", url: "https://lado.mx/noticia/21371940/" },
    ],
  },
  {
    id: "q2",
    question:
      "¿Sobre qué jugador español cometió Enzo Fernández la entrada tardía que le costó la segunda amarilla y la expulsión en el minuto 90+3 de la final?",
    options: ["Rodri", "Lamine Yamal", "Pau Cubarsí", "Pedri"],
    correctIndex: 2,
    explanation:
      "Fernández, que ya había visto amarilla por protestar, llegó tarde sobre Cubarsí en el descuento; el árbitro Slavko Vinčić le mostró la segunda amarilla y Argentina jugó la prórroga con diez jugadores.",
    sources: [
      {
        label: "ESPN",
        url: "https://www.espn.ph/football/story/_/id/49403084/2026-world-cup-final-spain-argentina-score-ferran-torres-champions-title",
      },
      {
        label: "Tips.gg",
        url: "https://tips.gg/es/article/extra-time-winner-sees-spain-see-off-10-man-argentina-win-second-world-cup-story/",
      },
    ],
  },
  {
    id: "q3",
    question:
      "En el minuto 17 del Portugal-España de octavos de final, ¿a qué dos jugadores españoles les detuvo Diogo Costa una doble ocasión consecutiva?",
    options: [
      "Lamine Yamal y Álex Baena",
      "Nico Williams y Mikel Oyarzabal",
      "Dani Olmo y Ferran Torres",
      "Pedri y Fabián Ruiz",
    ],
    correctIndex: 0,
    explanation:
      "Costa sostuvo a Portugal en el arranque con una doble parada ante Yamal y Baena; aun así, el gol de Merino en el 90+1' decidió el Clásico Ibérico.",
    sources: [
      {
        label: "OneFootball/DAZN",
        url: "https://onefootball.com/de/news/merino-heroe-tardio-el-uno-a-uno-dazn-de-portugal-espana-43105873",
      },
    ],
  },
  {
    id: "q4",
    question:
      "¿Cuántos disparos entre los tres palos registró Argentina en los 90 minutos reglamentarios de la final?",
    options: ["Uno", "Dos", "Tres", "Ninguno"],
    correctIndex: 3,
    explanation:
      "Argentina terminó la primera parte sin tiros, sin córners y sin toques en el área española; su primer disparo no llegó hasta un remate bloqueado de Messi en el minuto 117, ya en la prórroga.",
    sources: [
      {
        label: "ESPN",
        url: "https://www.espn.ph/football/story/_/id/49403084/2026-world-cup-final-spain-argentina-score-ferran-torres-champions-title",
      },
      {
        label: "Overhere Toronto (Reuters)",
        url: "https://www.overheretoronto.com/spain-crowned-2026-world-cup-champions-after-extra-time-win-over-argentina/",
      },
    ],
  },
  {
    id: "q5",
    question:
      "¿Por qué anuló el árbitro el gol que Nico Williams marcó a puerta vacía en el arranque de la prórroga de la final?",
    options: [
      "Fuera de juego de Ferran Torres",
      "Mano de Lamine Yamal en la jugada previa",
      "Falta de Mikel Merino sobre Nicolás Otamendi en la jugada previa",
      "Falta de Rodri sobre Mac Allister",
    ],
    correctIndex: 2,
    explanation:
      "Williams fue el más rápido en reaccionar a los cinco minutos de la prórroga, pero Vinčić detectó una falta de Merino sobre Otamendi antes del remate y el tanto no subió al marcador.",
    sources: [
      {
        label: "Tips.gg",
        url: "https://tips.gg/es/article/extra-time-winner-sees-spain-see-off-10-man-argentina-win-second-world-cup-story/",
      },
      { label: "Lado.mx", url: "https://lado.mx/noticia/21371940/" },
    ],
  },
  {
    id: "q6",
    question:
      "En la semifinal ante Francia, ¿qué defensa cometió el penalti sobre Lamine Yamal que Mikel Oyarzabal transformó en el 0-1 (minuto 22)?",
    options: ["William Saliba", "Lucas Digne", "Théo Hernández", "Jules Koundé"],
    correctIndex: 1,
    explanation:
      "Yamal aprovechó un mal control de Digne dentro del área y provocó la infracción del lateral; el árbitro Iván Bartón no dudó y Oyarzabal la colocó a media altura, a la derecha de Maignan, que adivinó el lado pero no llegó.",
    sources: [
      {
        label: "OneFootball",
        url: "https://onefootball.com/id/berita/espana-a-la-final-las-claves-del-partido-esto-es-lo-que-paso-43139584",
      },
      {
        label: "DeporTV",
        url: "https://deportv.gob.ar/futbol/espana-adueno-pelota-derroto-francia-meterse-final-mundial-2026-nid:15020",
      },
    ],
  },
  {
    id: "q7",
    question:
      "¿Quién filtró el pase al área que Pedro Porro definió con un disparo cruzado ante Maignan para el 2-0 de la semifinal (minuto 58)?",
    options: ["Dani Olmo", "Lamine Yamal", "Fabián Ruiz", "Álex Baena"],
    correctIndex: 0,
    explanation:
      "Al minuto 58, Olmo filtró un balón al área y el lateral Porro apareció para definir cruzado y sentenciar el pase a la final, la segunda de la historia de España tras la de 2010.",
    sources: [
      {
        label: "SoyFútbol",
        url: "https://www.soyfutbol.com/noticias/mundial-2026-espana-impone-su-autoridad-y-elimina-a-francia-para-instalarse-en-la-final-20260714-0038.html",
      },
      {
        label: "Claro Sports",
        url: "https://www.clarosports.com/futbol/mundial-2026/van-por-la-segunda-espana-avanza-a-la-final-del-mundial-2026/",
      },
    ],
  },
  {
    id: "q8",
    question:
      "¿Qué portero belga no pudo retener el disparo lejano de Pau Cubarsí cuyo rechace empujó Mikel Merino para el 2-1 en el minuto 88 de los cuartos de final?",
    options: ["Thibaut Courtois", "Koen Casteels", "Matz Sels", "Senne Lammens"],
    correctIndex: 3,
    explanation:
      "Courtois se había lesionado y abandonó el campo entre lágrimas; su sustituto Lammens dejó un rechace corto tras el disparo de Cubarsí y Merino —que había entrado solo dos minutos antes— lo empujó a la red.",
    sources: [
      {
        label: "OneFootball/DAZN",
        url: "https://onefootball.com/es/noticias/merino-vuelve-a-golpear-el-uno-a-uno-dazn-de-espana-belgica-43123780",
      },
      {
        label: "Impacta Mag",
        url: "https://www.impactamag.com/2026/07/merino-vuelve-ser-heroe-y-espana.html",
      },
    ],
  },
  {
    id: "q9",
    question:
      "¿Quién dio la asistencia del gol de Mikel Merino en el 90+1' que eliminó a Portugal en octavos de final?",
    options: ["Ferran Torres", "Lamine Yamal", "Dani Olmo", "Nico Williams"],
    correctIndex: 0,
    explanation:
      "Tras una falta de Bernardo Silva y un saque rápido, Ferran Torres —recién ingresado— filtró un pase magistral entre los centrales y Merino, que había entrado en el 85', definió de zurda al palo corto de Diogo Costa.",
    sources: [
      {
        label: "Betsson Sport",
        url: "https://betsson.sport/es/noticias/futbol/mundial/extasis-de-la-roja-europea-merino-tumba-a-portugal-en-el-91-y-despide-a-cristiano-de-los-mundiales/",
      },
      {
        label: "OneFootball/DAZN",
        url: "https://onefootball.com/de/news/merino-heroe-tardio-el-uno-a-uno-dazn-de-portugal-espana-43105873",
      },
    ],
  },
  {
    id: "q10",
    question:
      "¿Qué jugador uruguayo fue expulsado en el tiempo de descuento del Uruguay-España (0-1) que cerró el Grupo H?",
    options: ["Federico Valverde", "Agustín Canobbio", "Rodrigo Bentancur", "Mathías Olivera"],
    correctIndex: 1,
    explanation:
      "Con Uruguay ya eliminada y desquiciada, Canobbio vio la roja en el minuto 95 del árbitro Ismail Elfath, en un partido en el que Valverde había sido sustituido en el 56'.",
    sources: [
      {
        label: "Estadio Deportivo",
        url: "https://www.estadiodeportivo.com/futbol/mundial/uruguay-espana-alex-baena-firma-pase-dieciseisavos-final-guerra-guadalajara-20260627-540925.html",
      },
      {
        label: "El Heraldo de Saltillo",
        url: "https://elheraldodesaltillo.mx/2026/06/26/espana-vence-a-uruguay-y-avanza-como-lider-la-celeste-queda-eliminada/",
      },
    ],
  },
];
