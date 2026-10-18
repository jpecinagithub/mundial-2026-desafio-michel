# Fotografías de los participantes

El **nombre del archivo identifica al participante**. Coloca aquí una foto por persona:

| Archivo          | Participante          |
|------------------|-----------------------|
| `michel.png`     | Michel (protagonista) |
| `anselmo.png`    | Anselmo               |
| `juampi.png`     | Juampi                |
| `alfonso.png`    | Alfonso               |
| `mariano.png`    | Mariano               |
| `gabi.png`       | Gabi                  |
| `pablo.png`      | Pablo                 |

> Nota (18-oct-2026): el mapeo nombre→foto se asumió por el orden de envío de
> las fotos; pendiente confirmar con Jon que cada foto corresponde a la
> persona indicada.

**Reglas:**

- Formatos: JPG o PNG (usa la extensión real en `src/data/participants.ts` si no es `.jpg`).
- Las fotos se muestran con recorte circular: usa imágenes cuadradas o con la cara centrada si es posible.
- Respeta la fotografía original de cada persona: no la edites ni la sustituyas por imágenes genéricas.
- Si llega la foto de un participante nuevo, cópiala aquí y añade su entrada en `src/data/participants.ts` (el `id` debe coincidir con el nombre del archivo sin extensión).
- Mientras falte una foto, la app muestra automáticamente un avatar con las iniciales de la persona.

Las fotos se incluyen en la caché de la PWA, así que estarán disponibles sin conexión tras la primera carga.
