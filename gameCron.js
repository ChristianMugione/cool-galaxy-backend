require("dotenv").config({ path: "./vars.env" });
const {
  DATABASE_URL,
  PGDATABASE,
  PGHOST,
  PGPASSWORD,
  PGPORT,
  PGSSLMODE,
  PGUSER,
} = process.env;
const { Pool } = require("pg");

// console.log(PGDATABASE, PGHOST, PGPASSWORD, PGPORT, PGSSLMODE, PGUSER);
console.log("pass: ", PGPASSWORD);

const pool = new Pool({
  host: PGHOST,
  user: PGUSER,
  database: PGDATABASE,
  password: PGPASSWORD,
  port: PGPORT,
  sslmode: PGSSLMODE,
  ssl: false,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});

const config = {
  population: 1.01,
  // capacidad de produccion de cada mina
  metalMine: 100,
  crystalMine: 70,
  // capacidad de almacenamiento de cada mina
  metalMineStorage: 1000,
  crystalMineStorage: 1000,
  // capacidad de almacenamiento de cada almacen
  metalStoragesCapacity: 5000,
  crystalStoragesCapacity: 5000,
};

// desactivar juego

/**
 * Recorrer todos los planetas y en cada planeta:
 */
const populationGrowFnc = async () => {
  try {
    const data = await pool.query(
      `UPDATE planets SET population = CASE WHEN population * $1 <= houses * 4 THEN ROUND(population * $1, 4) ELSE houses * 4 END WHERE owner_id IS NOT NULL`,
      [config.population]
    );
    console.log("population:", data.rowCount);
  } catch (error) {
    console.error(error);
  }
};

populationGrowFnc();

// * Crecer metal segun cantidad de minas, maximo capacidad almacenes
const metalExtractionFnc = async () => {
  try {
    const metalExtraction = await pool.query(
      "UPDATE planets SET metal = CASE WHEN ROUND(metal + ($1 * metal_mines)) <= ROUND((metal_mines * $2) + (metal_storages * $3)) THEN ROUND(metal + ($1 * metal_mines)) ELSE ROUND((metal_mines * $2) + (metal_storages * $3)) END WHERE owner_id IS NOT NULL;",
      [config.metalMine, config.metalMineStorage, config.metalStoragesCapacity]
    );
    console.log("metal:", metalExtraction.rowCount);
  } catch (error) {
    console.error(error);
  }
};
metalExtractionFnc();

// * Crecer crystal segun cantidad de minas, maximo capacidad almacenes

const crystalExtractionFnc = async () => {
  try {
    const crystalExtraction = await pool.query(
      "UPDATE planets SET crystal = CASE WHEN ROUND(crystal + ($1 * crystal_mines)) <= ROUND((crystal_mines * $2) + (crystal_storages * $3)) THEN ROUND(crystal + ($1 * crystal_mines)) ELSE ROUND((crystal_mines * $2) + (crystal_storages * $3)) END WHERE owner_id IS NOT NULL;",
      [
        config.crystalMine,
        config.crystalMineStorage,
        config.crystalStoragesCapacity,
      ]
    );
    console.log("crystal:", crystalExtraction.rowCount);
  } catch (error) {
    console.error(error);
  }
};

crystalExtractionFnc();

// * Avanzar construcciones en curso
const constructionsUpdateFnc = async () => {
  try {
    const constructionsUpdate = await pool.query(`
    UPDATE planets p 
    SET metal_mines = metal_mines + CASE 
                                    WHEN c.construction_type = 'metalmine' THEN 1 ELSE metal_mines END, 
        metal_storages = metal_storages + CASE 
                                    WHEN c.construction_type = 'metalstorages' THEN 1 ELSE metal_storages END, 
        crystal_mines = crystal_mines + CASE 
                                    WHEN c.construction_type = 'crystalmine' THEN 1 ELSE crystal_mines END, 
        crystal_storages = crystal_storages + CASE 
                                    WHEN c.construction_type = 'crystalstorages' THEN 1 ELSE crystal_storages END 
    FROM constructions c	 
    WHERE id = c.planet_id AND c.construction_time = 0
    `);
  } catch (error) {
    console.error("Error updating constructions: ", error);
  }
};
constructionsUpdateFnc();

/**/
// * Avanzar construccion de naves
// * Avanzar flotas en viaje
//   - naves de carga que llegaron a destino descargan
//   - flota de guerra que llega a destino ejecuta ataque/colonizacion/etc (**)

// activar juego
