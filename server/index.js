const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');

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
      maxAge: 1000 * 60 * 60
    }
  })
);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "agiles"
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
  return res.json({ Status: "Success" })
})

app.post('/login', (req, res) => {
  db.query('SELECT * FROM docentes WHERE correo = ?', [req.body.email], async (err, results) => {
    if (err) return res.json("Error");
    if (results.length > 0) {
      const user = results[0];
      const isMatch = await bcrypt.compare(req.body.clave, user.contraseña);
      if (isMatch) {
        req.session.email = user.correo;
        req.session.idDocente = user.id;
        return res.json({ valid: true });
      } else {
        return res.json({ valid: false, message: 'Contraseña incorrecta' });
      }
    } else {
      return res.json({ valid: false, message: 'Usuario no encontrado' });
    }
  });
});

app.get('/seleccionEstudiantes', (req, res) => {
  const query = `
    SELECT e.id, e.nombre, e.tema, e.fecha_aprobacion, e.progreso, e.estado, e.id_docente, c.nombre AS carrera 
    FROM estudiantes e 
    JOIN carreras c ON e.id_carrera = c.id 
    WHERE e.id_docente = ?
  `;
  db.query(query, [req.session.idDocente], (err, results) => {
    if (err) return res.json("Error");
    if (results.length > 0) {
      return res.json(results);
    } else {
      return res.json("No hay registro");
    }
  });
});

app.post('/seleccionEstudiantesFiltrados', (req, res) => {
  const query = `
    SELECT e.id, e.nombre, e.tema, e.fecha_aprobacion, e.progreso, e.estado, e.id_docente, c.nombre AS carrera 
    FROM estudiantes e 
    JOIN carreras c ON e.id_carrera = c.id 
    WHERE e.id_docente = ? AND e.nombre LIKE ? AND c.nombre LIKE ?
  `;
  db.query(query, [req.session.idDocente, `%${req.body.nombre}%`, `%${req.body.carrera}%`], (err, results) => {
    if (err) return res.json("Error");
    if (results.length > 0) {
      return res.json(results);
    } else {
      return res.json("No hay registro");
    }
  });
});

app.post('/seleccionEstudianteInfo', (req, res) => {
  const query = `
    SELECT e.id, e.nombre, e.tema, e.fecha_aprobacion, e.progreso, e.estado, e.id_docente, c.nombre AS carrera 
    FROM estudiantes e 
    JOIN carreras c ON e.id_carrera = c.id 
    WHERE e.id_docente = ? AND e.id = ?
  `;
  db.query(query, [req.body.idDocente, req.body.idEstudiante], (err, results) => {
    if (err) return res.json("Error");
    if (results.length > 0) {
      return res.json(results);
    } else {
      return res.json("No hay registro");
    }
  });
});

app.post('/seleccionInformesEstudiante', (req, res) => {
  db.query('SELECT * FROM informes WHERE id_estudiante = ?', [req.body.idEstudiante], (err, results) => {
    if (err) return res.json("Error");
    if (results.length > 0) {
      return res.json(results);
    } else {
      return res.json("No hay registro");
    }
  });
});

app.post('/agregarInforme', (req, res) => {
  db.beginTransaction((err) => {
    if (err) { return res.status(500).send({ error: 'Transaction error', details: err }); }

    db.query('INSERT INTO informes (id_estudiante, fecha_informe, progreso) VALUES (?, ?, ?)', [req.body.id_estudiante, req.body.fecha_informe, req.body.progreso], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).send({ error: 'Error al insertar informe', details: err });
        });
      }

      const informeId = result.insertId;

      const actividadesValues = req.body.actividades.map(act => [informeId, act.descripcion]);
      const queryActividades = `INSERT INTO actividades (id_informe, descripcion) VALUES ?`;

      if (actividadesValues.length > 0) {
        db.query(queryActividades, [actividadesValues], (err, result) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).send({ error: 'Error al insertar actividades', details: err });
            });
          }

          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).send({ error: 'Transaction commit error', details: err });
              });
            }
            return res.json({ valid: true });
          });
        });
      } else {
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).send({ error: 'Transaction commit error', details: err });
            });
          }
          return res.json({ valid: true });
        });
      }
    });
  });
});

app.put('/actualizarInforme/:id', (req, res) => {
  const { id } = req.params;
  const { numero_informe, fecha_informe, progreso, actividades } = req.body;

  db.beginTransaction((err) => {
    if (err) { return res.status(500).send({ error: 'Transaction error', details: err }); }

    const queryUpdateInforme = `UPDATE informes SET numero_informe = ?, fecha_informe = ?, progreso = ? WHERE id = ?`;
    db.query(queryUpdateInforme, [numero_informe, fecha_informe, progreso, id], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).send({ error: 'Error al actualizar informe', details: err });
        });
      }

      const queryDeleteActividades = `DELETE FROM actividades WHERE id_informe = ?`;
      db.query(queryDeleteActividades, [id], (err, result) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).send({ error: 'Error al eliminar actividades', details: err });
          });
        }

        const actividadesValues = actividades.map(act => [id, act.descripcion]);
        const queryInsertActividades = `INSERT INTO actividades (id_informe, descripcion) VALUES ?`;

        db.query(queryInsertActividades, [actividadesValues], (err, result) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).send({ error: 'Error al insertar actividades', details: err });
            });
          }

          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).send({ error: 'Transaction commit error', details: err });
              });
            }
            res.status(200).send({ message: 'Informe y actividades actualizados exitosamente', valid: true });
          });
        });
      });
    });
  });
});

app.delete('/borrarInforme/:id', (req, res) => {
  const { id } = req.params;

  db.beginTransaction((err) => {
    if (err) { return res.status(500).send({ error: 'Transaction error', details: err }); }

    const queryDeleteActividades = `DELETE FROM actividades WHERE id_informe = ?`;
    db.query(queryDeleteActividades, [id], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).send({ error: 'Error al eliminar actividades', details: err });
        });
      }

      const queryDeleteInforme = `DELETE FROM informes WHERE id = ?`;
      db.query(queryDeleteInforme, [id], (err, result) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).send({ error: 'Error al eliminar informe', details: err });
          });
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).send({ error: 'Transaction commit error', details: err });
            });
          }
          res.status(200).send({ message: 'Informe y actividades eliminados exitosamente' });
        });
      });
    });
  });
});

app.get('/carreras', (req, res) => {
  db.query('SELECT * FROM carreras', (err, results) => {
    if (err) return res.json("Error");
    if (results.length > 0) {
      return res.json(results);
    } else {
      return res.json("No hay registro");
    }
  });
});
app.post("/agregarEstudiante", (req, res) => {
  const { nombre, tema, fechaAprobacion, idCarrera } = req.body;
  const progreso = 0; 
  const query = "INSERT INTO estudiantes (nombre, tema, fecha_aprobacion, progreso, id_carrera) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [nombre, tema, fechaAprobacion, progreso, idCarrera], (err, result) => {
    if (err) {
      res.send({ valid: false });
    } else {
      res.send({ valid: true });
    }
  });
});




app.listen(3001, () => {
  console.log("Corriendo en el puerto 3001")
});
