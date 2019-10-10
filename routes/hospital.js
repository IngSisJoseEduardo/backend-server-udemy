var express = require('express');
var hospitalRoute = express();
var mdAutentication = require('../middlewares/autenticacion');
var HOSPITAL = require('../models/hospital');


hospitalRoute.get('/',(req, res) => {
    const numResult = 5;
    let desde = req.query.desde || 0;
    desde =  Number(desde);
    HOSPITAL.find({})
            .populate('usuario', 'nombre email')
            .skip(desde)
            .limit(numResult)
            .exec((err,hospitales) => {
                if(err){
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error en base de datos',
                        error: err
                    });
                }

                HOSPITAL.count({},(err,count) => {
                    res.status(200).json({
                        ok: true,
                        hospitales:hospitales,
                        total: count
                    });
                });
            });
});


hospitalRoute.post('/',mdAutentication.verificarToken,(req, res) => {
    let body = req.body;
    let usuario = req.usuario;
    let hospital = new HOSPITAL({
        nombre: body.nombre,
        img: body.img,
        usuario: usuario._id,
    });

    hospital.save((err,hospitalSave) => {
        if( err ) {
            return res.status(400).json({
                ok: false,
                msg: 'error al crear el hospital',
                err: err
            });
        }

        return res.status(201).json({
            ok:true,
            hospital: hospitalSave
        });
    });
});



hospitalRoute.put('/:id',mdAutentication.verificarToken,(req, res) => {
    let id = req.params.id;
    let body = req.body;

    HOSPITAL.findById(id, (err, hospital) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al actualizar hospital',
                err: err
            });
        }

        if( !hospital ) {
            return res.status(400).json({
                ok: false,
                msg: `No existe el usuario con el id ${id}`,
                errors: { message: 'No existe un usuario con ese ID'}
            });
        }

        hospital.nombre = body.nombre;
        hospital.img = body.img;
        // hospital.nombre = body.usuario;

        hospital.save((errr, hospitalSave) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Error al actiualizar el usuario',
                    err: err
                });
            }

            return res.status(200).json({
                ok: true,
                hospital: hospitalSave
            });
        });
    });
});


hospitalRoute.delete('/:id',mdAutentication.verificarToken,(req, res) => {
    let id = req.params.id;
    HOSPITAL.findByIdAndRemove(id,(err, hospital) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                msg: 'Error al borrar el hospital',
                err: err
            });
        }

        if( !hospital ) {
             return res.status(400).json({
                ok: false,
                msg: `No exites el hospital con el ID ${id}`,
                err: {message: 'No existe el hospital con ese ID'}
            });
        }

        return res.status(200).json({
            ok: true,
            hospital: hospital
        });
    });
});

module.exports = hospitalRoute;