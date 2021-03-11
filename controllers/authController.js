const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({
    path: "variables.env",
});
const { validationResult } = require("express-validator");

exports.autenticarUsuario = async (req, res, next) => {
    //mostrar msj de error de express validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    //buscar el usuario para si esta registrado
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
        res.status(401).json({ msg: "El usuario no existe" });
        return next();
    }

    // verificar le password y autenticar el usuario
    if (bcrypt.compareSync(password, usuario.password)) {
        //crear JWT
        const token = jwt.sign(
            {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
            },
            process.env.SECRETA,
            {
                expiresIn: "8h",
            }
        );

        res.json({ token });
    } else {
        res.status(401).json({ msg: "password Incorrecto" });
        return next();
    }
};

exports.usuarioAutenticado = async (req, res) => {
    res.json({ usuario: req.usuario });
};
