require("dotenv").config({ path: "./vars.env" });
const { PORT } = process.env;
const express = require("express");
const pg = require("pg");
const cors = require("cors");
// const https = require("https");
// const fs = require("fs");
app = express();

//Middlewares (procesa datos antes de que lleguen a las rutas)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));
app.options("*", cors());

//
// const privateKey = fs.readFileSync(
//   "/ruta/al/archivo/clave-privada.pem",
//   "utf8"
// );
// const certificate = fs.readFileSync("/ruta/al/archivo/certificado.pem", "utf8");
// const ca = fs.readFileSync("/ruta/al/archivo/intermediate.pem", "utf8");

// const credentials = {
//   key: privateKey,
//   cert: certificate,
//   ca: ca,
// };

//Importo rutas
app.use(require("./routes/routes.js"));

//Abro servidor
app.listen(PORT);
console.log(`Server on ${PORT}`);

// Crear el servidor HTTPS
// const httpsServer = https.createServer(credentials, app);

// Escuchar en un puerto
// httpsServer.listen(443, () => {
//   console.log("Servidor HTTPS corriendo en el puerto 443");
// });
