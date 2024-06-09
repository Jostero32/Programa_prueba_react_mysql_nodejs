import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./barranavegar.jsx";
import "./CrearEstudiante.css"; 

function CrearEstudiante() {
  const [nombre, setNombre] = useState("");
  const [tema, setTema] = useState("");
  const [fechaAprobacion, setFechaAprobacion] = useState("");
  const [carreras, setCarreras] = useState([]);
  const [idCarrera, setIdCarrera] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navegar = useNavigate();

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3001/carreras")
      .then((res) => {
        setCarreras(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!nombre || !tema || !fechaAprobacion || !idCarrera) {
      setMensaje("Por favor, complete todos los campos.");
      return;
    }
    Axios.post("http://localhost:3001/agregarEstudiante", {
      nombre,
      tema,
      fechaAprobacion,
      idCarrera
    })
      .then((res) => {
        if (res.data.valid) {
          setMensaje("Estudiante creado exitosamente");
          setShowModal(true);
          setTimeout(() => {
            setShowModal(false);
            navegar("/home");
          }, 2000);
        } else {
          setMensaje("Error al crear el estudiante");
        }
      })
      .catch((err) => {
        setMensaje("Error al crear el estudiante");
        console.log(err);
      });
  };

  const handleBack = () => {
    navegar(-1);
  };

  return (
    <>
      <Navbar />
      <div className="paginaCrearEstudiante content">
        <h2>Crear Estudiante</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Tema:</label>
            <input
              type="text"
              className="form-control"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Fecha de Aprobación:</label>
            <input
              type="date"
              className="form-control"
              value={fechaAprobacion}
              onChange={(e) => setFechaAprobacion(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Carrera:</label>
            <select
              className="form-control"
              value={idCarrera}
              onChange={(e) => setIdCarrera(e.target.value)}
              required
            >
              <option value="">Seleccione una carrera</option>
              {carreras.map((carrera) => (
                <option key={carrera.id} value={carrera.id}>
                  {carrera.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="buttons-container">
            <button type="submit" className="btn boton">
              Crear
            </button>
            <button type="button" className="btn boton" onClick={handleBack}>
              Regresar
            </button>
          </div>
        </form>
        {mensaje && <p>{mensaje}</p>}

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <button className="btn boton" onClick={() => setShowModal(false)}>
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CrearEstudiante;
