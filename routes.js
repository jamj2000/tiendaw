const express = require('express');
const { Cliente, Articulo } = require('./models');

const router = express.Router();


//============================
// CLIENTES
//============================

// ver todos los Clientes
router.get('/clientes', function (req, res) {
    Cliente.find({}, (err, data) => {
        if (err) res.json({ error: err });
        else     res.json(data);
    });
});


// ver un Cliente
router.get('/clientes/:id', (req, res) => {
    Cliente.findOne({ _id: req.params.id }, (err, data) => {
        if (err) res.json({ error: err });
        else     res.json(data);
    });
});


// eliminar un Cliente
router.delete('/clientes/:id', (req, res) => {
    Cliente.findOneAndRemove({ _id: req.params.id }, (err, data) => {
        if (err) res.json({ error: err });
        else     res.json(data);
    });
});


// actualizar un Cliente
router.put('/clientes/:id', (req, res) => {
    Cliente.findOneAndUpdate({ _id: req.params.id }, { $set: { nombre: req.body.nombre, apellidos: req.body.apellidos } }, (err, data) => {
        if (err) res.json({ error: err });
        else     res.json(data);
    });
});


// insertar un Cliente
router.post('/clientes', (req, res) => {
    const cliente = new Cliente({ nombre: req.body.nombre, apellidos: req.body.apellidos });
    cliente.save((err, data) => {
        if (err) res.json({ error: err });
        else     res.json(data);
    });
});


//============================
// ARTÍCULOS
//============================

// ver todos los articulos
router.get('/articulos', function (req, res) {
    Articulo.find({}, (err, data) => {
        if (err) res.json({ error: err });
        else     res.json(data);
    });
});


// ver un articulo
router.get('/articulos/:id', (req, res) => {
    Articulo.findOne({ _id: req.params.id }, (err, data) => {
        if (err) res.json({ error: err });
        else     res.json(data);
    });
});


// eliminar un articulo
router.delete('/articulos/:id', (req, res) => {
    Articulo.findOneAndRemove({ _id: req.params.id }, (err, data) => {
        if (err) res.json({ error: err });
        else     res.json(data);
    });
});


// actualizar un articulo
router.put('/articulos/:id', (req, res) => {
    Articulo.findOneAndUpdate({ _id: req.params.id }, { $set: { nombre: req.body.nombre, precio: req.body.precio } }, (err, data) => {
        if (err) res.json({ error: err });
        else     res.json(data);
    });
});

// insertar un articulo
router.post('/articulos', (req, res) => {
    const articulo = new Articulo({ nombre: req.body.nombre, precio: req.body.precio });

    articulo.save((err, data) => {
        if (err) res.json({ error: err });
        else     res.json(data);
    });
});



module.exports = router;
