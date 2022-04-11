const Auth = require("../services/auth");
const Users = require("../services/users");
const express = require("express");
const { isRegular } = require("../middleware/auth");

function users(app) {
  const router = express.Router();
  const authService = new Auth();
  const usersService = new Users();
  /* despues devolverle el api auth */
  app.use("/api/auth", router);

  /*   router.post("/signup", async (req, res) => {
    const user = req.body;
    console.log(user);
    const response = await authService.signup(user);
    return res.status(200).json(response);
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    //Este response es el objeto "data" que ahora se llama response y que contiene como propiedad data y token
    const response = await authService.login(email, password);

    if (!response.success) {
      return res.json(response);
    }
    //El response.token es el token que retorna el services auth
    //Y acá estamos estableciendole la cookie al navegador (si ingresamos desde el live server frontend html), pero esto va a funcionar siempre y cuando secure y sameSite esten descomentadas (las comentamos para postman) (que se encuentra en application)
    return res.status(200).json(response);
  }); */

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const response = await authService.login(email, password);

    if (!response.success) {
      return res.status(200).json(response);
    }
    const user = await usersService.get(response.data.username, false);
    return res
      .cookie("token", response.token, {
        httpOnly: true,
        /* Para postman tenemos que quitar estos dos, esto porque no estamos trabajando en el mismo sitio, ademas si dejamos secure:true al estar haciendo peticiones http no incluiría las cookies, ya que creo que solo aceptaba peticiones https*/
        /* secure: true, */
        /* Aquí pone none porque en frontend estamos en el puerto 5500 y en el backend 3000, es decir, el domain / dominio no es el mismo */
        /* sameSite: "none", */
      }) /* lo pasamos a response.data porque no queremos devolver el token */
      .status(200)
      .json({ success: response.success, user });
  });
  router.post("/signup", async (req, res) => {
    const userData = req.body;
    const response = await authService.signup(userData);
    console.log(response);
    const user = await usersService.get(response.data.username, false);
    return res
      .cookie("token", response.token, {
        httpOnly: true,
        /* Para postman tenemos que quitar estos dos */
        /*  secure: true,
        sameSite: "none", */
      }) /* lo pasamos a response.data porque no queremos devolver el token */
      .json({ user });
  });

  /* El punto json es para enviar un json */
  router.post("/logout", (req, res) => {
    return res
      .cookie("token", "", {
        httpOnly: true,
        /* sameSite: "none",
        secure: true, */
        expires: new Date(),
      })
      .json({ loggedOut: true });
  });

  /* Ahora como puede hacer el frontend para verificar esos permisos en general, es decir, que pueda mostrar que tiene los permisos para hacer tal acción o no en la UI. Con esta route validamos la sesión, es algo sencillo y quizás no el mas optimo pero es para probar*/
  router.post("/validate", isRegular, async (req, res) => {
    /* en el req ya está los datos del usuario por que en el middleware le asignan al req.user la decoded */

    const user = await usersService.get(req.user.username, false);
    return res.json({ user });
  });
}

module.exports = users;
