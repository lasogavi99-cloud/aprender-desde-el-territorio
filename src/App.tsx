import { useEffect, useMemo, useState, type FormEvent } from 'react'
// @ts-ignore CSS is loaded by the bundler; it has no TypeScript module declaration.
import './App.css'

type Seccion = 'Inicio' | 'Mapa de la problemática' | 'La solución' | 'Formación docente' | 'Biblioteca de clases' | 'Mi planeador'
type Modulo = { id: number; titulo: string; descripcion: string; enfoque: string }
type Actividad = { id: number; titulo: string; categoria: string; descripcion: string; duracion: string; proposito: string }
type ActividadPlaneada = { id: number; titulo: string; area: string; fecha: string }

const secciones: Seccion[] = ['Inicio', 'Mapa de la problemática', 'La solución', 'Formación docente', 'Biblioteca de clases', 'Mi planeador']
const modulos: Modulo[] = [
  { id: 1, titulo: 'Conocer el territorio', descripcion: 'Reconocer la comunidad, su historia y su entorno.', enfoque: 'Observar el entorno, identificar espacios significativos y recuperar preguntas sobre la vida cotidiana de la comunidad.' },
  { id: 2, titulo: 'Enseñar desde el tutunakú', descripcion: 'Integrar la lengua y la identidad cultural al aprendizaje.', enfoque: 'Reconocer la lengua de los estudiantes como un recurso para dialogar, explicar, preguntar y construir conocimientos.' },
  { id: 3, titulo: 'Saberes comunitarios', descripcion: 'Aprender de las familias, los oficios y las tradiciones.', enfoque: 'Identificar conocimientos presentes en las familias y la comunidad, y explorar formas respetuosas de vincularlos con el trabajo escolar.' },
  { id: 4, titulo: 'Planeación flexible', descripcion: 'Adaptar las actividades al contexto del alumnado.', enfoque: 'Ajustar propósitos, materiales, tiempos y formas de participación a las características del grupo y a los recursos disponibles.' },
  { id: 5, titulo: 'Actividades prácticas', descripcion: 'Aprender mediante experiencias cercanas a la comunidad.', enfoque: 'Diseñar experiencias de observación, conversación, registro y resolución de problemas relacionados con el entorno.' },
  { id: 6, titulo: 'Evaluar sin excluir', descripcion: 'Observar el aprendizaje de distintas maneras.', enfoque: 'Considerar evidencias diversas: explicaciones orales, producciones, colaboración, registros y procesos, además de productos finales.' },
  { id: 7, titulo: 'Escuela y comunidad', descripcion: 'Crear vínculos entre docentes, familias y comunidad.', enfoque: 'Promover el diálogo con familias y actores comunitarios, cuidando el consentimiento y el reconocimiento de sus aportaciones.' },
  { id: 8, titulo: 'Permanencia escolar', descripcion: 'Identificar barreras y apoyar la continuidad educativa.', enfoque: 'Reconocer factores que pueden dificultar la participación y continuidad escolar, y pensar respuestas desde la colaboración.' },
]
const actividades: Actividad[] = [
  { id: 1, titulo: 'Contamos lo que nos rodea', categoria: 'Matemáticas', descripcion: 'Explorar cantidades, medidas y clasificaciones a partir de objetos y situaciones cotidianas de la comunidad.', duracion: '30 minutos', proposito: 'Relacionar ideas matemáticas con observaciones y objetos cercanos.' },
  { id: 2, titulo: 'El entorno natural', categoria: 'Ciencias', descripcion: 'Observar plantas, animales y elementos del entorno para formular preguntas y organizar hallazgos.', duracion: '40 minutos', proposito: 'Practicar la observación y la formulación de preguntas sobre el entorno.' },
  { id: 3, titulo: 'Historias de nuestra comunidad', categoria: 'Lengua y cultura', descripcion: 'Recuperar relatos familiares y conversar sobre la memoria comunitaria, con autorización de quienes participan.', duracion: '45 minutos', proposito: 'Reconocer la oralidad y la memoria local como fuentes de aprendizaje.' },
]
const AREAS = ['Lengua y cultura', 'Matemáticas', 'Ciencias', 'Saberes comunitarios', 'Planeación interdisciplinaria', 'Otra']
const FOTO_SIERRA = 'https://commons.wikimedia.org/wiki/Special:FilePath/SIERRA_NORTE_DE_PUEBLA_MUNICIPIO_DE_ATEMPAN.jpg?width=1800'
const FOTOS_SECCIONES = {
  problematica: 'https://graficoaldia.mx/wp-content/uploads/2025/03/foto-5-2.jpg',
  solucion: 'https://www.zunoticia.com/noticias-de-hidalgo/wp-content/uploads/2024/08/Zunoticia-Huejutla-1-157.png',
  formacion: 'https://th.bing.com/th/id/R.d37924030831c95fe2d80968fbbafaf6?rik=K7xlyCsRUz6p4w&riu=http%3a%2f%2fwww.proyectowakaya.com%2fwp-content%2fuploads%2f2017%2f11%2fclase-totonaca-papantla.png&ehk=%2feq1sG5oFadG0mxcJmYUL%2fC81pwC%2b8d%2fphhwAKlZYkM%3d&risl=&pid=ImgRaw&r=0',
  biblioteca: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1400&q=85',
}

