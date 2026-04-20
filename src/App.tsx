import { useEffect, useRef, useState, useCallback } from 'react'
import './App.css'

const TOTAL_FRAMES = 52
const FRAME_PATH = (i: number) =>
  `/frames/frame_${String(i).padStart(4, '0')}.jpg`

interface Panel {
  triggerAt: number
  endAt: number
  side: 'left' | 'right'
  category: string
  stats: { label: string; value: string }[]
}

const PANELS: Panel[] = [
  {
    triggerAt: 0.07,
    endAt: 0.33,
    side: 'left',
    category: 'EL PILOTO',
    stats: [
      { label: 'Nombre Completo', value: 'Max Emilian Verstappen' },
      { label: 'Nacionalidad', value: 'Neerlandés' },
      { label: 'Nacimiento', value: '30 Sep 1997' },
      { label: 'Equipo', value: 'Oracle Red Bull Racing' },
    ],
  },
  {
    triggerAt: 0.33,
    endAt: 0.58,
    side: 'right',
    category: 'PALMARÉS',
    stats: [
      { label: 'Campeonatos', value: '4×' },
      { label: 'Victorias GP', value: '63+' },
      { label: 'Poles Position', value: '40+' },
      { label: 'Vueltas Rápidas', value: '30+' },
    ],
  },
  {
    triggerAt: 0.58,
    endAt: 0.83,
    side: 'left',
    category: 'TEMPORADA 2024',
    stats: [
      { label: 'Posición Final', value: '#1' },
      { label: 'Victorias', value: '9' },
      { label: 'Podios', value: '21' },
      { label: 'Puntos', value: '437' },
    ],
  },
  {
    triggerAt: 0.83,
    endAt: 1.01,
    side: 'right',
    category: 'LEGADO',
    stats: [
      { label: 'Títulos', value: '21·22·23·24' },
      { label: 'Récord', value: '19 wins / 2023' },
      { label: 'Debut GP', value: '2015 (17 años)' },
      { label: 'Estatus', value: 'All-Time Great' },
    ],
  },
]

function getActivePanelIndex(progress: number): number {
  if (progress < 0.09) return -2
  if (progress >= 0.86) return -3
  for (let i = 0; i < PANELS.length; i++) {
    if (progress >= PANELS[i].triggerAt && progress < PANELS[i].endAt) return i
  }
  return -1
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const framesRef = useRef<HTMLImageElement[]>([])
  const progressRef = useRef(0)
  const [activePanel, setActivePanel] = useState(-2)
  const [ready, setReady] = useState(false)

  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  // Precarga todos los frames
  useEffect(() => {
    const imgs: HTMLImageElement[] = []
    let loaded = 0

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = FRAME_PATH(i)
      img.onload = img.onerror = () => {
        loaded++
        if (loaded === TOTAL_FRAMES) setReady(true)
      }
      imgs.push(img)
    }
    framesRef.current = imgs
  }, [])

  // Dibuja el frame en canvas con cover behavior
  const drawFrame = useCallback((progress: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const idx = Math.min(
      Math.round(progress * (TOTAL_FRAMES - 1)),
      TOTAL_FRAMES - 1
    )
    const img = framesRef.current[idx]
    if (!img?.complete || !img.naturalWidth) return

    const cw = canvas.width
    const ch = canvas.height
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
    const dw = img.naturalWidth * scale
    const dh = img.naturalHeight * scale
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
  }, [])

  // Ajusta resolución del canvas al viewport
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawFrame(progressRef.current)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [drawFrame])

  // Redibuja cuando terminan de cargar todos los frames
  useEffect(() => {
    if (ready) drawFrame(progressRef.current)
  }, [ready, drawFrame])

  const updateFrame = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const scrollTop = window.scrollY
    const containerTop = container.offsetTop
    const scrollable = container.offsetHeight - window.innerHeight
    const raw = (scrollTop - containerTop) / scrollable
    const progress = Math.min(1, Math.max(0, raw))

    progressRef.current = progress

    // Video frame — sin pasar por React state
    if (!prefersReducedMotion) drawFrame(progress)

    // React state solo cuando cambia el panel activo
    const next = getActivePanelIndex(progress)
    setActivePanel(prev => (prev !== next ? next : prev))
  }, [prefersReducedMotion, drawFrame])

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(updateFrame)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    updateFrame()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [updateFrame])

  const showIntro = activePanel === -2
  const showFinal = activePanel === -3

  return (
    <div className="landing">
      <div ref={containerRef} className="scroll-container">
        <div className="sticky-viewport">

          <canvas ref={canvasRef} className="bg-canvas" aria-hidden="true" />

          <div className="overlay-vignette" aria-hidden="true" />
          <div className="overlay-top" aria-hidden="true" />
          <div className="overlay-bottom" aria-hidden="true" />
          <div className="overlay-sides" aria-hidden="true" />

          <div className="driver-number" aria-hidden="true">1</div>

          <div
            className={`intro-title${showIntro ? ' is-visible' : ''}`}
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
              className={`info-panel panel-${panel.side}${activePanel === i ? ' is-visible' : ''}`}
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
            className={`final-overlay${showFinal ? ' is-visible' : ''}`}
            aria-hidden={!showFinal}
          >
            <p className="final-eyebrow">UNA LEYENDA</p>
            <p className="final-headline">EN MOVIMIENTO</p>
          </div>

        </div>
      </div>

      <footer className="site-footer">
        <div className="footer-inner">
          <p className="footer-badge">RB</p>
          <p className="footer-line">Oracle Red Bull Racing · Formula 1</p>
          <p className="footer-copy">© 2025 Red Bull Racing Ltd. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
