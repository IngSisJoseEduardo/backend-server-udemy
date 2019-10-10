var express       = require('express');
var imagenesRoute = express();
const path          = require('path');
const fs = require('fs');

// Rutas
imagenesRoute.get('/:tipo/:img',(req, res, next ) =>{
    // se obtienen los datos del tio y nombre de la imagen
    var tipo = req.params.tipo;
    var img = req.params.img;

    // se contrulle el path de la imagen segun el tipo
    var pathImage = path.resolve(__dirname, `../upload/${ tipo }/${ img }`);
    // se verifica si existe la imagen y se manda como respuesta
    if ( fs.existsSync(pathImage) ) {
        res.sendFile( pathImage );
    } else {
        // si no existe se envia la imagen por defecto
        var pathNoImg = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile( pathNoImg );
    }
});

module.exports = imagenesRoute;