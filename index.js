const express = require("express");
const config = require("./config");
/* const helmet = require("helmet");
const morgan = require("morgan"); */
const cors = require("cors");
const cookies = require("cookie-parser");

/* Algo sumamente importante es que si eliminamos un usuario, deberían eliminarse sus posts */

/* ******** Importando routers ******** */
const auth = require("./routes/auth");
const files = require("./routes/files");
const users = require("./routes/users");
const posts = require("./routes/posts");

/* ******* Aplicación ******** */
const app = express();

/* ****** Usando middleware globales ****** */
app.use(express.json());
/* Helmet me jode lo del gcloud por qué ?  */
/* app.use(helmet()); */
/* morgan por si acaso xd */
/* app.use(morgan("common")); */
app.use(
    cors({
        /* acá ponemos 3000 para que pueda ingresar desde react */
        origin: ["http://localhost:3000"],
        credentials: true,
    })
);
app.use(cookies());

/* ******* Trayendo conexión a BD ******* */
const { connection } = require("./config/db");
connection();

/* ******* Utilizando los routers ******* */
auth(app);
files(app);
posts(app);
users(app);

app.get("/", (req, res) => {
    res.status(200).send(
        "Hola, Soy Leandro Marcelo y este es mi API REST de mi Social Network"
    );
});

app.listen(config.port, () => {
    /*  console.log("Servidor: http://localhost:" + port); */
});
