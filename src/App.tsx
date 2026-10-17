
import { useEffect, useState, type FormEvent } from 'react'
import './App.css'

// Estructura de los módulos de formación docente
type Modulo = {
  id: number
  titulo: string
  descripcion: string
  icono: string
}

// Estructura de las actividades de la biblioteca
type Actividad = {
  titulo: string
  categoria: string
  descripcion: string
  duracion: string
}

// Estructura de las actividades del planeador
type ActividadPlaneada = {
  id: number
  titulo: string
  area: string
  fecha: string
}

// Módulos iniciales del prototipo
const modulos: Modulo[] = [
  {
    id: 1,
    titulo: 'Conocer el territorio',
    descripcion: 'Reconocer la comunidad, su historia y su entorno.',
    icono: '01',
  },
  {
    id: 2,
    titulo: 'Enseñar desde el tutunakú',
    descripcion: 'Integrar la lengua y la identidad cultural al aprendizaje.',
    icono: '02',
  },
  {
    id: 3,
    titulo: 'Saberes comunitarios',
    descripcion: 'Aprender de las familias, los oficios y las tradiciones.',
    icono: '03',
  },
  {
    id: 4,
    titulo: 'Planeación flexible',
    descripcion: 'Adaptar las actividades al contexto del alumnado.',
    icono: '04',
  },
  {
    id: 5,
    titulo: 'Actividades prácticas',
    descripcion: 'Aprender mediante experiencias cercanas a la comunidad.',
    icono: '05',
  },
  {
    id: 6,
    titulo: 'Evaluar sin excluir',
    descripcion: 'Observar el aprendizaje de distintas maneras.',
    icono: '06',
  },
  {
    id: 7,
    titulo: 'Escuela y comunidad',
    descripcion: 'Crear vínculos entre docentes, familias y comunidad.',
    icono: '07',
  },
  {
    id: 8,
    titulo: 'Permanencia escolar',
    descripcion: 'Identificar barreras y apoyar la continuidad educativa.',
    icono: '08',
  },
]

// Actividades de ejemplo para la biblioteca
const actividades: Actividad[] = [
  {
    titulo: 'Contamos lo que nos rodea',
    categoria: 'Matemáticas',
    descripcion:
      'Explorar cantidades y clasificaciones usando objetos cotidianos de la comunidad.',
    duracion: '30 minutos',
  },
  {
    titulo: 'El entorno natural',
    categoria: 'Ciencias',
    descripcion:
      'Observar plantas, animales y elementos del entorno para formular preguntas.',
    duracion: '40 minutos',
  },
  {
    titulo: 'Historias de nuestra comunidad',
    categoria: 'Lengua y cultura',
    descripcion:
      'Recuperar relatos familiares y conversar sobre la memoria comunitaria.',
    duracion: '45 minutos',
  },
]

const AREAS = [
  'Lengua y cultura',
  'Matemáticas',
  'Ciencias',
  'Saberes comunitarios',
  'Planeación interdisciplinaria',
  'Otra',
]

function cargarActividades(): ActividadPlaneada[] {
  try {
    const guardadas = localStorage.getItem('territorio-plan')

    if (!guardadas) {
      return []
    }

    const datos: unknown = JSON.parse(guardadas)

    if (!Array.isArray(datos)) {
      return []
    }

    return datos.filter(
      (item): item is ActividadPlaneada =>
        typeof item.id === 'number' &&
        typeof item.titulo === 'string' &&
        typeof item.area === 'string' &&
        typeof item.fecha === 'string',
    )
  } catch {
    return []
  }
}

