const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { check } = require("express-validator");

router.post(
    "/",
    [
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("email", "Agrege email valido").isEmail(),
        check(
            "password",
            "El password debe ser de almenos 6 caracteres"
        ).isLength({ min: 6 }),
    ],
    usuarioController.newUsuario
);

module.exports = router;
