import React from "react";
import { useEffect } from "react";
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import Navbar from "./barranavegar.jsx";


function PaginaUsuarios() {
  const navegar= useNavigate();
  Axios.defaults.withCredentials=true;

  useEffect(() => {
    Axios.get("http://localhost:3001")
      .then((res) => {
        if (res.data.valid) {
        } else {
          navegar("/");
        }
      })
      .catch((err) => console.log(err))

  }, []);

  return (
<>
<Navbar/>
<div>
      paginaUsuarios
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Masdasdasdasdas</td>
            <td>Oasdasdasdo</td>
            <td>@asdasdasdasd</td>
          </tr>

        </tbody>
      </table>
    </div></>
  );
}

export default PaginaUsuarios;
