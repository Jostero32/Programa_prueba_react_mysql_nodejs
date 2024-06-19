import React, { useState, useEffect } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import Navbar from "./barranavegar.jsx";
import { useLocation } from 'react-router-dom';
import '../home/paginaEstudiante.css';
import logo from '../home/logo-sitio-fisei-2020.png';
import './home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import PDFDownloadComponent11 from "./pdf/PDFDownloadComponent11.jsx";
import PDFDownloadComponent from "./pdf/PDFDownloadComponent.jsx";

function PaginaUsuarios() {
  const navegar = useNavigate();
  Axios.defaults.withCredentials = true;
  const alerta = withReactContent(Swal);
  const query = new URLSearchParams(useLocation().search);
  const estudianteId = query.get('id_estudiante');
  const docenteId = query.get('id_docente');
  const [estudiante, setEstudiante] = useState({});
  const [informes, setInformes] = useState([]);
  const [datosCargados, setDatosCargados] = useState(false);

  const borrarInforme = (informeId) => {
    Axios.delete('http://localhost:3001/borrarInforme', {
      data: { id: informeId, id_estudiante: estudianteId }
    })
      .then((response) => {
        if (response.data.valid) {
          alerta.fire({
            title: '¡Eliminado!',
            text: 'El informe y sus actividades han sido eliminados exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            setInformes(informes.filter(informe => informe.id !== informeId));
          });

        } else {
          alerta.fire({
            title: 'Error',
            text: 'Hubo un error al eliminar el informe y sus actividades.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      })
      .catch(error => {
        alerta.fire({
          title: 'Error',
          text: `Hubo un error: ${error.message}`,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      });

  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get("http://localhost:3001");
        if (res.data.valid) {
          const estudianteRes = await Axios.post("http://localhost:3001/seleccionEstudianteInfo", {
            idEstudiante: estudianteId, idDocente: docenteId
          });
          const estudianteData = estudianteRes.data[0];
          setEstudiante({
            id: estudianteData.id,
            nombre: estudianteData.nombre,
            carrera: estudianteData.carrera,
            id_docente: estudianteData.id_docente,
            tema: estudianteData.tema,
            fechaAprobacion: estudianteData.fecha_aprobacion
          });

          const informesRes = await Axios.post("http://localhost:3001/seleccionInformesEstudiante", {
            idEstudiante: estudianteId
          });
          const informesData = informesRes.data;
          if (informesData !== "No hay registro" && informesData !== "Error") {
            const informesTemp = await Promise.all(informesData.map(async (val) => {
              const actividadesRes = await Axios.post("http://localhost:3001/seleccionActividadesInforme", { idInforme: val.id });
              const actividadesData = actividadesRes.data !== "No hay registro" ? actividadesRes.data : [];
              return {
                fecha_informe: new Date(val.fecha_informe).toLocaleDateString(),
                id: val.id,
                id_estudiante: val.id_estudiante,
                id_docente: estudianteData.id_docente,
                progreso: val.progreso,
                nombre_estudiante: estudianteData.nombre,
                finalizado: (val.finalizado === 1),
                carrera: estudianteData.carrera,
                tema: estudianteData.tema,
                fechaAprobacion: new Date(estudianteRes.data[0].fecha_aprobacion).toLocaleDateString(),
                actividades: actividadesData
              };
            }));
            setInformes(informesTemp);
          }
          setDatosCargados(true);
        } else {
          navegar("/");
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [estudianteId, docenteId, navegar]);

  if (!datosCargados) {
    return <div>Loading...</div>;
  }


  const fechaSiguienteInforme = () => {
    if (informes.length === 0) {
      const fechaAprobacion = estudiante.fechaAprobacion.split('/').reverse().join('-');
      return new Date(fechaAprobacion).toISOString().split('T')[0];
    } else {
      const ultimaFechaInforme = informes[informes.length - 1].fecha_informe.split('/').reverse().join('-');
      let date = new Date(ultimaFechaInforme);
      let mes = date.getMonth();
      let año = date.getFullYear();

      if (mes === 11) {
        mes = 0;
        año += 1;
      } else {
        mes += 1;
      }

      date.setMonth(mes);
      date.setFullYear(año);
      date.setDate(1);

      return date.toISOString();
    }
  };


  function obtenerMesYAño(fecha) {
    const date = new Date(fecha);

    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const nombreMes = meses[date.getMonth()];
    const año = date.getFullYear();

    return `${nombreMes} ${año}`;
  }

  const marcarFinalizado = (id) => {
    Axios.post('http://localhost:3001/finalizarInforme', {
      idInforme: id
    })
      .then((response) => {
        if (response.data.valid) {
          alerta.fire({
            title: '¡Éxito!',
            text: 'El informe se ha marcado como finalizado.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            window.location.reload();
          });

        } else {
          alerta.fire({
            title: 'Error',
            text: 'Hubo un error al marcar como finalizado.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      })
      .catch(error => {
        alerta.fire({
          title: 'Error',
          text: `Hubo un error: ${error.message}`,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      });
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card mb-3 info-estudiante">
          <div className="row g-0">
            <div className="col-md-3 imagen">
              <img src={logo} className="img-fluid rounded-start" alt="imagen del estudiante" />
            </div>
            <div className="col-md">
              <div className="card-body">
                <br />
                <h3 className="card-title">{estudiante.nombre}</h3>
                <h6>Carrera: {estudiante.carrera}</h6>
                <p className="card-text">{'"' + estudiante.tema + '"'}</p>
                <p className="card-text"><small className="text-body-secondary">Aprobado: {new Date(estudiante.fechaAprobacion).toLocaleDateString()}</small></p>
              </div>
            </div>
          </div>
          <div className="row g-0">
            <div className="col-3"></div>
            <div className="col-md pb-5">
              <button className="boton" onClick={() => navegar(`/paginaInforme?id_estudiante=${estudianteId}&id_docente=${docenteId}&modificar=${false}`, { state: { fechaInicial: fechaSiguienteInforme() } })}>Agregar Informe</button>
            </div>
            <div className="col-md pb-5">
              <PDFDownloadComponent11 informes={informes} />
            </div>
          </div>
          <div className="row g-0">
            <table >
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Informe</th>
                  <th scope="col">Fecha de Informe</th>
                  <th scope="col">Progreso</th>
                  <th scope="col">Estado</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {informes.map((informe, key) => (
                  <tr key={informe.id}>
                    <th>{key + 1}</th>
                    <td>Informe {obtenerMesYAño(informe.fecha_informe.split('/').reverse().join('-'))}</td>
                    <td>{informe.fecha_informe}</td>
                    <td>{informe.progreso}%</td>
                    <td>{informe.finalizado ? 'Finalizado' : 'Borrador'}</td>
                    <td className="acciones">
                      <button className="btn eliminar" onClick={() => {
                        alerta.fire({
                          title: 'Alerta',
                          text: 'Esta seguro que desea eliminar este informe?',
                          icon: 'warning',
                          showDenyButton: true,
                          denyButtonText: 'No',
                          confirmButtonText: 'Si',
                        }).then((resultado) => {
                          if (resultado.isConfirmed) {
                            if (informe.finalizado) {
                              alerta.fire({
                                title: 'Alerta',
                                text: 'El informe se ha marcado como finalizado, quiere continuar con la Eliminacion?',
                                icon: 'warning',
                                showDenyButton: true,
                                denyButtonText: 'No',
                                confirmButtonText: 'Si',
                              }).then((resultado) => {
                                if (resultado.isConfirmed) {
                                  borrarInforme(informe.id);
                                }
                              })
                            }else{
                              borrarInforme(informe.id);
                            }
                          }
                        })

                      }}>

                        <img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" alt="Eliminar" />
                      </button>

                      <button className="btn editar" onClick={() => {
                        if (informe.finalizado) {
                          alerta.fire({
                            title: 'Alerta',
                            text: 'El informe se ha marcado como finalizado, quiere continuar con la modificación?',
                            icon: 'warning',
                            showDenyButton: true,
                            denyButtonText: 'No',
                            confirmButtonText: 'Si',
                          }).then((resultado) => {
                            if (resultado.isConfirmed) {
                              navegar(`/paginaInforme?id_estudiante=${estudianteId}&id_docente=${docenteId}&modificar=${true}&id_informe=${informe.id}`, { state: { fechaInicial: new Date(informe.fecha_informe.split('/').reverse().join('-')).toISOString().split('T')[0] } })
                            }
                          });
                        } else {
                          navegar(`/paginaInforme?id_estudiante=${estudianteId}&id_docente=${docenteId}&modificar=${true}&id_informe=${informe.id}`, { state: { fechaInicial: new Date(informe.fecha_informe.split('/').reverse().join('-')).toISOString().split('T')[0] } })
                        }
                      }
                      }>
                        <img src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" alt="Editar" />
                      </button>
                      <button className="btn hecho" onClick={() => marcarFinalizado(informe.id)}>
                        <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Marcar como Hecho" />
                      </button>
                      <PDFDownloadComponent informe={informe} />

                    </td>
                  </tr>
                ))}
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div >
    </>
  );
}

export default PaginaUsuarios;
