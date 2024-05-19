import React, { useState } from "react";
import Axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./barranavegar.jsx";

function Home() {
  const [estudiantes, setEstudiantes] = useState([]);
  const navegar = useNavigate();

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3001")
      .then((res) => {
        if (res.data.valid) {
          Axios.get("http://localhost:3001/seleccionEstudiantes")
            .then((res) => {
              setEstudiantes(res.data);
            })
            .catch((err) => console.log(err));
        } else {
          navegar("/");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <Navbar />
      <div className="container">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Carrera</th>
              <th scope="col">Progreso</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((val, key) => {
              return <tr key={key}>
                <th scope="row">{val.nombre}</th>
                <td>{val.carrera}</td>
                <td>{val.progreso}</td>
                <td></td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Home;
