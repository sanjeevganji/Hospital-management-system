var express = require("express");
var mysql = require("mysql");
var app = express();
var PORT = 3000;

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb",
});

console.log("connected to database!");

// Without middleware
app.get("/", function (req, res) {
  res.json({ user: "geek" });
});

app.get("/appointments", function (req, res) {
  res.json({
    status: "ok",
    appointments: [
      {
        id: 1,
        patientId: 1,
        patientName: "Amitabh Bachchan",
        datetime: "2021-05-01 10:00:00",
        priority: 10,
        prescription: {
          treatments: [1],
          tests: [1, 2],
        },
      },
      {
        id: 2,
        patientId: 2,
        patientName: "David Beckham",
        datetime: "2021-05-02 10:00:00",
        priority: 5,
        prescription: {
          treatments: [1, 2],
          tests: [1],
        },
      },
    ],
  });
});
app.get("/server", function (req, res) {
  connection.connect();
  connection.query(
    "SELECT * from Physician",
    function (error, results, fields) {
      if (error) throw error;
      res.json({ status: "ok", physicians: results });
    }
  );
  connection.end();
});

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});
