const express= require("express");
const app = express();
const mysql =require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host:"192.168.100.10",
    user:"pc_java",
    password:"1234",
    database:"programahorarios"
});

app.post("/registrarUsuario",(req,res)=>{
    const usuario= req.body.usuario;
    const clave= req.body.clave;
    const tipo= req.body.tipo;

    db.query('insert into usuarios values (?,?,?)',[usuario,clave,tipo],
(err,result)=>{
    if(err){
        console.log(err);
    }else{
        res.send("Registro con éxito")
    }
}
);
    
});


app.get('/seleccionUsuarios', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      res.send(results);
    });
  });



app.listen(3001,()=>{
    console.log("Corriendo en el puerto 3001")
})