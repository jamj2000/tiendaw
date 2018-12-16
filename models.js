const mongoose = require('mongoose');

const Cliente  = mongoose.model('Cliente', { nombre: String, apellidos: String });
const Articulo = mongoose.model('Articulo',{ nombre: String, precio: Number });


// module.exports = Cliente;

module.exports =  {
    Cliente,
    Articulo
};
