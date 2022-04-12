const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config");

// 1
const isRegular = (req, res, next) => {
    req.neededRole = 0;
    verifyToken(req, res, next);
};
const isAdmin = (req, res, next) => {
    req.neededRole = 2;
    verifyToken(req, res, next);
};
const isEditor = (req, res, next) => {
    req.neededRole = 1;
    verifyToken(req, res, next);
};

// 2
const verifyToken = (req, res, next) => {
    const auth = req.header("Authorization");
    const cookies = req.cookies;

    if (!auth && !cookies.token) {
        return res.status(403).json({
            status: "No-Auth",
            message: "A token is required for this process",
        });
    }

    /* no recuerdo para que era el else, o sea que hacía */
    if (cookies.token) {
        handleToken(cookies.token, req, res, next);
    } else {
        const token = auth.split(" ")[1];
        handleToken(token, req, res, next);
    }
};

// 3
const handleToken = (token, req, res, next) => {
    try {
        const decoded = jwt.verify(token, jwt_secret);
        req.user = decoded;
        return validateRole(req, res, next);
    } catch (error) {
        return res.status(403).json({
            status: "Expired",
            message: "A valid token is required for this process",
        });
    }
};

// 4
const validateRole = (req, res, next) => {
    if (req.user.role >= req.neededRole) {
        return next();
    }

    return res.status(403).json({
        status: "Insuficient permissions",
        message: "A superior role is required for this action",
    });
};

module.exports = {
    isRegular,
    isAdmin,
    isEditor,
};
