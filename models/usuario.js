var mongoose        = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema          = mongoose.Schema;

 var roles_validos = {
     values: ['ADMIN_ROLE','USER_ROLE'],
     message: '{VALUE} no es un rol valido'
 };

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario']},
    email: { type: String, unique: true  , required: [true, 'El correo es necesario']},
    password: { type: String, required: [true, 'La contraseña es necesaria']},
    img: { type: String, required: false},
    role: { type: String, required: true , default: 'USER_ROLE', enum: roles_validos},

});

usuarioSchema.plugin( uniqueValidator, {message: ' {PATH} debe de ser unico'});

/**
 * el primer argumento corresponde al nombre de la coleccion en mongoose
 * el segundo argumento corresponde al al modelo en node
 */
module.exports = mongoose.model('Usuario', usuarioSchema );