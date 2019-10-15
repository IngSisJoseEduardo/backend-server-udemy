// plugins
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
// inicializar
var app = express();

// modelos
var USAURIO = require('../models/usuario');

// google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
/*
* ======================================
* ==Autenticación google
* ======================================
*/
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }
}

app.post('/google', async (req, res) => {

    const token = req.body.token;
    let googleUser = await verify(token)
    .catch(err => {
        res.status(403).json({
            ok:false,
            mensaje: 'token no valido'
        });
    });

    USAURIO.findOne({email: googleUser.email },(err, usuarioDB) => {
        if( err ) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al buscar usaurio',
                errors: err
            });
        }

        if( usuarioDB ) {
            if( usuarioDB.google === false ) {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Debe de usar su autenticación normal',
                });
            } else {
                var token = jwt.sign({ usuario: usuario},SEED , {expiresIn: 14400});
                return res.status(200).json({
                    ok:true,
                    usuario: usuarioDB,
                    token,
                    id: usuarioDB.id,
                });
            }
        } else {
            // el usuario no existe hay que crearlo
            let usuario = new USAURIO();
            usuario.nombre   = googleUser.nombre;
            usuario.email    = googleUser.email;
            usuario.img      = googleUser.img;
            usuario.google   = true;
            usuario.password = ':)';
            usuario.save((err, usuarioSave) => {
                if( err ) {
                    return res.status(500).json({
                        ok:false,
                        mensaje: 'Error al guardar usuario',
                        errors: err
                    });
                }

                var token = jwt.sign({ usuario: usuarioSave},SEED , {expiresIn: 14400});
                return res.status(200).json({
                    ok:true,
                    usuario: usuarioSave,
                    token,
                    id: usuarioSave.id,
                });
            });
        }
    });
});

/*
* ======================================
* ==Autenticación normal
* ======================================
*/
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