function cargarActividades(): ActividadPlaneada[] {
  try {
    const guardadas = localStorage.getItem('territorio-plan')
    if (!guardadas) return []
    const datos: unknown = JSON.parse(guardadas)
    if (!Array.isArray(datos)) return []
    return datos.filter((item): item is ActividadPlaneada => item !== null && typeof item === 'object' && typeof item.id === 'number' && typeof item.titulo === 'string' && typeof item.area === 'string' && typeof item.fecha === 'string').sort((a, b) => a.fecha.localeCompare(b.fecha))
  } catch { return [] }
}

function App() {
  const [seccion, setSeccion] = useState<Seccion>('Inicio')
  const [busqueda, setBusqueda] = useState('')
  const [moduloSeleccionado, setModuloSeleccionado] = useState<Modulo | null>(null)
  const [actividadSeleccionada, setActividadSeleccionada] = useState<Actividad | null>(null)
  const [actividadesPlaneadas, setActividadesPlaneadas] = useState<ActividadPlaneada[]>(cargarActividades)
  const [nuevoTitulo, setNuevoTitulo] = useState('')
  const [nuevaArea, setNuevaArea] = useState('Lengua y cultura')
  const [nuevaFecha, setNuevaFecha] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    try { localStorage.setItem('territorio-plan', JSON.stringify(actividadesPlaneadas)) }
    catch { setMensaje('No se pudieron guardar los cambios en este navegador.') }
  }, [actividadesPlaneadas])

  const actividadesFiltradas = useMemo(() => actividades.filter(a => `${a.titulo} ${a.categoria} ${a.descripcion}`.toLowerCase().includes(busqueda.toLowerCase())), [busqueda])
  function cambiarSeccion(nombre: Seccion) { setSeccion(nombre); setModuloSeleccionado(null); setActividadSeleccionada(null); setMensaje(''); setBusqueda('') }
  function agregarActividad(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const titulo = nuevoTitulo.trim()
    if (!titulo || !nuevaFecha) { setMensaje('Completa el nombre y la fecha de la actividad.'); return }
    setActividadesPlaneadas(actuales => [...actuales, { id: Date.now(), titulo, area: nuevaArea, fecha: nuevaFecha }].sort((a, b) => a.fecha.localeCompare(b.fecha)))
    setNuevoTitulo(''); setNuevaFecha(''); setMensaje('Actividad agregada a tu planeador.')
  }
  function planearActividad(a: Actividad) { setNuevoTitulo(a.titulo); setNuevaArea(AREAS.includes(a.categoria) ? a.categoria : 'Otra'); setActividadSeleccionada(null); setSeccion('Mi planeador'); setMensaje('Elige una fecha para terminar de planificar esta actividad.') }
  function eliminarActividad(id: number) { setActividadesPlaneadas(actuales => actuales.filter(a => a.id !== id)); setMensaje('Actividad eliminada del planeador.') }

  return <div className="app-shell">
    <aside className="sidebar">
      <button className="brand" onClick={() => cambiarSeccion('Inicio')}><span className="brand-name">Aprender<small>desde el territorio</small></span></button>
      <div className="sidebar-caption">ESPACIO DOCENTE</div>
      <nav className="navigation" aria-label="Navegación principal">{secciones.map((nombre, i) => <button key={nombre} className={`nav-item ${seccion === nombre ? 'is-active' : ''}`} onClick={() => cambiarSeccion(nombre)}><span className="nav-number">{String(i + 1).padStart(2, '0')}</span><span>{nombre}</span></button>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-rule"/><p>La comunidad también es un espacio de aprendizaje.</p></div>
    </aside>
    <main className="main-content">
      

      {seccion === 'Inicio' && <>
        <section className="home-hero"><img src={FOTO_SIERRA} alt="Paisaje de la Sierra Norte de Puebla, municipio de Atempan"/><div className="hero-shade"/><div className="hero-copy"><h2>Enseñar también es escuchar al territorio.</h2><p>Explora ideas, recupera saberes comunitarios y diseña experiencias educativas conectadas con la lengua y la vida cotidiana.</p><button className="button button-light" onClick={() => cambiarSeccion('Formación docente')}>Explorar módulos <span>→</span></button></div><div className="photo-credit">Fotografía: Leti Padilla · Wikimedia Commons · CC BY-SA 4.0</div></section>
        <section className="content-section home-modules"><div className="section-heading"><div><h2>Formación docente</h2></div><button className="inline-link" onClick={() => cambiarSeccion('Formación docente')}>Ver los 8 módulos <span>→</span></button></div><div className="module-grid">{modulos.slice(0, 4).map(m => <button className="module-card" key={m.id} onClick={() => { setModuloSeleccionado(m); setSeccion('Formación docente') }}><span className="card-index">MÓDULO {String(m.id).padStart(2, '0')}</span><strong>{m.titulo}</strong><span className="card-description">{m.descripcion}</span><span className="card-action">Consultar módulo <span>→</span></span></button>)}</div></section>
        <section className="closing-quote"><span className="quote-line"/><p>El aprendizaje cobra sentido cuando dialoga con la vida, la lengua y los conocimientos de la comunidad.</p></section>
        <div className="home-closing">
  <img
    src="https://planlea.edu.do/wp-content/uploads/2022/09/estudiantes-nueva2_16569587_20210608184833-1030x579.jpg"
    alt="Aprendizaje comunitario en la Sierra Norte de Puebla"
    loading="lazy"
  />
  <div className="home-closing-text">
    <p className="eyebrow">APRENDER DESDE EL TERRITORIO</p>
    <h2>El aprendizaje también nace de lo que somos y de lo que nos rodea.</h2>
    <p>
      Reconocer la lengua, la cultura y los saberes de cada comunidad
      permite construir experiencias educativas más cercanas y significativas.
    </p>
  </div>
</div>
      </>}


      {seccion === 'Mapa de la problemática' && <section className="content-section page-content"><div className="intro-block"><p className="eyebrow">01 / CONTEXTO Y JUSTIFICACIÓN</p><h2>Una educación de calidad también debe reconocer la lengua y los saberes del territorio.</h2><p>Aprender desde el territorio busca contribuir a una educación más pertinente para la niñez totonaca de Lipuntahuaca, vinculando la práctica docente con la lengua, la cultura y los conocimientos de la comunidad.</p></div><figure className="section-photo"><img src={FOTOS_SECCIONES.problematica} alt="Espacio de aprendizaje en un aula escolar" loading="lazy"/><figcaption>El contexto escolar también forma parte de la experiencia de aprendizaje.</figcaption></figure><div className="text-block"><p className="eyebrow">EL PROBLEMA SOCIAL</p><h3>Cuando la educación se aleja del contexto</h3><p>Una enseñanza que no considera suficientemente la lengua materna, los conocimientos comunitarios y las condiciones del territorio puede crear barreras para la participación y el aprendizaje significativo.</p></div><div className="issue-grid">{[['01','Pertinencia lingüística','La lengua de los estudiantes necesita tener un lugar significativo en las experiencias de aprendizaje.'],['02','Saberes comunitarios','Los conocimientos, las experiencias y la memoria de la comunidad pueden enriquecer los contenidos escolares.'],['03','Condiciones del territorio','La planeación educativa necesita considerar el entorno y las condiciones en las que aprenden los estudiantes.'],['04','Inclusión y participación','La colaboración entre docentes, familias y comunidad puede ayudar a construir experiencias más inclusivas.']].map(([n,t,d]) => <article className="issue-card" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div><div className="ods-panel"><div className="ods-stamp"><span>OBJETIVO</span><strong>04</strong><small>ODS</small></div><div><p className="eyebrow">OBJETIVO DE DESARROLLO SOSTENIBLE</p><h3>Educación de calidad</h3><p>El proyecto se vincula con el ODS 4 de las Naciones Unidas, que busca garantizar una educación inclusiva, equitativa y de calidad, y promover oportunidades de aprendizaje durante toda la vida para todas las personas.</p><p><strong>Contribución propuesta:</strong> apoyar a los docentes en el diseño de actividades contextualizadas, inclusivas y vinculadas con la lengua y los saberes comunitarios.</p></div></div></section>}

      {seccion === 'La solución' && <section className="content-section page-content"><div className="intro-block solution-intro"><p className="eyebrow">02 / LA PROPUESTA</p><h2>Del conocimiento del territorio a la planeación del aula.</h2><p>Aprender desde el territorio es un prototipo de apoyo docente que busca conectar la planeación educativa con la lengua tutunakú, la cultura local y los saberes comunitarios.</p><button className="button button-dark" onClick={() => cambiarSeccion('Mi planeador')}>Ir a mi planeador <span>→</span></button></div><figure className="section-photo"><img src={FOTOS_SECCIONES.solucion} alt="Estudiantes aprendiendo y colaborando" loading="lazy"/><figcaption>Aprender en colaboración permite conectar los contenidos con experiencias cercanas.</figcaption></figure><div className="text-block"><p className="eyebrow">¿CÓMO FUNCIONA?</p><h3>Una ruta práctica para el docente</h3><p>La herramienta reúne espacios para explorar recursos, fortalecer la práctica educativa y organizar actividades.</p></div><div className="steps-list">{[['01','Explora','Consulta actividades de ejemplo en la biblioteca y encuentra propuestas por área de aprendizaje.','Biblioteca de clases'],['02','Contextualiza','Considera la lengua, las experiencias de los estudiantes y los conocimientos de su comunidad al adaptar una actividad.','Formación docente'],['03','Planea','Registra el nombre, el área y la fecha de una actividad para organizar tu trabajo docente.','Mi planeador']].map(([n,t,d,dest]) => <article className="step-row" key={n}><span className="step-number">{n}</span><div><h3>{t}</h3><p>{d}</p><button className="inline-link" onClick={() => cambiarSeccion(dest as Seccion)}>Ir a {dest.toLowerCase()} <span>→</span></button></div></article>)}</div><div className="benefit-block"><p className="eyebrow">BENEFICIO PARA EL USUARIO</p><h3>Planear con mayor pertinencia para el contexto.</h3><p>El beneficio esperado es facilitar la organización de experiencias de aprendizaje relacionadas con la lengua, la cultura y la vida comunitaria, ofreciendo al docente un espacio para explorar propuestas y planificar actividades.</p></div></section>}

      {seccion === 'Formación docente' && <section className="content-section page-content">{moduloSeleccionado ? <div className="module-detail"><figure className="section-photo"><img src={FOTOS_SECCIONES.formacion} alt="Docente acompañando una actividad de aprendizaje" loading="lazy"/><figcaption>Ideas para fortalecer la práctica docente desde el contexto.</figcaption></figure><button className="inline-link back-link" onClick={() => setModuloSeleccionado(null)}>← Volver a los módulos</button><p className="eyebrow">MÓDULO {String(moduloSeleccionado.id).padStart(2, '0')}</p><h2>{moduloSeleccionado.titulo}</h2><p className="detail-lead">{moduloSeleccionado.descripcion}</p><div className="detail-content"><h3>Enfoque de trabajo</h3><p>{moduloSeleccionado.enfoque}</p><p className="source-note">Esta es una orientación inicial del prototipo. Debe revisarse y complementarse con el manual educativo y las fuentes del proyecto antes de su implementación.</p></div></div> : <><div className="page-lead"><p className="eyebrow">RECORRIDO FORMATIVO</p><h2>Ocho temas para reflexionar sobre la práctica docente.</h2><p>Selecciona un módulo para consultar su enfoque de trabajo. Los contenidos son una estructura inicial que se desarrollará con el manual educativo.</p></div><figure className="section-photo"><img src={FOTOS_SECCIONES.formacion} alt="Docente acompañando una actividad en el aula" loading="lazy"/><figcaption>La reflexión y la planeación docente son parte de una enseñanza contextualizada.</figcaption></figure><div className="module-grid all-modules">{modulos.map(m => <button className="module-card" key={m.id} onClick={() => setModuloSeleccionado(m)}><span className="card-index">MÓDULO {String(m.id).padStart(2, '0')}</span><strong>{m.titulo}</strong><span className="card-description">{m.descripcion}</span><span className="card-action">Abrir módulo <span>→</span></span></button>)}</div></>}</section>}

      {seccion === 'Biblioteca de clases' && <section className="content-section page-content"><div className="page-lead"><h2>Ideas para comenzar a diseñar experiencias de aprendizaje.</h2></div><figure className="section-photo"><img src={FOTOS_SECCIONES.biblioteca} alt="Libros y materiales para preparar actividades educativas" loading="lazy"/><figcaption>Recursos para diseñar actividades vinculadas con el entorno y la comunidad.</figcaption></figure><label className="search-label" htmlFor="buscar-actividad">BUSCAR ACTIVIDADES</label><input id="buscar-actividad" className="search-input" type="search" placeholder="Título, área o palabra clave" value={busqueda} onChange={e => setBusqueda(e.target.value)}/><div className="activity-list">{actividadesFiltradas.map(a => <button className="activity-row" key={a.id} onClick={() => setActividadSeleccionada(a)}><span className="activity-category">{a.categoria}</span><span className="activity-main"><strong>{a.titulo}</strong><small>{a.descripcion}</small></span><span className="activity-duration">{a.duracion}</span><span className="row-arrow">→</span></button>)}{actividadesFiltradas.length === 0 && <p className="empty-state">No encontramos actividades con esa búsqueda.</p>}</div>{actividadSeleccionada && <div className="activity-detail"><button className="inline-link" onClick={() => setActividadSeleccionada(null)}>← Volver a la biblioteca</button><p className="eyebrow">{actividadSeleccionada.categoria} · {actividadSeleccionada.duracion}</p><h3>{actividadSeleccionada.titulo}</h3><p>{actividadSeleccionada.descripcion}</p><p><strong>Propósito:</strong> {actividadSeleccionada.proposito}</p><p className="source-note">Propuesta de ejemplo creada para el prototipo; no es una actividad oficial extraída de los documentos del proyecto.</p><button className="button button-dark" onClick={() => planearActividad(actividadSeleccionada)}>Agregar al planeador <span>→</span></button></div>}</section>}

      {seccion === 'Mi planeador' && <section className="content-section page-content planner-page"><div className="page-lead"><p className="eyebrow">ORGANIZACIÓN DOCENTE</p><h2>Organiza tus experiencias de aprendizaje.</h2><p>Registra actividades y consulta las fechas que has planeado. La información se conserva en este navegador.</p></div><figure className="section-photo planner-photo"></figure><form className="planner-form" onSubmit={agregarActividad}><h3>Nueva actividad</h3><label htmlFor="titulo-actividad">Nombre de la actividad</label><input id="titulo-actividad" className="search-input" type="text" placeholder="Ej. Historias de nuestra comunidad" value={nuevoTitulo} onChange={e => setNuevoTitulo(e.target.value)} required/><label htmlFor="area-actividad">Área de aprendizaje</label><select id="area-actividad" className="search-input" value={nuevaArea} onChange={e => setNuevaArea(e.target.value)}>{AREAS.map(a => <option key={a} value={a}>{a}</option>)}</select><label htmlFor="fecha-actividad">Fecha planeada</label><input id="fecha-actividad" className="search-input" type="date" value={nuevaFecha} onChange={e => setNuevaFecha(e.target.value)} required/><button className="button button-dark" type="submit">Guardar actividad <span>→</span></button>{mensaje && <p className="form-message" role="status">{mensaje}</p>}</form><div className="planned-section"><div className="section-heading"><div><p className="eyebrow">TU ORGANIZACIÓN</p><h3>Actividades planeadas</h3></div><span className="count-label">{actividadesPlaneadas.length} {actividadesPlaneadas.length === 1 ? 'actividad' : 'actividades'}</span></div>{actividadesPlaneadas.length === 0 ? <div className="empty-state">Tu planeador está listo. Agrega tu primera actividad para comenzar a organizar tus clases.</div> : <div className="planned-list">{actividadesPlaneadas.map(a => <article className="planned-row" key={a.id}><time dateTime={a.fecha}>{new Date(`${a.fecha}T12:00:00`).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}</time><div><strong>{a.titulo}</strong><span>{a.area}</span></div><button className="delete-button" type="button" onClick={() => eliminarActividad(a.id)} aria-label={`Eliminar ${a.titulo}`}>Eliminar</button></article>)}</div>}</div></section>}
    </main>
  </div>
}

export default App
