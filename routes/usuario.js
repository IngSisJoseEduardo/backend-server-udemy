var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');
var USUARIO = require('../models/usuario');
var mdAutentication = require('../middlewares/autenticacion');
/*
* ======================================
* ==Lista todos los usuarios
* ======================================
*/
app.get('/', (req, res, next) => {

    USUARIO.find({}, 'nombre email img role')
            .exec(
                (err, usuarios)=> {
                if( err){
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error en base de datos',
                        error: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });
            });
});


/*
* ======================================
* ==Crea un nuevo usuario
* ======================================
*/

app.post('/', mdAutentication.verificarToken ,(req, res) => {
    var body = req.body;
    var usuario = new USUARIO({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10 ),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioSave) => {
        if(err) {
            return res.status(400).json({
                ok:false,
                mensaje: 'Error al crear usuario',
                error: err
            });
        }

        return res.status(201).json({
            ok:true,
            usuario: usuarioSave,
            usuarioToken: req.usuario
        });
    });
});

/*
* ======================================
* ==Actualizar usuario
* ======================================
*/

app.put('/:id', mdAutentication.verificarToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;


    USUARIO.findById(id, (err, usuario) => {
        if( err ) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al buscar el usuario',
                errors: err
            });
        }
        if( !usuario ) {
            return res.status(400).json({
                ok: false,
                mensaje: `Usuario con ${id} no existe`,
                errors: { message: 'No existe un usuario con ese ID'}
            });
        }
        usuario.nombre = body.nombre;
        usuario.email  = body.email;
        usuario.role   = body.role;
        usuario.save((err, usuarioSave) => {
            if( err ) {
                return res.status(400).json({
                    ok:false,
                    mensaje: 'Error ala ctualizar usuario',
                    errors: err
                });
            }
            usuarioSave.password = ':)'
            return res.status(200).json({
                ok:true,
                usuario: usuarioSave
            });
        });

    });
});

/*
* ======================================
* ==Borrar un usuario por el ID
* ======================================
*/

app.delete('/:id', mdAutentication.verificarToken,(req, res)=> {
    var id = req.params.id;
    USUARIO.findByIdAndRemove(id,( err, usuarioBorrado ) => {
        if( err ) {
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if( !usuarioBorrado ) {
            return res.status(400).json({
                ok:false,
                mensaje: 'no existe un usuario con ese ID',
                errors: {message: 'No existe unusauri con ese ID '}
            });
        }

        return res.status(200).json({
            ok:true,
            usuario: usuarioBorrado
        });
    });
});
module.exports = app;