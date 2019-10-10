var express = require('express');
var medicoRoutes = express();
var mdAutentication = require('../middlewares/autenticacion');
var MEDICO = require('../models/medico');


medicoRoutes.get('',(req, res) => {
    const numResult = 5;
    let desde = req.query.desde || 0;
    desde = Number(desde);
    MEDICO.find({})
        .populate('usuario','nombre email')
        .populate('hospital')
        .skip(desde)
        .limit(numResult)
        .exec((err, medicos) => {
            if( err ) {
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al consultar los medicos',
                    err: err
                });
            }

            if( !medicos ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No se econtraron medicos'
                });
            }

            MEDICO.count({},(err, count) => {
                return res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: count
                });
            });
        });
});

medicoRoutes.post('',mdAutentication.verificarToken,(req, res) => {
    let usuario = req.usuario;
    let body = req.body;

    let medico = new MEDICO({
        nombre: body.nombre,
        usuario: usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoSave) => {
        if( err ) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al crear usuario',
                err: err
            });
        }

        return res.status(200).json({
            ok: true,
            medico: medicoSave
        });
    });

});

medicoRoutes.put('/:id',mdAutentication.verificarToken,(req, res) => {
    let id = req.params.id;
    let body = req.body;

    MEDICO.findById(id,(err,medico) => {
        if( err ) {
            return res.status(500).json({
                ok:false,
                msg:'Error en base de datos',
                err: err
            });
        }

        if( !medico ) {
            return res.status(401).json({
                ok: false,
                msg: `No existe el medico con el id ${id}`,
                err: {message: 'No se encontro el medico con el ID'}
            });
        }

        medico.nombre = body.nombre;
        medico.usaurio = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoSave) => {
            if( err ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No se pudo actualizar el medico',
                    err: err
                });
            }

            return res.status(200).json({
                ok: true,
                medico: medicoSave
            });
        });
    });
});

medicoRoutes.delete('/:id',mdAutentication.verificarToken,(req, res) => {
    let id = req.params.id;

    MEDICO.findByIdAndRemove(id,(err, medico) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                msg: 'error en base de datos',
                err: err
            });
        }

        if( !medico ) {
            return res.status(400).json({
                ok: false,
                msg: `No existe el medico con el id ${id}`,
                err: { message: 'No existe el medico con ese ID'}
            });
        }

        return res.status(200).json({
            ok: true,
            medico: medico
        });
    });
});

module.exports = medicoRoutes;