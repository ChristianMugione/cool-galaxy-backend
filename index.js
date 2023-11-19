require("dotenv").config({ path: "./vars.env" });
const { PORT } = process.env;
const express = require("express");
const pg = require("pg");
const cors = require("cors");
app = express();

//Middlewares (procesa datos antes de que lleguen a las rutas)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));
app.options("*", cors());

//Importo rutas
app.use(require("./routes/routes.js"));

//Abro servidor
app.listen(PORT);
console.log(`Server on ${PORT}`);
