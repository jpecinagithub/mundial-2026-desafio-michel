# 🏆 MUNDIAL 2026 — EL DESAFÍO DE MICHEL

Concurso interactivo de 10 preguntas difíciles sobre la selección española en el
Mundial de Fútbol 2026, con Michel como protagonista y sistema de rebote.

- **10 rondas**: todas empiezan con Michel (60 segundos por pregunta).
- Si Michel falla o agota su tiempo → **¡rebote!**: se hace un **sorteo**
  entre los 6 participantes (todos menos Michel), **sin repetición** en la
  partida —quien ya ha salido no vuelve a salir hasta agotar el bombo—.
  Entonces hay una animación de suspense de 5 segundos y se reproduce el
  **vídeo personal** del participante sorteado como presentación; después
  llega la pregunta del rebote (30 segundos).
  La opción fallida por Michel queda descartada. Si el participante aún
  no tiene vídeo asignado, se salta esa parte y va directo a la pregunta.
- **50 puntos** por acierto, sin penalizaciones. Marcador en directo,
  clasificación final con podio y tarjeta resumen.
- Música original (Web Audio API) con volumen y silencio, efectos de sonido,
  cronómetro circular con últimos 10 segundos en rojo, confeti y fanfarria final.
- PWA instalable, responsive y **funciona sin conexión** tras la primera carga.
- Progreso guardado en `localStorage` (recargar no concede tiempo extra).
- Sin backend, sin base de datos, sin autenticación, sin variables de entorno.

## Requisitos

- Node.js 18 o superior.

## Instalación

```bash
npm install
```

## Arranque local

```bash
npm run dev
```

