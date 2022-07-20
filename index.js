const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const multer = require("multer");
var upload = multer();
const port = 3000;
const user = "Ajit";
const userId = 22;

app.set("view engine", "pug");
app.set("views", "template");

app.use(express.static(__dirname + "/static"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(upload.array());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "banking",
});

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/customers", function (req, res) {
  let data;

  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query(
      "SELECT * FROM customer",
      function (error, results, fields) {
        connection.release();
        if (error) throw error;
        data = results;
        console.log(data);
        res.render("customers", {
          customer_data: data,
          appuser: user,
          appusermny: 0,
        });
      }
    );
  });
});

app.get("/transfer/:id/:fname/:lname/:limit", function (req, res) {
  res.render("transfer", {
    unqid: req.params.id,
    firstName: req.params.fname,
    lastName: req.params.lname,
    appuser: user,
    mnyLimit: req.params.limit,
  });
});

app.post("/transfer", function (req, res) {
  console.log(req.body);
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    let sql = `UPDATE customer SET money = CASE id 
    WHEN ${parseInt(req.body.unqid)} THEN money+${parseInt(req.body.amount)}
    WHEN ${userId} THEN money-${parseInt(req.body.amount)}
    END`;
    connection.query(sql, function (error, results, fields) {
      connection.release();
      console.log("UPDATED DATA\n", results);
      if (error) throw error;
      res.render("thankyou", {
        user: user,
        recieverName: req.body.fname,
        recieverSurname: req.body.lname,
        amount: req.body.amount,
      });
    });
  });
});

app.get("/contact", function (req, res) {
  res.render("contact_us");
});

app.listen(port, () => {
  console.log(`Server running on port localhost:${port}`);
});
