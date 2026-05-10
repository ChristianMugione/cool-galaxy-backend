require("dotenv").config();
const { PORT } = process.env;
const express = require("express");
const readline = require("readline");
const pg = require("pg");
const cors = require("cors");
const { getUserById } = require("./controllers/cliController.js");
const { getUsers, generateUniverse, getPlanetList } = require("./controllers/cliController.js");
const { migratedb } = require("./controllers/controller.js");
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
try {
  app.listen(PORT);
  console.log(`Server on ${PORT}`);
} catch (error) {
  console.error("ERROR opening server: ", error);
}

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
    case "help":
      console.log("Commands: userlist, user [id]");

      break;

    case "userlist":
      console.log("User list");
      const asyncFnc = async () => {
        const userListRes = await getUsers();
        if (userListRes) {
          userListRes.forEach((user) => {
            console.log(
              user.id,
              user.username,
              user.email,
              user.planets.length
            );
            user.planets.map((planet) => {
              console.log("  - ", planet);
            });
          });
        }
      };
      asyncFnc();
      break;
    
    case "user":
      console.log("User", args[0]);
      const asyncFnc2 = async () => {
        const userRes = await getUserById(args[0]);
        console.log(userRes);

        console.log("Id: ", userRes[0].id);
        console.log("Username: ", userRes[0].username);
        console.log("Email: ", userRes[0].email);
        console.log("Planets: ", userRes[0].planets.length);
      };
      asyncFnc2();
      break;

    case "migratebd":
      console.log("NO Migrating database (disabled)");
      //migratedb();

      break;

    case "generateplanets":
      console.log("Generating planets (universe)");
      generateUniverse();

      break;

      case "planetlist":
        console.log("Getting planet list");
        const asyncFnc3 = async () => {
          const planetListRes = await getPlanetList();
          if (planetListRes) {
            planetListRes.forEach((planet) => {
              console.log(
                planet.id,
                planet.planet_name,
                planet.owner_id,
                planet.population,
                planet.houses
              );
            });
          }
        };
        asyncFnc3();
        break;
    default:
      console.log("Invalid command");
      break;
  }
});
