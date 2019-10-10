var express        = require('express');
var busquedaRoutes = express();
const HOSPITAL     = require('../models/hospital');
const MEDICO       = require('../models/medico');
const USUARIO      = require('../models/usuario');


/*
* ======================================
* ==Busqueda espesifica
* ======================================
*/
busquedaRoutes.get('/coleccion/:tabla/:busqueda',(req, res) => {
    const tabla = req.params.tabla;
    console.log(tabla);
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda,'i');
    let promesa;

    switch (tabla) {
        case 'hospitales':
               promesa = buscarHospitales(busqueda,regex);
            break;
        case 'medicos':
               promesa = buscarMedicos(busqueda,regex);
            break;
        case 'usuarios':
               promesa = buscarUsuarios(busqueda,regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son: Usuarios, Hosiptales y Medicos',
                error: {message: 'Tipo de tabla/ coleccion no valida'}
            });
    }

    promesa.then( data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });

});

/*
* ======================================
* ==Busqueda gral
* ======================================
*/
busquedaRoutes.get('/todo/:busqueda',(req, res, next)=> {
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda,regex)
    ]).then( respuestas => {
        res.status(200).json({
            ok:true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    }).catch( err => {

    });
});


function buscarHospitales(busqueda, regEx){
    return new Promise((resolve, reject)=> {
        HOSPITAL.find({nombre: regEx})
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
            if ( err ) {
                reject('error al cargar hospitales. Error: ', err);
            } else {
                resolve( hospitales );
            }
        });
    });
}
function buscarMedicos(busqueda, regEx){
    return new Promise((resolve, reject)=> {
        MEDICO.find({nombre: regEx})
            .populate('usuario','nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
            if ( err ) {
                reject('error al cargar hospitales. Error: ', err);
            } else {
                resolve( medicos );
            }
        });
    });
}
function buscarUsuarios(busqueda, regEx){
    return new Promise((resolve, reject)=> {
        USUARIO.find({},'nombre email role')
            .or([{nombre: regEx}, {email: regEx}])
            .exec((err, usuarios) => {
                if( err ) {
                    reject('error al cargar el usuario. Error', err)
                } else {
                    resolve(usuarios);
                }
            });
    });
}


module.exports = busquedaRoutes;