Abre la URL que indique la terminal (normalmente http://localhost:5173).

## Compilación y test

```bash
npm run build        # compilación de producción (TypeScript + Vite) en dist/
npm run test:engine  # 95 comprobaciones del motor del juego (máquina de estados)
npm run preview      # sirve dist/ en local para probar el build
```

## Despliegue en Vercel

1. Sube este proyecto a un repositorio de GitHub.
2. En Vercel: **Add New → Project → Import** el repositorio.
3. Vercel detecta el preset **Vite** automáticamente:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. No hace falta definir ninguna variable de entorno.
5. Cada push a `main` redespliega automáticamente.

## Fotografías de los participantes

Las fotos las proporciona el usuario **después** de construir la app.

1. Copia cada foto en `public/participants/`. **El nombre del archivo identifica
   al participante**: `michel.jpg` → Michel, `anselmo.jpg` → Anselmo, etc.
   (ver la tabla en `public/participants/README.md`).
2. Se muestran con recorte circular; usa imágenes cuadradas o con la cara
   centrada. Respeta las fotos originales: no las edites ni uses genéricas.
3. Si llega un participante nuevo: añade su foto y su entrada en
   `src/data/participants.ts` (el `id` debe coincidir con el nombre del archivo).
4. Si falta una foto, la app muestra automáticamente un avatar con las
   iniciales: nunca se inventan fotografías.

## Vídeos de presentación del rebote

Cada participante (menos Michel, que nunca rebota) puede tener un **vídeo
personal** que se reproduce como presentación tras la animación de suspense:

1. Copia el MP4 en `public/videos/`, p. ej. `rebote-anselmo.mp4`
   (H.264 + AAC; ~10 segundos y unos 5–7 MB van bien).
2. Añade `reboundVideo: "/videos/rebote-anselmo.mp4"` a su entrada en
   `src/data/participants.ts`.
3. Sin `reboundVideo`, el flujo no se rompe: tras el suspense se va directo
   a la pregunta del rebote.

Detalles: el vídeo se reproduce a pantalla casi completa con el rótulo
«¡[Nombre] acepta el desafío!»; al terminar avanza solo a la pregunta (hay
botón discreto «Saltar vídeo»). Si el navegador bloquea el autoplay con
sonido, se reproduce silenciado y aparece «🔊 Activar sonido». La música de
fondo se pausa durante el vídeo y se reanuda después. Los vídeos quedan en
la caché del service worker: funcionan sin conexión tras la primera carga.

Flujo completo del rebote:
`reboundSelect` (botón 🎲 SORTEAR: sorteo sin repetición entre los 6;
si el bombo se agota se reinicia) → `reboundSuspense` (5 s, la ruleta
cae en el sorteado) → `reboundVideo` (solo si hay vídeo) →
`reboundQuestion` (30 s) → `reveal`.
El cronómetro de 30 s arranca con la pregunta, no con el sorteo.
El bombo (`usedRebounders`) se guarda en `localStorage` y se reinicia
con cada partida nueva.

## Cómo modificar las preguntas

Todas las preguntas viven en **un único archivo**: `src/data/questions.ts`.
Para sustituir, corregir o añadir preguntas edita ese array:

```ts
{
  id: "q1",
  question: "¿Enunciado de la pregunta?",
  options: ["Opción A", "Opción B", "Opción C", "Opción D"], // exactamente 4
  correctIndex: 2,        // 0=A, 1=B, 2=C, 3=D (repartir sin patrones)
  explanation: "Breve explicación del dato.",
  sources: [{ label: "FIFA", url: "https://…" }],  // fuente documental
  // image: "/questions/q1.jpg",        // SOLO si es relevante y con licencia clara
  // imageCredit: "Autor, licencia",
  // videoClip: { src: "/videos/q1.mp4", durationSeconds: 8 }, // reservado: NO implementado
}
```

**Reglas de contenido** (las 10 preguntas actuales están verificadas
documentalmente, cada una con su fuente):

- Hechos reales del Mundial 2026, dificultad 8–9/10 (minutos, tarjetas,
  goleadores, paradas, sustituciones, penaltis…), con prioridad en España.
- Prohibido inventar datos: si un dato no se puede verificar, se sustituye
  por otro hecho documentado.
- Las 4 opciones deben ser plausibles (sin distractores absurdos).
- Las respuestas correctas, repartidas entre A, B, C y D sin patrones.

## Funcionamiento de la puntuación

- Cada acierto vale **exactamente 50 puntos**; no hay penalizaciones.
- Los puntos son individuales por participante.
- **Sin puntos duplicados**: el motor (`src/game/engine.ts`) valida la fase
  en cada transición; una segunda pulsación, o una respuesta que coincida con
  el fin del tiempo, se ignora.
- La clasificación final se ordena de mayor a menor puntuación; los empates
  comparten posición (1, 2, 2, 4…).
- La tarjeta resumen muestra: aciertos de Michel, rebotes ofrecidos, rebotes
  acertados y puntos totales repartidos.
- «Jugar de nuevo» reinicia todo con confirmación previa.

## Estructura del proyecto

```text
src/
  components/   # ParticipantPhoto, CountdownTimer, AnswerOptions, Scoreboard,
                # MusicControls, ReboundSelection, ReboundSuspense, ReboundVideo,
                # RevealCard, FinalPodium, Confetti, TopBar, Footer
  data/         # questions.ts (las 10 preguntas), participants.ts
  game/         # engine.ts — máquina de estados pura (testeable sin React)
  hooks/        # useGame (estado + persistencia), useCountdown (tiempo real),
                # useAudio (música y efectos con Web Audio API)
  screens/      # WelcomeScreen, GameScreen, FinalScreen
  types/        # game.ts
  App.tsx · main.tsx · index.css
public/
  participants/ # fotos de los participantes (las pone el usuario)
  questions/    # imágenes opcionales de preguntas (solo relevantes + licencia)
  videos/       # vídeos personales de presentación del rebote (los pone el usuario)
  icons/        # iconos PWA (generados con scripts/generate-icons.mjs)
  fonts/        # Barlow / Barlow Condensed autohospedadas (sin conexión OK)
scripts/        # generate-icons.mjs, fetch-fonts.mjs, run-engine-tests.mjs
test/           # engine.test.mjs (76 comprobaciones)
```

## Música y sonido

Composición **original** con Web Audio API (nada con copyright): bucle
instrumental alegre (bajo + acordes a contratiempo + riff + batería programada,
116 BPM, progresión C–G–Am–F) y efectos para acierto, fallo, rebote, fin de
tiempo, últimos 10 segundos y fanfarria final.

- La música arranca al pulsar **COMENZAR EL DESAFÍO** (los navegadores exigen
  un gesto del usuario) y no se reinicia al cambiar de pantalla.
- Volumen regulable y silencio disponibles en todo momento; la preferencia se
  guarda en `localStorage`.

## Notas

- Campo `videoClip` en las preguntas: estructura **reservada** para futuros
  clips de ~8 s asociados a preguntas (funcionalidad no desarrollada).
- El progreso de la partida se guarda en `localStorage` con timestamps
  absolutos: recargar no concede tiempo extra y, si el tiempo expiró, se
  aplica la regla correspondiente.

---

Desarrollado por Jon Peciña
