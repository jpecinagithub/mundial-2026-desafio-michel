import { useEffect, useRef } from "react";

const COLORS = ["#ffd54a", "#ffffff", "#22c55e", "#ef4444", "#2dd4bf", "#f5b301"];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vr: number;
  color: string;
}

/** Confeti discreto sobre canvas para la celebración final. */
export function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const particles: Particle[] = Array.from({ length: 140 }, () => ({
      x: rand(0, canvas.width),
      y: rand(-canvas.height * 0.3, 0),
      vx: rand(-60, 60) * dpr,
      vy: rand(120, 320) * dpr,
      w: rand(6, 12) * dpr,
      h: rand(8, 16) * dpr,
      rot: rand(0, Math.PI * 2),
      vr: rand(-4, 4),
      color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? "#ffd54a",
    }));

    let raf = 0;
    const start = performance.now();
    const DURATION = 4500;
    const loop = (now: number) => {
      const elapsed = now - start;
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      const fade = elapsed > DURATION - 800 ? Math.max(0, 1 - (elapsed - (DURATION - 800)) / 800) : 1;
      ctx2d.globalAlpha = fade;
      for (const p of particles) {
        p.x += p.vx / 60 + Math.sin(now / 300 + p.rot) * dpr;
        p.y += p.vy / 60;
        p.rot += p.vr / 60;
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = rand(0, canvas.width);
        }
        ctx2d.save();
        ctx2d.translate(p.x, p.y);
        ctx2d.rotate(p.rot);
        ctx2d.fillStyle = p.color;
        ctx2d.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx2d.restore();
      }
      ctx2d.globalAlpha = 1;
      if (elapsed < DURATION) {
        raf = requestAnimationFrame(loop);
      } else {
        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="confetti-canvas" aria-hidden="true" />;
}
