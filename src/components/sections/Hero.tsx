import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface Panel {
  triggerAt: number;
  endAt: number;
  side: "left" | "right";
  category: string;
  stats: { label: string; value: string }[];
}

const PANELS: Panel[] = [
  {
    triggerAt: 0.07,
    endAt: 0.33,
    side: "left",
    category: "EL PILOTO",
    stats: [
      { label: "Nombre Completo", value: "Max Emilian Verstappen" },
      { label: "Nacionalidad", value: "Neerlandés" },
      { label: "Nacimiento", value: "30 Sep 1997" },
      { label: "Equipo", value: "Oracle Red Bull Racing" },
    ],
  },
  {
    triggerAt: 0.33,
    endAt: 0.58,
    side: "right",
    category: "PALMARÉS",
    stats: [
      { label: "Campeonatos", value: "4×" },
      { label: "Victorias GP", value: "63+" },
      { label: "Poles Position", value: "40+" },
      { label: "Vueltas Rápidas", value: "30+" },
    ],
  },
  {
    triggerAt: 0.58,
    endAt: 0.83,
    side: "left",
    category: "TEMPORADA 2024",
    stats: [
      { label: "Posición Final", value: "#1" },
      { label: "Victorias", value: "9" },
      { label: "Podios", value: "21" },
      { label: "Puntos", value: "437" },
    ],
  },
  {
    triggerAt: 0.83,
    endAt: 1.01,
    side: "right",
    category: "LEGADO",
    stats: [
      { label: "Títulos", value: "21·22·23·24" },
      { label: "Récord", value: "19 wins / 2023" },
      { label: "Debut GP", value: "2015 (17 años)" },
      { label: "Estatus", value: "All-Time Great" },
    ],
  },
];

export function Hero() {
  const { canvasRef, containerRef, activePanel } = useScrollAnimation(PANELS);

  const showIntro = activePanel === -2;
  const showFinal = activePanel === -3;

  return (
    <div ref={containerRef} className="scroll-container">
      <div className="sticky-viewport">
        <canvas ref={canvasRef} className="bg-canvas" aria-hidden="true" />

        <div className="overlay-vignette" aria-hidden="true" />
        <div className="overlay-top" aria-hidden="true" />
        <div className="overlay-bottom" aria-hidden="true" />
        <div className="overlay-sides" aria-hidden="true" />

        <div className="driver-number" aria-hidden="true">
          1
        </div>

        <div
          className={`intro-title${showIntro ? " is-visible" : ""}`}
          aria-label="Max Verstappen – 4 veces Campeón del Mundo"
        >
          <p className="team-label">ORACLE RED BULL RACING</p>
          <h1 className="hero-name">
            <span className="hero-name-line">MAX</span>
            <span className="hero-name-line">VERSTAPPEN</span>
          </h1>
          <p className="hero-sub">4× CAMPEÓN DEL MUNDO</p>
          <div className="scroll-cue" aria-hidden="true">
            <span className="scroll-cue-text">SCROLL</span>
            <span className="scroll-cue-line" />
          </div>
        </div>

        {PANELS.map((panel, i) => (
          <aside
            key={i}
            className={`info-panel panel-${panel.side}${activePanel === i ? " is-visible" : ""}`}
            aria-hidden={activePanel !== i}
          >
            <div className="panel-rule" />
            <p className="panel-category">{panel.category}</p>
            <ul className="panel-stats">
              {panel.stats.map((stat, j) => (
                <li
                  key={j}
                  className="stat-row"
                  style={{ transitionDelay: `${j * 70}ms` }}
                >
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-value">{stat.value}</span>
                </li>
              ))}
            </ul>
          </aside>
        ))}

        <div
          className={`final-overlay${showFinal ? " is-visible" : ""}`}
          aria-hidden={!showFinal}
        >
          <p className="final-eyebrow">UNA LEYENDA</p>
          <p className="final-headline">EN MOVIMIENTO</p>
        </div>
      </div>
    </div>
  );
}
