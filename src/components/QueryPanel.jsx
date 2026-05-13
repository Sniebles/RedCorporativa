import { useState } from 'react';

const QueryPanel = ({ onExecuteQuery }) => {
  const [usuarioData, setUsuarioData] = useState({ nombre: '', profesion: '', experiencia: '' });
  const [empresaData, setEmpresaData] = useState({ nombre: '', sector: '' });
  const [habilidadData, setHabilidadData] = useState({ nombre: '' });
  const [usuarioHabilidad, setUsuarioHabilidad] = useState({ usuario: '', habilidad: '' });
  const [conexion, setConexion] = useState({ usuario1: '', usuario2: '' });
  const [trabaja, setTrabaja] = useState({ usuario: '', empresa: '' });
  const [ofertaData, setOfertaData] = useState({ titulo: '', empresa: '' });
  const [ofertaHabilidad, setOfertaHabilidad] = useState({ oferta: '', habilidad: '' });
  const [similares, setSimilares] = useState({ nombre: '' });
  const [ruta, setRuta] = useState({ nodo1: '', nodo2: '' });
  const [proyectoData, setProyectoData] = useState({ nombre: '', descripcion: '' });
  const [usuarioProyecto, setUsuarioProyecto] = useState({ usuario: '', proyecto: '' });
  const [proyectoHabilidad, setProyectoHabilidad] = useState({ proyecto: '', habilidad: '' });
  const [contactos, setContactos] = useState({ usuario1: '', usuario2: '' });
  const [recomendados, setRecomendados] = useState({ oferta: '' });
  const [proyectosRelacionados, setProyectosRelacionados] = useState({ proyecto: '' });

  const handleSubmit = (endpoint, data, method = 'POST') => {
    onExecuteQuery(endpoint, data, method);
  };

  return (
    <div className="query-panel">
      <h2>Queries</h2>

      <div>
        <h3>Crear Usuario</h3>
        <input placeholder="Nombre" value={usuarioData.nombre} onChange={e => setUsuarioData({...usuarioData, nombre: e.target.value})} />
        <input placeholder="Profesión" value={usuarioData.profesion} onChange={e => setUsuarioData({...usuarioData, profesion: e.target.value})} />
        <input placeholder="Experiencia" value={usuarioData.experiencia} onChange={e => setUsuarioData({...usuarioData, experiencia: e.target.value})} />
        <button onClick={() => handleSubmit('/usuarios', usuarioData)}>Crear</button>
      </div>

      <div>
        <h3>Crear Empresa</h3>
        <input placeholder="Nombre" value={empresaData.nombre} onChange={e => setEmpresaData({...empresaData, nombre: e.target.value})} />
        <input placeholder="Sector" value={empresaData.sector} onChange={e => setEmpresaData({...empresaData, sector: e.target.value})} />
        <button onClick={() => handleSubmit('/empresas', empresaData)}>Crear</button>
      </div>

      <div>
        <h3>Crear Habilidad</h3>
        <input placeholder="Nombre" value={habilidadData.nombre} onChange={e => setHabilidadData({...habilidadData, nombre: e.target.value})} />
        <button onClick={() => handleSubmit('/habilidades', habilidadData)}>Crear</button>
      </div>

      <div>
        <h3>Usuario - Habilidad</h3>
        <input placeholder="Usuario" value={usuarioHabilidad.usuario} onChange={e => setUsuarioHabilidad({...usuarioHabilidad, usuario: e.target.value})} />
        <input placeholder="Habilidad" value={usuarioHabilidad.habilidad} onChange={e => setUsuarioHabilidad({...usuarioHabilidad, habilidad: e.target.value})} />
        <button onClick={() => handleSubmit('/usuarios/habilidad', usuarioHabilidad)}>Relacionar</button>
      </div>

      <div>
        <h3>Conectar Usuarios</h3>
        <input placeholder="Usuario 1" value={conexion.usuario1} onChange={e => setConexion({...conexion, usuario1: e.target.value})} />
        <input placeholder="Usuario 2" value={conexion.usuario2} onChange={e => setConexion({...conexion, usuario2: e.target.value})} />
        <button onClick={() => handleSubmit('/usuarios/conexion', conexion)}>Conectar</button>
      </div>

      <div>
        <h3>Usuario Trabaja en Empresa</h3>
        <input placeholder="Usuario" value={trabaja.usuario} onChange={e => setTrabaja({...trabaja, usuario: e.target.value})} />
        <input placeholder="Empresa" value={trabaja.empresa} onChange={e => setTrabaja({...trabaja, empresa: e.target.value})} />
        <button onClick={() => handleSubmit('/usuarios/trabaja', trabaja)}>Relacionar</button>
      </div>

      <div>
        <h3>Crear Oferta</h3>
        <input placeholder="Título" value={ofertaData.titulo} onChange={e => setOfertaData({...ofertaData, titulo: e.target.value})} />
        <input placeholder="Empresa" value={ofertaData.empresa} onChange={e => setOfertaData({...ofertaData, empresa: e.target.value})} />
        <button onClick={() => handleSubmit('/ofertas', ofertaData)}>Crear</button>
      </div>

      <div>
        <h3>Oferta Requiere Habilidad</h3>
        <input placeholder="Oferta" value={ofertaHabilidad.oferta} onChange={e => setOfertaHabilidad({...ofertaHabilidad, oferta: e.target.value})} />
        <input placeholder="Habilidad" value={ofertaHabilidad.habilidad} onChange={e => setOfertaHabilidad({...ofertaHabilidad, habilidad: e.target.value})} />
        <button onClick={() => handleSubmit('/ofertas/habilidad', ofertaHabilidad)}>Relacionar</button>
      </div>

      <div>
        <h3>Usuarios Con Habilidades Similares</h3>
        <input placeholder="Nombre" value={similares.nombre} onChange={e => setSimilares({...similares, nombre: e.target.value})} />
        <button onClick={() => handleSubmit(`/usuarios/similares/${similares.nombre}`, {}, 'GET')}>Buscar</button>
      </div>

      <div>
        <h3>Ruta Más Corta</h3>
        <input placeholder="Nodo 1 (ej: Usuario:Santiago)" value={ruta.nodo1} onChange={e => setRuta({...ruta, nodo1: e.target.value})} />
        <input placeholder="Nodo 2 (ej: Empresa:Google)" value={ruta.nodo2} onChange={e => setRuta({...ruta, nodo2: e.target.value})} />
        <button onClick={() => handleSubmit(`/ruta/${ruta.nodo1}/${ruta.nodo2}`, {}, 'GET')}>Buscar</button>
      </div>

      <div>
        <h3>Crear Proyecto</h3>
        <input placeholder="Nombre" value={proyectoData.nombre} onChange={e => setProyectoData({...proyectoData, nombre: e.target.value})} />
        <input placeholder="Descripción" value={proyectoData.descripcion} onChange={e => setProyectoData({...proyectoData, descripcion: e.target.value})} />
        <button onClick={() => handleSubmit('/proyectos', proyectoData)}>Crear</button>
      </div>

      <div>
        <h3>Usuario participa en Proyecto</h3>
        <input placeholder="Usuario" value={usuarioProyecto.usuario} onChange={e => setUsuarioProyecto({...usuarioProyecto, usuario: e.target.value})} />
        <input placeholder="Proyecto" value={usuarioProyecto.proyecto} onChange={e => setUsuarioProyecto({...usuarioProyecto, proyecto: e.target.value})} />
        <button onClick={() => handleSubmit('/usuarios/proyecto', usuarioProyecto)}>Relacionar</button>
      </div>

      <div>
        <h3>Proyecto usa Habilidad</h3>
        <input placeholder="Proyecto" value={proyectoHabilidad.proyecto} onChange={e => setProyectoHabilidad({...proyectoHabilidad, proyecto: e.target.value})} />
        <input placeholder="Habilidad" value={proyectoHabilidad.habilidad} onChange={e => setProyectoHabilidad({...proyectoHabilidad, habilidad: e.target.value})} />
        <button onClick={() => handleSubmit('/proyectos/habilidad', proyectoHabilidad)}>Relacionar</button>
      </div>

      <div>
        <h3>Contactos en Común</h3>
        <input placeholder="Usuario 1" value={contactos.usuario1} onChange={e => setContactos({...contactos, usuario1: e.target.value})} />
        <input placeholder="Usuario 2" value={contactos.usuario2} onChange={e => setContactos({...contactos, usuario2: e.target.value})} />
        <button onClick={() => handleSubmit(`/usuarios/contactos/${contactos.usuario1}/${contactos.usuario2}`, {}, 'GET')}>Buscar</button>
      </div>

      <div>
        <h3>Recomendados para Oferta</h3>
        <input placeholder="Oferta" value={recomendados.oferta} onChange={e => setRecomendados({...recomendados, oferta: e.target.value})} />
        <button onClick={() => handleSubmit(`/ofertas/recomendados/conexiones/${recomendados.oferta}`, {}, 'GET')}>Buscar</button>
      </div>

      <div>
        <h3>Proyectos Relacionados</h3>
        <input placeholder="Proyecto" value={proyectosRelacionados.proyecto} onChange={e => setProyectosRelacionados({...proyectosRelacionados, proyecto: e.target.value})} />
        <button onClick={() => handleSubmit(`/proyectos/relacionados/${proyectosRelacionados.proyecto}`, {}, 'GET')}>Buscar</button>
      </div>

      <div>
        <h3>Mostrar Grafo Completo</h3>
        <button onClick={() => handleSubmit('/grafo', {}, 'GET')}>Mostrar</button>
      </div>
    </div>
  );
};

export default QueryPanel;