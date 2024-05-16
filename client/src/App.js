import './App.css';
import { useState } from "react";
import Axios from "axios";


function App() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [tipo, setTipo] = useState("");
  const [listaUsuarios, setUsuarios] = useState([]);

  const registrar= ()=>{
    Axios.post("http://localhost:3001/registrarUsuario",{
      usuario:usuario,
      clave:clave,
      tipo:tipo
   }).then(()=>{
    alert("Registro Correcto");
   })
  }

  const seleccionUsuarios= ( )=>{
    Axios.get("http://localhost:3001/seleccionUsuarios").then((response)=>{
      setUsuarios(response.data);
    })
  }

  return (
    <div className="App">
      <h1>A</h1>
      <div className="datos">
        <label>Usuario: <input type="text" 
        onChange={(event) => {
          setUsuario(event.target.value);
        }
        } /></label><br />
        <label>Contraseña: <input type="text"
        onChange={(event) => {
          setClave(event.target.value);
        }
        } /></label><br />
        <label>Tipo: <input type="text"
        onChange={(event) => {
          setTipo(event.target.value);
        }
        } /></label><br />

        <button onClick={registrar}>Registrar</button>
        <button onClick={seleccionUsuarios}>Mostrar</button>
      </div>
      <ul>
        {listaUsuarios.map((val,key) => (
          <li>{val.usuario} </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
