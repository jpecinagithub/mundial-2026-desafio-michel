import { getProtagonist, getReboundCandidates } from "../data/participants";
import type { useAudioEngine } from "../hooks/useAudio";
import { MusicControls } from "../components/MusicControls";
import { ParticipantPhoto } from "../components/ParticipantPhoto";
import { Footer } from "../components/Footer";

type AudioEngine = ReturnType<typeof useAudioEngine>;

interface Props {
  audio: AudioEngine;
  onStart: () => void;
}

export function WelcomeScreen({ audio, onStart }: Props) {
  const michel = getProtagonist();
  const rivals = getReboundCandidates();

  return (
    <div className="app welcome">
      <div className="welcome-topbar">
        <MusicControls
          volume={audio.volume}
          muted={audio.muted}
          onVolume={audio.setVolume}
          onToggleMute={audio.toggleMute}
        />
      </div>

      <main className="container welcome-main">
        <p className="kicker">MUNDIAL DE FÚTBOL · 2026</p>
        <h1 className="hero-title">
          <span className="hero-line1">MUNDIAL 2026</span>
          <span className="hero-line2">EL DESAFÍO DE MICHEL</span>
        </h1>
        <p className="hero-subtitle">
          10 preguntas. 60 segundos. Un protagonista. Y seis rivales esperando el rebote.
        </p>

        <div className="cast">
          <div className="cast-protagonist">
            <ParticipantPhoto participant={michel} size={150} ring="gold" />
            <span className="cast-name">{michel.name}</span>
            <span className="cast-badge">★ PROTAGONISTA</span>
          </div>
          <div className="cast-rivals" aria-label="Rivales">
            {rivals.map((p) => (
              <div key={p.id} className="cast-rival">
                <ParticipantPhoto participant={p} size={72} />
                <span className="cast-name">{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        <section className="howto" aria-label="Cómo se juega">
          <h2>¿CÓMO SE JUEGA?</h2>
          <ol>
            <li>
              <strong>Michel responde primero.</strong> Tiene 60 segundos y cada acierto vale 50
              puntos.
            </li>
            <li>
              <strong>Si falla o se agota el tiempo → ¡rebote!</strong> El organizador elige
              manualmente quién lo intenta: 30 segundos para responder.
            </li>
            <li>
              <strong>10 preguntas difíciles</strong> sobre España en el Mundial 2026. Todas las
              rondas empiezan con Michel, sin excepción.
            </li>
            <li>
              <strong>Un solo dispositivo:</strong> el organizador pulsa la respuesta que diga cada
              participante.
            </li>
          </ol>
        </section>

        <button type="button" className="btn-primary btn-hero" onClick={onStart}>
          COMENZAR EL DESAFÍO
        </button>
        <p className="welcome-note">
          🔊 La música empezará al pulsar el botón. Podrás ajustar el volumen o silenciarla cuando
          quieras.
        </p>
      </main>

      <Footer />
    </div>
  );
}
