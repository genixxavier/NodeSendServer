const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.newUsuario = async (req, res) => {
    //mostrar msj de error de express validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }
    //verificar si ya el usuario ya estuvo registrado
    const { email, password } = req.body;
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
        return res.status(400).json({ msg: "El usuario ya esta registrado" });
    }
    //new user
    usuario = new Usuario(req.body);
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    try {
        await usuario.save();
        res.json({ msg: "Usuario creado correctamente" });
    } catch (error) {
        console.log(error);
    }
};
