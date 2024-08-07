const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var mysql = require("mysql");

//nosotros somos uno agenos, debemos comunicarnos con el motor, asi como haciamos con workbench

// Agregue las credenciales para acceder a su base de datos
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "clinica",
});

connection.connect((err) => {
  if (err) {
    console.log(err.code);
  } else {
    console.log("BD conectada");
  }
});

//middleware para controlar que el dato que recibo sea correcto
// app.param("matricula", function (req, res, next, name) {
//   if (!isNaN(matricula) && !isNaN(parseInt(matricula))) {
//     next();
//   } else {
//     res.status(204).send("Matricula debe ser un número entero");
//   }
// });

//listar medicos
app.get("/api/medicos", (req, res) => {
  consulta = "select * from medico";
  connection.query(consulta, function (err, resultados, fields) {
    if (err) {
      res.send(err);
      return;
    } else {
      res.json({
        messaje: "Resultados de la consulta",
        detail: resultados,
      });
    }
  });
});

//obtener_datos_de_un_medico
app.get("/api/medicos/:matricula", (req, res) => {
  matricula = req.params.matricula;

  consulta = "select * from medico where matricula = ?";

  connection.query(consulta, matricula, function (err, resultados, fields) {
    if (err) {
      res.send(err);
      return;
    } else {
      if (resultados.length == 0) {
        res.send(
          "no se encontro un medico con la matricula:" + req.params.matricula
        );
      } else {
        res.json({
          messaje: "Resultados de la consulta",
          detail: resultados,
        });
      }
    }
  });
});

app.get("/api/pacientes", (req, res) => {
  consulta = "select * from paciente";
  connection.query(consulta, function (err, resultados, fields) {
    if (err) {
      res.send(err);
      return;
    } else {
      res.json({
        messaje: "Resultados de la consulta",
        detail: resultados,
      });
    }
  });
});

//crear medico
app.post("/api/medico/create", function (req, res) {
  query =
    "INSERT INTO MEDICO (matricula, nombre, apellido, especialidad, observaciones) VALUES (?, ?, ?, ?, ?)";

  medico = [
    req.body.matricula,
    req.body.nombre,
    req.body.apellido,
    req.body.especialidad,
    req.body.observaciones,
  ];

  connection.query(query, medico, (err, rows) => {
    if (err) {
      res.json({
        message: "ha ocurrido un error",
        detail: err,
      });
      return;
    }
    res.json({
      message:
        "el medico " +
        req.body.nombre +
        " " +
        req.body.apellido +
        "se registro correctamente",
      detail: rows,
    });
  });
});

//eliminar un medico
app.delete("/api/medico/delete/:matricula", (req, res) => {
  query = "delete from medico where matricula = ?";
  connection.query(query, req.params.matricula, function (err, rows, fields) {
    if (err) {
      res.status(500).json({
        message: "ha ocurrido un error",
        detail: err,
      });
      return;
    }

    if (rows.affectedRows == 0) {
      res
        .status(404)
        .send(
          "No se encontro un medico con la matricula " + req.params.matricula
        );
    } else {
      res
        .status(204)
        .send(
          "el medico " +
            req.params.matricula +
            " fue eliminado de la Base de datos"
        );
    }
  });
});

app.listen(8080, () => {
  console.debug("App escuchando puerto :8080");
});
