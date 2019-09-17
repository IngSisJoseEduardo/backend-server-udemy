// plugins
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
// inicializar
var app = express();

// modelos
var USAURIO = require('../models/usuario');

app.post('/', (req, res) => {
    var body = req.body;

    USAURIO.findOne({email: body.email},(err, usuario) => {

        if( err ) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al buscar usaurio',
                errors: err
            });
        }

        if( !usuario ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email ',
                errors: err
            });
        }

        if( !bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password ',
                errors: err
            });
        }

        // crear un token
        usuario.password = 'XD';
        var token = jwt.sign({ usuario: usuario},SEED , {expiresIn: 14400});
        return res.status(200).json({
            ok:true,
            usuario,
            token,
            id: usuario.id,
        });
    });
});

module.exports = app;