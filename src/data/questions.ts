import type { Question } from "../types/game";

/**
 * Las 10 preguntas del concurso: hechos REALES y verificados del Mundial
 * de Fútbol 2026 (11 junio – 19 julio 2026), con prioridad en los partidos
 * de España. Dificultad 9-10/10: minutos exactos de sustituciones,
 * secuencias encadenadas de jugadas, protagonistas secundarios, tarjetas
 * poco obvias, intervenciones arbitrales y estadísticas particulares.
 *
 * Cada pregunta lleva su fuente documental verificable. PROHIBIDO inventar
 * datos: si un dato no puede verificarse, se sustituye por otro hecho
 * documentado (varios datos dudosos se descartaron en la investigación:
 * el supuesto "octava selección con 2+ Mundiales" —es la séptima—, el
 * minuto exacto de entrada de Merino ante Bélgica —las fuentes discrepan
 * entre el 82' y el 86'— y una afirmación aislada sobre David Raya en el
 * descuento de la final, sin corroboración).
 *
 * Para corregir, sustituir o añadir preguntas basta con editar este archivo.
 * Las respuestas correctas están repartidas entre A, B, C y D sin patrones
 * evidentes (A×2, B×3, C×2, D×3).
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
      "De la Fuente revolucionó el once ante Arabia Saudí respecto al debut contra Cabo Verde: ¿qué cuatro jugadores entraron como titulares?",
    options: [
      "Mikel Merino, Nico Williams, Yeremy Pino y Ferran Torres",
      "Pedro Porro, Dani Olmo, Álex Baena y Lamine Yamal",
      "Fabián Ruiz, Pedri, Gavi y Mikel Oyarzabal",
      "Marcos Llorente, Pau Cubarsí, Laporte y Cucurella",
    ],
    correctIndex: 1,
    explanation:
      "Entraron Porro, Olmo, Baena y Lamine Yamal por Marcos Llorente, Fabián, Gavi y Ferran Torres. España goleó 4-0 y recuperó su mejor versión.",
    sources: [
      {
        label: "Flashscore",
        url: "https://www.flashscore.es/noticias/espana-recupera-su-mejor-version-y-arrolla-a-arabia-saudi-4-0/W0jFUBzi/",
      },
    ],
  },
  {
    id: "q2",
    question:
      "El 4-0 ante Arabia Saudí llegó en propia puerta de Tambakti tras un córner en el 49': ¿quién lo botó?",
    options: ["Lamine Yamal", "Pedri", "Dani Olmo", "Álex Baena"],
    correctIndex: 3,
    explanation:
      "Córner de Baena desde la derecha: volea de Cucurella, paradón de Alowais y el rechace rebotó en Hassan Al-Tambakti hacia su propia portería.",
    sources: [
      {
        label: "TRT Español",
        url: "https://www.trtespanol.com/article/bac7f7feec5a",
      },
    ],
  },
  {
    id: "q3",
    question:
      "Tras el error de Muslera en el 0-1 de Baena (42'), ¿qué cambio hizo Bielsa al descanso del Uruguay-España?",
    options: [
      "Nicolás de la Cruz por Manuel Ugarte",
      "Brian Rodríguez por Antonio Sanabria",
      "Sergio Rochet por Fernando Muslera",
      "Ninguno: mantuvo a Muslera bajo palos",
    ],
    correctIndex: 2,
    explanation:
      "Muslera falló en el gol de Baena y no volvió tras el descanso: Bielsa puso a Sergio Rochet. Lo recoge la ficha oficial de la RFEF.",
    sources: [
      {
        label: "RFEF",
        url: "https://rfef.es/es/noticias/espana-doma-el-volcan-rumbo-dieciseisavos-0-1",
      },
    ],
  },
  {
    id: "q4",
    question:
      "Ante Austria (3-0) en dieciseisavos, Oyarzabal marcó en el 36' y en el 89': ¿quién dio las dos asistencias?",
    options: ["Marc Cucurella", "Lamine Yamal", "Álex Baena", "Dani Olmo"],
    correctIndex: 0,
    explanation:
      "Cucurella asistió en los dos tantos: centro raso en el 36' y segundo pase en el 89'. El 2-0 fue de Pedro Porro a centro de Baena.",
    sources: [
      {
        label: "DimeCuba",
        url: "https://www.dimecuba.com/revista/vivir-trabajar-usa/resultados-del-mundial-2026-hoy-todos-los-partidos-y-goles-del-2-de-julio/",
      },
    ],
  },
  {
    id: "q5",
    question:
      "Charles De Ketelaere fue el primero en batir a Unai Simón en un Mundial desde... ¿quién?",
    options: ["Kai Havertz", "Ao Tanaka", "Álvaro Morata", "Niclas Füllkrug"],
    correctIndex: 1,
    explanation:
      "El último en marcarle a Unai en un Mundial había sido el japonés Ao Tanaka el 1 de diciembre de 2022, en Qatar.",
    sources: [
      {
        label: "El Informante Perú",
        url: "http://elinformanteperu.com/index.php/2026/07/12/espana-se-clasifico-a-semifinales-del-mundial-por-segunda-vez-en-su-historia/",
      },
    ],
  },
  {
    id: "q6",
    question:
      "Ante Bélgica, con 1-1 en el marcador, De la Fuente hizo un doble cambio en el minuto 55. ¿Quiénes entraron al campo?",
    options: [
      "Pedri y Ferran Torres",
      "Mikel Merino y Pedri",
      "Ferran Torres y Nico Williams",
      "Dani Olmo y Álex Baena",
    ],
    correctIndex: 0,
    explanation:
      "En el 55' entraron Pedri (por Fabián) y Ferran Torres (por Baena): los cambios más tempranos de España en todo el torneo. Merino no saltó hasta el 86' (por Olmo) y Nico Williams hasta el 79' (por Oyarzabal); Olmo y Baena fueron los sustituidos, no los que entraron.",
    sources: [
      {
        label: "El Informante Perú",
        url: "http://elinformanteperu.com/index.php/2026/07/12/espana-se-clasifico-a-semifinales-del-mundial-por-segunda-vez-en-su-historia/",
      },
      {
        label: "Everardo Herrera (ficha técnica)",
        url: "https://everardoherrera.com/index.php/futbol-internacional/69-internacional-2/134892-agonico-triunfo-de-espana-sobre-belgica-para-meterse-en-semifinales-del-mundial",
      },
    ],
  },
  {
    id: "q7",
    question:
      "En el minuto 14 de la semifinal, Olise clavó los tacos en el tobillo de Rodri: ¿qué decidió el árbitro Iván Barton?",
    options: [
      "Solo señaló la falta: ni tarjeta ni revisión del VAR",
      "Amarilla a Olise",
      "Roja directa a Olise",
      "El VAR lo llamó al monitor",
    ],
    correctIndex: 0,
    explanation:
      "Barton solo pitó la falta y el VAR (Kwiatkowski) no intervino, pese a lo notorio de la entrada. La acción abrió un gran debate posterior.",
    sources: [
      {
        label: "Claro Sports",
        url: "https://www.clarosports.com/futbol/mundial-2026/polemica-en-francia-vs-espana-olise-llega-tarde-sobre-el-tobillo-de-rodri-era-tarjeta-roja/",
      },
    ],
  },
  {
    id: "q8",
    question:
      "Tras la semifinal, la FIFA multó a España con 10.000 dólares: ¿por qué?",
    options: [
      "Por la entrada de Olise sobre Rodri",
      "Por retrasar una reanudación",
      "Por la tarjeta amarilla de Cucurella en el 31'",
      "Por protestas del banquillo",
    ],
    correctIndex: 2,
    explanation:
      "Cucurella vio amarilla en el 31' por frenar a Olise; según el Código Disciplinario FIFA 2026, esa única amonestación supuso 10.000 $ de multa.",
    sources: [
      {
        label: "Bolavip",
        url: "https://bolavip.com/mundial/fifa-sanciona-al-primer-finalista-del-mundial-el-castigo-a-espana-tras-la-victoria-a-francia",
      },
    ],
  },
  {
    id: "q9",
    question:
      "Ferran Torres marcó el gol del título en el 106' de la final: ¿cuántos goles llevaba en el Mundial antes de ese partido?",
    options: [
      "1, ante Arabia Saudí",
      "0: el del título fue su primero",
      "2, ante Arabia y Bélgica",
      "1, ante Portugal",
    ],
    correctIndex: 1,
    explanation:
      "Llegó a la final sin haber marcado: le anularon un gol por fuera de juego ante Arabia y estrelló dos balones en el larguero. Su primer tanto fue el del título.",
    sources: [
      {
        label: "OneFootball",
        url: "https://onefootball.com/it/notizie/espana-conquisto-la-eternidad-ferran-torres-destrono-a-argentina-43160421",
      },
      {
        label: "HoyDiario",
        url: "https://hoydiario.es/noticias/futbol/mundial-2026/espana-campeon-mundial-2026-ferran-torres.html",
      },
    ],
  },
  {
    id: "q10",
    question:
      "En la reconstrucción de la jugada del 1-0 de la final, ¿quién dio el primer pase de la secuencia del gol?",
    options: ["Rodri", "Pedri", "Mikel Merino", "Martín Zubimendi"],
    correctIndex: 3,
    explanation:
      "Zubimendi encontró a Lamine en la derecha, Lamine descargó para Porro, centro al segundo palo, peinada de cabeza de Nico Williams y zurdazo de Ferran. Fue el 20º remate de España; Argentina aún no había rematado.",
    sources: [
      {
        label: "OneFootball",
        url: "https://onefootball.com/it/notizie/espana-conquisto-la-eternidad-ferran-torres-destrono-a-argentina-43160421",
      },
    ],
  },
];
