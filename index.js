const express = require("express");
const { port } = require("./config");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const cookies = require("cookie-parser");
const multer = require("multer");
const path = require("path");

/* Algo sumamente importante es que si eliminamos un usuario, deberían eliminarse sus posts */

/* ******* Trayendo conexión a BD ******* */
const { connection } = require("./config/db");
connection();

/* ******** Importando routers ******** */
const auth = require("./routes/auth");
const users = require("./routes/users");
const posts = require("./routes/posts");

/* ******* Aplicación ******** */
const app = express();

/* ****** Usando middleware globales ****** */
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(
  cors({
    /* acá ponemos 3000 para que pueda ingresar desde react */
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookies());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (err) {
    console.log(err);
  }
});

/* ******* Utilizando los routers ******* */
auth(app);
users(app);
posts(app);

app.get("/", (req, res) => {
  return res.status(200).send("Home");
});

app.listen(port, () => {
  console.log("Servidor: http://localhost:" + port);
});
