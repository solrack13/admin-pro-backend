require('dotenv').config();
const express = require('express');
const cors = require('cors')

//Crear el servidor de express
const app = express();
const { dbConnection} = require('./database/config');

// Configurar CORS
app.use(cors());

// Lectura y parseo del body
app.use( express.json());

// Base de datos
dbConnection();

//Rutas
app.use( '/api/usuarios', require('./routes/usuarios'));
app.use( '/api/login', require('./routes/auth'));
// Rutas

app.listen( process.env.PORT, () => {
    console.log(' Servidor corriendo en puerto ' + process.env.PORT);
});