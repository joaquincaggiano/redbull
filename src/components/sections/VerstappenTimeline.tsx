import { useEffect, useRef } from 'react'

interface TimelineEntry {
  date: string
  title: string
  description: string
}

const verstappenTimeline: TimelineEntry[] = [
  {
    date: "2001",
    title: "Inicio en el Karting",
    description:
      "Con tan solo 4 años, Max Verstappen comienza a conducir karts en la provincia de Limburg, Bélgica, influenciado por su padre Jos Verstappen (ex piloto de F1) y su madre Sophie Kumpen (piloto de karting).",
  },
  {
    date: "2005",
    title: "Primera Carrera Oficial de Karting",
    description:
      "A los 7 años disputa su primera carrera oficial en el Campeonato de Limburgo de Karting (Mini-Junior), logrando un segundo puesto. Las reglas le impedían competir antes de esa edad.",
  },
  {
    date: "2006",
    title: "Primer Campeonato de Karting",
    description:
      "Gana el campeonato belga en la clase Mini con un dominio absoluto: 21 victorias en 21 carreras. A los 9 años ya es campeón tanto en Bélgica como en los Países Bajos.",
  },
  {
    date: "2010",
    title: "Salto al Karting Internacional",
    description:
      "Se une al equipo CRG y debuta en el karting internacional en la clase KF3. Gana la WSK World Series, la WSK Euro Series y la Nations Cup en su primer año, dejando claro su talento a nivel mundial.",
  },
  {
    date: "2013",
    title: "Campeón Mundial de Karting (KZ)",
    description:
      "Con 15 años gana el Campeonato Mundial CIK-FIA en la categoría KZ1 en Varennes-sur-Allier, Francia — la categoría más alta del karting. También conquista los campeonatos europeos KF y KZ ese mismo año.",
  },
  {
    date: "2014",
    title: "Debut en Monoplazas (Florida Winter Series)",
    description:
      "Con 16 años da el salto a los coches de carreras. Compite en la Florida Winter Series y luego en el Campeonato Europeo de Fórmula 3 con Van Amersfoort Racing, donde gana 10 carreras y termina tercero en el campeonato.",
  },
  {
    date: "2014",
    title: "Fichaje por Red Bull Junior Team",
    description:
      "Red Bull lo incorpora a su programa de jóvenes pilotos y anuncia que tendrá un asiento titular en Fórmula 1 con Toro Rosso para 2015. Con solo 16 años, se convierte en el piloto más joven confirmado para la F1.",
  },
  {
    date: "2015",
    title: "Debut en Fórmula 1 — GP de Australia",
    description:
      "Con 17 años y 166 días, se convierte en el piloto más joven en competir en la historia de la F1, debutando con Scuderia Toro Rosso en el GP de Australia en Melbourne. Abandona por fallo de motor tras 32 vueltas.",
  },
  {
    date: "2016",
    title: "Primera Victoria y Primer Podio — GP de España",
    description:
      "En su primera carrera con Red Bull Racing (tras ser promovido desde Toro Rosso), gana el GP de España a los 18 años y 228 días, convirtiéndose en el ganador más joven en la historia de la F1. También su primer podio.",
  },
  {
    date: "2019",
    title: "Primera Pole Position — GP de Hungría",
    description:
      "Consigue su primera pole position en el GP de Hungría en el Hungaroring, convirtiéndose en el primer neerlandés en lograr una pole en F1 y el piloto número 100 en la historia en conseguirla.",
  },
  {
    date: "2021",
    title: "Primer Campeonato Mundial de F1",
    description:
      "Gana su primer título mundial en un final épico en el GP de Abu Dhabi, superando a Lewis Hamilton en la última vuelta tras un polémico safety car. Termina la temporada con 10 victorias y 18 podios.",
  },
  {
    date: "2022",
    title: "Bicampeón Mundial de F1",
    description:
      "Conquista su segundo campeonato en el GP de Japón con una temporada dominante: 15 victorias en 22 carreras y 454 puntos, estableciendo un nuevo récord de puntos en una sola temporada.",
  },
  {
    date: "2023",
    title: "Tricampeón Mundial de F1",
    description:
      "Logra su tercer título consecutivo en el GP de Qatar con una temporada histórica: 19 victorias en 22 carreras (récord absoluto), 21 podios y 575 puntos, redefiniendo los estándares de dominio en la F1.",
  },
  {
    date: "2024",
    title: "Tetracampeón Mundial de F1",
    description:
      "Se consagra tetracampeón en el GP de Las Vegas 2024 con 9 victorias en la temporada, resistiendo un fuerte desafío de Lando Norris y McLaren a pesar de un Red Bull menos dominante que en años anteriores.",
  },
]

const CHAMPION_YEARS = new Set(["2021", "2022", "2023", "2024"])

function formatDate(raw: string): string {
  if (raw.includes('-')) {
    const [year, month] = raw.split('-')
    const months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC']
    return `${months[parseInt(month, 10) - 1]} ${year}`
  }
  return raw
}

export function VerstappenTimeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('tl-item--visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -60px 0px' }
    )

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className="tl-section" ref={sectionRef} aria-label="Trayectoria de Max Verstappen">
      {/* Section header */}
      <div className="tl-header">
        <span className="tl-header-eyebrow">Oracle Red Bull Racing</span>
        <h2 className="tl-header-title">La Trayectoria</h2>
        <div className="tl-header-line" />
      </div>

      {/* Timeline */}
      <div className="tl-track">
        {/* Vertical spine */}
        <div className="tl-spine" aria-hidden="true" />

        {verstappenTimeline.map((entry, i) => {
          const isChamp = CHAMPION_YEARS.has(entry.date.split('-')[0])
          const isRight = i % 2 === 0

          return (
            <div
              key={`${entry.date}-${i}`}
              ref={(el) => { itemRefs.current[i] = el }}
              className={`tl-item${isRight ? ' tl-item--right' : ' tl-item--left'}${isChamp ? ' tl-item--champ' : ''}`}
            >
              {/* Card */}
              <div className="tl-card">
                <div className="tl-card-accent" />
                <time className="tl-card-date">{formatDate(entry.date)}</time>
                <h3 className="tl-card-title">{entry.title}</h3>
                <p className="tl-card-desc">{entry.description}</p>
                {isChamp && (
                  <div className="tl-champ-badge" aria-label="Título Mundial">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    Campeón del Mundo
                  </div>
                )}
              </div>

              {/* Spine dot */}
              <div className="tl-dot" aria-hidden="true">
                <div className="tl-dot-inner" />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
