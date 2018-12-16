const path     = require('path');
const express  = require('express');
const mongoose = require('mongoose');
const routes   = require('./routes');
const config   = require('./config');

const app      = express();

mongoose.connect(config.db_uri, { useNewUrlParser: true })
  .then(db   => console.log ('Conexión correcta a la BD'))
  .catch(err => console.log ('Error en la conexión a la BD'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, '/public')));

// Middleware
app.use(express.json());

// Rutas
app.use ('/api',  routes);

app.use ("/aa", (req, res) => { res.redirect("/")});
// Servidor
app.listen (config.port, () => console.log(`Servidor iniciado en puerto ${config.port}`));
