const Enlaces = require("../models/Enlace");
const shortid = require("shortid");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.nuevoEnlace = async (req, res, next) => {
    //revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    //almacenar datos
    const { nombre_original, nombre } = req.body;
    const enlace = new Enlaces();
    enlace.url = shortid.generate();
    enlace.nombre = nombre;
    enlace.nombre_original = nombre_original;

    //si el usuario esta authenticado
    if (req.usuario) {
        const { password, descargas } = req.body;

        if (descargas) {
            enlace.descargas = descargas;
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash(password, salt);
        }

        enlace.autor = req.usuario.id;
    }
    try {
        await enlace.save();
        return res.json({ msg: `${enlace.url}` });
        next();
    } catch (error) {
        console.log(error);
    }
};

exports.allEnlaces = async (req, res, next) => {
    try {
        const enlaces = await Enlaces.find({}).select("url -_id");
        res.json({ enlaces });
    } catch (error) {
        console.log(error);
    }
};

exports.tienePassword = async (req, res, next) => {
    const { url } = req.params;
    //verificar si exite la url
    const enlace = await Enlaces.findOne({ url });

    if (!enlace) {
        res.status(404).json({ msg: "Enlace no existe" });
        return next();
    }

    if (enlace.password) {
        return res.json({
            password: true,
            enlace: enlace.url,
            archivo: enlace.nombre,
        });
    }

    next();
};

exports.verificarPassword = async (req, res, next) => {
    const { url } = req.params;
    const { password } = req.body;
    //consultar enblace
    const enlace = await Enlaces.findOne({ url });

    //verificamos el password
    if (bcrypt.compareSync(password, enlace.password)) {
        //permite descargar archivo
        next();
    } else {
        return res.status(401).json({ msg: "Password Incorrecto" });
    }
};

//Obtener el enlace
exports.obtenerEnlace = async (req, res, next) => {
    const { url } = req.params;
    //verificar si exite la url
    const enlace = await Enlaces.findOne({ url });

    if (!enlace) {
        res.status(404).json({ msg: "Enlace no existe" });
        return next();
    }

    //si existe
    res.json({ archivo: enlace.nombre, password: false });

    next();
};
