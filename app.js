// Requires
var express    = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');


// importat rutas
var appRoutes      = require('./routes/app');
var usuariosRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes   = require('./routes/medico');
var loginRoutes    = require('./routes/login');
var busquedaRoutes = require('./routes/busqueda');
var uploadreoutes  = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');
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
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadreoutes);
app.use('/img', imagenesRoutes);

app.use('/',appRoutes);

// Escuchar peticiones
app.listen(3000, () =>{ console.log('Express server escuchando en el puerto 3000 \x1b[32m%s\x1b[0m',' online')});