function App() {
  const [seccion, setSeccion] = useState('Inicio')
  const [busqueda, setBusqueda] = useState('')

  const [moduloSeleccionado, setModuloSeleccionado] =
    useState<Modulo | null>(null)

  const [actividadSeleccionada, setActividadSeleccionada] =
    useState<Actividad | null>(null)

  // Recupera las actividades guardadas al iniciar la aplicación
  const [actividadesPlaneadas, setActividadesPlaneadas] =
    useState<ActividadPlaneada[]>(cargarActividades)

  // Datos del formulario
  const [nuevoTitulo, setNuevoTitulo] = useState('')
  const [nuevaArea, setNuevaArea] = useState('Lengua y cultura')
  const [nuevaFecha, setNuevaFecha] = useState('')

  // Mensaje para confirmar acciones
  const [mensaje, setMensaje] = useState('')

  // Guarda la lista cada vez que cambia
  useEffect(() => {
    try {
      localStorage.setItem(
        'territorio-plan',
        JSON.stringify(actividadesPlaneadas),
      )
    } catch {
      setMensaje(
        'No se pudieron guardar los cambios en este navegador.',
      )
    }
  }, [actividadesPlaneadas])

  // Filtra la biblioteca de actividades
  const actividadesFiltradas = actividades.filter((actividad) =>
    `${actividad.titulo} ${actividad.categoria} ${actividad.descripcion}`
      .toLowerCase()
      .includes(busqueda.toLowerCase()),
  )

  // Cambia de sección y cierra los detalles abiertos
  function cambiarSeccion(nombre: string) {
    setSeccion(nombre)
    setModuloSeleccionado(null)
    setActividadSeleccionada(null)
    setMensaje('')
  }

  // Agrega una actividad al planeador
  function agregarActividad(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    const titulo = nuevoTitulo.trim()

    if (!titulo || !nuevaFecha) {
      setMensaje('Completa el nombre y la fecha de la actividad.')
      return
    }

    const nuevaActividad: ActividadPlaneada = {
      id: Date.now(),
      titulo,
      area: nuevaArea,
      fecha: nuevaFecha,
    }

    setActividadesPlaneadas((actuales) =>
      [...actuales, nuevaActividad].sort((a, b) =>
        a.fecha.localeCompare(b.fecha),
      ),
    )

    setNuevoTitulo('')
    setNuevaFecha('')
    setMensaje('¡Actividad agregada a tu planeador!')
  }

  // Elimina una actividad
  function eliminarActividad(id: number) {
    setActividadesPlaneadas((actuales) =>
      actuales.filter((actividad) => actividad.id !== id),
    )

    setMensaje('Actividad eliminada del planeador.')
  }

  // Pasa una actividad de la biblioteca al formulario del planeador
  function planearActividad(actividad: Actividad) {
    setNuevoTitulo(actividad.titulo)
    setNuevaArea(actividad.categoria)
    setActividadSeleccionada(null)
    setSeccion('Mi planeador')
    setMensaje('Elige una fecha para terminar de planificar esta actividad.')
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon"></span>
          <div>
            <h2>Aprender</h2>
            <p>desde el territorio</p>
          </div>
        </div>

        <p className="menu-label">ESPACIO DOCENTE</p>

        <nav className="menu">
          {[
            'Inicio',
            'Formación docente',
            'Biblioteca de clases',
            'Mi planeador',
          ].map((nombre) => (
            <button
              key={nombre}
              className={`menu-item ${seccion === nombre ? 'active' : ''}`}
              onClick={() => cambiarSeccion(nombre)}
            >
              <span>
                {{
                  Inicio: '⌂',
                  'Formación docente': '▤',
                  'Biblioteca de clases': '▧',
                  'Mi planeador': '▦',
                }[nombre]}
              </span>
              {nombre}
            </button>
          ))}
        </nav>

        <div className="sidebar-note">
          <p>
            <strong>Aprender con sentido</strong>
            <br />
            La comunidad también es un espacio de aprendizaje.
          </p>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">EDUCACIÓN INTERCULTURAL</p>
            <h1>{seccion}</h1>
          </div>

          <div className="profile">
             <span>Espacio docente</span>
          </div>
        </header>

        {/* PANTALLA DE INICIO */}
        {seccion === 'Inicio' && (
          <>
            <section className="hero">
              <div className="hero-content">
                <p className="eyebrow">
                  BIENVENIDA A TU ESPACIO DE APRENDIZAJE
                </p>

                <h2>Enseñar también es escuchar al territorio.</h2>

                <p>
                  Explora ideas, recupera saberes comunitarios y diseña
                  experiencias educativas conectadas con la vida cotidiana.
                </p>

                <button
                  className="primary-button"
                  onClick={() => cambiarSeccion('Formación docente')}
                >
                  Explorar módulos <span>→</span>
                </button>
              </div>

              <div className="hero-decoration"></div>
            </section>

            <section className="section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">TU RUTA DE APRENDIZAJE</p>
                  <h2>Formación docente</h2>
                </div>

                <button
                  className="text-button"
                  onClick={() => cambiarSeccion('Formación docente')}
                >
                  Ver todos →
                </button>
              </div>

              <div className="module-grid">
                {modulos.slice(0, 4).map((modulo) => (
                  <button
                    className="module-card"
                    key={modulo.id}
                    onClick={() => {
                      setModuloSeleccionado(modulo)
                      setSeccion('Formación docente')
                    }}
                  >
                    <span className="module-icon">{modulo.icono}</span>

                    <span className="module-number">
                      MÓDULO {String(modulo.id).padStart(2, '0')}
                    </span>

                    <strong>{modulo.titulo}</strong>

                    <span className="module-description">
                      {modulo.descripcion}
                    </span>

                    <span className="card-link">Explorar módulo →</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="quote">
              <span>“</span>
              <p>
                El aprendizaje cobra sentido cuando dialoga con la vida,
                la lengua y los conocimientos de la comunidad.
              </p>
            </section>
          </>
        )}

        {/* FORMACIÓN DOCENTE */}
        {seccion === 'Formación docente' && (
          <section className="section">
            {moduloSeleccionado ? (
              <div className="detail-panel">
                <button
                  className="text-button"
                  onClick={() => setModuloSeleccionado(null)}
                >
                  ← Volver a los módulos
                </button>

                <span className="module-icon">
                  {moduloSeleccionado.icono}
                </span>

                <p className="eyebrow">
                  MÓDULO {moduloSeleccionado.id}
                </p>

                <h2>{moduloSeleccionado.titulo}</h2>

                <p>{moduloSeleccionado.descripcion}</p>

                <p>
                  Este espacio se completará con objetivos, contenidos,
                  actividades y evidencias de aprendizaje validados a partir
                  de los documentos del proyecto.
                </p>
              </div>
            ) : (
              <div className="module-grid">
                {modulos.map((modulo) => (
                  <button
                    className="module-card"
                    key={modulo.id}
                    onClick={() => setModuloSeleccionado(modulo)}
                  >
                    <span className="module-icon">{modulo.icono}</span>

                    <span className="module-number">
                      MÓDULO {String(modulo.id).padStart(2, '0')}
                    </span>

                    <strong>{modulo.titulo}</strong>

                    <span className="module-description">
                      {modulo.descripcion}
                    </span>

                    <span className="card-link">Abrir módulo →</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* BIBLIOTECA DE CLASES */}
        {seccion === 'Biblioteca de clases' && (
          <section className="section">
            <p>
              Explora actividades de ejemplo. Después las vincularemos con
              las evidencias y los materiales reales del proyecto.
            </p>

            <input
              className="search-input"
              type="search"
              placeholder="Buscar por título, tema o descripción..."
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />

            <div className="lesson-list">
              {actividadesFiltradas.map((actividad) => (
                <button
                  className="lesson-card"
                  key={actividad.titulo}
                  onClick={() => setActividadSeleccionada(actividad)}
                >
                  <span className="module-icon"></span>

                  <span className="lesson-info">
                    <span className="module-number">
                      {actividad.categoria}
                    </span>

                    <strong>{actividad.titulo}</strong>

                    <span>{actividad.descripcion}</span>

                    <span className="module-number">
                      {actividad.duracion}
                    </span>
                  </span>

                  <span>→</span>
                </button>
              ))}

              {actividadesFiltradas.length === 0 && (
                <p>No encontramos actividades con esa búsqueda.</p>
              )}
            </div>

            {actividadSeleccionada && (
              <div className="detail-panel">
                <button
                  className="text-button"
                  onClick={() => setActividadSeleccionada(null)}
                >
                  ← Volver a la biblioteca
                </button>

                <h2>{actividadSeleccionada.titulo}</h2>

                <p>{actividadSeleccionada.descripcion}</p>

                <p>
                  <strong>Área:</strong>{' '}
                  {actividadSeleccionada.categoria}
                </p>

                <p>
                  <strong>Duración sugerida:</strong>{' '}
                  {actividadSeleccionada.duracion}
                </p>

                <p>
                  <strong>Nota:</strong> esta es una propuesta inicial,
                  no una actividad oficial extraída de tus documentos.
                </p>

                <button
                  className="primary-button"
                  onClick={() => planearActividad(actividadSeleccionada)}
                >
                  Agregar al planeador →
                </button>
              </div>
            )}
          </section>
        )}

        {/* PLANEADOR DOCENTE INTERACTIVO */}
        {seccion === 'Mi planeador' && (
          <section className="section">
            <div className="planner-intro">
              <span className="module-icon"></span>

              <h2>Organiza tus experiencias de aprendizaje</h2>

              <p>
                Planifica actividades relacionadas con el aula, la lengua
                y los saberes de la comunidad.
              </p>
            </div>

            <form className="planner-form" onSubmit={agregarActividad}>
              <h3>Agregar actividad</h3>

              <label htmlFor="titulo-actividad">
                Nombre de la actividad
              </label>

              <input
                id="titulo-actividad"
                className="search-input"
                type="text"
                placeholder="Ej. Historias de nuestra comunidad"
                value={nuevoTitulo}
                onChange={(evento) => setNuevoTitulo(evento.target.value)}
                required
              />

              <label htmlFor="area-actividad">
                Área de aprendizaje
              </label>

              <select
                id="area-actividad"
                className="search-input"
                value={nuevaArea}
                onChange={(evento) => setNuevaArea(evento.target.value)}
              >
                {AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>

              <label htmlFor="fecha-actividad">
                Fecha planeada
              </label>

              <input
                id="fecha-actividad"
                className="search-input"
                type="date"
                value={nuevaFecha}
                onChange={(evento) => setNuevaFecha(evento.target.value)}
                required
              />

              <button className="primary-button" type="submit">
                + Guardar actividad
              </button>

              {mensaje && (
                <p className="planner-message" role="status">
                  {mensaje}
                </p>
              )}
            </form>

            <div className="planner-list">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">TU ORGANIZACIÓN</p>
                  <h2>Actividades planeadas</h2>
                </div>

                <span className="planner-count">
                  {actividadesPlaneadas.length}{' '}
                  {actividadesPlaneadas.length === 1
                    ? 'actividad'
                    : 'actividades'}
                </span>
              </div>

              {actividadesPlaneadas.length === 0 ? (
                <div className="empty-planner">
                  <h3>Tu planeador está listo</h3>
                  <p>
                    Agrega tu primera actividad para comenzar a organizar
                    tus clases.
                  </p>
                </div>
              ) : (
                <div className="lesson-list">
                  {actividadesPlaneadas.map((actividad) => (
                    <article
                      className="planned-card"
                      key={actividad.id}
                    >
                      <div className="planned-date">
                        <strong>{actividad.fecha}</strong>
                      </div>

                      <div className="lesson-info">
                        <strong>{actividad.titulo}</strong>
                        <span>{actividad.area}</span>
                      </div>

                      <button
                        className="delete-button"
                        type="button"
                        onClick={() => eliminarActividad(actividad.id)}
                        aria-label={`Eliminar ${actividad.titulo}`}
                      >
                        Eliminar
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        <footer className="footer">
          Aprender desde el territorio · Prototipo inicial
        </footer>
      </main>
    </div>
  )
}

export default App
