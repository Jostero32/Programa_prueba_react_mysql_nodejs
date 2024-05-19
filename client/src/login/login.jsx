import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useAuth } from "../authContext";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [res, setRes] = useState([]);

  const handleLogin = () => {
    // Verificar las credenciales del usuario
    alert('a')
    Axios.get("http://localhost:3001/seleccionUsuarios").then((response) => {
        alert('b');
        setRes(response.data);
      })
  }

  return (
    <div>
      <h1>Login</h1>
      <div className="datos">
        <label>
          Usuario:
          <input
            type="text"
            onChange={(event) => {setUsuario(event.target.value);}}
          />
        </label>
        <br />
        <label>
          Contraseña:
          <input
            type="password"
            onChange={(event) => {setClave(event.target.value);}}
          />
        </label>
        <br />
        <button onClick={handleLogin}>Iniciar Sesión</button>
      </div>
    </div>
  );
};

export default Login;
