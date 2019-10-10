var express      = require('express');
var uploadRoutes = express();
const fileUpload = require('express-fileupload');
const USUARIO    = require('../models/usuario');
const MEDICO     = require('../models/medico');
const HOSPITAL   = require('../models/hospital');
var fs           = require('fs');
// default options
uploadRoutes.use(fileUpload());


uploadRoutes.put('/:tipo/:iduser',(req, res) => {

    var tipo   = req.params.tipo;
    var id = req.params.iduser;

    // tipos de coleccion
    var tiposValidos = ['medicos','usuarios','hospitales'];

    if( tiposValidos.indexOf(tipo) < 0 ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no valida',
            error: {message: 'Debes indicar una coleccion valida las cuales son: ' + tiposValidos.join(', ')}
        });
    }

    if(!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciona nada',
            error: {message: 'Debe seleccionarla iamgen'}
        });
    }

    // OBTENER EL NOMBRE DEL ARCHVO
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extension = nombreCortado[nombreCortado.length - 1];

    // EXTENSIONES PERMITIDAS
    var extensionesValidas = ['png','jpg','gif','jpeg'];

    if( extensionesValidas.indexOf(extension) < 0 ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            error: {message: 'Las extensiones validas son: ' + extensionesValidas.join(', ')},
            extension
        });
    }

    // NOMBRE DE ARCHIVO PERSONALIZADO IDUSUARIO+NUMRANDOM+EXT.
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // MOVER EL ARCHIVO DEL TEMPORAL A UN PATH ESPESIFICO
    var path = `./upload/${ tipo }/${nombreArchivo}`;
    archivo.mv(path,(err) => {
        if( err ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al mover archivo',
                error: err
            });
        }
    });

    subirPorTipo(tipo,id,nombreArchivo, res);

});

function subirPorTipo(tipo,id,nombreArchivo, res) {
    switch (tipo) {
        case 'usuarios':
            imagneUsuario(id, nombreArchivo, res);
            break;
        case 'medicos':
            imagenMedico(id, nombreArchivo, res);
            break;
        case 'hospitales':
            imagenHospital(id, nombreArchivo, res);
            break;

        default:
            break;
    }
}

function imagneUsuario(id,nombreArchivo, res) {

    USUARIO.findById(id,(err, usuario)=> {
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario no existe',
                usuario: {message: 'Usuario no existe'}
            });
        }
        var pathOld = "./upload/usuarios/" + usuario.img;
        console.log(pathOld);
        // si existe elimina la imagen anterior
        if( fs.existsSync(pathOld) ){
            fs.unlinkSync( pathOld );
        }

        usuario.img = nombreArchivo;
        usuario.save((err, usuarioUpdate) => {
            return res.status(200).json({
                ok: true,
                mensaje: 'Imagne de usuario actualizada',
                usuario: usuarioUpdate
            });
        });

    });
}

function imagenMedico(id,nombreArchivo, res) {
    MEDICO.findById(id,(err, medico)=> {
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Medico no existe',
                medico: {message: 'Medico no existe'}
            });
        }
        var pathOld = "./upload/medicos/" + medico.img;
        console.log(pathOld);
        // si existe elimina la imagen anterior
        if( fs.existsSync(pathOld) ){
            fs.unlinkSync( pathOld );
        }

        medico.img = nombreArchivo;
        medico.save((err, medicoUpdate) => {
            return res.status(200).json({
                ok: true,
                mensaje: 'Imagne de usuario actualizada',
                medico: medicoUpdate
            });
        });

    });
}
function imagenHospital(id,nombreArchivo, res) {
    HOSPITAL.findById(id,(err, hospital)=> {
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Hospital no existe',
                hospital: {message: 'Hospital no existe'}
            });
        }
        var pathOld = "./upload/hospitales/" + hospital.img;
        console.log(pathOld);
        // si existe elimina la imagen anterior
        if( fs.existsSync(pathOld) ){
            fs.unlinkSync( pathOld );
        }

        hospital.img = nombreArchivo;
        hospital.save((err, hospitalUpdate) => {
            return res.status(200).json({
                ok: true,
                mensaje: 'Imagne de usuario actualizada',
                hospital: hospitalUpdate
            });
        });

    });
}

module.exports = uploadRoutes;