# Imágenes de las preguntas (opcional)

Enriquecer visualmente las preguntas es deseable, pero **no a cualquier precio**:

- Usa una imagen **solo** si es verdaderamente relevante para el hecho preguntado (una foto del partido, de la jugada o del protagonista concretos).
- Su **licencia de uso debe estar clara y documentada** (por ejemplo, Wikimedia Commons con atribución al autor).
- **No** uses imágenes genéricas de fútbol como relleno: si no hay una foto adecuada, la pregunta va sin imagen (el diseño está preparado para ello).

**Cómo asociarla:**

1. Guarda el archivo aquí, por ejemplo `q3-parada.jpg`.
2. En `src/data/questions.ts`, en la pregunta correspondiente:
   ```ts
   image: "/questions/q3-parada.jpg",
   imageCredit: "Autor, Licencia (fuente)",
   ```

Las imágenes se incluyen en la caché de la PWA y funcionan sin conexión.
