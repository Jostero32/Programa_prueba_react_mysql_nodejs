const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');


app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["POST", "GET"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({
    secret: 'docente',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000*60*60
    }
  })
);

const db = mysql.createConnection({
  host: "192.168.100.10",
  user: "pc_java",
  password: "1234",
  database: "tesisinformes"
});


app.get('/', (req, res) => {
  if (req.session.email) {
    return res.json({ valid: true, email: req.session.email })
  } else {
    return res.json({ valid: false })
  }
})

app.get('/cerrarSesion', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('connect.sid');
  return res.json({Starus:"Success"})
})

app.post('/login', (req, res) => {
  db.query('SELECT * FROM docentes WHERE correo = ? and contraseña=? ', [req.body.email, req.body.clave], (err, results) => {
    if (err) return res.json("Error");
    if (results.length > 0) {
      req.session.email = results[0].correo;
      req.session.idDocente = results[0].id;
      return res.json(results);
    } else {
      return res.json("No hay registro");
    }
  });
});


app.get('/seleccionEstudiantes', (req, res) => {
  db.query('SELECT * FROM estudiantes WHERE id_docente = ? ', [req.session.idDocente], (err, results) => {
    if (err) return res.json("Error");
    if (results.length > 0) {
      return res.json(results);
    } else {
      return res.json("No hay registro");
    }
  });
});


app.post('/seleccionEstudiantesFiltrados', (req, res) => {
  db.query('select * from estudiantes where id_docente=? and nombre like ? and carrera like ?', [req.session.idDocente,req.body.nombre,req.body.carrera], (err, results) => {
    if (err) return res.json("Error");
    if (results.length > 0) {
      return res.json(results);
    } else {
      return res.json("No hay registro");
    }
  });
});

app.listen(3001, () => {
  console.log("Corriendo en el puerto 3001")
})