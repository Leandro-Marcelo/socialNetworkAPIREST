const Auth = require("../services/auth");
const express = require("express");
/* yo utilizo bcrypt en un middleware */
/* const bcrypt = require("bcrypt"); */

function users(app) {
  const router = express.Router();
  const authService = new Auth();
  app.use("/api/auth", router);

  router.get("/", (req, res) => {
    return res.status(200).send("auth");
  });

  router.post("/signup", async (req, res) => {
    const user = req.body;
    console.log(user);
    const response = await authService.signup(user);
    return res.status(200).json(response);
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    /* Este response es el objeto "data" que ahora se llama response y que contiene como propiedad data y token */
    const response = await authService.login(email, password);

    if (!response.success) {
      return res.json(response);
    }
    /* El response.token es el token que retorna el services auth*/
    /* Y acá estamos estableciendole la cookie al navegador (si ingresamos desde el live server frontend html), pero esto va a funcionar siempre y cuando secure y sameSite esten descomentadas (las comentamos para postman) (que se encuentra en application) */
    return res.status(200).json(response);
  });
}

module.exports = users;
