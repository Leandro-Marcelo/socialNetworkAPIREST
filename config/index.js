/* Esto nos indica que a partir de ahora, ya podemos leer el archivo .env y cargar los procesos.*/
require("dotenv").config();

const config = {
  mode: process.env.MODE,
  db_username: process.env.DB_USERNAME,
  db_password: process.env.DB_PASSWORD,
  db_host: process.env.DD_HOST,
  db_name: process.env.DB_NAME,
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET,
};

module.exports = config;
