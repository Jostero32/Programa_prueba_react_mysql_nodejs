const session =require('express-session');
const cookieParser =require('cookie-parser');
const bodyParser =require('body-parser');
const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');


app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["POST","GET"],
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
    cookie:{
      secure: false,
      maxAge: 1000 * 60 
    }
  })
);

const db = mysql.createConnection({
  host: "192.168.100.10",
  user: "pc_java",
  password: "1234",
  database: "programaHorarios"
});


app.get('/',(req,res)=>{
  if(req.session.username){
    return res.json({valid: true,username:req.session.username})
  }else{
    return res.json({valid:false})
  }
})

app.post('/login', (req, res) => {
  db.query('SELECT * FROM usuarios WHERE usuario = ? and clave=? ', [req.body.email, req.body.clave], (err, results) => {
    if (err) return res.json("Error");
    if (results.length > 0) {
      req.session.username = results[0].usuario;
      req.session.password = results[0].clave;
      return res.json(results);
    } else {
      return res.json("No hay registro");
    }
  });
});


app.listen(3001, () => {
  console.log("Corriendo en el puerto 3001")
})