import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './barranavegar.jsx';
import '../home/home.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import InformeMensualPDF from './pdf/PDFGenerator.jsx';
import { format, getMonth, getYear, endOfMonth } from 'date-fns';

function PaginaUsuarios() {
  const navegar = useNavigate();
  const location = useLocation();
  const fechaInicial = location.state?.fechaInicial; // Obtén la fecha inicial desde el estado de la navegación

  Axios.defaults.withCredentials = true;
  const query = new URLSearchParams(useLocation().search);
  const estudianteId = query.get('id_estudiante');
  const docenteId = query.get('id_docente');
  const modificar = query.get('modificar') === 'true';
  const alerta = withReactContent(Swal);
  const [datosCargados, setDatosCargados] = useState(false);
  let informeId;
  if (modificar) {
    informeId = query.get('id_informe');
  }

  const [progreso, setProgreso] = useState(0);
  const [fechaInforme, setFechaInforme] = useState('');
  const [estudiante, setEstudiante] = useState({});
  const [actividades, setActividades] = useState([]);
  const [tareaNueva, setTareaNueva] = useState('');
  const [tareaNuevaFecha, setTareaNuevaFecha] = useState('');

  useEffect(() => {
    if (fechaInicial) {
      const date = new Date(fechaInicial);
      const finDeMes = endOfMonth(date);
      setFechaInforme(format(finDeMes, 'yyyy-MM-dd'));
    }
  }, [fechaInicial]);

  const crearInforme = (event) => {
    event.preventDefault();
    if (modificar) {
      Axios.post('http://localhost:3001/actualizarInforme', {
        id: informeId,
        id_estudiante: estudiante.id,
        fecha_informe: fechaInforme.split('T')[0],
        progreso: progreso,
        actividades: actividades,
      })
        .then((res) => {
          if (res.data.valid) {
            alerta.fire({
              title: 'Éxito',
              text: 'Se modificó la información',
              icon: 'success',
              confirmButtonText: 'Aceptar',
            });
            navegar(`/paginaEstudiante?id_estudiante=${estudianteId}&id_docente=${docenteId}`);
          } else {
            alerta.fire({
              title: 'Error',
              text: 'No se realizó el registro',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          }
        })
        .catch((err) => {
          alerta.fire({
            title: 'Error',
            text: err,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
          console.error(err);
        });
    } else {
      Axios.post('http://localhost:3001/agregarInforme', {
        id_estudiante: estudiante.id,
        fecha_informe: fechaInforme,
        progreso: progreso,
        actividades: actividades,
      })
        .then((res) => {
          if (res.data.valid) {
            alerta.fire({
              title: 'Éxito',
              text: 'Registro Exitoso',
              icon: 'success',
              confirmButtonText: 'Aceptar',
            });
            navegar(`/paginaEstudiante?id_estudiante=${estudianteId}&id_docente=${docenteId}`);
          } else {
            alerta.fire({
              title: 'Error',
              text: 'No se realizó el registro',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          }
        })
        .catch((err) => {
          alerta.fire({
            title: 'Error',
            text: err,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
          console.error(err);
        });
    }
  };

  const agregarTarea = (event) => {
    event.preventDefault();
    let tareanueva = tareaNueva.trim();
    if (tareanueva.length !== 0) {
      setActividades((actividades) => [
        ...actividades,
        { descripcion: tareanueva, fecha: tareaNuevaFecha },
      ]);
      setTareaNueva('');
      setTareaNuevaFecha('');
    }
  };

  const tareaEscribir = (evt) => {
    setTareaNueva(evt.target.value);
  };

  const eliminarTarea = (index, event) => {
    event.preventDefault();
    const filasmodificadas = actividades.filter((row, i) => i !== index);
    setActividades(filasmodificadas);
  };

  useEffect(() => {
    Axios.get('http://localhost:3001')
      .then((res) => {
        if (res.data.valid) {
          Axios.post('http://localhost:3001/seleccionEstudianteInfo', {
            idEstudiante: estudianteId,
            idDocente: docenteId,
          })
            .then((res) => {
              const val = res.data[0];
              setEstudiante({
                id: val.id,
                nombre: val.nombre,
                carrera: val.carrera,
                id_docente: val.id_docente,
                tema: val.tema,
                fechaAprobacion: val.fecha_aprobacion,
              });
              setDatosCargados(true);
            })
            .catch((err) => console.log(err));
          if (modificar) {
            Axios.post('http://localhost:3001/seleccionInforme', {
              idEstudiante: estudianteId,
              idInforme: informeId,
            })
              .then((res) => {
                if (res.data !== 'No hay registro') {
                  const val = res.data[0];
                  setFechaInforme(val.fecha_informe);
                  setProgreso(val.progreso);
                }
                Axios.post('http://localhost:3001/seleccionActividadesInforme', {
                  idInforme: informeId,
                }).then((res) => {
                  if (res.data !== 'No hay registro') {
                    setActividades(res.data.map((val) => ({
                      id: val.id,
                      descripcion: val.descripcion,
                      fecha: val.fecha.split('T')[0],
                    })));
                  }
                });
              })
              .catch((err) => console.log(err));
          }
        } else {
          navegar('/');
        }
      })
      .catch((err) => console.log(err));
  }, [estudianteId, docenteId, modificar, informeId, navegar]);

  if (!datosCargados) {
    return <div>Loading...</div>;
  }

  const obtenerFechaMinMax = () => {
    if (!fechaInicial) return {};

    const date = new Date(fechaInicial);
    const año = getYear(date);
    const mes = getMonth(date);

    const primerDiaDelMes = new Date(año, mes, 1);
    const ultimoDiaDelMes = endOfMonth(primerDiaDelMes);

    return {
      min: format(primerDiaDelMes, 'yyyy-MM-dd'),
      max: format(ultimoDiaDelMes, 'yyyy-MM-dd'),
    };
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-5 p-5">
            <div className="container">
              <form onSubmit={(evt) => crearInforme(evt)}>
                <div className="mb-3">
                  <label className="form-label">Nombre del Estudiante</label>
                  <input
                    type="text"
                    className="form-control"
                    value={estudiante.nombre}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Carrera</label>
                  <input
                    type="text"
                    className="form-control"
                    value={estudiante.carrera}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tema</label>
                  <textarea
                    type="text"
                    className="form-control"
                    value={estudiante.tema}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha de Aprobación</label>
                  <input
                    type="text"
                    className="form-control"
                    value={new Date(estudiante.fechaAprobacion).toLocaleDateString()}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha de Informe</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fechaInforme.split('T')[0]}
                    onChange={(e) => setFechaInforme(new Date(e.target.value).toISOString())}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Progreso</label>
                  <input
                    type="number"
                    max={100}
                    min={0}
                    value={progreso}
                    className="form-control"
                    name="progreso"
                    onChange={(evt) => setProgreso(evt.target.value)}
                    required
                  />
                </div>
                <h3>Actividades</h3>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={tareaNueva}
                    onChange={(evt) => tareaEscribir(evt)}
                    onSubmit={(evt) => agregarTarea(evt)}
                  />
                  <input
                    type="date"
                    className="form-control"
                    onChange={(e) => {
                      let fechaNueva = e.target.value;
                      setTareaNuevaFecha(fechaNueva);
                    }}
                    {...obtenerFechaMinMax()}
                  />
                </div>
                <div className="mb-3 mx-auto p-2 ">
                  <button
                    type="button"
                    className="boton"
                    onClick={(evt) => agregarTarea(evt)}
                  >
                    Agregar
                  </button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Descripción</th>
                      <th>Fecha</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {actividades.length === 0 ? (
                      <tr>
                        <td></td>
                        <td></td>
                      </tr>
                    ) : (
                      actividades.map((actividad, key) => (
                        <tr key={key}>
                          <td>{actividad.descripcion}</td>
                          <td>{actividad.fecha.split('T')[0].split('-').reverse().join('/')}</td>
                          <td>
                            <button onClick={(evt) => eliminarTarea(key, evt)}>
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                    <tr>
                      <th></th>
                      <th></th>
                      <th></th>
                    </tr>
                  </tbody>
                </table>
                <div className="row p-3">
                  <div className="col-8">
                    <button type="submit" className="boton ">
                      Enviar
                    </button>
                  </div>
                  <div className="col-2">
                    <button
                      type="button"
                      className="boton "
                      onClick={() =>
                        navegar(
                          `/paginaEstudiante?id_estudiante=${estudianteId}&id_docente=${docenteId}`
                        )
                      }
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col">
            <InformeMensualPDF
              informe={{
                fecha_informe: fechaInforme.split('T')[0].split('-').reverse().join('/'),
                progreso: progreso,
                nombre_estudiante: estudiante.nombre,
                carrera: estudiante.carrera,
                tema: estudiante.tema,
                fechaAprobacion: new Date(estudiante.fechaAprobacion).toLocaleDateString(),
                actividades: actividades,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default PaginaUsuarios;
