const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config");

/* decodifica el token para saber si es valido, es decir, que no esta falsificado ó haya expirado  */
const handleToken = (token, req, res, next) => {
  try {
    const decoded = jwt.verify(token, jwt_secret);
    /* Esto nos imprime: {firstName:..., email:......, iat(cuando se inicializó):......., exp(cuando expira):.......} */
    /* Se le agrega al request del usuario para que cuando llegue a la siguiente parte si en algun momento se requiere acceder a ese usuario al rol al email algo así, podamos tomarlo ya desde ahí */
    req.user = decoded;
    /* El next ejecuta la siguiente función o cb que esta definido en routes al lado del middleware handleToken */
    return next();
  } catch (error) {
    console.error("JWT error", error.message);
    /* El status 403 significa que no tenemos authorización */
    return res.status(403).json({
      status: "Expired",
      message: "A valid token is required for this process",
    });
  }
};

const verifyToken = (req, res, next) => {
  const auth = req.header("Authorization");
  const cookies = req.cookies;

  if (!auth && !cookies.token) {
    console.log(`entro acá`);
    return res.status(403).json({
      status: "No-Auth",
      message: "A token is required for this process",
    });
  }

  if (cookies.token) {
    handleToken(cookies.token, req, res, next);
  } else {
    /* esto era para el JWT y lo guardabamos en el localStorage */
    const token = auth.split(" ")[1];
    handleToken(token, req, res, next);
  }
};

const isRegular = (req, res, next) => {
  verifyToken(req, res, next);
};

//TODO: Se exporta como objeto porque más adelante tendremos mas middleware
module.exports = {
  isRegular,
};
