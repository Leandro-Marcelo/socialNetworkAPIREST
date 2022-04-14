const express = require("express");
/* Usar validaciones del tipo, eran resimples y no hace falta mas, tipo si intentas modificar una cuenta y no tenes el mismo id que esa cuenta no te deja, cosas así*/
const { isRegular } = require("../middleware/auth");

const Auth = require("../services/auth");
const tokenToCookie = require("../helpers/tokenToCookie");
const upload = require("../middleware/upload");

function auth(app) {
    const router = express.Router();
    const authService = new Auth();
    app.use("/auth", router);

    router.post("/login", async (req, res) => {
        const { email, password } = req.body;
        const response = await authService.login(email, password);

        return tokenToCookie(res, response);
    });
    /* Sign up con JSON
    router.post("/signup", async (req, res) => {
        const user = req.body;
        const response = await authService.signup(user);
        return tokenToCookie(res, response);
    }); */

    router.post("/signup", upload.single("img"), async (req, res) => {
        /* console.log(req.body);
        console.log(req.file); */
        const response = await authService.signup(req.body, req.file);

        return tokenToCookie(res, response);
    });

    router.post("/logout", (req, res) => {
        return res
            .cookie("token", "", {
                httpOnly: true,
                sameSite: "none",
                /* secure: env ? false : true, */
                secure: true,
                expires: new Date(),
            })
            .json({ success: true });
    });
    router.post("/validate", isRegular, (req, res) => {
        /* console.log(req.user); */
        return res.json({ success: true, user: req.user });
    });
}

module.exports = auth;
