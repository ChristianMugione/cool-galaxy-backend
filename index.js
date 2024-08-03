require("dotenv").config({ path: "./vars.env" });
const { PORT } = process.env;
const express = require("express");
const readline = require("readline");
const pg = require("pg");
const cors = require("cors");
const { getUserById } = require("./controllers/cliController.js");
const { getUsers } = require("./controllers/cliController.js");
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", (input) => {
  const [command, ...args] = input.split(" ");
  switch (command) {
    case "exit":
      console.log("Bye!");
      break;
    case "userlist":
      console.log("User list");
      const asyncFnc = async () => {
        const userListRes = await getUsers();
        console.log(userListRes);
      };
      asyncFnc();
      break;
    case "user":
      console.log("User");
      const asyncFnc2 = async () => {
        const userRes = await getUserById(args[0]);
        console.log(userRes);
      };
      asyncFnc2();
      break;
    default:
      break;
  }
});
