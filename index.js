const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors");
//crear servidor
const app = express();

//conecta a base de datos
conectarDB();

//habilar cros
const optionsCors = {
    origin: process.env.FRONTED_URL,
};
app.use(cors(optionsCors));

const port = process.env.PORT || 4000;
//habilar leer las valores de un body
app.use(express.json());

//habiltyar carpeta publica
app.use(express.static("uploads"));

//rutas app
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/enlaces", require("./routes/enlaces"));
app.use("/api/archivos", require("./routes/archivos"));

app.listen(port, "0.0.0.0", () => {
    console.log("El servidor esta funcionando");
});
