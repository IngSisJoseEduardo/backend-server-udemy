// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// importat rutas
var appRoutes = require('./routes/app');
var usuariosRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
// Inicializar variables
var app = express();

// Body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


// conexion a la abase de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err, res)=> {
 if( err ) throw err;
console.log('BAse de datos: \x1b[32m%s\x1b[0m',' online');
});

//Rutas
app.use('/usuario', usuariosRoutes);
app.use('/login', loginRoutes);
app.use('/',appRoutes);

// Escuchar peticiones
app.listen(3000, () =>{ console.log('Express server escuchando en el puerto 3000 \x1b[32m%s\x1b[0m',' online')});